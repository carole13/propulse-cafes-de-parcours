import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { upcomingEventsQuery } from "@/lib/queries";
import { EventCard } from "@/components/site/EventCard";
import { EventCalendar } from "@/components/site/EventCalendar";
import { BrandSymbol, Emph } from "@/components/site/Brand";
import { cn } from "@/lib/utils";
import { CalendarDays, List } from "lucide-react";

const FILTERS = [
  { value: "tous", label: "Tous" },
  { value: "cercles", label: "Cercles Pro'pulse" },
  { value: "externes", label: "À ne pas rater" },
] as const;

const VIEWS = [
  { value: "calendrier", label: "Calendrier", Icon: CalendarDays },
  { value: "liste", label: "Liste", Icon: List },
] as const;

const searchSchema = z.object({
  filtre: z.enum(["tous", "cercles", "externes"]).catch("tous").default("tous"),
  vue: z.enum(["calendrier", "liste"]).catch("calendrier").default("calendrier"),
});

export const Route = createFileRoute("/agenda/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Agenda | Pro'pulse" },
      {
        name: "description",
        content:
          "Les prochains cercles Pro'pulse et les forums, salons et conférences à ne pas rater.",
      },
      { property: "og:title", content: "Agenda | Pro'pulse" },
      {
        property: "og:description",
        content: "Les prochains cercles Pro'pulse et les événements à ne pas rater.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(upcomingEventsQuery),
  component: Agenda,
});

function Agenda() {
  const { filtre, vue } = Route.useSearch();
  const { data: events } = useSuspenseQuery(upcomingEventsQuery);
  const list = events.filter((e) =>
    filtre === "cercles"
      ? e.type === "propulse"
      : filtre === "externes"
        ? e.type === "externe"
        : true,
  );

  return (
    <>
      <section className="bg-brand-blue text-brand-white">
        <div className="container-page py-12 md:py-20">
          <h1 className="text-5xl md:text-7xl">
            L'<Emph className="text-brand-yellow">agenda</Emph>
          </h1>
          <p className="mt-4 max-w-lg text-lg">
            Nos cercles, et les rendez-vous qu'on te conseille.
          </p>
        </div>
      </section>

      <section className="container-page py-10 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Filtrer les événements" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Link
                key={f.value}
                to="/agenda"
                search={(prev) => ({ ...prev, filtre: f.value })}
                aria-current={filtre === f.value ? "page" : undefined}
                className={cn(
                  "rounded-full border-2 border-brand-blue px-5 py-2 text-sm font-bold transition-colors",
                  filtre === f.value
                    ? "bg-brand-blue text-brand-white"
                    : "bg-brand-white text-brand-blue hover:bg-brand-mint",
                )}
              >
                {f.label}
              </Link>
            ))}
          </div>

          <div
            role="group"
            aria-label="Affichage"
            className="inline-flex rounded-full bg-brand-mist p-1"
          >
            {VIEWS.map(({ value, label, Icon }) => (
              <Link
                key={value}
                to="/agenda"
                search={(prev) => ({ ...prev, vue: value })}
                aria-current={vue === value ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors",
                  vue === value
                    ? "bg-brand-blue text-brand-white"
                    : "text-brand-blue hover:bg-brand-mint",
                )}
              >
                <Icon className="size-4" aria-hidden="true" /> {label}
              </Link>
            ))}
          </div>
        </div>

        {vue === "calendrier" ? (
          <EventCalendar key={filtre} events={list} />
        ) : list.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-brand-mist px-6 py-16 text-center">
            <BrandSymbol kind="face" />
            <p className="text-xl font-bold">Aucun événement pour le moment, revenez bientôt !</p>
          </div>
        ) : (
          <ol className="mt-10 grid gap-6 md:grid-cols-2">
            {list.map((e) => (
              <li key={e.id} className="flex">
                <div className="w-full">
                  <EventCard event={e} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
