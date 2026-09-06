import Link from 'next/link';
import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { TwoWays } from '@/components/sections/TwoWays';
import { WhyMe } from '@/components/sections/WhyMe';
import { HelpForm } from '@/components/sections/HelpForm';
import { FinalCta } from '@/components/sections/FinalCta';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/Check';
import { PortfolioCard } from '@/components/PortfolioCard';
import { BlogCard } from '@/components/BlogCard';
import { JsonLd } from '@/components/JsonLd';
import { featuredProjects } from '@/config/projects';
import { adminServices, webProcess } from '@/config/services';
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
      <Hero />
      <TwoWays />

      {/* Aperçu de la méthode web */}
      <Section tone="sand">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Création de sites web"
            title="Je m’occupe de tout, de la première idée à la mise en ligne"
            lead="Vous n’avez pas à coordonner un graphiste, un développeur et une agence. Vous avez un seul interlocuteur, qui suit le projet du début à la fin."
          />
          <div>
            <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {webProcess.map((step, index) => (
                <Reveal as="li" key={step.step} delay={index * 50}>
                  <p className="font-display text-sm text-accent-600">{step.step}</p>
                  <h3 className="mt-1 font-medium text-ink-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.text}</p>
                </Reveal>
              ))}
            </ol>
            <Button href="/sites-web" className="mt-10">
              Voir les formules et les tarifs
              <ArrowRight />
            </Button>
          </div>
        </div>
      </Section>

      {/* Aperçu admin & optimisation */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Admin & optimisation"
          title="Ce que je peux reprendre à votre place"
          lead="Certaines démarches sont simples sur le papier et deviennent vite compliquées dans la réalité. Mon objectif est de vous aider à y voir plus clair et à préparer les bonnes démarches."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adminServices.map((service, index) => (
            <Reveal as="li" key={service.id} delay={index * 45}>
              <Link
                href={`/admin-optimisation#${service.id}`}
                className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span aria-hidden="true" className="text-2xl">
                  {service.emoji}
                </span>
                <h3 className="mt-4 font-display text-lg text-ink-900">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                  {service.items.slice(0, 4).join(' • ')}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink-900 transition group-hover:text-accent-700">
                  En savoir plus
                  <ArrowRight className="transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Réalisations */}
      <Section tone="sand">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Mes réalisations"
            title="Des projets que vous pouvez aller voir"
            lead="Trois sites que j’ai conçus et développés, en ligne aujourd’hui."
          />
          <Button href="/realisations" variant="secondary">
            Toutes mes réalisations
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

      <WhyMe tone="white" />

      {/* Derniers conseils */}
      {posts.length > 0 ? (
        <Section tone="sand">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Conseils"
              title="Des réponses aux questions qu’on me pose souvent"
              lead="Des articles écrits pour être utiles, pas pour remplir des pages."
            />
            <Button href="/blog" variant="secondary">
              Tous les articles
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

      <HelpForm />
      <FinalCta secondary={{ href: '/faq', label: 'Consulter la FAQ' }} />

      <JsonLd data={webPageSchema({ title, description, path: '/' })} />
    </>
  );
}
