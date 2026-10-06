/* Canonical project dataset — single source of truth for portfolio content.
 * UI strings stay in src/i18n/locales/*, professional content lives here
 * as bilingual { en, id } fields. Components only map() this data.
 *
 * Month reflects the latest verified major iteration/deployment when known.
 * Entries are ordered newest-first.
 */

export type ProjectStatus = "Live Now" | "Live Demo" | "In Development";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  featured?: boolean;
  year: string;
  /** Month 1-12 for newest-first tracking. Missing month sorts as oldest within its year. */
  month?: number;
  description: { en: string; id: string };
  stack: string[];
  links: ProjectLink[];
  status: ProjectStatus;
  /** Primary hosted image URL. Falls back to the local SVG thumbnail when unset or unavailable. */
  thumbnailUrl?: string;
  thumbnail: string;
}

export const PROJECTS: ProjectEntry[] = [
  {
    id: "cupofcode",
    name: "Cup of Code",
    featured: true,
    year: "2026",
    month: 6,
    description: {
      id: "Publication dan resource gratis untuk software development, UI/UX design, dan AI-assisted development. Menyediakan artikel, tutorial, snippets, dan aset digital untuk developer Indonesia.",
      en: "Free publication and resource platform for software development, UI/UX design, and AI-assisted development, featuring articles, tutorials, snippets, and digital assets for Indonesian developers.",
    },
    stack: ["Astro", "React", "Tailwind CSS", "TypeScript", "Keystatic"],
    links: [
      { label: "Live", href: "https://cupofcode.cc" },
      { label: "Github", href: "https://github.com/haidar038/cupofcode" },
    ],
    status: "Live Now",
    thumbnail: "/thumbnails/cupofcode.svg",
  },
  {
    id: "mdoc-builder",
    name: "mdoc Builder",
    featured: false,
    year: "2026",
    month: 8,
    description: {
      id: "Editor WYSIWYG berbasis browser untuk membuat dan mengedit file .mdoc yang kompatibel dengan Keystatic. Mendukung rich-text editing, YAML frontmatter, import, autosave, preview, dan export tanpa backend.",
      en: "Browser-based WYSIWYG editor for creating and editing Keystatic-compatible .mdoc files, with rich-text editing, YAML frontmatter, import, autosave, preview, and export without a backend.",
    },
    stack: ["React", "Vite", "TypeScript", "Tiptap", "Tailwind CSS"],
    links: [
      { label: "Live", href: "https://mdoc-builder.vercel.app" },
      { label: "Github", href: "https://github.com/haidar038/mdoc-builder" },
    ],
    status: "Live Now",
    thumbnail: "/thumbnails/mdoc-builder.svg",
  },
  {
    id: "cv4e1",
    name: "cv4every1",
    featured: true,
    year: "2026",
    month: 9,
    description: {
      id: "CV builder open-source dan local-first yang menghasilkan versi ATS-oriented dan Creative dari satu sumber data. Tanpa akun, tanpa backend wajib, dengan penyimpanan lokal, validasi data, dan workflow PDF.",
      en: "Open-source, local-first CV builder that generates ATS-oriented and Creative versions from one source of data, with no required account or backend and a privacy-focused local workflow.",
    },
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Zustand", "Dexie", "Vitest", "Playwright"],
    links: [
      { label: "Live", href: "https://cv4e1.vercel.app" },
      { label: "Github", href: "https://github.com/haidar038/cv4e1" },
    ],
    status: "Live Demo",
    thumbnail: "/thumbnails/cv4e1.svg",
  },
  {
    id: "univertex",
    name: "UniVertex",
    featured: true,
    year: "2026",
    month: 9,
    description: {
      id: "Platform e-voting untuk lingkungan kampus dengan role-based access untuk voter, admin, committee, dan observer. Mencakup workflow voting, hasil real-time, audit log, invitation flow, dan public results.",
      en: "Campus e-voting platform with role-based access for voters, admins, committees, and observers. Includes voting workflows, real-time results, audit logs, invitation flows, and public results.",
    },
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "shadcn/ui", "Supabase"],
    links: [
      { label: "Live", href: "https://univertex.vercel.app" },
      { label: "Github", href: "https://github.com/haidar038/univertex" },
    ],
    status: "Live Demo",
    thumbnail: "/thumbnails/univertex.svg",
  },
  {
    id: "personal-portfolio",
    name: "Personal Portfolio",
    year: "2026",
    description: {
      id: "Website portfolio pribadi untuk showcase project, skill, dan profile profesional. Dibangun sebagai eksperimen UI/UX yang terus diiterasi dan direfactor.",
      en: "Personal portfolio website for showcasing projects, skills, and professional profile. Built as an evolving UI/UX experiment with continuous iteration and refactoring.",
    },
    stack: ["Vite", "Tailwind CSS", "TypeScript"],
    links: [
      { label: "Github", href: "https://github.com/haidar038" },
      { label: "Live", href: "https://hydr.codes" },
    ],
    status: "Live Now",
    thumbnail: "/thumbnails/personal-portfolio.svg",
  },
  {
    id: "wargahub",
    name: "SasaHub",
    featured: false,
    year: "2025",
    month: 10,
    description: {
      id: "Platform civic/community untuk layanan publik digital, pengaduan, publikasi, dan manajemen warga. Menggunakan dashboard berbasis role dan workflow database-driven.",
      en: "Civic and community platform for digital public services, complaints, publications, and resident management with role-based, database-driven workflows.",
    },
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Supabase"],
    links: [{ label: "Live", href: "https://wargahub.biz.id" }],
    status: "Live Now",
    thumbnail: "/thumbnails/wargahub.svg",
  },
  {
    id: "warungly",
    name: "Warungly",
    year: "2025",
    month: 8,
    description: {
      id: "POS dan invoicing ringan untuk UMKM yang mencakup transaksi, inventory, laporan, analytics, dan AI Assistant. Fokus pada workflow bisnis yang sederhana namun tetap extensible.",
      en: "Lightweight POS and invoicing product for SMEs covering transactions, inventory, reporting, analytics, and an AI assistant, with a simple but extensible business workflow.",
    },
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "SQLite", "TOON", "Groq AI"],
    links: [{ label: "Private", href: "#" }],
    status: "In Development",
    thumbnail: "/thumbnails/warungly.svg",
  },
  {
    id: "binary-verse",
    name: "Binary Verse",
    featured: false,
    year: "2025",
    month: 7,
    description: {
      id: "Website company profile dan platform digital untuk studio software development. Menampilkan project, layanan, dan identitas Binary Verse dengan fokus pada product storytelling dan visual branding.",
      en: "Company profile website and digital platform for a software development studio, showcasing projects, services, and Binary Verse's identity through product storytelling and visual branding.",
    },
    stack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    links: [{ label: "Live", href: "https://binaryverse.com" }],
    status: "Live Now",
    thumbnail: "/thumbnails/binary-verse.svg",
  },
  {
    id: "smart-census",
    name: "Smart Census",
    year: "2025",
    description: {
      id: "Sistem sensus digital berbasis AI untuk pengelolaan data warga. Menggabungkan OCR/text recognition dan dashboard data untuk mengurangi input manual dan human error.",
      en: "AI-assisted digital census system for citizen data management, combining OCR/text recognition with a dashboard to reduce manual input and human error.",
    },
    stack: ["React", "Supabase", "Groq AI"],
    links: [{ label: "Private", href: "#" }],
    status: "In Development",
    thumbnail: "/thumbnails/smart-census.svg",
  },
  {
    id: "amtra-journey",
    name: "Amtra Journey",
    featured: true,
    year: "2025",
    description: {
      id: "Modernisasi website komersial tour & travel di Yogyakarta dengan arsitektur headless CMS menggunakan Sanity dan Supabase BaaS. Fokus pada responsive frontend dan content workflow.",
      en: "Commercial tour and travel website modernization in Yogyakarta using a headless CMS architecture with Sanity and Supabase BaaS, focused on responsive frontend delivery and content workflows.",
    },
    stack: ["React", "Vite", "Tailwind CSS", "Sanity", "Supabase"],
    links: [{ label: "Live", href: "https://amtrajourney.com" }],
    status: "Live Now",
    thumbnail: "/thumbnails/amtra-journey.svg",
  },
  {
    id: "pasiar-ternate",
    name: "PASIAR Ternate",
    year: "2024",
    month: 12,
    featured: true,
    description: {
      id: "Portal budaya dan informasi lokal Ternate. Migrasi dari WordPress ke React SPA dengan CMS custom berbasis Supabase untuk digitalisasi dan pengelolaan konten lokal.",
      en: "Ternate local culture and information portal migrated from WordPress to a React SPA with a custom Supabase-based CMS for local content digitization and management.",
    },
    stack: ["React", "Supabase", "Tailwind CSS"],
    links: [{ label: "Live", href: "https://pasiar.ternatekota.go.id" }],
    status: "Live Now",
    thumbnail: "/thumbnails/pasiar-ternate.svg",
  },
  {
    id: "modiv-eventcraft",
    name: "Modiv Eventcraft",
    year: "2025",
    description: {
      id: "Aplikasi perencanaan anggaran event dan manajemen vendor dengan budgeting interaktif, pemilihan vendor, dan export quotation.",
      en: "Event budgeting and vendor management app with interactive budgeting, vendor selection, and quotation export workflows.",
    },
    stack: ["React", "Supabase", "TypeScript"],
    links: [{ label: "Live", href: "https://modiv-eventcraft.vercel.app" }],
    status: "Live Demo",
    thumbnail: "/thumbnails/modiv-eventcraft.svg",
  },
  {
    id: "kagounga",
    name: "Kagounga",
    featured: true,
    year: "2025",
    month: 12,
    description: {
      id: "Website commercial brand untuk produk lokal berbasis React/Vite. Menonjolkan responsive UI implementation, visual branding, storytelling produk, dan production deployment.",
      en: "Commercial brand website for a local product built with React/Vite, emphasizing responsive UI implementation, visual branding, product storytelling, and production deployment.",
    },
    stack: ["React", "Vite", "Tailwind CSS"],
    links: [{ label: "Live", href: "https://kagounga.netlify.app" }],
    status: "Live Now",
    thumbnail: "/thumbnails/kagounga.svg",
  },
  {
    id: "wikisnap",
    name: "WikiSnap",
    year: "2025",
    month: 5,
    description: {
      id: "Web tool untuk mengekstrak, merangkum, dan memarafrase konten dari halaman Wikipedia dengan bantuan AI.",
      en: "Web tool for extracting, summarizing, and AI-assisted paraphrasing of Wikipedia content.",
    },
    stack: ["React", "Groq AI", "TypeScript"],
    links: [{ label: "Live", href: "https://wikisnap.vercel.app" }],
    status: "Live Now",
    thumbnail: "/thumbnails/wikisnap.svg",
  },
  {
    id: "rindang",
    name: "RINDANG",
    featured: true,
    year: "2023",
    month: 10,
    description: {
      id: "Platform digital agriculture yang berkembang dari arsitektur monolithic Flask + MySQL ke arsitektur web modern. Menunjukkan pengalaman full-stack lintas stack, termasuk Flask, SQLAlchemy, MySQL, React, dan Supabase.",
      en: "Digital agriculture platform evolved from a Flask + MySQL monolith into a modern web architecture, demonstrating full-stack experience across Flask, SQLAlchemy, MySQL, React, and Supabase.",
    },
    stack: ["React", "Supabase", "Flask", "SQLAlchemy", "MySQL"],
    links: [{ label: "Live", href: "https://rindang.vercel.app" }],
    status: "Live Now",
    thumbnail: "/thumbnails/rindang.svg",
  },

  // ── EXPIRED / out of CV — kept commented for easy restore ──
  // {
  //   id: "jaga-bumi",
  //   name: "Jaga Bumi",
  //   year: "2025",
  //   description: {
  //     id: "Platform mobile manajemen sampah berbasis ekosistem. Multi-role (warga, kolektor, admin), pickup scheduling, reward system, dan in-app payments.",
  //     en: "Ecosystem-based mobile waste management platform. Multi-role (residents, collectors, admin) with pickup scheduling, rewards, and in-app payments.",
  //   },
  //   stack: ["React Native", "Supabase", "TypeScript"],
  //   links: [{ label: "Private", href: "#" }],
  //   status: "In Development",
  //   thumbnail: "/thumbnails/jaga-bumi.svg",
  // },
  // {
  //   id: "badonor",
  //   name: "BaDonor",
  //   year: "2025",
  //   description: {
  //     id: "Aplikasi mobile untuk menghubungkan pencari donor darah dengan pendonor secara real-time. Matching berdasarkan golongan darah dan lokasi.",
  //     en: "Mobile app connecting blood seekers with donors in real time, matching by blood type and location.",
  //   },
  //   stack: ["React Native", "Supabase", "TypeScript"],
  //   links: [{ label: "Private", href: "#" }],
  //   status: "In Development",
  //   thumbnail: "/thumbnails/badonor.svg",
  // },
  // {
  //   id: "sapulidi",
  //   name: "SapuLidi",
  //   year: "2025",
  //   description: {
  //     id: "Platform smart waste management berbasis web dengan AI untuk klasifikasi sampah dan edukasi pengguna.",
  //     en: "AI-powered smart waste management web platform for waste classification and user education.",
  //   },
  //   stack: ["React", "Groq AI", "LLaMA", "Supabase"],
  //   links: [{ label: "Github", href: "https://sapulidiapp.vercel.app" }],
  //   status: "Live Demo",
  //   thumbnail: "/thumbnails/sapulidi.svg",
  // },
  // {
  //   id: "shortlink",
  //   name: "ShortLink",
  //   year: "2025",
  //   description: {
  //     id: "URL shortener dengan authentication, custom short URL, dashboard tracking, dan manajemen link.",
  //     en: "URL shortener with authentication, custom short URLs, tracking dashboard, and link management.",
  //   },
  //   stack: ["React", "Supabase", "TypeScript"],
  //   links: [{ label: "Live", href: "https://sl2.my.id" }],
  //   status: "Live Now",
  //   thumbnail: "/thumbnails/shortlink.svg",
  // },
];
