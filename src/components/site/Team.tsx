/**
 * Bloc « L'équipe » de la page À propos.
 * La présentation collective s'affiche toujours ; les cartes des membres viennent
 * de `src/data/equipe.json` (voir src/data/README.md) et apparaissent dès qu'il y en a.
 */
import { z } from "zod";
import { Linkedin } from "lucide-react";
import raw from "@/data/equipe.json";
import { defineCopy, useCopy } from "@/lib/i18n";
import { Emph } from "./Brand";

const COPY = defineCopy({
  fr: {
    eyebrow: "L'équipe",
    title: { plain: "Des étudiant·es qui se posent", emph: "les mêmes questions." },
    text: "Pro'pulse est né au sein du Master UNIC (communication) de l'Université Paris-Panthéon-Assas. On l'a lancé parce qu'on vit nous aussi le passage des études au monde pro, avec ses doutes et ses questions. On organise chaque cercle de A à Z : le thème, l'intervenant·e, le lieu et l'accueil.",
    portrait: "Portrait de",
    of: "de",
    newTab: "(nouvel onglet)",
  },
  en: {
    eyebrow: "The team",
    title: { plain: "Students asking", emph: "the same questions." },
    text: "Pro'pulse was born in the UNIC Master's programme (communication) at Université Paris-Panthéon-Assas. We started it because we're going through the same move from university to work, with the same doubts and questions. We run every circle end to end: the theme, the speaker, the venue and the welcome.",
    portrait: "Portrait of",
    of: "of",
    newTab: "(new tab)",
  },
});

const memberSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  photo: z.string().optional(),
  linkedin: z.string().url().optional(),
});
type Member = z.infer<typeof memberSchema>;

const members: Member[] = (Array.isArray(raw) ? raw : []).flatMap((m) => {
  const r = memberSchema.safeParse(m);
  return r.success ? [r.data] : [];
});

const TONES = ["bg-brand-yellow", "bg-brand-mint", "bg-brand-fuchsia"] as const;

export function Team() {
  const t = useCopy(COPY);
  return (
    <section aria-labelledby="equipe-title" className="bg-brand-blue text-brand-white">
      <div className="container-page py-16 md:py-24">
        <p className="eyebrow text-brand-yellow">{t.eyebrow}</p>
        <h2 id="equipe-title" className="reveal mt-4 max-w-3xl text-3xl md:text-5xl">
          {t.title.plain} <Emph className="text-brand-yellow">{t.title.emph}</Emph>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-white/90">
          {t.text}
        </p>

        {members.length > 0 && (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((m, i) => (
              <li
                key={m.name}
                className="reveal rounded-2xl bg-brand-white p-6 text-center text-brand-blue"
              >
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={`${t.portrait} ${m.name}`}
                    width={128}
                    height={128}
                    loading="lazy"
                    className="mx-auto size-28 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className={`mx-auto flex size-28 items-center justify-center rounded-full text-4xl font-extrabold text-brand-blue ${TONES[i % TONES.length]}`}
                  >
                    {m.name.charAt(0)}
                  </span>
                )}
                <h3 className="mt-5 text-xl">{m.name}</h3>
                {m.role && <p className="mt-1 text-sm text-brand-ink">{m.role}</p>}
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4"
                  >
                    <Linkedin className="size-4" aria-hidden="true" /> LinkedIn
                    <span className="sr-only">
                      {" "}
                      {t.of} {m.name} {t.newTab}
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
