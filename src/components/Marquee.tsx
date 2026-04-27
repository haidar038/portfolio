interface MarqueeProps {
  text: string;
}

/**
 * Marquee component - displays scrolling announcement text.
 * Placeholder component to be implemented in task 13.4.
 */
export default function Marquee({ text }: MarqueeProps) {
  return (
    <div className="bg-retro-marquee-bg border-b border-retro-border-mid overflow-hidden">
      <div className="py-1 px-2 text-retro-text-secondary text-sm whitespace-nowrap">
        {text}
      </div>
    </div>
  );
}
