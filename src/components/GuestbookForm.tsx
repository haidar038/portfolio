import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useI18n } from "../i18n/useI18n";
import OldIcon from "./OldIcon";

/** Strip HTML tags from user input to prevent XSS */
function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

const COOLDOWN_MS = 10_000; // 10 seconds between submits

export default function GuestbookForm() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function clearForm() {
    setName("");
    setMessage("");
    setFeedback(null);
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Cooldown check
    if (cooldown) return;

    // Sanitize HTML from input
    const n = stripHtml(name.trim());
    const m = stripHtml(message.trim());
    setName(n);
    setMessage(m);

    // Validation
    if (!n) {
      setFeedback({ type: "error", text: t("guestbook.form.nameRequired") });
      return;
    }
    if (n.length > 50) {
      setFeedback({ type: "error", text: t("guestbook.form.nameTooLong") });
      return;
    }
    if (!m) {
      setFeedback({ type: "error", text: t("guestbook.form.messageRequired") });
      return;
    }
    if (m.length > 500) {
      setFeedback({ type: "error", text: t("guestbook.form.messageTooLong") });
      return;
    }

    setSending(true);
    setFeedback(null);

    try {
      await addDoc(collection(db, "guestbook"), {
        name: n,
        message: m,
        timestamp: serverTimestamp(),
      });
      setFeedback({ type: "success", text: t("guestbook.form.success") });
      setName("");
      setMessage("");
      // Start cooldown to prevent spam
      setCooldown(true);
      setTimeout(() => setCooldown(false), COOLDOWN_MS);
    } catch (err) {
      console.error("Guestbook submit error:", err);
      setFeedback({ type: "error", text: t("guestbook.form.error") });
    } finally {
      setSending(false);
      // Auto-clear feedback after 5 seconds
      setTimeout(() => setFeedback(null), 5000);
    }
  }

  return (
    <div className="border-t border-l border-retro-border-mid border-b border-r p-2 bg-retro-sidebar-bg mb-2">
      <div className="font-bold text-xs mb-1.5 text-retro-blue-dark flex items-center gap-1">
        <OldIcon name="VisualStudioNOTE16" size={14} alt="" /> {t("guestbook.form.title").replace(":", "")}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="guestbook-name" className="text-xs block mb-0.5">{t("guestbook.form.name")}</label>
          <input
            id="guestbook-name"
            type="text"
            placeholder={t("guestbook.form.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="retro-input w-full px-1.5 py-1 text-xs"
            disabled={sending}
            aria-required="true"
          />
          <div className="text-[#999] text-xs mt-0.5 text-right">{name.length}/50</div>
        </div>

        <div className="mb-1.5">
          <label htmlFor="guestbook-message" className="text-xs block mb-0.5">{t("guestbook.form.message")}</label>
          <textarea
            id="guestbook-message"
            rows={3}
            placeholder={t("guestbook.form.messagePlaceholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            className="retro-input w-full px-1.5 py-1 text-xs resize-none"
            disabled={sending}
            aria-required="true"
          />
          <div className="text-[#999] text-xs mt-0.5 text-right">{message.length}/500</div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            role="alert"
            className={`text-xs px-1.5 py-1 mb-1.5 border ${feedback.type === "success"
              ? "bg-[#eeffee] text-[#006600] border-[#00aa00]"
              : "bg-[#ffeeee] text-retro-red-link border-retro-red-link"
              }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={clearForm}
            className="retro-btn px-2 py-0.5 text-xs cursor-pointer"
            disabled={sending}
          >
            {t("guestbook.form.clear")}
          </button>
          <button
            type="submit"
            className="retro-btn px-3 py-0.5 text-xs cursor-pointer font-bold text-retro-blue-dark"
            disabled={sending || cooldown}
          >
            {sending ? t("guestbook.form.sending") : cooldown ? t("guestbook.form.sending") : t("guestbook.form.submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
