export type NavLink = { href: string; label: string };

export const mainNav: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/sites-web', label: 'Sites web' },
  { href: '/admin-optimisation', label: 'Admin & optimisation' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/blog', label: 'Conseils' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Prestations',
    links: [
      { href: '/sites-web', label: 'Création de sites web' },
      { href: '/admin-optimisation', label: 'Admin & optimisation' },
      { href: '/admin-optimisation#assurances', label: 'Optimisation des assurances' },
      { href: '/admin-optimisation#logement', label: 'Logement & loyer' },
      { href: '/admin-optimisation#courriers', label: 'Rédaction de courriers' },
    ],
  },
  {
    title: 'À découvrir',
    links: [
      { href: '/realisations', label: 'Mes réalisations' },
      { href: '/a-propos', label: 'À propos' },
      { href: '/blog', label: 'Conseils' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Informations',
    links: [
      { href: '/mentions-legales', label: 'Mentions légales' },
      { href: '/confidentialite', label: 'Politique de confidentialité' },
    ],
  },
];

export const primaryCta: NavLink = { href: '/contact', label: 'Parlons de votre projet' };
