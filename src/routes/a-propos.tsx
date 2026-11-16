import { createFileRoute } from "@tanstack/react-router";
import { Check, Mail } from "lucide-react";
import { BrandSymbol, Emph } from "@/components/site/Brand";
import { ContactForm } from "@/components/site/ContactForm";
import { Team } from "@/components/site/Team";
import { CONTACT_EMAIL, PROJECT_FRAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos | Pro'pulse" },
      {
        name: "description",
        content:
          "Pro'pulse, une démarche d'étudiants pour des étudiants : des cercles informels pour parler du monde pro, sans évaluation ni compétition.",
      },
      { property: "og:title", content: "À propos | Pro'pulse" },
      {
        property: "og:description",
        content: "Des cercles informels pour parler du monde pro, sans évaluation ni compétition.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

/** Questions réelles d'étudiants, affichées en bulles dans « Le constat ». */
const QUESTIONS = [
  { text: "Combien on gagne vraiment au début ?", tone: "bg-brand-yellow", side: "self-start" },
  { text: "Et si je me suis trompé·e de voie ?", tone: "bg-brand-white", side: "self-end" },
  {
    text: "Comment on décroche sa première alternance ?",
    tone: "bg-brand-mint",
    side: "self-start",
  },
  { text: "Le syndrome de l'imposteur, ça passe ?", tone: "bg-brand-white", side: "self-end" },
] as const;

const STEPS = [
  {
    title: "On choisit un thème",
    text: "Un secteur ou un parcours : le conseil, la com, une reconversion…",
  },
  {
    title: "Un·e pro rejoint la table",
    text: "En soirée, dans un café ou un bar à Paris, en petit comité.",
  },
  {
    title: "On parle, vraiment",
    text: "Questions libres, sans évaluation. Tu repars avec des repères et des contacts.",
  },
] as const;

const COMMITMENTS = [
  {
    symbol: "star",
    title: "Un ton accessible",
    text: "Pas de jargon. On parle comme autour d'un café.",
  },
  {
    symbol: "tilde",
    title: "Une parole sans tabou",
    text: "Doutes, échecs, reconversion, salaire, syndrome de l'imposteur : on en parle.",
  },
  {
    symbol: "hash",
    title: "Aucune évaluation",
    text: "Personne n'est là pour te juger ou te recruter.",
  },
  {
    symbol: "face",
    title: "Par et pour des étudiants",
    text: "On a les mêmes questions que toi. C'est pour ça qu'on a lancé Pro'pulse.",
  },
  {
    symbol: "star",
    title: "Des parcours variés",
    text: "Classiques, sinueux, atypiques. Tous ont leur place à la table.",
  },
] as const;

/** Couleurs des cartes d'engagement, en alternance (toujours lisibles). */
const CARD_TONES = [
  "bg-brand-mint text-brand-ink",
  "bg-brand-yellow text-brand-blue",
  "bg-brand-blue text-brand-white",
] as const;

const FOR_PROS = [
  "Une soirée, dans un café ou un bar à Paris.",
  "Un petit comité d'étudiants motivés, choisis par l'équipe.",
  "Rien à préparer : vous racontez, ils posent leurs questions.",
  "Aucun enjeu de recrutement, sauf si vous le souhaitez.",
  "Rien n'est publié sur vous sans votre accord (photo, citation, interview).",
  "On s'occupe de tout : lieu, invitations, accueil.",
];

function About() {
  return (
    <>
      <section className="bg-brand-blue text-brand-white">
        <div className="container-page py-12 md:py-20">
          <span className="rise inline-block">
            <BrandSymbol kind="star" className="spin-slow text-5xl text-brand-white" />
          </span>
          <h1
            className="rise mt-8 max-w-3xl text-5xl md:text-7xl"
            style={{ "--delay": "120ms" } as React.CSSProperties}
          >
            Le réseau se construit dans la <Emph className="text-brand-yellow">conversation.</Emph>
          </h1>
          <p
            className="rise mt-6 max-w-2xl text-lg text-brand-white/90"
            style={{ "--delay": "260ms" } as React.CSSProperties}
          >
            {PROJECT_FRAME}.
          </p>
        </div>
      </section>

      {/* Le constat */}
      <section className="container-page grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="font-bold uppercase tracking-wide text-brand-ink">Le constat</p>
          <h2 className="mt-3 text-3xl md:text-4xl">
            Passer des études au monde pro, ça fait <Emph>peur.</Emph>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-ink">
            On a plein de questions. Mais à qui les poser ? Les profs ne savent pas tout, les salons
            sont impressionnants, et LinkedIn n'est pas vraiment fait pour dire « je doute ».
          </p>
        </div>
        {/* Bulles de questions : ce qu'on n'ose pas demander en entretien */}
        <div
          aria-label="Des questions que les étudiants se posent"
          role="img"
          className="relative rounded-2xl bg-brand-blue p-6 md:p-10"
        >
          <span className="float absolute -right-3 -top-5 md:-right-5" aria-hidden="true">
            <BrandSymbol kind="face" className="size-16" />
          </span>
          <ul className="flex flex-col gap-4">
            {QUESTIONS.map((q, i) => (
              <li
                key={q.text}
                className={cn(
                  "reveal max-w-[85%] rounded-2xl px-5 py-3 font-bold text-brand-blue shadow-sm md:text-lg",
                  q.tone,
                  q.side,
                  i % 2 === 0 ? "rounded-bl-sm" : "rounded-br-sm",
                )}
              >
                {q.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Le concept + comment ça marche */}
      <section className="bg-brand-yellow text-brand-blue">
        <div className="container-page py-16 md:py-24">
          <p className="font-bold uppercase tracking-wide">Le concept</p>
          <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl">
            Une table. Un secteur. <Emph>Une fois par mois.</Emph>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">
            Des cercles de rencontres informelles autour d'un secteur ou d'un parcours commun.
            Quelques étudiants, un·e pro, et du temps pour parler. Sans évaluation, sans compétition
            : le réseau se construit naturellement, dans la conversation.
          </p>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="reveal rounded-2xl bg-brand-white p-6 md:p-8">
                <span className="flex size-12 items-center justify-center rounded-full bg-brand-blue text-xl font-extrabold text-brand-yellow">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl md:text-2xl">{s.title}</h3>
                <p className="mt-2 text-brand-ink">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Nos engagements */}
      <section className="container-page py-16 md:py-24">
        <p className="font-bold uppercase tracking-wide text-brand-ink">Nos engagements</p>
        <h2 className="mt-3 text-3xl md:text-4xl">
          Ce qu'on te <Emph>promet</Emph>
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMMITMENTS.map((c, i) => (
            <li
              key={c.title}
              className={cn(
                "reveal flex flex-col rounded-2xl p-6 md:p-8",
                CARD_TONES[i % CARD_TONES.length],
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold opacity-80">0{i + 1}</span>
                <BrandSymbol
                  kind={c.symbol}
                  className={cn(
                    c.symbol === "face" ? "size-10" : "text-3xl",
                    // Sur fond menthe, le # menthe disparaîtrait : on le passe en bleu.
                    c.symbol === "hash" && "text-brand-blue",
                    i % 3 === 2 && c.symbol !== "face" && "text-brand-yellow",
                  )}
                />
              </div>
              <h3 className="mt-6 text-xl md:text-2xl">{c.title}</h3>
              <p className="mt-2">{c.text}</p>
            </li>
          ))}
          <li className="reveal flex flex-col justify-center rounded-2xl border-2 border-dashed border-brand-blue/40 p-6 md:p-8">
            <p className="text-xl font-extrabold md:text-2xl">
              Une question avant de venir ? <Emph>Écris-nous.</Emph>
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 inline-flex items-center gap-2 font-bold underline underline-offset-4"
            >
              <Mail className="size-4" aria-hidden="true" /> {CONTACT_EMAIL}
            </a>
          </li>
        </ul>
      </section>

      {/* L'équipe */}
      <Team />

      {/* Contact pros */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="scroll-mt-20 bg-brand-mint text-brand-ink"
      >
        <div className="container-page grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <BrandSymbol kind="face" />
            <h2 id="contact-title" className="mt-6 text-3xl text-brand-blue md:text-5xl">
              Vous êtes pro ? <Emph>Asseyez-vous.</Emph>
            </h2>
            <p className="mt-4 text-lg">
              Vous avez un parcours à partager, classique ou pas du tout ? Écrivez-nous, on organise
              le cercle avec vous.
            </p>
            <p className="mt-8 font-bold text-brand-blue">Comment ça se passe pour vous</p>
            <ul className="mt-4 space-y-3">
              {FOR_PROS.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-blue text-brand-white">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8">
              Vous préférez l'e-mail ?{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-bold text-brand-blue underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
