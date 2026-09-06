import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { BlogCard } from '@/components/BlogCard';
import { Reveal } from '@/components/ui/Reveal';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { getAllPosts } from '@/lib/blog';
import { buildMetadata, absoluteUrl } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Conseils : site web, assurances, logement et démarches en Suisse';
const description =
  "Des articles pratiques sur la création de site web, le référencement local, les assurances, le logement et les démarches administratives en Suisse romande.";
const path = '/blog';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'Conseils',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return (
    <>
      <PageHero
        eyebrow="Conseils"
        title="Des articles écrits pour être utiles"
        lead="Je publie ici les réponses aux questions qu’on me pose vraiment, sur le web comme sur l’administratif. Pas de contenu écrit pour remplir des pages."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Conseils', path },
        ]}
      />

      <Section tone="white">
        <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">Tous les articles</h2>

        {categories.length > 0 ? (
          <ul className="mb-10 mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li
                key={category}
                className="rounded-full bg-ink-50 px-3.5 py-1.5 text-sm text-ink-600"
              >
                {category}
              </li>
            ))}
          </ul>
        ) : null}

        {posts.length === 0 ? (
          <p className="text-ink-600">Les premiers articles arrivent prochainement.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 60}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <FinalCta
        title="Une question qui n’a pas encore son article ?"
        text="Écrivez-la moi. Si elle revient souvent, j’en fais un article, et en attendant je vous réponds directement."
        ctaLabel="Me poser ma question"
        ctaHref="/contact"
      />

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Conseils', path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Conseils — YG Services',
            url: absoluteUrl(path),
            inLanguage: 'fr-CH',
          },
        ]}
      />
    </>
  );
}
