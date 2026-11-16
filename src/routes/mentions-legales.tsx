import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_EMAIL, PROJECT_FRAME, PUBLICATION_DIRECTOR, SITE_URL } from "@/lib/brand";

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
        <p>
          Le site {SITE_URL.replace("https://", "")} est édité par l'équipe Pro'pulse. {PROJECT_FRAME}, à but non commercial.
        </p>
        <p>
          Contact : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <h2>Direction de la publication</h2>
        <p>{PUBLICATION_DIRECTOR || "L'équipe Pro'pulse"}, joignable à l'adresse ci-dessus.</p>
        <h2>Hébergement</h2>
        <p>
          Lovable Labs Incorporated, 1 Lincoln Street, Boston, MA 02111, États-Unis. Contact :{" "}
          <a href="mailto:support@lovable.dev">support@lovable.dev</a>.
        </p>
        <h2>Propriété intellectuelle</h2>
        <p>Les contenus, le logo et l'identité visuelle Pro'pulse sont protégés. Toute reproduction sans autorisation est interdite.</p>
      </div>
    </div>
  ),
});
