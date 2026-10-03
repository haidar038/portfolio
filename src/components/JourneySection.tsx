import Section from "./Section";
import { useI18n } from "../i18n/useI18n";
import { JOURNEY_DATA } from "../data/education";

/**
 * Journey / Education section with a retro data table.
 */
export default function JourneySection() {
  const { t, locale } = useI18n();

  return (
    <Section id="journey" title={t("section.journey")}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-retro-blue-nav text-white text-xs">
              <td className="py-1 px-2 border border-[#002244] w-24 font-bold">
                {t("journey.col.period")}
              </td>
              <td className="py-1 px-2 border border-[#002244] font-bold">
                {t("journey.col.education")}
              </td>
            </tr>
          </thead>
          <tbody>
            {JOURNEY_DATA.map((entry, index) => (
              <tr
                key={entry.id}
                className={[
                  "hover:bg-retro-hover",
                  index % 2 === 0 ? "bg-retro-alt-row" : "",
                ].join(" ")}
              >
                <td className="py-1 px-2 border border-[#c8c8c8] align-top text-retro-blue-accent font-bold text-xs whitespace-nowrap">
                  {entry.period[locale]}
                </td>
                <td className="py-1 px-2 border border-[#c8c8c8] leading-normal">
                  <b>{entry.title[locale]}</b>
                  <br />
                  <span className="text-retro-blue-nav text-xs">{entry.institution[locale]}</span>
                  <br />
                  <span className="text-retro-text-muted text-xs">
                    {entry.description[locale]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
