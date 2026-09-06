import { siteConfig } from '@/config/site';
import { absoluteUrl } from './seo';
import { socialProfileUrls } from './contact-links';

/**
 * Données structurées schema.org.
 * Règle : aucune information d'entreprise inventée. Les champs non confirmés
 * (téléphone, adresse, numéro IDE) ne sont ajoutés que s'ils sont renseignés
 * dans la configuration du site.
 */

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': absoluteUrl('/#yoann-guiot'),
    name: siteConfig.person.fullName,
    givenName: siteConfig.person.firstName,
    familyName: siteConfig.person.lastName,
    jobTitle: siteConfig.person.jobTitle,
    url: absoluteUrl('/a-propos'),
    image: absoluteUrl(siteConfig.person.photo),
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.countryCode,
    },
    worksFor: { '@id': absoluteUrl('/#yg-services') },
    sameAs: socialProfileUrls(),
  };
}

export function professionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': absoluteUrl('/#yg-services'),
    name: siteConfig.brand,
    url: absoluteUrl('/'),
    description:
      "Création de sites web, accompagnement administratif et optimisation de contrats et de dépenses, à Yverdon-les-Bains et en Suisse romande.",
    slogan: siteConfig.signature,
    founder: { '@id': absoluteUrl('/#yoann-guiot') },
    image: absoluteUrl(siteConfig.person.photo),
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    ...(siteConfig.contact.phone || siteConfig.contact.whatsapp.international
      ? { telephone: siteConfig.contact.phone || `+${siteConfig.contact.whatsapp.international}` }
      : {}),
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
    publisher: { '@id': absoluteUrl('/#yoann-guiot') },
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
    about: { '@id': absoluteUrl('/#yg-services') },
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
    author: { '@id': absoluteUrl('/#yoann-guiot') },
    publisher: { '@id': absoluteUrl('/#yg-services') },
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
    ...(image ? { image: absoluteUrl(image) } : {}),
  };
}
