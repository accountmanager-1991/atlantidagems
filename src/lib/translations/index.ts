import type { Locale } from "@/lib/i18n";
import en from "./en";
import es from "./es";
import de from "./de";
import type { TranslationKeys } from "./en";

const translations: Record<Locale, TranslationKeys> = { en, es, de };

export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale] || translations.en;
}

export type { TranslationKeys };
