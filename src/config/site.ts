/**
 * Configuration centrale du site.
 * C'est le seul fichier à modifier pour changer les coordonnées, la
 * localisation, les réseaux sociaux ou les informations légales.
 *
 * Principe de communication : YG Services s'exprime comme une structure.
 * Aucune donnée personnelle de l'exploitant n'apparaît ici en dehors des
 * champs légaux, qui ne sont affichés que sur les pages Mentions légales et
 * Confidentialité, toutes deux en noindex.
 *
 * Les valeurs vides ("") sont des emplacements à compléter : elles ne sont pas
 * affichées sur le site tant qu'elles ne contiennent rien.
 */

export const siteConfig = {
  brand: 'YG Services',
  /** Raison affichée dans les textes institutionnels. */
  legalName: 'YG Services',
  /** Accroche de marque. Formulation neutre, sans première personne. */
  tagline: 'Simplifier vos démarches, construire votre présence en ligne.',
  positioning: 'Création de sites internet • Assistance administrative',

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yg-services.ch',
  domain: 'yg-services.ch',
  locale: 'fr_CH',
  lang: 'fr-CH',

  contact: {
    email: 'info@yg-services.ch' as string,
    /**
     * Aucun numéro de téléphone n'est publié. Le contact se fait par le
     * formulaire et par e-mail. Renseigner ce champ ferait réapparaître le
     * numéro sur le site, dans le pied de page et dans les données
     * structurées : ne le remplir qu'avec une ligne dédiée à l'activité.
     */
    phone: '' as string,
    phoneE164: '' as string,
    /** Adresse postale : à compléter uniquement si vous souhaitez la publier. */
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
    /** Page Facebook : coller l'adresse complète une fois la page créée. */
    facebook: '' as string,
    linkedin: '' as string,
  },

  /**
   * Informations légales.
   *
   * ATTENTION : ces champs identifient l'exploitant et sont requis par le
   * droit suisse dès lors que des prestations sont proposées en ligne. Ils ne
   * sont affichés que sur /mentions-legales et /confidentialite, qui sont en
   * noindex : ils ne remontent donc pas dans les résultats de recherche.
   * Ne rien inventer : laisser vide tant que l'information n'est pas confirmée.
   */
  legal: {
    /** Raison de commerce officielle, telle qu'inscrite le cas échéant. */
    companyName: '' as string,
    /** Personne responsable de la publication, au sens légal. */
    responsiblePublication: '' as string,
    ideNumber: '' as string,
    vatNumber: '' as string,
    address: '' as string,
    host: 'Netlify, Inc. (netlify.com)' as string,
    /** Pays d'hébergement, mentionné dans la politique de confidentialité. */
    hostCountry: 'États-Unis' as string,
  },

  /** Outils de mesure d'audience réellement utilisés. */
  analytics: {
    googleAnalytics: false as boolean,
    googleSearchConsole: false as boolean,
  },
} as const;

export type SiteConfig = typeof siteConfig;
