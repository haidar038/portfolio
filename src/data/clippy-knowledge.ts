import { PROJECTS } from "./projects.js";

/* Compact knowledge injected into the Clippy system prompt.
   Derived from the canonical dataset (WS2) — only active projects. */

export interface ClippyKnowledge {
  profile: { en: string; id: string };
  stack: string[];
  projects: { name: string; status: string; en: string; id: string }[];
  contact: { en: string; id: string };
}

export const CLIPPY_KNOWLEDGE: ClippyKnowledge = {
  profile: {
    en: "M. Khaidar, 24, Product Engineer & Full-Stack Developer from Ternate, Indonesia (WIT UTC+9). Founder of Binary Verse. UI/UX + graphic design background, builds products from concept to deployment.",
    id: "M. Khaidar, 24, Product Engineer & Full-Stack Developer dari Ternate, Indonesia (WIT UTC+9). Founder Binary Verse. Latar UI/UX + desain grafis, membangun produk dari konsep sampai deployment.",
  },
  stack: [
    "React (Vite + TS)",
    "Svelte",
    "SolidJS",
    "Tailwind CSS",
    "Supabase",
    "PostgreSQL",
    "Flask / Python",
    "Gemini / Groq AI",
    "Vercel",
    "Docker",
  ],
  projects: PROJECTS.filter((p) => p.links.some((l) => l.href !== "#")).map(
    (p) => ({ name: p.name, status: p.status, en: p.description.en, id: p.description.id }),
  ),
  contact: {
    en: "Email haidar038@gmail.com, GitHub github.com/haidar038, WhatsApp +62 812-4202-4542, contact form at #contact. Usually replies within 24 hours.",
    id: "Email haidar038@gmail.com, GitHub github.com/haidar038, WhatsApp +62 812-4202-4542, formulir kontak di #contact. Biasanya balas dalam 24 jam.",
  },
};

export function buildKnowledgeBlock(locale: "en" | "id"): string {
  const lang = locale === "id" ? "id" : "en";
  const lines = [
    `PROFILE: ${CLIPPY_KNOWLEDGE.profile[lang]}`,
    `STACK: ${CLIPPY_KNOWLEDGE.stack.join(", ")}`,
    ...CLIPPY_KNOWLEDGE.projects.map(
      (p) => `- ${p.name} [${p.status}]: ${lang === "id" ? p.id : p.en}`,
    ),
    `CONTACT: ${CLIPPY_KNOWLEDGE.contact[lang]}`,
  ];
  return lines.join("\n");
}
