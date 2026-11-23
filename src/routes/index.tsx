import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { articlesQuery, nextCircleQuery } from "@/lib/queries";
import { SITE_DESCRIPTION, SITE_DESCRIPTION_EN, SITE_TITLE, SITE_TITLE_EN } from "@/lib/brand";
import { defineCopy, pick, useCopy } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";
import { Emph } from "@/components/site/Brand";
import { NextCircle } from "@/components/site/NextCircle";
import { ArticleCard } from "@/components/site/ArticleCard";
import { InstagramFeed } from "@/components/site/InstagramFeed";
import { TopicRotator } from "@/components/site/TopicRotator";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const lang = match.context.lang;
    const title = pick(lang, SITE_TITLE, SITE_TITLE_EN);
    const description = pick(lang, SITE_DESCRIPTION, SITE_DESCRIPTION_EN);
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
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(nextCircleQuery),
      context.queryClient.ensureQueryData(articlesQuery(3)),
    ]),
  component: Home,
});

const COPY = defineCopy({
  fr: {
    eyebrow: "Étudiants × professionnels · Paris",
    h1: { before: "Un parcours", accent: "atypique", middle: "peut te", emph: "propulser." },
    lead: "Chaque mois, Pro'pulse réunit quelques étudiants et un·e professionnel·le autour d'une table, dans un café parisien, pour parler parcours, métiers et doutes. Sans évaluation, sans compétition.",
    ctaNext: "Voir le prochain cercle",
    ctaHow: "Comment ça marche",
    howEyebrow: "Pro'pulse, c'est quoi ?",
    howTitle: { plain: "Des conversations,", emph: "pas des entretiens." },
    howIntro:
      "Passer des études au monde pro fait peur, et on ne sait pas toujours à qui poser ses questions. Pro'pulse crée des cercles informels pour que le réseau se construise dans la conversation, pas dans l'échange de cartes de visite.",
    steps: [
      {
        title: "Un thème, un·e pro",
        text: "Chaque mois, un secteur ou un parcours : conseil, communication, reconversion…",
      },
      {
        title: "Une table en petit comité",
        text: "Quelques étudiants et un·e professionnel·le, en soirée, dans un café à Paris.",
      },
      {
        title: "Des réponses franches",
        text: "Salaire, doutes, premier job : les questions qu'on n'ose pas poser en entretien.",
      },
    ],
    also: "Et aussi",
    agendaTitle: "L'agenda étudiant",
    agendaText: "Forums, salons et conférences qu'on te conseille, réunis au même endroit.",
    storiesTitle: "Les parcours",
    storiesText: "Interviews et parcours atypiques, racontés par celles et ceux qui les ont vécus.",
    prosTitle: "Pour les professionnels",
    prosText: "Partagez votre parcours le temps d'une soirée avec des étudiants curieux.",
    latest: { plain: "Derniers", emph: "parcours" },
    allStories: "Tous les parcours",
    approachEyebrow: "Notre approche",
    approachTitle: ["Ici, pas d'entretien.", "Pas de pitch."],
    approachEmph: "Juste une conversation.",
    values: [
      { title: "Sans évaluation", text: "Personne ne te note. On est là pour parler." },
      { title: "Sans compétition", text: "Pas de candidats, pas de gagnants. Juste une table." },
      {
        title: "Toutes les questions sont permises",
        text: "Doutes, salaire, échecs : rien n'est hors sujet.",
      },
    ],
    proEyebrow: "Vous êtes professionnel·le ?",
    proTitle: { plain: "Partagez votre", emph: "parcours." },
    proText: "Une soirée, un verre, quelques étudiants curieux. C'est tout.",
    proCta: "Nous écrire",
  },
  en: {
    eyebrow: "Students × professionals · Paris",
    h1: { before: "An", accent: "unconventional", middle: "path can", emph: "propel you." },
    lead: "Every month, Pro'pulse brings a few students and one professional together around a table in a Paris café, to talk about career paths, jobs and doubts. No evaluation, no competition.",
    ctaNext: "See the next circle",
    ctaHow: "How it works",
    howEyebrow: "What is Pro'pulse?",
    howTitle: { plain: "Conversations,", emph: "not interviews." },
    howIntro:
      "Moving from university to the working world can be daunting, and it's not always clear who to ask. Pro'pulse creates informal circles so that your network grows through conversation, not through swapping business cards.",
    steps: [
      {
        title: "One theme, one professional",
        text: "Each month, a field or a path: consulting, communications, career changes…",
      },
      {
        title: "A small table",
        text: "A handful of students and one professional, in the evening, in a Paris café.",
      },
      {
        title: "Straight answers",
        text: "Salary, doubts, first job: the questions you don't dare ask in an interview.",
      },
    ],
    also: "Also on Pro'pulse",
    agendaTitle: "Student events",
    agendaText: "Job fairs, forums and talks we recommend, all in one place.",
    storiesTitle: "Career stories",
    storiesText: "Interviews and unconventional paths, told by the people who lived them.",
    prosTitle: "For professionals",
    prosText: "Share your journey with curious students over one evening.",
    latest: { plain: "Latest", emph: "stories" },
    allStories: "All stories",
    approachEyebrow: "Our approach",
    approachTitle: ["No interview.", "No pitch."],
    approachEmph: "Just a conversation.",
    values: [
      { title: "No evaluation", text: "Nobody grades you. We're here to talk." },
      { title: "No competition", text: "No candidates, no winners. Just a table." },
      {
        title: "Every question is welcome",
        text: "Doubts, salary, failures: nothing is off-limits.",
      },
    ],
    proEyebrow: "Are you a professional?",
    proTitle: { plain: "Share your", emph: "journey." },
    proText: "One evening, a drink, a few curious students. That's it.",
    proCta: "Get in touch",
  },
});

function Home() {
  const t = useCopy(COPY);
  const { data: next } = useSuspenseQuery(nextCircleQuery);
  const { data: articles } = useSuspenseQuery(articlesQuery(3));
  const hasArticles = articles.length > 0;

  return (
    <>
      {/* Hero : ce qu'est Pro'pulse, en une phrase */}
      <section className="bg-brand-blue text-brand-white">
        <div className="container-page pb-20 pt-14 md:pb-32 md:pt-20">
          <p className="eyebrow rise text-brand-yellow">{t.eyebrow}</p>
          <h1
            className="rise mt-6 max-w-4xl text-[2.6rem] leading-[1.05] md:text-7xl"
            style={delay(120)}
          >
            {t.h1.before} <span className="underline-sweep text-brand-yellow">{t.h1.accent}</span>{" "}
            {t.h1.middle} <Emph className="text-brand-white">{t.h1.emph}</Emph>
          </h1>
          <p
            className="rise mt-6 max-w-2xl text-lg leading-relaxed text-brand-white/90 md:text-xl"
            style={delay(260)}
          >
            {t.lead}
          </p>
          <div className="rise mt-10 flex flex-wrap gap-3" style={delay(400)}>
            <a
              href="#prochain-cercle"
              className={buttonVariants({ variant: "yellow", size: "lg" })}
            >
              {t.ctaNext}
            </a>
            <a
              href="#comment-ca-marche"
              className={buttonVariants({ variant: "outlineLight", size: "lg" })}
            >
              {t.ctaHow}
            </a>
          </div>
        </div>
      </section>

      {/* Prochain cercle */}
      <div className="container-page -mt-10 md:-mt-16">
        <NextCircle event={next} />
      </div>

      {/* Comment ça marche */}
      <section
        id="comment-ca-marche"
        aria-labelledby="how-title"
        className="container-page scroll-mt-24 py-16 md:py-24"
      >
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-end">
          <div>
            <p className="eyebrow text-brand-ink">{t.howEyebrow}</p>
            <h2 id="how-title" className="mt-4 text-3xl md:text-5xl">
              {t.howTitle.plain} <Emph>{t.howTitle.emph}</Emph>
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-brand-ink">{t.howIntro}</p>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-3">
          {t.steps.map((s, i) => (
            <li key={s.title} className="reveal bg-brand-white p-6 md:p-8">
              <span className="text-sm font-bold tracking-[0.14em] text-brand-blue">0{i + 1}</span>
              <h3 className="mt-4 text-xl md:text-2xl">{s.title}</h3>
              <p className="mt-2 text-brand-ink">{s.text}</p>
            </li>
          ))}
        </ol>

        <p className="eyebrow mt-12 text-brand-ink">{t.also}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link
            to="/agenda"
            className="group flex items-center justify-between gap-6 rounded-2xl bg-brand-mist p-6 transition-colors hover:bg-brand-mint md:p-8"
          >
            <span>
              <span className="block text-xl font-bold">{t.agendaTitle}</span>
              <span className="mt-1 block text-brand-ink">{t.agendaText}</span>
            </span>
            <ArrowRight
              className="size-6 shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          {hasArticles ? (
            <Link
              to="/parcours"
              className="group flex items-center justify-between gap-6 rounded-2xl bg-brand-mist p-6 transition-colors hover:bg-brand-mint md:p-8"
            >
              <span>
                <span className="block text-xl font-bold">{t.storiesTitle}</span>
                <span className="mt-1 block text-brand-ink">{t.storiesText}</span>
              </span>
              <ArrowRight
                className="size-6 shrink-0 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <Link
              to="/a-propos"
              hash="contact"
              className="group flex items-center justify-between gap-6 rounded-2xl bg-brand-mist p-6 transition-colors hover:bg-brand-mint md:p-8"
            >
              <span>
                <span className="block text-xl font-bold">{t.prosTitle}</span>
                <span className="mt-1 block text-brand-ink">{t.prosText}</span>
              </span>
              <ArrowRight
                className="size-6 shrink-0 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>
      </section>

      {/* Derniers articles : masqué s'il n'y en a pas */}
      {hasArticles && (
        <section aria-labelledby="latest-title" className="container-page pb-16 md:pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="latest-title" className="text-3xl md:text-5xl">
              {t.latest.plain} <Emph>{t.latest.emph}</Emph>
            </h2>
            <Link to="/parcours" className="font-bold underline underline-offset-4">
              {t.allStories}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <div key={a.id} className="reveal">
                <ArticleCard article={a} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Notre approche */}
      <section>
        <TopicRotator />
        <div className="container-page py-16 md:py-24">
          <p className="eyebrow text-brand-ink">{t.approachEyebrow}</p>
          <h2 className="reveal mt-4 max-w-3xl text-3xl md:text-5xl">
            {t.approachTitle[0]} {t.approachTitle[1]} <Emph>{t.approachEmph}</Emph>
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3">
            {t.values.map((v) => (
              <li key={v.title} className="reveal border-t-2 border-brand-blue pt-6">
                <h3 className="text-xl">{v.title}</h3>
                <p className="mt-2 text-brand-ink">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Instagram : masqué tant que le flux ne renvoie rien */}
      <InstagramFeed />

      {/* Appel aux pros */}
      <section className="container-page py-16 md:py-24">
        <div className="reveal flex flex-col items-start gap-6 rounded-2xl bg-brand-blue p-8 text-brand-white md:flex-row md:items-center md:justify-between md:p-14">
          <div>
            <p className="eyebrow text-brand-yellow">{t.proEyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-4xl">
              {t.proTitle.plain} <Emph className="text-brand-yellow">{t.proTitle.emph}</Emph>
            </h2>
            <p className="mt-3 max-w-lg text-brand-white/90">{t.proText}</p>
          </div>
          <Link
            to="/a-propos"
            hash="contact"
            className={buttonVariants({ variant: "yellow", size: "lg" })}
          >
            {t.proCta}
          </Link>
        </div>
      </section>
    </>
  );
}
