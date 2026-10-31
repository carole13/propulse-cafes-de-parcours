# Propulse Cafes De Parcours

Crée le site web de Pro'pulse, un projet étudiant qui organise des tables de rencontre informelles entre étudiants et professionnels. Ton accessible, chaleureux, sans jargon : "comme autour d'un café". Le site doit faire professionnel mais détendu. Il est d'abord consulté sur mobile (lien en bio Instagram) : conception mobile-first, puis adaptation desktop. Tout le contenu est en français.

## Identité visuelle (à respecter strictement)

Couleurs (à définir comme variables CSS / tokens Tailwind) :

- Bleu #4361EE : couleur dominante (header, boutons principaux, grands aplats)

- Jaune #FFFD82 : accent principal (mots mis en valeur, encart "Prochain cercle")

- Menthe #B8F2E6 : accent secondaire (fonds de sections, cartes)

- Fuchsia #FF74D4 : accent ponctuel (badges, étiquettes)

- Blanc #FFFFFF et un gris très clair pour les fonds neutres

Règles de lisibilité : texte bleu sur fond jaune, menthe ou blanc ; texte blanc ou jaune sur fond bleu. Jamais de jaune sur fuchsia ni de blanc sur menthe.

Polices (Google Fonts) : Montserrat pour tout le texte (titres en gras 700-800, texte en 400-500) ; Noto Serif en italique, uniquement pour mettre en valeur un mot dans un titre (ex. "Un parcours atypique peut te *propulser.*").

Style : grands aplats de couleur, coins arrondis (16px), boutons en pilule, beaucoup d'espace, phrases courtes. Utilise les symboles de la marque comme éléments graphiques : ✱ (bleu), ^^ (visage, jaune), # (menthe), ~ (fuchsia). Le nom s'écrit toujours "Pro'pulse".

## Pages (navigation : Accueil, Agenda, Parcours, À propos ; menu burger sur mobile)

1. Accueil

- Hero sur fond bleu : titre "Un parcours atypique peut te *propulser.*" (mot "atypique" en jaune), sous-titre "Pas de case. Pas de CV parfait. Juste des gens qui se parlent.", bouton jaune "Voir le prochain cercle".

- Encart "Prochain cercle" (fond jaune, badge fuchsia "Prochain cercle") : affiche automatiquement le prochain événement Pro'pulse à venir (date, heure, lieu, secteur, intervenant) avec un bouton "Je m'inscris". S'il n'y en a aucun, afficher : "Le prochain cercle sera bientôt annoncé. Suis-nous sur Instagram pour ne rien rater." avec un lien vers instagram.com/propulse_students.

- "Derniers parcours" : les 3 derniers articles publiés en cartes (image, catégorie, titre, "Lire"). Masquer la section s'il n'y a aucun article.

- Bloc "Ici, pas d'entretien. Pas de pitch. *Juste une conversation.*" (fond menthe) avec 3 valeurs courtes : Sans évaluation / Sans compétition / Toutes les questions sont permises.

- Bloc final bleu "Vous êtes professionnel·le ? Partagez votre parcours" avec bouton vers le contact.

2. Agenda

- Liste chronologique des événements à venir, avec filtres : "Tous", "Cercles Pro'pulse", "À ne pas rater" (forums, salons, conférences externes).

- Les cercles Pro'pulse ont une carte mise en avant (bordure ou badge fuchsia "Cercle Pro'pulse"). Les événements externes ont un bouton "En savoir plus" qui ouvre leur lien dans un nouvel onglet.

- Page détail de chaque cercle Pro'pulse : description, intervenant·e (nom, poste, courte bio), date, heure, lieu, places restantes, puis le formulaire d'inscription en dessous.

- État vide : "Aucun événement pour le moment, revenez bientôt !"

3. Parcours

- Interviews, portraits de parcours atypiques et réponses aux questions des étudiants, en grille de cartes filtrables par catégorie ("Interview", "Parcours atypique", "Vos questions").

- Page détail d'un article : image, titre, catégorie, date, texte mis en forme (Markdown).

- État vide : "Les premiers parcours arrivent très bientôt."

4. À propos

- Le constat : le passage des études au monde pro fait peur, on ne sait pas à qui poser ses questions.

- Le concept : des cercles de rencontres informelles autour d'un secteur ou d'un parcours commun, sans évaluation ni compétition, pour que le réseau se construise dans la conversation. Une table par mois.

- Nos engagements : ton accessible, parole sans tabou (doutes, échecs, reconversion, salaire, syndrome de l'imposteur), aucune évaluation, démarche d'étudiants pour des étudiants, parcours variés y compris atypiques.

- Formulaire de contact pour les professionnels (nom, email, entreprise/poste, message), avec la même protection anti-robot.

Pied de page sur toutes les pages : lien Instagram, "Mentions légales", "Politique de confidentialité" (deux pages simples avec texte modèle à compléter, adapté au RGPD).

## Formulaire d'inscription à un cercle (sur la page détail de chaque cercle Pro'pulse)

Champs, tous obligatoires sauf le dernier :

- Prénom

- Nom

- Email académique, avec validation : format email valide, et refus des domaines personnels (gmail.com, hotmail.com, hotmail.fr, outlook.com, outlook.fr, live.fr, yahoo.com, yahoo.fr, icloud.com, orange.fr, free.fr, laposte.net, sfr.fr, wanadoo.fr) avec le message "Merci d'utiliser ton adresse email étudiante."

- "Pourquoi ce cercle t'intéresse ?" (zone de texte, 500 caractères max)

- "Quelles questions aimerais-tu poser à l'intervenant·e ?" (zone de texte, 1000 caractères max, facultatif)

- Case obligatoire : "J'accepte que mes données soient utilisées par Pro'pulse uniquement pour l'organisation de ce cercle." avec lien vers la politique de confidentialité.

Protection : Cloudflare Turnstile (widget invisible/managed). Le token est vérifié côté serveur dans une Supabase Edge Function qui seule insère l'inscription en base. La clé secrète Turnstile est stockée en secret Supabase, jamais dans le code front.

Contrôles côté serveur : refuser si le cercle est complet, si l'événement est passé, ou si le même email est déjà inscrit à ce cercle.

Après envoi : message de confirmation chaleureux ("C'est noté ! On a hâte de te rencontrer. On t'envoie les détails pratiques avant le cercle.").

Si le cercle est complet : masquer le formulaire et afficher "Ce cercle est complet. Le prochain sera annoncé sur notre Instagram."

## Base de données Supabase

Table events : id, title, description, type ("propulse" ou "externe"), start_at (date et heure), location, sector, speaker_name, speaker_role, speaker_bio, capacity (nombre, uniquement pour propulse), external_url (uniquement pour externe), image_url, published (booléen), created_at.

Table articles : id, title, slug, category ("interview", "parcours-atypique", "vos-questions"), excerpt, content (markdown), cover_image_url, published (booléen), published_at.

Table registrations : id, event_id (référence events), first_name, last_name, email, motivation, questions, consent (booléen), created_at. Contrainte d'unicité sur (event_id, email).

Table contact_messages : id, name, email, company_role, message, created_at.

Sécurité (RLS activée sur toutes les tables) : events et articles lisibles publiquement uniquement si published = true ; registrations et contact_messages : aucune lecture publique, insertion uniquement via les Edge Functions. Les places restantes sont calculées via une fonction SQL qui renvoie seulement le nombre, jamais les données des inscrits.

Ne crée aucun contenu d'exemple en base : le site doit afficher correctement ses états vides. Le contenu sera ajouté à la main depuis l'éditeur de tables Supabase.

## Qualité

Code propre et commenté, composants réutilisables (EventCard, ArticleCard, RegistrationForm), accessibilité (labels de formulaire, contrastes AA, navigation clavier), balises SEO et Open Graph avec le titre "Pro'pulse | Rencontres informelles entre étudiants et pros".

je t'envoie en pièce jointe notre chrate graphique ou on y retrouev notre logo

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e1c3342a-bca4-4886-8bd4-46eb974502d1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
