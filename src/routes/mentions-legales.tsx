import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales | Pro'pulse" },
      { name: "description", content: "Mentions légales du site Pro'pulse." },
      { property: "og:title", content: "Mentions légales | Pro'pulse" },
      { property: "og:description", content: "Mentions légales du site Pro'pulse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <div className="container-page max-w-3xl py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl">Mentions légales</h1>
      <div className="prose-propulse mt-8">
        <h2>Éditeur du site</h2>
        <p>Pro'pulse — projet étudiant porté par [nom de l'association / de l'école], [adresse]. Contact : [email].</p>
        <h2>Directeur·rice de la publication</h2>
        <p>[Prénom Nom]</p>
        <h2>Hébergement</h2>
        <p>[Nom de l'hébergeur, adresse, contact]</p>
        <h2>Propriété intellectuelle</h2>
        <p>Les contenus, le logo et l'identité visuelle Pro'pulse sont protégés. Toute reproduction sans autorisation est interdite.</p>
      </div>
    </div>
  ),
});
