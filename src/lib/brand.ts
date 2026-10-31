/** Central brand constants for Pro'pulse. */
export const BRAND_NAME = "Pro'pulse";
export const SITE_TITLE = "Pro'pulse | Rencontres informelles entre étudiants et pros";
export const SITE_DESCRIPTION =
  "Des cercles de rencontres informelles entre étudiants et professionnels, comme autour d'un café. Sans évaluation, sans compétition.";
export const INSTAGRAM_URL = "https://instagram.com/propulse_students";
export const INSTAGRAM_HANDLE = "@propulse_students";

/**
 * Cloudflare Turnstile public site key (safe to ship in the front-end).
 * Falls back to Cloudflare's official "always passes" test key until the real one is set.
 * The SECRET key lives only on the server (TURNSTILE_SECRET_KEY).
 */
export const TURNSTILE_SITE_KEY: string =
  (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || "1x00000000000000000000AA";

export const ARTICLE_CATEGORIES = {
  interview: "Interview",
  "parcours-atypique": "Parcours atypique",
  "vos-questions": "Vos questions",
} as const;
export type ArticleCategory = keyof typeof ARTICLE_CATEGORIES;
