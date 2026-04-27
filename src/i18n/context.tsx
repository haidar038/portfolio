import { useState, type ReactNode } from "react";
import type { Locale, Translations } from "./types";
import { I18nContext } from "./I18nContext";
import en from "./locales/en";
import id from "./locales/id";

const LOCALES: Record<Locale, Translations> = { en, id };

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = (key: keyof Translations): string => {
    return LOCALES[locale][key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
