/** Date helpers — always rendered in Paris time so server and browser agree. */
import type { Lang } from "./i18n";

const TZ = "Europe/Paris";
const locale = (lang: Lang = "fr") => (lang === "en" ? "en-GB" : "fr-FR");

export function formatDay(iso: string, lang: Lang = "fr") {
  return new Intl.DateTimeFormat(locale(lang), { weekday: "long", day: "numeric", month: "long", timeZone: TZ }).format(
    new Date(iso),
  );
}
/** « 18h30 » en français, « 6:30 pm » en anglais. */
export function formatTime(iso: string, lang: Lang = "fr") {
  if (lang === "en") {
    return new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ })
      .format(new Date(iso));
  }
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(iso)).replace(":", "h");
}
export function formatShortDate(iso: string, lang: Lang = "fr") {
  return new Intl.DateTimeFormat(locale(lang), { day: "numeric", month: "short", timeZone: TZ }).format(new Date(iso));
}
export function formatLongDate(iso: string, lang: Lang = "fr") {
  return new Intl.DateTimeFormat(locale(lang), { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(
    new Date(iso),
  );
}
export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
