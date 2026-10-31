/** Date helpers — always rendered in Paris time so server and browser agree. */
const TZ = "Europe/Paris";

export function formatDay(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: TZ }).format(new Date(iso));
}
export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(iso)).replace(":", "h");
}
export function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: TZ }).format(new Date(iso));
}
export function formatLongDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(new Date(iso));
}
export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
