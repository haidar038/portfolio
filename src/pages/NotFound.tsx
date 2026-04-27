import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

/**
 * NotFound page - displayed for unrecognized routes.
 * Validates: Requirements 10.4
 */
export default function NotFound() {
  const { t } = useI18n();

  return (
    <Layout>
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        url="https://khaidar.dev/404"
      />
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-4xl font-bold text-retro-text mb-4">404</h1>
        <h2 className="text-xl font-semibold text-retro-text mb-2">Page Not Found</h2>
        <p className="text-retro-text-muted mb-6 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-retro-button-bg border border-retro-border-dark text-retro-text hover:bg-retro-button-hover active:bg-retro-button-active"
        >
          {t("blogroll.backToHome")}
        </Link>
      </div>
    </Layout>
  );
}
