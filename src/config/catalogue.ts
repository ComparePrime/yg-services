/**
 * Catalogue des prestations administratives.
 *
 * Source unique du catalogue : catégories, prestations, prix, options,
 * délais et conditions. Les pages se construisent à partir de ce fichier.
 *
 * POUR AJOUTER UNE PRESTATION : copier un objet du tableau `prestations`.
 * Le slug doit être unique, il sert d'adresse de page.
 *
 * RÈGLES DE RÉDACTION
 * - Toutes les prestations sont de l'assistance administrative et
 *   documentaire. Aucune ne constitue un conseil juridique, fiscal ou en
 *   assurance, ni une représentation devant une autorité.
 * - Aucun résultat n'est garanti : ni l'obtention d'un subside, ni une
 *   baisse de loyer, ni l'acceptation d'un dossier.
 * - `exclus` est aussi important que `inclus` : ce qui n'est pas couvert
 *   doit être lisible avant l'achat.
 */

export type Audience = 'particuliers' | 'independants' | 'tous';

export type Option = {
  id: string;
  label: string;
  /** Supplément en CHF. */
  price: number;
  description: string;
};

export type Categorie = {
  slug: string;
  nom: string;
  /** Titre court pour la navigation et les fils d'Ariane. */
  nomCourt: string;
  intro: string;
  /** Mot-clé principal visé par la page de catégorie. */
  motCle: string;
  audience: Audience;
};

export type Prestation = {
  slug: string;
  categorie: string;
  titre: string;
  /** Titre pour la balise `title`, lorsque `titre` est trop long une fois
   *  le suffixe de marque ajouté. Limite utile : 46 caractères. */
  titreSeo?: string;
  /** Une phrase, affichée sur la carte du catalogue. */
  accroche: string;
  /** Deux à trois phrases, en tête de la fiche détaillée. */
  description: string;
  /** Prix en CHF. `null` signifie « sur devis ». */
  prix: number | null;
  /** `true` affiche « dès CHF … » : le prix final dépend du dossier. */
  aPartirDe?: boolean;
  /** Facturation récurrente, le cas échéant. */
  recurrence?: 'mensuel';
  /** Délai indicatif, à compter de la réception du dossier complet. */
  delai: string;
  audience: Audience;
  pourQui: string;
  inclus: string[];
  exclus: string[];
  documents: string[];
  options?: string[];
  /** Mention de cadre, affichée en évidence sur la fiche. */
  cadre?: string;
  /** Prestations liées, par slug. Sert au maillage interne. */
  voirAussi?: string[];
  miseEnAvant?: boolean;
};

/* ------------------------------------------------------------------
   Catégories
------------------------------------------------------------------- */

export const categories: Categorie[] = [
  {
    slug: 'impots',
    nom: 'Fiscalité et déclarations d’impôts',
    nomCourt: 'Impôts',
    intro:
      'Votre déclaration remplie à partir des documents que vous transmettez, avec la liste précise des pièces à réunir et un contrôle de cohérence avant envoi.',
    motCle: 'aide déclaration impôts suisse',
    audience: 'tous',
  },
  {
    slug: 'logement',
    nom: 'Logement et démarches locatives',
    nomCourt: 'Logement',
    intro:
      'Baisse de loyer, contestation de charges, défauts, résiliation, restitution de garantie : vos courriers préparés et vos pièces organisées.',
    motCle: 'aide démarches locatives suisse',
    audience: 'particuliers',
  },
  {
    slug: 'subsides',
    nom: 'Subsides et aides administratives',
    nomCourt: 'Subsides',
    intro:
      'Les dossiers d’aide demandent des pièces précises, dans un ordre précis. Un dossier incomplet revient, et le délai repart à zéro.',
    motCle: 'demande subside assurance maladie dossier',
    audience: 'particuliers',
  },
  {
    slug: 'demarches',
    nom: 'Démarches administratives du quotidien',
    nomCourt: 'Démarches',
    intro:
      'Changement d’adresse, résiliations, formulaires, dossiers : les démarches qui traînent parce qu’elles prennent du temps, pas parce qu’elles sont difficiles.',
    motCle: 'aide démarches administratives suisse',
    audience: 'particuliers',
  },
  {
    slug: 'comptabilite',
    nom: 'Comptabilité et gestion administrative',
    nomCourt: 'Comptabilité',
    intro:
      'Classement, saisie et tableaux de suivi pour garder une activité en ordre et transmettre un dossier propre à votre fiduciaire.',
    motCle: 'aide administrative indépendant suisse',
    audience: 'tous',
  },
  {
    slug: 'documents',
    nom: 'Documents, courriers et rédaction',
    nomCourt: 'Documents',
    intro:
      'Vous savez ce que vous voulez dire. Vos courriers, CV et documents professionnels rédigés et mis en forme.',
    motCle: 'rédaction courrier administratif suisse',
    audience: 'tous',
  },
];

/* ------------------------------------------------------------------
   Options proposées sur les déclarations d'impôts
------------------------------------------------------------------- */

export const options: Option[] = [
  {
    id: 'titres',
    label: 'Portefeuille de titres',
    price: 30,
    description:
      'Relevé fiscal de vos titres repris et reporté dans l’état des titres de la déclaration.',
  },
  {
    id: 'immobilier',
    label: 'Bien immobilier',
    price: 50,
    description:
      'Valeur locative, intérêts hypothécaires et frais d’entretien repris à partir de vos documents.',
  },
  {
    id: 'complexe',
    label: 'Documents supplémentaires',
    price: 25,
    description:
      'Volume de pièces inhabituel, ou situation demandant un traitement plus long que prévu.',
  },
  {
    id: 'prioritaire',
    label: 'Traitement prioritaire',
    price: 30,
    description: 'Votre dossier passe en tête de file, hors période de forte affluence.',
  },
  {
    id: 'etranger',
    label: 'Revenus étrangers, situation simple',
    price: 40,
    description:
      'Uniquement pour une situation transfrontalière simple. Au-delà, un devis préalable est établi.',
  },
];

/* ------------------------------------------------------------------
   Mentions de cadre réutilisées
------------------------------------------------------------------- */

const CADRE_FISCAL =
  'YG Services remplit votre déclaration à partir des documents que vous fournissez et vérifie leur cohérence. Il ne s’agit ni d’un conseil fiscal, ni d’une optimisation fiscale, ni d’une représentation devant l’administration. Vous restez responsable de l’exactitude des informations transmises et signez vous-même votre déclaration.';

const CADRE_JURIDIQUE =
  'YG Services prépare votre dossier et rédige vos courriers. Il ne s’agit pas d’un conseil juridique et aucun résultat n’est garanti : l’issue dépend de votre contrat, de votre situation et de la décision du destinataire.';

const CADRE_AIDE =
  'YG Services constitue et vérifie votre dossier. L’octroi d’une aide, d’un subside ou d’une allocation relève exclusivement de l’autorité compétente et ne peut être garanti.';

const CADRE_SIGNATURE =
  'Les démarches qui exigent votre identification ou votre signature restent à effectuer par vous. YG Services prépare les documents, les courriers et la marche à suivre.';

const CADRE_COMPTA =
  'YG Services réalise la saisie et le classement à partir de vos pièces. Il ne s’agit ni d’une révision, ni d’un bouclement, ni d’un conseil fiscal : le dossier est préparé pour être remis à votre fiduciaire ou à votre comptable.';

/* ------------------------------------------------------------------
   Prestations
------------------------------------------------------------------- */

export const prestations: Prestation[] = [
  /* ============ Impôts ============ */
  {
    slug: 'declaration-impots-etudiant',
    categorie: 'impots',
    titre: 'Déclaration d’impôts — étudiant ou jeune adulte',
    accroche: 'Votre première déclaration, remplie à partir de vos documents.',
    description:
      'Pour une première déclaration ou une situation simple : un revenu, pas de bien immobilier, pas de titres. Vous transmettez vos documents, votre déclaration vous revient complétée et prête à être signée.',
    prix: 59,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Étudiants, apprentis et jeunes adultes déposant une première déclaration.',
    inclus: [
      'Liste personnalisée des documents à réunir',
      'Remplissage complet de la déclaration',
      'Contrôle de cohérence avant transmission',
      'Déclaration prête à signer et à envoyer',
    ],
    exclus: [
      'Conseil fiscal et optimisation',
      'Représentation devant l’administration fiscale',
      'Réclamation contre une décision de taxation',
      'Situations avec titres, immobilier ou revenus étrangers',
    ],
    documents: [
      'Certificat de salaire ou attestation de bourse',
      'Attestation de l’assurance maladie',
      'Relevés bancaires au 31 décembre',
      'Attestation de frais de formation, le cas échéant',
    ],
    options: ['complexe', 'prioritaire'],
    cadre: CADRE_FISCAL,
    voirAussi: ['declaration-impots-personne-seule-simple', 'prolongation-delai-fiscal'],
    miseEnAvant: true,
  },
  {
    slug: 'declaration-impots-personne-seule-simple',
    categorie: 'impots',
    titre: 'Déclaration d’impôts — personne seule, situation simple',
    titreSeo: 'Déclaration d’impôts, personne seule',
    accroche: 'Un salaire, pas de complication : votre déclaration remplie et vérifiée.',
    description:
      'Pour une personne seule avec un revenu salarié et une situation sans particularité. Les déductions courantes sont reprises à partir de vos justificatifs.',
    prix: 89,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Personnes seules, salariées, sans bien immobilier ni portefeuille de titres.',
    inclus: [
      'Liste personnalisée des documents à réunir',
      'Remplissage complet de la déclaration',
      'Reprise des déductions courantes sur justificatifs',
      'Contrôle de cohérence avant transmission',
    ],
    exclus: [
      'Conseil fiscal et optimisation',
      'Réclamation contre une décision de taxation',
      'Revenus indépendants',
    ],
    documents: [
      'Certificat de salaire',
      'Attestation de l’assurance maladie et frais médicaux',
      'Relevés bancaires au 31 décembre',
      'Attestations de 3e pilier, dons et frais professionnels',
    ],
    options: ['titres', 'immobilier', 'complexe', 'prioritaire', 'etranger'],
    cadre: CADRE_FISCAL,
    voirAussi: ['declaration-impots-personne-seule-standard', 'verification-declaration'],
    miseEnAvant: true,
  },
  {
    slug: 'declaration-impots-personne-seule-standard',
    categorie: 'impots',
    titre: 'Déclaration d’impôts — personne seule, situation standard',
    titreSeo: 'Déclaration d’impôts, situation standard',
    accroche: 'Plusieurs employeurs, déductions multiples ou pilier 3a : tout est repris.',
    description:
      'Pour une personne seule dont la situation comporte plusieurs éléments : changement d’emploi, revenus accessoires, déductions multiples ou prévoyance.',
    prix: 129,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui:
      'Personnes seules avec plusieurs employeurs, revenus accessoires ou déductions nombreuses.',
    inclus: [
      'Liste personnalisée des documents à réunir',
      'Remplissage complet de la déclaration',
      'Reprise de l’ensemble des déductions justifiées',
      'Contrôle de cohérence et relecture',
    ],
    exclus: ['Conseil fiscal et optimisation', 'Revenus indépendants', 'Réclamation après taxation'],
    documents: [
      'Certificats de salaire de tous les employeurs',
      'Attestations de prévoyance 3a et rachats',
      'Attestation d’assurance maladie et frais médicaux',
      'Relevés bancaires au 31 décembre',
    ],
    options: ['titres', 'immobilier', 'complexe', 'prioritaire', 'etranger'],
    cadre: CADRE_FISCAL,
    voirAussi: ['declaration-impots-personne-seule-simple', 'declaration-impots-complexe'],
  },
  {
    slug: 'declaration-impots-couple',
    categorie: 'impots',
    titre: 'Déclaration d’impôts — couple sans enfant',
    accroche: 'Une déclaration commune, deux situations reprises ensemble.',
    description:
      'Pour un couple marié ou en partenariat enregistré, sans enfant à charge. Les revenus et déductions des deux conjoints sont repris dans une déclaration commune.',
    prix: 159,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Couples mariés ou en partenariat enregistré, sans enfant à charge.',
    inclus: [
      'Liste personnalisée des documents pour les deux conjoints',
      'Remplissage complet de la déclaration commune',
      'Reprise des déductions des deux conjoints',
      'Contrôle de cohérence et relecture',
    ],
    exclus: ['Conseil fiscal et optimisation', 'Revenus indépendants', 'Réclamation après taxation'],
    documents: [
      'Certificats de salaire des deux conjoints',
      'Attestations de prévoyance 3a',
      'Attestations d’assurance maladie et frais médicaux',
      'Relevés bancaires au 31 décembre',
    ],
    options: ['titres', 'immobilier', 'complexe', 'prioritaire', 'etranger'],
    cadre: CADRE_FISCAL,
    voirAussi: ['declaration-impots-couple-enfants', 'declaration-impots-complexe'],
  },
  {
    slug: 'declaration-impots-couple-enfants',
    categorie: 'impots',
    titre: 'Déclaration d’impôts — couple avec enfants',
    accroche: 'Déductions pour enfants, frais de garde et assurances reprises.',
    description:
      'Pour un couple avec un ou plusieurs enfants à charge. Les déductions liées aux enfants et aux frais de garde sont reprises à partir de vos justificatifs.',
    prix: 189,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Couples avec enfants à charge, salariés.',
    inclus: [
      'Liste personnalisée des documents pour le foyer',
      'Remplissage complet de la déclaration commune',
      'Reprise des déductions pour enfants et frais de garde',
      'Contrôle de cohérence et relecture',
    ],
    exclus: ['Conseil fiscal et optimisation', 'Revenus indépendants', 'Réclamation après taxation'],
    documents: [
      'Certificats de salaire des deux conjoints',
      'Attestations de frais de garde',
      'Attestations d’allocations familiales',
      'Attestations d’assurance maladie et frais médicaux',
      'Relevés bancaires au 31 décembre',
    ],
    options: ['titres', 'immobilier', 'complexe', 'prioritaire', 'etranger'],
    cadre: CADRE_FISCAL,
    voirAussi: ['declaration-impots-couple', 'allocation-familiale'],
    miseEnAvant: true,
  },
  {
    slug: 'declaration-impots-retraite',
    categorie: 'impots',
    titre: 'Déclaration d’impôts — retraité',
    accroche: 'Rentes AVS, deuxième pilier et frais médicaux repris correctement.',
    description:
      'Pour une personne ou un couple à la retraite. Les rentes, prestations de prévoyance et frais médicaux sont repris à partir de vos attestations.',
    prix: 129,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Personnes retraitées, seules ou en couple.',
    inclus: [
      'Liste personnalisée des documents à réunir',
      'Reprise des rentes AVS et de prévoyance',
      'Reprise des frais médicaux sur justificatifs',
      'Contrôle de cohérence avant transmission',
    ],
    exclus: ['Conseil fiscal et optimisation', 'Planification de retraits de capital', 'Réclamation après taxation'],
    documents: [
      'Attestations de rentes AVS et deuxième pilier',
      'Justificatifs de frais médicaux',
      'Relevés bancaires au 31 décembre',
      'Attestation d’assurance maladie',
    ],
    options: ['titres', 'immobilier', 'complexe', 'prioritaire'],
    cadre: CADRE_FISCAL,
    voirAussi: ['declaration-impots-personne-seule-standard', 'subside-assurance-maladie'],
  },
  {
    slug: 'declaration-impots-complexe',
    categorie: 'impots',
    titre: 'Déclaration d’impôts — situation familiale ou fiscale complexe',
    titreSeo: 'Déclaration d’impôts, situation complexe',
    accroche: 'Séparation, succession, biens multiples : un devis après examen du dossier.',
    description:
      'Pour les situations qui sortent des cas standard. Le dossier est d’abord examiné, puis un montant ferme vous est communiqué avant tout engagement.',
    prix: 249,
    aPartirDe: true,
    delai: 'Communiqué après examen du dossier',
    audience: 'particuliers',
    pourQui:
      'Séparation ou divorce en cours, succession, biens immobiliers multiples, situation transfrontalière.',
    inclus: [
      'Examen préalable de votre situation',
      'Devis ferme avant tout engagement',
      'Liste personnalisée des documents',
      'Remplissage complet et contrôle de cohérence',
    ],
    exclus: [
      'Conseil fiscal et optimisation',
      'Représentation devant l’administration',
      'Situations relevant d’un mandat de fiduciaire ou d’avocat',
    ],
    documents: ['Les documents utiles sont listés après l’examen de votre situation'],
    options: ['prioritaire'],
    cadre:
      CADRE_FISCAL +
      ' Si votre situation dépasse le cadre d’une assistance administrative, cela vous est dit avant tout engagement et vous êtes orienté vers un professionnel agréé.',
    voirAussi: ['declaration-impots-couple-enfants', 'prolongation-delai-fiscal'],
  },
  {
    slug: 'declaration-impots-independant',
    categorie: 'impots',
    titre: 'Déclaration d’impôts — indépendant avec comptabilité simple',
    titreSeo: 'Déclaration d’impôts pour indépendant',
    accroche: 'Pour une activité indépendante dont la comptabilité est déjà tenue.',
    description:
      'Pour un indépendant dont les comptes sont déjà établis et à jour. La déclaration est remplie à partir de vos états financiers : il ne s’agit pas d’un bouclement.',
    prix: 349,
    aPartirDe: true,
    delai: 'Communiqué après examen du dossier',
    audience: 'independants',
    pourQui:
      'Indépendants en raison individuelle dont la comptabilité est tenue et les comptes bouclés.',
    inclus: [
      'Examen préalable et devis ferme',
      'Reprise de vos états financiers dans la déclaration',
      'Remplissage de la déclaration privée et du questionnaire',
      'Contrôle de cohérence avant transmission',
    ],
    exclus: [
      'Bouclement et établissement des comptes',
      'Révision comptable',
      'Conseil fiscal et optimisation',
      'Décompte TVA',
    ],
    documents: [
      'Comptes de l’exercice, bilan et compte de résultat',
      'Relevés bancaires professionnels',
      'Documents de la déclaration privée',
    ],
    options: ['prioritaire', 'immobilier'],
    cadre:
      CADRE_FISCAL +
      ' Si vos comptes ne sont pas établis, la prestation de saisie comptable doit être commandée au préalable.',
    voirAussi: ['saisie-comptable-50', 'dossier-fiduciaire'],
  },
  {
    slug: 'prolongation-delai-fiscal',
    categorie: 'impots',
    titre: 'Demande de prolongation du délai fiscal',
    accroche: 'La demande préparée et prête à être déposée avant l’échéance.',
    description:
      'Votre demande de prolongation préparée selon les modalités de votre canton, avec la marche à suivre pour la déposer dans les délais.',
    prix: 25,
    delai: '2 jours ouvrables',
    audience: 'tous',
    pourQui: 'Toute personne devant repousser l’échéance de dépôt de sa déclaration.',
    inclus: [
      'Vérification des modalités applicables dans votre canton',
      'Préparation de la demande',
      'Marche à suivre pour le dépôt',
    ],
    exclus: [
      'Dépôt de la demande à votre place lorsqu’une identification personnelle est requise',
      'Garantie d’acceptation de la prolongation',
      'Prise en charge des émoluments cantonaux éventuels',
    ],
    documents: ['Copie du courrier de l’administration fiscale ou numéro de contribuable'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['declaration-impots-personne-seule-simple'],
  },
  {
    slug: 'verification-declaration',
    categorie: 'impots',
    titre: 'Vérification administrative d’une déclaration déjà remplie',
    titreSeo: 'Vérification de déclaration d’impôts',
    accroche: 'Un second regard sur votre déclaration avant de l’envoyer.',
    description:
      'Vous avez rempli votre déclaration et souhaitez une relecture avant de l’envoyer. Les champs sont contrôlés et les incohérences ou oublis apparents vous sont signalés.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Personnes ayant rempli leur déclaration et souhaitant une relecture.',
    inclus: [
      'Contrôle de cohérence des rubriques remplies',
      'Signalement des oublis et incohérences apparents',
      'Liste des justificatifs manquants',
      'Remarques écrites',
    ],
    exclus: [
      'Certification ou audit fiscal',
      'Garantie d’exactitude ou d’absence d’erreur',
      'Conseil fiscal et optimisation',
      'Modification de la déclaration à votre place',
    ],
    documents: ['Votre déclaration remplie', 'Les justificatifs correspondants'],
    cadre:
      'Cette prestation est une relecture administrative. Elle ne constitue ni une certification, ni un audit, et n’engage pas la responsabilité de YG Services sur le contenu de votre déclaration.',
    voirAussi: ['declaration-impots-personne-seule-standard'],
  },

  /* ============ Logement ============ */
  {
    slug: 'demande-baisse-loyer',
    categorie: 'logement',
    titre: 'Demande de baisse de loyer',
    accroche: 'Votre demande préparée et le courrier prêt à être envoyé.',
    description:
      'Les informations que vous transmettez sont reprises pour préparer une demande personnalisée à votre bailleur, avec un courrier prêt à envoyer et la marche à suivre.',
    prix: 59,
    delai: '3 à 5 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Locataires souhaitant demander une diminution de leur loyer.',
    inclus: [
      'Reprise des informations et documents transmis',
      'Préparation d’une demande personnalisée',
      'Courrier prêt à être envoyé',
      'Marche à suivre et échéance à respecter',
    ],
    exclus: [
      'Garantie d’obtention d’une baisse',
      'Conseil juridique et représentation',
      'Procédure devant l’autorité de conciliation',
      'Envoi du courrier à votre place',
    ],
    documents: [
      'Contrat de bail',
      'Dernier avis de fixation ou de modification de loyer',
      'Décompte de charges récent',
    ],
    cadre: CADRE_JURIDIQUE,
    voirAussi: ['demande-baisse-loyer-approfondie', 'analyse-documents-bail'],
    miseEnAvant: true,
  },
  {
    slug: 'demande-baisse-loyer-approfondie',
    categorie: 'logement',
    titre: 'Demande de baisse de loyer avec analyse documentaire',
    titreSeo: 'Baisse de loyer, analyse approfondie',
    accroche: 'Vos documents repris un par un avant la préparation du courrier.',
    description:
      'La version approfondie : vos documents sont repris dans le détail, les informations recoupées et les pièces justificatives organisées avant la rédaction de la demande.',
    prix: 89,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui:
      'Locataires dont le bail a plusieurs avenants, ou dont l’historique de loyer est difficile à reconstituer.',
    inclus: [
      'Analyse administrative de l’ensemble des documents transmis',
      'Recoupement des informations et de l’historique du loyer',
      'Organisation des pièces justificatives',
      'Courrier personnalisé prêt à être envoyé',
    ],
    exclus: [
      'Garantie d’obtention d’une baisse',
      'Conseil juridique et représentation',
      'Procédure devant l’autorité de conciliation',
    ],
    documents: [
      'Contrat de bail et avenants',
      'Tous les avis de fixation ou de modification de loyer reçus',
      'Décomptes de charges',
    ],
    cadre: CADRE_JURIDIQUE,
    voirAussi: ['demande-baisse-loyer', 'pack-locataire'],
  },
  {
    slug: 'contestation-charges',
    categorie: 'logement',
    titre: 'Lettre de contestation de charges',
    accroche: 'Votre décompte repris et la contestation rédigée.',
    description:
      'Votre décompte de charges est repris poste par poste et les points à contester sont formulés dans un courrier adressé à votre gérance.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Locataires dont le décompte de charges paraît incohérent ou insuffisamment détaillé.',
    inclus: [
      'Lecture du décompte poste par poste',
      'Formulation des points à contester',
      'Courrier prêt à être envoyé',
      'Rappel du délai de contestation applicable',
    ],
    exclus: ['Garantie de remboursement', 'Conseil juridique', 'Expertise comptable du décompte'],
    documents: ['Décompte de charges contesté', 'Contrat de bail', 'Décomptes des années précédentes si disponibles'],
    cadre: CADRE_JURIDIQUE,
    voirAussi: ['lettre-au-bailleur', 'analyse-documents-bail'],
  },
  {
    slug: 'lettre-au-bailleur',
    categorie: 'logement',
    titre: 'Lettre au bailleur ou à la gérance',
    accroche: 'Votre demande formulée clairement, dans les formes attendues.',
    description:
      'Vous expliquez la situation, le courrier est rédigé dans les formes attendues par une gérance et vous revient prêt à être envoyé.',
    prix: 39,
    delai: '2 à 3 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Locataires ayant une demande à formuler auprès de leur bailleur ou de leur gérance.',
    inclus: [
      'Reprise de votre situation',
      'Rédaction du courrier',
      'Un aller-retour de correction inclus',
      'Courrier prêt à être envoyé',
    ],
    exclus: ['Garantie de réponse ou d’issue favorable', 'Conseil juridique', 'Envoi à votre place'],
    documents: ['Contrat de bail', 'Tout courrier reçu en lien avec la demande'],
    cadre: CADRE_JURIDIQUE,
    voirAussi: ['demande-reparation', 'lettre-personnalisee'],
  },
  {
    slug: 'demande-reparation',
    categorie: 'logement',
    titre: 'Demande de réparation ou signalement d’un défaut',
    accroche: 'Le défaut signalé dans les formes, avec la date qui fait foi.',
    description:
      'Un défaut doit être signalé par écrit pour être opposable. Le courrier est rédigé avec la description du défaut et la demande de remise en état.',
    prix: 39,
    delai: '2 à 3 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Locataires constatant un défaut dans leur logement.',
    inclus: [
      'Description écrite du défaut',
      'Rédaction de la demande de remise en état',
      'Rappel de la forme d’envoi recommandée',
      'Courrier prêt à être envoyé',
    ],
    exclus: ['Garantie d’intervention du bailleur', 'Conseil juridique', 'Expertise technique du défaut'],
    documents: ['Contrat de bail', 'Photographies du défaut', 'Échanges déjà intervenus'],
    cadre: CADRE_JURIDIQUE,
    voirAussi: ['dossier-defaut-logement', 'lettre-au-bailleur'],
  },
  {
    slug: 'dossier-defaut-logement',
    categorie: 'logement',
    titre: 'Dossier de défaut dans le logement',
    accroche: 'Chronologie, pièces et courriers réunis en un dossier complet.',
    description:
      'Lorsqu’un défaut traîne, c’est le dossier qui compte. Chronologie des faits, pièces organisées et courriers réunis en un ensemble cohérent.',
    prix: 69,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Locataires dont le défaut signalé n’a pas été traité et dont le dossier s’étale dans le temps.',
    inclus: [
      'Chronologie écrite des faits et des échanges',
      'Organisation des pièces et photographies',
      'Courrier de relance ou de mise en demeure',
      'Dossier prêt à être transmis',
    ],
    exclus: [
      'Conseil juridique et représentation',
      'Procédure devant l’autorité de conciliation',
      'Garantie de résultat',
    ],
    documents: ['Contrat de bail', 'Tous les échanges avec la gérance', 'Photographies datées'],
    cadre: CADRE_JURIDIQUE,
    voirAussi: ['demande-reparation', 'pack-locataire'],
  },
  {
    slug: 'resiliation-bail',
    categorie: 'logement',
    titre: 'Assistance administrative à la résiliation de bail',
    accroche: 'Résiliation rédigée, délais vérifiés, forme respectée.',
    description:
      'Une résiliation hors délai ou mal adressée ne produit pas d’effet. Les échéances de votre bail sont vérifiées et le courrier rédigé dans les formes.',
    prix: 39,
    delai: '2 à 3 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Locataires souhaitant résilier leur bail.',
    inclus: [
      'Vérification de l’échéance et du délai figurant au bail',
      'Rédaction de la lettre de résiliation',
      'Rappel de la forme d’envoi et des signatures requises',
      'Courrier prêt à être envoyé',
    ],
    exclus: [
      'Garantie d’acceptation d’une résiliation anticipée',
      'Recherche d’un locataire de remplacement',
      'Conseil juridique',
    ],
    documents: ['Contrat de bail et avenants'],
    cadre: CADRE_JURIDIQUE,
    voirAussi: ['dossier-demenagement-logement', 'restitution-garantie'],
  },
  {
    slug: 'dossier-demenagement-logement',
    categorie: 'logement',
    titre: 'Préparation d’un dossier de déménagement',
    accroche: 'Les démarches liées au logement réunies et ordonnées.',
    description:
      'Résiliation, état des lieux, relevés de compteurs, remise des clés : les démarches liées au logement réunies dans un dossier ordonné, avec les échéances.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Locataires en cours de déménagement.',
    inclus: [
      'Liste des démarches liées au logement, dans l’ordre',
      'Calendrier des échéances à respecter',
      'Préparation des courriers nécessaires',
      'Checklist de l’état des lieux de sortie',
    ],
    exclus: [
      'Démarches auprès des organismes hors logement',
      'Organisation matérielle du déménagement',
      'Présence à l’état des lieux',
    ],
    documents: ['Contrat de bail', 'Date de sortie prévue', 'Courriers déjà échangés avec la gérance'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['pack-demenagement', 'resiliation-bail'],
  },
  {
    slug: 'analyse-documents-bail',
    categorie: 'logement',
    titre: 'Analyse administrative des documents du bail',
    accroche: 'Ce que dit votre bail, expliqué en français clair.',
    description:
      'Votre bail et ses avenants sont repris et expliqués : échéances, délais, clauses particulières et points à vérifier, dans un document écrit.',
    prix: 59,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Locataires souhaitant comprendre leur contrat avant d’agir.',
    inclus: [
      'Lecture du bail et des avenants',
      'Explication écrite des échéances et délais',
      'Signalement des points méritant vérification',
      'Historique du loyer reconstitué à partir des avis reçus',
    ],
    exclus: [
      'Interprétation juridique des clauses',
      'Avis sur la validité d’une clause',
      'Conseil juridique',
    ],
    documents: ['Contrat de bail et avenants', 'Avis de fixation ou de modification de loyer'],
    cadre: CADRE_JURIDIQUE,
    voirAussi: ['demande-baisse-loyer-approfondie', 'contestation-charges'],
  },
  {
    slug: 'restitution-garantie',
    categorie: 'logement',
    titre: 'Demande de restitution de garantie de loyer',
    accroche: 'Votre garantie réclamée dans les formes, avec les pièces nécessaires.',
    description:
      'La garantie de loyer ne se libère pas seule. La demande est préparée avec les pièces nécessaires et adressée aux bonnes parties.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Anciens locataires dont la garantie n’a pas été libérée.',
    inclus: [
      'Préparation de la demande de libération',
      'Organisation des pièces justificatives',
      'Courrier au bailleur et, le cas échéant, à l’établissement dépositaire',
      'Rappel des délais applicables',
    ],
    exclus: ['Garantie de restitution', 'Conseil juridique', 'Procédure judiciaire'],
    documents: [
      'Contrat de bail',
      'Procès-verbal de l’état des lieux de sortie',
      'Attestation de garantie de loyer',
    ],
    cadre: CADRE_JURIDIQUE,
    voirAussi: ['resiliation-bail', 'dossier-demenagement-logement'],
  },

  /* ============ Subsides ============ */
  {
    slug: 'subside-assurance-maladie',
    categorie: 'subsides',
    titre: 'Dossier de demande de subside d’assurance maladie',
    accroche: 'Votre dossier de subside constitué et vérifié avant dépôt.',
    description:
      'Le dossier est constitué à partir des pièces que vous transmettez, selon les exigences de votre canton, et vérifié avant que vous le déposiez.',
    prix: 59,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Personnes et familles souhaitant demander un subside à l’assurance maladie.',
    inclus: [
      'Liste personnalisée des pièces exigées dans votre canton',
      'Constitution du dossier',
      'Remplissage du formulaire de demande',
      'Vérification avant dépôt',
    ],
    exclus: [
      'Garantie d’octroi du subside',
      'Dépôt du dossier lorsqu’une identification personnelle est requise',
      'Recours contre une décision de refus',
    ],
    documents: [
      'Dernière décision de taxation ou déclaration d’impôts',
      'Attestation d’assurance maladie',
      'Justificatifs de revenus du ménage',
      'Attestation de domicile',
    ],
    cadre: CADRE_AIDE,
    voirAussi: ['subside-complet', 'mise-a-jour-subside'],
    miseEnAvant: true,
  },
  {
    slug: 'subside-complet',
    categorie: 'subsides',
    titre: 'Dossier de subside complet avec vérification approfondie',
    titreSeo: 'Dossier de subside complet',
    accroche: 'Chaque pièce contrôlée avant dépôt, pour éviter un dossier qui revient.',
    description:
      'La version complète : chaque pièce est contrôlée, les manques signalés et les justificatifs organisés. Un dossier incomplet revient, et le délai repart à zéro.',
    prix: 89,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui:
      'Ménages dont la situation comporte plusieurs sources de revenus ou un changement récent.',
    inclus: [
      'Liste personnalisée des documents',
      'Vérification pièce par pièce des documents transmis',
      'Organisation des justificatifs',
      'Assistance au remplissage du formulaire',
      'Contrôle administratif final avant transmission',
    ],
    exclus: [
      'Garantie d’octroi du subside',
      'Dépôt du dossier lorsqu’une identification personnelle est requise',
      'Recours contre une décision',
    ],
    documents: [
      'Dernière décision de taxation ou déclaration d’impôts',
      'Attestations d’assurance maladie du ménage',
      'Justificatifs de l’ensemble des revenus',
      'Attestation de domicile et composition du ménage',
    ],
    cadre: CADRE_AIDE,
    voirAussi: ['subside-assurance-maladie', 'pack-subside'],
    miseEnAvant: true,
  },
  {
    slug: 'mise-a-jour-subside',
    categorie: 'subsides',
    titre: 'Mise à jour d’un dossier de subside',
    accroche: 'Un changement de situation annoncé dans les formes.',
    description:
      'Un changement de revenu, d’adresse ou de composition du ménage doit être annoncé. La mise à jour est préparée avec les pièces correspondantes.',
    prix: 39,
    delai: '3 à 5 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Bénéficiaires d’un subside dont la situation a changé.',
    inclus: [
      'Identification des pièces à fournir',
      'Préparation de l’annonce de changement',
      'Organisation des justificatifs',
    ],
    exclus: ['Garantie de maintien du subside', 'Recours contre une décision', 'Dépôt à votre place'],
    documents: ['Décision de subside en cours', 'Justificatifs du changement de situation'],
    cadre: CADRE_AIDE,
    voirAussi: ['subside-assurance-maladie'],
  },
  {
    slug: 'demande-aide-financiere',
    categorie: 'subsides',
    titre: 'Assistance à une demande d’aide financière',
    accroche: 'Votre demande constituée et documentée.',
    description:
      'Votre demande est constituée selon les exigences de l’organisme concerné, avec les justificatifs organisés et un exposé écrit de votre situation.',
    prix: 59,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Personnes sollicitant une aide financière auprès d’un organisme ou d’une fondation.',
    inclus: [
      'Identification des pièces exigées',
      'Exposé écrit de votre situation',
      'Organisation des justificatifs',
      'Dossier prêt à être déposé',
    ],
    exclus: [
      'Garantie d’octroi de l’aide',
      'Recherche exhaustive des organismes susceptibles d’aider',
      'Conseil juridique ou social',
    ],
    documents: ['Justificatifs de revenus et de charges', 'Courriers reçus en lien avec la demande'],
    cadre: CADRE_AIDE,
    voirAussi: ['dossier-administratif-social', 'subside-assurance-maladie'],
  },
  {
    slug: 'dossier-administratif-social',
    categorie: 'subsides',
    titre: 'Constitution d’un dossier administratif social',
    accroche: 'Un dossier complet et ordonné, prêt à être présenté.',
    description:
      'Les dossiers sociaux demandent beaucoup de pièces. L’ensemble est réuni, ordonné et accompagné d’un récapitulatif écrit de votre situation.',
    prix: 79,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Personnes devant constituer un dossier auprès d’un service social.',
    inclus: [
      'Liste personnalisée des pièces',
      'Récapitulatif écrit de la situation',
      'Organisation et classement du dossier',
      'Vérification des pièces manquantes',
    ],
    exclus: [
      'Accompagnement social ou psychologique',
      'Représentation auprès du service',
      'Garantie d’octroi d’une prestation',
    ],
    documents: ['Justificatifs de revenus, de charges et de logement', 'Courriers reçus'],
    cadre: CADRE_AIDE,
    voirAussi: ['demande-aide-financiere', 'aide-logement'],
  },
  {
    slug: 'aide-logement',
    categorie: 'subsides',
    titre: 'Assistance à une demande d’aide au logement',
    accroche: 'Le dossier préparé selon le dispositif applicable chez vous.',
    description:
      'Les dispositifs d’aide au logement varient d’un canton à l’autre. Le dossier est préparé selon les règles en vigueur chez vous, pièces à l’appui.',
    prix: 79,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Locataires susceptibles de bénéficier d’une aide au logement.',
    inclus: [
      'Vérification du dispositif applicable dans votre canton',
      'Liste personnalisée des pièces',
      'Constitution et vérification du dossier',
    ],
    exclus: [
      'Garantie d’éligibilité ou d’octroi',
      'Recours contre une décision',
      'Dépôt à votre place lorsqu’une identification est requise',
    ],
    documents: ['Contrat de bail', 'Justificatifs de revenus du ménage', 'Décision de taxation'],
    cadre: CADRE_AIDE,
    voirAussi: ['dossier-administratif-social', 'subside-assurance-maladie'],
  },
  {
    slug: 'allocation-familiale',
    categorie: 'subsides',
    titre: 'Assistance administrative pour dossier d’allocation familiale',
    titreSeo: 'Dossier d’allocation familiale',
    accroche: 'Votre demande d’allocations constituée avec les bonnes pièces.',
    description:
      'La demande est préparée avec les pièces exigées par la caisse de compensation compétente, et vérifiée avant dépôt.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Parents demandant des allocations familiales.',
    inclus: [
      'Identification de la caisse compétente',
      'Remplissage du formulaire de demande',
      'Organisation des pièces justificatives',
      'Vérification avant dépôt',
    ],
    exclus: ['Garantie d’octroi', 'Recours contre une décision', 'Dépôt à votre place'],
    documents: [
      'Acte de naissance ou livret de famille',
      'Attestation de l’employeur',
      'Attestation de domicile',
    ],
    cadre: CADRE_AIDE,
    voirAussi: ['dossier-allocation', 'declaration-impots-couple-enfants'],
  },
  {
    slug: 'dossier-allocation',
    categorie: 'subsides',
    titre: 'Préparation d’un dossier de demande d’allocation',
    accroche: 'Pour les allocations qui demandent un dossier complet.',
    description:
      'Au-delà des allocations familiales, certaines prestations demandent un dossier étoffé. L’ensemble est constitué, ordonné et vérifié.',
    prix: 59,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Personnes sollicitant une allocation soumise à conditions.',
    inclus: [
      'Vérification des conditions formelles de dépôt',
      'Liste personnalisée des pièces',
      'Constitution et organisation du dossier',
      'Contrôle avant transmission',
    ],
    exclus: ['Garantie d’octroi', 'Évaluation de votre éligibilité', 'Recours contre une décision'],
    documents: ['Justificatifs de situation personnelle et de revenus', 'Courriers reçus'],
    cadre: CADRE_AIDE,
    voirAussi: ['allocation-familiale', 'dossier-administratif-social'],
  },

  /* ============ Démarches du quotidien ============ */
  {
    slug: 'changement-adresse-simple',
    categorie: 'demarches',
    titre: 'Changement d’adresse simple',
    accroche: 'L’essentiel annoncé, sans rien oublier.',
    description:
      'Votre liste personnalisée d’organismes à prévenir et les communications préparées pour l’essentiel de vos démarches.',
    prix: 29,
    delai: '3 à 5 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Personnes déménageant avec peu de contrats à mettre à jour.',
    inclus: [
      'Liste personnalisée des organismes à prévenir',
      'Préparation des communications pour les principaux organismes',
      'Marche à suivre et délais à respecter',
    ],
    exclus: [
      'Annonces exigeant votre identification personnelle',
      'Démarches auprès du contrôle des habitants à votre place',
      'Suivi des confirmations',
    ],
    documents: ['Ancienne et nouvelle adresse', 'Date du déménagement', 'Liste de vos contrats en cours'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['changement-adresse-cinq', 'pack-demenagement'],
  },
  {
    slug: 'changement-adresse-cinq',
    categorie: 'demarches',
    titre: 'Changement d’adresse — jusqu’à 5 organismes',
    accroche: 'Cinq organismes pris en charge, courriers préparés.',
    description:
      'Jusqu’à cinq organismes de votre choix : les communications sont préparées et accompagnées de la marche à suivre pour chacune.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Personnes ayant plusieurs contrats et abonnements à mettre à jour.',
    inclus: [
      'Liste personnalisée des organismes',
      'Communications préparées pour jusqu’à 5 organismes',
      'Calendrier des démarches',
      'Marche à suivre pour chaque organisme',
    ],
    exclus: [
      'Annonces exigeant votre identification personnelle',
      'Organismes au-delà de cinq, sauf commande du forfait supérieur',
      'Suivi des confirmations',
    ],
    documents: ['Ancienne et nouvelle adresse', 'Date du déménagement', 'Liste des organismes concernés'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['pack-demenagement', 'changement-adresse-simple'],
  },
  {
    slug: 'resiliation-abonnement',
    categorie: 'demarches',
    titre: 'Résiliation d’un abonnement',
    accroche: 'Votre résiliation rédigée, dans les délais et dans les formes.',
    description:
      'Les conditions de résiliation de votre contrat sont vérifiées et la lettre rédigée dans les formes, avec la date d’envoi à respecter.',
    prix: 19,
    delai: '2 à 3 jours ouvrables',
    audience: 'tous',
    pourQui: 'Toute personne souhaitant résilier un abonnement ou un contrat de service.',
    inclus: [
      'Vérification du délai figurant au contrat',
      'Rédaction de la lettre de résiliation',
      'Indication de la forme d’envoi recommandée',
    ],
    exclus: [
      'Garantie d’acceptation d’une résiliation anticipée',
      'Négociation avec le fournisseur',
      'Envoi à votre place',
    ],
    documents: ['Contrat ou conditions générales', 'Référence client'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['resiliations-multiples', 'lettre-simple'],
  },
  {
    slug: 'resiliations-multiples',
    categorie: 'demarches',
    titre: 'Résiliation de plusieurs abonnements',
    accroche: 'Jusqu’à cinq résiliations préparées en une fois.',
    description:
      'Plusieurs contrats à clore en même temps : les délais sont vérifiés contrat par contrat et les lettres rédigées ensemble.',
    prix: 39,
    delai: '3 à 5 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes faisant le ménage dans leurs abonnements, ou cessant une activité.',
    inclus: [
      'Vérification des délais de chaque contrat',
      'Rédaction de jusqu’à 5 lettres de résiliation',
      'Calendrier des envois à respecter',
    ],
    exclus: [
      'Garantie d’acceptation des résiliations',
      'Contrats au-delà de cinq',
      'Envoi à votre place',
    ],
    documents: ['Contrats ou conditions générales', 'Références client'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['resiliation-abonnement', 'organisation-documents'],
  },
  {
    slug: 'formulaire-simple',
    categorie: 'demarches',
    titre: 'Remplissage d’un formulaire administratif simple',
    accroche: 'Le formulaire rempli correctement, du premier coup.',
    description:
      'Un formulaire rempli à partir des informations que vous transmettez, avec la liste des pièces à y joindre.',
    prix: 29,
    delai: '2 à 3 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes devant remplir un formulaire administratif courant.',
    inclus: [
      'Remplissage du formulaire',
      'Liste des pièces à joindre',
      'Marche à suivre pour le dépôt',
    ],
    exclus: [
      'Dépôt lorsqu’une identification personnelle est requise',
      'Garantie d’acceptation',
      'Conseil juridique sur le fond de la demande',
    ],
    documents: ['Le formulaire à remplir', 'Les informations et pièces demandées'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['formulaire-complexe', 'demarche-administration'],
  },
  {
    slug: 'formulaire-complexe',
    categorie: 'demarches',
    titre: 'Remplissage d’un formulaire administratif complexe',
    accroche: 'Formulaires longs, annexes multiples, pièces nombreuses.',
    description:
      'Pour les formulaires longs ou comportant plusieurs annexes : chaque rubrique est remplie et les pièces organisées en conséquence.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes confrontées à un formulaire long ou à plusieurs annexes.',
    inclus: [
      'Remplissage de l’ensemble des rubriques et annexes',
      'Organisation des pièces justificatives',
      'Contrôle de cohérence avant dépôt',
      'Marche à suivre pour le dépôt',
    ],
    exclus: [
      'Dépôt lorsqu’une identification personnelle est requise',
      'Garantie d’acceptation',
      'Conseil juridique sur le fond',
    ],
    documents: ['Le formulaire et ses annexes', 'Les pièces demandées'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['formulaire-simple', 'constitution-dossier'],
  },
  {
    slug: 'organisation-documents',
    categorie: 'demarches',
    titre: 'Organisation et classement de documents',
    accroche: 'Un classement que vous pourrez tenir ensuite sans effort.',
    description:
      'Vos documents triés et classés selon une organisation simple, avec les durées de conservation et ce qui peut être jeté.',
    prix: 49,
    delai: '5 à 7 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes dont les papiers se sont accumulés sans organisation.',
    inclus: [
      'Tri et classement par thème',
      'Plan de classement réutilisable',
      'Durées de conservation indicatives',
      'Liste de ce qui peut être éliminé',
    ],
    exclus: [
      'Numérisation de masse',
      'Destruction sécurisée des documents',
      'Déplacement à votre domicile',
    ],
    documents: ['Vos documents, numérisés ou décrits par catégorie'],
    voirAussi: ['constitution-dossier', 'organisation-factures'],
  },
  {
    slug: 'constitution-dossier',
    categorie: 'demarches',
    titre: 'Constitution d’un dossier administratif',
    accroche: 'Toutes les pièces réunies, ordonnées et vérifiées.',
    description:
      'Un dossier complet à présenter : les pièces sont réunies, ordonnées selon les exigences du destinataire et accompagnées d’un bordereau.',
    prix: 69,
    delai: '5 à 7 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes devant présenter un dossier complet à un organisme ou une administration.',
    inclus: [
      'Liste personnalisée des pièces exigées',
      'Organisation du dossier dans l’ordre attendu',
      'Bordereau récapitulatif des pièces',
      'Signalement des pièces manquantes',
    ],
    exclus: ['Garantie d’acceptation du dossier', 'Dépôt à votre place', 'Conseil juridique'],
    documents: ['Les pièces en votre possession', 'Le courrier ou formulaire de demande'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['organisation-documents', 'formulaire-complexe'],
  },
  {
    slug: 'certificat-attestation',
    categorie: 'demarches',
    titre: 'Demande de certificat ou d’attestation',
    accroche: 'La bonne demande, au bon service, du premier coup.',
    description:
      'Identification du service compétent, préparation de la demande et marche à suivre pour l’obtenir dans les meilleurs délais.',
    prix: 29,
    delai: '2 à 3 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes ayant besoin d’un extrait, d’un certificat ou d’une attestation officielle.',
    inclus: [
      'Identification du service compétent',
      'Préparation de la demande',
      'Marche à suivre et émoluments indicatifs',
    ],
    exclus: [
      'Paiement des émoluments officiels',
      'Demande lorsqu’une identification personnelle est requise',
      'Garantie de délai de l’administration',
    ],
    documents: ['Nature du document souhaité', 'Vos données d’identification'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['demarche-administration'],
  },
  {
    slug: 'demarche-administration',
    categorie: 'demarches',
    titre: 'Assistance pour une démarche auprès d’une administration',
    titreSeo: 'Démarche auprès d’une administration',
    accroche: 'Vous savez ce qu’on vous demande, mais pas comment le faire.',
    description:
      'Le courrier reçu est expliqué, la démarche attendue identifiée et les documents préparés pour y répondre dans les délais.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes ayant reçu un courrier administratif auquel elles ne savent pas répondre.',
    inclus: [
      'Explication écrite du courrier reçu',
      'Identification de la démarche attendue et du délai',
      'Préparation des documents et de la réponse',
    ],
    exclus: [
      'Représentation devant l’administration',
      'Conseil juridique',
      'Garantie d’issue favorable',
    ],
    documents: ['Le courrier reçu', 'Les pièces mentionnées dans ce courrier'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['demande-delai', 'paiement-echelonne'],
  },
  {
    slug: 'paiement-echelonne',
    categorie: 'demarches',
    titre: 'Demande de paiement échelonné',
    accroche: 'Une proposition de plan de paiement, formulée correctement.',
    description:
      'Une proposition d’échelonnement est formulée à partir de votre capacité réelle, dans un courrier adressé au créancier.',
    prix: 39,
    delai: '2 à 3 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes ne pouvant régler une facture en une fois.',
    inclus: [
      'Formulation d’une proposition d’échelonnement',
      'Rédaction du courrier au créancier',
      'Marche à suivre et suite à donner',
    ],
    exclus: [
      'Garantie d’acceptation par le créancier',
      'Négociation en votre nom',
      'Conseil en désendettement',
    ],
    documents: ['La facture ou le rappel reçu', 'Votre capacité de paiement mensuelle'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['demande-delai', 'lettre-reclamation'],
  },
  {
    slug: 'demande-delai',
    categorie: 'demarches',
    titre: 'Demande de délai',
    accroche: 'Un report demandé dans les formes, avant l’échéance.',
    description:
      'Une demande de report formulée et adressée au bon destinataire, avant l’échéance qui vous est opposée.',
    prix: 29,
    delai: '2 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes ne pouvant respecter un délai administratif.',
    inclus: [
      'Rédaction de la demande de délai',
      'Identification du destinataire et de la forme d’envoi',
      'Rappel de l’échéance à respecter',
    ],
    exclus: ['Garantie d’octroi du délai', 'Représentation', 'Conseil juridique'],
    documents: ['Le courrier fixant le délai'],
    cadre: CADRE_SIGNATURE,
    voirAussi: ['paiement-echelonne', 'prolongation-delai-fiscal'],
  },

  /* ============ Comptabilité ============ */
  {
    slug: 'organisation-documents-financiers',
    categorie: 'comptabilite',
    titre: 'Organisation de documents financiers',
    accroche: 'Vos relevés et justificatifs remis en ordre.',
    description:
      'Relevés, factures et justificatifs triés, classés et récapitulés, pour y voir clair et retrouver une pièce rapidement.',
    prix: 49,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Particuliers souhaitant remettre de l’ordre dans leurs documents financiers.',
    inclus: [
      'Tri et classement par nature et par période',
      'Récapitulatif écrit',
      'Plan de classement réutilisable',
    ],
    exclus: ['Conseil financier ou budgétaire', 'Analyse de placements', 'Saisie comptable'],
    documents: ['Relevés bancaires', 'Factures et justificatifs'],
    voirAussi: ['tableau-suivi-depenses', 'organisation-factures'],
  },
  {
    slug: 'tableau-suivi-depenses',
    categorie: 'comptabilite',
    titre: 'Tableau de suivi des dépenses personnalisé',
    accroche: 'Un tableau simple, adapté à votre situation, prêt à l’emploi.',
    description:
      'Un tableau de suivi construit pour votre situation, avec vos catégories et vos échéances, livré prêt à être rempli et accompagné de sa notice.',
    prix: 59,
    delai: '5 à 7 jours ouvrables',
    audience: 'particuliers',
    pourQui: 'Particuliers souhaitant suivre leur budget sans outil compliqué.',
    inclus: [
      'Tableau construit sur vos catégories de dépenses',
      'Formules de calcul et totaux automatiques',
      'Notice d’utilisation écrite',
      'Un aller-retour d’ajustement',
    ],
    exclus: ['Conseil budgétaire ou en désendettement', 'Saisie de vos dépenses', 'Suivi dans la durée'],
    documents: ['Vos catégories de dépenses', 'Vos échéances récurrentes'],
    voirAussi: ['organisation-documents-financiers', 'dossier-financier'],
  },
  {
    slug: 'organisation-factures',
    categorie: 'comptabilite',
    titre: 'Organisation des factures et documents',
    accroche: 'Vos factures classées et vos échéances visibles.',
    description:
      'Factures classées par échéance et par nature, avec un récapitulatif de ce qui est payé, en attente ou en retard.',
    prix: 49,
    delai: '5 à 7 jours ouvrables',
    audience: 'tous',
    pourQui: 'Particuliers et indépendants dont les factures s’accumulent.',
    inclus: [
      'Classement par échéance et par nature',
      'Récapitulatif des montants et échéances',
      'Signalement des retards apparents',
    ],
    exclus: ['Paiement des factures', 'Négociation avec les créanciers', 'Conseil en désendettement'],
    documents: ['Vos factures et rappels'],
    voirAussi: ['organisation-documents-financiers', 'classement-justificatifs'],
  },
  {
    slug: 'dossier-financier',
    categorie: 'comptabilite',
    titre: 'Préparation d’un dossier financier administratif',
    accroche: 'Un dossier chiffré et documenté, prêt à être présenté.',
    description:
      'Pour une demande de crédit, de location ou d’aide : vos éléments financiers réunis, ordonnés et accompagnés d’un récapitulatif.',
    prix: 69,
    delai: '5 à 7 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes devant présenter leur situation financière à un tiers.',
    inclus: [
      'Liste des pièces attendues par le destinataire',
      'Récapitulatif écrit de la situation',
      'Organisation et bordereau des pièces',
    ],
    exclus: [
      'Conseil financier',
      'Garantie d’acceptation du dossier',
      'Attestation de solvabilité',
    ],
    documents: ['Relevés bancaires', 'Justificatifs de revenus et de charges'],
    voirAussi: ['organisation-documents-financiers', 'dossier-fiduciaire'],
  },
  {
    slug: 'tableau-suivi-comptable',
    categorie: 'comptabilite',
    titre: 'Mise en place d’un tableau de suivi comptable',
    accroche: 'Un outil de suivi adapté à votre activité, prêt à l’emploi.',
    description:
      'Un tableau construit pour votre activité : recettes, dépenses, TVA le cas échéant et échéances, livré avec sa notice.',
    prix: 99,
    delai: '5 à 7 jours ouvrables',
    audience: 'independants',
    pourQui: 'Indépendants et petites structures démarrant ou reprenant leur suivi.',
    inclus: [
      'Tableau construit sur votre activité',
      'Catégories de recettes et de dépenses',
      'Formules et totaux automatiques',
      'Notice d’utilisation et un aller-retour d’ajustement',
    ],
    exclus: [
      'Tenue de la comptabilité dans la durée',
      'Bouclement et établissement des comptes',
      'Conseil fiscal ou décompte TVA',
    ],
    documents: ['Nature de votre activité', 'Vos catégories de recettes et de dépenses'],
    cadre: CADRE_COMPTA,
    voirAussi: ['saisie-comptable-20', 'organisation-activite'],
    miseEnAvant: true,
  },
  {
    slug: 'organisation-activite',
    categorie: 'comptabilite',
    titre: 'Organisation administrative d’une activité',
    accroche: 'Une organisation administrative posée dès le départ.',
    description:
      'Classement, modèles de documents, calendrier des échéances et méthode de suivi : l’organisation administrative de votre activité mise en place.',
    prix: 149,
    delai: '7 à 10 jours ouvrables',
    audience: 'independants',
    pourQui: 'Indépendants démarrant une activité ou souhaitant la remettre en ordre.',
    inclus: [
      'Plan de classement des documents',
      'Modèles de documents courants',
      'Calendrier des échéances administratives',
      'Méthode de suivi écrite',
    ],
    exclus: [
      'Conseil juridique sur la forme de l’entreprise',
      'Démarches d’inscription à votre place',
      'Conseil fiscal ou TVA',
    ],
    documents: ['Nature et forme de votre activité', 'Documents administratifs existants'],
    cadre: CADRE_COMPTA,
    voirAussi: ['tableau-suivi-comptable', 'dossier-fiduciaire'],
  },
  {
    slug: 'saisie-comptable-20',
    categorie: 'comptabilite',
    titre: 'Saisie comptable — jusqu’à 20 opérations',
    accroche: 'Vos pièces saisies et classées, prêtes à être exploitées.',
    description:
      'Jusqu’à 20 opérations saisies à partir de vos pièces, avec le classement correspondant et un récapitulatif.',
    prix: 79,
    delai: '5 jours ouvrables',
    audience: 'independants',
    pourQui: 'Indépendants avec un faible volume mensuel ou trimestriel.',
    inclus: [
      'Saisie de jusqu’à 20 opérations',
      'Classement des pièces correspondantes',
      'Récapitulatif de la période',
      'Signalement des pièces manquantes',
    ],
    exclus: [
      'Bouclement et établissement des comptes',
      'Révision comptable',
      'Décompte TVA',
      'Conseil fiscal',
    ],
    documents: ['Pièces justificatives de la période', 'Relevés bancaires professionnels'],
    cadre: CADRE_COMPTA,
    voirAussi: ['saisie-comptable-50', 'classement-justificatifs'],
  },
  {
    slug: 'saisie-comptable-50',
    categorie: 'comptabilite',
    titre: 'Saisie comptable — jusqu’à 50 opérations',
    accroche: 'Un volume mensuel courant, traité en une fois.',
    description:
      'Jusqu’à 50 opérations saisies à partir de vos pièces, classées et récapitulées par période.',
    prix: 149,
    delai: '5 à 7 jours ouvrables',
    audience: 'independants',
    pourQui: 'Indépendants avec un volume mensuel courant.',
    inclus: [
      'Saisie de jusqu’à 50 opérations',
      'Classement des pièces correspondantes',
      'Récapitulatif de la période',
      'Signalement des pièces manquantes',
    ],
    exclus: ['Bouclement', 'Révision comptable', 'Décompte TVA', 'Conseil fiscal'],
    documents: ['Pièces justificatives de la période', 'Relevés bancaires professionnels'],
    cadre: CADRE_COMPTA,
    voirAussi: ['saisie-comptable-100', 'dossier-fiduciaire'],
    miseEnAvant: true,
  },
  {
    slug: 'saisie-comptable-100',
    categorie: 'comptabilite',
    titre: 'Saisie comptable — jusqu’à 100 opérations',
    accroche: 'Un volume important repris en une fois.',
    description:
      'Jusqu’à 100 opérations saisies, classées et récapitulées. Au-delà, un devis est établi en fonction du volume réel.',
    prix: 249,
    delai: '7 à 10 jours ouvrables',
    audience: 'independants',
    pourQui: 'Indépendants et petites structures avec un volume important ou un retard à rattraper.',
    inclus: [
      'Saisie de jusqu’à 100 opérations',
      'Classement des pièces correspondantes',
      'Récapitulatif par période',
      'Signalement des pièces manquantes',
    ],
    exclus: ['Bouclement', 'Révision comptable', 'Décompte TVA', 'Conseil fiscal'],
    documents: ['Pièces justificatives de la période', 'Relevés bancaires professionnels'],
    cadre: CADRE_COMPTA,
    voirAussi: ['saisie-comptable-50', 'suivi-mensuel'],
  },
  {
    slug: 'classement-justificatifs',
    categorie: 'comptabilite',
    titre: 'Classement de factures et justificatifs',
    accroche: 'Vos pièces classées selon une logique comptable.',
    description:
      'Factures et justificatifs classés par période et par nature, avec un bordereau et la liste des pièces manquantes.',
    prix: 79,
    delai: '5 jours ouvrables',
    audience: 'independants',
    pourQui: 'Indépendants dont les pièces sont accumulées sans classement.',
    inclus: [
      'Classement par période et par nature',
      'Bordereau des pièces',
      'Liste des pièces manquantes',
    ],
    exclus: ['Saisie comptable', 'Bouclement', 'Conseil fiscal'],
    documents: ['Vos factures et justificatifs'],
    cadre: CADRE_COMPTA,
    voirAussi: ['saisie-comptable-20', 'dossier-comptable'],
  },
  {
    slug: 'dossier-comptable',
    categorie: 'comptabilite',
    titre: 'Organisation d’un dossier comptable',
    accroche: 'Un dossier structuré, exploitable par un tiers.',
    description:
      'Vos pièces et vos relevés organisés en un dossier structuré, avec sommaire et récapitulatif, exploitable immédiatement par un comptable.',
    prix: 99,
    delai: '5 à 7 jours ouvrables',
    audience: 'independants',
    pourQui: 'Indépendants devant remettre un dossier exploitable à un tiers.',
    inclus: [
      'Structuration du dossier par période',
      'Sommaire et bordereau des pièces',
      'Récapitulatif des montants par catégorie',
      'Liste des pièces manquantes',
    ],
    exclus: ['Bouclement', 'Révision', 'Établissement des comptes annuels', 'Conseil fiscal'],
    documents: ['Pièces de l’exercice', 'Relevés bancaires professionnels'],
    cadre: CADRE_COMPTA,
    voirAussi: ['dossier-fiduciaire', 'classement-justificatifs'],
  },
  {
    slug: 'dossier-fiduciaire',
    categorie: 'comptabilite',
    titre: 'Préparation administrative d’un dossier pour fiduciaire',
    titreSeo: 'Préparer un dossier pour fiduciaire',
    accroche: 'Moins d’heures facturées par votre fiduciaire.',
    description:
      'Votre dossier préparé selon ce qu’attend une fiduciaire : pièces complètes, classées, récapitulées, avec les questions à lui poser.',
    prix: 149,
    delai: '7 à 10 jours ouvrables',
    audience: 'independants',
    pourQui: 'Indépendants confiant leur comptabilité ou leur déclaration à une fiduciaire.',
    inclus: [
      'Dossier structuré selon les attentes d’une fiduciaire',
      'Récapitulatif des montants par catégorie',
      'Liste des pièces manquantes',
      'Liste des questions à poser à votre fiduciaire',
    ],
    exclus: [
      'Bouclement et établissement des comptes',
      'Conseil fiscal',
      'Relation avec la fiduciaire en votre nom',
    ],
    documents: ['Pièces de l’exercice', 'Relevés bancaires professionnels', 'Comptes existants'],
    cadre: CADRE_COMPTA,
    voirAussi: ['dossier-comptable', 'declaration-impots-independant'],
    miseEnAvant: true,
  },
  {
    slug: 'suivi-mensuel',
    categorie: 'comptabilite',
    titre: 'Suivi mensuel administratif',
    accroche: 'Vos pièces traitées chaque mois, sans retard accumulé.',
    description:
      'Chaque mois, vos pièces sont saisies et classées et un point de situation vous est transmis. Jusqu’à 50 opérations mensuelles.',
    prix: 149,
    recurrence: 'mensuel',
    delai: 'Traitement mensuel, dans les 7 jours suivant la réception des pièces',
    audience: 'independants',
    pourQui: 'Indépendants souhaitant ne plus accumuler de retard administratif.',
    inclus: [
      'Saisie de jusqu’à 50 opérations par mois',
      'Classement mensuel des pièces',
      'Point de situation écrit chaque mois',
      'Signalement des pièces manquantes',
    ],
    exclus: ['Bouclement annuel', 'Révision', 'Décompte TVA', 'Conseil fiscal'],
    documents: ['Pièces du mois', 'Relevés bancaires professionnels'],
    cadre:
      CADRE_COMPTA +
      ' Abonnement mensuel, résiliable pour la fin d’un mois avec un préavis de 30 jours.',
    voirAussi: ['suivi-mensuel-plus', 'saisie-comptable-50'],
  },
  {
    slug: 'suivi-mensuel-plus',
    categorie: 'comptabilite',
    titre: 'Suivi mensuel administratif Plus',
    accroche: 'Volume étendu et préparation du dossier annuel incluse.',
    description:
      'La formule étendue : jusqu’à 100 opérations par mois, le suivi des échéances et la préparation du dossier annuel pour votre fiduciaire.',
    prix: 249,
    recurrence: 'mensuel',
    delai: 'Traitement mensuel, dans les 7 jours suivant la réception des pièces',
    audience: 'independants',
    pourQui: 'Indépendants avec un volume soutenu et des échéances à tenir.',
    inclus: [
      'Saisie de jusqu’à 100 opérations par mois',
      'Classement mensuel des pièces',
      'Suivi des échéances administratives',
      'Point de situation écrit chaque mois',
      'Préparation du dossier annuel pour votre fiduciaire',
    ],
    exclus: ['Bouclement annuel', 'Révision', 'Décompte TVA', 'Conseil fiscal'],
    documents: ['Pièces du mois', 'Relevés bancaires professionnels'],
    cadre:
      CADRE_COMPTA +
      ' Abonnement mensuel, résiliable pour la fin d’un mois avec un préavis de 30 jours.',
    voirAussi: ['suivi-mensuel', 'dossier-fiduciaire'],
  },

  /* ============ Documents et courriers ============ */
  {
    slug: 'lettre-simple',
    categorie: 'documents',
    titre: 'Lettre simple',
    accroche: 'Un courrier court, écrit correctement.',
    description:
      'Pour une demande simple : un courrier court, correctement formulé et mis en forme, prêt à être envoyé.',
    prix: 19,
    delai: '2 jours ouvrables',
    audience: 'tous',
    pourQui: 'Toute personne ayant une demande simple à formuler par écrit.',
    inclus: ['Rédaction du courrier', 'Mise en forme', 'Courrier prêt à être envoyé'],
    exclus: ['Allers-retours de correction', 'Conseil juridique', 'Envoi à votre place'],
    documents: ['Votre demande, expliquée avec vos mots', 'Coordonnées du destinataire'],
    voirAussi: ['lettre-personnalisee', 'resiliation-abonnement'],
  },
  {
    slug: 'lettre-personnalisee',
    categorie: 'documents',
    titre: 'Lettre personnalisée',
    accroche: 'Votre situation exposée précisément, avec une correction incluse.',
    description:
      'Un courrier construit sur votre situation, avec les éléments de contexte utiles et un aller-retour de correction inclus.',
    prix: 29,
    delai: '2 à 3 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes dont la demande nécessite d’exposer une situation.',
    inclus: [
      'Reprise de votre situation',
      'Rédaction personnalisée',
      'Un aller-retour de correction inclus',
      'Courrier prêt à être envoyé',
    ],
    exclus: ['Conseil juridique', 'Garantie de réponse', 'Envoi à votre place'],
    documents: ['Votre situation expliquée', 'Les échanges déjà intervenus'],
    voirAussi: ['lettre-reclamation', 'lettre-au-bailleur'],
    miseEnAvant: true,
  },
  {
    slug: 'lettre-reclamation',
    categorie: 'documents',
    titre: 'Lettre de réclamation',
    accroche: 'Une réclamation argumentée, qui obtient une réponse.',
    description:
      'Votre réclamation structurée : faits datés, demande claire, délai de réponse indiqué. Un courrier qu’on ne peut pas ignorer.',
    prix: 39,
    delai: '2 à 3 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes confrontées à une prestation défectueuse ou à un litige commercial.',
    inclus: [
      'Chronologie écrite des faits',
      'Formulation de la demande et du délai de réponse',
      'Un aller-retour de correction inclus',
      'Courrier prêt à être envoyé',
    ],
    exclus: ['Conseil juridique', 'Représentation', 'Garantie de résultat'],
    documents: ['Facture ou contrat', 'Échanges déjà intervenus', 'Preuves utiles'],
    voirAussi: ['lettre-contestation', 'lettre-formelle'],
  },
  {
    slug: 'lettre-contestation',
    categorie: 'documents',
    titre: 'Lettre de contestation',
    accroche: 'Une contestation formulée dans les formes et dans les délais.',
    description:
      'Pour contester une facture, une décision ou un décompte : les motifs sont exposés point par point, dans les formes et avant l’échéance.',
    prix: 49,
    delai: '3 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes contestant une facture, un décompte ou une décision.',
    inclus: [
      'Exposé des motifs point par point',
      'Vérification du délai de contestation applicable',
      'Un aller-retour de correction inclus',
      'Courrier prêt à être envoyé',
    ],
    exclus: [
      'Conseil juridique sur le bien-fondé de la contestation',
      'Représentation',
      'Garantie de résultat',
    ],
    documents: ['Le document contesté', 'Le contrat ou les conditions générales', 'Les échanges intervenus'],
    voirAussi: ['lettre-reclamation', 'contestation-charges'],
  },
  {
    slug: 'lettre-formelle',
    categorie: 'documents',
    titre: 'Lettre formelle avec pièces justificatives',
    accroche: 'Courrier et dossier de pièces, prêts à être envoyés ensemble.',
    description:
      'Quand le courrier ne suffit pas : les pièces sont organisées, numérotées et accompagnées d’un bordereau joint au courrier.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes devant appuyer leur demande par un dossier de pièces.',
    inclus: [
      'Rédaction du courrier',
      'Organisation et numérotation des pièces',
      'Bordereau des annexes',
      'Un aller-retour de correction inclus',
    ],
    exclus: ['Conseil juridique', 'Représentation', 'Garantie de résultat'],
    documents: ['Votre situation expliquée', 'Les pièces à joindre'],
    voirAussi: ['lettre-contestation', 'constitution-dossier'],
  },
  {
    slug: 'demande-formelle',
    categorie: 'documents',
    titre: 'Rédaction d’une demande formelle',
    accroche: 'Une demande écrite dans les formes attendues par l’institution.',
    description:
      'Une demande adressée à une institution, rédigée dans la forme attendue, avec les éléments requis et le ton approprié.',
    prix: 39,
    delai: '2 à 3 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes devant adresser une demande formelle à une institution.',
    inclus: [
      'Identification de la forme attendue',
      'Rédaction de la demande',
      'Un aller-retour de correction inclus',
    ],
    exclus: ['Conseil juridique', 'Garantie d’acceptation', 'Envoi à votre place'],
    documents: ['L’objet de votre demande', 'Les courriers déjà reçus'],
    voirAussi: ['lettre-formelle', 'demarche-administration'],
  },
  {
    slug: 'mise-en-forme-cv',
    categorie: 'documents',
    titre: 'Mise en forme de CV',
    accroche: 'Votre CV existant, rendu lisible et professionnel.',
    description:
      'Votre contenu conservé, la présentation reprise : structure, hiérarchie et mise en page d’un CV professionnel, livré en deux formats.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes dont le CV est à jour sur le fond mais mal présenté.',
    inclus: [
      'Reprise de la structure et de la hiérarchie',
      'Mise en page professionnelle',
      'Livraison en PDF et en format modifiable',
      'Un aller-retour de correction inclus',
    ],
    exclus: [
      'Réécriture du contenu',
      'Conseil en orientation professionnelle',
      'Garantie de résultat auprès des recruteurs',
    ],
    documents: ['Votre CV actuel'],
    voirAussi: ['refonte-cv', 'cv-lettre-motivation'],
  },
  {
    slug: 'refonte-cv',
    categorie: 'documents',
    titre: 'Refonte complète de CV',
    accroche: 'Contenu réécrit et présentation refaite.',
    description:
      'Le contenu est repris et réécrit à partir de votre parcours, puis mis en page. Deux allers-retours de correction sont inclus.',
    prix: 89,
    delai: '5 à 7 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes changeant d’orientation ou dont le CV n’a pas été repris depuis longtemps.',
    inclus: [
      'Entretien écrit sur votre parcours',
      'Réécriture complète du contenu',
      'Mise en page professionnelle',
      'Livraison en PDF et en format modifiable',
      'Deux allers-retours de correction',
    ],
    exclus: [
      'Conseil en orientation professionnelle',
      'Garantie d’obtention d’un entretien',
      'Candidatures envoyées à votre place',
    ],
    documents: ['Votre CV actuel', 'Vos certificats de travail', 'L’offre ou le secteur visé'],
    voirAussi: ['cv-lettre-motivation', 'lettre-motivation'],
    miseEnAvant: true,
  },
  {
    slug: 'lettre-motivation',
    categorie: 'documents',
    titre: 'Lettre de motivation personnalisée',
    accroche: 'Une lettre écrite pour une offre précise.',
    description:
      'Une lettre construite à partir de l’offre visée et de votre parcours, pas un modèle générique.',
    prix: 39,
    delai: '3 jours ouvrables',
    audience: 'tous',
    pourQui: 'Candidats répondant à une offre précise.',
    inclus: [
      'Lecture de l’offre visée',
      'Rédaction personnalisée',
      'Un aller-retour de correction inclus',
    ],
    exclus: [
      'Garantie d’obtention d’un entretien',
      'Conseil en orientation',
      'Envoi de la candidature',
    ],
    documents: ['L’offre d’emploi visée', 'Votre CV'],
    voirAussi: ['cv-lettre-motivation', 'refonte-cv'],
  },
  {
    slug: 'cv-lettre-motivation',
    categorie: 'documents',
    titre: 'CV et lettre de motivation',
    accroche: 'Un dossier de candidature cohérent, CV et lettre ensemble.',
    description:
      'La refonte du CV et une lettre de motivation personnalisée, traitées ensemble pour un dossier cohérent sur le fond comme sur la forme.',
    prix: 119,
    delai: '5 à 7 jours ouvrables',
    audience: 'tous',
    pourQui: 'Candidats préparant un dossier complet pour une offre précise.',
    inclus: [
      'Refonte complète du CV',
      'Lettre de motivation personnalisée',
      'Cohérence graphique entre les deux documents',
      'Deux allers-retours de correction',
    ],
    exclus: [
      'Garantie d’obtention d’un entretien',
      'Conseil en orientation',
      'Candidatures envoyées à votre place',
    ],
    documents: ['Votre CV actuel', 'L’offre visée', 'Vos certificats de travail'],
    voirAussi: ['refonte-cv', 'lettre-motivation'],
    miseEnAvant: true,
  },
  {
    slug: 'mise-en-forme-document',
    categorie: 'documents',
    titre: 'Mise en forme d’un document professionnel',
    accroche: 'Un document propre, lisible et cohérent.',
    description:
      'Rapport, offre, procès-verbal ou présentation : structure, titres, numérotation et mise en page repris pour un rendu professionnel.',
    prix: 29,
    delai: '2 à 3 jours ouvrables',
    audience: 'tous',
    pourQui: 'Personnes devant remettre un document présentable.',
    inclus: [
      'Reprise de la structure et des titres',
      'Mise en page et numérotation',
      'Livraison en PDF et en format modifiable',
    ],
    exclus: ['Réécriture du contenu', 'Correction de fond', 'Création graphique'],
    documents: ['Votre document actuel'],
    voirAussi: ['modele-word', 'formulaire-pdf'],
  },
  {
    slug: 'modele-word',
    categorie: 'documents',
    titre: 'Création d’un modèle Word personnalisé',
    accroche: 'Un modèle réutilisable, à vos couleurs.',
    description:
      'Un modèle de document réutilisable avec vos éléments d’identité, vos styles et vos champs, livré avec sa notice.',
    prix: 49,
    delai: '3 à 5 jours ouvrables',
    audience: 'tous',
    pourQui: 'Indépendants et structures produisant régulièrement le même type de document.',
    inclus: [
      'Modèle réutilisable avec vos éléments d’identité',
      'Styles et mise en page définis',
      'Notice d’utilisation',
      'Un aller-retour d’ajustement',
    ],
    exclus: ['Création d’une identité visuelle', 'Rédaction du contenu', 'Formation à Word'],
    documents: ['Votre logo et vos couleurs', 'Un exemple du document à modéliser'],
    voirAussi: ['formulaire-pdf', 'mise-en-forme-document'],
  },
  {
    slug: 'formulaire-pdf',
    categorie: 'documents',
    titre: 'Création d’un formulaire PDF simple',
    accroche: 'Un formulaire remplissable à l’écran, prêt à diffuser.',
    description:
      'Un formulaire PDF avec champs remplissables, cases à cocher et listes, utilisable sans logiciel particulier.',
    prix: 59,
    delai: '5 jours ouvrables',
    audience: 'tous',
    pourQui: 'Structures souhaitant faire remplir un formulaire par leurs clients ou leurs membres.',
    inclus: [
      'Création des champs remplissables',
      'Cases à cocher et listes déroulantes',
      'Mise en page du formulaire',
      'Un aller-retour d’ajustement',
    ],
    exclus: [
      'Signature électronique qualifiée',
      'Hébergement ou collecte des réponses',
      'Traitement automatique des données reçues',
    ],
    documents: ['Le contenu et les champs souhaités', 'Votre logo'],
    voirAussi: ['modele-word', 'mise-en-forme-document'],
  },
];

/* ------------------------------------------------------------------
   Forfaits
------------------------------------------------------------------- */

export type Forfait = {
  slug: string;
  titre: string;
  accroche: string;
  description: string;
  prix: number;
  delai: string;
  inclus: string[];
  exclus: string[];
  /** Prestations couvertes, par slug. Sert au maillage interne. */
  couvre: string[];
  cadre?: string;
};

export const forfaits: Forfait[] = [
  {
    slug: 'pack-demenagement',
    titre: 'Pack Déménagement',
    accroche: 'Jusqu’à 10 organismes prévenus, dossier complet.',
    description:
      'L’ensemble des démarches d’un déménagement réunies : liste personnalisée des organismes, communications préparées pour jusqu’à dix d’entre eux, calendrier et organisation des documents.',
    prix: 69,
    delai: '5 à 7 jours ouvrables',
    inclus: [
      'Liste personnalisée des organismes à prévenir',
      'Communications préparées pour jusqu’à 10 organismes',
      'Calendrier des démarches et des délais',
      'Organisation des documents du déménagement',
      'Marche à suivre pour chaque démarche',
    ],
    exclus: [
      'Annonces exigeant votre identification personnelle',
      'Démarches auprès du contrôle des habitants à votre place',
      'Organisation matérielle du déménagement',
      'Suivi des confirmations reçues',
    ],
    couvre: ['changement-adresse-cinq', 'dossier-demenagement-logement', 'resiliations-multiples'],
    cadre: CADRE_SIGNATURE,
  },
  {
    slug: 'pack-subside',
    titre: 'Pack Subside',
    accroche: 'Dossier de subside constitué, vérifié et suivi.',
    description:
      'Le dossier de subside complet, avec la vérification pièce par pièce et la préparation d’une mise à jour en cas de changement de situation dans l’année.',
    prix: 89,
    delai: '5 à 7 jours ouvrables',
    inclus: [
      'Liste personnalisée des pièces exigées dans votre canton',
      'Constitution et vérification complète du dossier',
      'Assistance au remplissage du formulaire',
      'Contrôle administratif final avant dépôt',
      'Une mise à jour du dossier en cas de changement dans les 12 mois',
    ],
    exclus: [
      'Garantie d’octroi du subside',
      'Dépôt du dossier lorsqu’une identification personnelle est requise',
      'Recours contre une décision de refus',
    ],
    couvre: ['subside-complet', 'mise-a-jour-subside'],
    cadre: CADRE_AIDE,
  },
  {
    slug: 'pack-locataire',
    titre: 'Pack Locataire',
    accroche: 'Bail analysé et demande de baisse de loyer préparée.',
    description:
      'L’analyse administrative de votre bail et la préparation d’une demande de baisse de loyer, avec les pièces organisées et un courrier supplémentaire à votre gérance.',
    prix: 89,
    delai: '5 à 7 jours ouvrables',
    inclus: [
      'Analyse administrative du bail et des avenants',
      'Reconstitution de l’historique du loyer',
      'Préparation d’une demande de baisse de loyer',
      'Un courrier supplémentaire à votre gérance',
      'Organisation des pièces justificatives',
    ],
    exclus: [
      'Garantie d’obtention d’une baisse',
      'Conseil juridique et interprétation des clauses',
      'Procédure devant l’autorité de conciliation',
      'Envoi des courriers à votre place',
    ],
    couvre: ['analyse-documents-bail', 'demande-baisse-loyer-approfondie', 'lettre-au-bailleur'],
    cadre: CADRE_JURIDIQUE,
  },
  {
    slug: 'pack-administratif',
    titre: 'Pack Administratif',
    accroche: 'Trois démarches de votre choix, traitées ensemble.',
    description:
      'Trois démarches administratives de votre choix parmi les prestations à CHF 49 ou moins, traitées ensemble, avec l’organisation des documents correspondants.',
    prix: 99,
    delai: '7 à 10 jours ouvrables',
    inclus: [
      'Trois démarches au choix parmi les prestations à CHF 49 ou moins',
      'Organisation des documents liés à ces démarches',
      'Calendrier des échéances',
      'Un aller-retour de correction par démarche',
    ],
    exclus: [
      'Prestations dont le prix unitaire dépasse CHF 49',
      'Déclarations d’impôts et prestations comptables',
      'Démarches exigeant votre identification personnelle',
      'Démarches supplémentaires au-delà de trois',
    ],
    couvre: ['lettre-personnalisee', 'formulaire-simple', 'certificat-attestation'],
    cadre: CADRE_SIGNATURE,
  },
];

/* ------------------------------------------------------------------
   Accès
------------------------------------------------------------------- */

export const getPrestation = (slug: string) => prestations.find((p) => p.slug === slug);
export const getCategorie = (slug: string) => categories.find((c) => c.slug === slug);
export const getOption = (id: string) => options.find((o) => o.id === id);
export const prestationsDe = (categorie: string) =>
  prestations.filter((p) => p.categorie === categorie);
export const prestationsEnAvant = () => prestations.filter((p) => p.miseEnAvant);

/** Prix affiché, en français suisse. */
export function formatPrix(prix: number | null, aPartirDe?: boolean, recurrence?: 'mensuel') {
  if (prix === null) return 'Sur devis';
  const montant = `CHF ${prix.toLocaleString('fr-CH')}`;
  const suffixe = recurrence === 'mensuel' ? ' / mois' : '';
  return `${aPartirDe ? 'dès ' : ''}${montant}${suffixe}`;
}
