import type { SubjectValue } from '@/lib/contact';

/**
 * Moteur d'orientation de la page d'accueil.
 *
 * Le visiteur décrit son besoin avec ses mots ; on reconnaît quelques
 * expressions pour l'orienter vers le bon univers. Ce n'est pas une analyse
 * automatique de sa situation, et le site ne le laisse jamais croire.
 *
 * POUR AJOUTER UNE INTENTION : copier un objet du tableau `intents` ci-dessous.
 * Rien d'autre à modifier, la page d'accueil se met à jour seule.
 *
 * Règle de reconnaissance : plus l'expression reconnue est longue, plus elle
 * pèse. « résilier mon assurance » l'emporte donc sur « résilier » seul.
 * Écrire les mots-clés en minuscules ; les accents sont ignorés
 * automatiquement, inutile de prévoir les deux orthographes.
 */

export type UniverseId = 'digital' | 'administration' | 'optimisation';

export type Universe = {
  id: UniverseId;
  nom: string;
  /** Phrase affichée sous le titre de l'univers sur la page d'accueil. */
  resume: string;
  /** Prestations listées, telles quelles. */
  prestations: string[];
  href: string;
  cta: string;
};

export const universes: Universe[] = [
  {
    id: 'digital',
    nom: 'Digital',
    resume:
      'Je conçois et développe votre site, de la première discussion jusqu’à la mise en ligne.',
    prestations: ['Sites web', 'Référencement', 'Automatisation', 'Refonte et améliorations'],
    href: '/sites-web',
    cta: 'Découvrir le digital',
  },
  {
    id: 'administration',
    nom: 'Administration',
    resume:
      'Je prends en charge les démarches et les courriers que vous n’avez ni le temps ni l’envie de gérer.',
    prestations: ['Démarches', 'Courriers', 'Organisation des documents', 'Accompagnement'],
    href: '/admin-optimisation',
    cta: 'Voir les services administratifs',
  },
  {
    id: 'optimisation',
    nom: 'Optimisation',
    resume:
      'Je reprends vos contrats un par un pour identifier ce qui mérite d’être vérifié ou ajusté.',
    prestations: ['Assurances', 'Logement', 'Contrats', 'Dépenses récurrentes'],
    href: '/admin-optimisation#assurances',
    cta: 'Découvrir l’optimisation',
  },
];

export type Intent = {
  id: string;
  universe: UniverseId;
  /** Titre affiché en réponse à la recherche. */
  titre: string;
  /** Ce que je peux faire. Toujours à la première personne, sans promesse de résultat. */
  reponse: string;
  /** Trois étapes courtes, affichées comme repères. */
  etapes: string[];
  /** Sujet pré-sélectionné dans le formulaire de contact. */
  sujet: SubjectValue;
  /** Page de service correspondante. */
  service: string;
  /** Expressions reconnues, en minuscules. Les accents sont ignorés. */
  motsCles: string[];
};

export const intents: Intent[] = [
  /* ---------------- Digital ---------------- */
  {
    id: 'creation-site',
    universe: 'digital',
    titre: 'Création de votre site internet',
    reponse:
      'Je peux concevoir et développer votre site de A à Z : structure des pages, design, développement, référencement et mise en ligne.',
    etapes: ['Analyse du besoin', 'Conception', 'Mise en ligne'],
    sujet: 'creer-site',
    service: '/sites-web',
    motsCles: [
      'creer un site', 'creation de site', 'creer mon site', 'nouveau site',
      'site internet', 'site web', 'site vitrine', 'faire un site',
      'besoin d un site', 'je veux un site', 'presence en ligne', 'page web',
      'site pour mon entreprise', 'site',
    ],
  },
  {
    id: 'refonte-site',
    universe: 'digital',
    titre: 'Refonte et amélioration de votre site',
    reponse:
      'Je regarde ce qui fonctionne sur votre site actuel, ce qui doit être repris, et je vous dis franchement si une refonte complète se justifie ou non.',
    etapes: ['État des lieux', 'Priorités', 'Reprise'],
    sujet: 'refaire-site',
    service: '/sites-web',
    motsCles: [
      'refonte', 'refaire mon site', 'refaire le site', 'moderniser mon site',
      'ameliorer mon site', 'mon site est vieux', 'site vieux', 'site ancien',
      'site obsolete', 'site pas responsive', 'pas bien sur telephone',
      'pas adapte au mobile', 'site lent', 'site trop lent', 'mon site ne marche pas',
      'site ne fonctionne pas', 'site depasse',
    ],
  },
  {
    id: 'boutique',
    universe: 'digital',
    titre: 'Boutique en ligne',
    reponse:
      'Vendre en ligne demande plus qu’un site vitrine : catalogue, paiement, commandes et suivi. Je peux construire cet ensemble et vous expliquer ce que cela implique au quotidien.',
    etapes: ['Cadrage', 'Développement', 'Accompagnement'],
    sujet: 'creer-site',
    service: '/sites-web',
    motsCles: [
      'e commerce', 'ecommerce', 'boutique en ligne', 'boutique',
      'vendre en ligne', 'vente en ligne', 'panier', 'paiement en ligne',
      'magasin en ligne',
    ],
  },
  {
    id: 'seo',
    universe: 'digital',
    titre: 'Référencement et visibilité',
    reponse:
      'Je travaille la structure technique et le contenu de vos pages pour que vos clients vous trouvent, en particulier sur les recherches locales du Nord vaudois.',
    etapes: ['Audit', 'Optimisation', 'Suivi'],
    sujet: 'seo',
    service: '/sites-web',
    motsCles: [
      'referencement', 'seo', 'visible sur google', 'etre visible', 'visibilite',
      'apparaitre sur google', 'remonter sur google', 'premiere page de google',
      'trouve sur google', 'position sur google', 'fiche google', 'google',
    ],
  },
  {
    id: 'automatisation',
    universe: 'digital',
    titre: 'Automatisation et intégrations',
    reponse:
      'Formulaires, prise de rendez-vous, connexion entre vos outils : je peux automatiser les tâches répétitives qui vous prennent du temps chaque semaine.',
    etapes: ['Repérage', 'Mise en place', 'Réglages'],
    sujet: 'creer-site',
    service: '/sites-web',
    motsCles: [
      'automatiser', 'automatisation', 'integration', 'connecter mes outils',
      'prise de rendez vous', 'reservation en ligne', 'espace client',
      'formulaire en ligne', 'gagner du temps',
    ],
  },

  /* ---------------- Administration ---------------- */
  {
    id: 'demenagement',
    universe: 'administration',
    titre: 'Déménagement et changement d’adresse',
    reponse:
      'Un déménagement déclenche une série d’annonces, souvent dans un ordre précis et avec des délais. Je peux établir votre liste personnalisée et préparer les courriers.',
    etapes: ['Liste personnalisée', 'Courriers', 'Suivi des délais'],
    sujet: 'administratif',
    service: '/admin-optimisation',
    motsCles: [
      'demenagement', 'demenager', 'je viens de demenager', 'changement d adresse',
      'changer d adresse', 'nouvelle adresse', 'qui dois je prevenir',
      'qui prevenir', 'controle des habitants', 'annonce de depart',
      'annonce d arrivee',
    ],
  },
  {
    id: 'courrier',
    universe: 'administration',
    titre: 'Rédaction de courriers',
    reponse:
      'Vous m’expliquez la situation avec vos mots, je rédige un courrier clair et adapté au destinataire. Vous le relisez, je l’ajuste si nécessaire.',
    etapes: ['Votre situation', 'Rédaction', 'Relecture'],
    sujet: 'courrier',
    service: '/admin-optimisation#courriers',
    motsCles: [
      'rediger un courrier', 'ecrire une lettre', 'rediger une lettre',
      'faire un courrier', 'besoin d un courrier', 'lettre type', 'modele de lettre',
      'reclamation', 'contester', 'contestation', 'mise en demeure',
      'demande de remboursement', 'courrier', 'lettre',
    ],
  },
  {
    id: 'demarche',
    universe: 'administration',
    titre: 'Accompagnement administratif',
    reponse:
      'Je vous aide à comprendre ce qui est demandé, à réunir les bons documents et à préparer le dossier. C’est un accompagnement administratif et organisationnel.',
    etapes: ['Y voir clair', 'Réunir les pièces', 'Préparer le dossier'],
    sujet: 'administratif',
    service: '/admin-optimisation',
    motsCles: [
      'demarche administrative', 'demarches administratives', 'aide administrative',
      'administratif', 'paperasse', 'je ne comprends pas le formulaire',
      'remplir un formulaire', 'dossier a preparer', 'classer mes papiers',
      'organiser mes documents', 'organiser mes papiers', 'mes papiers',
      'demarche',
    ],
  },
  {
    id: 'famille',
    universe: 'administration',
    titre: 'Famille et changement de situation',
    reponse:
      'Naissance, mariage, changement de situation : je prépare avec vous la liste des annonces à faire, dans l’ordre, pour ne rien oublier au moment où vous aurez le moins de temps.',
    etapes: ['Checklist', 'Annonces', 'Mises à jour'],
    sujet: 'administratif',
    service: '/admin-optimisation#famille',
    motsCles: [
      'naissance', 'je vais avoir un enfant', 'arrivee d un enfant', 'bebe',
      'mariage', 'je me marie', 'allocations familiales', 'allocation',
      'changement de situation', 'separation', 'conge paternite', 'conge maternite',
    ],
  },
  {
    id: 'impots',
    universe: 'administration',
    titre: 'Impôts et organisation',
    reponse:
      'Je vous aide à réunir les bons documents, à les classer et à préparer vos questions. Je ne suis ni fiscaliste ni fiduciaire : je prépare le travail, je ne le remplace pas.',
    etapes: ['Checklist', 'Mise en ordre', 'Dossier prêt'],
    sujet: 'impots',
    service: '/admin-optimisation#impots',
    motsCles: [
      'impots', 'impot', 'declaration d impots', 'declaration fiscale', 'fiscal',
      'fiduciaire', 'deductions', 'justificatifs', 'taxation',
    ],
  },

  /* ---------------- Optimisation ---------------- */
  {
    id: 'assurances',
    universe: 'optimisation',
    titre: 'Optimisation de vos assurances',
    reponse:
      'Je peux reprendre vos contrats un par un : garanties réellement couvertes, primes, franchises et doublons éventuels, puis vous dire ce qui mérite d’être vérifié. Je ne promets aucune économie avant d’avoir vu vos documents.',
    etapes: ['Analyse', 'Vérification', 'Accompagnement'],
    sujet: 'assurance',
    service: '/admin-optimisation#assurances',
    motsCles: [
      'assurance', 'assurances', 'mes assurances', 'caisse maladie', 'lamal',
      'complementaire', 'complementaires', 'franchise', 'prime', 'primes',
      'responsabilite civile', 'assurance menage', 'protection juridique',
      'assurance voyage', 'resilier mon assurance', 'resilier une assurance',
      'changer de caisse', 'je paye trop cher mes assurances',
      'trop cher mes assurances', 'assurance trop chere',
    ],
  },
  {
    id: 'logement',
    universe: 'optimisation',
    titre: 'Logement et loyer',
    reponse:
      'Je peux regarder votre bail et les avis reçus, identifier les points à vérifier et préparer la démarche. Je ne peux pas vous garantir qu’une baisse est fondée dans votre cas : cela dépend de votre contrat.',
    etapes: ['Lecture du bail', 'Points à vérifier', 'Courrier'],
    sujet: 'logement',
    service: '/admin-optimisation#logement',
    motsCles: [
      'loyer', 'mon loyer', 'baisse de loyer', 'augmentation de loyer',
      'hausse de loyer', 'verifier mon loyer', 'bail', 'mon bail', 'proprietaire',
      'gerance', 'regie', 'resilier mon bail', 'etat des lieux', 'appartement',
      'taux de reference',
    ],
  },
  {
    id: 'depenses',
    universe: 'optimisation',
    titre: 'Contrats et dépenses récurrentes',
    reponse:
      'Abonnements, télécoms, contrats oubliés : je fais le tour de vos dépenses fixes et je vous dis honnêtement s’il y a quelque chose à optimiser, ou si votre situation est déjà correcte.',
    etapes: ['Inventaire', 'Comparaison', 'Décision'],
    sujet: 'autre',
    service: '/admin-optimisation#autres-optimisations',
    motsCles: [
      'abonnement', 'abonnements', 'depenses', 'depenses fixes', 'mes contrats',
      'resilier un abonnement', 'trop de contrats', 'economiser', 'economies',
      'facture trop elevee', 'telecom', 'operateur', 'budget',
    ],
  },
];

/** Suggestions affichées sous la barre de recherche. */
export const suggestions: { label: string; query: string }[] = [
  { label: 'Créer un site', query: 'Je veux créer un site pour mon entreprise' },
  { label: 'Revoir mes assurances', query: 'Je pense payer trop cher mes assurances' },
  { label: 'Faire une démarche', query: 'J’ai besoin d’aide pour une démarche administrative' },
  { label: 'Vérifier mon loyer', query: 'Je veux vérifier mon loyer' },
  { label: 'Rédiger un courrier', query: 'Je dois rédiger un courrier' },
];
