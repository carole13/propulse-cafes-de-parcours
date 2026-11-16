/**
 * Bloc « L'équipe » de la page À propos.
 * La présentation collective s'affiche toujours ; les cartes des membres viennent
 * de `src/data/equipe.json` (voir src/data/README.md) et apparaissent dès qu'il y en a.
 */
import { z } from "zod";
import { Linkedin } from "lucide-react";
import raw from "@/data/equipe.json";
import { Emph } from "./Brand";

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
  return (
    <section aria-labelledby="equipe-title" className="bg-brand-blue text-brand-white">
      <div className="container-page py-16 md:py-24">
        <p className="font-bold uppercase tracking-wide text-brand-yellow">L'équipe</p>
        <h2 id="equipe-title" className="reveal mt-3 max-w-3xl text-3xl md:text-5xl">
          Des étudiant·es qui se posent{" "}
          <Emph className="text-brand-yellow">les mêmes questions.</Emph>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-white/95">
          Pro'pulse est né au sein du Master UNIC (communication) de l'Université Paris-Panthéon-Assas.
          On l'a lancé parce qu'on vit nous aussi le passage des études au monde pro, avec ses doutes et
          ses questions. On organise chaque cercle de A à Z : le thème, l'intervenant·e, le lieu et
          l'accueil.
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
                    alt={`Portrait de ${m.name}`}
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
                    <span className="sr-only"> de {m.name} (nouvel onglet)</span>
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
