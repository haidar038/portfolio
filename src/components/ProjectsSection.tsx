import { useMemo, useState, type ReactNode } from "react";
import Section from "./Section";
import { useI18n } from "../i18n/useI18n";
import { PROJECTS } from "../data/projects";
import type { Locale } from "../i18n/types";

const ITEMS_PER_PAGE = 5;

/** Featured first, then newest-first by (year, month). Stable for ties. */
function sortProjects<T extends { featured?: boolean; year: string; month?: number }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    if (a.year !== b.year) return Number(b.year) - Number(a.year);
    return (b.month ?? 0) - (a.month ?? 0);
  });
}

/** "Mar 2025" / "Mar 2025" bilingual; falls back to year when month unknown. */
function formatPeriod(year: string, month: number | undefined, locale: Locale): string {
  if (!month) return year;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(Number(year), month - 1, 1));
}

/**
 * Projects / Portfolio section with retro data table and pagination.
 */
export default function ProjectsSection(): ReactNode {
  const { t, locale } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);

  const sorted = useMemo(() => sortProjects(PROJECTS), []);
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginatedProjects = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const showing = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd = Math.min(currentPage * ITEMS_PER_PAGE, sorted.length);

  return (
    <Section id="projects" title={t("section.projects")}>
      <div className="overflow-x-auto border-2 border-t-[#c8c8c8] border-l-[#c8c8c8] border-b-retro-border-dark border-r-retro-border-dark bg-white p-0.5">
        <table className="w-full border-collapse text-xs min-w-150">
          <thead>
            <tr className="bg-retro-blue-dark text-white text-xs border border-black">
              <td className="py-1 px-2 border-r border-black w-24 text-center font-bold">
                {t("projects.col.image")}
              </td>
              <td className="py-1 px-2 border-r border-black w-32 font-bold">
                {t("projects.col.name")}
              </td>
              <td className="py-1 px-2 border-r border-black font-bold">
                {t("projects.col.description")}
              </td>
              <td className="py-1 px-2 border-r border-black w-24 font-bold">
                {t("projects.col.stack")}
              </td>
              <td className="py-1 px-2 w-16 text-center font-bold">
                {t("projects.col.links")}
              </td>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.map((project, i) => {
              const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + i;
              return (
                <tr
                  key={project.name}
                  className={[
                    "hover:bg-retro-hover border border-black",
                    globalIndex % 2 === 0 ? "bg-retro-cream-bg" : "bg-retro-alt-row",
                  ].join(" ")}
                >
                  <td className="p-2 border-r border-black align-top text-center">
                    <img
                      src={project.thumbnailUrl ?? project.thumbnail}
                      alt={project.name}
                      width={80}
                      height={80}
                      className="border border-black inline-block aspect-square w-20 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const el = e.currentTarget;
                        if (project.thumbnailUrl && el.dataset.fallback !== "true") {
                          el.dataset.fallback = "true";
                          el.src = project.thumbnail;
                          return;
                        }
                        if (el.dataset.placeholder !== "true") {
                          el.dataset.placeholder = "true";
                          el.src = "/thumbnails/placeholder.svg";
                        }
                      }}
                    />
                  </td>
                  <td className="py-1 px-2 border-r border-black align-top">
                    <b>{project.name}</b>
                    {project.featured && (
                      <>
                        <br />
                        <span className="text-retro-orange text-xs font-bold">
                          {t("projects.featured")}
                        </span>
                      </>
                    )}
                    <br />
                    <span className="text-retro-text-muted text-xs">
                      {formatPeriod(project.year, project.month, locale)}
                    </span>
                  </td>
                  <td className="py-1 px-2 border-r border-black leading-normal">
                    {project.description[locale]}
                    {project.status && (
                      <div className="mt-1">
                        <span
                          className={[
                            "text-[10px] px-1 border border-black inline-block",
                            project.status.includes("Live")
                              ? "bg-green-500 text-white"
                              : "bg-[#cc4444] text-white",
                          ].join(" ")}
                        >
                          {project.status.includes("Live") ? "✔" : "⚠"} {project.status}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-1 px-2 border-r border-black align-top text-xs leading-normal">
                    {project.stack.map((tech) => (
                      <span key={tech}>
                        {tech}
                        <br />
                      </span>
                    ))}
                  </td>
                  <td className="py-1 px-2 text-center align-top">
                    {project.links.map((link) => (
                      <span key={link.label}>
                        <a href={link.href} className="underline text-blue-800 hover:bg-blue-800 hover:text-white">[{link.label}]</a>
                        <br />
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mt-2">
        <div className="text-xs text-[#666]">
          {t("projects.showing")} {showing}-{showingEnd} {t("projects.of")} {sorted.length}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            className="retro-btn text-xs px-2 py-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {t("projects.prev")}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={[
                "retro-btn text-xs px-1.5 py-0 cursor-pointer",
                page === currentPage ? "bg-retro-blue-dark text-white border-inset" : "",
              ].join(" ")}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="retro-btn text-xs px-2 py-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            {t("projects.next")}
          </button>
        </div>
      </div>

      <div className="mt-1 text-xs text-[#666]" dangerouslySetInnerHTML={{ __html: t("projects.footer") }} />
    </Section>
  );
}
