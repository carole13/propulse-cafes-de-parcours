import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import type { EventRow } from "@/lib/content.functions";
import { capitalize, formatDay, formatTime } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "./Brand";

/** Agenda card. Pro'pulse circles are highlighted with a fuchsia border + badge. */
export function EventCard({ event }: { event: EventRow }) {
  const isCircle = event.type === "propulse";
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl p-6 transition-transform hover:-translate-y-1",
        isCircle ? "border-4 border-brand-fuchsia bg-brand-white" : "bg-brand-mist",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {isCircle ? <Badge>Cercle Pro'pulse</Badge> : <Badge tone="mint">À ne pas rater</Badge>}
        {event.sector && <span className="text-xs font-semibold text-brand-ink">{event.sector}</span>}
      </div>
      <h3 className="text-xl md:text-2xl">{event.title}</h3>
      <ul className="space-y-1 text-sm text-brand-ink">
        <li className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0" aria-hidden="true" />
          {capitalize(formatDay(event.start_at))} · {formatTime(event.start_at)}
        </li>
        {event.location && (
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" /> {event.location}
          </li>
        )}
      </ul>
      {isCircle && event.speaker_name && (
        <p className="text-sm text-brand-ink">
          Avec <strong className="text-brand-blue">{event.speaker_name}</strong>
          {event.speaker_role ? `, ${event.speaker_role}` : ""}
        </p>
      )}
      <div className="mt-auto pt-2">
        {isCircle ? (
          <Link to="/agenda/$id" params={{ id: event.id }} className={buttonVariants()}>
            Voir le cercle
          </Link>
        ) : event.external_url ? (
          <a href={event.external_url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
            En savoir plus <ArrowUpRight aria-hidden="true" />
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
