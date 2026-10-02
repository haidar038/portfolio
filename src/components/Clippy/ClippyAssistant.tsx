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

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

async function askClippy(
  prompt: string,
  locale: string,
  context?: string,
): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch("/api/clippy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt.slice(0, 500), locale, context }),
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.reply === "string" ? data.reply : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Clippy hybrid assistant: @react95/clippy body + Gemini brain via /api/clippy.
 * Static triggers work offline; chat input calls the backend when available.
 */
export default function ClippyAssistant() {
  const { clippy } = useClippy();
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(areSoundsMuted());
  const greeted = useRef(false);
  const lastScrollHint = useRef(0);
  const localeRef = useRef(locale);
  localeRef.current = locale;

  const say = useCallback(
    (text: string, animation?: string) => {
      setMessages((m) => [...m.slice(-19), { from: "clippy", text }]);
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

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m.slice(-19), { from: "user", text }]);
    setBusy(true);
    try {
      clippy?.play("Thinking");
    } catch {
      /* ignore */
    }
    const reply = await askClippy(text, localeRef.current);
    setBusy(false);
    try {
      clippy?.stop();
    } catch {
      /* ignore */
    }
    say(reply ?? t("clippy.fallback"));
  }, [input, busy, clippy, say, t]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setSoundsMuted(next);
  };

  return (
    <div className="clippy-scope fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2">
      {open && (
        <div className="w-72 border-2 border-retro-border-mid bg-retro-winface shadow-[2px_2px_0px_#000]">
          <div className="flex items-center justify-between px-1.5 py-0.5 bg-linear-to-r from-[#000080] to-[#1084d0] select-none">
            <span className="text-white text-xs font-bold">📎 Clippy AI</span>
            <div className="flex gap-0.5">
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
          <div className="h-44 overflow-y-auto bg-retro-yellow-bg p-1.5 text-xs leading-normal space-y-1">
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
            <button
              onClick={() => void send()}
              disabled={busy || !input.trim()}
              className="retro-btn px-2 py-0.5 text-xs cursor-pointer font-bold disabled:opacity-50"
            >
              {t("clippy.send")}
            </button>
          </div>
        </div>
      )}
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            playSound("click", 0.25);
          }}
          className="retro-btn px-2 py-1 text-xs cursor-pointer font-bold"
          aria-label="Open Clippy chat"
        >
          📎 Clippy
        </button>
      )}
    </div>
  );
}
