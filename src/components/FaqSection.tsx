import Section from "./Section";
import { useI18n } from "../i18n/useI18n";
import { FAQ_ITEMS } from "../data/faq";

/**
 * FAQ section - visible answers plus source data for FAQPage structured data.
 */
export default function FaqSection() {
  const { t, locale } = useI18n();

  return (
    <Section id="faq" title={t("section.faq")}>
      <p className="mt-0 mb-2 text-sm text-gray-700">{t("faq.intro")}</p>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.id}
            className="border border-retro-border-mid bg-white p-2"
          >
            <h3 className="m-0 text-sm font-bold font-sans text-retro-blue-dark">
              {item.question[locale]}
            </h3>
            <p className="mt-1 mb-0 text-sm text-gray-700">
              {item.answer[locale]}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
