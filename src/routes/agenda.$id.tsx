import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { circleQuery } from "@/lib/queries";
import { capitalize, formatDay, formatTime } from "@/lib/format";
import { INSTAGRAM_URL } from "@/lib/brand";
import { Badge, BrandSymbol } from "@/components/site/Brand";
import { RegistrationForm } from "@/components/site/RegistrationForm";

export const Route = createFileRoute("/agenda/$id")({
  loader: async ({ context, params }) => {
    if (!/^[0-9a-f-]{36}$/i.test(params.id)) throw notFound();
    const data = await context.queryClient.ensureQueryData(circleQuery(params.id));
    if (!data) throw notFound();
    return { title: data.event.title, description: data.event.description, image: data.event.image_url };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Cercle introuvable | Pro'pulse" }, { name: "robots", content: "noindex" }] };
    const desc = (loaderData.description ?? "Un cercle de rencontre informelle Pro'pulse.").slice(0, 160);
    const meta = [
      { title: `${loaderData.title} | Pro'pulse` },
      { name: "description", content: desc },
      { property: "og:title", content: `${loaderData.title} | Pro'pulse` },
      { property: "og:description", content: desc },
      { property: "og:type", content: "event" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData.image?.startsWith("https://")) {
      meta.push({ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image });
    }
    return { meta };
  },
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl">Ce cercle est introuvable.</h1>
      <Link to="/agenda" className="mt-6 inline-block font-bold underline">Voir l'agenda</Link>
    </div>
  ),
  component: CirclePage,
});

function CirclePage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(circleQuery(id));
  const [forcedFull, setForcedFull] = useState(false);
  if (!data) return null;
  const { event, remaining, isPast } = data;
  const isFull = forcedFull || remaining === 0;

  return (
    <>
      <section className="bg-brand-blue text-brand-white">
        <div className="container-page py-10 md:py-16">
          <Link to="/agenda" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-brand-yellow">
            <ArrowLeft className="size-4" aria-hidden="true" /> Agenda
          </Link>
          <div className="mt-6"><Badge>Cercle Pro'pulse</Badge></div>
          <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">{event.title}</h1>
          {event.sector && <p className="mt-3 text-lg text-brand-yellow">Secteur : {event.sector}</p>}
        </div>
      </section>

      <div className="container-page grid gap-10 py-10 md:py-16 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          {event.image_url && (
            <img src={event.image_url} alt="" className="aspect-[16/9] w-full rounded-2xl object-cover" />
          )}
          {event.description && (
            <div>
              <h2 className="text-2xl">Le cercle</h2>
              <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-brand-ink">{event.description}</p>
            </div>
          )}
          {event.speaker_name && (
            <div className="rounded-2xl bg-brand-mint p-6 md:p-8">
              <p className="text-sm font-bold uppercase tracking-wide">L'intervenant·e</p>
              <h2 className="mt-2 text-2xl">{event.speaker_name}</h2>
              {event.speaker_role && <p className="font-semibold">{event.speaker_role}</p>}
              {event.speaker_bio && <p className="mt-3 leading-relaxed">{event.speaker_bio}</p>}
            </div>
          )}
        </div>

        <aside aria-label="Infos pratiques" className="h-fit rounded-2xl bg-brand-yellow p-6 lg:sticky lg:top-28">
          <ul className="space-y-3 font-semibold">
            <li className="flex gap-3"><Calendar className="size-5 shrink-0" aria-hidden="true" />{capitalize(formatDay(event.start_at))}</li>
            <li className="flex gap-3"><Clock className="size-5 shrink-0" aria-hidden="true" />{formatTime(event.start_at)}</li>
            {event.location && <li className="flex gap-3"><MapPin className="size-5 shrink-0" aria-hidden="true" />{event.location}</li>}
            {remaining !== null && (
              <li className="flex gap-3">
                <Users className="size-5 shrink-0" aria-hidden="true" />
                {isFull ? "Complet" : `${remaining} place${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`}
              </li>
            )}
          </ul>
        </aside>
      </div>

      <section aria-labelledby="inscription" className="bg-brand-mist">
        <div className="container-page max-w-3xl py-12 md:py-20">
          <BrandSymbol kind="star" className="text-4xl" />
          <h2 id="inscription" className="mt-4 text-3xl md:text-4xl">Je m'inscris</h2>
          <div className="mt-8">
            {isPast ? (
              <p className="rounded-2xl bg-brand-white p-6 text-lg font-semibold">Ce cercle a déjà eu lieu. Rendez-vous au prochain !</p>
            ) : isFull ? (
              <p className="rounded-2xl bg-brand-white p-6 text-lg font-semibold">
                Ce cercle est complet. Le prochain sera annoncé sur notre{" "}
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  Instagram<span className="sr-only"> (nouvel onglet)</span>
                </a>
                .
              </p>
            ) : (
              <RegistrationForm eventId={event.id} onFull={() => setForcedFull(true)} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
