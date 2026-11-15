/**
 * Inscription « sur demande » : pas de formulaire, l'étudiant écrit en message privé
 * sur Instagram et l'équipe choisit les participants (petit comité).
 */
import { MessageCircle } from "lucide-react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/brand";
import { buttonVariants } from "@/components/ui/button";

export function RequestSeat() {
  return (
    <div className="space-y-6 rounded-2xl bg-brand-white p-6 md:p-8">
      <p className="text-lg">
        Ce cercle se fait en <strong>petit comité</strong> : les places sont limitées et c'est
        l'équipe qui les attribue.
      </p>
      <div>
        <p className="font-bold">
          Pour demander ta place, envoie-nous un message privé sur Instagram avec :
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-brand-ink">
          <li>ton prénom, ton école et ton année d'études ;</li>
          <li>pourquoi ce cercle t'intéresse ;</li>
          <li>une ou deux questions que tu aimerais poser.</li>
        </ul>
      </div>
      <p className="text-sm text-brand-ink">
        On te répond rapidement et on t'envoie l'adresse exacte si ta place est confirmée.
      </p>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ size: "lg" })}
      >
        <MessageCircle aria-hidden="true" /> Écrire à {INSTAGRAM_HANDLE}
        <span className="sr-only"> sur Instagram (nouvel onglet)</span>
      </a>
    </div>
  );
}
