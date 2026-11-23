/**
 * Version française / anglaise du site.
 *
 * - La langue est gardée dans un cookie « lang » (fr par défaut). Elle est lue côté
 *   serveur ET côté navigateur, donc la page arrive directement dans la bonne langue.
 * - Le bouton FR / EN de l'en-tête change le cookie puis recharge la page, qui revient
 *   entièrement rendue dans la nouvelle langue (textes, dates, titres d'onglet).
 * - Chaque composant déclare ses propres textes avec `defineCopy({ fr: …, en: … })` et les
 *   lit avec `useCopy(...)`. TypeScript refuse une traduction anglaise incomplète.
 * - Les contenus saisis par l'équipe (événements, interviews) restent en français, sauf si
 *   une version anglaise est fournie (champ « en » dans les fichiers de src/data).
 */
import { useRouteContext } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export type Lang = "fr" | "en";
export const LANGS: Lang[] = ["fr", "en"];
const COOKIE = "lang";

export const normalizeLang = (value?: string | null): Lang => (value === "en" ? "en" : "fr");

/** Langue de la requête en cours (serveur) ou du navigateur (client). */
export const readLang = createIsomorphicFn()
  .server((): Lang => normalizeLang(getCookie(COOKIE)))
  .client((): Lang => normalizeLang(document.cookie.match(/(?:^|;\s*)lang=(fr|en)/)?.[1]));

/** Langue courante, depuis le contexte du routeur. */
export function useLang(): Lang {
  return useRouteContext({ from: "__root__", select: (c) => c.lang });
}

/** Textes d'un composant dans les deux langues (l'anglais doit avoir la même forme). */
export function defineCopy<T>(copy: { fr: T; en: NoInfer<T> }) {
  return copy;
}

/** Textes du composant dans la langue courante. */
export function useCopy<T>(copy: { fr: T; en: T }): T {
  return copy[useLang()];
}

/** Choix FR/EN pour les fonctions `head` des routes (titres d'onglet, aperçus). */
export function pick<T>(lang: Lang | undefined, fr: T, en: T): T {
  return lang === "en" ? en : fr;
}

/** Change la langue : cookie d'un an, puis rechargement de la page dans la nouvelle langue. */
export function useSetLang() {
  return (lang: Lang) => {
    document.cookie = `${COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };
}
