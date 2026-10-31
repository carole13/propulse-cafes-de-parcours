/**
 * Événements externes issus de la veille hebdomadaire.
 *
 * Ils sont listés dans `src/data/evenements-externes.json`. Chaque semaine, la veille
 * propose des ajouts dans une Pull Request : rien n'apparaît sur le site tant que
 * l'équipe ne l'a pas relue et fusionnée (Merge). Voir `src/data/README.md`.
 */
import { z } from "zod";
import raw from "@/data/evenements-externes.json";
import type { EventRow } from "./content.functions";

const externalEventSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id en minuscules, chiffres et tirets"),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  start_at: z.string().datetime({ offset: true }),
  location: z.string().nullable().optional(),
  sector: z.string().nullable().optional(),
  external_url: z.string().url(),
  /** Champs de suivi pour la relecture (non affichés sur le site). */
  price: z.string().optional(),
  why: z.string().optional(),
  source: z.string().optional(),
});

export type ExternalEvent = z.infer<typeof externalEventSchema>;

/** Valide la liste et ignore une entrée mal formée plutôt que de casser la page. */
export function parseExternalEvents(input: unknown): EventRow[] {
  if (!Array.isArray(input)) return [];
  const rows: EventRow[] = [];
  for (const item of input) {
    const parsed = externalEventSchema.safeParse(item);
    if (!parsed.success) {
      console.error("Événement externe ignoré", item, parsed.error.issues);
      continue;
    }
    const e = parsed.data;
    rows.push({
      id: `veille-${e.id}`,
      title: e.title,
      description: e.description ?? null,
      type: "externe",
      start_at: e.start_at,
      location: e.location ?? null,
      sector: e.sector ?? null,
      speaker_name: null,
      speaker_role: null,
      speaker_bio: null,
      capacity: null,
      external_url: e.external_url,
      image_url: null,
    });
  }
  return rows;
}

/** Événements externes à venir, issus du fichier de veille. */
export function upcomingExternalEvents(now: Date = new Date()): EventRow[] {
  return parseExternalEvents(raw).filter((e) => new Date(e.start_at).getTime() >= now.getTime());
}

/** Fusionne base + veille, sans doublon (même titre le même jour), dans l'ordre chronologique. */
export function mergeEvents(fromDb: EventRow[], fromFile: EventRow[]): EventRow[] {
  const key = (e: EventRow) => `${e.title.trim().toLowerCase()}|${e.start_at.slice(0, 10)}`;
  const seen = new Set(fromDb.map(key));
  const merged = [...fromDb, ...fromFile.filter((e) => !seen.has(key(e)))];
  return merged.sort((a, b) => a.start_at.localeCompare(b.start_at));
}
