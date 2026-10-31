import { z } from "zod";

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

export function isPersonalEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@").pop() ?? "";
  return PERSONAL_EMAIL_DOMAINS.includes(domain);
}

/** Shared schema: used by the form (client) AND the server function. */
export const registrationSchema = z.object({
  eventId: z.string().uuid(),
  firstName: z.string().trim().min(1, "Ton prénom est requis.").max(80),
  lastName: z.string().trim().min(1, "Ton nom est requis.").max(80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Ton email est requis.")
    .max(255)
    .email("Cette adresse email n'est pas valide.")
    .refine((v) => !isPersonalEmail(v), ACADEMIC_EMAIL_MESSAGE),
  motivation: z
    .string()
    .trim()
    .min(1, "Dis-nous en quelques mots pourquoi ce cercle t'intéresse.")
    .max(500, "500 caractères maximum."),
  questions: z.string().trim().max(1000, "1000 caractères maximum.").optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Ton accord est nécessaire pour t'inscrire." }) }),
  turnstileToken: z.string().min(1, "Merci de valider la vérification anti-robot."),
});
export type RegistrationInput = z.infer<typeof registrationSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Votre nom est requis.").max(120),
  email: z.string().trim().toLowerCase().min(1, "Votre email est requis.").max(255).email("Cette adresse email n'est pas valide."),
  companyRole: z.string().trim().min(1, "Votre entreprise / poste est requis.").max(160),
  message: z.string().trim().min(1, "Votre message est requis.").max(2000, "2000 caractères maximum."),
  turnstileToken: z.string().min(1, "Merci de valider la vérification anti-robot."),
});
export type ContactInput = z.infer<typeof contactSchema>;
