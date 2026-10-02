import { useEffect, type ReactNode } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import Marquee from "./Marquee";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useI18n } from "../i18n/useI18n";
import { wireRetroSounds } from "../lib/sound";

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

  useEffect(() => wireRetroSounds(), []);

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
        {/* Main Content - Moves to top on mobile via order utility */}
        <div className="flex-1 p-2 bg-retro-content-bg min-w-0 order-1 md:order-2">
          {children}
        </div>

        {/* Sidebar - shown on md+, collapsible on mobile */}
        <div className="order-2 md:order-1">
          <Sidebar />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
