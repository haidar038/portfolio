import { useEffect, useRef } from "react";
import type { ProjectEntry } from "../data/projects";

interface ProjectThumbnailProps {
  project: ProjectEntry;
  width: number;
  height: number;
  className?: string;
  loading?: "lazy" | "eager";
}

/**
 * Advance the fallback chain: hosted thumbnail -> local SVG -> shared
 * placeholder. Guards against loops when a fallback is already applied.
 */
function applyFallback(
  image: HTMLImageElement,
  project: Pick<ProjectEntry, "thumbnailUrl" | "thumbnail">,
) {
  if (project.thumbnailUrl && image.dataset.fallback !== "true") {
    image.dataset.fallback = "true";
    image.src = project.thumbnail;
    return;
  }
  if (image.dataset.placeholder !== "true") {
    image.dataset.placeholder = "true";
    image.src = "/thumbnails/placeholder.svg";
  }
}

/**
 * Project image with a fallback chain: hosted thumbnail -> local SVG ->
 * shared placeholder. Also handles images that fail before hydration.
 */
export default function ProjectThumbnail({
  project,
  width,
  height,
  className,
  loading,
}: ProjectThumbnailProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) {
      applyFallback(image, project);
    }
  }, [project]);

  return (
    <img
      ref={imageRef}
      src={project.thumbnailUrl ?? project.thumbnail}
      alt={project.name}
      width={width}
      height={height}
      loading={loading}
      className={className}
      onError={(event) => applyFallback(event.currentTarget, project)}
    />
  );
}
