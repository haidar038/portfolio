import Section from "./Section";
import { useI18n } from "../i18n/useI18n";
import type { Translations } from "../i18n/types";
import { TECH_STACK } from "../data/techStack";
import OldIcon from "./OldIcon";

/**
 * Map TECH_STACK category names to their i18n translation keys.
 * Using `keyof Translations` ensures type safety with the t() function.
 */
const CATEGORY_KEYS: Record<string, keyof Translations> = {
  Frontend: "about.frontend",
  "Backend & Data": "about.backend",
  "AI Tools & Integration": "about.ai",
  Deployment: "about.tools",
};

/**
 * About Me section with avatar, bio, info table, and tech stack display.
 */
export default function AboutSection() {
  const { t } = useI18n();

  return (
    <Section id="about" title={t("section.aboutMe")}>
      {/* Avatar + Bio row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar */}
        <div className="flex flex-col items-center shrink-0 sm:self-stretch">
          <div
            className="overflow-hidden w-36 flex-1 min-h-0
             border-t-2 border-l-2 border-r-2 border-b-2 border-retro-border-light
             bg-linear-to-br from-retro-blue-nav to-retro-header-bg"
          >
            <img src="/profilepicture.avif" alt="M. Khaidar" className="w-full h-full object-cover" />
          </div>
          <div className="text-xs text-retro-text-dim text-center mt-1">[haidar_photo.avif]</div>
        </div>

        {/* Bio text */}
        <div className="text-sm leading-relaxed">
          <p className="m-0 mb-2" dangerouslySetInnerHTML={{ __html: t("about.p1") }} />
          <p className="m-0 mb-2" dangerouslySetInnerHTML={{ __html: t("about.p2") }} />
          <p className="m-0" dangerouslySetInnerHTML={{ __html: t("about.p3") }} />
        </div>
      </div>

      {/* Divider */}
      <div className="retro-hr my-3" />

      {/* Info table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-0 gap-x-4 text-sm leading-loose">
        <div>
          <b>{t("about.fullName")}</b> M. Khaidar
        </div>
        <div>
          <b>{t("about.languages")}</b> Indonesia, English
        </div>
        <div>
          <b>{t("about.basedIn")}</b> {t("about.basedInValue")} <OldIcon name="Windows2000MyNetworkPlaces" size={16} style={{ verticalAlign: "-2px" }} alt="Indonesia" />
        </div>
        <div>
          <b>{t("about.pronouns")}</b> He / Him
        </div>
        <div>
          <b>{t("about.role")}</b> <span className="text-retro-blue-accent font-bold">✔ Full-Stack JS Developer & Product Engineer</span>
        </div>
        <div>
          <b>{t("about.primaryStack")}</b> React · Supabase · TypeScript
        </div>
        <div>
          <b>{t("about.education")}</b> Computer Science, Univ. Muhammadiyah Maluku Utara
        </div>
        <div>
          <b>{t("about.focus")}</b> SPA Development, AI Integration, Product Engineering
        </div>
      </div>

      {/* Divider */}
      <div className="retro-hr my-3" />

      {/* Tech Stack Section */}
      <div>
        <div className="bg-retro-blue-dark text-white text-sm font-bold py-1 px-3 tracking-wide mb-3 font-sans">▶ {t("about.techStack")}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TECH_STACK.map((group) => {
            const translationKey = CATEGORY_KEYS[group.category];
            return (
              <div key={group.category} className="border-t border-l border-b border-r border-retro-border-light bg-[#f8f8f8] p-3">
                <div className="text-retro-blue-accent font-bold text-sm mb-2 font-sans">▸ {translationKey ? t(translationKey) : group.category}</div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span key={item} className="bg-retro-winface text-sm px-2 py-0.5 border-t border-l border-white border-b border-r">{item}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quote */}
      <div className="mt-4 pl-4 italic text-sm text-retro-text-muted bg-[#f0f4ff] p-3 ">{t("about.quote")}</div>
    </Section>
  );
}
