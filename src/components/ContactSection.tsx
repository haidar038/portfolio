import { useState, type ReactNode } from "react";
import Section from "./Section";
import { useI18n } from "../i18n/useI18n";
import OldIcon from "./OldIcon";

interface ContactInfo {
  iconName: string;
  label: { en: string; id: string };
  value: { en: string; id: string };
  href?: string;
}

const CONTACT_INFO: ContactInfo[] = [
  { iconName: "WindowsXPMail", label: { en: "Email", id: "Email" }, value: { en: "haidar038@gmail.com", id: "haidar038@gmail.com" }, href: "mailto:haidar038@gmail.com" },
  { iconName: "WindowsNetwork", label: { en: "GitHub", id: "GitHub" }, value: { en: "github.com/haidar038", id: "github.com/haidar038" }, href: "https://github.com/haidar038" },
  { iconName: "InternetConnection", label: { en: "LinkedIn", id: "LinkedIn" }, value: { en: "linkedin.com/in/haidar038", id: "linkedin.com/in/haidar038" }, href: "https://linkedin.com/in/haidar038" },
  { iconName: "VisualStudioPhone", label: { en: "WhatsApp", id: "WhatsApp" }, value: { en: "+62 812-4202-4542", id: "+62 812-4202-4542" }, href: "https://wa.me/+6281242024542" },
  { iconName: "VisioMap", label: { en: "Location", id: "Lokasi" }, value: { en: "Ternate, Maluku Utara, Indonesia", id: "Ternate, Maluku Utara, Indonesia" } },
  { iconName: "VisualStudioCLOCK", label: { en: "Response", id: "Respons" }, value: { en: "Usually within 24 hours (WIT, UTC+9)", id: "Biasanya dalam 24 jam (WIT, UTC+9)" } },
];

/**
 * Contact section with info table and quick message form.
 */
export default function ContactSection(): ReactNode {
  const { t, locale } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const n = name.trim();
    const e = email.trim();
    const s = subject.trim();
    const m = message.trim();

    // Validate required fields
    if (!n || !e || !m) {
      alert(t("contact.alertFill"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: n,
          email: e,
          subject: s,
          message: m,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send email");
        alert(t("contact.alertFail") || "Failed to send message. Please try again.");
        return;
      }

      alert(t("contact.alertSent").replace("{name}", n).replace("{email}", e));
      clearForm();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Contact form error:", errorMsg);
      setError(errorMsg);
      alert(t("contact.alertError") || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <Section id="contact" title={t("section.contact")}>
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Contact info */}
        <div className="flex-1">
          <p className="m-0 mb-2 text-xs leading-normal">
            {t("contact.intro")}
          </p>
          <table className="text-xs leading-normal">
            <tbody>
              {CONTACT_INFO.map((info) => (
                <tr key={info.label.en}>
                  <td className="text-retro-text-muted px-2 whitespace-nowrap">
                    <OldIcon name={info.iconName} size={18} style={{ verticalAlign: "-2px", marginRight: "4px" }} alt={info.label[locale]} />{info.label[locale]}:
                  </td>
                  <td className="px-2">
                    {info.href ? (
                      <a href={info.href}>{info.value[locale]}</a>
                    ) : (
                      info.value[locale]
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick message form */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="border-t border-l border-retro-border-mid border-b border-r p-2 bg-retro-sidebar">
            <div className="font-bold text-xs mb-1.5 text-retro-blue-dark flex items-center gap-1">
              <OldIcon name="VisualStudioNOTE16" size={14} alt="" /> {t("contact.formTitle")}
            </div>

            <div className="mb-2">
              <label className="text-xs block mb-0.5">{t("contact.name")}</label>
              <input
                type="text"
                placeholder={t("contact.namePlaceholder")}
                value={name}
                maxLength={100}
                onChange={(e) => setName(e.currentTarget.value)}
                className="retro-input w-full px-1.5 py-1 text-xs"
              />
            </div>

            <div className="mb-2">
              <label className="text-xs block mb-0.5">{t("contact.email")}</label>
              <input
                type="text"
                placeholder={t("contact.emailPlaceholder")}
                value={email}
                maxLength={254}
                onChange={(e) => setEmail(e.currentTarget.value)}
                className="retro-input w-full px-1.5 py-1 text-xs"
              />
            </div>

            <div className="mb-2">
              <label className="text-xs block mb-0.5">{t("contact.subject")}</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.currentTarget.value)}
                className="retro-input w-full px-1.5 py-1 text-xs"
              >
                <option value="">{t("contact.selectSubject")}</option>
                <option value="freelance">{t("contact.freelance")}</option>
                <option value="collab">{t("contact.collab")}</option>
                <option value="product">{t("contact.product")}</option>
                <option value="hi">{t("contact.hi")}</option>
              </select>
            </div>

            <div className="mb-1.5">
              <label className="text-xs block mb-0.5">{t("contact.message")}</label>
              <textarea
                rows={3}
                placeholder={t("contact.messagePlaceholder")}
                value={message}
                maxLength={5000}
                onChange={(e) => setMessage(e.currentTarget.value)}
                className="retro-input w-full px-1.5 py-1 text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-1">
              <button
                onClick={clearForm}
                disabled={loading}
                className="retro-btn px-2 py-0.5 text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("contact.clear")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="retro-btn px-3 py-0.5 text-xs cursor-pointer font-bold text-retro-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("contact.sending") || "Sending..." : t("contact.send")}
              </button>
            </div>
            {error && (
              <div className="mt-1 text-xs text-red-600 bg-red-50 p-1 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
