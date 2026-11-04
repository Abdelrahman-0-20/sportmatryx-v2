import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";
import { zh } from "./zh";

/** The English source defines the dictionary shape every locale must match. */
export type Dict = typeof en;

const DICTIONARIES: Record<string, Dict> = { en, es, pt, zh };

export function getDictionary(locale: string): Dict {
  return DICTIONARIES[locale] ?? en;
}
