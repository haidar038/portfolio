import { useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import ProjectThumbnail from "../components/ProjectThumbnail";
import { useI18n } from "../i18n/useI18n";
import { PROJECTS, sortProjects } from "../data/projects";

const SITE_URL = "https://hydr.codes";

/**
 * Projects index - lists every project with its description, stack, and links.
 */
export default function Projects() {
  const { t, locale } = useI18n();
  const sorted = useMemo(() => sortProjects(PROJECTS), []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("seo.projectsTitle"),
    url: `${SITE_URL}/projects`,
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sorted.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.name,
        url: `${SITE_URL}/projects/${project.id}`,
      })),
    },
  };

  return (
    <Layout>
      <SEOHead
        title={t("seo.projectsTitle")}
        description={t("seo.projectsDescription")}
        url="/projects"
        structuredData={structuredData}
      />

      <div className="mb-3">
        <h1 className="text-lg font-bold text-retro-blue-dark mb-2">
          {t("projects.indexTitle")}
        </h1>
        <p className="text-sm text-gray-700">{t("projects.indexIntro")}</p>
      </div>

      <div className="space-y-2">
        {sorted.map((project) => (
          <article
            key={project.id}
            className="border-t-2 border-l-2 border-r-2 border-b-2 border-retro-border-light bg-retro-winface p-2"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <ProjectThumbnail
                project={project}
                width={96}
                height={96}
                loading="lazy"
                className="border border-black w-24 h-24 object-cover shrink-0"
              />
              <div className="min-w-0">
                <h2 className="m-0 text-sm font-bold font-sans">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-retro-blue-dark underline hover:bg-retro-blue-dark hover:text-white"
                  >
                    {project.name}
                  </Link>
                </h2>
                <p className="text-xs text-gray-700 mt-1 mb-1">
                  {project.description[locale]}
                </p>
                <p className="text-xs text-retro-text-muted m-0">
                  {project.year}
                  {project.month ? `-${String(project.month).padStart(2, "0")}` : ""}
                  {" · "}
                  {project.status}
                </p>
                <p className="text-xs text-retro-blue-accent mt-1 mb-1">
                  {project.stack.join(" · ")}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Link
                    to={`/projects/${project.id}`}
                    className="underline text-blue-800 hover:bg-blue-800 hover:text-white"
                  >
                    {t("projects.viewDetail")}
                  </Link>
                  {project.links
                    .filter((link) => link.href !== "#")
                    .map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="underline text-blue-800 hover:bg-blue-800 hover:text-white"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}
