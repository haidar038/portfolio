import { useState, type ReactNode } from "react";
import Section from "./Section";
import { useI18n } from "../i18n/useI18n";

interface ProjectEntry {
  name: string;
  featured?: boolean;
  year: string;
  description: string;
  stack: string[];
  links: { label: string; href: string }[];
  active?: boolean;
  status?: string;
  thumbnail?: string;
}

const PROJECTS: ProjectEntry[] = [
  {
    name: "Rindang",
    featured: true,
    year: "2025",
    description:
      "Platform digital farming. Migrasi dari arsitektur monolithic (Flask + MySQL) ke stack modern SPA. Peningkatan performa, scalability, dan UI/UX yang lebih clean.",
    stack: ["React", "Supabase", "Vercel"],
    links: [{ label: "Live", href: "https://rindang.net" }],
    status: "Live Now",
    thumbnail: "/thumbnails/rindang.svg"
  },
  {
    name: "Wargahub",
    featured: true,
    year: "2025",
    description:
      "Platform manajemen desa terintegrasi. Layanan publik digital, sistem pengaduan, publikasi, dan manajemen warga dengan role-based dashboard (admin, staff, warga). Terintegrasi dengan Smart Census.",
    stack: ["React", "Supabase", "TypeScript"],
    links: [{ label: "Live", href: "https://wargahub.biz.id" }],
    status: "Live Now",
    thumbnail: "/thumbnails/wargahub.svg"
  },
  {
    name: "Warungly",
    featured: true,
    year: "2025",
    description:
      "Web-based POS System dengan fitur lengkap: transaksi, inventory management, laporan keuangan, reporting & analytics, dan AI Assistant. Lightweight yet powerful business OS for UMKM.",
    stack: ["Vite", "SQLite", "TypeScript"],
    links: [{ label: "Private", href: "#" }],
    status: "In Development",
    thumbnail: "/thumbnails/warungly.svg"
  },
  {
    name: "Smart Census",
    year: "2025",
    description:
      "Sistem sensus digital berbasis AI untuk instansi lokal. OCR + text recognition via Groq LLaMA untuk mengurangi human error dalam input data. Dashboard pengelolaan data warga.",
    stack: ["React", "Supabase", "Groq AI"],
    links: [{ label: "Private", href: "#" }],
    status: "In Development",
    thumbnail: "/thumbnails/smart-census.svg"
  },
  {
    name: "Jaga Bumi",
    year: "2025",
    description:
      "Platform mobile manajemen sampah berbasis ekosistem. Multi-role (warga, kolektor, admin), pickup scheduling, reward system, dan in-app payments. Digital Waste Management Ecosystem for Indonesia.",
    stack: ["React", "Supabase", "TypeScript"],
    links: [{ label: "Private", href: "#" }],
    status: "In Development",
    thumbnail: "/thumbnails/jaga-bumi.svg"
  },
  {
    name: "Badonor",
    year: "2025",
    description:
      "Aplikasi mobile untuk menghubungkan pencari donor darah dengan pendonor secara real-time. Donor matching berdasarkan golongan darah dan lokasi. High-impact social product.",
    stack: ["React", "Supabase", "TypeScript"],
    links: [{ label: "Private", href: "#" }],
    status: "In Development",
    thumbnail: "/thumbnails/badonor.svg"
  },
  {
    name: "SapuLidi",
    year: "2025",
    description:
      "Platform smart waste management berbasis web dengan AI. Klasifikasi sampah berbasis gambar, AI chatbot untuk edukasi pengguna, integrasi Groq + LLaMA.",
    stack: ["React", "Groq", "LLaMA", "Supabase"],
    links: [{ label: "GitHub", href: "https://sapulidiapp.vercel.app" }],
    status: "Live Demo",
    thumbnail: "/thumbnails/sapulidi.svg"
  },
  {
    name: "Amtra Journey",
    year: "2025",
    description:
      "Website company profile & platform digital untuk tour & trip di Yogyakarta. Rebuild ke modern SPA, UI/UX storytelling untuk trust & engagement, mobile-first responsive design.",
    stack: ["React", "Vite", "Tailwind", "Vercel"],
    links: [{ label: "Live", href: "https://amtrajourney.vercel.app" }],
    status: "Live Demo",
    thumbnail: "/thumbnails/amtra-journey.svg"
  },
  {
    name: "PASIAR Ternate",
    year: "2025",
    description:
      "Portal budaya dan informasi lokal Ternate. Migrasi dari WordPress ke React SPA dengan CMS custom berbasis Supabase. Digitalisasi konten lokal.",
    stack: ["React", "Supabase", "Tailwind"],
    links: [{ label: "Live", href: "https://pasiar.ternatekota.go.id" }],
    status: "Live Now",
    thumbnail: "/thumbnails/pasiar-ternate.svg"
  },
  {
    name: "Modiv Eventcraft",
    year: "2025",
    description:
      "Aplikasi perencanaan anggaran event dan manajemen vendor. Sistem budgeting interaktif, pemilihan vendor, dan export quotation. Real-world tool untuk event organizer.",
    stack: ["React", "Supabase", "TypeScript"],
    links: [{ label: "Live", href: "https://modiv-eventcraft.vercel.app" }],
    status: "Live Demo",
    thumbnail: "/thumbnails/modiv-eventcraft.svg"
  },
  {
    name: "UniVertex",
    year: "2025",
    description:
      "Sistem e-voting untuk lingkungan kampus. Voting system transparan, role-based access (admin, voter), real-time data handling. Fokus pada integritas dan kepercayaan.",
    stack: ["React", "Supabase", "TypeScript"],
    links: [{ label: "Live", href: "https://univertex.vercel.app" }],
    status: "Live Demo",
    thumbnail: "/thumbnails/univertex.svg"
  },
  {
    name: "ShortLink",
    year: "2025",
    description:
      "URL shortener dengan authentication system. Custom short URL, dashboard tracking dan manajemen link. Fokus pada simplicity dan kecepatan akses.",
    stack: ["React", "Supabase", "TypeScript"],
    links: [{ label: "Live", href: "https://sl2.my.id" }],
    status: "Live Now",
    thumbnail: "/thumbnails/shortlink.svg"
  },
  {
    name: "WikiSnap",
    year: "2025",
    description:
      "Tool berbasis web untuk mengekstrak dan memarafrase konten dari halaman Wikipedia. Input URL, parsing & summarization otomatis, AI-powered rephrasing.",
    stack: ["React", "Groq AI", "TypeScript"],
    links: [{ label: "Live", href: "https://wikisnap.vercel.app" }],
    status: "Live Now",
    thumbnail: "/thumbnails/wikisnap.svg"
  },
  {
    name: "Kagounga",
    year: "2025",
    description:
      "Website brand UMKM untuk produk papeda. Landing page + artikel + e-commerce dengan dashboard admin terintegrasi. Branding visual kuat, storytelling produk lokal.",
    stack: ["React", "Supabase", "Tailwind"],
    links: [{ label: "Live", href: "https://kagounga.vercel.app" }],
    status: "Live Demo",
    thumbnail: "/thumbnails/kagounga.svg"
  },
  {
    name: "Personal Portfolio",
    year: "2025",
    description:
      "Website portfolio pribadi. Dibangun dengan SolidJS + Tailwind CSS, eksperimen UI/UX retro konsep. Showcase project dan skill. Iteratif dan sering di-refactor.",
    stack: ["SolidJS", "Tailwind", "TypeScript"],
    links: [{ label: "Github", href: "https://github.com/haidar038" }, { label: "Live", href: "https://hydr.codes" }],
    status: "Live Now",
    thumbnail: "/thumbnails/personal-portfolio.svg"
  },
];

const ITEMS_PER_PAGE = 5;

/**
 * Projects / Portfolio section with retro data table and pagination.
 */
export default function ProjectsSection(): ReactNode {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(PROJECTS.length / ITEMS_PER_PAGE);
  const paginatedProjects = PROJECTS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const showing = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd = Math.min(currentPage * ITEMS_PER_PAGE, PROJECTS.length);

  return (
    <Section id="projects" title={t("section.projects")}>
      <div className="overflow-x-auto border-2 border-t-[#c8c8c8] border-l-[#c8c8c8] border-b-retro-border-dark border-r-retro-border-dark bg-white p-0.5">
        <table className="w-full border-collapse text-xs min-w-150">
          <thead>
            <tr className="bg-retro-blue-dark text-white text-xs border border-black">
              <td className="py-1 px-2 border-r border-black w-24 text-center font-bold">
                {t("projects.col.image")}
              </td>
              <td className="py-1 px-2 border-r border-black w-32 font-bold">
                {t("projects.col.name")}
              </td>
              <td className="py-1 px-2 border-r border-black font-bold">
                {t("projects.col.description")}
              </td>
              <td className="py-1 px-2 border-r border-black w-24 font-bold">
                {t("projects.col.stack")}
              </td>
              <td className="py-1 px-2 w-16 text-center font-bold">
                {t("projects.col.links")}
              </td>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.map((project, i) => {
              const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + i;
              return (
                <tr
                  key={project.name}
                  className={[
                    "hover:bg-retro-hover border border-black",
                    globalIndex % 2 === 0 ? "bg-retro-cream-bg" : "bg-retro-alt-row",
                  ].join(" ")}
                >
                  <td className="p-2 border-r border-black align-top text-center">
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      width={80}
                      height={60}
                      className="border border-black inline-block"
                      loading="lazy"
                      onError={(e) => {
                        const el = e.currentTarget;
                        if (el.src.endsWith("placeholder.svg")) return;
                        el.src = "/thumbnails/placeholder.svg";
                      }}
                    />
                  </td>
                  <td className="py-1 px-2 border-r border-black align-top">
                    <b>{project.name}</b>
                    {project.featured && (
                      <>
                        <br />
                        <span className="text-retro-orange text-xs font-bold">
                          {t("projects.featured")}
                        </span>
                      </>
                    )}
                    <br />
                    <span className="text-retro-text-muted text-xs">
                      {project.year}
                    </span>
                  </td>
                  <td className="py-1 px-2 border-r border-black leading-normal">
                    {project.description}
                    {project.status && (
                      <div className="mt-1">
                        <span
                          className={[
                            "text-[10px] px-1 border border-black inline-block",
                            project.status.includes("Live")
                              ? "bg-green-500 text-white"
                              : "bg-[#cc4444] text-white",
                          ].join(" ")}
                        >
                          {project.status.includes("Live") ? "✔" : "⚠"} {project.status}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-1 px-2 border-r border-black align-top text-xs leading-normal">
                    {project.stack.map((tech) => (
                      <span key={tech}>
                        {tech}
                        <br />
                      </span>
                    ))}
                  </td>
                  <td className="py-1 px-2 text-center align-top">
                    {project.links.map((link) => (
                      <span key={link.label}>
                        <a href={link.href} className="underline text-blue-800 hover:bg-blue-800 hover:text-white">[{link.label}]</a>
                        <br />
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mt-2">
        <div className="text-xs text-[#666]">
          {t("projects.showing")} {showing}-{showingEnd} {t("projects.of")} {PROJECTS.length}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            className="retro-btn text-xs px-2 py-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {t("projects.prev")}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={[
                "retro-btn text-xs px-1.5 py-0 cursor-pointer",
                page === currentPage ? "bg-retro-blue-dark text-white border-inset" : "",
              ].join(" ")}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="retro-btn text-xs px-2 py-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            {t("projects.next")}
          </button>
        </div>
      </div>

      <div className="mt-1 text-xs text-[#666]" dangerouslySetInnerHTML={{ __html: t("projects.footer") }} />
    </Section>
  );
}
