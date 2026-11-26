/**
 * Formulaires de commande adaptés à chaque prestation.
 *
 * PRINCIPE : on ne pose que les questions utiles au traitement de la
 * prestation commandée. Les questions se composent en trois temps :
 *   1. les coordonnées, identiques pour toutes les prestations ;
 *   2. un bloc propre au domaine (impôts, logement, subsides…) ;
 *   3. un bloc propre à la prestation, lorsqu'elle le justifie.
 *
 * MINIMISATION DES DONNÉES (nLPD, art. 6) : ce formulaire ne collecte
 * aucune donnée sensible. Pas de numéro AVS, pas de montant de revenu, pas
 * de donnée de santé, pas de pièce d'identité, et aucun document joint.
 * Les pièces nécessaires sont demandées après confirmation de la commande,
 * par un canal distinct. La liste des champs ci-dessous est donc la limite
 * de ce qui transite par le site.
 */

import { getPrestation, type Prestation } from './catalogue';

export type Choice = { value: string; label: string };

export type Field = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'textarea' | 'radio';
  required?: boolean;
  help?: string;
  placeholder?: string;
  autoComplete?: string;
  choices?: Choice[];
  /** Largeur sur grille à deux colonnes. */
  width?: 'full' | 'half';
  min?: number;
  max?: number;
};

export type FieldGroup = {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
};

/* ------------------------------------------------------------------
   Listes réutilisées
------------------------------------------------------------------- */

const CANTONS: Choice[] = [
  ['VD', 'Vaud'],
  ['GE', 'Genève'],
  ['VS', 'Valais'],
  ['FR', 'Fribourg'],
  ['NE', 'Neuchâtel'],
  ['JU', 'Jura'],
  ['BE', 'Berne'],
  ['autre', 'Autre canton'],
].map(([value, label]) => ({ value, label }));

const ETAT_CIVIL: Choice[] = [
  ['celibataire', 'Célibataire'],
  ['marie', 'Marié ou en partenariat enregistré'],
  ['separe', 'Séparé'],
  ['divorce', 'Divorcé'],
  ['veuf', 'Veuf'],
].map(([value, label]) => ({ value, label }));

const OUI_NON: Choice[] = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'ne-sais-pas', label: 'Je ne sais pas' },
];

const URGENCE: Choice[] = [
  { value: 'aucune', label: 'Aucune échéance particulière' },
  { value: 'moins-7', label: 'Une échéance dans moins de 7 jours' },
  { value: 'moins-30', label: 'Une échéance dans moins de 30 jours' },
];

/* ------------------------------------------------------------------
   1. Coordonnées — communes à toutes les prestations
------------------------------------------------------------------- */

const coordonnees: FieldGroup = {
  id: 'coordonnees',
  title: 'Vos coordonnées',
  description:
    'Nécessaires pour vous adresser la confirmation, la facture et le document final.',
  fields: [
    { name: 'prenom', label: 'Prénom', type: 'text', required: true, autoComplete: 'given-name', width: 'half' },
    { name: 'nom', label: 'Nom', type: 'text', required: true, autoComplete: 'family-name', width: 'half' },
    { name: 'email', label: 'Adresse e-mail', type: 'email', required: true, autoComplete: 'email', width: 'half' },
    {
      name: 'telephone',
      label: 'Téléphone',
      type: 'tel',
      autoComplete: 'tel',
      width: 'half',
      help: 'Facultatif. Utile uniquement si une précision est nécessaire.',
    },
    { name: 'adresse', label: 'Adresse', type: 'text', required: true, autoComplete: 'street-address' },
    { name: 'npa', label: 'NPA', type: 'text', required: true, autoComplete: 'postal-code', width: 'half' },
    { name: 'localite', label: 'Localité', type: 'text', required: true, autoComplete: 'address-level2', width: 'half' },
    { name: 'canton', label: 'Canton', type: 'select', required: true, choices: CANTONS, width: 'half' },
  ],
};

/* ------------------------------------------------------------------
   2. Blocs par domaine
------------------------------------------------------------------- */

const parCategorie: Record<string, FieldGroup> = {
  impots: {
    id: 'situation',
    title: 'Votre situation fiscale',
    description:
      'Ces éléments permettent de vérifier que la prestation commandée correspond bien à votre situation.',
    fields: [
      {
        name: 'anneeFiscale',
        label: 'Année fiscale concernée',
        type: 'number',
        required: true,
        min: 2015,
        max: 2100,
        width: 'half',
        placeholder: '2025',
      },
      { name: 'communeTaxation', label: 'Commune de taxation', type: 'text', required: true, width: 'half' },
      { name: 'etatCivil', label: 'État civil', type: 'select', required: true, choices: ETAT_CIVIL, width: 'half' },
      {
        name: 'enfantsCharge',
        label: 'Enfants à charge',
        type: 'number',
        min: 0,
        max: 15,
        width: 'half',
        help: 'Laissez vide s’il n’y en a pas.',
      },
      {
        name: 'declarationPrecedente',
        label: 'Avez-vous déposé une déclaration l’an dernier ?',
        type: 'radio',
        required: true,
        choices: OUI_NON,
      },
      {
        name: 'bienImmobilier',
        label: 'Êtes-vous propriétaire d’un bien immobilier ?',
        type: 'radio',
        required: true,
        choices: OUI_NON,
        help: 'Si oui, l’option « Bien immobilier » s’applique.',
      },
      {
        name: 'titres',
        label: 'Détenez-vous des titres ou des placements ?',
        type: 'radio',
        required: true,
        choices: OUI_NON,
      },
    ],
  },

  logement: {
    id: 'situation',
    title: 'Votre logement',
    fields: [
      {
        name: 'typeLogement',
        label: 'Type de logement',
        type: 'select',
        required: true,
        width: 'half',
        choices: [
          { value: 'appartement', label: 'Appartement' },
          { value: 'maison', label: 'Maison' },
          { value: 'studio', label: 'Studio' },
          { value: 'chambre', label: 'Chambre ou colocation' },
        ],
      },
      { name: 'pieces', label: 'Nombre de pièces', type: 'text', width: 'half', placeholder: '3,5' },
      {
        name: 'loyerNet',
        label: 'Loyer net mensuel (CHF)',
        type: 'number',
        required: true,
        min: 0,
        width: 'half',
      },
      { name: 'charges', label: 'Charges mensuelles (CHF)', type: 'number', min: 0, width: 'half' },
      {
        name: 'debutBail',
        label: 'Date de début du bail',
        type: 'date',
        required: true,
        width: 'half',
        help: 'Même approximative, elle sert à situer les adaptations de loyer.',
      },
      {
        name: 'bailleur',
        label: 'Bailleur ou régie',
        type: 'text',
        required: true,
        width: 'half',
      },
      {
        name: 'echeance',
        label: 'Y a-t-il une échéance à respecter ?',
        type: 'radio',
        required: true,
        choices: URGENCE,
      },
    ],
  },

  subsides: {
    id: 'situation',
    title: 'Votre situation',
    description: 'Les montants et les justificatifs sont demandés plus tard, avec les documents.',
    fields: [
      {
        name: 'personnesMenage',
        label: 'Personnes dans le ménage',
        type: 'number',
        required: true,
        min: 1,
        max: 15,
        width: 'half',
      },
      {
        name: 'situationPro',
        label: 'Situation professionnelle',
        type: 'select',
        required: true,
        width: 'half',
        choices: [
          { value: 'salarie', label: 'Salarié' },
          { value: 'independant', label: 'Indépendant' },
          { value: 'formation', label: 'En formation' },
          { value: 'recherche', label: 'En recherche d’emploi' },
          { value: 'retraite', label: 'Retraité' },
          { value: 'autre', label: 'Autre' },
        ],
      },
      {
        name: 'dejaBeneficiaire',
        label: 'Bénéficiez-vous déjà de cette aide ?',
        type: 'radio',
        required: true,
        choices: OUI_NON,
      },
      {
        name: 'changementRecent',
        label: 'Un changement récent justifie-t-il la demande ?',
        type: 'textarea',
        help: 'Par exemple une baisse de revenu, une naissance, une séparation, un déménagement. Facultatif.',
      },
      { name: 'echeance', label: 'Y a-t-il une échéance à respecter ?', type: 'radio', required: true, choices: URGENCE },
    ],
  },

  demarches: {
    id: 'situation',
    title: 'La démarche',
    fields: [
      {
        name: 'organisme',
        label: 'Organisme ou entreprise concerné',
        type: 'text',
        required: true,
        help: 'Administration, caisse, opérateur, bailleur, abonnement…',
      },
      {
        name: 'nombreOrganismes',
        label: 'Nombre d’organismes à contacter',
        type: 'number',
        min: 1,
        max: 30,
        width: 'half',
        help: 'Pour les prestations groupées.',
      },
      { name: 'dateEffet', label: 'Date d’effet souhaitée', type: 'date', width: 'half' },
      {
        name: 'referenceDossier',
        label: 'Référence de dossier ou de contrat',
        type: 'text',
        help: 'Si vous l’avez sous la main. Facultatif.',
      },
      { name: 'echeance', label: 'Y a-t-il une échéance à respecter ?', type: 'radio', required: true, choices: URGENCE },
    ],
  },

  comptabilite: {
    id: 'situation',
    title: 'Votre activité',
    fields: [
      {
        name: 'formeJuridique',
        label: 'Forme juridique',
        type: 'select',
        required: true,
        width: 'half',
        choices: [
          { value: 'raison-individuelle', label: 'Raison individuelle' },
          { value: 'sarl', label: 'Sàrl' },
          { value: 'sa', label: 'SA' },
          { value: 'association', label: 'Association' },
          { value: 'aucune', label: 'Pas encore de structure' },
        ],
      },
      { name: 'secteur', label: 'Secteur d’activité', type: 'text', required: true, width: 'half' },
      {
        name: 'volumePieces',
        label: 'Pièces par mois, environ',
        type: 'number',
        required: true,
        min: 0,
        width: 'half',
        help: 'Factures, reçus et relevés confondus.',
      },
      {
        name: 'periode',
        label: 'Période à traiter',
        type: 'text',
        required: true,
        width: 'half',
        placeholder: 'Janvier à mars 2026',
      },
      {
        name: 'outil',
        label: 'Outil utilisé aujourd’hui',
        type: 'text',
        help: 'Bexio, Crésus, un tableur, du papier… Facultatif.',
      },
      {
        name: 'fiduciaire',
        label: 'Travaillez-vous déjà avec une fiduciaire ?',
        type: 'radio',
        required: true,
        choices: OUI_NON,
        help: 'Le dossier est préparé pour lui être remis.',
      },
    ],
  },

  documents: {
    id: 'situation',
    title: 'Le document à produire',
    fields: [
      { name: 'destinataire', label: 'Destinataire', type: 'text', required: true, width: 'half' },
      { name: 'objet', label: 'Objet', type: 'text', required: true, width: 'half' },
      {
        name: 'ton',
        label: 'Ton souhaité',
        type: 'select',
        required: true,
        width: 'half',
        choices: [
          { value: 'neutre', label: 'Neutre et factuel' },
          { value: 'ferme', label: 'Ferme' },
          { value: 'conciliant', label: 'Conciliant' },
        ],
      },
      {
        name: 'langue',
        label: 'Langue',
        type: 'select',
        required: true,
        width: 'half',
        choices: [
          { value: 'fr', label: 'Français' },
          { value: 'de', label: 'Allemand' },
          { value: 'en', label: 'Anglais' },
        ],
      },
      {
        name: 'faits',
        label: 'Les faits, dans l’ordre',
        type: 'textarea',
        required: true,
        help: 'Dates, montants, échanges déjà eus. C’est la matière du document : plus c’est précis, moins il y a d’aller-retour.',
      },
      { name: 'resultat', label: 'Ce que vous voulez obtenir', type: 'textarea', required: true },
      { name: 'echeance', label: 'Y a-t-il une échéance à respecter ?', type: 'radio', required: true, choices: URGENCE },
    ],
  },
};

/* ------------------------------------------------------------------
   3. Blocs propres à certaines prestations
------------------------------------------------------------------- */

const specifiques: Record<string, Field[]> = {
  'declaration-impots-independant': [
    {
      name: 'comptabiliteTenue',
      label: 'Votre comptabilité est-elle tenue à jour ?',
      type: 'radio',
      required: true,
      choices: OUI_NON,
      help: 'Les comptes doivent être bouclés : la saisie comptable n’est pas comprise dans cette prestation.',
    },
    { name: 'chiffreAffaires', label: 'Chiffre d’affaires annuel, ordre de grandeur', type: 'text', width: 'half' },
    {
      name: 'assujettiTva',
      label: 'Êtes-vous assujetti à la TVA ?',
      type: 'radio',
      required: true,
      choices: OUI_NON,
      width: 'half',
    },
  ],

  'prolongation-delai-fiscal': [
    {
      name: 'delaiActuel',
      label: 'Date limite figurant sur votre déclaration',
      type: 'date',
      required: true,
      width: 'half',
      help: 'Une demande déposée après l’échéance n’est en principe plus recevable.',
    },
    { name: 'delaiSouhaite', label: 'Délai souhaité', type: 'date', width: 'half' },
  ],

  'verification-declaration': [
    {
      name: 'dejaEnvoyee',
      label: 'La déclaration a-t-elle déjà été envoyée ?',
      type: 'radio',
      required: true,
      choices: OUI_NON,
    },
  ],

  'demande-baisse-loyer': [
    {
      name: 'derniereAdaptation',
      label: 'Date de la dernière adaptation de loyer',
      type: 'date',
      width: 'half',
      help: 'Laissez vide si le loyer n’a jamais changé.',
    },
    {
      name: 'tauxReference',
      label: 'Taux de référence à la conclusion du bail, si connu',
      type: 'text',
      width: 'half',
    },
  ],

  'resiliation-bail': [
    { name: 'dateSortie', label: 'Date de sortie souhaitée', type: 'date', required: true, width: 'half' },
    {
      name: 'motifAnticipe',
      label: 'S’agit-il d’une résiliation anticipée ?',
      type: 'radio',
      required: true,
      choices: OUI_NON,
      width: 'half',
      help: 'Une sortie hors échéance suppose en principe un locataire de remplacement.',
    },
  ],

  'restitution-garantie': [
    { name: 'dateRestitution', label: 'Date de remise des clés', type: 'date', required: true, width: 'half' },
    { name: 'montantGarantie', label: 'Montant de la garantie (CHF)', type: 'number', min: 0, width: 'half' },
  ],

  'mise-en-forme-cv': [
    { name: 'posteVise', label: 'Poste ou domaine visé', type: 'text', required: true, width: 'half' },
    { name: 'anneesExperience', label: 'Années d’expérience', type: 'number', min: 0, max: 60, width: 'half' },
  ],

  'lettre-motivation': [
    { name: 'posteVise', label: 'Poste visé', type: 'text', required: true, width: 'half' },
    { name: 'entreprise', label: 'Entreprise', type: 'text', required: true, width: 'half' },
    { name: 'delaiPostulation', label: 'Date limite de postulation', type: 'date', width: 'half' },
  ],
};

/** Prestations qui partagent le bloc d'une autre, pour éviter les doublons. */
const alias: Record<string, string> = {
  'demande-baisse-loyer-approfondie': 'demande-baisse-loyer',
  'refonte-cv': 'mise-en-forme-cv',
  'cv-lettre-motivation': 'lettre-motivation',
};

/* ------------------------------------------------------------------
   Composition
------------------------------------------------------------------- */

/** Dernier bloc, commun à toutes les prestations. */
const precisions: FieldGroup = {
  id: 'precisions',
  title: 'Précisions',
  fields: [
    {
      name: 'precisions',
      label: 'Ce qu’il faut savoir en plus',
      type: 'textarea',
      help: 'Tout ce qui n’entre pas dans les questions ci-dessus et qui compte pour votre dossier. Facultatif.',
    },
  ],
};

/**
 * Renvoie les blocs de questions d'une prestation, dans l'ordre d'affichage.
 */
export function questionsPour(prestation: Prestation): FieldGroup[] {
  const groupes: FieldGroup[] = [coordonnees];

  const domaine = parCategorie[prestation.categorie];
  if (domaine) groupes.push(domaine);

  const cle = alias[prestation.slug] ?? prestation.slug;
  const extra = specifiques[cle];
  if (extra) {
    groupes.push({
      id: 'prestation',
      title: 'Propre à cette prestation',
      fields: extra,
    });
  }

  groupes.push(precisions);
  return groupes;
}

/** Variante par slug, pour le serveur qui ne reçoit que l'identifiant. */
export function questionsPourSlug(slug: string): FieldGroup[] | null {
  const prestation = getPrestation(slug);
  return prestation ? questionsPour(prestation) : null;
}

/** Tous les champs d'une prestation, à plat. Sert à la validation serveur. */
export function champsPour(prestation: Prestation): Field[] {
  return questionsPour(prestation).flatMap((groupe) => groupe.fields);
}
