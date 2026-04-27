import { type ReactNode } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import Marquee from "./Marquee";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useI18n } from "../i18n/useI18n";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout wrapper - handles page structure.
 * Implements the classic 2-column (sidebar + content) layout
 * using flexbox, responsive-first.
 */
export default function Layout({ children }: LayoutProps) {
  const { t } = useI18n();

  return (
    <div className="max-w-6xl mx-auto bg-retro-panel-bg border-t-2 border-l-2 border-r-2 border-b-2 border-retro-border-dark">
      {/* Header Banner */}
      <Header />

      {/* Navigation Bar */}
      <Navigation />

      {/* Marquee Announcement */}
      <Marquee text={t("marquee.text")} />

      {/* Main 2-column area */}
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Sidebar - shown on md+, collapsible on mobile */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-3 bg-retro-content-bg min-w-0">
          {children}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
