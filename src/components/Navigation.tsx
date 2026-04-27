import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

/**
 * Navigation component - displays the main navigation bar.
 * Placeholder component to be implemented in task 13.3.
 */
export default function Navigation() {
  const { t, locale } = useI18n();
  const cvUrl = locale === "en" ? "/CV_en.pdf" : "/CV_id.pdf";

  return (
    <nav className="bg-retro-nav-bg border-b border-retro-border-mid">
      <ul className="flex flex-wrap gap-1 p-1">
        <li>
          <Link to="/" className="retro-nav-link">
            {t("nav.about")}
          </Link>
        </li>
        <li>
          <Link to="/guestbook" className="retro-nav-link">
            {t("nav.guestbook")}
          </Link>
        </li>
        <li>
          <Link to="/blogroll" className="retro-nav-link">
            {t("sidebar.blogroll")}
          </Link>
        </li>
        <li>
          <a href={cvUrl} download className="retro-nav-link">
            {t("nav.resume")}
          </a>
        </li>
      </ul>
    </nav>
  );
}
