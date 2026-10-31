import { queryOptions } from "@tanstack/react-query";
import { getArticle, getCircle, getNextCircle, listArticles, listUpcomingEvents } from "./content.functions";

export const upcomingEventsQuery = queryOptions({ queryKey: ["events", "upcoming"], queryFn: () => listUpcomingEvents() });
export const nextCircleQuery = queryOptions({ queryKey: ["events", "next-circle"], queryFn: () => getNextCircle() });
export const circleQuery = (id: string) =>
  queryOptions({ queryKey: ["events", "circle", id], queryFn: () => getCircle({ data: { id } }) });
export const articlesQuery = (limit?: number) =>
  queryOptions({ queryKey: ["articles", limit ?? "all"], queryFn: () => listArticles({ data: limit ? { limit } : {} }) });
export const articleQuery = (slug: string) =>
  queryOptions({ queryKey: ["articles", "slug", slug], queryFn: () => getArticle({ data: { slug } }) });
