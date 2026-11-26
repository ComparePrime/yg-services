import { siteConfig } from '@/config/site';
import { absoluteUrl } from './seo';
import { socialProfileUrls } from './contact-links';

/**
 * Données structurées schema.org.
 *
 * L'entité déclarée est l'organisation YG Services, jamais une personne :
 * aucun bloc `Person`, aucun `founder`, aucune photo de personne. Les articles
 * sont attribués à l'organisation.
 *
 * Règle : aucune information d'entreprise inventée. Les champs non confirmés
 * (téléphone, adresse, numéro IDE) ne sont ajoutés que s'ils sont renseignés
 * dans la configuration du site.
 */

const ORGANISATION_ID = absoluteUrl('/#organisation');

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ORGANISATION_ID,
    name: siteConfig.brand,
    legalName: siteConfig.legal.companyName || siteConfig.legalName,
    url: absoluteUrl('/'),
    description:
      'Création de sites internet pour indépendants, PME et particuliers, et assistance administrative aux particuliers. Yverdon-les-Bains et Suisse romande.',
    slogan: siteConfig.tagline,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/images/logo-yg-horizontal.png'),
    },
    image: absoluteUrl('/images/logo-yg-horizontal.png'),
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    ...(siteConfig.contact.phoneE164 ? { telephone: siteConfig.contact.phoneE164 } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.countryCode,
      ...(siteConfig.legal.address ? { streetAddress: siteConfig.legal.address } : {}),
    },
    areaServed: siteConfig.location.areaServed.map((name) => ({ '@type': 'Place', name })),
    knowsLanguage: ['fr-CH'],
    sameAs: socialProfileUrls(),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Demandes et devis',
      ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
      availableLanguage: ['fr'],
      areaServed: 'CH',
    },
  };
}

/** Catalogue des prestations, utile aux moteurs génératifs. */
export function serviceSchema({
  name,
  description,
  path,
  prestations,
}: {
  name: string;
  description: string;
  path: string;
  prestations: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absoluteUrl(path)}#service`,
    name,
    description,
    url: absoluteUrl(path),
    provider: { '@id': ORGANISATION_ID },
    areaServed: siteConfig.location.areaServed.map((label) => ({ '@type': 'Place', name: label })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: absoluteUrl('/contact'),
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name,
      itemListElement: prestations.map((prestation) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: prestation },
      })),
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: absoluteUrl('/'),
    name: siteConfig.brand,
    inLanguage: siteConfig.lang,
    publisher: { '@id': ORGANISATION_ID },
  };
}

export function webPageSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: siteConfig.lang,
    isPartOf: { '@id': absoluteUrl('/#website') },
    about: { '@id': ORGANISATION_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function articleSchema({
  title,
  description,
  slug,
  date,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    inLanguage: siteConfig.lang,
    // L'organisation est l'auteur : aucune personne n'est déclarée.
    author: { '@id': ORGANISATION_ID },
    publisher: { '@id': ORGANISATION_ID },
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
    ...(image ? { image: absoluteUrl(image) } : {}),
  };
}
