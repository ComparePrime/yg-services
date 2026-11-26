/**
 * Régime de TVA appliqué aux prix du catalogue.
 *
 * ÉTAT ACTUEL : YG Services n'est pas assujettie à la TVA. Les prix du
 * catalogue sont donc des prix nets, et aucune TVA n'est facturée ni
 * mentionnée sur les factures.
 *
 * SEUIL LÉGAL : l'assujettissement devient obligatoire dès que le chiffre
 * d'affaires annuel provenant de prestations imposables atteint
 * CHF 100'000. Pour une activité qui démarre, l'assujettissement court dès
 * le début si ce montant est prévisible sur douze mois.
 *
 * POUR BASCULER, le jour où l'assujettissement devient nécessaire :
 *   1. `assujetti: true`
 *   2. renseigner `numero` (format CHE-123.456.789 TVA)
 *   3. choisir `mode` :
 *        'incluse' → les prix du catalogue restent inchangés et la TVA est
 *                    extraite du montant affiché (recommandé pour une
 *                    clientèle de particuliers : aucun prix ne bouge) ;
 *        'ajoutee' → la TVA s'ajoute au prix affiché (clientèle B2B).
 * Aucun prix du catalogue n'a besoin d'être retouché dans un cas comme
 * dans l'autre : l'affichage et le détail de facture s'adaptent seuls.
 */

export const tva = {
  assujetti: false as boolean,
  /** Taux normal en vigueur, en pourcentage. */
  taux: 8.1,
  /** Numéro de TVA, affiché uniquement si `assujetti` est vrai. */
  numero: '' as string,
  /** Lecture des prix du catalogue lorsque l'assujettissement est actif. */
  mode: 'incluse' as 'incluse' | 'ajoutee',
  /** Seuil d'assujettissement obligatoire, en CHF. */
  seuilAssujettissement: 100_000,
  /**
   * Seuils d'alerte, en CHF de chiffre d'affaires cumulé sur l'année civile.
   * À chaque franchissement, un courriel part une seule fois vers la boîte
   * de YG Services. Le calcul se fait sur les commandes enregistrées, à la
   * réception de chaque nouvelle commande et à chaque paiement confirmé.
   */
  seuilsAlerte: [70_000, 90_000, 100_000],
};

export type DetailTva = {
  /** Montant hors taxe. */
  horsTaxe: number;
  /** Montant de la TVA. */
  montantTva: number;
  /** Total dû par le client. */
  total: number;
  /** Taux appliqué, ou `null` hors assujettissement. */
  taux: number | null;
};

const arrondi = (valeur: number) => Math.round(valeur * 100) / 100;

/**
 * Décompose un montant du catalogue selon le régime en vigueur.
 * Hors assujettissement, le total est le montant affiché et la TVA est nulle.
 */
export function detailTva(montantCatalogue: number): DetailTva {
  if (!tva.assujetti) {
    return { horsTaxe: montantCatalogue, montantTva: 0, total: montantCatalogue, taux: null };
  }

  const facteur = tva.taux / 100;

  if (tva.mode === 'incluse') {
    const horsTaxe = arrondi(montantCatalogue / (1 + facteur));
    return {
      horsTaxe,
      montantTva: arrondi(montantCatalogue - horsTaxe),
      total: montantCatalogue,
      taux: tva.taux,
    };
  }

  const montantTva = arrondi(montantCatalogue * facteur);
  return {
    horsTaxe: montantCatalogue,
    montantTva,
    total: arrondi(montantCatalogue + montantTva),
    taux: tva.taux,
  };
}

/** Mention affichée sous les prix et reprise sur les récapitulatifs. */
export function mentionTva(): string {
  if (!tva.assujetti) {
    return 'Prix nets, en francs suisses. YG Services n’est pas assujettie à la TVA : aucune TVA n’est facturée.';
  }

  const taux = tva.taux.toLocaleString('fr-CH', { minimumFractionDigits: 1 });
  return tva.mode === 'incluse'
    ? `Prix en francs suisses, TVA ${taux} % incluse.`
    : `Prix en francs suisses, hors TVA. La TVA de ${taux} % s’ajoute au total.`;
}

/** Formate un montant en CHF selon l'usage suisse. */
export const formatChf = (montant: number) =>
  `CHF ${montant.toLocaleString('fr-CH', {
    minimumFractionDigits: Number.isInteger(montant) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
