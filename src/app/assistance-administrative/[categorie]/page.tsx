import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/Check';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { PrestationCard } from '@/components/catalogue/CatalogueBrowser';
import { categories, getCategorie, prestationsDe } from '@/config/catalogue';
import { buildMetadata, absoluteUrl } from '@/lib/seo';
import { breadcrumbSchema, serviceSchema, webPageSchema } from '@/lib/structured-data';

type Params = { params: Promise<{ categorie: string }> };

export function generateStaticParams() {
  return categories.map((categorie) => ({ categorie: categorie.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categorie: slug } = await params;
  const categorie = getCategorie(slug);
  if (!categorie) return {};

  const liste = prestationsDe(slug);
  const description = `${categorie.intro} ${liste.length} prestations à prix affichés, Yverdon-les-Bains et Suisse romande.`;

  return {
    ...buildMetadata({
      title: categorie.nom,
      description: description.slice(0, 160),
      path: `/assistance-administrative/${slug}`,
    }),
    title: categorie.nom,
  };
}

export default async function CategoriePage({ params }: Params) {
  const { categorie: slug } = await params;
  const categorie = getCategorie(slug);
  if (!categorie) notFound();

  const liste = prestationsDe(slug);
  const path = `/assistance-administrative/${slug}`;
  const description = `${categorie.intro} ${liste.length} prestations à prix affichés.`;

  const autres = categories.filter((item) => item.slug !== slug);

  return (
    <>
      <PageHero
        eyebrow="Services administratifs"
        title={categorie.nom}
        lead={categorie.intro}
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Services administratifs', path: '/assistance-administrative' },
          { name: categorie.nomCourt, path },
        ]}
      />

      <Section tone="white">
        <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">
          {liste.length} prestation{liste.length > 1 ? 's' : ''} dans ce domaine
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {liste.map((prestation, index) => (
            <Reveal as="li" key={prestation.slug} delay={index * 50}>
              <PrestationCard prestation={prestation} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="sand">
        <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">Les autres domaines</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {autres.map((item) => (
            <li key={item.slug}>
              <Button href={`/assistance-administrative/${item.slug}`} variant="secondary">
                {item.nomCourt}
                <ArrowRight />
              </Button>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta
        title="Votre situation ne correspond à aucune de ces prestations ?"
        text="Décrivez-la en quelques lignes. Vous recevrez une réponse indiquant ce qui est possible et à quel prix."
        ctaLabel="Décrire ma situation"
        ctaHref="/contact?sujet=administratif"
      />

      <JsonLd
        data={[
          webPageSchema({ title: categorie.nom, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Services administratifs', path: '/assistance-administrative' },
            { name: categorie.nomCourt, path },
          ]),
          serviceSchema({
            name: categorie.nom,
            description,
            path,
            prestations: liste.map((prestation) => prestation.titre),
          }),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: categorie.nom,
            numberOfItems: liste.length,
            itemListElement: liste.map((prestation, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: prestation.titre,
              url: absoluteUrl(`${path}/${prestation.slug}`),
            })),
          },
        ]}
      />
    </>
  );
}
