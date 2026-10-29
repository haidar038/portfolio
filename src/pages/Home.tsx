import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import AboutSection from "../components/AboutSection";
import JourneySection from "../components/JourneySection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import FaqSection from "../components/FaqSection";
import ContactSection from "../components/ContactSection";
import { useI18n } from "../i18n/useI18n";
import { FAQ_ITEMS } from "../data/faq";

const PERSON_SCHEMA = {
  "@type": "Person",
  "@id": "https://hydr.codes/#person",
  name: "M. Khaidar",
  url: "https://hydr.codes/",
  image: "https://hydr.codes/profilepicture.avif",
  jobTitle: "Full-Stack Developer & Product Engineer",
  description:
    "Full-stack developer and product engineer based in Ternate, Indonesia, building web applications with React, TypeScript, and Supabase.",
  sameAs: [
    "https://github.com/haidar038",
    "https://linkedin.com/in/haidar038",
    "https://x.com/hdr038",
  ],
  knowsAbout: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "Full-stack development",
    "Product engineering",
  ],
};

const WEBSITE_SCHEMA = {
  "@type": "WebSite",
  "@id": "https://hydr.codes/#website",
  url: "https://hydr.codes/",
  name: "M. Khaidar Portfolio",
  inLanguage: ["en", "id"],
  publisher: { "@id": "https://hydr.codes/#person" },
};

/**
 * Home page - renders all portfolio sections.
 * Validates: Requirements 10.1
 */
export default function Home() {
  const { t, locale } = useI18n();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      PERSON_SCHEMA,
      WEBSITE_SCHEMA,
      {
        "@type": "FAQPage",
        "@id": "https://hydr.codes/#faq",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question[locale],
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer[locale],
          },
        })),
      },
    ],
  };

  return (
    <Layout>
      <SEOHead
        title={t("seo.homeTitle")}
        description={t("seo.homeDescription")}
        url="https://hydr.codes/"
        structuredData={structuredData}
      />
      <AboutSection />
      <JourneySection />
      <ExperienceSection />
      <ProjectsSection />
      <FaqSection />
      <ContactSection />
    </Layout>
  );
}
