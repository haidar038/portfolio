import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import Section from "../components/Section";
import ProjectThumbnail from "../components/ProjectThumbnail";
import NotFound from "./NotFound";
import { useI18n } from "../i18n/useI18n";
import { PROJECTS, PROJECT_HIGHLIGHTS } from "../data/projects";
import type { Locale } from "../i18n/types";

const SITE_URL = "https://hydr.codes";

/** Keep meta descriptions near the 155-character comfort zone. */
function truncate(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : cut.length)}…`;
}

/** Pad short project descriptions with stack context for search snippets. */
function buildDescription(
  project: (typeof PROJECTS)[number],
  locale: Locale,
): string {
  const base = project.description[locale];
  if (base.length >= 140) return truncate(base);

  const stack = project.stack.slice(0, 3).join(", ");
  const suffix =
    locale === "id"
      ? ` Proyek oleh M. Khaidar, dibangun dengan ${stack}.`
      : ` A project by M. Khaidar built with ${stack}.`;

  return truncate(`${base}${suffix}`);
}

function formatPeriod(
  year: string,
  month: number | undefined,
  locale: Locale,
): string {
  if (!month) return year;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(Number(year), month - 1, 1));
}

/**
 * Project detail page - one static, indexable page per project.
 */
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const project = PROJECTS.find((entry) => entry.id === id);

  if (!project) {
    return <NotFound />;
  }

  const highlights = PROJECT_HIGHLIGHTS[project.id]?.[locale] ?? [];
  const isPrivate = project.status === "In Development";
  const url = `${SITE_URL}/projects/${project.id}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description[locale],
    url,
    dateCreated: project.month
      ? `${project.year}-${String(project.month).padStart(2, "0")}-01`
      : project.year,
    keywords: project.stack.join(", "),
    image: new URL(project.thumbnail, SITE_URL).toString(),
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: "M. Khaidar",
      url: SITE_URL,
    },
    sameAs: project.links
      .filter((link) => link.href !== "#")
      .map((link) => link.href),
  };

  return (
    <Layout>
      <SEOHead
        title={`${project.name} — ${project.status} | M. Khaidar`}
        description={buildDescription(project, locale)}
        url={`/projects/${project.id}`}
        type="article"
        noindex={isPrivate}
        structuredData={structuredData}
      />

      <div className="mb-2">
        <Link
          to="/projects"
          className="text-xs underline text-blue-800 hover:bg-blue-800 hover:text-white"
        >
          {t("projects.backToAll")}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <ProjectThumbnail
          project={project}
          width={160}
          height={160}
          className="border-2 border-retro-border-light w-40 h-40 object-cover shrink-0"
        />
        <div className="min-w-0">
          <h1 className="m-0 text-xl font-bold text-retro-blue-dark">
            {project.name}
          </h1>
          <p className="text-xs text-retro-text-muted mt-1 mb-2">
            {t("project.period")}:{" "}
            {formatPeriod(project.year, project.month, locale)}
            {" · "}
            {t("project.status")}: {project.status}
          </p>
          <p className="text-sm text-gray-700 mt-0">
            {project.description[locale]}
          </p>
        </div>
      </div>

      <Section id="highlights" title={t("project.highlights")}>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </Section>

      <Section id="stack" title={t("project.stack")}>
        <p className="m-0 text-sm text-gray-700">{project.stack.join(" · ")}</p>
      </Section>

      <Section id="links" title={t("project.links")}>
        {project.links.length === 0 ? (
          <p className="m-0 text-sm text-gray-700">{t("project.private")}</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {project.links.map((link) => (
              <li key={link.label}>
                {link.href === "#" ? (
                  <span className="text-gray-700">{t("project.private")}</span>
                ) : (
                  <a
                    href={link.href}
                    className="text-blue-800 underline hover:bg-blue-800 hover:text-white"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.label} ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </Layout>
  );
}
