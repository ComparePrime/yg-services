export type NavLink = { href: string; label: string };

/**
 * Les deux activités sont séparées dans la navigation : chacune a sa page,
 * sa clientèle et ses mots-clés. Elles ne sont jamais présentées ensemble.
 */
export const mainNav: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/sites-web', label: 'Sites internet' },
  { href: '/assistance-administrative', label: 'Services administratifs' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Sites internet',
    links: [
      { href: '/sites-web', label: 'Création de sites' },
      { href: '/sites-web#formules', label: 'Formules et tarifs' },
      { href: '/sites-web#referencement', label: 'Référencement' },
      { href: '/realisations', label: 'Réalisations' },
    ],
  },
  {
    title: 'Services administratifs',
    links: [
      { href: '/assistance-administrative', label: 'Catalogue des prestations' },
      { href: '/assistance-administrative/impots', label: 'Impôts' },
      { href: '/assistance-administrative/logement', label: 'Logement' },
      { href: '/assistance-administrative/documents', label: 'Courriers et documents' },
      { href: '/assistance-administrative/comptabilite', label: 'Comptabilité' },
    ],
  },
  {
    title: 'YG Services',
    links: [
      { href: '/a-propos', label: 'À propos' },
      { href: '/blog', label: 'Blog' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
      { href: '/mentions-legales', label: 'Mentions légales' },
      { href: '/conditions-prestations', label: 'Conditions de prestation' },
      { href: '/confidentialite', label: 'Confidentialité' },
    ],
  },
];

export const primaryCta: NavLink = { href: '/contact', label: 'Demander un devis' };
