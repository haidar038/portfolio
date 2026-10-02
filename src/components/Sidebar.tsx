import { useState, useEffect } from "react";
import { useI18n } from "../i18n/useI18n";
import { SKILLS, TECH_STACK, type SkillLevel } from "../data/techStack";
import OldIcon from "./OldIcon";

const NAV_LINKS = [
  { labelKey: "nav.about" as const, href: "/#about" },
  { labelKey: "nav.journey" as const, href: "/#journey" },
  { labelKey: "nav.experience" as const, href: "/#experience" },
  { labelKey: "nav.projects" as const, href: "/#projects" },
  { labelKey: "nav.contact" as const, href: "/#contact" },
];

const LEVEL_STYLES: Record<SkillLevel, string> = {
  beginner: "bg-[#cc4444] text-white",
  intermediate: "bg-[#cc8800] text-white",
  advanced: "bg-retro-blue-nav text-white",
  expert: "bg-[#006600] text-white",
};

/**
 * Left sidebar with quick info, navigation, skill levels, etc.
 */
export default function Sidebar() {
  const { t, locale } = useI18n();
  const [constructionChars, setConstructionChars] = useState("▓▓▓▓▓▓▓");

  useEffect(() => {
    const chars = "▓▒░▓▓▒▓░▒▓";
    const interval = setInterval(() => {
      setConstructionChars(
        Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
      );
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const skillLevelKey = (level: SkillLevel) => `skill.${level}` as const;

  return (
    <div className="w-full md:w-72 md:shrink-0 md:border-r-2 md:border-retro-border-mid bg-retro-panel-bg p-2 space-y-2">

      {/* QUICK INFO */}
      <div className="retro-panel">
        <div className="retro-panel-title">
          🖙 {t("sidebar.quickInfo")}
        </div>
        <div className="p-1.5 text-xs leading-normal">
          <b>{t("sidebar.name")}</b> M. Khaidar<br />
          <b>{t("sidebar.age")}</b> 24<br />
          <b>{t("sidebar.location")}</b> Ternate, ID<br />
          <b>{t("sidebar.status")}</b> <span className="text-retro-green-online font-bold inline-flex items-center gap-0.5"><OldIcon name="WindowsXPMail" size={10} alt="" /> Online</span><br />
          <b>{t("sidebar.role")}</b> <span className="text-retro-orange">Product Engineer</span><br />
          <b>{t("sidebar.timezone")}</b> WIT (UTC+9)
          <div className="retro-hr" />
          <b>{t("sidebar.founder")}</b> Binary Verse
        </div>
      </div>

      {/* NAVIGATE */}
      <div className="retro-panel">
        <div className="retro-panel-title">
          🖙 {t("sidebar.navigate")}
        </div>
        <div className="p-1.5 text-xs leading-normal">
          <ul style={{ listStyle: "disc", paddingLeft: "1rem" }}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="underline">{t(link.labelKey)}</a>
              </li>
            ))}
          </ul>
          <div className="retro-hr" />
          <ul style={{ listStyle: "disc", paddingLeft: "1rem" }}>
            <li>
              <a href="/guestbook" className="underline">{t("sidebar.guestbook")}</a>
            </li>
            <li>
              <a href="/blogroll" className="underline">{t("sidebar.blogroll")}</a>
            </li>
            <li>
              <a href={`/CV_${locale}.pdf`} download className="text-retro-green-online font-bold underline">{t("nav.resume")}</a>
            </li>
          </ul>
        </div>
      </div>

      {/* SKILL METER */}
      <div className="retro-panel">
        <div className="retro-panel-title">
          🖙 {t("sidebar.skillMeter")}
        </div>
        <div className="p-1.5 text-xs">
          {SKILLS.map((skill) => (
            <div key={skill.name} className="mb-1">
              <div className="flex justify-between items-center">
                <span>{skill.name}</span>
                <span className={`text-xs px-1 py-0 ${LEVEL_STYLES[skill.level]} font-bold`}>
                  {t(skillLevelKey(skill.level))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UNDER CONSTRUCTION */}
      <div className="border-2 border-dashed border-retro-orange bg-retro-construction-bg p-2 text-center text-xs">
        <div className="text-retro-orange font-bold mb-0.5 flex items-center justify-center gap-1"><OldIcon name="Windows95Comctl322" size={14} alt="" /> {t("sidebar.construction")} <OldIcon name="Windows95Comctl322" size={14} alt="" /></div>
        <div className="font-retro-mono text-retro-orange text-lg tracking-wider animate-blink">
          {constructionChars}
        </div>
        <div className="text-[#555] mt-0.5 text-xs whitespace-pre-line">
          {t("sidebar.blogComing")}
        </div>
      </div>

      {/* CURRENTLY USING */}
      <div className="retro-panel">
        <div className="retro-panel-title">
          🖙 {t("sidebar.currentlyUsing")}
        </div>
        <div className="p-1.5 text-xs leading-normal">
          {TECH_STACK.map((group) => (
            <div key={group.category} className="mb-1">
              <div className="text-retro-blue-accent font-bold text-xs">▸ {group.category}</div>
              <div className="flex flex-wrap gap-1 ml-3">
                {group.items.map((item) => (
                  <span key={item} className="bg-retro-winface text-xs px-1 py-0 border-t border-l border-white border-b border-r">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LAST UPDATED */}
      <div className="bg-retro-yellow-bg border border-[#cccc88] p-1.5 text-xs text-[#666633] text-center leading-normal">
        <OldIcon name="VisualStudioCLOCK" size={12} style={{ verticalAlign: "-2px", marginRight: "2px" }} alt="" /><b>{t("sidebar.lastUpdated")}</b>
        <br />
        April 22, 2026
        <br />
        <span className="text-xs text-[#999977] whitespace-pre-line">
          {t("sidebar.handcrafted")}
        </span>
      </div>

      {/* BADGES */}
      <div className="flex flex-col items-center gap-2 mt-2 pt-2 border-t border-[#c8c8c8]">
        <img src="/thumbnails/badge-html.svg" alt="HTML 4.01 Compliant" width={88} height={31} loading="lazy" className="border-2 border-t-white border-l-white border-r-retro-border-mid border-b-retro-border-mid opacity-80 hover:opacity-100 transition-opacity" />
        <img src="/thumbnails/badge-ie.svg" alt="Best Viewed in IE 6.0" width={88} height={31} loading="lazy" className="border-2 border-t-white border-l-white border-r-retro-border-mid border-b-retro-border-mid opacity-80 hover:opacity-100 transition-opacity" />
        <img src="/thumbnails/badge-css.svg" alt="CSS 2.0 Compliant" width={88} height={31} loading="lazy" className="border-2 border-t-white border-l-white border-r-retro-border-mid border-b-retro-border-mid opacity-80 hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
