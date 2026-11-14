export type NavLink = { href: string; label: string };

/**
 * Les deux activités sont séparées dans la navigation : chacune a sa page,
 * sa clientèle et ses mots-clés. Elles ne sont jamais présentées ensemble.
 */
export const mainNav: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/sites-web', label: 'Sites internet' },
  { href: '/assistance-administrative', label: 'Assistance administrative' },
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
    title: 'Assistance administrative',
    links: [
      { href: '/assistance-administrative', label: 'Démarches administratives' },
      { href: '/assistance-administrative#courriers', label: 'Rédaction de courriers' },
      { href: '/assistance-administrative#documents', label: 'Organisation de documents' },
      { href: '/assistance-administrative#logement', label: 'Logement' },
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
      { href: '/confidentialite', label: 'Confidentialité' },
    ],
  },
];

export const primaryCta: NavLink = { href: '/contact', label: 'Demander un devis' };
