import { createFileRoute } from "@tanstack/react-router";
import cafe from "@/assets/cercle-cafe.jpg";
import { BrandSymbol, Emph } from "@/components/site/Brand";
import { ContactForm } from "@/components/site/ContactForm";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos | Pro'pulse" },
      { name: "description", content: "Pro'pulse, une démarche d'étudiants pour des étudiants : des cercles informels pour parler du monde pro, sans évaluation ni compétition." },
      { property: "og:title", content: "À propos | Pro'pulse" },
      { property: "og:description", content: "Des cercles informels pour parler du monde pro, sans évaluation ni compétition." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const COMMITMENTS = [
  { title: "Un ton accessible", text: "Pas de jargon. On parle comme autour d'un café." },
  { title: "Une parole sans tabou", text: "Doutes, échecs, reconversion, salaire, syndrome de l'imposteur : on en parle." },
  { title: "Aucune évaluation", text: "Personne n'est là pour te juger ou te recruter." },
  { title: "Par et pour des étudiants", text: "On a les mêmes questions que toi. C'est pour ça qu'on a lancé Pro'pulse." },
  { title: "Des parcours variés", text: "Classiques, sinueux, atypiques. Tous ont leur place à la table." },
];

function About() {
  return (
    <>
      <section className="bg-brand-blue text-brand-white">
        <div className="container-page py-12 md:py-20">
          <BrandSymbol kind="star" className="text-5xl text-brand-white" />
          <h1 className="mt-8 max-w-3xl text-5xl md:text-7xl">
            Le réseau se construit dans la <Emph className="text-brand-yellow">conversation.</Emph>
          </h1>
        </div>
      </section>

      {/* Le constat */}
      <section className="container-page grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="font-bold uppercase tracking-wide text-brand-ink">Le constat</p>
          <h2 className="mt-3 text-3xl md:text-4xl">
            Passer des études au monde pro, ça fait <Emph>peur.</Emph>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-ink">
            On a plein de questions. Mais à qui les poser ? Les profs ne savent pas tout, les salons sont impressionnants, et LinkedIn n'est pas
            vraiment fait pour dire « je doute ».
          </p>
        </div>
        <img src={cafe} alt="Des étudiants et des professionnels discutent autour d'une table de café" width={1280} height={896} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
      </section>

      {/* Le concept */}
      <section className="bg-brand-yellow">
        <div className="container-page py-16 md:py-24">
          <p className="font-bold uppercase tracking-wide">Le concept</p>
          <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl">
            Une table. Un secteur. <Emph>Une fois par mois.</Emph>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">
            Des cercles de rencontres informelles autour d'un secteur ou d'un parcours commun. Quelques étudiants, un·e pro, et du temps pour
            parler. Sans évaluation, sans compétition : le réseau se construit naturellement, dans la conversation.
          </p>
        </div>
      </section>

      {/* Nos engagements */}
      <section className="container-page py-16 md:py-24">
        <p className="font-bold uppercase tracking-wide text-brand-ink">Nos engagements</p>
        <h2 className="mt-3 text-3xl md:text-4xl">Ce qu'on te promet</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMMITMENTS.map((c, i) => (
            <li key={c.title} className="rounded-2xl bg-brand-mint p-6">
              <span className="text-sm font-extrabold">0{i + 1}</span>
              <h3 className="mt-2 text-xl">{c.title}</h3>
              <p className="mt-2">{c.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact pros */}
      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 bg-brand-mint">
        <div className="container-page grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <BrandSymbol kind="face" />
            <h2 id="contact-title" className="mt-6 text-3xl md:text-5xl">
              Vous êtes pro ? <Emph>Asseyez-vous.</Emph>
            </h2>
            <p className="mt-4 text-lg">
              Vous avez un parcours à partager, classique ou pas du tout ? Écrivez-nous, on organise le cercle avec vous.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
