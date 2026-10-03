/* Canonical experience dataset — single source of truth for work history.
   UI strings stay in src/i18n/locales/*, professional content lives here
   as bilingual { en, id } fields. Components only map() this data. */

export interface JobEntry {
  id: string;
  title: { en: string; id: string };
  type: { en: string; id: string };
  period: string;
  company: string;
  location: string;
  bullets: { en: string[]; id: string[] };
  tags: string;
  featured?: boolean;
}

export const JOBS: JobEntry[] = [
  {
    id: "binary-verse",
    title: { en: "Founder & Product Engineer", id: "Founder & Product Engineer" },
    type: { en: "Full-time", id: "Penuh Waktu" },
    period: "~2025 - Present",
    company: "Binary Verse",
    location: "Ternate, Maluku Utara",
    featured: true,
    bullets: {
      en: [
        "Founded and lead a digital product studio building real-world web-based solutions",
        "Initiate and develop products from ideation through production - covering design, full-stack development, and deployment",
        "Define system architecture, tech stack decisions, and AI integration strategy (LLM, OCR, automation)",
        "Rapidly prototype and ship multiple SPAs including Smart Census, Wargahub, SapuLidi, Warungly, and more",
        "Direct visual design, UX, and product positioning - ensuring every product feels right and solves real problems",
      ],
      id: [
        "Mendirikan dan memimpin studio produk digital yang membangun solusi web untuk kebutuhan nyata",
        "Menggagas dan mengembangkan produk dari ideasi hingga produksi - mencakup desain, full-stack development, dan deployment",
        "Menentukan arsitektur sistem, keputusan tech stack, dan strategi integrasi AI (LLM, OCR, automasi)",
        "Membuat prototipe dan merilis banyak SPA dengan cepat termasuk Smart Census, Wargahub, SapuLidi, Warungly, dan lainnya",
        "Mengarahkan desain visual, UX, dan positioning produk - memastikan setiap produk terasa tepat dan memecahkan masalah nyata",
      ],
    },
    tags: "React · TypeScript · Supabase · Groq AI · Vercel · Product Engineering",
  },
  // {
  //   id: "linea",
  //   title: { en: "Visual Jockey & Graphic Designer", id: "Visual Jockey & Desainer Grafis" },
  //   type: { en: "Contract", id: "Kontrak" },
  //   period: "Dec 2025 - Present",
  //   company: "Linea Inc. (Creative Agency)",
  //   location: "Remote",
  //   bullets: {
  //     en: [
  //       "Control live LED videotron visuals for events and productions",
  //       "Produce visual content for clients including branding and identity design",
  //       "Combine technical visual control with creative direction in high-pressure event environments",
  //     ],
  //     id: [
  //       "Mengendalikan visual videotron LED live untuk event dan produksi",
  //       "Memproduksi konten visual untuk klien termasuk branding dan desain identitas",
  //       "Memadukan kontrol visual teknis dengan arahan kreatif di lingkungan event bertekanan tinggi",
  //     ],
  //   },
  //   tags: "Visual Design · Live Production · Branding · LED Control",
  // },
  {
    id: "muara-group",
    title: { en: "Graphic Designer", id: "Desainer Grafis" },
    type: { en: "Full-time", id: "Penuh Waktu" },
    period: "Jun 2023 - Jun 2024",
    company: "PT. Bintang Muara Kieraha (Muara Group | Retail, Cosmetics, Mart, Hotel)",
    location: "Ternate, Maluku Utara",
    bullets: {
      en: [
        "Handled visual design needs across multiple business units: retail, cosmetics, mart, and hotel",
        "Produced promotional materials including banners, posters, and social media content",
        "Maintained brand consistency across diverse product lines and audiences",
      ],
      id: [
        "Menangani kebutuhan desain visual lintas unit bisnis: retail, kosmetik, mart, dan hotel",
        "Memproduksi materi promosi termasuk banner, poster, dan konten media sosial",
        "Menjaga konsistensi brand di beragam lini produk dan audiens",
      ],
    },
    tags: "Graphic Design · Branding · Multi-unit Visual Strategy",
  },
  {
    id: "ternate-creative-space",
    title: { en: "Graphic Designer & Web Developer", id: "Desainer Grafis & Web Developer" },
    type: { en: "Part-time", id: "Paruh Waktu" },
    period: "Mar 2022 - Present",
    company: "Ternate Creative Space",
    location: "Ternate, Maluku Utara",
    bullets: {
      en: [
        "Design visual materials for community needs (posters, flyers, digital content)",
        "Contribute to web development projects with focus on usability and communication",
        "Bridge the gap between visual communication and functional web design",
      ],
      id: [
        "Mendesain materi visual untuk kebutuhan komunitas (poster, flyer, konten digital)",
        "Berkontribusi di proyek pengembangan web dengan fokus pada usability dan komunikasi",
        "Menjembatani komunikasi visual dan desain web yang fungsional",
      ],
    },
    tags: "Graphic Design · Web Development · Community · UI/UX",
  },
  {
    id: "english-teacher",
    title: { en: "English Teacher", id: "Guru Bahasa Inggris" },
    type: { en: "Internship", id: "Magang" },
    period: "Jan 2023 - Feb 2023",
    company: "Thongkum Wittaya Nusorn School",
    location: "Thailand",
    bullets: {
      en: [
        "Taught English across multiple grade levels from elementary to high school",
        "Adapted communication strategies for cross-cultural classroom environments",
        "Developed lesson plans and engaging teaching materials for non-native speakers",
      ],
      id: [
        "Mengajar bahasa Inggris di berbagai jenjang dari SD sampai SMA",
        "Menyesuaikan strategi komunikasi untuk kelas lintas budaya",
        "Menyusun rencana pembelajaran dan materi ajar yang menarik untuk penutur non-natif",
      ],
    },
    tags: "Teaching · Cross-cultural Communication · Education",
  },
];
