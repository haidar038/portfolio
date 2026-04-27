export interface BlogrollLink {
    name: string;
    url: string;
    description?: string;
    category?: "friend" | "community" | "inspiration" | "tool" | "resource";
}

export const BLOGROLL_LINKS: BlogrollLink[] = [
    // Friends & Colleagues
    {
        name: "Binary Verse",
        url: "https://bnrvrs.biz.id",
        description: "Product engineering lab — building digital products that matter",
        category: "friend",
    },

    // Communities
    {
        name: "Indonesia Developer Community",
        url: "https://discord.gg/indodev",
        description: "Indonesian developer community on Discord",
        category: "community",
    },

    // Inspiration
    {
        name: "Awwwards",
        url: "https://www.awwwards.com",
        description: "Recognition of talent and effort by web designers worldwide",
        category: "inspiration",
    },

    // Tools & Resources
    {
        name: "SolidJS",
        url: "https://www.solidjs.com",
        description: "Simple and performant reactivity for building user interfaces",
        category: "tool",
    },
    {
        name: "Firebase",
        url: "https://firebase.google.com",
        description: "Google's app development platform",
        category: "tool",
    },
    {
        name: "Tailwind CSS",
        url: "https://tailwindcss.com",
        description: "Utility-first CSS framework",
        category: "tool",
    },

    // Learning Resources
    {
        name: "MDN Web Docs",
        url: "https://developer.mozilla.org",
        description: "Resources for developers, by developers",
        category: "resource",
    },
    {
        name: "JavaScript.info",
        url: "https://javascript.info",
        description: "The Modern JavaScript Tutorial",
        category: "resource",
    },
];

export const BLOGROLL_CATEGORIES: Record<NonNullable<BlogrollLink["category"]>, string> = {
    friend: "Friends & Colleagues",
    community: "Communities",
    inspiration: "Inspiration",
    tool: "Tools & Services",
    resource: "Learning Resources",
};
