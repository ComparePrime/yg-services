# SEO du catalogue et plan éditorial

> Les volumes de recherche ne sont pas chiffrés : interroger Semrush ou
> OpenSEO consomme des crédits payants, et vous avez demandé qu'aucun crédit
> ne soit dépensé sans votre accord. Dites-moi si je valide les volumes, et
> je reprends ce document avec les chiffres.

## L'architecture, et pourquoi elle est faite ainsi

```
/assistance-administrative                     ← page pilier
├── /impots                 (10 fiches)        ← page de domaine
├── /logement               (10 fiches)
├── /subsides                (8 fiches)
├── /demarches              (12 fiches)
├── /comptabilite           (14 fiches)
├── /documents              (13 fiches)
└── /packs                   (4 fiches)
```

**79 pages indexables** au total pour le catalogue : 1 pilier, 7 domaines,
71 fiches. Les pages de commande (`/commande/*`) sont en `noindex` :
elles n'ont aucune valeur de recherche et créeraient 71 doublons de contenu
mince. La fiche est la page de référence ; la commande n'est qu'une étape.

Le choix d'avoir gardé l'URL `/assistance-administrative` plutôt que de
créer `/services-administratifs` est délibéré : la première est déjà la cible
d'une redirection 301 depuis `/admin-optimisation`, et créer un second
chemin aurait mis deux pages en concurrence sur la même intention.

## Répartition des intentions

| Niveau | Rôle | Intention visée |
|---|---|---|
| Pilier | autorité du domaine, maillage | « aide administrative suisse », requêtes larges |
| Domaine | requêtes de catégorie | « aide déclaration impôts suisse », « aide démarches locatives » |
| Fiche | longue traîne transactionnelle | « demande baisse de loyer modèle prix », « qui remplit ma déclaration d'impôts Yverdon » |
| Article | requêtes informationnelles | « comment contester une hausse de charges » |

C'est la fiche qui convertit, parce qu'elle répond à une requête déjà
transactionnelle : le visiteur cherche un prix et un délai, il les trouve.
C'est l'article qui capte le volume, parce qu'il répond à une question posée
avant que la personne sache qu'un service existe.

## Ce qui est déjà en place

- **Données structurées** : `Service` + `Offer` avec `price` et
  `priceCurrency: CHF` sur chaque fiche, `ItemList` sur chaque domaine,
  `BreadcrumbList` partout, `FAQPage` sur le pilier. Un prix en données
  structurées est ce qui permet à une fiche d'apparaître avec son montant
  dans les résultats.
- **Maillage interne** : chaque fiche renvoie vers 2 à 3 prestations liées
  (`voirAussi`) et vers son domaine ; chaque domaine renvoie vers les six
  autres ; les packs renvoient vers les prestations qu'ils couvrent, et
  réciproquement.
- **Titres et descriptions** : 164 URL vérifiées, aucun titre au-delà de
  65 caractères, aucune description au-delà de 165. Le champ `titreSeo`
  permet de raccourcir un titre long sans toucher au titre affiché.
- **Plan du site** : généré au build, les nouvelles fiches et les packs s'y
  ajoutent seuls.

## Mise à jour du 26 novembre 2026 — ce qui a été ajouté depuis

- **FAQ propres aux prestations** : 38 questions sur 22 fiches, rédigées une
  par une. Elles portent des données structurées `FAQPage`. Les 49 autres
  fiches n'en ont **pas**, et c'est volontaire : une FAQ générée depuis un
  modèle aurait répété la même question sur des dizaines de pages, ce qui
  est exactement le contenu dupliqué artificiel à éviter.
- **Mention du présentiel dans les métadonnées**, mais seulement quand elle
  informe : « À distance ou chez vous » n'est écrit que si l'intervention
  sur place est réellement proposée, « À distance ou sur rendez-vous » quand
  seul un rendez-vous l'est, et rien d'autre que « À distance » sinon.
- **Section « Comment cette prestation peut se dérouler »** sur les fiches
  concernées, avec les zones de déplacement et les conditions de
  rendez-vous, en H2/H3.
- **Données structurées `availableChannel`** sur les fiches : canal à
  distance, et canal sur place avec son lieu quand il existe.
- **Septième catégorie, les packs** : 4 fiches de plus, avec leurs propres
  pages, leurs données structurées et leur maillage vers les prestations
  couvertes.
- **Nouvelle page indexable** `/transmission-securisee`, avec sa FAQ et ses
  données structurées. Elle répond à une vraie inquiétude et pas seulement à
  un besoin de contenu.
- **Trois articles rédigés** (voir plus bas).
- **Vérifié** : 165 URL parcourues, 0 erreur, un seul H1 par page, aucun
  titre au-delà de 65 caractères, aucune description au-delà de 165.

### Les trois articles écrits

| Article | Priorité du plan | Mène à |
|---|---|---|
| Déclaration d'impôts vaudoise : la liste des documents à réunir | 1 | les 10 fiches Impôts |
| Subside d'assurance maladie : comment constituer un dossier qui passe | 1 | `subside-assurance-maladie`, `pack-subside` |
| Décompte de charges : ce qui peut vous être facturé, et ce qui ne peut pas | 1 | `contestation-charges` |

Un point de méthode, parce qu'il compte pour la suite : en préparant
l'article sur le subside, les sources disponibles se **contredisaient** sur
deux règles — la date d'ouverture du droit et le caractère automatique du
renouvellement. L'article est donc écrit sur ce qui est solide (base de
calcul, taxation de référence, LAMal uniquement, importance de la date de
dépôt) et renvoie à l'OVAM pour ce qui change chaque année. Plutôt que
d'affirmer une règle contestée, il dit où trouver celle qui fait foi. La
même prudence a été appliquée aux numérotations d'alinéas du Code des
obligations dans l'article sur les charges.

Les deux articles restants de la priorité 1 du plan ne sont pas écrits :
« Baisse de loyer » et « Déménager en Suisse » existent déjà sur le blog
sous un autre titre, et en écrire une seconde version créerait exactement la
duplication à éviter. Ils seront **mis à jour** plutôt que doublés.

## Les manques, par ordre d'importance

1. ~~Aucun article n'existe encore pour le catalogue.~~ **Partiellement
   traité** : trois articles écrits, douze restants au plan ci-dessous.
2. **Pas d'ancrage local.** « Yverdon-les-Bains » figure dans les
   descriptions, mais il n'y a pas de page locale ni de fiche
   d'établissement. Sur ce marché, la recherche locale est une part
   importante du volume.
3. **Pas de preuve.** Aucun témoignage, aucun chiffre — c'est votre règle, et
   elle est juste tant qu'il n'y a rien de réel à montrer. Dès qu'un client
   accepte d'être cité, c'est le gain de conversion le plus rentable
   disponible.

## Plan éditorial — 15 articles, par potentiel de conversion

Chaque article vise une requête informationnelle et conduit à une fiche
précise. L'ordre est celui dans lequel je les écrirais.

### Priorité 1 — conversion forte, concurrence abordable

| Article | Intention | Mène à |
|---|---|---|
| Baisse de loyer en Suisse : quand le taux de référence vous donne droit à une diminution | « puis-je demander une baisse de loyer » | `demande-baisse-loyer` |
| Subside d'assurance maladie : qui y a droit et quelles pièces réunir | « ai-je droit au subside » | `subside-assurance-maladie`, `pack-subside` |
| Déclaration d'impôts vaudoise : la liste complète des documents à réunir | « documents déclaration impôts Vaud » | les 10 fiches Impôts |
| Contester un décompte de charges : ce qui est facturable et ce qui ne l'est pas | « charges locatives abusives » | `contestation-charges` |
| Déménager en Suisse : tous les organismes à prévenir, dans l'ordre | « changement adresse qui prévenir » | `pack-demenagement` |

### Priorité 2 — volume, conversion moyenne

| Article | Mène à |
|---|---|
| Résilier son bail : délais, forme et pièges | `resiliation-bail` |
| Garantie de loyer non restituée : la marche à suivre | `restitution-garantie` |
| Prolonger le délai de sa déclaration d'impôts : comment et jusqu'à quand | `prolongation-delai-fiscal` |
| Allocations familiales : conditions et dossier à constituer | `allocation-familiale`, `dossier-allocation` |
| Défauts dans un logement loué : constituer un dossier qui tient | `dossier-defaut-logement` |

### Priorité 3 — notoriété et B2C/B2B indépendants

| Article | Mène à |
|---|---|
| Indépendant en Suisse : quels justificatifs garder, et combien de temps | `classement-justificatifs`, `dossier-fiduciaire` |
| Préparer son dossier pour la fiduciaire sans y passer ses soirées | `dossier-fiduciaire`, `suivi-mensuel` |
| Écrire une lettre de réclamation qui obtient une réponse | `lettre-reclamation` |
| CV suisse : ce qui s'y met et ce qui n'a rien à y faire | `refonte-cv`, `cv-lettre-motivation` |
| Demander un plan de paiement : à qui, comment, avec quels arguments | `paiement-echelonne`, `demande-delai` |

### Règles de rédaction

- **Un article répond à la question posée**, complètement, sans réserver la
  réponse à la prestation. Un article qui retient l'information ne se
  partage pas et ne se classe pas.
- **Un seul appel à l'action**, en fin d'article, vers la fiche
  correspondante — pas de bandeau au milieu du texte.
- **Aucune promesse de résultat**, aucun chiffre non vérifié, aucun
  témoignage inventé.
- **Les sources officielles** (vd.ch, admin.ch, OFL pour le taux de
  référence) citées en fin d'article : c'est ce qui distingue un article
  utile d'un article de remplissage.

## Prochaines étapes que je peux prendre en charge

1. Rédiger les cinq articles de priorité 1. Comptez un article complet par
   passage, sources incluses.
2. Valider les volumes de recherche avec Semrush ou OpenSEO — **sur votre
   accord**, puisque cela consomme des crédits.
3. Créer une page locale « Aide administrative à Yverdon-les-Bains » si vous
   voulez travailler la recherche locale.
