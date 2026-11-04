/** Locale registry for the marketing site. */
export const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

/** Cookie that persists the visitor's language choice. */
export const LANG_COOKIE = "smx_lang";

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "es" || value === "pt" || value === "zh";
}
