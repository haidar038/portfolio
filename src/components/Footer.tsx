import { useI18n } from "../i18n/useI18n";
import OldIcon from "./OldIcon";

/**
 * Footer with copyright, navigation links, and retro badges.
 */
export default function Footer() {
  const { t } = useI18n();

  return (
    <div className="bg-retro-footer-bg border-t-3 border-retro-blue-nav">
      {/* Under Construction Banner */}
      <div className="construction-stripe" />
      <div className="px-3 py-1 bg-[#fff8e0] text-center border-b border-[#cccc88]">
        <span className="text-xs font-bold text-retro-orange]">
          🚧 <span className="blink">Site Always Under Construction</span> 🚧
        </span>
      </div>
      <div className="construction-stripe" />

      {/* Sign My Guestbook Button */}
      <div className="px-3 pt-1.5 flex justify-center">
        <a
          href="/guestbook"
          className="inline-flex items-center gap-1 bg-retro-yellow-bg border-t-2 border-l-2 border-l-[#ffff88] border-r-2 border-b-2 border-b-[#aaaa44] px-2 py-1 text-xs font-bold text-[#336600] hover:bg-[#eeeedd] no-underline! cursor-pointer active:border-t-[#aaaa44] active:border-l-[#aaaa44] active:border-r-[#ffff88] active:border-b-[#ffff88]"
        >
          ✏️ Sign My Guestbook!
        </a>
      </div>

      {/* Main Footer Content */}
      <div className="px-3 py-2">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          {/* Left */}
          <div>
            <div className="text-retro-footer-text text-xs leading-normal">
              <b className="text-retro-gold">{t("footer.name")}</b> - {t("footer.role")}
              <br />
              <span className="text-retro-footer-muted text-xs inline-flex items-center gap-0.5">
                {t("footer.copyright")} <OldIcon name="Windows2000MyNetworkPlaces" size={12} alt="Indonesia" />
              </span>
            </div>
            <div className="text-retro-footer-text text-xs mt-1 italic">
              {t("footer.browser")}
              <br />
              {t("footer.handcrafted")}
            </div>
          </div>

          {/* Right */}
          <div className="text-right">
            <div className="text-xs leading-normal footer-link">
              <a href="#" className="text-retro-footer-link hover:text-[#ffff88]! hover:bg-transparent! no-underline!">
                {t("footer.home")}
              </a>{" "}
              |
              <a href="#about" className="text-retro-footer-link hover:text-[#ffff88]! hover:bg-transparent! no-underline!">
                {t("footer.about")}
              </a>{" "}
              |
              <a href="#projects" className="text-retro-footer-link hover:text-[#ffff88]! hover:bg-transparent! no-underline!">
                {t("footer.projects")}
              </a>{" "}
              |
              <a href="#contact" className="text-retro-footer-link hover:text-[#ffff88]! hover:bg-transparent! no-underline!">
                {t("footer.contact")}
              </a>{" "}
              |
              <a href="#" className="text-retro-footer-link hover:text-[#ffff88]! hover:bg-transparent! no-underline!">
                {t("footer.sitemap")}
              </a>
            </div>
            <div className="mt-1">
              <span className="bg-retro-blue-dark text-white text-xs px-1 py-0 border border-retro-blue-nav">
                HTML 4.01 Transitional ✓
              </span>{" "}
              <span className="bg-[#336600] text-white text-xs px-1 py-0 border border-[#668800]">
                CSS 2.0 Compliant ✓
              </span>
            </div>
            <div className="text-retro-footer-text text-sm mt-2">
              {t("footer.pageGenerated")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
