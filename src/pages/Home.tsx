import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import AboutSection from "../components/AboutSection";
import JourneySection from "../components/JourneySection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import ContactSection from "../components/ContactSection";
import { useI18n } from "../i18n/useI18n";

const HOME_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://hydr.codes/#person",
      name: "M. Khaidar",
      url: "https://hydr.codes/",
      image: "https://hydr.codes/profilepicture.avif",
      jobTitle: "Full-Stack Developer & Product Engineer",
    },
    {
      "@type": "WebSite",
      "@id": "https://hydr.codes/#website",
      url: "https://hydr.codes/",
      name: "M. Khaidar Portfolio",
      inLanguage: ["en", "id"],
      publisher: { "@id": "https://hydr.codes/#person" },
    },
  ],
};

/**
 * Home page - renders all portfolio sections.
 * Validates: Requirements 10.1
 */
export default function Home() {
  const { t } = useI18n();

  return (
    <Layout>
      <SEOHead
        title={t("seo.homeTitle")}
        description={t("seo.homeDescription")}
        url="https://hydr.codes/"
        structuredData={HOME_STRUCTURED_DATA}
      />
      <AboutSection />
      <JourneySection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </Layout>
  );
}
