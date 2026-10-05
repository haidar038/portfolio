import { PROJECTS } from "./projects.js";

/* Compact knowledge injected into the Clippy system prompt.
   Derived from the canonical dataset (WS2) — only active projects.
   Layered retrieval: full dump replaced by query-aware subset so the
   brain stays relevant without wasting tokens. */

export type ClippyLocale = "en" | "id";

export const CLIPPY_TARGETS = [
  "about",
  "journey",
  "experience",
  "projects",
  "contact",
  "guestbook",
  "blogroll",
] as const;

export type ClippyTarget = (typeof CLIPPY_TARGETS)[number];

export function isClippyTarget(value: unknown): value is ClippyTarget {
  return typeof value === "string" && CLIPPY_TARGETS.includes(value as ClippyTarget);
}

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
    en: "Email haidar038@gmail.com (mailto:haidar038@gmail.com), GitHub https://github.com/haidar038, LinkedIn https://linkedin.com/in/haidar038, WhatsApp https://wa.me/+6281242024542, contact form at #contact. Usually replies within 24 hours.",
    id: "Email haidar038@gmail.com (mailto:haidar038@gmail.com), GitHub https://github.com/haidar038, LinkedIn https://linkedin.com/in/haidar038, WhatsApp https://wa.me/+6281242024542, formulir kontak di #contact. Biasanya balas dalam 24 jam.",
  },
};

/* Site map so Clippy can guide navigation instead of hallucinating anchors. */
const SITE_MAP: Record<ClippyLocale, string> = {
  en: "SECTIONS: #about (profile), #journey (education), #experience (work history), #projects (portfolio), #contact (contact form). PAGES: /guestbook (leave a message), /blogroll (curated links).",
  id: "SECTION: #about (profil), #journey (pendidikan), #experience (pengalaman kerja), #projects (portofolio), #contact (formulir kontak). HALAMAN: /guestbook (buku tamu), /blogroll (koleksi link).",
};

interface FaqEntry {
  a: { en: string; id: string };
  keywords: string[];
}

const FAQ: FaqEntry[] = [
  {
    a: {
      en: "Haidar is open for freelance, collaboration, and full-time product roles. Ping him via #contact.",
      id: "Haidar open buat freelance, kolaborasi, atau full-time. Senggol aja via #contact.",
    },
    keywords: ["hire", "freelance", "kolaborasi", "collab", "kerja", "job", "rekrut", "sewa", "jasa", "open"],
  },
  {
    a: {
      en: "Fastest contact: email haidar038@gmail.com or WhatsApp +62 812-4202-4542. Guestbook works too for a quick hello.",
      id: "Kontak tercepat: email haidar038@gmail.com atau WA +62 812-4202-4542. Buku tamu juga bisa buat say hi.",
    },
    keywords: ["kontak", "contact", "email", "wa", "whatsapp", "hubungi", "ngasih tau", "kasih tau", "reach", "hello", "halo"],
  },
  {
    a: {
      en: "Main stack: React + Vite + TS, Tailwind, Supabase/Postgres, Vercel/Docker, Gemini/Groq AI.",
      id: "Stack utama: React + Vite + TS, Tailwind, Supabase/Postgres, Vercel/Docker, Gemini/Groq AI.",
    },
    keywords: ["stack", "tech", "teknologi", "skill", "tools", "pakai", "pake", "framework", "bahasa"],
  },
  {
    a: {
      en: "Guestbook lives at #guestbook — drop a message so Haidar knows you stopped by.",
      id: "Buku tamu ada di #guestbook — tulis pesan biar Haidar tau lu mampir.",
    },
    keywords: ["guestbook", "buku tamu", "pesan", "message", "sign", "tamu"],
  },
];

/* Fillers that carry tone but no retrieval signal — ignored for scoring. */
const STOPWORDS = new Set([
  "sih", "nih", "deh", "dong", "kok", "tuh", "gitu", "gini", "banget",
  "yaudah", "emang", "udah", "udh", "aja", "the", "a", "an", "is", "are",
  "apa", "yang", "dan", "di", "ke", "dari", "itu", "ini", "kalo", "kalau",
]);

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\u00c0-\u024f\s]/gi, " ");
}

function tokensOf(query: string): string[] {
  return normalize(query)
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function scoreText(haystack: string, tokens: string[]): number {
  const hay = normalize(` ${haystack} `);
  let score = 0;
  for (const t of tokens) {
    if (hay.includes(` ${t} `) || hay.includes(t)) score += t.length > 4 ? 2 : 1;
  }
  return score;
}

/** Slang-aware retrieval: subset of projects + faqs relevant to the query. */
export function retrieveRelevantKnowledge(
  query: string,
  locale: ClippyLocale,
  limit = 3,
): { projects: ClippyKnowledge["projects"]; faqs: string[] } {
  const lang: ClippyLocale = locale === "id" ? "id" : "en";
  const tokens = tokensOf(query);
  if (tokens.length === 0) {
    return {
      projects: CLIPPY_KNOWLEDGE.projects.slice(0, limit),
      faqs: [],
    };
  }
  const rankedProjects = CLIPPY_KNOWLEDGE.projects
    .map((p) => ({
      p,
      s: scoreText(`${p.name} ${p.status} ${p.en} ${p.id} ${SITE_MAP[lang]}`, tokens),
    }))
    .sort((a, b) => b.s - a.s);
  const hasSignal = rankedProjects.some((r) => r.s > 0);
  const rankedFaqs = FAQ.map((f) => ({
    f,
    s: scoreText(`${f.a.en} ${f.a.id} ${f.keywords.join(" ")}`, tokens),
  }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 2);

  return {
    projects: (hasSignal ? rankedProjects : rankedProjects.slice(0, 0))
      .slice(0, limit)
      .map((r) => r.p),
    faqs: rankedFaqs.map((r) => r.f.a[lang]),
  };
}

/**
 * Layered knowledge block. With a query it returns profile + relevant
 * subset + contact/sitemap; without it falls back to the legacy full dump
 * so existing callers keep working.
 */
export function buildKnowledgeBlock(locale: ClippyLocale, query?: string): string {
  const lang: ClippyLocale = locale === "id" ? "id" : "en";
  if (!query || !query.trim()) {
    return [
      `PROFILE: ${CLIPPY_KNOWLEDGE.profile[lang]}`,
      `STACK: ${CLIPPY_KNOWLEDGE.stack.join(", ")}`,
      ...CLIPPY_KNOWLEDGE.projects.map(
        (p) => `- ${p.name} [${p.status}]: ${lang === "id" ? p.id : p.en}`,
      ),
      `CONTACT: ${CLIPPY_KNOWLEDGE.contact[lang]}`,
      SITE_MAP[lang],
    ].join("\n");
  }
  const { projects, faqs } = retrieveRelevantKnowledge(query, lang);
  const lines = [
    `PROFILE: ${CLIPPY_KNOWLEDGE.profile[lang]}`,
    `STACK: ${CLIPPY_KNOWLEDGE.stack.join(", ")}`,
  ];
  if (projects.length > 0) {
    lines.push("RELEVANT PROJECTS:");
    for (const p of projects) {
      lines.push(`- ${p.name} [${p.status}]: ${lang === "id" ? p.id : p.en}`);
    }
  } else {
    lines.push(
      `PROJECTS: ${CLIPPY_KNOWLEDGE.projects.map((p) => `${p.name} [${p.status}]`).join(", ")}`,
    );
  }
  if (faqs.length > 0) {
    lines.push("NOTES:");
    for (const f of faqs) lines.push(`- ${f}`);
  }
  lines.push(`CONTACT: ${CLIPPY_KNOWLEDGE.contact[lang]}`);
  lines.push(SITE_MAP[lang]);
  return lines.join("\n");
}
