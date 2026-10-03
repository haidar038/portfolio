import { useCallback, useEffect, useRef, useState } from "react";
import { useClippy } from "@react95/clippy";
import { useI18n } from "../../i18n/useI18n";
import { playSound, setSoundsMuted, areSoundsMuted } from "../../lib/sound";

interface ChatMsg {
  from: "clippy" | "user";
  text: string;
}

const IDLE_MS = 25000;
const SCROLL_COOLDOWN_MS = 60000;
const CLICK_MAX_DIST_PX = 6;
const CLICK_MAX_MS = 400;
const HOME_MARGIN_PX = 16;
const FETCH_TIMEOUT_MS = 9000;

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** Agent element lives behind a private field — feature-detect, never assume. */
function agentEl(clippy: unknown): HTMLElement | undefined {
  try {
    const el = (clippy as { _el?: unknown })._el;
    return el instanceof HTMLElement ? el : undefined;
  } catch {
    return undefined;
  }
}

function homePos(el?: HTMLElement): { x: number; y: number } {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const ew = el?.offsetWidth || 120;
  const eh = el?.offsetHeight || 100;
  return {
    x: Math.max(8, w - ew - HOME_MARGIN_PX),
    y: Math.max(8, h - eh - HOME_MARGIN_PX),
  };
}

/**
 * Clippy hybrid assistant: @react95/clippy body + Gemini brain via /api/clippy.
 * The character itself is the trigger: click returns it home, then opens chat.
 * Static triggers work offline; chat input calls the backend when available.
 */
export default function ClippyAssistant() {
  const { clippy } = useClippy();
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(areSoundsMuted());
  const greeted = useRef(false);
  const lastScrollHint = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const userAbortedRef = useRef(false);
  const localeRef = useRef(locale);
  localeRef.current = locale;
  const openRef = useRef(open);
  openRef.current = open;

  const say = useCallback(
    (text: string, animation?: string) => {
      setMessages((m) => [...m.slice(-19), { from: "clippy", text }]);
      // Chat open: history only, no balloon (avoids double UI).
      if (openRef.current) {
        playSound("speak", 0.15);
        return;
      }
      try {
        if (animation && clippy?.hasAnimation?.(animation)) clippy.play(animation);
        clippy?.speak(text, false);
        playSound("speak", 0.2);
      } catch {
        /* visual only */
      }
    },
    [clippy],
  );

  const goHome = useCallback(() => {
    if (!clippy) return;
    try {
      const el = agentEl(clippy);
      const { x, y } = homePos(el);
      if (reducedMotion()) {
        if (el) {
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
        }
        return;
      }
      clippy.moveTo(x, y, 500);
    } catch {
      /* stays where it is */
    }
  }, [clippy]);

  const openChat = useCallback(() => {
    goHome();
    setOpen(true);
    setCollapsed(false);
    playSound("click", 0.25);
  }, [goHome]);

  // Character click (not drag) → home + open chat.
  useEffect(() => {
    if (!clippy) return;
    const el = agentEl(clippy);
    if (!el) return;
    el.style.cursor = "pointer";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    let sx = 0;
    let sy = 0;
    let st = 0;
    const down = (e: PointerEvent) => {
      sx = e.clientX;
      sy = e.clientY;
      st = Date.now();
    };
    const up = (e: PointerEvent) => {
      const moved = Math.hypot(e.clientX - sx, e.clientY - sy);
      if (moved <= CLICK_MAX_DIST_PX && Date.now() - st <= CLICK_MAX_MS) {
        openChat();
      }
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openChat();
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("keydown", key);
    };
  }, [clippy, openChat]);

  // Greeting on load (static, works offline)
  useEffect(() => {
    if (!clippy || greeted.current) return;
    greeted.current = true;
    const timer = setTimeout(() => {
      if (!reducedMotion()) clippy.play("Greeting");
      say(t("clippy.greeting"));
    }, 1500);
    return () => clearTimeout(timer);
  }, [clippy, say, t]);

  // Idle nudge (static text, no API cost)
  useEffect(() => {
    if (!clippy) return;
    let timer: number | undefined;
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (document.hidden || reducedMotion()) return;
        try {
          clippy.play("GetAttention");
        } catch {
          /* ignore */
        }
        say(t("clippy.idle"));
      }, IDLE_MS);
    };
    reset();
    window.addEventListener("pointermove", reset, { passive: true });
    window.addEventListener("keydown", reset);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [clippy, say, t]);

  // Scroll hints for #projects / #guestbook (static, cooldown)
  useEffect(() => {
    if (!clippy) return;
    const onScroll = () => {
      const now = Date.now();
      if (now - lastScrollHint.current < SCROLL_COOLDOWN_MS) return;
      const y = window.scrollY + window.innerHeight / 2;
      const pick = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const mid = r.top + window.scrollY + r.height / 2;
        return Math.abs(mid - y) < window.innerHeight / 2;
      };
      if (pick("projects")) {
        lastScrollHint.current = now;
        say(t("clippy.projectsHint"), "GestureRight");
      } else if (pick("guestbook")) {
        lastScrollHint.current = now;
        say(t("clippy.guestbookHint"), "GestureRight");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [clippy, say, t]);

  // Abort in-flight request on unmount.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m.slice(-19), { from: "user", text }]);
    setBusy(true);
    userAbortedRef.current = false;
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    try {
      clippy?.play("Thinking");
    } catch {
      /* ignore */
    }
    try {
      const res = await fetch("/api/clippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text.slice(0, 500),
          locale: localeRef.current,
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = typeof data.reply === "string" ? data.reply : "";
      if (!reply) throw new Error("empty");
      say(reply);
    } catch {
      // User abort stays silent; failures show the retro fallback line.
      if (!userAbortedRef.current) say(t("clippy.fallback"));
    } finally {
      clearTimeout(timer);
      if (abortRef.current === ctrl) abortRef.current = null;
      setBusy(false);
      try {
        clippy?.stop();
      } catch {
        /* ignore */
      }
    }
  }, [input, busy, clippy, say, t]);

  const abort = useCallback(() => {
    userAbortedRef.current = true;
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
    try {
      clippy?.stop();
    } catch {
      /* ignore */
    }
    playSound("error", 0.2);
  }, [clippy]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setSoundsMuted(next);
  };

  if (!open) return null;

  return (
    <div className="clippy-scope fixed z-[70] right-3 bottom-3 w-80 max-w-[calc(100vw-1.5rem)] border-2 border-retro-border-mid bg-retro-winface shadow-[2px_2px_0px_#000]">
      <div className="flex items-center justify-between px-1.5 py-0.5 bg-linear-to-r from-[#000080] to-[#1084d0] select-none">
        <span className="text-white text-xs font-bold">📎 {t("clippy.chatTitle")}</span>
        <div className="flex gap-0.5">
          <button
            data-no-retro
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? t("clippy.restore") : t("clippy.minimize")}
            className="w-4 h-4 bg-retro-winface text-[10px] leading-none flex items-center justify-center cursor-pointer border border-retro-border-mid"
          >
            {collapsed ? "□" : "_"}
          </button>
          <button
            data-no-retro
            onClick={toggleMute}
            aria-label={muted ? t("clippy.unmute") : t("clippy.mute")}
            className="w-4 h-4 bg-retro-winface text-[10px] leading-none flex items-center justify-center cursor-pointer border border-retro-border-mid"
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <button
            data-no-retro
            onClick={() => setOpen(false)}
            aria-label={t("clippy.close")}
            className="w-4 h-4 bg-retro-winface text-[10px] leading-none flex items-center justify-center cursor-pointer border border-retro-border-mid"
          >
            ✕
          </button>
        </div>
      </div>
      {!collapsed && (
        <>
          <div className="h-56 overflow-y-auto bg-retro-yellow-bg p-1.5 text-xs leading-normal space-y-1">
            {messages.length === 0 && (
              <p className="text-[#666633]">{t("clippy.greeting")}</p>
            )}
            {messages.map((m, i) => (
              <p
                key={i}
                className={
                  m.from === "clippy" ? "text-black" : "text-right text-retro-blue-dark"
                }
              >
                <b>{m.from === "clippy" ? "📎 " : "You: "}</b>
                {m.text}
              </p>
            ))}
            {busy && <p className="text-[#666633] blink">…</p>}
          </div>
          <div className="flex gap-1 p-1.5 border-t border-retro-border-mid">
            <input
              data-no-retro
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void send();
              }}
              placeholder={t("clippy.chatPlaceholder")}
              maxLength={500}
              className="flex-1 min-w-0 border-2 border-inset border-[#808080] bg-white px-1.5 py-1 text-xs outline-none"
            />
            {busy ? (
              <button
                onClick={abort}
                className="retro-btn px-2 py-0.5 text-xs cursor-pointer font-bold"
              >
                {t("clippy.abort")}
              </button>
            ) : (
              <button
                onClick={() => void send()}
                disabled={!input.trim()}
                className="retro-btn px-2 py-0.5 text-xs cursor-pointer font-bold disabled:opacity-50"
              >
                {t("clippy.send")}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
