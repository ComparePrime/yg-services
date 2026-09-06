import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { absoluteUrl } from '@/lib/seo';

/** Plan du site, généré automatiquement (les articles s'y ajoutent seuls). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/sites-web', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/admin-optimisation', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/realisations', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/a-propos', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
  ];
  // Les pages légales sont en noindex : elles n'ont pas leur place dans le plan du site.

  return [
    ...pages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...getAllPosts().map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
