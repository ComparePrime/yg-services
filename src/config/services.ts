/**
 * Prestations administratives et d'optimisation.
 * Structure évolutive : ajouter un objet pour créer une nouvelle section.
 * `disclaimer` affiche une mention de cadre (ce que la prestation n'est pas).
 */

export type AdminService = {
  id: string;
  emoji: string;
  title: string;
  intro: string;
  items: string[];
  disclaimer?: string;
  cta: { href: string; label: string };
  /** Encadré optionnel : prestation approfondie liée à la section. */
  premium?: {
    title: string;
    text: string;
    points: string[];
    cta: { href: string; label: string };
  };
};

export const adminServices: AdminService[] = [
  {
    id: 'assurances',
    emoji: '🛡️',
    title: 'Optimisation de vos assurances',
    intro:
      "J'ai suivi une formation AFA (Association pour la formation professionnelle en assurance) et travaillé dans le domaine. Je peux faire le point avec vous sur vos couvertures et identifier ce qui mérite d'être vérifié.",
    items: [
      'Assurance maladie de base',
      'Assurances complémentaires',
      'Assurance ménage',
      'Responsabilité civile',
      'Assurance véhicule',
      'Protection juridique',
      'Assurance voyage',
      'Prévoyance',
      'Autres contrats',
    ],
    disclaimer:
      "Je ne vous garantis aucune économie avant d'avoir regardé votre situation. Mon rôle est d'identifier les possibilités d'optimisation et de vous les expliquer clairement.",
    cta: { href: '/contact?sujet=assurance', label: 'Faire analyser mes assurances' },
    premium: {
      title: 'Audit de vos assurances',
      text: "Vous me transmettez vos contrats et je les reprends un par un. Vous recevez ensuite un point de situation écrit, dans un langage compréhensible.",
      points: [
        'Lecture des garanties réellement couvertes',
        'Primes et franchises',
        'Doublons éventuels entre contrats',
        'Cohérence entre vos couvertures et votre situation',
        'Possibilités d’optimisation à envisager',
      ],
      cta: { href: '/contact?sujet=assurance', label: 'Demander un audit' },
    },
  },
  {
    id: 'logement',
    emoji: '🏠',
    title: 'Logement & loyer',
    intro:
      "Une hausse de loyer, un déménagement, un dossier de location à préparer : ce sont des démarches où quelques documents bien préparés changent beaucoup de choses.",
    items: [
      "Analyse d'une hausse de loyer",
      'Préparation d’une demande de baisse de loyer',
      'Courrier au bailleur ou à la gérance',
      'Résiliation de bail',
      'Changement d’adresse',
      'Constitution d’un dossier de location',
      'Lettre de motivation pour un logement',
      'Organisation de vos documents',
      'Aide administrative liée au logement',
    ],
    disclaimer:
      "Je vous aide à préparer et à formuler vos démarches. Je ne peux pas garantir qu'une baisse de loyer soit juridiquement fondée dans votre cas, et cet accompagnement ne remplace pas l'avis d'un professionnel du droit du bail.",
    cta: { href: '/contact?sujet=logement', label: 'Faire le point sur mon loyer' },
  },
  {
    id: 'impots',
    emoji: '📑',
    title: 'Impôts & organisation',
    intro:
      "Beaucoup de temps se perd à chercher les bons documents. Je vous aide à préparer un dossier complet et ordonné avant de le transmettre à qui de droit.",
    items: [
      'Organisation de vos documents',
      'Établissement d’une checklist personnalisée',
      'Identification des documents manquants',
      'Préparation du dossier',
      'Mise en ordre des informations',
      'Repérage des éléments à vérifier',
      'Préparation des questions destinées à une fiduciaire',
    ],
    disclaimer:
      "Je ne suis ni fiscaliste, ni fiduciaire, ni conseiller fiscal. Cet accompagnement est administratif et organisationnel : il prépare le travail, il ne le remplace pas.",
    cta: { href: '/contact?sujet=impots', label: 'Organiser mon dossier' },
  },
  {
    id: 'famille',
    emoji: '👨‍👩‍👧',
    title: 'Famille & changements de situation',
    intro:
      "Une naissance, un mariage, un déménagement : chaque changement déclenche une série de démarches, souvent dans un ordre précis et avec des délais.",
    items: [
      'Naissance',
      'Mariage',
      'Changement d’adresse',
      'Changement de situation professionnelle ou familiale',
      'Allocations',
      'Démarches liées aux enfants',
      'Organisation documentaire',
    ],
    cta: { href: '/contact?sujet=administratif', label: 'Préparer mes démarches' },
    premium: {
      title: "Arrivée d'un enfant",
      text: "Je prépare avec vous une checklist claire, étape par étape, pour ne rien oublier au moment où vous aurez le moins de temps.",
      points: [
        'Avant la naissance : annonces, assurances, congés, documents à réunir',
        'À la naissance : annonce, état civil, inscriptions',
        'Après la naissance : allocations, couvertures, mises à jour de dossiers',
      ],
      cta: { href: '/contact?sujet=administratif', label: 'Recevoir ma checklist' },
    },
  },
  {
    id: 'courriers',
    emoji: '✉️',
    title: 'Rédaction de courriers',
    intro:
      "Vous savez ce que vous voulez dire, mais pas comment l'écrire. Vous m'expliquez la situation, je rédige le courrier.",
    items: [
      'Courrier au propriétaire ou à la gérance',
      'Courrier à une assurance',
      'Courrier à une administration',
      'Courrier à une entreprise ou un fournisseur',
      'Résiliation',
      'Réclamation',
      'Demande de remboursement',
      "Demande d'information",
      'Contestation',
    ],
    cta: { href: '/contact?sujet=courrier', label: 'Décrire ma situation' },
  },
  {
    id: 'emploi',
    emoji: '💼',
    title: 'Emploi & candidatures',
    intro:
      "Un dossier de candidature qui tient la route, c'est d'abord un dossier lisible et cohérent avec l'offre visée.",
    items: [
      'Mise en forme du CV',
      'Lettre de motivation',
      'Dossier de candidature complet',
      'Profil LinkedIn',
      "Analyse d'une offre d'emploi",
      "Préparation d'un entretien",
    ],
    cta: { href: '/contact?sujet=administratif', label: 'Préparer ma candidature' },
  },
  {
    id: 'autres-optimisations',
    emoji: '📉',
    title: 'Autres optimisations',
    intro:
      "Certaines dépenses passent des années sans être revues. Cela vaut souvent la peine d'y jeter un œil.",
    items: [
      'Télécoms et abonnements',
      'Contrats liés au véhicule',
      'Organisation documentaire',
      'Dépenses récurrentes du quotidien',
    ],
    disclaimer:
      "Aucune économie n'est promise avant analyse. Je regarde d'abord votre situation, puis je vous dis honnêtement s'il y a quelque chose à optimiser.",
    cta: { href: '/contact?sujet=autre', label: 'Faire le point' },
  },
];

/** Les deux portes d'entrée du site, affichées sur la page d'accueil. */
export const twoWays = [
  {
    emoji: '💻',
    title: 'Création web',
    text: "Vous avez besoin d'un site web professionnel ? Je m'occupe de votre projet de la conception à la mise en ligne.",
    href: '/sites-web',
    cta: 'Découvrir mes offres web',
  },
  {
    emoji: '📂',
    title: 'Admin & optimisation',
    text: "Une démarche administrative, une assurance à revoir, un courrier à rédiger ou une situation que vous ne savez pas comment gérer ? Expliquez-moi votre besoin.",
    href: '/admin-optimisation',
    cta: 'Découvrir mes services administratifs',
  },
];

/** Les 7 étapes d'un projet web. */
export const webProcess = [
  { step: '01', title: 'Analyse', text: "Je prends le temps de comprendre votre activité, vos objectifs et ce que le site doit réellement vous apporter." },
  { step: '02', title: 'Structure', text: "Je définis l'architecture des pages et le parcours du visiteur, de son arrivée jusqu'à sa prise de contact." },
  { step: '03', title: 'Design', text: "Je crée une interface moderne, sobre et lisible, pensée d'abord pour le mobile." },
  { step: '04', title: 'Développement', text: 'Je développe le site, page par page, avec un code propre et maintenable.' },
  { step: '05', title: 'SEO', text: "J'optimise la structure technique et les contenus pour que vos pages soient trouvées." },
  { step: '06', title: 'Mise en ligne', text: 'Je configure le nom de domaine, l’hébergement et je publie le site.' },
  { step: '07', title: 'Évolution', text: 'Je reste disponible pour la maintenance et les améliorations futures.' },
];

/** Section « Pourquoi moi ? ». */
export const whyMe = [
  { title: 'Un seul interlocuteur', text: 'Vous échangez directement avec moi, du premier message à la mise en ligne.' },
  { title: 'Une approche concrète', text: 'Je cherche des solutions simples et applicables, pas des présentations théoriques.' },
  { title: 'Du digital à l’administratif', text: 'Deux univers complémentaires, avec la même logique : rendre les choses lisibles.' },
  { title: 'De A à Z', text: 'Je peux gérer un projet web complet, de la première idée jusqu’à la maintenance.' },
  { title: 'Une relation humaine', text: 'Pas de plateforme impersonnelle ni de service client anonyme.' },
];
