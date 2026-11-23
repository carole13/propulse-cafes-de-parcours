/**
 * Bandeau « Ici, on parle sans tabou de … » : une phrase fixe dont seul le dernier
 * mot change toutes les 3 secondes, avec un fondu. Plus posé qu'un texte qui défile.
 * - Les lecteurs d'écran lisent la phrase complète une seule fois (pas d'annonce répétée).
 * - Si l'appareil demande de réduire les animations, le mot ne change pas.
 */
import { useEffect, useState } from "react";
import { defineCopy, useCopy } from "@/lib/i18n";
import { Emph } from "./Brand";

const COPY = defineCopy({
  fr: {
    lead: "Ici, on parle sans tabou",
    topics: [
      "du salaire.",
      "des reconversions.",
      "du syndrome de l'imposteur.",
      "du premier job.",
      "des échecs.",
      "des doutes.",
    ],
    full: "Ici, on parle sans tabou du salaire, des reconversions, du syndrome de l'imposteur, du premier job, des échecs et des doutes.",
  },
  en: {
    lead: "Here, we talk openly about",
    topics: [
      "salaries.",
      "career changes.",
      "imposter syndrome.",
      "first jobs.",
      "failures.",
      "doubts.",
    ],
    full: "Here, we talk openly about salaries, career changes, imposter syndrome, first jobs, failures and doubts.",
  },
});

export function TopicRotator() {
  const t = useCopy(COPY);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => i + 1), 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-brand-yellow text-brand-blue">
      <div className="container-page flex flex-col items-start gap-x-3 py-8 md:flex-row md:items-baseline md:py-10">
        <p className="sr-only">{t.full}</p>
        <span aria-hidden="true" className="text-2xl font-bold md:text-4xl">
          {t.lead}
        </span>
        <span
          aria-hidden="true"
          className="relative block min-h-[1.4em] overflow-hidden pb-1 text-2xl md:inline-block md:text-4xl"
        >
          {/* La clé change à chaque mot : l'animation d'entrée se rejoue. */}
          <Emph key={index} className="word-in inline-block">
            {t.topics[index % t.topics.length]}
          </Emph>
        </span>
      </div>
    </div>
  );
}
