import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useClippy } from "@react95/clippy";
import { useI18n } from "../../i18n/useI18n";
import type { Translations } from "../../i18n/types";
import { isClippyTarget, type ClippyTarget } from "../../data/clippy-knowledge";
import ClippyMarkdown from "./ClippyMarkdown";
import { playSound, setSoundsMuted, areSoundsMuted, startProcessing, stopLoops } from "../../lib/sound";

interface ChatMsg {
  from: "clippy" | "user";
  text: string;
  copyText?: string;
}

interface Turn {
  role: "user" | "model";
  text: string;
}

const CONTEXT_DWELL_MS = 3200;
const HIGHLIGHT_MS = 1800;
const CLICK_MAX_DIST_PX = 6;
const CLICK_MAX_MS = 400;
const HOME_MARGIN_PX = 16;
const PANEL_GAP_PX = 12;
const DOCK_MS = 400;
const FETCH_TIMEOUT_MS = 9000;
const HISTORY_MAX = 8;
const HISTORY_TEXT_MAX = 300;
const PENDING_NAV_KEY = "clippy.pendingNavigation.v1";
const SEEN_CONTEXTS_KEY = "clippy.seenContexts.v1";
const UNREAD_SUGGESTION_KEY = "clippy.unreadSuggestion.v1";

const SUGGESTION_KEYS: Record<ClippyTarget, keyof Translations> = {
  about: "clippy.suggestAbout",
  journey: "clippy.suggestJourney",
  experience: "clippy.suggestExperience",
  projects: "clippy.suggestProjects",
  contact: "clippy.suggestContact",
  guestbook: "clippy.suggestGuestbook",
  blogroll: "clippy.suggestBlogroll",
};

const TOUR_STOPS: Array<{ target: ClippyTarget; messageKey: keyof Translations }> = [
  { target: "about", messageKey: "clippy.tourAbout" },
  { target: "projects", messageKey: "clippy.tourProjects" },
  { target: "contact", messageKey: "clippy.tourContact" },
];

const KONAMI_SEQUENCE = [
  "arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft",
  "arrowright", "arrowleft", "arrowright", "b", "a",
];

interface PendingNavigation {
  target: ClippyTarget;
  message?: ChatMsg;
  openChat: boolean;
  tourStep: number | null;
  createdAt: number;
}

/** Client-side language guess mirrors the server heuristic (cheap, no LLM). */
function guessLocaleClient(text: string): "en" | "id" | null {
  const t = ` ${text.toLowerCase()} `;
  const idMarkers = [
    "udah", "udh", "gak", "nggak", "enggak", "ngga", "sih", "nih", "deh",
    "dong", "gimana", "apa", "yang", "aku", "kamu", "saya", "gue", "lu",
    "banget", "ngobrol", "ngasih", "nyebelin", "yaudah", "emang", "aja",
    "tuh", "gitu", "kok", "tau", "bisa", "proyek", "siapa", "ceritain", "spill",
  ];
  let id = 0;
  for (const m of idMarkers) if (t.includes(m)) id += 1;
  if (/\bnge\w{2,}/.test(t) || /\bny\w{2,}/.test(t)) id += 2;
  const enMarkers = [" the ", " you ", " what ", " how ", " tell ", " about ", " project ", " contact ", " thanks "];
  let en = 0;
  for (const m of enMarkers) if (t.includes(m)) en += 1;
  if (id === 0 && en === 0) return null;
  return id >= en ? "id" : "en";
}

function currentContext(): ClippyTarget | null {
  if (typeof document === "undefined") return null;
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "/guestbook") return "guestbook";
  if (path === "/blogroll") return "blogroll";
  if (path !== "/") return null;

  const y = window.scrollY + window.innerHeight / 2;
  for (const sectionId of ["about", "journey", "experience", "projects", "contact"] as const) {
    const el = document.getElementById(sectionId);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    if (top <= y && top + rect.height > y) return sectionId;
  }
  return window.scrollY < 600 ? "about" : null;
}

function targetPath(target: ClippyTarget): string {
  if (target === "guestbook") return "/guestbook";
  if (target === "blogroll") return "/blogroll";
  return "/";
}

function timeGreetingKey(): keyof Translations {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "clippy.greetingMorning";
  if (hour >= 12 && hour < 18) return "clippy.greetingAfternoon";
  return "clippy.greetingEvening";
}

function readSeenContexts(): Set<ClippyTarget> {
  try {
    const value: unknown = JSON.parse(window.sessionStorage.getItem(SEEN_CONTEXTS_KEY) ?? "[]");
    if (!Array.isArray(value)) return new Set();
    return new Set(value.filter(isClippyTarget));
  } catch {
    return new Set();
  }
}

function readUnreadSuggestion(): boolean {
  try {
    return window.sessionStorage.getItem(UNREAD_SUGGESTION_KEY) === "1";
  } catch {
    return false;
  }
}

function readPendingNavigation(): PendingNavigation | null {
  try {
    const value: unknown = JSON.parse(window.sessionStorage.getItem(PENDING_NAV_KEY) ?? "null");
    if (!value || typeof value !== "object") return null;
    const pending = value as Partial<PendingNavigation>;
    if (
      !isClippyTarget(pending.target) ||
      typeof pending.createdAt !== "number" ||
      Date.now() - pending.createdAt > 30_000 ||
      targetPath(pending.target) !== window.location.pathname
    ) return null;
    if (pending.message && (pending.message.from !== "clippy" || typeof pending.message.text !== "string")) {
      return null;
    }
    return {
      target: pending.target,
      message: pending.message,
      openChat: pending.openChat === true,
      tourStep: Number.isInteger(pending.tourStep) ? pending.tourStep! : null,
      createdAt: pending.createdAt,
    };
  } catch {
    return null;
  }
}

function setStoredUnreadSuggestion(unread: boolean): void {
  try {
    if (unread) window.sessionStorage.setItem(UNREAD_SUGGESTION_KEY, "1");
    else window.sessionStorage.removeItem(UNREAD_SUGGESTION_KEY);
  } catch {
    /* Session storage is a convenience; the in-memory state still works. */
  }
}

function scrollToSection(target: ClippyTarget): boolean {
  if (["guestbook", "blogroll"].includes(target)) return false;
  const element = document.getElementById(target);
  if (!element) return false;

  window.history.replaceState(window.history.state, "", `/#${target}`);
  document.querySelectorAll(".clippy-section-highlight").forEach((node) => {
    node.classList.remove("clippy-section-highlight");
  });
  element.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
  element.classList.add("clippy-section-highlight");
  window.setTimeout(() => element.classList.remove("clippy-section-highlight"), HIGHLIGHT_MS);
  return true;
}

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
  const [initialNavigation] = useState<PendingNavigation | null>(readPendingNavigation);
  const [open, setOpen] = useState(initialNavigation?.openChat ?? false);
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>(() =>
    initialNavigation?.message ? [initialNavigation.message] : [],
  );
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [muted, setMuted] = useState(areSoundsMuted());
  const [unreadSuggestion, setUnreadSuggestion] = useState(() =>
    initialNavigation?.openChat ? false : readUnreadSuggestion(),
  );
  const [tourStep, setTourStep] = useState<number | null>(() =>
    initialNavigation?.tourStep !== null && initialNavigation?.tourStep !== undefined &&
    initialNavigation.tourStep >= 0 && initialNavigation.tourStep < TOUR_STOPS.length
      ? initialNavigation.tourStep
      : null,
  );
  const [copiedDraft, setCopiedDraft] = useState<string | null>(null);
  const [copyFailedDraft, setCopyFailedDraft] = useState<string | null>(null);
  const greeted = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const userAbortedRef = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const moveTokenRef = useRef(0);
  const draggedRef = useRef(false);
  const suppressClickUntilRef = useRef(0);
  const localeRef = useRef(locale);
  const openRef = useRef(open);
  const busyRef = useRef(false);
  // Session memory: in-memory only, cleared on refresh/unmount by design.
  const historyRef = useRef<Turn[]>([]);
  const lockedLangRef = useRef<"en" | "id" | null>(null);
  const deliveredContextsRef = useRef<Set<ClippyTarget> | null>(null);
  if (deliveredContextsRef.current === null) deliveredContextsRef.current = readSeenContexts();
  const activeContextRef = useRef<ClippyTarget | null>(null);
  const pendingContextRef = useRef<ClippyTarget | null>(null);
  const lastProactiveContextRef = useRef<ClippyTarget | null>(null);
  const draftKickoffAvailableRef = useRef(false);
  const deliverSuggestionRef = useRef<(context: ClippyTarget) => void>(() => undefined);

  const markSuggestionRead = useCallback(() => {
    setUnreadSuggestion(false);
    setStoredUnreadSuggestion(false);
  }, []);

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

  useEffect(() => {
    busyRef.current = busy;
  }, [busy]);

  // Keep newest chat visible.
  useEffect(() => {
    if (!open || collapsed) return;
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, busy, open, collapsed]);

  const say = useCallback(
    (text: string, animation?: string, speechText = text, copyText?: string) => {
      setMessages((m) => [...m.slice(-19), { from: "clippy", text, copyText }]);
      // Chat open: history only, no balloon (avoids double UI).
      if (openRef.current) {
        playSound("speak", 0.15);
        return;
      }
      try {
        if (!reducedMotion() && animation && clippy?.hasAnimation?.(animation)) clippy.play(animation);
        clippy?.speak(speechText, false);
        playSound("speak", 0.2);
      } catch {
        /* visual only */
      }
    },
    [clippy],
  );

  const navigateToTarget = useCallback(
    (target: ClippyTarget, message?: ChatMsg, nextTourStep: number | null = tourStep) => {
      if (!isClippyTarget(target)) return;
      const destination = targetPath(target);
      if (destination !== window.location.pathname) {
        const pending: PendingNavigation = {
          target,
          message,
          openChat: true,
          tourStep: nextTourStep,
          createdAt: Date.now(),
        };
        try {
          window.sessionStorage.setItem(PENDING_NAV_KEY, JSON.stringify(pending));
        } catch {
          /* The destination still works if the browser blocks session storage. */
        }
        const url = destination === "/" ? `/#${target}` : destination;
        window.location.assign(url);
        return;
      }

      if (destination === "/") {
        let attempts = 0;
        const focus = () => {
          if (scrollToSection(target) || attempts >= 12) return;
          attempts += 1;
          window.setTimeout(focus, 100);
        };
        focus();
      }
    },
    [tourStep],
  );

  const deliverSuggestion = useCallback((context: ClippyTarget) => {
    const delivered = deliveredContextsRef.current;
    if (!delivered || delivered.has(context)) return;
    if (document.hidden || openRef.current || busyRef.current) {
      pendingContextRef.current = context;
      return;
    }

    delivered.add(context);
    pendingContextRef.current = null;
    try {
      window.sessionStorage.setItem(SEEN_CONTEXTS_KEY, JSON.stringify([...delivered]));
    } catch {
      /* Keep the once-per-context guarantee for this component lifetime. */
    }
    setUnreadSuggestion(true);
    setStoredUnreadSuggestion(true);
    lastProactiveContextRef.current = context;
    if (context === "contact") draftKickoffAvailableRef.current = true;
    const message = t(SUGGESTION_KEYS[context]);
    say(message, "GestureRight", message);
  }, [say, t]);

  useEffect(() => {
    deliverSuggestionRef.current = deliverSuggestion;
  }, [deliverSuggestion]);

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
    openRef.current = true;
    markSuggestionRead();
    if (draftKickoffAvailableRef.current) {
      if (!input.trim()) setInput(t("clippy.draftKickoff"));
      draftKickoffAvailableRef.current = false;
    }
    // Glide runs in the layout effect below, after the panel mounts
    // so openAnchor measures the live panel height.
    setOpen(true);
    setCollapsed(false);
    playSound("open", 0.5);
  }, [input, markSuggestionRead, t]);

  const closeChat = useCallback(() => {
    openRef.current = false;
    setOpen(false);
    glideTo(closedAnchor(agentEl(clippy)));
    playSound("close", 0.5);
    const pending = pendingContextRef.current;
    if (pending && pending === currentContext()) {
      window.setTimeout(() => deliverSuggestionRef.current(pending), 100);
    }
  }, [glideTo, clippy]);

  const toggleChat = useCallback(() => {
    if (openRef.current) closeChat();
    else openChat();
  }, [openChat, closeChat]);

  const startTour = useCallback(() => {
    const step = 0;
    const message = t(TOUR_STOPS[step].messageKey);
    setTourStep(step);
    openChat();
    say(message, "GestureRight", message);
    navigateToTarget(TOUR_STOPS[step].target, { from: "clippy", text: message }, step);
  }, [navigateToTarget, openChat, say, t]);

  const advanceTour = useCallback(() => {
    if (tourStep === null) return;
    if (tourStep >= TOUR_STOPS.length - 1) {
      setTourStep(null);
      const message = t("clippy.tourDone");
      say(message, undefined, message);
      return;
    }
    const step = tourStep + 1;
    const message = t(TOUR_STOPS[step].messageKey);
    setTourStep(step);
    say(message, "GestureRight", message);
    navigateToTarget(TOUR_STOPS[step].target, { from: "clippy", text: message }, step);
  }, [navigateToTarget, say, t, tourStep]);

  const skipTour = useCallback(() => {
    setTourStep(null);
    const message = t("clippy.tourSkipped");
    say(message, undefined, message);
  }, [say, t]);

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

  // Restore one in-flight navigation after a cross-page section action.
  useEffect(() => {
    const pending = initialNavigation;
    if (!pending) return;
    greeted.current = true;
    try {
      window.sessionStorage.removeItem(PENDING_NAV_KEY);
    } catch {
      /* The redirect is already complete; storage cleanup is best effort. */
    }
    if (pending.openChat) setStoredUnreadSuggestion(false);

    let attempts = 0;
    const focus = () => {
      if (targetPath(pending.target) !== window.location.pathname) return;
      if (targetPath(pending.target) !== "/" || scrollToSection(pending.target)) return;
      if (attempts++ < 20) window.setTimeout(focus, 100);
    };
    window.setTimeout(focus, 150);
  }, [initialNavigation]);

  // Time-sensitive greeting remains static and works while the AI endpoint is offline.
  useEffect(() => {
    if (!clippy || greeted.current) return;
    greeted.current = true;
    const timer = window.setTimeout(() => {
      if (!reducedMotion() && clippy.hasAnimation?.("Greeting")) clippy.play("Greeting");
      const greeting = t(timeGreetingKey());
      say(greeting, undefined, greeting);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [clippy, say, t]);

  // One contextual nudge per section/page per browser tab session.
  useEffect(() => {
    if (!clippy) return;
    let timer: number | undefined;
    const checkContext = () => {
      const context = currentContext();
      activeContextRef.current = context;
      if (!context) {
        pendingContextRef.current = null;
        return;
      }
      if (deliveredContextsRef.current?.has(context)) return;
      if (document.hidden || openRef.current || busyRef.current) {
        pendingContextRef.current = context;
        return;
      }
      deliverSuggestionRef.current(context);
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(checkContext, CONTEXT_DWELL_MS);
    };
    const onVisibility = () => {
      if (!document.hidden) schedule();
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [clippy, open]);

  // Konami easter egg; ignore key sequences typed into form controls.
  useEffect(() => {
    if (!clippy) return;
    let progress = 0;
    let lastFireAt = 0;
    const timers: number[] = [];
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.matches("input, textarea, select"))
      ) {
        progress = 0;
        return;
      }
      const key = event.key.toLowerCase();
      if (key === KONAMI_SEQUENCE[progress]) progress += 1;
      else progress = key === KONAMI_SEQUENCE[0] ? 1 : 0;
      if (progress !== KONAMI_SEQUENCE.length) return;
      progress = 0;
      if (Date.now() - lastFireAt < 2500) return;
      lastFireAt = Date.now();

      const el = agentEl(clippy);
      if (!reducedMotion()) {
        el?.classList.add("clippy-konami");
        if (clippy.hasAnimation?.("GetAttention")) clippy.play("GetAttention");
        timers.push(window.setTimeout(() => {
          if (clippy.hasAnimation?.("Greeting")) clippy.play("Greeting");
        }, 550));
        timers.push(window.setTimeout(() => el?.classList.remove("clippy-konami"), 2200));
      }
      const message = t("clippy.konami");
      say(message, undefined, message);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      timers.forEach((timer) => window.clearTimeout(timer));
      agentEl(clippy)?.classList.remove("clippy-konami");
    };
  }, [clippy, say, t]);

  // Add an accessible unread marker to the third-party agent element.
  useEffect(() => {
    const el = agentEl(clippy);
    if (!el) return;
    el.setAttribute("aria-label", unreadSuggestion ? t("clippy.newSuggestion") : t("clippy.assistantLabel"));
    const oldBadge = el.querySelector(".clippy-presence-badge");
    oldBadge?.remove();
    if (!unreadSuggestion) return;
    const badge = document.createElement("span");
    badge.className = "clippy-presence-badge";
    badge.textContent = "!";
    badge.setAttribute("role", "status");
    badge.setAttribute("aria-label", t("clippy.newSuggestion"));
    el.appendChild(badge);
    return () => badge.remove();
  }, [clippy, unreadSuggestion, t]);

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
    // Spam guard: ignore exact repeat of the last user turn while brain knows it.
    const lastUser = [...historyRef.current].reverse().find((h) => h.role === "user");
    if (lastUser && lastUser.text === text.slice(0, HISTORY_TEXT_MAX)) {
      setInput("");
      say(t("clippy.fallback"));
      return;
    }
    setInput("");
    setMessages((m) => [...m.slice(-19), { from: "user", text }]);
    setBusy(true);
    busyRef.current = true;
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
      // Optimistic lang hint: follow user's words immediately, server confirms.
      const hint = guessLocaleClient(text);
      if (hint) lockedLangRef.current = hint;
      const historyPayload = historyRef.current.slice(-HISTORY_MAX).map((h) => ({
        role: h.role,
        text: h.text.slice(0, HISTORY_TEXT_MAX),
      }));
      const res = await fetch("/api/clippy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text.slice(0, 500),
          pageLocale: localeRef.current,
          lockedLang: lockedLangRef.current,
          history: historyPayload,
          context: {
            path: window.location.pathname,
            section: currentContext() ?? "",
          },
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
      const speechText = typeof data.speechText === "string" ? data.speechText : reply;
      const target = !data.blocked && isClippyTarget(data.target) ? data.target : null;
      const copyText = !data.blocked && typeof data.copyText === "string"
        ? data.copyText.slice(0, 1200)
        : undefined;
      if (data.lang === "id" || data.lang === "en") {
        lockedLangRef.current = data.lang;
      }
      // Blocked turns stay visible but never poison session memory.
      if (!data.blocked) {
        historyRef.current = [
          ...historyRef.current,
          { role: "user" as const, text: text.slice(0, HISTORY_TEXT_MAX) },
          { role: "model" as const, text: reply.slice(0, HISTORY_TEXT_MAX) },
        ].slice(-16);
      }
      say(reply, undefined, speechText, copyText);
      if (target) {
        navigateToTarget(target, { from: "clippy", text: reply, copyText }, tourStep);
      }
    } catch {
      // User abort stays silent; failures show the retro fallback line.
      if (!userAbortedRef.current) say(t("clippy.fallback"));
    } finally {
      clearTimeout(timer);
      if (abortRef.current === ctrl) abortRef.current = null;
      stopLoops();
      setBusy(false);
      busyRef.current = false;
      try {
        clippy?.stop();
      } catch {
        /* ignore */
      }
    }
  }, [input, busy, cooldownSeconds, rateLimitUntil, clippy, navigateToTarget, say, t, tourStep]);

  const abort = useCallback(() => {
    userAbortedRef.current = true;
    abortRef.current?.abort();
    abortRef.current = null;
    stopLoops();
    setBusy(false);
    busyRef.current = false;
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

  const copyDraft = useCallback(async (draft: string) => {
    setCopyFailedDraft(null);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(draft);
      setCopiedDraft(draft);
    } catch {
      setCopyFailedDraft(draft);
    }
  }, []);

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
          <div
            className="h-56 overflow-y-auto bg-retro-yellow-bg p-1.5 text-xs leading-normal space-y-2"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.length === 0 && (
              <ClippyMarkdown
                source={t(timeGreetingKey())}
                onNavigate={(target) => navigateToTarget(target)}
              />
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === "clippy" ? "text-black" : "text-right text-retro-blue-dark"
                }
              >
                <b>{m.from === "clippy" ? "📎 " : "You: "}</b>
                {m.from === "clippy" ? (
                  <ClippyMarkdown
                    source={m.text}
                    onNavigate={(target) => navigateToTarget(target, m)}
                  />
                ) : (
                  <span className="whitespace-pre-wrap">{m.text}</span>
                )}
                {m.copyText && (
                  <div className="clippy-draft-card">
                    <pre>{m.copyText}</pre>
                    <button
                      data-no-retro
                      className="retro-btn px-2 py-0.5 text-xs cursor-pointer font-bold"
                      onClick={() => void copyDraft(m.copyText!)}
                    >
                      {copiedDraft === m.copyText ? t("clippy.copiedDraft") : t("clippy.copyDraft")}
                    </button>
                    {copyFailedDraft === m.copyText && (
                      <span className="ml-1 text-retro-orange" role="status">
                        {t("clippy.copyDraftFailed")}
                      </span>
                    )}
                  </div>
                )}
              </div>
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
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center justify-between gap-2 px-1.5 py-1 border-t border-retro-border-mid bg-retro-sidebar">
            {tourStep === null ? (
              <button
                data-no-retro
                className="retro-btn px-2 py-0.5 text-xs cursor-pointer font-bold"
                onClick={startTour}
              >
                {t("clippy.tourStart")}
              </button>
            ) : (
              <>
                <span className="text-[10px] text-retro-text-muted">
                  {t("clippy.tourStep").replace("{step}", String(tourStep + 1))}
                </span>
                <div className="flex gap-1">
                  <button
                    data-no-retro
                    className="retro-btn px-2 py-0.5 text-xs cursor-pointer font-bold"
                    onClick={advanceTour}
                  >
                    {t("clippy.tourNext")}
                  </button>
                  <button
                    data-no-retro
                    className="retro-btn px-2 py-0.5 text-xs cursor-pointer"
                    onClick={skipTour}
                  >
                    {t("clippy.tourSkip")}
                  </button>
                </div>
              </>
            )}
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
