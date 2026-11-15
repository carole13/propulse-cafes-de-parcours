/**
 * Récupère le fil Instagram côté serveur, avec un cache de 6 heures.
 *
 * Pourquoi côté serveur : le plan gratuit de Behold est limité à 1 200 lectures
 * du flux par mois. En gardant la réponse en mémoire, on lit le flux quelques fois
 * par jour au lieu d'une fois par visiteur. Behold ne met de toute façon à jour
 * le flux gratuit qu'une fois par jour.
 *
 * En cas de problème (flux non configuré, Behold en pause ou lent), on renvoie
 * la dernière version connue, ou une liste vide : la section est alors masquée.
 */
import { createServerFn } from "@tanstack/react-start";
import { INSTAGRAM_FEED_URL } from "./brand";
import { parseInstagramFeed, type InstagramPost } from "./instagram";

const CACHE_MS = 6 * 60 * 60 * 1000;
let cache: { at: number; posts: InstagramPost[] } | null = null;

export const getInstagramPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<InstagramPost[]> => {
    if (!INSTAGRAM_FEED_URL) return [];
    if (cache && Date.now() - cache.at < CACHE_MS) return cache.posts;
    try {
      const res = await fetch(INSTAGRAM_FEED_URL, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error(`Behold HTTP ${res.status}`);
      const posts = parseInstagramFeed(await res.json());
      cache = { at: Date.now(), posts };
      return posts;
    } catch (e) {
      console.error("getInstagramPosts", e);
      return cache?.posts ?? [];
    }
  },
);
