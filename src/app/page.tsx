import Link from 'next/link';
import type { Metadata } from 'next';
import { NeedSearch } from '@/components/sections/NeedSearch';
import { Universes } from '@/components/sections/Universes';
import { Reassurance } from '@/components/sections/Reassurance';
import { FinalCta } from '@/components/sections/FinalCta';
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

const title = 'Création de sites internet et assistance administrative en Suisse romande';
const description =
  'Sites internet pour indépendants, PME et particuliers, et services administratifs à prix fixes pour les particuliers. Yverdon-les-Bains et Suisse romande.';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path: '/' }),
  title: { absolute: 'Sites internet & services administratifs | YG Services' },
};

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <NeedSearch />
      <Universes />

      {/* Orientation pour ceux qui ne savent pas quoi demander */}
      <Section tone="sand" size="narrow">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
            Vous ne savez pas exactement ce qu’il vous faut&nbsp;?
          </h2>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-600">
            <p>Ce n’est pas un problème.</p>
            <p>
              Décrivez votre situation, même si vous ne savez pas quelle démarche effectuer ou
              quelle prestation choisir. YG Services vous indique ce qui peut être fait et la suite
              à donner.
            </p>
            <p>Aucun engagement, et une réponse sous 24 à 48 heures ouvrables.</p>
          </div>
          <Button href="/contact" size="lg" className="mt-8">
            Décrire mon besoin
            <ArrowRight />
          </Button>
        </div>
      </Section>

      <Reassurance tone="white" />

      {/* Réalisations */}
      <Section tone="sand">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
              Des sites en ligne, que vous pouvez consulter
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Trois projets conçus et développés par YG Services, de la structure des pages jusqu’à
              la mise en ligne.
            </p>
          </div>
          <Button href="/realisations" variant="secondary">
            Voir toutes les réalisations
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
                Des réponses aux questions fréquentes
              </h2>
              <p className="mt-4 text-lg text-ink-600">
                Prix d’un site internet, référencement, démarches administratives : les sujets qui
                reviennent le plus souvent.
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

      {/* Contenu indexable : les prestations et la zone, en toutes lettres. */}
      <Section tone="sand" size="narrow" as="aside">
        <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">
          Les prestations et la zone couverte
        </h2>
        <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink-600">
          <p>
            YG Services est basé à {siteConfig.location.city}, dans le Nord vaudois, et intervient
            dans deux domaines distincts.
          </p>
          <p>
            <strong className="text-ink-900">La création de sites internet</strong> s’adresse aux
            indépendants, aux PME, aux commerçants et aux particuliers du canton de Vaud et de toute
            la Suisse romande : sites vitrines, boutiques en ligne, refonte de sites existants et
            référencement naturel. Un projet web se mène très bien à distance.
          </p>
          <p>
            <strong className="text-ink-900">L’assistance administrative</strong> s’adresse aux
            particuliers d’Yverdon-les-Bains, du Nord vaudois et du canton de Vaud : démarches,
            courriers, organisation de documents, logement et préparation de dossiers. La proximité
            compte davantage ici, parce que les usages et les délais varient d’une commune à
            l’autre.
          </p>
          <p>
            La{' '}
            <Link href="/faq" className="underline underline-offset-2 hover:text-ink-900">
              foire aux questions
            </Link>{' '}
            répond aux interrogations les plus fréquentes sur chacune des deux activités, et le{' '}
            <Link href="/contact" className="underline underline-offset-2 hover:text-ink-900">
              formulaire de contact
            </Link>{' '}
            permet de décrire une demande en quelques lignes.
          </p>
        </div>
      </Section>

      <FinalCta
        title="Un projet, une question ou une démarche à régler ?"
        text="Pas besoin de préparer un long dossier. Décrivez simplement ce qui vous amène, et vous recevrez une réponse claire."
        ctaLabel="Décrire mon besoin"
        ctaHref="/contact"
      />

      <JsonLd data={webPageSchema({ title, description, path: '/' })} />
    </>
  );
}
