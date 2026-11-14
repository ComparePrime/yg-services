/**
 * Prestations détaillées des deux activités.
 * Structure évolutive : ajouter un objet crée une nouvelle section.
 * `disclaimer` affiche une mention de cadre, c'est-à-dire ce que la
 * prestation n'est pas.
 *
 * Ton : institutionnel. YG Services est le sujet des phrases, jamais une
 * personne.
 */

export type AdminService = {
  id: string;
  title: string;
  intro: string;
  items: string[];
  /** Bénéfice concret pour le client, affiché en évidence. */
  benefice: string;
  disclaimer?: string;
  cta: { href: string; label: string };
};

export const adminServices: AdminService[] = [
  {
    id: 'demarches',
    title: 'Démarches administratives',
    intro:
      'Certaines démarches sont simples sur le papier et deviennent vite compliquées dans la réalité : formulaires peu clairs, pièces à réunir, délais à tenir. YG Services vous accompagne du début à la fin.',
    benefice: 'Vous savez quoi faire, dans quel ordre, et vous ne ratez pas un délai.',
    items: [
      'Lecture et explication des courriers reçus',
      'Constitution de dossiers',
      'Remplissage de formulaires',
      'Suivi des délais et des échéances',
      'Préparation des pièces justificatives',
      'Accompagnement ponctuel ou régulier',
    ],
    disclaimer:
      'Il s’agit d’un accompagnement administratif et organisationnel. YG Services n’est ni avocat, ni notaire, ni conseiller juridique : lorsqu’une situation relève d’un professionnel agréé, cela vous est indiqué.',
    cta: { href: '/contact?sujet=administratif', label: 'Demander un accompagnement' },
  },
  {
    id: 'courriers',
    title: 'Rédaction de courriers',
    intro:
      'Vous savez ce que vous voulez dire, mais pas comment l’écrire. Vous expliquez la situation, YG Services rédige le courrier et l’ajuste après votre relecture.',
    benefice: 'Un courrier clair, daté, adapté au destinataire, prêt à être envoyé.',
    items: [
      'Courrier à une administration',
      'Courrier à une gérance ou un bailleur',
      'Courrier à une entreprise ou un fournisseur',
      'Résiliation de contrat',
      'Réclamation et contestation',
      'Demande de remboursement',
      'Demande d’information',
      'Mise en demeure',
    ],
    cta: { href: '/contact?sujet=courrier', label: 'Faire rédiger un courrier' },
  },
  {
    id: 'documents',
    title: 'Organisation et gestion documentaire',
    intro:
      'Les papiers s’accumulent et on ne retrouve plus rien au moment où il le faudrait. YG Services met en place un classement simple, que vous pourrez tenir ensuite sans effort.',
    benefice: 'Vous retrouvez un document en moins d’une minute, et vous savez quoi jeter.',
    items: [
      'Tri et classement des documents',
      'Mise en place d’une organisation durable',
      'Numérisation et archivage',
      'Durées de conservation',
      'Mise en forme de documents',
      'Saisie et traitement de données',
      'Suivi des échéances récurrentes',
    ],
    cta: { href: '/contact?sujet=documents', label: 'Organiser mes documents' },
  },
  {
    id: 'logement',
    title: 'Démarches liées au logement',
    intro:
      'Un déménagement, un dossier de location, un courrier à la gérance : ce sont des démarches où quelques documents bien préparés changent beaucoup de choses.',
    benefice: 'Un dossier complet et des courriers envoyés dans les formes et les délais.',
    items: [
      'Constitution d’un dossier de location',
      'Courrier au bailleur ou à la gérance',
      'Résiliation de bail',
      'Préparation d’un état des lieux',
      'Changement d’adresse',
      'Organisation des documents du logement',
    ],
    disclaimer:
      'YG Services prépare et formule vos démarches. Aucun résultat ne peut être garanti : cela dépend de votre contrat et de votre situation. Un dossier qui nécessite un avis juridique vous est signalé.',
    cta: { href: '/contact?sujet=logement', label: 'Préparer ma démarche' },
  },
  {
    id: 'situation',
    title: 'Changements de situation',
    intro:
      'Une naissance, un mariage, un déménagement, un changement professionnel : chaque changement déclenche une série de démarches, souvent dans un ordre précis et avec des délais.',
    benefice: 'Une liste personnalisée, dans l’ordre, pour ne rien oublier.',
    items: [
      'Naissance et arrivée d’un enfant',
      'Mariage',
      'Changement d’adresse',
      'Changement de situation professionnelle',
      'Allocations familiales',
      'Mise à jour des dossiers existants',
    ],
    cta: { href: '/contact?sujet=administratif', label: 'Préparer mes démarches' },
  },
  {
    id: 'impots',
    title: 'Préparation des documents fiscaux',
    intro:
      'Beaucoup de temps se perd à chercher les bons documents. YG Services prépare un dossier complet et ordonné avant qu’il soit transmis à qui de droit.',
    benefice: 'Un dossier prêt, complet, avec la liste de ce qui manque encore.',
    items: [
      'Checklist personnalisée',
      'Rassemblement des justificatifs',
      'Identification des documents manquants',
      'Classement du dossier',
      'Préparation des questions pour une fiduciaire',
    ],
    disclaimer:
      'YG Services n’est ni fiscaliste, ni fiduciaire, ni conseiller fiscal. La prestation est administrative et organisationnelle : elle prépare le travail, elle ne le remplace pas.',
    cta: { href: '/contact?sujet=impots', label: 'Préparer mon dossier' },
  },
];

/** Étapes d'un projet de site internet. */
export const webProcess = [
  { step: '01', title: 'Analyse', text: 'Compréhension de votre activité, de vos objectifs et de ce que le site doit réellement apporter.' },
  { step: '02', title: 'Structure', text: 'Architecture des pages et parcours du visiteur, de son arrivée jusqu’à sa prise de contact.' },
  { step: '03', title: 'Design', text: 'Interface moderne, sobre et lisible, pensée d’abord pour le mobile.' },
  { step: '04', title: 'Développement', text: 'Développement du site, page par page, avec un code propre et maintenable.' },
  { step: '05', title: 'Référencement', text: 'Optimisation de la structure technique et des contenus pour que vos pages soient trouvées.' },
  { step: '06', title: 'Mise en ligne', text: 'Configuration du nom de domaine, de l’hébergement et publication du site.' },
  { step: '07', title: 'Évolution', text: 'Maintenance et améliorations après la mise en ligne.' },
];

/** Éléments de réassurance, communs aux deux activités. */
export const reassurance = [
  {
    title: 'Un interlocuteur unique',
    text: 'Un seul contact du premier message à la livraison, sans service commercial intermédiaire.',
  },
  {
    title: 'Un devis fixé à l’avance',
    text: 'Le montant est annoncé avant le début du travail et ne bouge pas sans votre accord.',
  },
  {
    title: 'Des réponses claires',
    text: 'Pas de jargon : ce qui est fait, pourquoi, et ce que cela implique pour vous.',
  },
  {
    title: 'Un périmètre annoncé',
    text: 'Lorsqu’une demande sort du cadre des prestations, cela vous est dit, avec une orientation utile.',
  },
  {
    title: 'Une confidentialité stricte',
    text: 'Vos documents ne servent qu’à traiter votre demande et sont supprimés sur simple demande.',
  },
  {
    title: 'Une réponse rapide',
    text: 'Chaque demande reçoit une réponse sous 24 à 48 heures ouvrables, sans relance commerciale.',
  },
];
