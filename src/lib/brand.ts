/** Central brand constants for Pro'pulse. */
export const BRAND_NAME = "Pro'pulse";
export const SITE_TITLE = "Pro'pulse | Rencontres informelles entre étudiants et pros";
export const SITE_DESCRIPTION =
  "Des cercles de rencontres informelles entre étudiants et professionnels, comme autour d'un café. Sans évaluation, sans compétition.";
export const INSTAGRAM_URL = "https://www.instagram.com/propulse.students/";
export const INSTAGRAM_HANDLE = "@propulse.students";

/**
 * URL du flux JSON Behold qui alimente la section Instagram de l'accueil
 * (format https://feeds.behold.so/XXXXXXXX). Elle n'est pas secrète.
 * Laisser vide masque la section. Voir src/lib/instagram.ts.
 */
export const INSTAGRAM_FEED_URL = "https://feeds.behold.so/d6GmrGXsqWXDCsxJPKgT";

/**
 * Clé PUBLIQUE Cloudflare Turnstile (widget « Site Pro'pulse »), faite pour être dans le code.
 * Elle fonctionne avec la clé SECRÈTE, rangée uniquement dans les secrets Lovable
 * (TURNSTILE_SECRET_KEY). Les deux doivent venir du même widget Cloudflare.
 */
export const TURNSTILE_SITE_KEY: string =
  (import.meta.env["VITE_TURNSTILE_SITE_KEY"] as string | undefined) || "0x4AAAAAAGDJ2K5eRHKEdvkO";

export const ARTICLE_CATEGORIES = {
  interview: "Interview",
  "parcours-atypique": "Parcours atypique",
  "vos-questions": "Vos questions",
} as const;
export type ArticleCategory = keyof typeof ARTICLE_CATEGORIES;
