/**
 * Configuration centrale du site.
 * C'est le seul fichier à modifier pour changer les informations de contact,
 * la localisation, les réseaux sociaux ou les informations légales.
 *
 * Les valeurs vides ("") sont des emplacements à compléter : elles ne sont pas
 * affichées sur le site tant qu'elles ne contiennent rien.
 */

export const siteConfig = {
  brand: 'YG Services',
  legalName: 'YG Services — Yoann Guiot',
  signature: "Je crée, j'optimise et je simplifie.",
  positioning: 'Création web • Administration • Optimisation',

  person: {
    firstName: 'Yoann',
    lastName: 'Guiot',
    fullName: 'Yoann Guiot',
    jobTitle: 'Créateur de sites web et accompagnement administratif',
    /** Photo fournie par Yoann. Déposer le fichier dans /public/images/. */
    photo: '/images/yoann-guiot.jpg',
    /** Version carrée, pour les réseaux sociaux et les vignettes. */
    photoSquare: '/images/yoann-guiot-carre.jpg',
    photoAlt: 'Yoann Guiot, fondateur de YG Services à Yverdon-les-Bains',
  },

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yg-services.ch',
  domain: 'yg-services.ch',
  locale: 'fr_CH',
  lang: 'fr-CH',

  contact: {
    email: 'info@yg-services.ch' as string,
    /**
     * Numéro affiché et appelable.
     * `phone` est la forme lisible, `phoneE164` la forme internationale
     * utilisée pour le lien d'appel et les données structurées.
     * Laisser les deux vides pour n'être joignable que par WhatsApp.
     */
    phone: '078 772 39 19' as string,
    phoneE164: '+41787723919' as string,
    /**
     * WhatsApp. `display` est ce qui s'affiche, `international` sert au lien
     * wa.me et doit être au format international sans espace ni signe plus.
     */
    whatsapp: {
      display: '078 772 39 19',
      international: '41787723919',
    },
    /** Adresse postale complète : à compléter uniquement si vous souhaitez la publier. */
    postalAddress: '' as string,
  },

  location: {
    city: 'Yverdon-les-Bains',
    region: 'Vaud',
    country: 'Suisse',
    countryCode: 'CH',
    areaServed: [
      'Yverdon-les-Bains',
      'Nord vaudois',
      'Canton de Vaud',
      'Lausanne',
      'Neuchâtel',
      'Fribourg',
      'Genève',
      'Valais',
      'Jura',
      'Suisse romande',
    ],
    short: 'Yverdon-les-Bains • Vaud • Suisse romande',
  },

  social: {
    instagram: 'https://www.instagram.com/yg_services_/',
    instagramHandle: '@yg_services_',
    /**
     * Page Facebook : coller l'adresse complète de la page une fois créée.
     * Tant que ce champ est vide, aucun lien Facebook n'apparaît sur le site.
     */
    facebook: '' as string,
    /** À compléter si vous souhaitez afficher un profil LinkedIn. */
    linkedin: '' as string,
  },

  /**
   * Informations légales.
   * Ne rien inventer : laisser vide tant que l'information n'est pas confirmée.
   * Les champs vides s'affichent comme « à compléter » sur la page Mentions légales.
   */
  legal: {
    companyName: '' as string,
    ideNumber: '' as string,
    vatNumber: '' as string,
    address: '' as string,
    responsiblePublication: 'Yoann Guiot',
    /** Hébergeur du site. */
    host: 'Netlify, Inc. (netlify.com)' as string,
    /**
     * Pays d'hébergement des données, mentionné dans la politique de
     * confidentialité. Netlify est une société américaine.
     */
    hostCountry: 'États-Unis' as string,
  },

  /** Outils de mesure d'audience réellement utilisés (laisser vide si aucun). */
  analytics: {
    googleAnalytics: false as boolean,
    googleSearchConsole: false as boolean,
  },
} as const;

export type SiteConfig = typeof siteConfig;
