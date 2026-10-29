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
    <section
      id={id}
      className="mb-2 border-t-2 border-l-2 border-retro-border-light border-r-2 border-b-2"
    >
      {/* Section header bar */}
      <h2 className="m-0 bg-retro-blue-dark text-white font-bold text-xs py-1 px-2 border-b-2 border-retro-blue-nav tracking-wide font-sans">
        <span aria-hidden="true">═══ § </span>
        {title}{" "}
        <span aria-hidden="true">{"═".repeat(Math.max(1, 40 - title.length))}</span>
      </h2>
      {/* Content area */}
      <div className="bg-retro-white-bg p-2">{children}</div>
    </section>
  );
}
