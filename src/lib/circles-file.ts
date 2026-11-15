/**
 * Cercles Pro'pulse gérés depuis GitHub (fichier `src/data/cercles.json`).
 *
 * Ils s'ajoutent aux cercles de la base Supabase. Un cercle du fichier a une
 * inscription « sur demande » : pas de formulaire, l'étudiant écrit à l'équipe
 * en message privé sur Instagram, et l'équipe choisit qui participe.
 * Voir `src/data/README.md`.
 */
import { z } from "zod";
import raw from "@/data/cercles.json";
import type { EventRow } from "./content.functions";

export const FILE_CIRCLE_PREFIX = "cercle-";

const circleSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id en minuscules, chiffres et tirets"),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  start_at: z.string().datetime({ offset: true }),
  location: z.string().nullable().optional(),
  sector: z.string().nullable().optional(),
  speaker: z
    .object({
      name: z.string().min(1),
      role: z.string().nullable().optional(),
      bio: z.string().nullable().optional(),
      /** Chemin d'une image du dossier `public/` (ex. /intervenants/prenom-nom.jpg) ou URL https. */
      photo: z.string().nullable().optional(),
    })
    .optional(),
  capacity: z.number().int().positive().nullable().optional(),
  image: z.string().nullable().optional(),
  inscription: z.literal("message").default("message"),
});

/** Valide la liste et ignore une entrée mal formée plutôt que de casser la page. */
export function parseFileCircles(input: unknown): EventRow[] {
  if (!Array.isArray(input)) return [];
  const rows: EventRow[] = [];
  for (const item of input) {
    const parsed = circleSchema.safeParse(item);
    if (!parsed.success) {
      console.error("Cercle ignoré", item, parsed.error.issues);
      continue;
    }
    const c = parsed.data;
    rows.push({
      id: `${FILE_CIRCLE_PREFIX}${c.id}`,
      title: c.title,
      description: c.description ?? null,
      type: "propulse",
      start_at: c.start_at,
      location: c.location ?? null,
      sector: c.sector ?? null,
      speaker_name: c.speaker?.name ?? null,
      speaker_role: c.speaker?.role ?? null,
      speaker_bio: c.speaker?.bio ?? null,
      speaker_photo_url: c.speaker?.photo ?? null,
      capacity: c.capacity ?? null,
      external_url: null,
      image_url: c.image ?? null,
      registration: c.inscription,
    });
  }
  return rows.sort((a, b) => a.start_at.localeCompare(b.start_at));
}

export const isFileCircleId = (id: string) => /^cercle-[a-z0-9-]+$/.test(id);

/** Cercles du fichier à venir, dans l'ordre chronologique. */
export function upcomingFileCircles(now: Date = new Date()): EventRow[] {
  return parseFileCircles(raw).filter((e) => new Date(e.start_at).getTime() >= now.getTime());
}

/** Un cercle du fichier par son identifiant de page (`cercle-…`), passé ou à venir. */
export function findFileCircle(id: string): EventRow | null {
  return parseFileCircles(raw).find((e) => e.id === id) ?? null;
}
