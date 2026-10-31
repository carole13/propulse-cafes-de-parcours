import { createFileRoute } from "@tanstack/react-router";

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
        <p>[Nom de la structure], [adresse], [email de contact].</p>
        <h2>Données collectées</h2>
        <p>Inscription à un cercle : prénom, nom, email académique, motivation, questions. Formulaire de contact : nom, email, entreprise/poste, message.</p>
        <h2>Finalité et base légale</h2>
        <p>Ces données servent uniquement à organiser les cercles et à répondre aux messages. Base légale : ton consentement (art. 6.1.a RGPD).</p>
        <h2>Durée de conservation</h2>
        <p>[Ex. : 12 mois après le cercle], puis suppression.</p>
        <h2>Destinataires</h2>
        <p>Seule l'équipe Pro'pulse y a accès. Aucune donnée n'est vendue ni transmise à des tiers. L'intervenant·e peut recevoir tes questions, sans tes coordonnées.</p>
        <h2>Anti-robot</h2>
        <p>Les formulaires sont protégés par Cloudflare Turnstile, qui peut traiter des données techniques (adresse IP, navigateur).</p>
        <h2>Tes droits</h2>
        <p>Tu peux accéder à tes données, les rectifier, les supprimer ou retirer ton consentement en écrivant à [email]. Tu peux aussi saisir la CNIL (cnil.fr).</p>
      </div>
    </div>
  ),
});
