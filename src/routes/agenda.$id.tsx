import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, Lock, MapPin, Users } from "lucide-react";
import { circleQuery } from "@/lib/queries";
import { capitalize, formatDay, formatTime } from "@/lib/format";
import { INSTAGRAM_URL } from "@/lib/brand";
import { defineCopy, pick, useCopy, useLang } from "@/lib/i18n";
import { localizeEvent } from "@/lib/localize";
import { Badge } from "@/components/site/Brand";
import { RegistrationForm } from "@/components/site/RegistrationForm";
import { RequestSeat } from "@/components/site/RequestSeat";

export const Route = createFileRoute("/agenda/$id")({
  loader: async ({ context, params }) => {
    if (!/^([0-9a-f-]{36}|cercle-[a-z0-9-]+)$/i.test(params.id)) throw notFound();
    const data = await context.queryClient.ensureQueryData(circleQuery(params.id));
    if (!data) throw notFound();
    const e = localizeEvent(data.event, context.lang);
    return { title: e.title, description: e.description, image: e.image_url };
  },
  head: ({ loaderData, match }) => {
    const lang = match.context.lang;
    if (!loaderData) {
      return {
        meta: [
          { title: pick(lang, "Cercle introuvable | Pro'pulse", "Circle not found | Pro'pulse") },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const desc = (
      loaderData.description ??
      pick(lang, "Un cercle de rencontre informelle Pro'pulse.", "An informal Pro'pulse circle.")
    ).slice(0, 160);
    const meta = [
      { title: `${loaderData.title} | Pro'pulse` },
      { name: "description", content: desc },
      { property: "og:title", content: `${loaderData.title} | Pro'pulse` },
      { property: "og:description", content: desc },
      { property: "og:type", content: "event" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData.image?.startsWith("https://")) {
      meta.push(
        { property: "og:image", content: loaderData.image },
        { name: "twitter:image", content: loaderData.image },
      );
    }
    return { meta };
  },
  notFoundComponent: NotFound,
  component: CirclePage,
});

const COPY = defineCopy({
  fr: {
    notFound: "Ce cercle est introuvable.",
    seeAgenda: "Voir l'agenda",
    back: "Agenda",
    badge: "Cercle Pro'pulse",
    sector: "Secteur",
    about: "Le cercle",
    speaker: "L'intervenant·e",
    portrait: "Portrait de",
    practical: "Infos pratiques",
    onRequest: "Places limitées, sur demande",
    full: "Complet",
    seats: (n: number) => `${n} place${n > 1 ? "s" : ""} restante${n > 1 ? "s" : ""}`,
    request: "Demander une place",
    register: "Je m'inscris",
    past: "Ce cercle a déjà eu lieu. Rendez-vous au prochain !",
    fullBefore: "Ce cercle est complet. Le prochain sera annoncé sur notre",
    newTab: "(nouvel onglet)",
  },
  en: {
    notFound: "This circle could not be found.",
    seeAgenda: "See all events",
    back: "Events",
    badge: "Pro'pulse circle",
    sector: "Field",
    about: "About this circle",
    speaker: "Guest speaker",
    portrait: "Portrait of",
    practical: "Practical details",
    onRequest: "Limited seats, on request",
    full: "Full",
    seats: (n: number) => `${n} seat${n > 1 ? "s" : ""} left`,
    request: "Request a seat",
    register: "Register",
    past: "This circle has already taken place. See you at the next one!",
    fullBefore: "This circle is full. The next one will be announced on our",
    newTab: "(new tab)",
  },
});

function NotFound() {
  const t = useCopy(COPY);
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl">{t.notFound}</h1>
      <Link to="/agenda" className="mt-6 inline-block font-bold underline">
        {t.seeAgenda}
      </Link>
    </div>
  );
}

function CirclePage() {
  const lang = useLang();
  const t = useCopy(COPY);
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(circleQuery(id));
  const [forcedFull, setForcedFull] = useState(false);
  if (!data) return null;
  const { remaining, isPast } = data;
  const event = localizeEvent(data.event, lang);
  const isFull = forcedFull || remaining === 0;

  return (
    <>
      <section className="bg-brand-blue text-brand-white">
        <div className="container-page py-10 md:py-16">
          <Link
            to="/agenda"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:text-brand-yellow"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> {t.back}
          </Link>
          <div className="mt-6">
            <Badge>{t.badge}</Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">{event.title}</h1>
          {event.sector && (
            <p className="mt-3 text-lg text-brand-yellow">
              {t.sector} : {event.sector}
            </p>
          )}
        </div>
      </section>

      <div className="container-page grid gap-10 py-10 md:py-16 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          {event.image_url && (
            <img
              src={event.image_url}
              alt=""
              className="aspect-[16/9] w-full rounded-2xl object-cover"
            />
          )}
          {event.description && (
            <div>
              <p className="eyebrow text-brand-ink">{t.about}</p>
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-brand-ink">
                {event.description}
              </p>
            </div>
          )}
          {event.speaker_name && (
            <div className="flex flex-col gap-6 rounded-2xl bg-brand-mist p-6 sm:flex-row sm:items-center md:p-8">
              {event.speaker_photo_url && (
                <img
                  src={event.speaker_photo_url}
                  alt={`${t.portrait} ${event.speaker_name}`}
                  width={160}
                  height={160}
                  className="size-28 shrink-0 rounded-full object-cover md:size-36"
                />
              )}
              <div className="text-brand-ink">
                <p className="eyebrow">{t.speaker}</p>
                <h2 className="mt-3 text-2xl text-brand-blue">{event.speaker_name}</h2>
                {event.speaker_role && <p className="font-semibold">{event.speaker_role}</p>}
                {event.speaker_bio && <p className="mt-3 leading-relaxed">{event.speaker_bio}</p>}
              </div>
            </div>
          )}
        </div>

        <aside
          aria-label={t.practical}
          className="h-fit rounded-2xl bg-brand-yellow p-6 lg:sticky lg:top-28"
        >
          <p className="eyebrow">{t.practical}</p>
          <ul className="mt-4 space-y-3 font-semibold">
            <li className="flex gap-3">
              <Calendar className="size-5 shrink-0" aria-hidden="true" />
              {capitalize(formatDay(event.start_at, lang))}
            </li>
            <li className="flex gap-3">
              <Clock className="size-5 shrink-0" aria-hidden="true" />
              {formatTime(event.start_at, lang)}
            </li>
            {event.location && (
              <li className="flex gap-3">
                <MapPin className="size-5 shrink-0" aria-hidden="true" />
                {event.location}
              </li>
            )}
            {event.registration === "message" && (
              <li className="flex gap-3">
                <Lock className="size-5 shrink-0" aria-hidden="true" />
                {t.onRequest}
              </li>
            )}
            {remaining !== null && (
              <li className="flex gap-3">
                <Users className="size-5 shrink-0" aria-hidden="true" />
                {isFull ? t.full : t.seats(remaining)}
              </li>
            )}
          </ul>
        </aside>
      </div>

      <section aria-labelledby="inscription" className="bg-brand-mist">
        <div className="container-page max-w-3xl py-12 md:py-20">
          <h2 id="inscription" className="text-3xl md:text-4xl">
            {event.registration === "message" ? t.request : t.register}
          </h2>
          <div className="mt-8">
            {isPast ? (
              <p className="rounded-2xl bg-brand-white p-6 text-lg font-semibold">{t.past}</p>
            ) : isFull ? (
              <p className="rounded-2xl bg-brand-white p-6 text-lg font-semibold">
                {t.fullBefore}{" "}
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  Instagram<span className="sr-only"> {t.newTab}</span>
                </a>
                .
              </p>
            ) : event.registration === "message" ? (
              <RequestSeat />
            ) : (
              <RegistrationForm eventId={event.id} onFull={() => setForcedFull(true)} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
