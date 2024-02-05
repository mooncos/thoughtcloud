import { Translation } from "./locales/definition"
import en from "./locales/en-US"
import fr from "./locales/fr-FR"
import ja from "./locales/ja-JP"

export const TRANSLATIONS = {
  "en-US": en,
  "fr-FR": fr,
  "ja-JP": ja,
} as const

export const i18n = (locale: ValidLocale): Translation => TRANSLATIONS[locale]
export type ValidLocale = keyof typeof TRANSLATIONS
