/**
 * Commandes de prestations : montants, validation et référence.
 *
 * Ce module est partagé entre le navigateur et le serveur. La validation
 * côté serveur refait l'intégralité des contrôles : rien de ce qui vient du
 * navigateur n'est tenu pour acquis, pas même le montant.
 */

import { getOption, getPrestation, type Prestation } from '@/config/catalogue';
import { champsPour, type Field } from '@/config/order-fields';
import { detailTva, formatChf, type DetailTva } from '@/config/tva';
import {
  deplacement,
  fraisDeplacement,
  getModalite,
  getZone,
  modalitesPour,
  proposeDeplacement,
  zones,
  type Modalite,
} from '@/config/intervention';

/** Comment une prestation peut être commandée. */
export type ModeCommande =
  /** Prix fixe : le montant est connu, la commande peut être réglée. */
  | 'ferme'
  /** Prix « dès » : montant confirmé après examen, puis facturé. */
  | 'apres-examen'
  /** Sur devis : aucune commande directe. */
  | 'devis';

export function modeCommande(prestation: Prestation): ModeCommande {
  if (prestation.prix === null) return 'devis';
  if (prestation.aPartirDe) return 'apres-examen';
  return 'ferme';
}

export type LigneTotal = { label: string; montant: number };

export type Total = {
  lignes: LigneTotal[];
  /** Somme des lignes, telle qu'affichée au catalogue. */
  sousTotal: number;
  tva: DetailTva;
  /** Récurrence éventuelle, reprise de la prestation. */
  recurrence?: 'mensuel';
};

/**
 * Calcule le total d'une commande à partir du catalogue seul.
 * Les identifiants d'options qui ne sont pas proposés par la prestation sont
 * ignorés : un total ne peut pas être gonflé depuis le navigateur.
 *
 * Les frais de déplacement apparaissent sur une ligne distincte, jamais
 * fondus dans le prix de la prestation, et valent zéro tant que
 * `deplacement.fraisActifs` est faux.
 */
export function calculerTotal(
  prestation: Prestation,
  optionsChoisies: string[],
  modalite?: Modalite,
  zoneId?: string,
): Total {
  const proposees = new Set(prestation.options ?? []);
  const lignes: LigneTotal[] = [];

  if (prestation.prix !== null) {
    lignes.push({ label: prestation.titre, montant: prestation.prix });
  }

  for (const id of optionsChoisies) {
    if (!proposees.has(id)) continue;
    const option = getOption(id);
    if (option) lignes.push({ label: option.label, montant: option.price });
  }

  // Les frais ne s'ajoutent que si la modalité est bien proposée par la
  // prestation : une modalité envoyée par le navigateur ne suffit pas.
  if (modalite && modalitesPour(prestation.slug).includes(modalite)) {
    const frais = fraisDeplacement(modalite, zoneId);
    if (frais > 0) {
      lignes.push({ label: `Déplacement — ${getZone(zoneId ?? '')?.nom ?? 'zone'}`, montant: frais });
    }
  }

  const sousTotal = lignes.reduce((somme, ligne) => somme + ligne.montant, 0);

  return {
    lignes,
    sousTotal,
    tva: detailTva(sousTotal),
    ...(prestation.recurrence ? { recurrence: prestation.recurrence } : {}),
  };
}

/* ------------------------------------------------------------------
   Charge utile
------------------------------------------------------------------- */

export type OrderPayload = {
  /** Slug de la prestation commandée. */
  prestation: string;
  /** Identifiants des options retenues. */
  options: string[];
  /** Modalité d'intervention retenue. */
  modalite?: Modalite;
  /** Zone de déplacement, lorsque la modalité en suppose un. */
  zone?: string;
  /** Réponses aux questions, indexées par nom de champ. */
  reponses: Record<string, string>;
  /** Acceptation des conditions de prestation. */
  conditions: boolean;
  /** Acceptation du traitement des données. */
  consentement: boolean;
  /** Champ piège anti-robot : doit rester vide. */
  societe?: string;
};

export type OrderErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NPA_RE = /^[1-9]\d{3}$/;

function validerChamp(champ: Field, brut: string | undefined): string | null {
  const valeur = (brut ?? '').trim();

  if (!valeur) {
    return champ.required ? 'Ce champ est nécessaire.' : null;
  }

  if (valeur.length > 4000) return 'Ce texte est trop long.';

  switch (champ.type) {
    case 'email':
      if (!EMAIL_RE.test(valeur)) return 'Cette adresse e-mail semble incorrecte.';
      break;

    case 'number': {
      const nombre = Number(valeur);
      if (!Number.isFinite(nombre)) return 'Indiquez un nombre.';
      if (champ.min !== undefined && nombre < champ.min) return `Minimum : ${champ.min}.`;
      if (champ.max !== undefined && nombre > champ.max) return `Maximum : ${champ.max}.`;
      break;
    }

    case 'date':
      if (Number.isNaN(Date.parse(valeur))) return 'Cette date semble incorrecte.';
      break;

    case 'select':
    case 'radio':
      if (champ.choices && !champ.choices.some((choix) => choix.value === valeur)) {
        return 'Choisissez une des réponses proposées.';
      }
      break;

    default:
      break;
  }

  if (champ.name === 'npa' && !NPA_RE.test(valeur)) {
    return 'Un NPA suisse compte quatre chiffres.';
  }

  return null;
}

/**
 * Validation complète d'une commande. Utilisée telle quelle par le serveur.
 * Renvoie un objet vide lorsque la commande est recevable.
 */
export function validerCommande(data: Partial<OrderPayload>): OrderErrors {
  const errors: OrderErrors = {};

  const prestation = data.prestation ? getPrestation(data.prestation) : undefined;
  if (!prestation) {
    return { prestation: 'Cette prestation n’existe pas.' };
  }

  if (modeCommande(prestation) === 'devis') {
    return { prestation: 'Cette prestation se commande après devis.' };
  }

  for (const champ of champsPour(prestation)) {
    const message = validerChamp(champ, data.reponses?.[champ.name]);
    if (message) errors[champ.name] = message;
  }

  const proposees = new Set(prestation.options ?? []);
  for (const id of data.options ?? []) {
    if (!proposees.has(id)) {
      errors.options = 'Une option retenue n’est pas proposée pour cette prestation.';
      break;
    }
  }

  // Modalité d'intervention. Le choix n'est EXIGÉ que si la prestation
  // propose une alternative, mais une modalité envoyée est toujours
  // contrôlée : sans cela, un déplacement pourrait être commandé sur une
  // prestation qui ne le propose pas.
  const disponibles = modalitesPour(prestation.slug);
  if (data.modalite && !disponibles.includes(data.modalite)) {
    errors.modalite = 'Cette modalité n’est pas proposée pour cette prestation.';
  } else if (disponibles.length > 1) {
    if (!data.modalite) {
      errors.modalite = 'Choisissez comment la prestation doit se dérouler.';
    } else if (getModalite(data.modalite)?.deplacement) {
      if (!data.zone) {
        errors.zone = 'Indiquez où le rendez-vous doit avoir lieu.';
      } else if (!zones.some((zone) => zone.id === data.zone)) {
        errors.zone = 'Cette zone n’est pas proposée.';
      }
    }
  }

  if (!data.conditions) {
    errors.conditions = 'L’acceptation des conditions de prestation est nécessaire.';
  }
  if (!data.consentement) {
    errors.consentement = 'Votre accord est nécessaire pour traiter la commande.';
  }

  return errors;
}

/* ------------------------------------------------------------------
   Référence
------------------------------------------------------------------- */

/**
 * Référence lisible, de la forme YG-26B4C7-K3M.
 * Elle ne sert qu'à retrouver un échange : elle ne protège aucun accès.
 */
export function referenceCommande(date = new Date()): string {
  const annee = String(date.getFullYear()).slice(-2);
  const horodatage = date.getTime().toString(36).toUpperCase().slice(-6);
  const alea = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `YG-${annee}${horodatage}-${alea}`;
}

/** Récapitulatif en texte, repris dans les courriels. */
export function recapitulatif(prestation: Prestation, total: Total): string[] {
  const lignes = total.lignes.map((ligne) => `  ${ligne.label} — ${formatChf(ligne.montant)}`);

  if (total.tva.taux !== null) {
    lignes.push(`  Hors TVA — ${formatChf(total.tva.horsTaxe)}`);
    lignes.push(`  TVA ${total.tva.taux} % — ${formatChf(total.tva.montantTva)}`);
  }

  const suffixe = total.recurrence === 'mensuel' ? ' par mois' : '';
  lignes.push(`  Total — ${formatChf(total.tva.total)}${suffixe}`);
  lignes.push(`  Délai indicatif — ${prestation.delai}`);

  return lignes;
}

/** Vrai si la prestation demande un choix de modalité au client. */
export function demandeModalite(prestation: Prestation): boolean {
  return modalitesPour(prestation.slug).length > 1;
}

/** Vrai si la prestation peut donner lieu à un déplacement. */
export { proposeDeplacement, deplacement };
