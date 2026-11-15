/** "Prochain cercle" yellow box: next upcoming circle, or an Instagram fallback. */
import { Link } from "@tanstack/react-router";
import type { EventRow } from "@/lib/content.functions";
import { capitalize, formatDay, formatTime } from "@/lib/format";
import { INSTAGRAM_URL } from "@/lib/brand";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "./Brand";

export function NextCircle({ event }: { event: EventRow | null }) {
  return (
    <section id="prochain-cercle" aria-labelledby="next-title" className="scroll-mt-24 rounded-2xl bg-brand-yellow p-6 text-brand-blue md:p-10">
      <div className="flex items-center justify-between">
        <Badge>
          {event && (
            // Point qui « pulse » : un cercle est annoncé
            <span aria-hidden="true" className="relative mr-2 flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-brand-night opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-night" />
            </span>
          )}
          Prochain cercle
        </Badge>
        <span className="text-sm font-extrabold tracking-wide">PRO'PULSE</span>
      </div>
      {event ? (
        <>
          <h2 id="next-title" className="mt-8 text-4xl md:text-6xl">
            {capitalize(formatDay(event.start_at))}
            <br />à {formatTime(event.start_at)}
          </h2>
          <p className="mt-4 text-base md:text-lg">
            {[event.location, event.sector && `secteur : ${event.sector}`].filter(Boolean).join(" · ")}
          </p>
          {event.speaker_name && (
            <p className="mt-4 flex items-center gap-3 text-base md:text-lg">
              {event.speaker_photo_url && (
                <img
                  src={event.speaker_photo_url}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-full object-cover ring-2 ring-brand-blue"
                />
              )}
              <span>
                Avec <strong>{event.speaker_name}</strong>
                {event.speaker_role ? `, ${event.speaker_role}` : ""}
              </span>
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <p className="text-sm font-medium">
              {event.registration === "message" ? (
                <>Petit comité.<br />Places sur demande.</>
              ) : (
                <>Sans évaluation.<br />Sans compétition.</>
              )}
            </p>
            <Link to="/agenda/$id" params={{ id: event.id }} className={buttonVariants({ size: "lg" })}>
              {event.registration === "message" ? "Demander une place" : "Je m'inscris"}
            </Link>
          </div>
        </>
      ) : (
        <>
          <h2 id="next-title" className="mt-8 text-3xl md:text-5xl">Le prochain cercle sera bientôt annoncé.</h2>
          <p className="mt-4 text-lg">
            Suis-nous sur{" "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4">
              Instagram<span className="sr-only"> (nouvel onglet)</span>
            </a>{" "}
            pour ne rien rater.
          </p>
        </>
      )}
    </section>
  );
}
