import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import AboutSection from "../components/AboutSection";
import JourneySection from "../components/JourneySection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import ContactSection from "../components/ContactSection";

/**
 * Home page - renders all portfolio sections.
 * Validates: Requirements 10.1
 */
export default function Home() {
  return (
    <Layout>
      <SEOHead
        title="M. Khaidar - Full-Stack Developer Portfolio"
        description="Personal portfolio of M. Khaidar — Full-Stack Developer specializing in React, TypeScript, and modern web technologies. Explore my projects, experience, and journey."
        url="https://hydr.codes/"
      />
      <AboutSection />
      <JourneySection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </Layout>
  );
}
