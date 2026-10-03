import { type ReactNode } from "react";
import Section from "./Section";
import { useI18n } from "../i18n/useI18n";
import { JOBS } from "../data/experience";

/**
 * Work Experience section with retro "win-raised" job cards.
 */
export default function ExperienceSection(): ReactNode {
  const { t, locale } = useI18n();

  return (
    <Section id="experience" title={t("section.experience")}>
      {JOBS.map((job) => (
        <div
          key={job.id}
          className="p-2 mb-2 border-t-2 border-l-2 border-r-2 border-b-2 border-retro-border-light bg-retro-winface"
        >
          {/* Featured badge */}
          {job.featured && (
            <div className="text-retro-orange text-xs font-bold mb-1">
              {t("experience.featured")}
            </div>
          )}

          {/* Job title row */}
          <div className="flex flex-col sm:flex-row justify-between gap-0.5">
            <div>
              <b className="text-sm font-sans">{job.title[locale]}</b>
              <span className="text-xs text-retro-text-muted ml-1">
                ({job.type[locale]})
              </span>
            </div>
            <div className="text-xs text-retro-text-muted whitespace-nowrap">
              {job.period}
            </div>
          </div>

          {/* Company */}
          <div className="text-retro-blue-accent text-xs mt-0.5 mb-1 font-bold">
            {job.company} - {job.location}
          </div>

          <div className="retro-hr" />

          {/* Bullet points */}
          <ul className="list-disc ml-4 text-xs leading-normal m-0 mt-1 p-0">
            {job.bullets[locale].map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>

          {/* Tech tags */}
          <div className="mt-1 text-xs text-[#666]">
            <b>{t("experience.techTags")}</b> {job.tags}
          </div>
        </div>
      ))}
    </Section>
  );
}
