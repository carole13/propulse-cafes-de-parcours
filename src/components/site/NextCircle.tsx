/** Encart jaune « Prochain cercle » : le prochain cercle à venir, ou un renvoi vers Instagram. */
import { Link } from "@tanstack/react-router";
import { Calendar, MapPin } from "lucide-react";
import type { EventRow } from "@/lib/content.functions";
import { capitalize, formatDay, formatTime } from "@/lib/format";
import { INSTAGRAM_URL } from "@/lib/brand";
import { defineCopy, useCopy, useLang } from "@/lib/i18n";
import { localizeEvent } from "@/lib/localize";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "./Brand";

const COPY = defineCopy({
  fr: {
    badge: "Prochain cercle",
    with: "Avec",
    at: "à",
    small: "Petit comité, places sur demande.",
    open: "Sans évaluation, sans compétition.",
    request: "Demander une place",
    register: "Je m'inscris",
    soonTitle: "Le prochain cercle sera bientôt annoncé.",
    soonBefore: "Suis-nous sur",
    soonAfter: "pour ne rien rater.",
    newTab: "(nouvel onglet)",
  },
  en: {
    badge: "Next circle",
    with: "With",
    at: "at",
    small: "Small group, seats on request.",
    open: "No evaluation, no competition.",
    request: "Request a seat",
    register: "Register",
    soonTitle: "The next circle will be announced soon.",
    soonBefore: "Follow us on",
    soonAfter: "so you don't miss it.",
    newTab: "(new tab)",
  },
});

export function NextCircle({ event: raw }: { event: EventRow | null }) {
  const lang = useLang();
  const t = useCopy(COPY);
  const event = raw ? localizeEvent(raw, lang) : null;

  return (
    <section
      id="prochain-cercle"
      aria-labelledby="next-title"
      className="scroll-mt-24 rounded-2xl bg-brand-yellow p-6 text-brand-blue shadow-[0_24px_60px_-30px_rgba(30,42,128,0.45)] md:p-10"
    >
      <div className="flex items-center justify-between">
        <Badge>
          {event && (
            // Point qui « pulse » : un cercle est annoncé
            <span aria-hidden="true" className="relative mr-2 flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-brand-night opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-night" />
            </span>
          )}
          {t.badge}
        </Badge>
        <span className="text-xs font-bold tracking-[0.14em]">PRO'PULSE</span>
      </div>

      {event ? (
        <div className="mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <h2 id="next-title" className="text-3xl md:text-5xl">
              {event.title}
            </h2>
            <ul className="mt-5 space-y-2 text-base md:text-lg">
              <li className="flex items-start gap-3">
                <Calendar className="mt-1 size-5 shrink-0" aria-hidden="true" />
                <span className="font-semibold">
                  {capitalize(formatDay(event.start_at, lang))} {t.at}{" "}
                  {formatTime(event.start_at, lang)}
                </span>
              </li>
              {event.location && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 size-5 shrink-0" aria-hidden="true" />
                  <span>{event.location}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col gap-5 md:items-end md:text-right">
            {event.speaker_name && (
              <p className="flex items-center gap-3 md:flex-row-reverse">
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
                  {t.with} <strong>{event.speaker_name}</strong>
                  {event.speaker_role && (
                    <span className="block text-sm">{event.speaker_role}</span>
                  )}
                </span>
              </p>
            )}
            <div className="flex flex-col gap-3 md:items-end">
              <Link
                to="/agenda/$id"
                params={{ id: event.id }}
                className={buttonVariants({ size: "lg" })}
              >
                {event.registration === "message" ? t.request : t.register}
              </Link>
              <p className="text-sm">{event.registration === "message" ? t.small : t.open}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2 id="next-title" className="mt-8 text-3xl md:text-5xl">
            {t.soonTitle}
          </h2>
          <p className="mt-4 text-lg">
            {t.soonBefore}{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline underline-offset-4"
            >
              Instagram<span className="sr-only"> {t.newTab}</span>
            </a>{" "}
            {t.soonAfter}
          </p>
        </>
      )}
    </section>
  );
}
