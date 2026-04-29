import { useState, type ReactNode } from "react";
import Section from "./Section";
import { useI18n } from "../i18n/useI18n";
import OldIcon from "./OldIcon";

interface ContactInfo {
  iconName: string;
  label: string;
  value: string;
  href?: string;
}

const CONTACT_INFO: ContactInfo[] = [
  { iconName: "WindowsXPMail", label: "Email", value: "haidar038@gmail.com", href: "mailto:haidar038@gmail.com" },
  { iconName: "WindowsNetwork", label: "GitHub", value: "github.com/haidar038", href: "https://github.com/haidar038" },
  { iconName: "InternetConnection", label: "LinkedIn", value: "linkedin.com/in/haidar038", href: "https://linkedin.com/in/haidar038" },
  { iconName: "VisualStudioPhone", label: "WhatsApp", value: "+62 812-4202-4542", href: "https://wa.me/+6281242024542" },
  { iconName: "VisioMap", label: "Location", value: "Ternate, Maluku Utara, Indonesia" },
  { iconName: "VisualStudioCLOCK", label: "Response", value: "Usually within 24 hours (WIT, UTC+9)" },
];

/**
 * Contact section with info table and quick message form.
 */
export default function ContactSection(): ReactNode {
  const { t } = useI18n();
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
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Contact info */}
        <div className="flex-1">
          <p className="m-0 mb-4 text-sm leading-relaxed">
            {t("contact.intro")}
          </p>
          <table className="text-sm leading-loose">
            <tbody>
              {CONTACT_INFO.map((info) => (
                <tr key={info.label}>
                  <td className="text-retro-text-muted px-2 whitespace-nowrap">
                    <OldIcon name={info.iconName} size={18} style={{ verticalAlign: "-2px", marginRight: "4px" }} alt={info.label} />{info.label}:
                  </td>
                  <td className="px-2">
                    {info.href ? (
                      <a href={info.href}>{info.value}</a>
                    ) : (
                      info.value
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick message form */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="border-t border-l border-retro-border-mid border-b border-r p-3 bg-retro-sidebar">
            <div className="font-bold text-sm mb-2 text-retro-blue-dark flex items-center gap-1.5">
              <OldIcon name="VisualStudioNOTE16" size={20} alt="" /> {t("contact.formTitle")}
            </div>

            <div className="mb-3">
              <label className="text-sm block mb-1">{t("contact.name")}</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                className="retro-input w-full px-2 py-1.5 text-sm"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm block mb-1">{t("contact.email")}</label>
              <input
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                className="retro-input w-full px-2 py-1.5 text-sm"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm block mb-1">{t("contact.subject")}</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.currentTarget.value)}
                className="retro-input w-full px-2 py-1.5 text-sm"
              >
                <option value="">{t("contact.selectSubject")}</option>
                <option value="freelance">{t("contact.freelance")}</option>
                <option value="collab">{t("contact.collab")}</option>
                <option value="product">{t("contact.product")}</option>
                <option value="hi">{t("contact.hi")}</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="text-sm block mb-1">{t("contact.message")}</label>
              <textarea
                rows={4}
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                className="retro-input w-full px-2 py-1.5 text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={clearForm}
                disabled={loading}
                className="retro-btn px-4 py-1.5 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("contact.clear")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="retro-btn px-5 py-1.5 text-sm cursor-pointer font-bold text-retro-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("contact.sending") || "Sending..." : t("contact.send")}
              </button>
            </div>
            {error && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
