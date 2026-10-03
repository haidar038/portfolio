import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useClippy } from "@react95/clippy";
import { useI18n } from "../../i18n/useI18n";
import { playSound, setSoundsMuted, areSoundsMuted, startProcessing, stopLoops } from "../../lib/sound";

interface ChatMsg {
  from: "clippy" | "user";
  text: string;
}

const IDLE_MS = 25000;
const SCROLL_COOLDOWN_MS = 60000;
const CLICK_MAX_DIST_PX = 6;
const CLICK_MAX_MS = 400;
const HOME_MARGIN_PX = 16;
const PANEL_GAP_PX = 12;
const DOCK_MS = 400;
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

/** Keep the library's drag loop aligned with positions applied by this component. */
function setAgentPosition(clippy: unknown, el: HTMLElement, x: number, y: number) {
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  // @react95/clippy reuses these cached coordinates on the next mousedown.
  // Our docking animation writes directly to the element, so refresh them too.
  try {
    if (!clippy || typeof clippy !== "object") return;
    const dragState = clippy as { _targetX?: number; _targetY?: number };
    if ("_targetX" in dragState) dragState._targetX = x;
    if ("_targetY" in dragState) dragState._targetY = y;
  } catch {
    /* Optional library internals; the visual position is already updated. */
  }
}

function agentSize(el?: HTMLElement): { w: number; h: number } {
  return { w: el?.offsetWidth || 120, h: el?.offsetHeight || 100 };
}

/** Chat closed: agent rests at bottom-right (dev-status position). */
function closedAnchor(el?: HTMLElement): { x: number; y: number } {
  const { w: ew, h: eh } = agentSize(el);
  return {
    x: Math.max(8, window.innerWidth - ew - HOME_MARGIN_PX),
    y: Math.max(8, window.innerHeight - eh - HOME_MARGIN_PX),
  };
}

/** Chat open: agent docks above the panel. Panel height measured live. */
function openAnchor(el?: HTMLElement, panel?: HTMLElement | null): { x: number; y: number } {
  const { w: ew, h: eh } = agentSize(el);
  const ph = panel?.offsetHeight || 320;
  return {
    x: Math.max(8, window.innerWidth - ew - HOME_MARGIN_PX),
    y: Math.max(8, window.innerHeight - eh - ph - HOME_MARGIN_PX - PANEL_GAP_PX),
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
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [muted, setMuted] = useState(areSoundsMuted());
  const greeted = useRef(false);
  const lastScrollHint = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const userAbortedRef = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const moveTokenRef = useRef(0);
  const draggedRef = useRef(false);
  const suppressClickUntilRef = useRef(0);
  const localeRef = useRef(locale);
  const openRef = useRef(open);

  useEffect(() => {
    if (rateLimitUntil === null) return;

    const updateCooldown = () => {
      const remaining = Math.max(
        0,
        Math.ceil((rateLimitUntil - Date.now()) / 1000),
      );
      setCooldownSeconds(remaining);
      if (remaining === 0) setRateLimitUntil(null);
    };

    const timer = window.setInterval(updateCooldown, 1000);
    return () => window.clearInterval(timer);
  }, [rateLimitUntil]);

  useLayoutEffect(() => {
    localeRef.current = locale;
    openRef.current = open;
  }, [locale, open]);

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

  /**
   * Owned glide: single-flight by token, so rapid toggles can never stack
   * competing loops (the lib's queued moveTo blinked between targets).
   * Clears the lib queue first so no stale move fires mid-glide.
   */
  const glideTo = useCallback(
    (pos: { x: number; y: number }, instant = false) => {
      if (!clippy) return;
      const token = ++moveTokenRef.current;
      let el: HTMLElement | undefined;
      try {
        clippy.stop();
        el = agentEl(clippy);
        if (!el) return;
      } catch {
        return;
      }
      if (reducedMotion() || instant) {
        setAgentPosition(clippy, el, pos.x, pos.y);
        return;
      }
      const rect = el.getBoundingClientRect();
      const sx = rect.left;
      const sy = rect.top;
      const start = performance.now();
      const swing = (p: number) => 0.5 - Math.cos(p * Math.PI) / 2;
      const step = (now: number) => {
        if (moveTokenRef.current !== token) return;
        const progress = Math.min((now - start) / DOCK_MS, 1);
        const eased = swing(progress);
        setAgentPosition(
          clippy,
          el,
          sx + (pos.x - sx) * eased,
          sy + (pos.y - sy) * eased,
        );
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    [clippy],
  );

  const openChat = useCallback(() => {
    // Glide runs in the layout effect below, after the panel mounts
    // so openAnchor measures the live panel height.
    setOpen(true);
    setCollapsed(false);
    playSound("open", 0.5);
  }, []);

  const closeChat = useCallback(() => {
    setOpen(false);
    glideTo(closedAnchor(agentEl(clippy)));
    playSound("close", 0.5);
  }, [glideTo, clippy]);

  const toggleChat = useCallback(() => {
    if (openRef.current) closeChat();
    else openChat();
  }, [openChat, closeChat]);

  // Dock above the panel once it mounts / collapses (live height).
  useLayoutEffect(() => {
    if (!open || !clippy) return;
    glideTo(openAnchor(agentEl(clippy), panelRef.current));
  }, [open, collapsed, clippy, glideTo]);

  // Character click (not drag) toggles chat. Right-click never triggers.
  // Initial placement: bottom-right dev-status position, no animation.
  useEffect(() => {
    if (!clippy) return;
    const el = agentEl(clippy);
    if (!el) return;
    el.style.cursor = "pointer";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    glideTo(closedAnchor(el), true);
    let sx = 0;
    let sy = 0;
    let st = 0;
    const down = (e: PointerEvent) => {
      // The library's next drag tick writes its cached target coordinates,
      // which can still point at the last user-dragged position. Sync them
      // from the live element before its mousedown handler starts that tick.
      const rect = el.getBoundingClientRect();
      setAgentPosition(clippy, el, rect.left, rect.top);
      sx = e.clientX;
      sy = e.clientY;
      st = Date.now();
      draggedRef.current = false;
    };
    const move = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > CLICK_MAX_DIST_PX) {
        draggedRef.current = true;
      }
    };
    const up = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (draggedRef.current) {
        suppressClickUntilRef.current = Date.now() + 200;
        return;
      }
      if (Date.now() < suppressClickUntilRef.current) return;
      const moved = Math.hypot(e.clientX - sx, e.clientY - sy);
      if (moved <= CLICK_MAX_DIST_PX && Date.now() - st <= CLICK_MAX_MS) {
        toggleChat();
      }
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleChat();
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("keydown", key);
    };
  }, [clippy, toggleChat, glideTo]);

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

  // Abort in-flight request + loops on unmount.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopLoops();
    };
  }, []);

  // Viewport change while open → re-dock above the panel.
  useEffect(() => {
    if (!clippy) return;
    const onResize = () => {
      if (!openRef.current) return;
      glideTo(openAnchor(agentEl(clippy), panelRef.current), true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clippy, glideTo]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (
      !text ||
      busy ||
      cooldownSeconds > 0 ||
      (rateLimitUntil !== null && rateLimitUntil > Date.now())
    ) return;
    setInput("");
    setMessages((m) => [...m.slice(-19), { from: "user", text }]);
    setBusy(true);
    playSound("send", 0.5);
    userAbortedRef.current = false;
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    try {
      clippy?.play("Thinking");
    } catch {
      /* ignore */
    }
    startProcessing();
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
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get("Retry-After"));
        const seconds =
          Number.isFinite(retryAfter) && retryAfter > 0
            ? Math.ceil(retryAfter)
            : 60;
        setInput(text);
        setCooldownSeconds(seconds);
        setRateLimitUntil(Date.now() + seconds * 1000);
        return;
      }
      if (res.status === 503) {
        say(t("clippy.offline"));
        return;
      }
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
      stopLoops();
      setBusy(false);
      try {
        clippy?.stop();
      } catch {
        /* ignore */
      }
    }
  }, [input, busy, cooldownSeconds, rateLimitUntil, clippy, say, t]);

  const abort = useCallback(() => {
    userAbortedRef.current = true;
    abortRef.current?.abort();
    abortRef.current = null;
    stopLoops();
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
    if (!next) playSound("toggle-on", 0.5);
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="clippy-scope fixed z-70 right-3 bottom-3 w-80 max-w-[calc(100vw-1.5rem)] border-2 border-retro-border-mid bg-retro-winface shadow-[2px_2px_0px_#000]"
    >
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
            onClick={closeChat}
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
            {cooldownSeconds > 0 && (
              <p className="text-right text-retro-orange" aria-live="polite">
                {t("clippy.rateLimitCooldown").replace(
                  "{seconds}",
                  String(cooldownSeconds),
                )}
              </p>
            )}
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
              className="flex-1 min-w-0 border-2 border-inset border-retro-border-mid bg-white px-1.5 py-1 text-xs outline-none"
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
                disabled={!input.trim() || cooldownSeconds > 0}
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
