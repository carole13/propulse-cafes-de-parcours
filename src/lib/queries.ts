import { queryOptions } from "@tanstack/react-query";
import { getArticle, getCircle, getNextCircle, listArticles, listUpcomingEvents } from "./content.functions";
import { getInstagramPosts } from "./instagram.functions";

export const upcomingEventsQuery = queryOptions({ queryKey: ["events", "upcoming"], queryFn: () => listUpcomingEvents() });
export const nextCircleQuery = queryOptions({ queryKey: ["events", "next-circle"], queryFn: () => getNextCircle() });
export const circleQuery = (id: string) =>
  queryOptions({ queryKey: ["events", "circle", id], queryFn: () => getCircle({ data: { id } }) });
export const articlesQuery = (limit?: number) =>
  queryOptions({ queryKey: ["articles", limit ?? "all"], queryFn: () => listArticles({ data: limit ? { limit } : {} }) });
export const articleQuery = (slug: string) =>
  queryOptions({ queryKey: ["articles", "slug", slug], queryFn: () => getArticle({ data: { slug } }) });
/** Fil Instagram : chargé après la page (non bloquant), rafraîchi au plus toutes les heures côté navigateur. */
export const instagramQuery = queryOptions({
  queryKey: ["instagram"],
  queryFn: () => getInstagramPosts(),
  staleTime: 60 * 60 * 1000,
});
