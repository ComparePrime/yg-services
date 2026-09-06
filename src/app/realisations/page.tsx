import Image from 'next/image';
import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Check, ArrowRight } from '@/components/ui/Check';
import { Reveal } from '@/components/ui/Reveal';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { projects } from '@/config/projects';
import { buildMetadata, absoluteUrl } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Mes réalisations : sites web créés en Suisse romande';
const description =
  "Les sites que j'ai conçus et développés, de la structure des pages jusqu'à la mise en ligne. Vous pouvez tous les consulter en ligne.";
const path = '/realisations';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'Mes réalisations',
};

export default function RealisationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Réalisations"
        title="Des projets que vous pouvez aller voir"
        lead="Je préfère montrer des sites en ligne plutôt que des maquettes. Voici ce que j’ai conçu et développé jusqu’ici."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Réalisations', path },
        ]}
      />

      {projects.map((project, index) => (
        <Section key={project.slug} id={project.slug} tone={index % 2 === 0 ? 'white' : 'sand'}>
          <div
            className={`grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16 ${
              index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <Reveal>
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-ink-100 ring-1 ring-ink-200">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-700">
                {project.category}
                {project.year ? ` — ${project.year}` : ''}
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
                {project.name}
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-ink-700">{project.summary}</p>

              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-600">
                {project.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">Ce que j’ai réalisé</h3>
                  <ul className="mt-3 space-y-2 text-[15px] text-ink-600">
                    {project.services.map((service) => (
                      <li key={service} className="flex items-start gap-2">
                        <Check className="mt-0.5 text-accent-600" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">Aspects techniques</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full bg-ink-50 px-3 py-1.5 text-[13px] text-ink-600"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button href={project.cta.href} variant="secondary" className="mt-8">
                {project.cta.label}
                <ArrowRight />
              </Button>
            </div>
          </div>
        </Section>
      ))}

      <FinalCta
        title="Le prochain projet pourrait être le vôtre"
        text="Dites-moi ce que vous avez en tête, même si l’idée n’est pas encore complètement claire."
        ctaLabel="Parlons de votre projet"
        ctaHref="/contact?sujet=creer-site"
        secondary={{ href: '/sites-web', label: 'Voir les formules' }}
      />

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Réalisations', path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Réalisations de YG Services',
            itemListElement: projects.map((project, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: project.name,
              url: project.url,
            })),
            mainEntityOfPage: absoluteUrl(path),
          },
        ]}
      />
    </>
  );
}
