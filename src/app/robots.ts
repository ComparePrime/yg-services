import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    // /commande et /admin sont exclus : les pages de commande sont des
    // doublons des fiches, et le tableau de bord contient des données de
    // clients. L'exclusion vient en plus du noindex et de l'authentification.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin', '/commande/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
