/* Canonical education dataset — single source of truth for journey content.
   UI strings stay in src/i18n/locales/*, professional content lives here
   as bilingual { en, id } fields. Components only map() this data. */

export interface JourneyEntry {
  id: string;
  period: { en: string; id: string };
  title: { en: string; id: string };
  institution: { en: string; id: string };
  description: { en: string; id: string };
}

export const JOURNEY_DATA: JourneyEntry[] = [
  {
    id: "bcs-informatics",
    period: { en: "Ongoing", id: "Berjalan" },
    title: { en: "BCS - Informatics Engineering", id: "S1 - Teknik Informatika" },
    institution: {
      en: "Universitas Muhammadiyah Maluku Utara",
      id: "Universitas Muhammadiyah Maluku Utara",
    },
    description: {
      en: "Currently pursuing a degree in Informatics Engineering, focusing on software engineering, databases, data structures, and modern web development. Actively building real-world products alongside academic studies.",
      id: "Sedang menempuh pendidikan Teknik Informatika, fokus pada software engineering, database, struktur data, dan web development modern. Aktif membangun produk nyata di sela studi akademik.",
    },
  },
  {
    id: "sma-ternate",
    period: { en: "Graduated", id: "Lulus" },
    title: { en: "SMA Muhammadiyah Ternate", id: "SMA Muhammadiyah Ternate" },
    institution: {
      en: "SMA Muhammadiyah Ternate",
      id: "SMA Muhammadiyah Ternate",
    },
    description: {
      en: "Graduated with a score of 85/100. Built a strong foundation in analytical thinking and developed early interests in technology and design.",
      id: "Lulus dengan nilai 85/100. Membangun fondasi berpikir analitis yang kuat dan minat awal di teknologi dan desain.",
    },
  },
  {
    id: "self-directed",
    period: { en: "Self-directed", id: "Mandiri" },
    title: { en: "Full-Stack Developer & Product Engineering", id: "Full-Stack Developer & Product Engineering" },
    institution: {
      en: "Self-taught / Project-based Learning",
      id: "Otodidak / Pembelajaran Berbasis Proyek",
    },
    description: {
      en: "Deep-dived into React, TypeScript, Supabase, Tailwind CSS, and modern SPA architecture. Mastered rapid prototyping, AI integration (Groq, LLM, OCR), and full-stack deployment on Vercel. Learned by building 10+ real products.",
      id: "Mendalami React, TypeScript, Supabase, Tailwind CSS, dan arsitektur SPA modern. Menguasai rapid prototyping, integrasi AI (Groq, LLM, OCR), dan deployment full-stack di Vercel. Belajar dengan membangun 10+ produk nyata.",
    },
  },
];
