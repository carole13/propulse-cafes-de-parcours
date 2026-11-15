/**
 * Fil Instagram de la page d'accueil.
 *
 * Les publications viennent d'un flux JSON Behold (behold.so), qui se connecte à
 * Instagram à notre place : aucun mot de passe ni jeton Instagram dans le code.
 * L'URL du flux n'est pas secrète (elle est faite pour être lue par un site) :
 * elle se règle dans `INSTAGRAM_FEED_URL` (src/lib/brand.ts).
 *
 * Ce fichier ne fait que transformer la réponse de Behold en données simples,
 * en ignorant tout ce qui est mal formé plutôt que de casser la page.
 */
import { z } from "zod";

/** Nombre maximum de publications affichées (le plan gratuit de Behold en fournit 6). */
export const INSTAGRAM_MAX_POSTS = 6;

export type InstagramPost = {
  id: string;
  permalink: string;
  kind: "image" | "video" | "carousel";
  imageUrl: string;
  width: number | null;
  height: number | null;
  alt: string;
};

const sizeSchema = z.object({
  mediaUrl: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
});

const postSchema = z.object({
  id: z.string(),
  permalink: z.string().url(),
  mediaType: z.enum(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]),
  mediaUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  sizes: z
    .object({
      small: sizeSchema.optional(),
      medium: sizeSchema.optional(),
      large: sizeSchema.optional(),
    })
    .partial()
    .optional(),
  altText: z.string().optional(),
  prunedCaption: z.string().optional(),
  caption: z.string().optional(),
});

/** Légende raccourcie pour le texte alternatif de l'image. */
function altFrom(p: z.infer<typeof postSchema>) {
  const text = (p.altText || p.prunedCaption || p.caption || "").replace(/\s+/g, " ").trim();
  if (!text) return "Publication Instagram de Pro'pulse";
  return text.length > 140 ? `${text.slice(0, 137)}…` : text;
}

/** Accepte le format actuel de Behold ({ posts: [...] }) et l'ancien (tableau direct). */
export function parseInstagramFeed(input: unknown, max = INSTAGRAM_MAX_POSTS): InstagramPost[] {
  const list: unknown[] = Array.isArray(input)
    ? input
    : input && typeof input === "object" && Array.isArray((input as { posts?: unknown }).posts)
      ? (input as { posts: unknown[] }).posts
      : [];

  const posts: InstagramPost[] = [];
  for (const item of list) {
    const parsed = postSchema.safeParse(item);
    if (!parsed.success) continue;
    const p = parsed.data;
    // Image redimensionnée par Behold si possible ; sinon la vignette (vidéo) ou l'original.
    const size = p.sizes?.medium ?? p.sizes?.large ?? p.sizes?.small;
    const imageUrl = size?.mediaUrl ?? (p.mediaType === "VIDEO" ? p.thumbnailUrl : p.mediaUrl);
    if (!imageUrl) continue;
    posts.push({
      id: p.id,
      permalink: p.permalink,
      kind:
        p.mediaType === "VIDEO" ? "video" : p.mediaType === "CAROUSEL_ALBUM" ? "carousel" : "image",
      imageUrl,
      width: size?.width ?? null,
      height: size?.height ?? null,
      alt: altFrom(p),
    });
    if (posts.length >= max) break;
  }
  return posts;
}
