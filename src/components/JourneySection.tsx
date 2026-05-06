import Section from "./Section";
import { useI18n } from "../i18n/useI18n";

interface JourneyEntry {
  period: string;
  title: string;
  institution: string;
  description: string;
}

const JOURNEY_DATA: JourneyEntry[] = [
  {
    period: "Ongoing",
    title: "BCS - Informatics Engineering (Teknik Informatika)",
    institution: "Universitas Muhammadiyah Maluku Utara",
    description:
      "Currently pursuing a degree in Informatics Engineering, focusing on software engineering, databases, data structures, and modern web development. Actively building real-world products alongside academic studies.",
  },
  {
    period: "Graduated",
    title: "SMA Muhammadiyah Ternate",
    institution: "SMA Muhammadiyah Ternate",
    description:
      "Graduated with a score of 85/100. Built a strong foundation in analytical thinking and developed early interests in technology and design.",
  },
  {
    period: "Self-directed",
    title: "Full-Stack JavaScript & Product Engineering",
    institution: "Self-taught / Project-based Learning",
    description:
      "Deep-dived into React, TypeScript, Supabase, Tailwind CSS, and modern SPA architecture. Mastered rapid prototyping, AI integration (Groq, LLM, OCR), and full-stack deployment on Vercel. Learned by building 15+ real products.",
  },
];

/**
 * Journey / Education section with a retro data table.
 */
export default function JourneySection() {
  const { t } = useI18n();

  return (
    <Section id="journey" title={t("section.journey")}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-retro-blue-nav text-white text-xs">
              <td className="py-1 px-2 border border-[#002244] w-24 font-bold">
                {t("journey.col.period")}
              </td>
              <td className="py-1 px-2 border border-[#002244] font-bold">
                {t("journey.col.education")}
              </td>
            </tr>
          </thead>
          <tbody>
            {JOURNEY_DATA.map((entry, index) => (
              <tr
                key={entry.period + entry.title}
                className={[
                  "hover:bg-retro-hover",
                  index % 2 === 0 ? "bg-retro-alt-row" : "",
                ].join(" ")}
              >
                <td className="py-1 px-2 border border-[#c8c8c8] align-top text-retro-blue-accent font-bold text-xs whitespace-nowrap">
                  {entry.period}
                </td>
                <td className="py-1 px-2 border border-[#c8c8c8] leading-normal">
                  <b>{entry.title}</b>
                  <br />
                  <span className="text-retro-blue-nav text-xs">{entry.institution}</span>
                  <br />
                  <span className="text-retro-text-muted text-xs">
                    {entry.description}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
