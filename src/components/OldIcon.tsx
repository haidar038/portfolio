import { useState, type CSSProperties, type ReactElement } from "react";

interface OldIconProps {
  name: string;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

const REMOTE_BASE_URL =
  "https://raw.githubusercontent.com/gsnoopy/react-old-icons/main/Icons/";

/* Map legacy Windows icon names to vendored local PNGs in /public/icons/.
   Keeps first paint working when the GitHub CDN is blocked / rate-limited. */
const LOCAL_ICON_MAP: Record<string, string> = {
  WindowsXPMail: "email.png",
  WindowsNetwork: "world.png",
  InternetConnection: "connect.png",
  VisualStudioPhone: "comment.png",
  VisioMap: "flag_green.png",
  Windows2000MyNetworkPlaces: "world_link.png",
  VisualStudioCLOCK: "clock.png",
  VisualStudioNOTE16: "comment.png",
  Windows95TextFile: "comment.png",
  VisualStudioEARTH: "world.png",
  Windows95Comctl322: "exclamation.png",
};

const FALLBACK_EMOJI: Record<string, string> = {
  "email.png": "✉️",
  "world.png": "🌐",
  "connect.png": "🔗",
  "comment.png": "💬",
  "clock.png": "🕐",
  "exclamation.png": "⚠️",
  "flag_green.png": "🚩",
  "world_link.png": "🌍",
};

/**
 * Retro OS icon with local-first loading.
 * 1) /icons/<mapped>.png  2) remote react-old-icons CDN  3) emoji fallback.
 */
export default function OldIcon({
  name,
  size = 16,
  className = "",
  style,
  alt,
}: OldIconProps): ReactElement {
  const fileName = name.includes(".") ? name : `${name}.webp`;
  const localFile = LOCAL_ICON_MAP[name] ?? "information.png";
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  const mergedStyle: CSSProperties = {
    width: typeof size === "number" ? `${size}px` : size,
    height: typeof size === "number" ? `${size}px` : size,
    display: "inline-block",
    verticalAlign: "middle",
    ...style,
  };

  if (stage === 2) {
    return (
      <span
        className={className}
        style={mergedStyle}
        role="img"
        aria-label={alt ?? name}
      >
        {FALLBACK_EMOJI[localFile] ?? "▣"}
      </span>
    );
  }

  const src =
    stage === 0
      ? `/icons/${localFile}`
      : `${REMOTE_BASE_URL}${encodeURIComponent(fileName)}`;

  return (
    <img
      src={src}
      alt={alt ?? name}
      className={className}
      style={mergedStyle}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onError={() => setStage((s) => (s === 0 ? 1 : 2))}
    />
  );
}
