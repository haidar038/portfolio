/* Retro micro-interaction sounds. Local mp3s in /public/sounds/.
   Respects prefers-reduced-motion (treated as reduce-noise) + mute toggle.
   Audio unlocks on first user gesture to satisfy autoplay policies. */

const FILES = {
  hover: "/sounds/soundreality-interface-9-204779.mp3",
  click: "/sounds/soundreality-interface-12-204786.mp3",
  speak: "/sounds/soundreality-interface-12-204786.mp3",
  error: "/sounds/soundreality-interface-13-204784.mp3",
} as const;

export type SoundKind = keyof typeof FILES;

let unlocked = false;
let muted = false;
const cache = new Map<string, HTMLAudioElement>();

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export function unlockSounds(): void {
  if (unlocked || typeof window === "undefined") return;
  unlocked = true;
  // Warm up without playing: creates elements so later play() is instant.
  for (const f of Object.values(FILES)) {
    if (!cache.has(f)) {
      const el = new Audio();
      el.src = f;
      el.preload = "auto";
      el.volume = 0.35;
      cache.set(f, el);
    }
  }
}

export function setSoundsMuted(m: boolean): void {
  muted = m;
}

export function areSoundsMuted(): boolean {
  return muted;
}

export function playSound(kind: SoundKind, volume = 0.35): void {
  if (muted || prefersReducedMotion()) return;
  if (typeof window === "undefined") return;
  // Require a prior gesture; first call just unlocks.
  if (!unlocked) {
    unlockSounds();
    return;
  }
  try {
    const src = FILES[kind];
    let el = cache.get(src);
    if (!el) {
      el = new Audio(src);
      el.preload = "auto";
      cache.set(src, el);
    }
    el.volume = volume;
    el.currentTime = 0;
    void el.play().catch(() => {
      /* ignore autoplay rejections */
    });
  } catch {
    /* never break UI for sound */
  }
}

/* One-time global wiring: click on .retro-btn plays click sound.
   Call once from Layout/App. Returns cleanup fn. */
export function wireRetroSounds(): () => void {
  if (typeof document === "undefined") return () => {};
  const onPointerDown = () => unlockSounds();
  const onClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement | null;
    if (t?.closest?.(".retro-btn")) playSound("click", 0.25);
  };
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.addEventListener("click", onClick);
  return () => {
    document.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("click", onClick);
  };
}
