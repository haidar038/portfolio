export interface FaqItem {
  id: string;
  question: { en: string; id: string };
  answer: { en: string; id: string };
}

/** Real questions about the work, stack, and availability. Answers stay
 *  within facts already stated elsewhere on the site. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "work",
    question: {
      en: "What does M. Khaidar do?",
      id: "Apa yang dikerjakan M. Khaidar?",
    },
    answer: {
      en: "I am a full-stack developer and product engineer based in Ternate, Indonesia. I build web applications from concept to production, focusing on React, TypeScript, and Supabase.",
      id: "Saya full-stack developer dan product engineer yang berbasis di Ternate, Indonesia. Saya membangun aplikasi web dari konsep hingga produksi, dengan fokus pada React, TypeScript, dan Supabase.",
    },
  },
  {
    id: "stack",
    question: {
      en: "What is your primary tech stack?",
      id: "Apa tech stack utama Anda?",
    },
    answer: {
      en: "React, TypeScript, Tailwind CSS, and Supabase are my main tools. I also work with Vite, Astro, SQL databases, and AI APIs such as Groq.",
      id: "React, TypeScript, Tailwind CSS, dan Supabase adalah tools utama saya. Saya juga bekerja dengan Vite, Astro, database SQL, dan API AI seperti Groq.",
    },
  },
  {
    id: "availability",
    question: {
      en: "Are you available for freelance or collaboration?",
      id: "Apakah Anda terbuka untuk freelance atau kolaborasi?",
    },
    answer: {
      en: "Yes. I am open to freelance projects, product collaborations, or a conversation about a product idea. The contact form and email are the fastest way to reach me.",
      id: "Ya. Saya terbuka untuk proyek freelance, kolaborasi produk, atau diskusi tentang ide produk. Form kontak dan email adalah cara tercepat untuk menghubungi saya.",
    },
  },
  {
    id: "process",
    question: {
      en: "How do you approach product work?",
      id: "Bagaimana pendekatan Anda dalam mengerjakan produk?",
    },
    answer: {
      en: "I start with the problem and the smallest useful version, then iterate through prototypes, real usage, and feedback. Design and implementation happen together rather than as separate phases.",
      id: "Saya mulai dari masalah dan versi paling kecil yang berguna, lalu beriterasi lewat prototype, penggunaan nyata, dan feedback. Desain dan implementasi berjalan bersama, bukan sebagai fase terpisah.",
    },
  },
  {
    id: "more-work",
    question: {
      en: "Where can I see more of your work?",
      id: "Di mana saya bisa melihat karya lainnya?",
    },
    answer: {
      en: "The projects page lists every project with its stack and links. You can also find code on GitHub and writing on Cup of Code.",
      id: "Halaman proyek mencantumkan semua proyek beserta stack dan tautannya. Kode tersedia di GitHub dan tulisan di Cup of Code.",
    },
  },
];
