import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

const baseUrl = siteConfig.url.replace(/\/$/, '');

export function absoluteUrl(path = '/') {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Construit les métadonnées d'une page : title, description, canonical,
 * Open Graph et Twitter Card. Chaque page fournit son propre couple
 * title / description : aucun contenu n'est dupliqué.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = '/opengraph-image',
  type = 'website',
  publishedTime,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  /** Par défaut, l'image générée par app/opengraph-image.tsx. */
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    openGraph: {
      type: type === 'profile' ? 'profile' : type,
      title,
      description,
      url,
      siteName: siteConfig.brand,
      locale: siteConfig.locale,
      ...(image ? { images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [absoluteUrl(image)] } : {}),
    },
  };
}
