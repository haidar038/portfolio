import { type ReactNode } from "react";
import Section from "./Section";
import { useI18n } from "../i18n/useI18n";

interface JobEntry {
  title: string;
  type: string;
  period: string;
  company: string;
  location: string;
  bullets: string[];
  tags: string;
  featured?: boolean;
}

const JOBS: JobEntry[] = [
  {
    title: "CEO & CTO",
    type: "Founder",
    period: "~2025 – Present",
    company: "Binary Verse",
    location: "Ternate, Maluku Utara",
    featured: true,
    bullets: [
      "Founded and lead a digital product studio building real-world web-based solutions",
      "Initiate and develop products from ideation through production - covering design, full-stack development, and deployment",
      "Define system architecture, tech stack decisions, and AI integration strategy (LLM, OCR, automation)",
      "Rapidly prototype and ship multiple SPAs including Smart Census, Wargahub, SapuLidi, Warungly, and more",
      "Direct visual design, UX, and product positioning - ensuring every product feels right and solves real problems",
    ],
    tags: "React · TypeScript · Supabase · Groq AI · Vercel · Product Engineering",
  },
  {
    title: "Visual Jockey & Graphic Designer",
    type: "Contract",
    period: "Dec 2025 – Present",
    company: "Linea Inc. (Creative Agency)",
    location: "Remote",
    bullets: [
      "Control live LED videotron visuals for events and productions",
      "Produce visual content for clients including branding and identity design",
      "Combine technical visual control with creative direction in high-pressure event environments",
    ],
    tags: "Visual Design · Live Production · Branding · LED Control",
  },
  {
    title: "Graphic Designer",
    type: "Full-time",
    period: "Jun 2023 – Jun 2024",
    company: "PT. Bintang Muara Kieraha (Muara Group)",
    location: "Ternate, Maluku Utara",
    bullets: [
      "Handled visual design needs across multiple business units: retail, cosmetics, mart, and hotel",
      "Produced promotional materials including banners, posters, and social media content",
      "Maintained brand consistency across diverse product lines and audiences",
    ],
    tags: "Graphic Design · Branding · Multi-unit Visual Strategy",
  },
  {
    title: "Graphic Designer & Web Developer",
    type: "Part-time",
    period: "Mar 2022 – Present",
    company: "Ternate Creative Space",
    location: "Ternate, Maluku Utara",
    bullets: [
      "Design visual materials for community needs (posters, flyers, digital content)",
      "Contribute to web development projects with focus on usability and communication",
      "Bridge the gap between visual communication and functional web design",
    ],
    tags: "Graphic Design · Web Development · Community · UI/UX",
  },
  {
    title: "English Teacher",
    type: "Internship",
    period: "Jan 2023 – Feb 2023",
    company: "Thongkum Wittaya Nusorn School",
    location: "Thailand",
    bullets: [
      "Taught English across multiple grade levels from elementary to high school",
      "Adapted communication strategies for cross-cultural classroom environments",
      "Developed lesson plans and engaging teaching materials for non-native speakers",
    ],
    tags: "Teaching · Cross-cultural Communication · Education",
  },
];

/**
 * Work Experience section with retro "win-raised" job cards.
 */
export default function ExperienceSection(): ReactNode {
  const { t } = useI18n();

  return (
    <Section id="experience" title={t("section.experience")}>
      {JOBS.map((job) => (
        <div
          key={`${job.company}-${job.title}`}
          className="p-3 mb-3 border-t-2 border-l-2 border-r-2 border-b-2 border-retro-border-light bg-retro-winface"
        >
          {/* Featured badge */}
          {job.featured && (
            <div className="text-retro-orange text-sm font-bold mb-1.5">
              {t("experience.featured")}
            </div>
          )}

          {/* Job title row */}
          <div className="flex flex-col sm:flex-row justify-between gap-1.5">
            <div>
              <b className="text-lg font-sans">{job.title}</b>
              <span className="text-sm text-retro-text-muted ml-1.5">
                ({job.type})
              </span>
            </div>
            <div className="text-sm text-retro-text-muted whitespace-nowrap">
              {job.period}
            </div>
          </div>

          {/* Company */}
          <div className="text-retro-blue-accent text-sm mt-1 mb-1.5 font-bold">
            {job.company} - {job.location}
          </div>

          <div className="retro-hr" />

          {/* Bullet points */}
          <ul className="list-disc ml-5 text-sm leading-loose m-0 mt-1.5 p-0">
            {job.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>

          {/* Tech tags */}
          <div className="mt-1.5 text-sm text-[#666]">
            <b>{t("experience.techTags")}</b> {job.tags}
          </div>
        </div>
      ))}
    </Section>
  );
}
