import type { CSSProperties, ReactElement } from "react";

interface OldIconProps {
  name: string;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

const BASE_URL =
  "https://raw.githubusercontent.com/gsnoopy/react-old-icons/main/Icons/";

/**
 * React wrapper for react-old-icons.
 * Renders a retro OS icon as an <img> loaded from the react-old-icons GitHub repo.
 */
export default function OldIcon({
  name,
  size = 16,
  className = "",
  style,
  alt,
}: OldIconProps): ReactElement {
  const fileName = name.includes(".") ? name : `${name}.webp`;
  const src = `${BASE_URL}${encodeURIComponent(fileName)}`;

  const mergedStyle: CSSProperties = {
    width: typeof size === "number" ? `${size}px` : size,
    height: typeof size === "number" ? `${size}px` : size,
    display: "inline-block",
    verticalAlign: "middle",
    ...style,
  };

  return (
    <img
      src={src}
      alt={alt ?? name}
      className={className}
      style={mergedStyle}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  );
}
