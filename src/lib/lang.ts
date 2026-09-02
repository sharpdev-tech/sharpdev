export type Lang = "en" | "sq";

/** Where the choice is persisted. Read on the server so the first paint is
 *  already in the right language — no flash of English for Albanian visitors. */
export const LANG_COOKIE = "lang";
export const LANGS: Lang[] = ["en", "sq"];

/** English is the default: international traffic outnumbers local. */
export const DEFAULT_LANG: Lang = "en";

export const isLang = (v: unknown): v is Lang =>
  typeof v === "string" && (LANGS as string[]).includes(v);

/** Picks the copy for the active language. */
export const pick = <T,>(lang: Lang, copy: Record<Lang, T>): T => copy[lang];

/** Persists the choice for a year, so it survives closing the browser. */
export function persistLang(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}
