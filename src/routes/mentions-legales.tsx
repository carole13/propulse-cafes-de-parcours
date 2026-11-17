import { createFileRoute } from "@tanstack/react-router";
import {
  CONTACT_EMAIL,
  PROJECT_FRAME,
  PROJECT_FRAME_EN,
  PUBLICATION_DIRECTOR,
  SITE_URL,
} from "@/lib/brand";
import { pick, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/mentions-legales")({
  head: ({ match }) => {
    const lang = match.context.lang;
    const title = pick(lang, "Mentions légales | Pro'pulse", "Legal notice | Pro'pulse");
    const description = pick(
      lang,
      "Mentions légales du site Pro'pulse.",
      "Legal notice of the Pro'pulse website.",
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: LegalNotice,
});

const site = SITE_URL.replace("https://", "");
const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
const host = <a href="mailto:support@lovable.dev">support@lovable.dev</a>;

function LegalNotice() {
  const lang = useLang();
  return (
    <div className="container-page max-w-3xl py-12 md:py-20">
      {lang === "en" ? (
        <>
          <h1 className="text-4xl md:text-5xl">Legal notice</h1>
          <div className="prose-propulse mt-8">
            <p>
              <em>The French version of this notice is the reference version.</em>
            </p>
            <h2>Publisher</h2>
            <p>
              The website {site} is published by the Pro'pulse team. {PROJECT_FRAME_EN},
              non-commercial.
            </p>
            <p>Contact: {mail}</p>
            <h2>Editorial responsibility</h2>
            <p>{PUBLICATION_DIRECTOR || "The Pro'pulse team"}, reachable at the address above.</p>
            <h2>Hosting</h2>
            <p>
              Lovable Labs Incorporated, 1 Lincoln Street, Boston, MA 02111, United States. Contact:{" "}
              {host}.
            </p>
            <h2>Intellectual property</h2>
            <p>
              The content, logo and visual identity of Pro'pulse are protected. Any reproduction
              without permission is prohibited.
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-4xl md:text-5xl">Mentions légales</h1>
          <div className="prose-propulse mt-8">
            <h2>Éditeur du site</h2>
            <p>
              Le site {site} est édité par l'équipe Pro'pulse. {PROJECT_FRAME}, à but non
              commercial.
            </p>
            <p>Contact : {mail}</p>
            <h2>Direction de la publication</h2>
            <p>{PUBLICATION_DIRECTOR || "L'équipe Pro'pulse"}, joignable à l'adresse ci-dessus.</p>
            <h2>Hébergement</h2>
            <p>
              Lovable Labs Incorporated, 1 Lincoln Street, Boston, MA 02111, États-Unis. Contact :{" "}
              {host}.
            </p>
            <h2>Propriété intellectuelle</h2>
            <p>
              Les contenus, le logo et l'identité visuelle Pro'pulse sont protégés. Toute
              reproduction sans autorisation est interdite.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
