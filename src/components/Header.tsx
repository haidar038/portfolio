import { useI18n } from "../i18n/useI18n";
import OldIcon from "./OldIcon";
import VisitorCounter from "./VisitorCounter";

/**
 * Header / Hero banner with name, subtitle, tags, visitor counter, and language toggle.
 * Requirements: 7.4, 5.1
 */
export default function Header() {
	const { t, locale, setLocale } = useI18n();

	function toggleLocale() {
		setLocale(locale === "en" ? "id" : "en");
	}

	return (
		<div className="bg-retro-header-bg border-b-3 border-retro-blue-nav">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-start px-3 py-2 gap-2">
				{/* Left: Name & Info */}
				<div>
					<div className="text-retro-green-glow text-xl sm:text-2xl md:text-3xl font-bold font-retro-display drop-shadow-[2px_2px_0px_#000033] tracking-wider">
						★ M. Khaidar ★
					</div>
					<div
						className="text-retro-blue-light text-xs mt-0.5 tracking-wider"
						dangerouslySetInnerHTML={{ __html: t("header.subtitle") }}
					/>
					<div className="flex flex-wrap gap-1 mt-1">
						<span className="bg-retro-blue-nav text-white text-sm px-1 border border-[#6699cc]">
							{t("header.tag.react")}
						</span>
						<span className="bg-retro-blue-nav text-white text-sm px-1 border border-[#6699cc]">
							{t("header.tag.typescript")}
						</span>
						<span className="bg-retro-blue-nav text-white text-sm px-1 border border-[#6699cc]">
							{t("header.tag.supabase")}
						</span>
						<span className="bg-retro-blue-nav text-white text-sm px-1 border border-[#6699cc]">
							{t("header.tag.founder")}
						</span>
					</div>
				</div>

				{/* Right: Counter + Language Toggle */}
				<div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-1.5">
					{/* Language Toggle */}
					<button
						onClick={toggleLocale}
						className="retro-btn text-xs px-2 py-0.5 cursor-pointer flex items-center gap-1"
						title="Switch language"
						aria-label="Switch language"
					>
						<OldIcon name="VisualStudioEARTH" size={28} alt="Language" />{" "}
						{locale === "en" ? "EN" : "ID"} ▾
					</button>

					{/* Visitor Counter */}
					<div
						className="inline-block text-center"
						aria-live="polite"
						aria-atomic="true"
					>
						<div className="bg-black px-3 py-1.5 border-2 border-retro-blue-nav font-retro-mono text-2xl tracking-widest animate-glow">
							<VisitorCounter />
						</div>
						<div className="text-retro-footer-muted text-sm mt-2">
							{t("visitor.since")}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
