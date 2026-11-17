import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { CalendarDays, List } from "lucide-react";
import { upcomingEventsQuery } from "@/lib/queries";
import { defineCopy, pick, useCopy } from "@/lib/i18n";
import { EventCard } from "@/components/site/EventCard";
import { EventCalendar } from "@/components/site/EventCalendar";
import { Emph } from "@/components/site/Brand";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  filtre: z.enum(["tous", "cercles", "externes"]).catch("tous").default("tous"),
  vue: z.enum(["calendrier", "liste"]).catch("calendrier").default("calendrier"),
});

export const Route = createFileRoute("/agenda/")({
  validateSearch: searchSchema,
  head: ({ match }) => {
    const lang = match.context.lang;
    const title = pick(lang, "Agenda | Pro'pulse", "Events | Pro'pulse");
    const description = pick(
      lang,
      "Les prochains cercles Pro'pulse et les forums, salons et conférences à ne pas rater.",
      "Upcoming Pro'pulse circles and the job fairs, forums and talks worth attending.",
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(upcomingEventsQuery),
  component: Agenda,
});

const COPY = defineCopy({
  fr: {
    eyebrow: "Agenda",
    title: { plain: "Les rendez-vous", emph: "à venir" },
    intro: "Nos cercles Pro'pulse, et les forums, salons et conférences qu'on te conseille.",
    filters: { tous: "Tous", cercles: "Cercles Pro'pulse", externes: "À ne pas rater" },
    filterLabel: "Filtrer les événements",
    views: { calendrier: "Calendrier", liste: "Liste" },
    viewLabel: "Affichage",
    empty: "Aucun événement pour le moment, reviens bientôt.",
    note: "",
  },
  en: {
    eyebrow: "Events",
    title: { plain: "What's", emph: "coming up" },
    intro: "Our Pro'pulse circles, plus the job fairs, forums and talks we recommend.",
    filters: { tous: "All", cercles: "Pro'pulse circles", externes: "Worth attending" },
    filterLabel: "Filter events",
    views: { calendrier: "Calendar", liste: "List" },
    viewLabel: "View",
    empty: "No events for now, check back soon.",
    note: "Most external events are held in French.",
  },
});

const FILTERS = ["tous", "cercles", "externes"] as const;
const VIEWS = [
  { value: "calendrier", Icon: CalendarDays },
  { value: "liste", Icon: List },
] as const;

function Agenda() {
  const t = useCopy(COPY);
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
          <p className="eyebrow text-brand-yellow">{t.eyebrow}</p>
          <h1 className="mt-4 text-5xl md:text-7xl">
            {t.title.plain} <Emph className="text-brand-yellow">{t.title.emph}</Emph>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-white/90">{t.intro}</p>
          {t.note && <p className="mt-2 text-sm text-brand-white/70">{t.note}</p>}
        </div>
      </section>

      <section className="container-page py-10 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Link
                key={f}
                to="/agenda"
                search={(prev) => ({ ...prev, filtre: f })}
                aria-current={filtre === f ? "page" : undefined}
                className={cn(
                  "rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold transition-colors",
                  filtre === f
                    ? "bg-brand-blue text-brand-white"
                    : "bg-brand-white text-brand-blue hover:bg-brand-mist",
                )}
              >
                {t.filters[f]}
              </Link>
            ))}
          </div>

          <div
            role="group"
            aria-label={t.viewLabel}
            className="inline-flex rounded-full bg-brand-mist p-1"
          >
            {VIEWS.map(({ value, Icon }) => (
              <Link
                key={value}
                to="/agenda"
                search={(prev) => ({ ...prev, vue: value })}
                aria-current={vue === value ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  vue === value
                    ? "bg-brand-blue text-brand-white"
                    : "text-brand-blue hover:bg-brand-white",
                )}
              >
                <Icon className="size-4" aria-hidden="true" /> {t.views[value]}
              </Link>
            ))}
          </div>
        </div>

        {vue === "calendrier" ? (
          <EventCalendar key={filtre} events={list} />
        ) : list.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-brand-mist px-6 py-16 text-center text-xl font-bold">
            {t.empty}
          </p>
        ) : (
          <ol className="mt-10 grid gap-6 md:grid-cols-2">
            {list.map((e) => (
              <li key={e.id} className="reveal flex">
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
