import { z } from "zod";
import type { Lang } from "./i18n";

/** Personal email domains refused for circle registration. */
export const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "hotmail.fr",
  "outlook.com",
  "outlook.fr",
  "live.fr",
  "yahoo.com",
  "yahoo.fr",
  "icloud.com",
  "orange.fr",
  "free.fr",
  "laposte.net",
  "sfr.fr",
  "wanadoo.fr",
];

export const ACADEMIC_EMAIL_MESSAGE = "Merci d'utiliser ton adresse email étudiante.";
export const ACADEMIC_EMAIL_MESSAGE_EN = "Please use your student email address.";

export function isPersonalEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@").pop() ?? "";
  return PERSONAL_EMAIL_DOMAINS.includes(domain);
}

/** Messages d'erreur des formulaires, dans les deux langues. */
const MSG = {
  fr: {
    firstName: "Ton prénom est requis.",
    lastName: "Ton nom est requis.",
    email: "Ton email est requis.",
    emailInvalid: "Cette adresse email n'est pas valide.",
    academic: ACADEMIC_EMAIL_MESSAGE,
    motivation: "Dis-nous en quelques mots pourquoi ce cercle t'intéresse.",
    max: (n: number) => `${n} caractères maximum.`,
    consent: "Ton accord est nécessaire pour t'inscrire.",
    captcha: "Merci de valider la vérification anti-robot.",
    name: "Votre nom est requis.",
    proEmail: "Votre email est requis.",
    companyRole: "Votre entreprise / poste est requis.",
    message: "Votre message est requis.",
  },
  en: {
    firstName: "Please enter your first name.",
    lastName: "Please enter your last name.",
    email: "Please enter your email.",
    emailInvalid: "This email address is not valid.",
    academic: ACADEMIC_EMAIL_MESSAGE_EN,
    motivation: "Tell us in a few words why this circle interests you.",
    max: (n: number) => `${n} characters maximum.`,
    consent: "We need your consent to register you.",
    captcha: "Please complete the anti-bot check.",
    name: "Please enter your name.",
    proEmail: "Please enter your email.",
    companyRole: "Please enter your company / position.",
    message: "Please enter a message.",
  },
};

/** Schéma partagé : formulaire (client, dans la langue du site) ET fonction serveur (français). */
export function makeRegistrationSchema(lang: Lang = "fr") {
  const m = MSG[lang];
  return z.object({
    eventId: z.string().uuid(),
    firstName: z.string().trim().min(1, m.firstName).max(80),
    lastName: z.string().trim().min(1, m.lastName).max(80),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, m.email)
      .max(255)
      .email(m.emailInvalid)
      .refine((v) => !isPersonalEmail(v), m.academic),
    motivation: z.string().trim().min(1, m.motivation).max(500, m.max(500)),
    questions: z.string().trim().max(1000, m.max(1000)).optional().default(""),
    consent: z.literal(true, { errorMap: () => ({ message: m.consent }) }),
    turnstileToken: z.string().min(1, m.captcha),
  });
}
export const registrationSchema = makeRegistrationSchema("fr");
export type RegistrationInput = z.infer<typeof registrationSchema>;

export function makeContactSchema(lang: Lang = "fr") {
  const m = MSG[lang];
  return z.object({
    name: z.string().trim().min(1, m.name).max(120),
    email: z.string().trim().toLowerCase().min(1, m.proEmail).max(255).email(m.emailInvalid),
    companyRole: z.string().trim().min(1, m.companyRole).max(160),
    message: z.string().trim().min(1, m.message).max(2000, m.max(2000)),
    turnstileToken: z.string().min(1, m.captcha),
  });
}
export const contactSchema = makeContactSchema("fr");
export type ContactInput = z.infer<typeof contactSchema>;
