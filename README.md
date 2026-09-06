# YG Services — site web

Site de la marque personnelle **YG Services** (Yoann Guiot), prévu pour https://yg-services.ch

« Je crée, j'optimise et je simplifie. » — Création web • Administration • Optimisation

---

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production
npm start          # servir le build
npm run typecheck  # vérification TypeScript
```

Node 20 ou plus récent.

---

## Stack

| Élément | Choix | Pourquoi |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | Pages rendues en HTML statique, donc excellent pour le référencement et la vitesse |
| Langage | TypeScript | Erreurs détectées avant la mise en ligne |
| Styles | Tailwind CSS 4 | Design system centralisé dans `src/app/globals.css` |
| Contenu blog | Markdown | Un article = un fichier, aucun code à toucher |
| Formulaires | Route API Next.js | Aucun service tiers imposé |

Toutes les pages sauf `/api/contact` sont pré-rendues en statique.

---

## À compléter avant la mise en ligne

Ces éléments sont volontairement vides : rien n'a été inventé. Les pages légales
affichent un encadré « à compléter » tant que l'information n'est pas renseignée.

**Dans `src/config/site.ts`**

- [ ] `contact.email` — adresse qui reçoit les demandes
- [ ] `contact.phone` — si vous souhaitez l'afficher
- [ ] `legal.companyName`, `legal.ideNumber`, `legal.vatNumber`, `legal.address`
- [ ] `legal.host` — nom de l'hébergeur (obligatoire dans les mentions légales)
- [ ] `social.linkedin` — si vous en créez un

**Dans `src/config/pricing.ts`**

- [ ] Les montants des formules Essentiel et Pro sont des **valeurs de départ à confirmer**.
      Remplacez-les par vos tarifs réels.

**Images à fournir** (voir la section Images plus bas)

- [ ] Votre photo professionnelle
- [ ] Les captures des trois réalisations

---

## Où modifier quoi

Tout ce qui change souvent est regroupé dans `src/config/`.

| Je veux modifier… | Fichier |
| --- | --- |
| Nom, e-mail, téléphone, réseaux, localisation, mentions légales | `src/config/site.ts` |
| Tarifs et contenu des trois formules, tableau comparatif | `src/config/pricing.ts` |
| Réalisations du portfolio | `src/config/projects.ts` |
| Prestations admin & optimisation | `src/config/services.ts` |
| Questions / réponses de la FAQ | `src/config/faq.ts` |
| Menu et liens du pied de page | `src/config/navigation.ts` |
| Couleurs, polices, espacements | `src/app/globals.css` |

### Ajouter une réalisation

Ajoutez un objet dans le tableau `projects` de `src/config/projects.ts`. Il apparaît
automatiquement sur la page d'accueil (si `featured: true`), sur `/realisations` et
sur `/sites-web`. Aucune autre modification n'est nécessaire.

```ts
{
  slug: 'nom-du-projet',        // sert d'ancre : /realisations#nom-du-projet
  name: 'Nom du projet',
  url: 'https://exemple.ch/',
  category: 'Création web',
  summary: 'Une phrase de présentation.',
  description: ['Un paragraphe.', 'Un autre paragraphe.'],
  services: ['Design', 'Développement'],
  technologies: ['Next.js'],
  image: '/images/realisations/nom-du-projet.jpg',
  imageAlt: 'Aperçu du site …',
  year: '2026',
  cta: { href: 'https://exemple.ch/', label: 'Voir le site' },
  featured: true,               // affiché sur la page d'accueil
}
```

**Règle :** n'indiquez que des informations vérifiables. Aucun chiffre de résultat
commercial ne doit être affiché tant qu'il n'est pas confirmé.

### Publier un article

Créez un fichier `content/blog/mon-article.md`. Le nom du fichier devient l'adresse
(`/blog/mon-article`). L'article apparaît seul dans la liste, dans le plan du site et
dans les articles liés.

```markdown
---
title: "Le titre affiché sur la page"
description: "Le résumé affiché dans la liste des articles."
date: '2026-09-15'
category: 'Création web'   # ou SEO, Assurances, Logement, Administratif, Économies
author: 'Yoann Guiot'
metaTitle: "Titre pour Google (45 caractères max.)"
metaDescription: "Description pour Google (155 caractères max.)"
image: '/images/blog/mon-image.jpg'
imageAlt: "Description de l'image"
draft: false               # true = invisible sur le site
---

Le contenu de l'article, en Markdown.

## Un sous-titre

Un [lien interne](/sites-web) vers une page de services.
```

Le temps de lecture est calculé automatiquement. Ajoutez toujours au moins un lien
interne vers une page de prestation : c'est ce qui fait travailler le blog.

### Changer un tarif

Une seule ligne dans `src/config/pricing.ts` :

```ts
price: 1490,   // ou null pour afficher « Sur devis »
```

---

## Images

Déposez les fichiers dans `public/images/`, puis mettez à jour le chemin
correspondant dans la configuration.

| Fichier attendu | Emplacement | Utilisé sur |
| --- | --- | --- |
| Votre photo | `public/images/yoann-guiot.jpg` | Accueil, À propos |
| Capture Jolie Création | `public/images/realisations/jolie-creation.jpg` | Accueil, Réalisations, Sites web |
| Capture ComparePrime | `public/images/realisations/compareprime.jpg` | idem |
| Capture Devis-Rapide | `public/images/realisations/devis-rapide.jpg` | idem |
| Illustrations d'articles | `public/images/blog/` | Blog |

Des images de remplacement neutres (`.svg`) sont en place pour que le site reste
présentable en attendant. Après avoir déposé un vrai fichier, changez l'extension
dans `src/config/site.ts` ou `src/config/projects.ts` (`.svg` → `.jpg`).

**Recommandations :** photo en portrait (rapport 4/5, minimum 800 × 1000 px),
captures en paysage (rapport 16/10, minimum 1200 × 750 px). Le format WebP ou AVIF
est généré automatiquement, inutile de le préparer.

L'image de partage sur les réseaux sociaux est générée automatiquement par
`src/app/opengraph-image.tsx` : rien à fournir.

---

## Formulaires

Les deux formulaires (contact complet et « J'ai besoin d'aide ») envoient vers
`/api/contact`. Cette route valide les données, bloque les robots par un champ piège,
limite le nombre d'envois par adresse IP, puis transmet la demande.

**Sans configuration**, les demandes sont écrites dans les journaux du serveur et le
visiteur reçoit quand même sa confirmation. Pour recevoir les demandes par e-mail,
renseignez les variables d'environnement ci-dessous.

### Variables d'environnement

Copiez `.env.example` vers `.env.local` (en développement) ou renseignez-les chez
votre hébergeur (en production).

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Adresse publique du site, sans slash final. Sert aux URL canoniques et au plan du site. |
| `CONTACT_INBOX` | Adresse qui reçoit les demandes |
| `RESEND_API_KEY` | Clé du service d'envoi d'e-mails. Vide = envoi désactivé |
| `RESEND_FROM` | Adresse expéditrice vérifiée |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Code de vérification Search Console, si vous en utilisez un |

Le service d'envoi peut être remplacé par un autre : tout se trouve dans la fonction
`deliver()` de `src/app/api/contact/route.ts`.

---

## Référencement

### Ce qui est déjà en place

- Un seul `<h1>` par page, hiérarchie de titres sans saut de niveau
- Titre et description uniques sur chaque page
- URL canonique sur chaque page
- Open Graph et Twitter Card, avec image générée automatiquement
- Données structurées : `Person`, `ProfessionalService`, `WebSite`, `WebPage`,
  `BreadcrumbList`, `FAQPage`, `Article`, `ItemList`
- `sitemap.xml` et `robots.txt` générés automatiquement
- Pages légales en `noindex`, exclues du plan du site
- Fil d'Ariane visible sur toutes les pages internes
- Texte alternatif sur toutes les images

### La stratégie retenue

Le site vise une visibilité organique en Suisse romande, avec cet ordre de priorité :
Yverdon-les-Bains, Nord vaudois, canton de Vaud, Lausanne, Neuchâtel, Fribourg,
Genève, Valais, Jura.

**Le choix structurant : pas de pages par ville.** Créer `/creation-site-web-lausanne`,
`/creation-site-web-neuchatel` et ainsi de suite avec un contenu quasi identique ne
fonctionne plus et dessert le site entier. Dix pages réellement utiles valent mieux
que cent pages écrites pour un moteur de recherche.

Une page locale ne se justifie que si elle apporte quelque chose de propre à cet
endroit : une réalisation faite sur place, une contrainte spécifique, une expérience
concrète. Le jour où ce sera le cas, l'architecture permet de l'ajouter sans rien
casser.

La visibilité locale passe donc plutôt par : le vocabulaire naturel des pages de
services, les articles de conseils, la cohérence des informations de contact partout,
et une fiche d'établissement Google bien renseignée.

### Connecter un profil Google Business Profile

Le site ne prétend nulle part qu'un profil existe déjà. Si vous en créez un :

1. Créez la fiche sur https://business.google.com avec l'intitulé exact **YG Services**.
2. Si vous ne recevez pas de clients à votre adresse, configurez une **zone desservie**
   plutôt qu'une adresse publique (Yverdon-les-Bains, Nord vaudois, canton de Vaud).
3. Renseignez le site `https://yg-services.ch`, les prestations, les horaires et de
   vraies photos.
4. **Vérifiez que le nom, l'adresse et le téléphone sont écrits exactement à
   l'identique** sur la fiche et dans `src/config/site.ts`. Toute variante affaiblit
   le référencement local.
5. Une fois la fiche vérifiée, complétez `siteConfig.contact.phone` : le numéro
   apparaîtra alors dans les données structurées `ProfessionalService`.
6. Demandez des avis à vos clients au fil de l'eau et répondez-y. Ne les achetez jamais.

### Connecter la Search Console

1. Ajoutez la propriété sur https://search.google.com/search-console
2. Choisissez la vérification par balise HTML et renseignez le code dans
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
3. Déployez, validez, puis soumettez `https://yg-services.ch/sitemap.xml`
4. Passez `analytics.googleSearchConsole` à `true` dans `src/config/site.ts` :
   la politique de confidentialité mentionnera alors ce traitement

**Important :** si vous ajoutez un outil de mesure d'audience, mettez à jour
`src/config/site.ts` **avant** de l'activer. La page de confidentialité s'adapte
automatiquement et doit toujours refléter la réalité.

---

## Accessibilité et performance

Vérifiés sur l'ensemble des pages, en 1280 px et en 390 px :

- Aucune violation axe-core (WCAG 2.1 niveau AA)
- Contrastes conformes sur fond clair comme sur fond sombre
- Navigation complète au clavier, lien d'évitement en premier
- FAQ en `<details>` natif : fonctionne sans JavaScript
- Animations neutralisées si `prefers-reduced-motion` est activé, et contenu
  entièrement visible si JavaScript est indisponible
- CLS à 0 et LCP sous la seconde, mesurés en mobile avec ralentissement
  processeur 4× et réseau 4G lent

---

## Structure du projet

```
content/blog/            Articles en Markdown
public/images/           Photo, captures, illustrations
src/app/                 Pages (une route = un dossier)
  api/contact/           Traitement des formulaires
  opengraph-image.tsx    Image de partage générée
  sitemap.ts, robots.ts  Fichiers SEO générés
src/components/          Composants réutilisables
  layout/                Header, Footer, Logo
  sections/              Blocs de page (Hero, CTA, formulaires…)
  ui/                    Briques de base (Button, Card, Section…)
src/config/              Toutes les données modifiables
src/lib/                 Blog, SEO, données structurées, validation
```

---

## Déploiement

Le projet fonctionne sur toute plateforme qui gère Next.js (Netlify, Vercel, ou un
serveur Node).

1. Connectez le dépôt à la plateforme
2. Commande de build : `npm run build`
3. Renseignez les variables d'environnement (au minimum `NEXT_PUBLIC_SITE_URL`)
4. Faites pointer le domaine `yg-services.ch` vers la plateforme
5. Vérifiez que `https://yg-services.ch/sitemap.xml` répond, puis soumettez-le à la
   Search Console

Après la mise en ligne, pensez à renseigner `legal.host` dans `src/config/site.ts` :
les mentions légales doivent indiquer l'hébergeur réel.

### Netlify

Le fichier `netlify.toml` contient trois éléments indispensables :

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Le runtime `@netlify/plugin-nextjs` est ce qui transforme le résultat du build en
site servable : il publie les fichiers statiques et crée la fonction serveur qui
rend les pages et traite `/api/contact`. Netlify l'installe automatiquement à
partir de cette déclaration, il n'y a rien à ajouter dans `package.json`.

**Si le site s'affiche vide après un déploiement réussi**, c'est presque toujours
ce bloc qui manque : sans `publish` ni runtime, Netlify publie la racine du dépôt,
qui ne contient aucun `index.html`. Le symptôme se repère dans le résumé du
déploiement, à la ligne « No functions deployed » : un site Next.js correctement
déployé embarque toujours une fonction serveur.
