/**
 * Transmission sécurisée des documents.
 *
 * PRINCIPE : aucun document ne transite par ce site. Le site ne stocke
 * rien, ne sert aucun fichier et n'expose aucun lien de téléchargement.
 * Les pièces sont déposées par le client sur une boîte de dépôt kDrive
 * (Infomaniak), dont les données sont hébergées en Suisse.
 *
 * POURQUOI UNE BOÎTE DE DÉPÔT ET NON UN LIEN DE PARTAGE
 * Une boîte de dépôt n'autorise que l'envoi : celui qui possède le lien
 * peut déposer un fichier, mais ne peut ni lister, ni ouvrir, ni
 * télécharger ce qui s'y trouve. Un lien de dépôt qui fuite permet donc
 * de recevoir un fichier indésirable, pas de lire les documents d'un
 * client. Un lien de partage, à l'inverse, donne accès au contenu : il ne
 * doit JAMAIS être utilisé pour des documents sensibles.
 *
 * DEUX MODES D'EXPLOITATION, selon ce qui est configuré :
 *   1. `depot.url` renseignée → une boîte commune. Le lien est transmis
 *      au client avec sa référence de commande, qu'il indique dans le nom
 *      de ses fichiers. Mise en place immédiate, un seul lien à gérer.
 *   2. `depotParCommande` à true → un lien propre à chaque commande,
 *      collé depuis le tableau de bord sur la fiche de la commande. Plus
 *      cloisonné, mais une boîte à créer par dossier.
 * Les deux peuvent cohabiter : le lien propre à une commande, lorsqu'il
 * existe, prend le pas sur le lien commun.
 *
 * TANT QUE RIEN N'EST CONFIGURÉ, le site ne promet aucun dépôt : il
 * annonce que les pièces seront demandées par un message séparé. Aucune
 * affirmation fausse n'est affichée au client.
 */

export const documents = {
  /**
   * Adresse de la boîte de dépôt commune.
   * À renseigner après création de la boîte dans le Manager Infomaniak.
   * Laisser vide désactive proprement l'affichage du dépôt.
   */
  depotUrl: '' as string,

  /** Un lien propre à chaque commande est saisi depuis le tableau de bord. */
  depotParCommande: true as boolean,

  /**
   * La boîte est-elle protégée par un mot de passe ?
   * Recommandé. Le mot de passe est communiqué séparément du lien.
   */
  depotProtege: true as boolean,

  /** Durée de validité annoncée du lien de dépôt. */
  validiteLien: '30 jours',

  /**
   * Durée de conservation annoncée au client.
   * À confirmer : les pièces comptables ont une durée légale propre.
   */
  conservation: {
    dossierCourant: 'Jusqu’à la fin du mandat, puis suppression sur demande.',
    piecesComptables:
      'Les pièces relevant d’une obligation de conservation légale sont gardées le temps prévu par la loi.',
    suppression: 'Vous pouvez demander la suppression de vos documents à tout moment.',
  },

  /** Taille maximale indicative acceptée par dépôt. */
  tailleMax: '2 Go par dépôt',

  /**
   * Ce qui ne doit JAMAIS être envoyé par le formulaire de contact, dont
   * la pièce jointe part par courriel et reste dans la boîte de réception.
   */
  jamaisParCourriel: [
    'certificats de salaire et relevés bancaires',
    'frais médicaux et attestations d’assurance maladie',
    'pièces d’identité et permis de séjour',
    'décisions de subside ou dossiers sociaux',
  ],

  /** Marche à suivre affichée au client. */
  etapes: [
    'Vous recevez le lien de dépôt dans le message de confirmation de votre commande.',
    'Vous nommez vos fichiers en commençant par votre référence de commande.',
    'Vous déposez vos pièces : elles partent directement sur un espace hébergé en Suisse, sans passer par ce site.',
    'Une notification signale le dépôt, et les pièces manquantes vous sont indiquées s’il en manque.',
  ],

  /** Propriétés de sécurité, affichées pour que le client sache à quoi s’en tenir. */
  garanties: [
    'Les données sont hébergées en Suisse, chez Infomaniak, sous droit suisse.',
    'Le transfert est chiffré, et les fichiers sont chiffrés au repos sur l’espace de stockage.',
    'Le lien ne permet que d’envoyer : il ne donne accès à aucun document, ni au vôtre ni à celui d’un autre.',
    'Aucun document n’est stocké sur ce site, et aucun lien de téléchargement n’y est publié.',
    'Aucun document n’est transmis à un tiers sans votre accord.',
  ],
};

/** Le dépôt peut-il être annoncé au client ? */
export function depotDisponible(lienCommande?: string): boolean {
  return Boolean(lienCommande || documents.depotUrl);
}

/** Lien à communiquer pour une commande donnée. */
export function lienDepot(lienCommande?: string): string | null {
  return lienCommande || documents.depotUrl || null;
}
