export const TECH_STACK = [
    { category: "Frontend", items: ["React (Vite)", "Svelte", "SolidJS", "TypeScript", "Tailwind CSS", "Supabase", "shadcn/ui", "Figma"] },
    { category: "Backend & Data", items: ["Supabase", "PostgreSQL", "REST API", "Node.js", "Flask", "Python"] },
    { category: "AI Tools & Integration", items: ["Gemini", "Claude", "ChatGPT", "Hugging Face", "Antigravity", "Kiro", "Cline", "Groq API", "LLM (LLaMA)", "OCR & Text Recognition"] },
    { category: "Deployment", items: ["Git & GitHub", "Vercel", "Rapid Prototyping"] },
] as const;

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Skill {
    name: string;
    level: SkillLevel;
}

export const SKILLS: Skill[] = [
    { name: "HTML / CSS", level: "expert" },
    { name: "Tailwind CSS", level: "expert" },
    { name: "UI/UX Design", level: "advanced" },
    { name: "AI Tools & Integration", level: "advanced" },
    { name: "Supabase", level: "advanced" },
    { name: "TypeScript", level: "intermediate" },
    { name: "Node.js", level: "intermediate" },
    { name: "Flask", level: "intermediate" },
    { name: "Python", level: "intermediate" },
    { name: "React / Vite", level: "intermediate" },
];
