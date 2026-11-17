/**
 * Inscription « sur demande » : pas de formulaire, l'étudiant écrit en message privé
 * sur Instagram et l'équipe choisit les participants (petit comité).
 */
import { MessageCircle } from "lucide-react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/brand";
import { defineCopy, useCopy } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";

const COPY = defineCopy({
  fr: {
    intro: {
      before: "Ce cercle se fait en",
      strong: "petit comité",
      after: ": les places sont limitées et c'est l'équipe qui les attribue.",
    },
    how: "Pour demander ta place, envoie-nous un message privé sur Instagram avec :",
    items: [
      "ton prénom, ton école et ton année d'études ;",
      "pourquoi ce cercle t'intéresse ;",
      "une ou deux questions que tu aimerais poser.",
    ],
    after: "On te répond rapidement et on t'envoie l'adresse exacte si ta place est confirmée.",
    write: "Écrire à",
    newTab: "sur Instagram (nouvel onglet)",
  },
  en: {
    intro: {
      before: "This circle is a",
      strong: "small group",
      after: ": seats are limited and allocated by the team.",
    },
    how: "To request a seat, send us a direct message on Instagram with:",
    items: [
      "your first name, school and year of study;",
      "why this circle interests you;",
      "one or two questions you'd like to ask.",
    ],
    after: "We'll get back to you quickly and send the exact address once your seat is confirmed.",
    write: "Message",
    newTab: "on Instagram (new tab)",
  },
});

export function RequestSeat() {
  const t = useCopy(COPY);
  return (
    <div className="space-y-6 rounded-2xl bg-brand-white p-6 ring-1 ring-border md:p-8">
      <p className="text-lg">
        {t.intro.before} <strong>{t.intro.strong}</strong> {t.intro.after}
      </p>
      <div>
        <p className="font-bold">{t.how}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-brand-ink">
          {t.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-brand-ink">{t.after}</p>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ size: "lg" })}
      >
        <MessageCircle aria-hidden="true" /> {t.write} {INSTAGRAM_HANDLE}
        <span className="sr-only"> {t.newTab}</span>
      </a>
    </div>
  );
}
