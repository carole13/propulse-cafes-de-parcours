/**
 * Public, read-only content (events & articles).
 * Uses the publishable key: RLS only exposes rows where published = true.
 */
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { mergeEvents, upcomingExternalEvents } from "./external-events";
import { findFileCircle, isFileCircleId, upcomingFileCircles } from "./circles-file";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const EVENT_COLUMNS =
  "id,title,description,type,start_at,location,sector,speaker_name,speaker_role,speaker_bio,capacity,external_url,image_url";
const ARTICLE_LIST_COLUMNS = "id,title,slug,category,excerpt,cover_image_url,published_at";

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  type: "propulse" | "externe";
  start_at: string;
  location: string | null;
  sector: string | null;
  speaker_name: string | null;
  speaker_role: string | null;
  speaker_bio: string | null;
  capacity: number | null;
  external_url: string | null;
  image_url: string | null;
  /** Photo de l'intervenant·e (cercles du fichier src/data/cercles.json). */
  speaker_photo_url?: string | null;
  /** « message » : inscription sur demande, sans formulaire. Absent = formulaire. */
  registration?: "form" | "message";
  /** Version anglaise facultative des textes (fichiers de src/data). Voir src/lib/localize.ts. */
  en?: EventTranslation;
};
export type EventTranslation = {
  [K in "title" | "description" | "location" | "sector" | "speaker_role" | "speaker_bio"]?: string | undefined;
};
export type ArticleListItem = {
  id: string;
  title: string;
  slug: string;
  category: "interview" | "parcours-atypique" | "vos-questions";
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};
export type Article = ArticleListItem & { content: string | null };

/** Upcoming published events (database + weekly watch file), chronological. */
export const listUpcomingEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("events")
    .select(EVENT_COLUMNS)
    .gte("start_at", new Date().toISOString())
    .order("start_at", { ascending: true });
  if (error) console.error("listUpcomingEvents", error);
  return mergeEvents((data ?? []) as EventRow[], [...upcomingFileCircles(), ...upcomingExternalEvents()]);
});

/** Next upcoming Pro'pulse circle (or null). */
export const getNextCircle = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("type", "propulse")
    .gte("start_at", new Date().toISOString())
    .order("start_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) console.error("getNextCircle", error);
  // Le plus proche entre la base et le fichier des cercles.
  const candidates = [data as EventRow | null, upcomingFileCircles()[0] ?? null].filter(
    (e): e is EventRow => e !== null,
  );
  return candidates.sort((a, b) => a.start_at.localeCompare(b.start_at))[0] ?? null;
});

/** One circle + remaining seats (count only, via SQL function). */
export const getCircle = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z.object({ id: z.union([z.string().uuid(), z.string().regex(/^cercle-[a-z0-9-]+$/)]) }).parse(d),
  )
  .handler(async ({ data }) => {
    if (isFileCircleId(data.id)) {
      const event = findFileCircle(data.id);
      if (!event) return null;
      return { event, remaining: null, isPast: new Date(event.start_at).getTime() < Date.now() };
    }
    const sb = publicClient();
    const { data: event, error } = await sb
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("id", data.id)
      .eq("type", "propulse")
      .maybeSingle();
    if (error) console.error("getCircle", error);
    if (!event) return null;
    const { data: seats } = await sb.rpc("remaining_seats", { _event_id: data.id });
    return {
      event: event as EventRow,
      remaining: typeof seats === "number" ? seats : null,
      isPast: new Date((event as EventRow).start_at).getTime() < Date.now(),
    };
  });

export const listArticles = createServerFn({ method: "GET" })
  .inputValidator((d: { limit?: number } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    let q = publicClient()
      .from("articles")
      .select(ARTICLE_LIST_COLUMNS)
      .order("published_at", { ascending: false });
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) {
      console.error("listArticles", error);
      return [] as ArticleListItem[];
    }
    return (rows ?? []) as ArticleListItem[];
  });

export const getArticle = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("articles")
      .select(`${ARTICLE_LIST_COLUMNS},content`)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) console.error("getArticle", error);
    return (row as Article | null) ?? null;
  });
