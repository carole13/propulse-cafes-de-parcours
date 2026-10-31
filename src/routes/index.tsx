import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { articlesQuery, nextCircleQuery } from "@/lib/queries";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/brand";
import { buttonVariants } from "@/components/ui/button";
import { BrandSymbol, Emph } from "@/components/site/Brand";
import { NextCircle } from "@/components/site/NextCircle";
import { ArticleCard } from "@/components/site/ArticleCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(nextCircleQuery),
      context.queryClient.ensureQueryData(articlesQuery(3)),
    ]),
  component: Home,
});

const VALUES = [
  { symbol: "star", title: "Sans évaluation", text: "Personne ne te note. On est là pour parler." },
  { symbol: "hash", title: "Sans compétition", text: "Pas de candidats, pas de gagnants. Juste une table." },
  { symbol: "tilde", title: "Toutes les questions sont permises", text: "Doutes, salaire, échecs : rien n'est hors sujet." },
] as const;

function Home() {
  const { data: next } = useSuspenseQuery(nextCircleQuery);
  const { data: articles } = useSuspenseQuery(articlesQuery(3));

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-blue text-brand-white">
        <div className="container-page relative pb-16 pt-12 md:pb-28 md:pt-20">
          <BrandSymbol kind="star" className="text-5xl text-brand-white md:text-6xl" />
          <h1 className="mt-10 max-w-4xl text-[2.6rem] leading-[1.05] md:text-7xl">
            Un parcours <span className="text-brand-yellow">atypique</span> peut te{" "}
            <Emph className="text-brand-mint">propulser.</Emph>
          </h1>
          <p className="mt-6 max-w-md text-lg text-brand-white/95 md:text-xl">
            Pas de case. Pas de CV parfait.
            <br />
            Juste des gens qui se parlent.
          </p>
          <a href="#prochain-cercle" className={buttonVariants({ variant: "yellow", size: "lg", className: "mt-10" })}>
            Voir le prochain cercle
          </a>
        </div>
      </section>

      {/* Next circle */}
      <div className="container-page -mt-6 md:-mt-12">
        <NextCircle event={next} />
      </div>

      {/* Latest articles — hidden when empty */}
      {articles.length > 0 && (
        <section aria-labelledby="latest-title" className="container-page py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="latest-title" className="text-3xl md:text-5xl">
              Derniers <Emph>parcours</Emph>
            </h2>
            <Link to="/parcours" className="font-bold underline underline-offset-4">Tous les parcours</Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* Values */}
      <section className={articles.length > 0 ? "" : "mt-16 md:mt-24"}>
        <div className="bg-brand-mint">
          <div className="container-page py-16 md:py-24">
            <BrandSymbol kind="hash" className="text-5xl text-brand-blue" />
            <h2 className="mt-6 max-w-3xl text-3xl md:text-5xl">
              Ici, pas d'entretien.
              <br />
              Pas de pitch.
              <br />
              <Emph>Juste une conversation.</Emph>
            </h2>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {VALUES.map((v) => (
                <li key={v.title} className="rounded-2xl bg-brand-white p-6">
                  <BrandSymbol kind={v.symbol} className={v.symbol === "hash" ? "text-3xl text-brand-blue" : "text-3xl"} />
                  <h3 className="mt-4 text-xl">{v.title}</h3>
                  <p className="mt-2 text-brand-ink">{v.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pro CTA */}
      <section className="container-page py-16 md:py-24">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-brand-blue p-8 text-brand-white md:flex-row md:items-center md:justify-between md:p-14">
          <div>
            <p className="font-bold text-brand-yellow">Vous êtes professionnel·le ?</p>
            <h2 className="mt-2 text-3xl md:text-4xl">
              Partagez votre <Emph className="text-brand-yellow">parcours.</Emph>
            </h2>
            <p className="mt-3 max-w-lg text-brand-white/90">Une heure, un café, quelques étudiants curieux. C'est tout.</p>
          </div>
          <Link to="/a-propos" hash="contact" className={buttonVariants({ variant: "yellow", size: "lg" })}>
            Nous écrire
          </Link>
        </div>
      </section>
    </>
  );
}
