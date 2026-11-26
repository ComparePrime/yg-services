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
  positioning: 'Création de sites internet • Assistance administrative, à distance ou sur place',

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
    registeredInCommercialRegister: false as boolean,
    companyName: '' as string,
    /**
     * Exploitant du site, au sens de l'art. 3 al. 1 let. s LCD.
     *
     * Cette mention n'est PAS du marketing : elle est l'identification du
     * fournisseur, légalement exigée dès lors que le site vend des
     * prestations en ligne. Elle ne figure que sur cette page et n'est
     * reprise ni sur l'accueil, ni sur les fiches, ni dans le blog, ni
     * dans les données structurées, ni dans les balises SEO.
     *
     * À VALIDER : pour une activité en nom propre, les sources consultées
     * exigent « l'identité » de l'exploitant sans préciser si le prénom
     * est nécessaire lorsque l'activité n'est pas inscrite au registre du
     * commerce. Le nom de famille figure ici ; voir
     * docs/07-mentions-legales-a-valider.md.
     */
    operator: 'Guiot' as string,
    responsiblePublication: '' as string,
    ideNumber: '' as string,
    vatNumber: '' as string,
    /** Adresse de contact exigée par l'art. 3 al. 1 let. s LCD. */
    address: 'Avenue Général Guisan 61, 1400 Yverdon-les-Bains, Suisse' as string,
    host: 'Netlify, Inc. (netlify.com)' as string,
    hostCountry: 'États-Unis' as string,
  },

  /** Outils de mesure d'audience réellement utilisés. */
  analytics: {
    googleAnalytics: false as boolean,
    googleSearchConsole: false as boolean,
  },
} as const;

export type SiteConfig = typeof siteConfig;
