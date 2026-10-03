/* Canonical project dataset — single source of truth for portfolio content.
   UI strings stay in src/i18n/locales/*, professional content lives here
   as bilingual { en, id } fields. Components only map() this data.
   Commented-out entries are expired / out of CV (kept for easy restore). */

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
  /** Month 1-12 for newest-first tracking. Optional until confirmed — missing sorts as oldest within its year and displays year only. */
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
    id: "rindang",
    name: "Rindang",
    featured: true,
    year: "2023",
    month: 10,
    description: {
      id: "Platform digital farming. Migrasi dari arsitektur monolithic (Flask + MySQL) ke stack modern SPA. Peningkatan performa, scalability, dan UI/UX yang lebih clean.",
      en: "Digital farming platform. Migrated from a monolithic architecture (Flask + MySQL) to a modern SPA stack with better performance, scalability, and cleaner UI/UX.",
    },
    stack: ["React", "Supabase", "Vercel"],
    links: [{ label: "Live", href: "https://rindang.vercel.app" }],
    status: "Live Now",
    thumbnail: "/thumbnails/rindang.svg",
  },
  {
    id: "wargahub",
    name: "Wargahub",
    featured: false,
    year: "2025",
    month: 10,
    description: {
      id: "Platform manajemen desa terintegrasi. Layanan publik digital, sistem pengaduan, publikasi, dan manajemen warga dengan role-based dashboard (admin, staff, warga). Terintegrasi dengan Smart Census.",
      en: "Integrated village management platform. Digital public services, complaint system, publications, and citizen management with role-based dashboards (admin, staff, residents). Integrated with Smart Census.",
    },
    stack: ["React", "Supabase", "TypeScript"],
    links: [{ label: "Live", href: "https://wargahub.biz.id" }],
    status: "Live Now",
    thumbnail: "/thumbnails/wargahub.svg",
  },
  {
    id: "warungly",
    name: "Warungly",
    featured: false,
    year: "2025",
    month: 8,
    description: {
      id: "Web-based POS System dengan fitur lengkap: transaksi, inventory management, laporan keuangan, reporting & analytics, dan AI Assistant. Lightweight yet powerful business OS for UMKM.",
      en: "Full-featured web-based POS: transactions, inventory management, financial reports, analytics, and AI assistant. A lightweight yet powerful business OS for SMEs.",
    },
    stack: ["Vite", "SQLite", "TypeScript"],
    links: [{ label: "Private", href: "#" }],
    status: "In Development",
    thumbnail: "/thumbnails/warungly.svg",
  },
  {
    id: "binary-verse",
    name: "Binary Verse",
    featured: true,
    year: "2025",
    month: 7,
    description: {
      id: "Website company profile & platform digital untuk studio software development. Showcase project, layanan, dan tim. Branding visual kuat, storytelling produk digital.",
      en: "Company profile website & digital platform for a software development studio. Project showcase, services, and team. Strong visual branding and digital product storytelling.",
    },
    stack: ["React", "Vite", "Tailwind", "Vercel"],
    links: [{ label: "Live", href: "https://binaryverse.com" }],
    status: "Live Now",
    thumbnail: "/thumbnails/binary-verse.svg",
  },
  {
    id: "cupofcode",
    name: "Cup of Code",
    year: "2026",
    month: 6,
    description: {
      id: "Website mini blog .",
      en: "Personal blog & project showcase website. Built with Astro JS + Tailwind CSS as a retro-concept UI/UX experiment. Iterated often.",
    },
    stack: ["Astro", "Tailwind", "TypeScript"],
    links: [
      { label: "Github", href: "https://github.com/haidar038/cupofcode" }
    ],
    status: "In Development",
    thumbnail: "/thumbnails/cupofcode.svg",
  },
  {
    id: "smart-census",
    name: "Smart Census",
    year: "2025",
    description: {
      id: "Sistem sensus digital berbasis AI untuk instansi lokal. OCR + text recognition via Groq LLaMA untuk mengurangi human error dalam input data. Dashboard pengelolaan data warga.",
      en: "AI-powered digital census system for local agencies. OCR + text recognition via Groq LLaMA to reduce manual input errors, with a citizen data dashboard.",
    },
    stack: ["React", "Supabase", "Groq AI"],
    links: [{ label: "Private", href: "#" }],
    status: "In Development",
    thumbnail: "/thumbnails/smart-census.svg",
  },
  // ── EXPIRED / out of CV — kept commented for easy restore ──
  // {
  //   id: "jaga-bumi",
  //   name: "Jaga Bumi",
  //   year: "2025",
  //   description: {
  //     id: "Platform mobile manajemen sampah berbasis ekosistem. Multi-role (warga, kolektor, admin), pickup scheduling, reward system, dan in-app payments. Digital Waste Management Ecosystem for Indonesia.",
  //     en: "Ecosystem-based mobile waste management platform. Multi-role (residents, collectors, admin) with pickup scheduling, rewards, and in-app payments.",
  //   },
  //   stack: ["React", "Supabase", "TypeScript"],
  //   links: [{ label: "Private", href: "#" }],
  //   status: "In Development",
  //   thumbnail: "/thumbnails/jaga-bumi.svg",
  // },
  // {
  //   id: "badonor",
  //   name: "Badonor",
  //   year: "2025",
  //   description: {
  //     id: "Aplikasi mobile untuk menghubungkan pencari donor darah dengan pendonor secara real-time. Donor matching berdasarkan golongan darah dan lokasi. High-impact social product.",
  //     en: "Mobile app connecting blood seekers with donors in real time. Matching by blood type and location. High-impact social product.",
  //   },
  //   stack: ["React", "Supabase", "TypeScript"],
  //   links: [{ label: "Private", href: "#" }],
  //   status: "In Development",
  //   thumbnail: "/thumbnails/badonor.svg",
  // },
  // {
  //   id: "sapulidi",
  //   name: "SapuLidi",
  //   year: "2025",
  //   description: {
  //     id: "Platform smart waste management berbasis web dengan AI. Klasifikasi sampah berbasis gambar, AI chatbot untuk edukasi pengguna, integrasi Groq + LLaMA.",
  //     en: "AI-powered web-based smart waste management platform. Image-based waste classification, educational AI chatbot, Groq + LLaMA integration.",
  //   },
  //   stack: ["React", "Groq", "LLaMA", "Supabase"],
  //   links: [{ label: "GitHub", href: "https://sapulidiapp.vercel.app" }],
  //   status: "Live Demo",
  //   thumbnail: "/thumbnails/sapulidi.svg",
  // },
  {
    id: "amtra-journey",
    name: "Amtra Journey",
    year: "2025",
    featured: true,
    description: {
      id: "Website company profile & platform digital untuk tour & trip di Yogyakarta. Rebuild ke modern SPA, UI/UX storytelling untuk trust & engagement, mobile-first responsive design.",
      en: "Company profile website & digital platform for tours and trips in Yogyakarta. Rebuilt as a modern SPA with storytelling UI/UX for trust and engagement, mobile-first.",
    },
    stack: ["React", "Vite", "Tailwind", "Vercel"],
    links: [{ label: "Live", href: "https://amtrajourney.vercel.app" }],
    status: "Live Demo",
    thumbnail: "/thumbnails/amtra-journey.svg",
  },
  {
    id: "pasiar-ternate",
    name: "PASIAR Ternate",
    year: "2025",
    featured: true,
    description: {
      id: "Portal budaya dan informasi lokal Ternate. Migrasi dari WordPress ke React SPA dengan CMS custom berbasis Supabase. Digitalisasi konten lokal.",
      en: "Ternate local culture and information portal. Migrated from WordPress to a React SPA with a custom Supabase-based CMS. Local content digitalization.",
    },
    stack: ["React", "Supabase", "Tailwind"],
    links: [{ label: "Live", href: "https://pasiar.ternatekota.go.id" }],
    status: "Live Now",
    thumbnail: "/thumbnails/pasiar-ternate.svg",
  },
  {
    id: "modiv-eventcraft",
    name: "Modiv Eventcraft",
    year: "2025",
    description: {
      id: "Aplikasi perencanaan anggaran event dan manajemen vendor. Sistem budgeting interaktif, pemilihan vendor, dan export quotation. Real-world tool untuk event organizer.",
      en: "Event budget planning and vendor management app. Interactive budgeting, vendor selection, and quotation export. A real-world tool for event organizers.",
    },
    stack: ["React", "Supabase", "TypeScript"],
    links: [{ label: "Live", href: "https://modiv-eventcraft.vercel.app" }],
    status: "Live Demo",
    thumbnail: "/thumbnails/modiv-eventcraft.svg",
  },
  {
    id: "univertex",
    name: "UniVertex",
    year: "2025",
    description: {
      id: "Sistem e-voting untuk lingkungan kampus. Voting system transparan, role-based access (admin, voter), real-time data handling. Fokus pada integritas dan kepercayaan.",
      en: "E-voting system for campus environments. Transparent voting, role-based access (admin, voter), real-time data handling. Focused on integrity and trust.",
    },
    stack: ["React", "Supabase", "TypeScript"],
    links: [{ label: "Live", href: "https://univertex.vercel.app" }],
    status: "Live Demo",
    thumbnail: "/thumbnails/univertex.svg",
  },
  // {
  //   id: "shortlink",
  //   name: "ShortLink",
  //   year: "2025",
  //   description: {
  //     id: "URL shortener dengan authentication system. Custom short URL, dashboard tracking dan manajemen link. Fokus pada simplicity dan kecepatan akses.",
  //     en: "URL shortener with authentication. Custom short URLs, tracking dashboard and link management. Focused on simplicity and speed.",
  //   },
  //   stack: ["React", "Supabase", "TypeScript"],
  //   links: [{ label: "Live", href: "https://sl2.my.id" }],
  //   status: "Live Now",
  //   thumbnail: "/thumbnails/shortlink.svg",
  // },
  {
    id: "wikisnap",
    name: "WikiSnap",
    year: "2025",
    description: {
      id: "Tool berbasis web untuk mengekstrak dan memarafrase konten dari halaman Wikipedia. Input URL, parsing & summarization otomatis, AI-powered rephrasing.",
      en: "Web tool to extract and paraphrase Wikipedia content. Paste a URL for automatic parsing, summarization, and AI-powered rephrasing.",
    },
    stack: ["React", "Groq AI", "TypeScript"],
    links: [{ label: "Live", href: "https://wikisnap.vercel.app" }],
    status: "Live Now",
    thumbnail: "/thumbnails/wikisnap.svg",
  },
  {
    id: "kagounga",
    name: "Kagounga",
    year: "2025",
    description: {
      id: "Website brand UMKM untuk produk papeda. Landing page + artikel + e-commerce dengan dashboard admin terintegrasi. Branding visual kuat, storytelling produk lokal.",
      en: "SME brand website for papeda products. Landing page + articles + e-commerce with an integrated admin dashboard. Strong visual branding and local product storytelling.",
    },
    stack: ["React", "Supabase", "Tailwind"],
    links: [{ label: "Live", href: "https://kagounga.vercel.app" }],
    status: "Live Demo",
    thumbnail: "/thumbnails/kagounga.svg",
  },
  {
    id: "personal-portfolio",
    name: "Personal Portfolio",
    year: "2025",
    description: {
      id: "Website portfolio pribadi. Dibangun dengan Vite + Tailwind CSS, eksperimen UI/UX retro konsep. Showcase project dan skill. Iteratif dan sering di-refactor.",
      en: "Personal portfolio website. Built with Vite + Tailwind CSS as a retro-concept UI/UX experiment. Project and skill showcase, iterated often.",
    },
    stack: ["Vite", "Tailwind", "TypeScript"],
    links: [
      { label: "Github", href: "https://github.com/haidar038" },
      { label: "Live", href: "https://hydr.codes" },
    ],
    status: "Live Now",
    thumbnail: "/thumbnails/personal-portfolio.svg",
  },
];
