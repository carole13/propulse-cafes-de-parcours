/** Applique la version anglaise d'un événement quand le site est en anglais. */
import type { EventRow } from "./content.functions";
import type { Lang } from "./i18n";

export function localizeEvent(e: EventRow, lang: Lang): EventRow {
  if (lang !== "en" || !e.en) return e;
  return { ...e, ...Object.fromEntries(Object.entries(e.en).filter(([, v]) => v)) };
}
