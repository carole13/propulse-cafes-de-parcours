# Veille des événements externes

Le fichier `evenements-externes.json` contient les événements « À ne pas rater » (en menthe dans le calendrier).
Ils s'ajoutent aux événements de la base Supabase.

## Comment ça marche

1. Chaque lundi, une veille automatique cherche des événements utiles aux étudiants en communication à Paris.
2. Elle ouvre une **Pull Request** sur GitHub qui ajoute ses propositions dans ce fichier.
3. **L'équipe relit** la Pull Request : supprimer une proposition = supprimer son bloc `{ … }` (attention aux virgules).
4. Cliquer sur **Merge** : les événements arrivent dans Lovable. Puis **Publish → Update**.

Rien n'apparaît sur le site sans ce Merge. Les événements passés disparaissent tout seuls.

## Format d'un événement

```json
{
  "id": "heavent-paris-2026",
  "title": "Heavent Paris",
  "description": "Le salon de l'événementiel : stands d'agences, conférences.",
  "start_at": "2026-11-17T09:00:00+01:00",
  "location": "Espace Grande Arche, Paris La Défense",
  "sector": "Événementiel",
  "external_url": "https://…",
  "price": "Gratuit sur inscription",
  "why": "Pour découvrir les métiers de l'événementiel et rencontrer des agences.",
  "source": "https://… (page où la date a été vérifiée)"
}
```

- `id` : minuscules, chiffres et tirets, unique.
- `start_at` : date et heure avec le décalage horaire (`+01:00` en hiver, `+02:00` en été).
- `price`, `why` et `source` servent à la relecture ; ils ne s'affichent pas sur le site.
- Une entrée mal formée est ignorée (le site ne casse pas), et un test le signale.

# Cercles Pro'pulse gérés depuis GitHub

Le fichier `cercles.json` contient les cercles organisés par l'équipe (en fuchsia dans le calendrier).
Ils s'ajoutent aux cercles de la base Supabase et apparaissent aussi dans l'encart « Prochain cercle » de l'accueil.

L'inscription y est **sur demande** : pas de formulaire, la page du cercle invite à écrire en message privé
sur Instagram, et l'équipe choisit les participants. L'adresse exacte est envoyée aux personnes retenues.

## Format d'un cercle

```json
{
  "id": "conseil-prenom-nom-2026-11",
  "title": "Le conseil, vu de l'intérieur",
  "description": "Texte de présentation. \n\n crée un nouveau paragraphe.",
  "start_at": "2026-11-24T18:30:00+01:00",
  "location": "Un bar vers Châtelet (adresse envoyée aux participants)",
  "sector": "Conseil",
  "speaker": {
    "name": "Prénom Nom",
    "role": "Poste chez Entreprise",
    "bio": "Une ou deux phrases.",
    "photo": "/intervenants/prenom-nom.jpg"
  },
  "inscription": "message"
}
```

- La page du cercle sera `/agenda/cercle-<id>`.
- Photo de l'intervenant·e : la déposer dans `public/intervenants/` (carrée, environ 480 px), **avec son accord**.
- `capacity` (facultatif) : nombre de places, affiché à titre indicatif.
- Un cercle passé disparaît de l'agenda tout seul.
