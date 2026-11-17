import { createFileRoute } from "@tanstack/react-router";
import { Check, Mail } from "lucide-react";
import type { CSSProperties } from "react";
import { Emph } from "@/components/site/Brand";
import { ContactForm } from "@/components/site/ContactForm";
import { Team } from "@/components/site/Team";
import { CONTACT_EMAIL, PROJECT_FRAME, PROJECT_FRAME_EN } from "@/lib/brand";
import { defineCopy, pick, useCopy } from "@/lib/i18n";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export const Route = createFileRoute("/a-propos")({
  head: ({ match }) => {
    const lang = match.context.lang;
    const title = pick(lang, "À propos | Pro'pulse", "About | Pro'pulse");
    const description = pick(
      lang,
      "Pro'pulse, une démarche d'étudiants pour des étudiants : des cercles informels pour parler du monde pro, sans évaluation ni compétition.",
      "Pro'pulse is run by students, for students: informal circles to talk about the working world, with no evaluation and no competition.",
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
  component: About,
});

const COPY = defineCopy({
  fr: {
    eyebrow: "À propos",
    h1: { plain: "Le réseau se construit dans la", emph: "conversation." },
    frame: PROJECT_FRAME,
    whyEyebrow: "Le constat",
    whyTitle: { plain: "Passer des études au monde pro, ça fait", emph: "peur." },
    whyText:
      "On a plein de questions. Mais à qui les poser ? Les profs ne savent pas tout, les salons sont impressionnants, et LinkedIn n'est pas vraiment fait pour dire « je doute ».",
    questionsLabel: "Les questions qu'on entend le plus",
    quote: (q: string) => `« ${q} »`,
    questions: [
      "Combien on gagne vraiment au début ?",
      "Et si je me suis trompé·e de voie ?",
      "Comment on décroche sa première alternance ?",
      "Le syndrome de l'imposteur, ça passe ?",
    ],
    conceptEyebrow: "Le concept",
    conceptTitle: { plain: "Une table. Un secteur.", emph: "Une fois par mois." },
    conceptText:
      "Des cercles de rencontres informelles autour d'un secteur ou d'un parcours commun. Quelques étudiants, un·e pro, et du temps pour parler. Sans évaluation, sans compétition : le réseau se construit naturellement, dans la conversation.",
    steps: [
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
    ],
    commitEyebrow: "Nos engagements",
    commitTitle: { plain: "Ce qu'on te", emph: "promet" },
    commitments: [
      { title: "Un ton accessible", text: "Pas de jargon. On parle comme autour d'un café." },
      {
        title: "Une parole sans tabou",
        text: "Doutes, échecs, reconversion, salaire, syndrome de l'imposteur : on en parle.",
      },
      { title: "Aucune évaluation", text: "Personne n'est là pour te juger ou te recruter." },
      {
        title: "Par et pour des étudiants",
        text: "On a les mêmes questions que toi. C'est pour ça qu'on a lancé Pro'pulse.",
      },
      {
        title: "Des parcours variés",
        text: "Classiques, sinueux, atypiques. Tous ont leur place à la table.",
      },
    ],
    askTitle: "Une question avant de venir ?",
    askText: "Écris-nous, on te répond.",
    proEyebrow: "Pour les professionnels",
    proTitle: { plain: "Vous êtes pro ?", emph: "Asseyez-vous." },
    proText:
      "Vous avez un parcours à partager, classique ou pas du tout ? Écrivez-nous, on organise le cercle avec vous.",
    proHow: "Comment ça se passe pour vous",
    forPros: [
      "Une soirée, dans un café ou un bar à Paris.",
      "Un petit comité d'étudiants motivés, choisis par l'équipe.",
      "Rien à préparer : vous racontez, ils posent leurs questions.",
      "Aucun enjeu de recrutement, sauf si vous le souhaitez.",
      "On s'occupe de tout : lieu, invitations, accueil.",
    ],
    preferEmail: "Vous préférez l'e-mail ?",
  },
  en: {
    eyebrow: "About",
    h1: { plain: "Your network grows through", emph: "conversation." },
    frame: PROJECT_FRAME_EN,
    whyEyebrow: "Why we exist",
    whyTitle: { plain: "Moving from university to work can be", emph: "daunting." },
    whyText:
      "We all have questions. But who do you ask? Lecturers don't know everything, job fairs are intimidating, and LinkedIn isn't really the place to say \"I'm not sure\".",
    questionsLabel: "The questions we hear most",
    quote: (q: string) => `“${q}”`,
    questions: [
      "How much do you really earn at the start?",
      "What if I chose the wrong path?",
      "How do you land your first work-study contract?",
      "Does imposter syndrome ever go away?",
    ],
    conceptEyebrow: "The concept",
    conceptTitle: { plain: "One table. One field.", emph: "Once a month." },
    conceptText:
      "Informal circles built around a shared field or career path. A few students, one professional, and time to talk. No evaluation, no competition: your network grows naturally, through conversation.",
    steps: [
      {
        title: "We pick a theme",
        text: "A field or a path: consulting, communications, a career change…",
      },
      {
        title: "A professional joins the table",
        text: "In the evening, in a café or bar in Paris, in a small group.",
      },
      {
        title: "We talk, for real",
        text: "Ask anything, no evaluation. You leave with pointers and contacts.",
      },
    ],
    commitEyebrow: "Our commitments",
    commitTitle: { plain: "What we", emph: "promise" },
    commitments: [
      { title: "Plain language", text: "No jargon. We talk like we would over a coffee." },
      {
        title: "No taboos",
        text: "Doubts, failures, career changes, salary, imposter syndrome: we talk about it.",
      },
      { title: "No evaluation", text: "Nobody is there to judge or recruit you." },
      {
        title: "By students, for students",
        text: "We have the same questions as you. That's why we started Pro'pulse.",
      },
      {
        title: "All kinds of paths",
        text: "Classic, winding, unconventional. They all have a seat at the table.",
      },
    ],
    askTitle: "A question before you come?",
    askText: "Write to us, we'll get back to you.",
    proEyebrow: "For professionals",
    proTitle: { plain: "Are you a professional?", emph: "Take a seat." },
    proText:
      "Do you have a career path to share, conventional or not at all? Get in touch and we'll set up the circle with you.",
    proHow: "What to expect",
    forPros: [
      "One evening, in a café or bar in Paris.",
      "A small group of motivated students, selected by our team.",
      "Nothing to prepare: you share your story, they ask questions.",
      "No recruiting expected, unless you'd like to.",
      "We take care of everything: venue, invitations, hosting.",
    ],
    preferEmail: "Prefer email?",
  },
});

function About() {
  const t = useCopy(COPY);
  return (
    <>
      <section className="bg-brand-blue text-brand-white">
        <div className="container-page py-14 md:py-24">
          <p className="eyebrow rise text-brand-yellow">{t.eyebrow}</p>
          <h1 className="rise mt-6 max-w-3xl text-5xl md:text-7xl" style={delay(120)}>
            {t.h1.plain} <Emph className="text-brand-yellow">{t.h1.emph}</Emph>
          </h1>
          <p className="rise mt-6 max-w-2xl text-lg text-brand-white/85" style={delay(260)}>
            {t.frame}.
          </p>
        </div>
      </section>

      {/* Le constat */}
      <section className="container-page grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="eyebrow text-brand-ink">{t.whyEyebrow}</p>
          <h2 className="mt-4 text-3xl md:text-4xl">
            {t.whyTitle.plain} <Emph>{t.whyTitle.emph}</Emph>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-ink">{t.whyText}</p>
        </div>
        <figure className="rounded-2xl bg-brand-blue p-8 text-brand-white md:p-10">
          <figcaption className="eyebrow text-brand-yellow">{t.questionsLabel}</figcaption>
          <ul className="mt-6 divide-y divide-brand-white/20">
            {t.questions.map((q) => (
              <li key={q} className="reveal py-4 text-xl md:text-2xl">
                <Emph>{t.quote(q)}</Emph>
              </li>
            ))}
          </ul>
        </figure>
      </section>

      {/* Le concept */}
      <section className="bg-brand-yellow text-brand-blue">
        <div className="container-page py-16 md:py-24">
          <p className="eyebrow">{t.conceptEyebrow}</p>
          <h2 className="mt-4 max-w-3xl text-3xl md:text-5xl">
            {t.conceptTitle.plain} <Emph>{t.conceptTitle.emph}</Emph>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">{t.conceptText}</p>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {t.steps.map((s, i) => (
              <li key={s.title} className="reveal rounded-2xl bg-brand-white p-6 md:p-8">
                <span className="text-sm font-bold tracking-[0.14em]">0{i + 1}</span>
                <h3 className="mt-4 text-xl md:text-2xl">{s.title}</h3>
                <p className="mt-2 text-brand-ink">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Nos engagements */}
      <section className="container-page py-16 md:py-24">
        <p className="eyebrow text-brand-ink">{t.commitEyebrow}</p>
        <h2 className="mt-4 text-3xl md:text-4xl">
          {t.commitTitle.plain} <Emph>{t.commitTitle.emph}</Emph>
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.commitments.map((c, i) => (
            <li
              key={c.title}
              className="reveal rounded-2xl bg-brand-white p-6 ring-1 ring-border md:p-8"
            >
              <span className="text-sm font-bold tracking-[0.14em] text-brand-blue">0{i + 1}</span>
              <h3 className="mt-4 text-xl">{c.title}</h3>
              <p className="mt-2 text-brand-ink">{c.text}</p>
            </li>
          ))}
          <li className="reveal flex flex-col justify-center rounded-2xl bg-brand-mist p-6 md:p-8">
            <h3 className="text-xl">{t.askTitle}</h3>
            <p className="mt-2 text-brand-ink">{t.askText}</p>
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
      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 bg-brand-mist">
        <div className="container-page grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.3fr]">
          <div className="text-brand-ink">
            <p className="eyebrow">{t.proEyebrow}</p>
            <h2 id="contact-title" className="mt-4 text-3xl text-brand-blue md:text-5xl">
              {t.proTitle.plain} <Emph>{t.proTitle.emph}</Emph>
            </h2>
            <p className="mt-4 text-lg">{t.proText}</p>
            <p className="mt-8 font-bold text-brand-blue">{t.proHow}</p>
            <ul className="mt-4 space-y-3">
              {t.forPros.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-blue text-brand-white">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8">
              {t.preferEmail}{" "}
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
