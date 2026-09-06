/**
 * Les trois formules de création de site web.
 * Les tarifs sont volontairement isolés ici pour être modifiés en une minute.
 * `price: null` affiche « Sur devis ».
 *
 * IMPORTANT : les montants ci-dessous sont des valeurs de départ à confirmer.
 * Remplacez-les par vos tarifs réels avant la mise en ligne.
 */

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  /** Prix de départ en CHF. `null` = sur devis. */
  price: number | null;
  priceNote: string;
  features: string[];
  highlight?: string;
  cta: { href: string; label: string };
};

export const plans: Plan[] = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    tagline: 'Pour une présence web professionnelle, claire et rapide à mettre en place.',
    price: 1490,
    priceNote: 'À partir de',
    features: [
      'Site vitrine sur mesure',
      'Design responsive (mobile, tablette, ordinateur)',
      'Plusieurs pages structurées',
      'Formulaire de contact',
      'Optimisation mobile et performance',
      'SEO de base (titres, métadonnées, structure)',
      'Mise en ligne complète',
      'Configuration technique (domaine, hébergement, e-mails)',
    ],
    cta: { href: '/contact?sujet=creer-site', label: 'Demander un devis' },
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Pour développer votre visibilité et transformer les visites en demandes.',
    price: 2900,
    priceNote: 'À partir de',
    highlight: 'La plus populaire',
    features: [
      'Tout ce qui est inclus dans Essentiel',
      'Design entièrement personnalisé',
      'SEO avancé et référencement local',
      'Blog / section conseils',
      'Formulaires avancés (étapes, pièces jointes)',
      'Optimisation de la conversion',
      'Intégrations (agenda, e-mail, outils externes)',
      'Configuration de la Search Console',
      'Analyse des performances',
      'Accompagnement renforcé après la mise en ligne',
    ],
    cta: { href: '/contact?sujet=creer-site', label: 'Demander un devis' },
  },
  {
    id: 'sur-mesure',
    name: 'Sur mesure',
    tagline: 'Pour les projets qui demandent des fonctionnalités spécifiques.',
    price: null,
    priceNote: 'Sur devis',
    features: [
      'Boutique en ligne (e-commerce)',
      'Système de réservation',
      'Espace client',
      'Automatisations de tâches',
      'Connexions API',
      'Intégrations avec vos outils métier',
      'Fonctionnalités développées spécifiquement',
      'Accompagnement sur la durée',
    ],
    cta: { href: '/contact?sujet=creer-site', label: 'Décrire mon projet' },
  },
];

/** Tableau comparatif. `true` / `false` / texte libre. */
export type ComparisonRow = {
  label: string;
  essentiel: boolean | string;
  pro: boolean | string;
  surMesure: boolean | string;
};

export const comparison: ComparisonRow[] = [
  { label: 'Design responsive', essentiel: true, pro: true, surMesure: true },
  { label: 'Nombre de pages', essentiel: 'Jusqu’à 5', pro: 'Jusqu’à 12', surMesure: 'Illimité' },
  { label: 'Design personnalisé', essentiel: 'Base soignée', pro: true, surMesure: true },
  { label: 'Formulaire de contact', essentiel: true, pro: 'Avancé', surMesure: 'Sur mesure' },
  { label: 'SEO', essentiel: 'De base', pro: 'Avancé + local', surMesure: 'Avancé + local' },
  { label: 'Blog / conseils', essentiel: false, pro: true, surMesure: true },
  { label: 'Mesure d’audience', essentiel: false, pro: true, surMesure: true },
  { label: 'Google Search Console', essentiel: false, pro: true, surMesure: true },
  { label: 'Automatisations', essentiel: false, pro: 'Simples', surMesure: true },
  { label: 'E-commerce', essentiel: false, pro: false, surMesure: true },
  { label: 'Fonctionnalités spécifiques', essentiel: false, pro: false, surMesure: true },
  { label: 'Maintenance', essentiel: 'Sur demande', pro: 'Sur demande', surMesure: 'Incluse la 1re année' },
  { label: 'Accompagnement', essentiel: 'À la mise en ligne', pro: 'Renforcé', surMesure: 'Sur la durée' },
];
