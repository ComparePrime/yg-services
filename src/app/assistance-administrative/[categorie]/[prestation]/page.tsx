import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Check, ArrowRight } from '@/components/ui/Check';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { PrestationCard } from '@/components/catalogue/CatalogueBrowser';
import {
  formatPrix,
  getCategorie,
  getOption,
  getPrestation,
  prestations,
} from '@/config/catalogue';
import { siteConfig } from '@/config/site';
import { buildMetadata, absoluteUrl } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/structured-data';

type Params = { params: Promise<{ categorie: string; prestation: string }> };

export function generateStaticParams() {
  return prestations.map((prestation) => ({
    categorie: prestation.categorie,
    prestation: prestation.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { prestation: slug } = await params;
  const prestation = getPrestation(slug);
  if (!prestation) return {};

  const prix = formatPrix(prestation.prix, prestation.aPartirDe, prestation.recurrence);
  const description = `${prestation.accroche} ${prix}, ${prestation.delai}. YG Services, Yverdon-les-Bains.`;

  return {
    ...buildMetadata({
      title: prestation.titreSeo ?? prestation.titre,
      description: description.slice(0, 160),
      path: `/assistance-administrative/${prestation.categorie}/${prestation.slug}`,
    }),
    title: prestation.titreSeo ?? prestation.titre,
  };
}

export default async function PrestationPage({ params }: Params) {
  const { prestation: slug } = await params;
  const prestation = getPrestation(slug);
  if (!prestation) notFound();

  const categorie = getCategorie(prestation.categorie);
  if (!categorie) notFound();

  const path = `/assistance-administrative/${prestation.categorie}/${prestation.slug}`;
  const prix = formatPrix(prestation.prix, prestation.aPartirDe, prestation.recurrence);
  const optionsDisponibles = (prestation.options ?? [])
    .map((id) => getOption(id))
    .filter((option): option is NonNullable<typeof option> => Boolean(option));

  const liees = (prestation.voirAussi ?? [])
    .map((item) => getPrestation(item))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const commandeHref = `/contact?sujet=${encodeURIComponent(
    prestation.categorie === 'impots' ? 'impots' : 'administratif',
  )}&besoin=${encodeURIComponent(`Commande : ${prestation.titre} (${prix})`)}`;

  return (
    <>
      <article>
        <header className="border-b border-ink-100 bg-sand pb-12 pt-10 sm:pb-16 sm:pt-14">
          <Container>
            <nav aria-label="Fil d’Ariane">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
                <li>
                  <Link href="/" className="transition hover:text-ink-900">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/assistance-administrative" className="transition hover:text-ink-900">
                    Services administratifs
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/assistance-administrative/${categorie.slug}`}
                    className="transition hover:text-ink-900"
                  >
                    {categorie.nomCourt}
                  </Link>
                </li>
              </ol>
            </nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
              <div>
                <h1 className="font-display text-3xl leading-[1.15] text-ink-900 sm:text-4xl">
                  {prestation.titre}
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-ink-600">
                  {prestation.description}
                </p>
              </div>

              {/* Encart de commande */}
              <aside className="rounded-2xl bg-white p-7 ring-1 ring-ink-200">
                <p className="font-display text-3xl text-ink-900">{prix}</p>
                {prestation.aPartirDe ? (
                  <p className="mt-1.5 text-sm text-ink-500">
                    Montant ferme communiqué après examen du dossier.
                  </p>
                ) : null}

                <dl className="mt-6 space-y-3 text-sm">
                  <div>
                    <dt className="text-ink-500">Délai</dt>
                    <dd className="mt-0.5 text-ink-900">{prestation.delai}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-500">Pour qui</dt>
                    <dd className="mt-0.5 text-ink-900">{prestation.pourQui}</dd>
                  </div>
                </dl>

                <Button href={commandeHref} size="lg" className="mt-7 w-full">
                  Commander cette prestation
                </Button>

                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  Le paiement par carte n’est pas encore actif. La commande passe par le formulaire
                  et la facture vous est adressée avant le début du traitement.
                </p>
              </aside>
            </div>
          </Container>
        </header>

        <Section tone="white">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-2xl text-ink-900">Ce qui est compris</h2>
              <ul className="mt-5 space-y-3 text-[15px] text-ink-700">
                {prestation.inclus.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Check className="mt-0.5 shrink-0 text-accent-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink-900">Ce qui n’est pas compris</h2>
              <ul className="mt-5 space-y-3 text-[15px] text-ink-600">
                {prestation.exclus.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-ink-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M5.5 10h9" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section tone="sand">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-2xl text-ink-900">Documents à transmettre</h2>
              <ul className="mt-5 space-y-2.5 text-[15px] text-ink-700">
                {prestation.documents.map((item) => (
                  <li key={item} className="flex items-baseline gap-2.5">
                    <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-ink-500">
                Le délai annoncé court dès que ces documents sont complets. S’il manque une pièce,
                cela vous est signalé dès la réception du dossier.
              </p>
            </div>

            {optionsDisponibles.length > 0 ? (
              <div>
                <h2 className="font-display text-2xl text-ink-900">Options</h2>
                <p className="mt-3 text-[15px] text-ink-600">
                  Proposées uniquement si votre situation les justifie. Le total vous est confirmé
                  avant toute commande.
                </p>
                <ul className="mt-5 divide-y divide-ink-200 border-y border-ink-200">
                  {optionsDisponibles.map((option) => (
                    <li key={option.id} className="flex items-baseline justify-between gap-5 py-3.5">
                      <div>
                        <p className="text-[15px] font-medium text-ink-900">{option.label}</p>
                        <p className="mt-1 text-sm text-ink-600">{option.description}</p>
                      </div>
                      <span className="shrink-0 font-display text-base text-ink-900">
                        + CHF {option.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>

        {prestation.cadre ? (
          <Section tone="white" size="narrow">
            <h2 className="font-display text-2xl text-ink-900">Cadre de la prestation</h2>
            <p className="mt-5 rounded-xl border-l-[3px] border-accent-400 bg-accent-50/70 px-5 py-4 text-[15px] leading-relaxed text-ink-700">
              {prestation.cadre}
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
              Vous restez responsable de l’exactitude des informations et des documents transmis.
              Les conditions complètes figurent dans les{' '}
              <Link
                href="/conditions-prestations"
                className="underline underline-offset-2 hover:text-ink-900"
              >
                conditions de prestation
              </Link>
              .
            </p>
          </Section>
        ) : null}

        {liees.length > 0 ? (
          <Section tone="sand">
            <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">
              Prestations souvent commandées avec celle-ci
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {liees.map((item) => (
                <li key={item.slug}>
                  <PrestationCard prestation={item} />
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button href={`/assistance-administrative/${categorie.slug}`} variant="secondary">
                Voir tout le domaine {categorie.nomCourt}
                <ArrowRight />
              </Button>
            </div>
          </Section>
        ) : null}
      </article>

      <FinalCta
        title="Une question avant de commander ?"
        text="Si vous n’êtes pas certain que cette prestation corresponde à votre situation, posez la question. La réponse vous dira si c’est la bonne, ou laquelle l’est."
        ctaLabel="Poser ma question"
        ctaHref="/contact?sujet=administratif"
      />

      <JsonLd
        data={[
          webPageSchema({
            title: prestation.titre,
            description: prestation.accroche,
            path,
          }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Services administratifs', path: '/assistance-administrative' },
            { name: categorie.nomCourt, path: `/assistance-administrative/${categorie.slug}` },
            { name: prestation.titre, path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${absoluteUrl(path)}#service`,
            name: prestation.titre,
            description: prestation.description,
            serviceType: categorie.nom,
            url: absoluteUrl(path),
            provider: { '@id': absoluteUrl('/#organisation') },
            areaServed: siteConfig.location.areaServed.map((nom) => ({
              '@type': 'Place',
              name: nom,
            })),
            ...(prestation.prix !== null
              ? {
                  offers: {
                    '@type': 'Offer',
                    price: prestation.prix,
                    priceCurrency: 'CHF',
                    url: absoluteUrl(path),
                    availability: 'https://schema.org/InStock',
                    ...(prestation.aPartirDe
                      ? {
                          priceSpecification: {
                            '@type': 'PriceSpecification',
                            minPrice: prestation.prix,
                            priceCurrency: 'CHF',
                          },
                        }
                      : {}),
                  },
                }
              : {}),
          },
        ]}
      />
    </>
  );
}
