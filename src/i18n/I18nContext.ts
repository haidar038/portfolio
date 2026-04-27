import { createContext } from "react";
import type { Locale, Translations } from "./types";

export interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof Translations) => string;
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined);
