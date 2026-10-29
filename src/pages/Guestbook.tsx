import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import GuestbookForm from "../components/GuestbookForm";
import GuestbookEntries from "../components/GuestbookEntries";
import { useI18n } from "../i18n/useI18n";

/**
 * Guestbook page - allows visitors to leave messages.
 * Validates: Requirements 10.2, 10.6
 */
export default function Guestbook() {
  const { t } = useI18n();

  return (
    <Layout>
      <SEOHead
        title={t("seo.guestbookTitle")}
        description={t("seo.guestbookDescription")}
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
      <GuestbookForm />
      <GuestbookEntries />
    </Layout>
  );
}
