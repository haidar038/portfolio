import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { useI18n } from "../i18n/useI18n";
import {
  BLOGROLL_LINKS,
  BLOGROLL_CATEGORIES,
  type BlogrollLink,
} from "../data/blogroll";

type CategoryKey = NonNullable<BlogrollLink["category"]>;

/**
 * Groups blogroll links by their category.
 */
function groupLinksByCategory(links: BlogrollLink[]): Record<CategoryKey, BlogrollLink[]> {
  const grouped: Record<CategoryKey, BlogrollLink[]> = {
    friend: [],
    community: [],
    inspiration: [],
    tool: [],
    resource: [],
  };

  for (const link of links) {
    const category = link.category ?? "resource";
    grouped[category].push(link);
  }

  return grouped;
}

/**
 * Blogroll page - displays curated links grouped by category.
 * Validates: Requirements 10.3
 */
export default function Blogroll() {
  const { t } = useI18n();
  const groupedLinks = groupLinksByCategory(BLOGROLL_LINKS);

  return (
    <Layout>
      <SEOHead
        title={t("seo.blogrollTitle")}
        description={t("seo.blogrollDescription")}
        url="https://hydr.codes/blogroll"
      />
      <div className="mb-4">
        <h1 className="text-lg font-bold text-retro-blue-dark mb-2">
          {t("blogroll.title")}
        </h1>
        <p className="text-sm text-gray-700 mb-4">
          {t("blogroll.description")}
        </p>
      </div>

      <div className="space-y-6">
        {(Object.keys(groupedLinks) as CategoryKey[]).map((category) => {
          const links = groupedLinks[category];
          if (links.length === 0) return null;

          return (
            <section key={category} className="mb-4">
              <h2 className="text-base font-bold text-retro-blue-dark border-b border-retro-border-mid pb-1 mb-3">
                {BLOGROLL_CATEGORIES[category]}
              </h2>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.url} className="border-t border-l border-retro-border-mid border-b border-r p-2 bg-retro-sidebar-bg">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-retro-blue-dark hover:underline font-medium"
                    >
                      {link.name}
                    </a>
                    {link.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {link.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Layout>
  );
}
