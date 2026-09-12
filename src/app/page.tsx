import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { NeedSearch } from '@/components/sections/NeedSearch';
import { Universes } from '@/components/sections/Universes';
import { FinalCta } from '@/components/sections/FinalCta';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/Check';
import { PortfolioCard } from '@/components/PortfolioCard';
import { BlogCard } from '@/components/BlogCard';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { featuredProjects } from '@/config/projects';
import { getAllPosts } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { webPageSchema } from '@/lib/structured-data';

const title = 'Création web, administration & optimisation en Suisse romande';
const description =
  "Je crée des sites web de A à Z et j'accompagne les particuliers dans leurs démarches administratives et l'optimisation de leurs assurances. Yverdon-les-Bains.";

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path: '/' }),
  title: { absolute: 'Création web & aide administrative | YG Services' },
};

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <NeedSearch />
      <Universes />

      {/* « Je ne sais pas ce qu'il me faut » */}
      <Section tone="sand" size="narrow">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
            Vous ne savez pas exactement ce qu’il vous faut&nbsp;?
          </h2>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-600">
            <p>Ce n’est pas un problème.</p>
            <p>
              Vous pouvez simplement m’expliquer votre situation, même si vous ne savez pas quelle
              démarche effectuer ou quel service choisir.
            </p>
            <p>Je regarde avec vous ce qui peut être fait et je vous indique la suite.</p>
          </div>
          <Button href="/contact" size="lg" className="mt-8">
            Me parler de mon besoin
            <ArrowRight />
          </Button>
        </div>
      </Section>

      {/* Yoann */}
      <Section tone="white">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
              Bonjour, moi c’est Yoann.
            </h2>
            <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink-600">
              <p>
                Je suis Yoann Guiot, basé à {siteConfig.location.city}. J’aime comprendre comment
                les choses fonctionnent, trouver des solutions et surtout simplifier ce qui paraît
                compliqué.
              </p>
              <p>
                C’est exactement l’idée derrière {siteConfig.brand} : réunir mes compétences dans le
                digital, l’administration et l’optimisation pour proposer une aide simple et
                directe.
              </p>
              <p>
                Pas besoin de savoir exactement ce qu’il vous faut. Vous m’expliquez votre situation
                et on regarde ensemble.
              </p>
            </div>
            <Button href="/a-propos" variant="secondary" className="mt-8">
              En savoir plus sur moi
              <ArrowRight />
            </Button>
          </div>

          <div className="w-40 shrink-0 sm:w-48">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-100 ring-1 ring-ink-200">
              <Image
                src={siteConfig.person.photo}
                alt={siteConfig.person.photoAlt}
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Réalisations */}
      <Section tone="sand">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
              Des projets que vous pouvez aller voir
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Trois sites que j’ai conçus et développés, en ligne aujourd’hui.
            </p>
          </div>
          <Button href="/realisations" variant="secondary">
            Voir toutes mes réalisations
            <ArrowRight />
          </Button>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 70}>
              <PortfolioCard project={project} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Blog */}
      {posts.length > 0 ? (
        <Section tone="white">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
                Des réponses aux questions qu’on se pose tous
              </h2>
              <p className="mt-4 text-lg text-ink-600">
                Baisse de loyer, changement d’adresse, assurances, prix d’un site : j’écris ce qu’on
                me demande le plus souvent.
              </p>
            </div>
            <Button href="/blog" variant="secondary">
              Voir tous les articles
              <ArrowRight />
            </Button>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 70}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Contenu indexable : ce que je fais et où, en toutes lettres. */}
      <Section tone="sand" size="narrow" as="aside">
        <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">
          Où j’interviens, et pour qui
        </h2>
        <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink-600">
          <p>
            Je suis basé à {siteConfig.location.city}, dans le Nord vaudois. Je crée des sites
            internet pour des entreprises, des artisans et des personnes à leur compte du canton de
            Vaud et de toute la Suisse romande, et un projet web se mène très bien à distance.
          </p>
          <p>
            Pour l’accompagnement administratif et l’optimisation de contrats, je travaille surtout
            avec des particuliers d’Yverdon-les-Bains, du Nord vaudois et du canton de Vaud, là où
            connaître les usages locaux et les délais communaux change quelque chose.
          </p>
          <p>
            Une question sur l’une ou l’autre de ces prestations&nbsp;? La{' '}
            <Link href="/faq" className="underline underline-offset-2 hover:text-ink-900">
              foire aux questions
            </Link>{' '}
            répond aux plus fréquentes, et vous pouvez sinon{' '}
            <Link href="/contact" className="underline underline-offset-2 hover:text-ink-900">
              m’écrire directement
            </Link>
            .
          </p>
        </div>
      </Section>

      <FinalCta
        title="Vous avez une question, un projet ou simplement un problème à régler ?"
        text="Pas besoin de préparer un long dossier. Expliquez-moi simplement ce qui vous amène ici."
        ctaLabel="Me parler de mon besoin"
        ctaHref="/contact"
      />

      <JsonLd data={webPageSchema({ title, description, path: '/' })} />
    </>
  );
}
