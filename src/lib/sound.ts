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
const VOLUME = 0.7;

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

/** Call synchronously inside a pointer/keyboard handler to unlock audio. */
export function unlockSounds(): void {
  const p = getPlayer();
  if (!p || unlocked) return;
  unlocked = true;
  void p.unlock().catch(() => {
    /* autoplay denied — cues stay silent until next gesture */
  });
}

export function setSoundsMuted(m: boolean): void {
  muted = m;
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
  // Suppress background/async cues until the first real gesture.
  if (!unlocked) {
    unlockSounds();
    return;
  }
  try {
    getPlayer()?.play(KIND_TO_CUE[kind], { volume }) ?? null;
  } catch {
    /* never break UI for sound */
  }
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
  if (typeof document === "undefined") return () => {};
  const onPointerDown = () => unlockSounds();
  const onKeyDown = () => unlockSounds();
  const onClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement | null;
    if (t?.closest?.(".retro-btn")) playSound("click", 0.35);
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
