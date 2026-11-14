import type { SubjectValue } from '@/lib/contact';

/**
 * Moteur d'orientation de la page d'accueil.
 *
 * Le visiteur décrit son besoin avec ses mots ; quelques expressions sont
 * reconnues pour l'orienter vers la bonne activité. Ce n'est pas une analyse
 * automatique de sa situation, et le site ne le laisse jamais croire.
 *
 * POUR AJOUTER UNE INTENTION : copier un objet du tableau `intents` ci-dessous.
 * Rien d'autre à modifier, la page d'accueil se met à jour seule.
 *
 * Règle de reconnaissance : plus l'expression reconnue est longue, plus elle
 * pèse. Écrire les mots-clés en minuscules ; les accents sont ignorés
 * automatiquement.
 */

export type UniverseId = 'digital' | 'administratif';

export type Universe = {
  id: UniverseId;
  nom: string;
  /** À qui s'adresse l'activité. Affiché comme repère de clientèle. */
  cible: string;
  resume: string;
  prestations: string[];
  href: string;
  cta: string;
};

export const universes: Universe[] = [
  {
    id: 'digital',
    nom: 'Création de sites internet',
    cible: 'Indépendants, PME, commerçants et particuliers',
    resume:
      'YG Services conçoit, développe et met en ligne votre site, puis l’optimise pour que vos clients vous trouvent.',
    prestations: [
      'Sites vitrines professionnels',
      'Boutiques en ligne',
      'Refonte et modernisation',
      'Référencement naturel',
    ],
    href: '/sites-web',
    cta: 'Découvrir les services digitaux',
  },
  {
    id: 'administratif',
    nom: 'Assistance administrative',
    cible: 'Particuliers',
    resume:
      'YG Services prend en charge les démarches, les courriers et l’organisation des documents du quotidien.',
    prestations: [
      'Démarches administratives',
      'Rédaction de courriers',
      'Organisation des documents',
      'Soutien ponctuel ou régulier',
    ],
    href: '/assistance-administrative',
    cta: 'Découvrir l’assistance administrative',
  },
];

export type Intent = {
  id: string;
  universe: UniverseId;
  titre: string;
  /** Ce que YG Services prend en charge. Sans promesse de résultat. */
  reponse: string;
  etapes: string[];
  sujet: SubjectValue;
  service: string;
  /** Expressions reconnues, en minuscules. Les accents sont ignorés. */
  motsCles: string[];
};

export const intents: Intent[] = [
  /* ---------------- Création de sites internet ---------------- */
  {
    id: 'creation-site',
    universe: 'digital',
    titre: 'Création de votre site internet',
    reponse:
      'YG Services prend en charge votre projet de bout en bout : structure des pages, design, développement, référencement et mise en ligne.',
    etapes: ['Analyse du besoin', 'Conception', 'Mise en ligne'],
    sujet: 'creer-site',
    service: '/sites-web',
    motsCles: [
      'creer un site', 'creation de site', 'creer mon site', 'nouveau site',
      'site internet', 'site web', 'site vitrine', 'faire un site',
      'besoin d un site', 'je veux un site', 'presence en ligne', 'page web',
      'site pour mon entreprise', 'site pour mon commerce', 'site',
    ],
  },
  {
    id: 'refonte-site',
    universe: 'digital',
    titre: 'Refonte et modernisation de votre site',
    reponse:
      'YG Services analyse votre site actuel, identifie ce qui fonctionne et ce qui doit être repris, puis vous indique si une refonte complète se justifie.',
    etapes: ['État des lieux', 'Priorités', 'Reprise'],
    sujet: 'refaire-site',
    service: '/sites-web',
    motsCles: [
      'refonte', 'refaire mon site', 'refaire le site', 'moderniser mon site',
      'ameliorer mon site', 'mon site est vieux', 'site vieux', 'site ancien',
      'site obsolete', 'site pas responsive', 'pas bien sur telephone',
      'pas adapte au mobile', 'site lent', 'site trop lent',
      'mon site ne marche pas', 'site ne fonctionne pas', 'site depasse',
    ],
  },
  {
    id: 'boutique',
    universe: 'digital',
    titre: 'Boutique en ligne',
    reponse:
      'Vendre en ligne demande plus qu’un site vitrine : catalogue, paiement, commandes et suivi. YG Services construit cet ensemble et vous explique ce qu’il implique au quotidien.',
    etapes: ['Cadrage', 'Développement', 'Accompagnement'],
    sujet: 'creer-site',
    service: '/sites-web',
    motsCles: [
      'e commerce', 'ecommerce', 'boutique en ligne', 'boutique',
      'vendre en ligne', 'vente en ligne', 'panier', 'paiement en ligne',
      'magasin en ligne', 'catalogue en ligne',
    ],
  },
  {
    id: 'seo',
    universe: 'digital',
    titre: 'Référencement et visibilité',
    reponse:
      'YG Services travaille la structure technique et le contenu de vos pages pour que vos clients vous trouvent, en particulier sur les recherches locales du Nord vaudois.',
    etapes: ['Audit', 'Optimisation', 'Suivi'],
    sujet: 'seo',
    service: '/sites-web',
    motsCles: [
      'referencement', 'seo', 'visible sur google', 'etre visible', 'visibilite',
      'apparaitre sur google', 'remonter sur google', 'premiere page de google',
      'trouve sur google', 'position sur google', 'fiche google', 'google',
      'attirer des clients',
    ],
  },
  {
    id: 'automatisation',
    universe: 'digital',
    titre: 'Automatisation et intégrations',
    reponse:
      'Formulaires, prise de rendez-vous, connexion entre vos outils : YG Services automatise les tâches répétitives qui vous prennent du temps chaque semaine.',
    etapes: ['Repérage', 'Mise en place', 'Réglages'],
    sujet: 'creer-site',
    service: '/sites-web',
    motsCles: [
      'automatiser', 'automatisation', 'integration', 'connecter mes outils',
      'prise de rendez vous', 'reservation en ligne', 'espace client',
      'formulaire en ligne', 'gagner du temps',
    ],
  },

  /* ---------------- Assistance administrative ---------------- */
  {
    id: 'demarche',
    universe: 'administratif',
    titre: 'Accompagnement dans vos démarches',
    reponse:
      'YG Services vous aide à comprendre ce qui est demandé, à réunir les bons documents et à préparer le dossier. Il s’agit d’un accompagnement administratif et organisationnel.',
    etapes: ['Y voir clair', 'Réunir les pièces', 'Préparer le dossier'],
    sujet: 'administratif',
    service: '/assistance-administrative',
    motsCles: [
      'demarche administrative', 'demarches administratives', 'aide administrative',
      'assistance administrative', 'administratif', 'paperasse',
      'je ne comprends pas le formulaire', 'remplir un formulaire',
      'dossier a preparer', 'aide pour un dossier', 'demarche',
    ],
  },
  {
    id: 'courrier',
    universe: 'administratif',
    titre: 'Rédaction de courriers',
    reponse:
      'Vous expliquez la situation avec vos mots, YG Services rédige un courrier clair et adapté au destinataire, puis l’ajuste après votre relecture.',
    etapes: ['Votre situation', 'Rédaction', 'Relecture'],
    sujet: 'courrier',
    service: '/assistance-administrative#courriers',
    motsCles: [
      'rediger un courrier', 'ecrire une lettre', 'rediger une lettre',
      'faire un courrier', 'besoin d un courrier', 'lettre type',
      'modele de lettre', 'reclamation', 'contester', 'contestation',
      'mise en demeure', 'demande de remboursement', 'resiliation',
      'courrier', 'lettre',
    ],
  },
  {
    id: 'documents',
    universe: 'administratif',
    titre: 'Organisation de vos documents',
    reponse:
      'Classement, tri, mise en forme et suivi des échéances : YG Services remet de l’ordre dans vos papiers et met en place une organisation que vous pouvez tenir.',
    etapes: ['Inventaire', 'Classement', 'Méthode'],
    sujet: 'documents',
    service: '/assistance-administrative#documents',
    motsCles: [
      'organiser mes documents', 'organiser mes papiers', 'classer mes papiers',
      'mes papiers', 'classement', 'archivage', 'gestion documentaire',
      'papiers en desordre', 'trier mes documents', 'mettre en forme un document',
      'saisie de donnees',
    ],
  },
  {
    id: 'demenagement',
    universe: 'administratif',
    titre: 'Déménagement et changement d’adresse',
    reponse:
      'Un déménagement déclenche une série d’annonces, souvent dans un ordre précis et avec des délais. YG Services établit votre liste personnalisée et prépare les courriers.',
    etapes: ['Liste personnalisée', 'Courriers', 'Suivi des délais'],
    sujet: 'administratif',
    service: '/assistance-administrative',
    motsCles: [
      'demenagement', 'demenager', 'je viens de demenager', 'changement d adresse',
      'changer d adresse', 'nouvelle adresse', 'qui dois je prevenir',
      'qui prevenir', 'controle des habitants', 'annonce de depart',
      'annonce d arrivee',
    ],
  },
  {
    id: 'logement',
    universe: 'administratif',
    titre: 'Démarches liées au logement',
    reponse:
      'Bail, courrier à la gérance, résiliation, dossier de location : YG Services prépare la démarche et rédige les courriers. Aucun résultat n’est garanti, cela dépend de votre contrat.',
    etapes: ['Lecture des documents', 'Points à vérifier', 'Courrier'],
    sujet: 'logement',
    service: '/assistance-administrative#logement',
    motsCles: [
      'loyer', 'mon loyer', 'bail', 'mon bail', 'proprietaire', 'gerance',
      'regie', 'resilier mon bail', 'etat des lieux', 'dossier de location',
      'augmentation de loyer', 'courrier a la gerance',
    ],
  },
  {
    id: 'famille',
    universe: 'administratif',
    titre: 'Changement de situation',
    reponse:
      'Naissance, mariage, changement de situation : YG Services prépare la liste des annonces à faire, dans l’ordre, pour ne rien oublier au moment où vous aurez le moins de temps.',
    etapes: ['Checklist', 'Annonces', 'Mises à jour'],
    sujet: 'administratif',
    service: '/assistance-administrative#situation',
    motsCles: [
      'naissance', 'je vais avoir un enfant', 'arrivee d un enfant', 'bebe',
      'mariage', 'je me marie', 'allocations familiales', 'allocation',
      'changement de situation', 'separation',
    ],
  },
  {
    id: 'impots',
    universe: 'administratif',
    titre: 'Préparation de vos documents fiscaux',
    reponse:
      'YG Services vous aide à réunir les bons documents, à les classer et à préparer vos questions. YG Services n’est ni fiscaliste ni fiduciaire : la prestation prépare le travail, elle ne le remplace pas.',
    etapes: ['Checklist', 'Mise en ordre', 'Dossier prêt'],
    sujet: 'impots',
    service: '/assistance-administrative#impots',
    motsCles: [
      'impots', 'impot', 'declaration d impots', 'declaration fiscale', 'fiscal',
      'fiduciaire', 'justificatifs', 'taxation',
    ],
  },
];

/** Suggestions affichées sous la barre de recherche. */
export const suggestions: { label: string; query: string }[] = [
  { label: 'Créer un site internet', query: 'Je veux créer un site pour mon entreprise' },
  { label: 'Refaire mon site', query: 'Mon site est ancien et je veux le refaire' },
  { label: 'Être visible sur Google', query: 'Je veux être mieux visible sur Google' },
  { label: 'Une démarche administrative', query: "J'ai besoin d'aide pour une démarche administrative" },
  { label: 'Rédiger un courrier', query: 'Je dois rédiger un courrier' },
  { label: 'Organiser mes documents', query: 'Je veux organiser mes documents' },
];
