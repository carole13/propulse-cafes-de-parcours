import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_EMAIL, PROJECT_FRAME, PROJECT_FRAME_EN } from "@/lib/brand";
import { pick, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/confidentialite")({
  head: ({ match }) => {
    const lang = match.context.lang;
    const title = pick(
      lang,
      "Politique de confidentialité | Pro'pulse",
      "Privacy policy | Pro'pulse",
    );
    const description = pick(
      lang,
      "Comment Pro'pulse utilise et protège tes données personnelles (RGPD).",
      "How Pro'pulse uses and protects your personal data (GDPR).",
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
  component: Privacy,
});

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

function Privacy() {
  const lang = useLang();
  return (
    <div className="container-page max-w-3xl py-12 md:py-20">
      {lang === "en" ? (
        <>
          <h1 className="text-4xl md:text-5xl">Privacy policy</h1>
          <div className="prose-propulse mt-8">
            <p>
              <em>The French version of this policy is the reference version.</em>
            </p>
            <h2>Data controller</h2>
            <p>
              The Pro'pulse team ({PROJECT_FRAME_EN}). Contact: {mail}
            </p>
            <h2>Data we collect</h2>
            <p>
              Circle registration: first name, last name, student email, motivation, questions.
              Contact form: name, email, company/position, message.
            </p>
            <h2>Purpose and legal basis</h2>
            <p>
              This data is used only to organise circles and reply to messages. Legal basis: your
              consent (Art. 6(1)(a) GDPR).
            </p>
            <h2>Retention</h2>
            <p>
              Registrations are kept for no more than 12 months after the circle, and contact
              messages for no more than 12 months after the last exchange. They are then deleted.
            </p>
            <h2>Who can access it</h2>
            <p>
              Only the Pro'pulse team. No data is sold or passed on to third parties. The speaker
              may receive your questions, without your contact details.
            </p>
            <h2>Technical providers</h2>
            <p>
              To run the site, some data goes through service providers, some of them outside the
              European Union (in particular the United States):
            </p>
            <ul>
              <li>Lovable (hosting of the website and database);</li>
              <li>Cloudflare Turnstile (anti-bot protection on forms: IP address, browser);</li>
              <li>
                Resend (email notification sent to the team for each message or registration);
              </li>
              <li>Behold (display of Pro'pulse's latest Instagram posts, with no visitor data).</li>
            </ul>
            <h2>Your rights</h2>
            <p>
              You can access, correct or delete your data, or withdraw your consent, by writing to{" "}
              {mail}. You can also contact the CNIL, the French data protection authority (cnil.fr).
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-4xl md:text-5xl">Politique de confidentialité</h1>
          <div className="prose-propulse mt-8">
            <h2>Responsable du traitement</h2>
            <p>
              L'équipe Pro'pulse ({PROJECT_FRAME}). Contact : {mail}
            </p>
            <h2>Données collectées</h2>
            <p>
              Inscription à un cercle : prénom, nom, email académique, motivation, questions.
              Formulaire de contact : nom, email, entreprise/poste, message.
            </p>
            <h2>Finalité et base légale</h2>
            <p>
              Ces données servent uniquement à organiser les cercles et à répondre aux messages.
              Base légale : ton consentement (art. 6.1.a RGPD).
            </p>
            <h2>Durée de conservation</h2>
            <p>
              Les inscriptions sont conservées au plus 12 mois après le cercle concerné, les
              messages de contact au plus 12 mois après le dernier échange, puis supprimés.
            </p>
            <h2>Destinataires</h2>
            <p>
              Seule l'équipe Pro'pulse y a accès. Aucune donnée n'est vendue ni transmise à des
              tiers. L'intervenant·e peut recevoir tes questions, sans tes coordonnées.
            </p>
            <h2>Prestataires techniques</h2>
            <p>
              Pour faire fonctionner le site, certaines données passent par des prestataires, dont
              certains sont situés hors de l'Union européenne (notamment aux États-Unis) :
            </p>
            <ul>
              <li>Lovable (hébergement du site et de la base de données) ;</li>
              <li>
                Cloudflare Turnstile (protection anti-robot des formulaires : adresse IP,
                navigateur) ;
              </li>
              <li>
                Resend (envoi à l'équipe d'un e-mail de notification à chaque message ou
                inscription) ;
              </li>
              <li>
                Behold (affichage des dernières publications Instagram de Pro'pulse, sans donnée sur
                les visiteurs).
              </li>
            </ul>
            <h2>Tes droits</h2>
            <p>
              Tu peux accéder à tes données, les rectifier, les supprimer ou retirer ton
              consentement en écrivant à {mail}. Tu peux aussi saisir la CNIL (cnil.fr).
            </p>
          </div>
        </>
      )}
    </div>
  );
}
