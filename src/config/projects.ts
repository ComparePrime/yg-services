/**
 * Portfolio évolutif.
 * Pour ajouter une réalisation : copier un objet et l'ajouter au tableau.
 * Aucune autre modification n'est nécessaire, les pages se mettent à jour seules.
 *
 * Règle : ne renseigner que des informations vérifiables.
 * Aucun chiffre de résultat commercial n'est affiché tant qu'il n'est pas confirmé.
 */

export type Project = {
  slug: string;
  name: string;
  url: string;
  category: 'Création web' | 'Génération de demandes' | 'E-commerce' | 'Autre';
  summary: string;
  description: string[];
  services: string[];
  technologies: string[];
  /** Capture d'écran à déposer dans /public/images/realisations/. */
  image: string;
  imageAlt: string;
  /** Année de réalisation, affichée telle quelle. */
  year: string;
  cta: { href: string; label: string };
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: 'jolie-creation',
    name: 'Jolie Création',
    url: 'https://jolie-creation.com/',
    category: 'Création web',
    summary:
      'Un site de présentation pensé pour mettre en valeur des créations et faciliter la prise de contact.',
    description: [
      "J'ai pris en charge la conception et le développement du site, de la structure des pages jusqu'à la mise en ligne.",
      "L'objectif était d'obtenir un site clair, agréable à parcourir sur mobile, et facile à faire évoluer au fil des nouvelles créations.",
    ],
    services: [
      'Architecture des pages',
      'Design et interface',
      'Développement',
      'Responsive mobile',
      'Mise en ligne',
    ],
    technologies: ['HTML / CSS', 'JavaScript', 'Hébergement et nom de domaine'],
    image: '/images/realisations/jolie-creation.svg',
    imageAlt: 'Aperçu du site Jolie Création',
    year: '',
    cta: { href: 'https://jolie-creation.com/', label: 'Voir le site' },
    featured: true,
  },
  {
    slug: 'compareprime',
    name: 'ComparePrime',
    url: 'https://compareprime.ch/',
    category: 'Génération de demandes',
    summary:
      "Une plateforme romande qui permet à un particulier de demander une analyse personnalisée de son assurance maladie et de ses besoins de couverture.",
    description: [
      "J'ai conçu et développé la plateforme dans son ensemble : parcours utilisateur, formulaire de demande, contenus et mise en ligne.",
      "Le site a un objectif précis : permettre à un visiteur d'expliquer sa situation en quelques étapes, puis d'être mis en relation avec un conseiller qui traite sa demande.",
      "Le travail a porté sur la clarté du parcours, la simplicité du formulaire et le référencement des pages.",
    ],
    services: [
      'Parcours utilisateur',
      'Formulaire de demande en plusieurs étapes',
      'SEO',
      'Génération de demandes de contact',
      'Optimisation de la conversion',
      'Développement complet',
    ],
    technologies: ['Next.js', 'Formulaires et traitement des demandes', 'SEO technique'],
    image: '/images/realisations/compareprime.svg',
    imageAlt: 'Aperçu de la plateforme ComparePrime',
    year: '',
    cta: { href: 'https://compareprime.ch/', label: 'Voir le site' },
    featured: true,
  },
  {
    slug: 'devis-rapide',
    name: 'Devis-Rapide',
    url: 'https://devis-rapide.ch/',
    category: 'Génération de demandes',
    summary:
      'Un site orienté demande de devis, pensé pour que le visiteur décrive son besoin en quelques clics.',
    description: [
      "J'ai développé le site autour d'un objectif unique : obtenir des demandes de devis complètes et exploitables.",
      "Le parcours a été simplifié au maximum et les pages travaillées pour le référencement local.",
    ],
    services: [
      'Parcours de demande de devis',
      'Formulaire',
      'SEO local',
      'Optimisation de la conversion',
      'Développement complet',
    ],
    technologies: ['Next.js', 'Formulaires', 'SEO local'],
    image: '/images/realisations/devis-rapide.svg',
    imageAlt: 'Aperçu du site Devis-Rapide',
    year: '',
    cta: { href: 'https://devis-rapide.ch/', label: 'Voir le site' },
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
