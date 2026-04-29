interface MarqueeProps {
  text: string;
  speed?: number;
}

/**
 * Retro marquee component using CSS animation for scrolling text
 * for authentic early 2000s feel.
 */
export default function Marquee({ text, speed = 3 }: MarqueeProps) {
  return (
    <div
      className="bg-retro-marquee-bg py-1 overflow-hidden"
      role="marquee"
      aria-label={text}
    >
      <div
        className="text-retro-green-glow font-retro-mono text-sm whitespace-nowrap animate-marquee"
        style={{ animationDuration: `${25 / (speed / 4)}s` }}
      >
        {text}
      </div>
    </div>
  );
}
