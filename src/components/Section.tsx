import { type ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

/**
 * Reusable section component styled with "fake table" aesthetics.
 * Mimics the classic inner-3d bordered panel with a dark header bar.
 */
export default function Section({ id, title, children }: SectionProps) {
  return (
    <div
      id={id}
      className="mb-3 border-t-2 border-l-2 border-retro-border-light border-r-2 border-b-2"
    >
      {/* Section header bar */}
      <div className="bg-retro-blue-dark text-white font-bold text-sm py-1.5 px-3 border-b-2 border-retro-blue-nav tracking-wide font-sans">
        ═══ § {title}{" "}
        {"═".repeat(Math.max(1, 40 - title.length))}
      </div>
      {/* Content area */}
      <div className="bg-retro-white-bg p-3">{children}</div>
    </div>
  );
}
