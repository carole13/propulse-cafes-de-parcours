import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_EMAIL, PROJECT_FRAME } from "@/lib/brand";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité | Pro'pulse" },
      { name: "description", content: "Comment Pro'pulse utilise et protège tes données personnelles (RGPD)." },
      { property: "og:title", content: "Politique de confidentialité | Pro'pulse" },
      { property: "og:description", content: "Comment Pro'pulse utilise et protège tes données personnelles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <div className="container-page max-w-3xl py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl">Politique de confidentialité</h1>
      <div className="prose-propulse mt-8">
        <h2>Responsable du traitement</h2>
        <p>
          L'équipe Pro'pulse ({PROJECT_FRAME}). Contact : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <h2>Données collectées</h2>
        <p>Inscription à un cercle : prénom, nom, email académique, motivation, questions. Formulaire de contact : nom, email, entreprise/poste, message.</p>
        <h2>Finalité et base légale</h2>
        <p>Ces données servent uniquement à organiser les cercles et à répondre aux messages. Base légale : ton consentement (art. 6.1.a RGPD).</p>
        <h2>Durée de conservation</h2>
        <p>
          Les inscriptions sont conservées au plus 12 mois après le cercle concerné, les messages de contact au plus 12 mois après le
          dernier échange, puis supprimés.
        </p>
        <h2>Destinataires</h2>
        <p>Seule l'équipe Pro'pulse y a accès. Aucune donnée n'est vendue ni transmise à des tiers. L'intervenant·e peut recevoir tes questions, sans tes coordonnées.</p>
        <h2>Prestataires techniques</h2>
        <p>
          Pour faire fonctionner le site, certaines données passent par des prestataires, dont certains sont situés hors de l'Union
          européenne (notamment aux États-Unis) :
        </p>
        <ul>
          <li>Lovable (hébergement du site et de la base de données) ;</li>
          <li>Cloudflare Turnstile (protection anti-robot des formulaires : adresse IP, navigateur) ;</li>
          <li>Resend (envoi à l'équipe d'un e-mail de notification à chaque message ou inscription) ;</li>
          <li>Behold (affichage des dernières publications Instagram de Pro'pulse, sans donnée sur les visiteurs).</li>
        </ul>
        <h2>Tes droits</h2>
        <p>
          Tu peux accéder à tes données, les rectifier, les supprimer ou retirer ton consentement en écrivant à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Tu peux aussi saisir la CNIL (cnil.fr).
        </p>
      </div>
    </div>
  ),
});
