import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isClippyTarget, type ClippyTarget } from "../../data/clippy-knowledge";

interface ClippyMarkdownProps {
  source: string;
  onNavigate: (target: ClippyTarget) => void;
}

interface SafeLink {
  href: string;
  target?: ClippyTarget;
  external: boolean;
}

function safeLink(href: string): SafeLink | null {
  const value = href.trim();
  if (!value || value.startsWith("//")) return null;

  if (value.startsWith("#")) {
    const target = value.slice(1);
    if (!isClippyTarget(target)) return null;
    return { href: value, target, external: false };
  }

  if (value === "/guestbook") {
    return { href: value, target: "guestbook", external: false };
  }
  if (value === "/blogroll") {
    return { href: value, target: "blogroll", external: false };
  }

  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return { href: parsed.href, external: true };
    }
    if (parsed.protocol === "mailto:") {
      return { href: value, external: false };
    }
  } catch {
    return null;
  }

  return null;
}

export default function ClippyMarkdown({ source, onNavigate }: ClippyMarkdownProps) {
  const components: Components = {
    a({ href, title, children }) {
      const link = safeLink(href ?? "");
      if (!link) return <>{children}</>;

      return (
        <a
          href={link.href}
          title={title}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          onClick={
            link.target
              ? (event) => {
                  event.preventDefault();
                  onNavigate(link.target!);
                }
              : undefined
          }
        >
          {children}
        </a>
      );
    },
    // Chat replies do not need remote images; avoid tracking requests from model output.
    img({ alt }) {
      return alt ? <span>[{alt}]</span> : null;
    },
  };

  return (
    <div className="clippy-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
        skipHtml
        urlTransform={(url) => safeLink(url)?.href ?? ""}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
