/* Retro micro-interaction sounds via `uisfx` (pack: mechanical).
   Single client-only singleton, synthesized locally (no audio fetch).
   Unlock requires a real user gesture; mute persists in localStorage.
   Sound reinforces visible feedback and is never the only signal. */

import {
  createUISFX,
  type CueName,
  type PlayingSFX,
  type UISFXPlayer,
} from "uisfx";

const PACK = "mechanical" as const;
const PREF_KEY = "portfolio.sound.enabled";
const VOLUME = 0.85;

/** Legacy kinds kept for compat, mapped to semantic cues. */
const KIND_TO_CUE = {
  hover: "hover",
  click: "press",
  speak: "receive",
  error: "error",
  open: "open",
  close: "close",
  send: "send",
  receive: "receive",
  "toggle-on": "toggle-on",
  "toggle-off": "toggle-off",
} as const satisfies Record<string, CueName>;

export type SoundKind = keyof typeof KIND_TO_CUE;

let player: UISFXPlayer | null = null;
let muted = false;
let unlocked = false;
let unlocking = false;
let greetingSoundPending = false;
let greetingWaitsForClippyCue = false;
let clippyCuePendingUnlock = false;
let suppressRetroClickUntil = 0;
const activeLoops = new Set<PlayingSFX>();

function getPlayer(): UISFXPlayer | null {
  if (typeof window === "undefined") return null;
  if (!player) {
    let enabled = true;
    try {
      const raw = window.localStorage.getItem(PREF_KEY);
      if (raw !== null) enabled = raw !== "0";
    } catch {
      /* private mode — default on */
    }
    muted = !enabled;
    if (muted) {
      greetingSoundPending = false;
      greetingWaitsForClippyCue = false;
      clippyCuePendingUnlock = false;
    }
    player = createUISFX({ pack: PACK, volume: VOLUME, enabled });
  }
  return player;
}

function persist() {
  try {
    window.localStorage.setItem(PREF_KEY, muted ? "0" : "1");
  } catch {
    /* ignore */
  }
}

function isClippyInteraction(target: EventTarget | null | undefined): boolean {
  return typeof Element !== "undefined" && target instanceof Element &&
    target.closest(".clippy-scope, .clippy-agent") !== null;
}

function playPendingGreeting(soundPlayer = getPlayer()): boolean {
  if (!greetingSoundPending || muted || !unlocked || !soundPlayer) return false;
  try {
    const playing = soundPlayer.play(KIND_TO_CUE.speak, { volume: 0.2 });
    if (!playing) return false;
    greetingSoundPending = false;
    greetingWaitsForClippyCue = false;
    clippyCuePendingUnlock = false;
    suppressRetroClickUntil = performance.now() + 450;
    return true;
  } catch {
    /* keep the greeting queued so a later interaction can retry */
    return false;
  }
}

/** Call synchronously inside a pointer/keyboard handler to unlock audio. */
export function unlockSounds(target?: EventTarget | null): void {
  if (greetingSoundPending) {
    greetingWaitsForClippyCue = isClippyInteraction(target);
  }

  if (unlocked) {
    if (greetingSoundPending && !greetingWaitsForClippyCue) playPendingGreeting();
    return;
  }
  const p = getPlayer();
  if (!p || unlocking) return;
  unlocking = true;
  void p
    .unlock()
    .then((success) => {
      unlocked = success;
      unlocking = false;
      if (success && greetingSoundPending && (!greetingWaitsForClippyCue || clippyCuePendingUnlock)) {
        playPendingGreeting(p);
      }
    })
    .catch(() => {
      unlocking = false;
      /* autoplay denied — a later user gesture can retry */
    });
}

export function setSoundsMuted(m: boolean): void {
  muted = m;
  if (m) {
    greetingSoundPending = false;
    greetingWaitsForClippyCue = false;
    clippyCuePendingUnlock = false;
  }
  persist();
  const p = getPlayer();
  if (!p) return;
  if (m) {
    stopLoops();
    p.stopAll();
  }
  p.setEnabled(!m);
}

export function areSoundsMuted(): boolean {
  getPlayer();
  return muted;
}

export function playSound(kind: SoundKind, volume = VOLUME): void {
  if (muted) return;
  if (typeof window === "undefined") return;
  if (kind === "click" && (greetingSoundPending || performance.now() < suppressRetroClickUntil)) return;
  // Suppress background/async cues until the first real gesture.
  if (!unlocked) {
    if (greetingSoundPending && (kind === "speak" || kind === "open" || kind === "send" || kind === "receive")) {
      clippyCuePendingUnlock = true;
    }
    return;
  }
  try {
    const soundPlayer = getPlayer();
    if (soundPlayer) {
      const isClippyCue = kind === "speak" || kind === "open" || kind === "send" || kind === "receive";
      if (greetingSoundPending && isClippyCue && playPendingGreeting(soundPlayer)) return;
      soundPlayer.play(KIND_TO_CUE[kind], { volume });
    }
  } catch {
    /* never break UI for sound */
  }
}

/** Play the initial greeting once audio is allowed by a real browser gesture. */
export function playGreetingSound(): void {
  if (muted || typeof window === "undefined") return;
  greetingSoundPending = true;
  if (unlocked) {
    playPendingGreeting();
    return;
  }
  greetingWaitsForClippyCue = false;
  clippyCuePendingUnlock = false;
}

/** Start a `processing` loop for visible async work. Idempotent per caller. */
export function startProcessing(): void {
  if (muted) return;
  if (typeof window === "undefined" || !unlocked) return;
  try {
    const handle = getPlayer()?.play("processing");
    if (handle) activeLoops.add(handle);
  } catch {
    /* ignore */
  }
}

export function stopLoops(): void {
  for (const h of activeLoops) {
    try {
      h.stop();
    } catch {
      /* ignore */
    }
  }
  activeLoops.clear();
}

/* One-time global wiring: press cue on .retro-btn, unlock on first gesture.
   Call once from Layout/App. Returns cleanup fn. */
export function wireRetroSounds(): () => void {
  if (typeof document === "undefined") return () => { };
  const onPointerDown = (event: PointerEvent) => unlockSounds(event.target);
  const onKeyDown = (event: KeyboardEvent) => unlockSounds(event.target);
  const onClick = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".clippy-scope, [data-no-retro]")) return;
    if (target.closest(".retro-btn")) playSound("click", 0.35);
  };
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("click", onClick);
  return () => {
    document.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("click", onClick);
  };
}
