import { useI18n } from "../i18n/useI18n";

interface NavItem {
  labelKey: "nav.about" | "nav.journey" | "nav.experience" | "nav.projects" | "nav.contact" | "nav.guestbook" | "nav.resume";
  href: string;
  color?: string;
  download?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: "nav.about", href: "/#about" },
  { labelKey: "nav.journey", href: "/#journey" },
  { labelKey: "nav.experience", href: "/#experience" },
  { labelKey: "nav.projects", href: "/#projects" },
  { labelKey: "nav.contact", href: "/#contact" },
  { labelKey: "nav.guestbook", href: "/guestbook", color: "text-retro-gold-muted" },
  { labelKey: "nav.resume", href: "#", color: "text-[#aaddaa]", download: true },
];

/**
 * Navigation bar styled after classic early 2000s nav.
 * Horizontal on desktop, wraps on mobile.
 */
export default function Navigation() {
  const { t, locale } = useI18n();

  return (
    <div className="bg-retro-blue-nav border-b-2 border-[#002244]">
      <nav className="flex flex-wrap" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.labelKey}
            href={item.download ? `/CV_${locale}.pdf` : item.href}
            {...(item.download ? { download: true } : {})}
            className={[
              "nav-item px-3 py-1.5 sm:px-5 sm:py-2 border-r border-retro-blue-dark text-white font-bold font-sans text-xs sm:text-sm hover:text-retro-gold! hover:bg-transparent!",
              item.color ?? "",
            ].join(" ")}
            style={{ textDecoration: "underline" }}
            aria-current={!item.href.startsWith("#") && !item.download ? "page" : undefined}
          >
            [ {t(item.labelKey)} ]
          </a>
        ))}
      </nav>
    </div>
  );
}
