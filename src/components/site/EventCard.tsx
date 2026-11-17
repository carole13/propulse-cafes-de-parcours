import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import type { EventRow } from "@/lib/content.functions";
import { capitalize, formatDay, formatTime } from "@/lib/format";
import { defineCopy, useCopy, useLang } from "@/lib/i18n";
import { localizeEvent } from "@/lib/localize";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "./Brand";

const COPY = defineCopy({
  fr: {
    circle: "Cercle Pro'pulse",
    external: "À ne pas rater",
    with: "Avec",
    onRequest: "Places limitées · sur demande",
    see: "Voir le cercle",
    more: "En savoir plus",
    newTab: "(nouvel onglet)",
  },
  en: {
    circle: "Pro'pulse circle",
    external: "Worth attending",
    with: "With",
    onRequest: "Limited seats · on request",
    see: "See the circle",
    more: "Learn more",
    newTab: "(new tab)",
  },
});

/** Carte de l'agenda. Les cercles Pro'pulse ont un liseré fuchsia à gauche. */
export function EventCard({ event: raw }: { event: EventRow }) {
  const lang = useLang();
  const t = useCopy(COPY);
  const event = localizeEvent(raw, lang);
  const isCircle = event.type === "propulse";
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl bg-brand-white p-6 ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-lg",
        isCircle && "border-l-4 border-brand-fuchsia",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {isCircle ? <Badge>{t.circle}</Badge> : <Badge tone="mint">{t.external}</Badge>}
        {event.sector && (
          <span className="text-xs font-semibold text-brand-ink">{event.sector}</span>
        )}
      </div>
      <h3 className="text-xl md:text-2xl">{event.title}</h3>
      <ul className="space-y-1 text-sm text-brand-ink">
        <li className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0" aria-hidden="true" />
          {capitalize(formatDay(event.start_at, lang))} · {formatTime(event.start_at, lang)}
        </li>
        {event.location && (
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {event.location}
          </li>
        )}
      </ul>
      {isCircle && event.speaker_name && (
        <p className="flex items-center gap-3 text-sm text-brand-ink">
          {event.speaker_photo_url && (
            <img
              src={event.speaker_photo_url}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              className="size-10 shrink-0 rounded-full object-cover"
            />
          )}
          <span>
            {t.with} <strong className="text-brand-blue">{event.speaker_name}</strong>
            {event.speaker_role ? `, ${event.speaker_role}` : ""}
          </span>
        </p>
      )}
      {isCircle && event.registration === "message" && (
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">
          {t.onRequest}
        </p>
      )}
      <div className="mt-auto pt-2">
        {isCircle ? (
          <Link to="/agenda/$id" params={{ id: event.id }} className={buttonVariants()}>
            {t.see}
          </Link>
        ) : event.external_url ? (
          <a
            href={event.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            {t.more} <ArrowUpRight aria-hidden="true" />
            <span className="sr-only">{t.newTab}</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
