import { cookies } from "next/headers";
import { LANG_COOKIE, isLocale, type Locale } from "./config";
import { getDictionary, type Dict } from "./dictionaries";

/** Server-side locale from the visitor's cookie (defaults to English). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return isLocale(value) ? value : "en";
}

/** Server-side dictionary for the current locale. */
export async function getDict(): Promise<Dict> {
  return getDictionary(await getLocale());
}
