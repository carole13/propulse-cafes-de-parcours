/**
 * Prévient l'équipe par e-mail à chaque message de contact ou inscription à un cercle.
 *
 * Passe par Resend (resend.com, gratuit jusqu'à 100 e-mails par jour). Aucun mot de
 * passe Gmail : il suffit de deux secrets dans Lovable (paramètres Cloud → Secrets) :
 *   - RESEND_API_KEY        : la clé créée sur resend.com (commence par « re_ ») ;
 *   - CONTACT_NOTIFY_EMAIL  : l'adresse qui reçoit les notifications. Sans domaine
 *     vérifié, Resend n'envoie qu'à l'adresse du compte Resend : utiliser la même.
 * Tant que ces secrets manquent, rien n'est envoyé (les messages restent enregistrés
 * dans la base). Une erreur d'envoi ne bloque jamais le formulaire.
 */

type Notification = {
  subject: string;
  /** Lignes du message, en texte brut. */
  lines: string[];
  /** Adresse de la personne : « Répondre » dans Gmail lui écrit directement. */
  replyTo?: string;
};

export async function notifyTeam({ subject, lines, replyTo }: Notification): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["CONTACT_NOTIFY_EMAIL"];
  if (!apiKey || !to) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Site Pro'pulse <onboarding@resend.dev>",
        to: [to],
        subject,
        text: lines.join("\n"),
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("notifyTeam", res.status, await res.text());
  } catch (e) {
    console.error("notifyTeam", e);
  }
}
