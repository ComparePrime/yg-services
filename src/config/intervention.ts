/**
 * Modalités d'intervention et politique de déplacement.
 *
 * YG Services ne travaille pas uniquement à distance. Selon la prestation,
 * un rendez-vous ou une intervention sur place a un vrai sens : trier des
 * papiers, remplir un dossier avec la personne, reprendre une comptabilité
 * là où se trouvent les pièces.
 *
 * RÈGLE : le déplacement n'est proposé que là où il apporte quelque chose.
 * Une résiliation d'abonnement ou une mise en forme de CV se traitent très
 * bien à distance ; proposer un déplacement y serait du remplissage.
 *
 * FRAIS : aucun frais de déplacement n'est facturé pour l'instant
 * (`fraisActifs: false`). La grille ci-dessous est une proposition à
 * valider ; tant que le drapeau est faux, le parcours de commande indique
 * que les frais éventuels sont confirmés avant tout engagement. Aucun
 * montant ne s'ajoute en silence au total.
 */

export type Modalite = 'distance' | 'presentiel' | 'domicile' | 'mixte';

export type DescriptionModalite = {
  id: Modalite;
  label: string;
  /** Phrase affichée sous le libellé, dans le parcours de commande. */
  description: string;
  /** Un déplacement est-il nécessaire ? Conditionne l'affichage des zones. */
  deplacement: boolean;
};

export const modalites: DescriptionModalite[] = [
  {
    id: 'distance',
    label: 'À distance',
    description:
      'Tout se fait par écrit : vous transmettez vos informations et vos pièces, le document vous revient terminé. C’est le mode le plus rapide.',
    deplacement: false,
  },
  {
    id: 'mixte',
    label: 'Préparation à distance, puis rendez-vous',
    description:
      'Le dossier est préparé à distance, puis repris ensemble lors d’un rendez-vous pour le relire, le compléter et le valider.',
    deplacement: true,
  },
  {
    id: 'presentiel',
    label: 'Rendez-vous en présentiel',
    description:
      'Un rendez-vous dans la zone d’intervention, au lieu convenu ensemble. Utile quand il y a beaucoup à expliquer ou à décider.',
    deplacement: true,
  },
  {
    id: 'domicile',
    label: 'Intervention sur place',
    description:
      'Le travail est effectué chez vous ou dans vos locaux, là où se trouvent les documents. Utile pour trier, classer et reprendre un retard.',
    deplacement: true,
  },
];

export const getModalite = (id: Modalite) => modalites.find((m) => m.id === id);

/* ------------------------------------------------------------------
   Zones de déplacement
------------------------------------------------------------------- */

export type Zone = {
  id: string;
  nom: string;
  description: string;
  /** Communes et secteurs couverts, à titre indicatif. */
  exemples: string[];
  /**
   * Frais proposés, en CHF. `null` signifie « à confirmer ».
   * Non facturés tant que `deplacement.fraisActifs` est faux.
   */
  fraisProposes: number | null;
  /** Délai de prise de rendez-vous, en plus du délai de la prestation. */
  delaiRendezVous: string;
};

export const zones: Zone[] = [
  {
    id: 'yverdon',
    nom: 'Yverdon-les-Bains et proches environs',
    description: 'Jusqu’à une dizaine de kilomètres autour d’Yverdon-les-Bains.',
    exemples: [
      'Yverdon-les-Bains',
      'Grandson',
      'Yvonand',
      'Chavornay',
      'Orbe',
      'Cheseaux-Noréaz',
      'Montagny-près-Yverdon',
    ],
    fraisProposes: 0,
    delaiRendezVous: '3 à 5 jours ouvrables',
  },
  {
    id: 'nord-vaudois',
    nom: 'Nord vaudois et Broye',
    description: 'Jusqu’à une trentaine de kilomètres autour d’Yverdon-les-Bains.',
    exemples: [
      'Sainte-Croix',
      'Vallorbe',
      'Échallens',
      'Moudon',
      'Payerne',
      'Estavayer-le-Lac',
      'Avenches',
    ],
    fraisProposes: 25,
    delaiRendezVous: '5 à 7 jours ouvrables',
  },
  {
    id: 'au-dela',
    nom: 'Au-delà',
    description:
      'Lausanne, Neuchâtel, Fribourg et le reste de la Suisse romande. Possible selon la prestation et le moment.',
    exemples: ['Lausanne', 'Morges', 'Neuchâtel', 'Fribourg', 'Bulle'],
    fraisProposes: null,
    delaiRendezVous: 'à convenir',
  },
];

export const getZone = (id: string) => zones.find((z) => z.id === id);

/* ------------------------------------------------------------------
   Politique de déplacement
------------------------------------------------------------------- */

export const deplacement = {
  /**
   * Tant que ce drapeau est faux, AUCUN frais de déplacement n'est ajouté
   * au total d'une commande. Le parcours indique que les frais éventuels
   * sont confirmés par écrit avant tout engagement.
   *
   * POUR ACTIVER : passer à `true` après avoir validé les montants de
   * `zones[].fraisProposes`. Les frais apparaissent alors comme une ligne
   * distincte du récapitulatif, jamais fondus dans le prix.
   */
  fraisActifs: false as boolean,

  /** Durée indicative d'un rendez-vous, hors intervention sur place. */
  dureeRendezVous: '45 à 90 minutes selon la prestation',

  /** Plages de disponibilité annoncées. */
  disponibilites: 'En semaine en journée et en début de soirée, le samedi matin sur demande.',

  conditions: [
    'Le rendez-vous est fixé par écrit après la commande, en fonction de vos disponibilités.',
    'Un rendez-vous peut être déplacé sans frais jusqu’à 24 heures avant l’heure convenue.',
    'Un rendez-vous manqué sans avertissement peut être facturé au prorata du temps réservé.',
    'Les frais de déplacement éventuels sont annoncés avant la commande et figurent sur une ligne distincte.',
    'Hors des zones couvertes, la faisabilité et les frais sont confirmés avant tout engagement.',
  ],
};

/* ------------------------------------------------------------------
   Modalités disponibles par prestation
------------------------------------------------------------------- */

/**
 * Modalités par défaut, selon le domaine. Les prestations non citées dans
 * `MODALITES_PAR_PRESTATION` reçoivent celles-ci.
 *
 * Par défaut, tout est à distance : c'est le mode qui convient à la
 * majorité du catalogue. Le présentiel s'ajoute prestation par prestation,
 * là où il change quelque chose pour le client.
 */
const PAR_DEFAUT: Modalite[] = ['distance'];

/**
 * Analyse prestation par prestation.
 *
 * Trois questions ont servi de filtre :
 *   1. le client a-t-il des papiers à trier, qu'il ne peut pas numériser
 *      sans y passer des heures ? → intervention sur place ;
 *   2. la prestation demande-t-elle des décisions ou des explications que
 *      l'écrit rend laborieuses ? → rendez-vous ;
 *   3. le dossier se prépare-t-il mieux avant d'être relu ensemble ?
 *      → préparation à distance puis rendez-vous.
 * Si la réponse est non aux trois, la prestation reste à distance.
 */
export const MODALITES_PAR_PRESTATION: Record<string, Modalite[]> = {
  /* --- Impôts : la déclaration se relit utilement ensemble --- */
  'declaration-impots-etudiant': ['distance', 'mixte'],
  'declaration-impots-personne-seule-simple': ['distance', 'mixte'],
  'declaration-impots-personne-seule-standard': ['distance', 'mixte', 'presentiel'],
  'declaration-impots-couple': ['distance', 'mixte', 'presentiel'],
  'declaration-impots-couple-enfants': ['distance', 'mixte', 'presentiel'],
  // Les retraités sont la première demande d'intervention à domicile.
  'declaration-impots-retraite': ['distance', 'mixte', 'presentiel', 'domicile'],
  'declaration-impots-complexe': ['distance', 'mixte', 'presentiel', 'domicile'],
  'declaration-impots-independant': ['distance', 'mixte', 'presentiel', 'domicile'],
  'verification-declaration': ['distance', 'mixte'],
  // prolongation-delai-fiscal : purement administratif, reste à distance.

  /* --- Logement --- */
  'demande-baisse-loyer': ['distance', 'mixte'],
  'demande-baisse-loyer-approfondie': ['distance', 'mixte'],
  'analyse-documents-bail': ['distance', 'mixte', 'presentiel'],
  // Les défauts se constatent sur place.
  'dossier-defaut-logement': ['distance', 'presentiel', 'domicile'],
  'dossier-demenagement-logement': ['distance', 'mixte', 'domicile'],
  'restitution-garantie': ['distance', 'mixte'],

  /* --- Subsides : l'aide au remplissage se fait bien côte à côte --- */
  'subside-assurance-maladie': ['distance', 'mixte', 'presentiel', 'domicile'],
  'subside-complet': ['distance', 'mixte', 'presentiel', 'domicile'],
  'mise-a-jour-subside': ['distance', 'mixte'],
  'aide-logement': ['distance', 'mixte', 'presentiel'],
  'allocation-familiale': ['distance', 'mixte'],
  'demande-aide-financiere': ['distance', 'mixte', 'presentiel'],
  'dossier-administratif-social': ['distance', 'mixte', 'presentiel', 'domicile'],
  'dossier-allocation': ['distance', 'mixte', 'presentiel'],

  /* --- Démarches du quotidien --- */
  'formulaire-complexe': ['distance', 'mixte', 'presentiel'],
  'changement-adresse-cinq': ['distance', 'mixte'],
  'certificat-attestation': ['distance', 'mixte'],
  // Trier des papiers à distance suppose de tout numériser : sur place est
  // souvent plus simple pour le client.
  'organisation-documents': ['distance', 'presentiel', 'domicile'],
  'constitution-dossier': ['distance', 'mixte', 'presentiel'],
  'demarche-administration': ['distance', 'mixte', 'presentiel'],
  'paiement-echelonne': ['distance', 'mixte'],

  /* --- Comptabilité : les pièces sont là où est l'activité --- */
  'organisation-documents-financiers': ['distance', 'presentiel', 'domicile'],
  'organisation-factures': ['distance', 'presentiel', 'domicile'],
  'classement-justificatifs': ['distance', 'presentiel', 'domicile'],
  'organisation-activite': ['distance', 'mixte', 'presentiel', 'domicile'],
  'dossier-comptable': ['distance', 'presentiel', 'domicile'],
  'dossier-financier': ['distance', 'mixte', 'presentiel'],
  'dossier-fiduciaire': ['distance', 'presentiel', 'domicile'],
  'saisie-comptable-50': ['distance', 'domicile'],
  'saisie-comptable-100': ['distance', 'domicile'],
  'suivi-mensuel': ['distance', 'mixte'],
  'suivi-mensuel-plus': ['distance', 'mixte', 'presentiel'],

  /* --- Documents : l'écrit suffit, sauf pour le dossier de candidature --- */
  'refonte-cv': ['distance', 'mixte'],
  'cv-lettre-motivation': ['distance', 'mixte'],

  /* --- Packs --- */
  'pack-demenagement': ['distance', 'mixte', 'domicile'],
  'pack-subside': ['distance', 'mixte', 'presentiel', 'domicile'],
  'pack-locataire': ['distance', 'mixte', 'presentiel'],
  'pack-administratif': ['distance', 'mixte', 'presentiel', 'domicile'],
};

/** Modalités proposées pour une prestation, dans l'ordre d'affichage. */
export function modalitesPour(slug: string): Modalite[] {
  const choisies = MODALITES_PAR_PRESTATION[slug] ?? PAR_DEFAUT;
  // L'ordre d'affichage est celui du tableau `modalites`, pas celui de la
  // déclaration : le parcours reste identique d'une prestation à l'autre.
  return modalites.filter((m) => choisies.includes(m.id)).map((m) => m.id);
}

/** Vrai si la prestation propose autre chose que le travail à distance. */
export function proposeDeplacement(slug: string): boolean {
  return modalitesPour(slug).some((id) => getModalite(id)?.deplacement);
}

/** Frais de déplacement retenus pour une commande. Zéro si inactifs. */
export function fraisDeplacement(modalite: Modalite, zoneId: string | undefined): number {
  if (!deplacement.fraisActifs) return 0;
  if (!getModalite(modalite)?.deplacement) return 0;
  const zone = zoneId ? getZone(zoneId) : undefined;
  return zone?.fraisProposes ?? 0;
}
