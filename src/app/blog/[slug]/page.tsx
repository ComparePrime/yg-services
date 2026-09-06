import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { BlogCard } from '@/components/BlogCard';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { getAllPosts, getPost, formatDate } from '@/lib/blog';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { articleSchema, breadcrumbSchema } from '@/lib/structured-data';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    ...buildMetadata({
      title: post.metaTitle,
      description: post.metaDescription,
      path: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    }),
    title: post.metaTitle,
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <article>
        <header className="border-b border-ink-100 bg-sand pb-12 pt-10 sm:pb-16 sm:pt-14">
          <Container size="narrow">
            <nav aria-label="Fil d’Ariane">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
                <li>
                  <Link href="/" className="transition hover:text-ink-900">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="transition hover:text-ink-900">
                    Conseils
                  </Link>
                </li>
              </ol>
            </nav>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
              {post.category}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.15] text-ink-900 sm:text-[2.75rem]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">{post.description}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <Link href="/a-propos" className="font-medium text-ink-800 hover:text-accent-700">
                {post.author}
              </Link>
              <span aria-hidden="true">•</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">•</span>
              <span>{post.readingTime} min de lecture</span>
            </div>
          </Container>
        </header>

        <div className="py-14 sm:py-20">
          <Container size="narrow">
            {/* Contenu généré depuis nos propres fichiers Markdown, jamais depuis une saisie visiteur. */}
            <div className="prose-yg text-[17px]" dangerouslySetInnerHTML={{ __html: post.html }} />

            <aside className="mt-14 rounded-2xl bg-sand p-7 ring-1 ring-ink-200">
              <p className="font-display text-xl text-ink-900">
                Écrit par {siteConfig.person.fullName}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
                Je crée des sites web et j’accompagne les particuliers dans leurs démarches
                administratives et l’optimisation de leurs contrats, depuis Yverdon-les-Bains.
              </p>
              <Link
                href="/a-propos"
                className="mt-4 inline-block text-sm font-medium text-ink-900 underline underline-offset-4 hover:text-accent-700"
              >
                En savoir plus sur moi
              </Link>
            </aside>
          </Container>
        </div>
      </article>

      {related.length > 0 ? (
        <Section tone="white">
          <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">À lire aussi</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </Section>
      ) : null}

      <FinalCta />

      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.description,
            slug: post.slug,
            date: post.date,
            image: post.image,
          }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Conseils', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
    </>
  );
}
