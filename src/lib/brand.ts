/** Central brand constants for Pro'pulse. */
export const BRAND_NAME = "Pro'pulse";
export const SITE_TITLE = "Pro'pulse | Rencontres informelles entre étudiants et pros";
export const SITE_DESCRIPTION =
  "Des cercles de rencontres informelles entre étudiants et professionnels, comme autour d'un café. Sans évaluation, sans compétition.";
export const SITE_TITLE_EN = "Pro'pulse | Informal meetups between students and professionals";
export const SITE_DESCRIPTION_EN =
  "Small, informal circles where students meet professionals over a coffee in Paris. No evaluation, no competition.";
export const INSTAGRAM_URL = "https://www.instagram.com/propulse.students/";
export const INSTAGRAM_HANDLE = "@propulse.students";

/** Adresse e-mail de contact de l'équipe, affichée sur le site. */
export const CONTACT_EMAIL = "propulse382@gmail.com";

/** Cadre du projet, affiché dans le pied de page, « À propos » et les mentions légales. */
export const PROJECT_FRAME = "Projet étudiant du Master UNIC (communication) de l'Université Paris-Panthéon-Assas";
export const PROJECT_FRAME_EN = "A student project from the UNIC Master's programme (communication) at Université Paris-Panthéon-Assas";

/**
 * Prénom et nom de la personne responsable de la publication (mentions légales).
 * Laisser vide affiche « L'équipe Pro'pulse ».
 */
export const PUBLICATION_DIRECTOR = "";

/** Adresse publique du site (sert aux aperçus de lien : LinkedIn, WhatsApp…). */
export const SITE_URL = "https://propulse-students.lovable.app";

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
export const ARTICLE_CATEGORIES_EN: Record<ArticleCategory, string> = {
  interview: "Interview",
  "parcours-atypique": "Unusual path",
  "vos-questions": "Your questions",
};
