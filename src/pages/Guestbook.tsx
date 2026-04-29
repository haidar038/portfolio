import { lazy, Suspense } from "react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { useI18n } from "../i18n/useI18n";

// Lazy load Firebase-dependent components for code splitting
const GuestbookForm = lazy(() => import("../components/GuestbookForm"));
const GuestbookEntries = lazy(() => import("../components/GuestbookEntries"));

/**
 * Loading fallback for Suspense
 */
function LoadingFallback() {
  return (
    <div className="border-t border-l border-retro-border-mid border-b border-r p-3 bg-retro-sidebar-bg mb-4">
      <div className="text-sm text-retro-blue-dark">Loading...</div>
    </div>
  );
}

/**
 * Guestbook page - allows visitors to leave messages.
 * Validates: Requirements 10.2, 10.6
 */
export default function Guestbook() {
  const { t } = useI18n();

  return (
    <Layout>
      <SEOHead
        title="Guestbook"
        description="Leave a message in my guestbook! Share your thoughts, feedback, or just say hello."
        url="https://hydr.codes/guestbook"
      />
      <div className="mb-4">
        <h1 className="text-lg font-bold text-retro-blue-dark mb-2">
          {t("guestbook.title")}
        </h1>
        <p className="text-sm text-gray-700 mb-4">
          {t("guestbook.description")}
        </p>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <GuestbookForm />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <GuestbookEntries />
      </Suspense>
    </Layout>
  );
}
