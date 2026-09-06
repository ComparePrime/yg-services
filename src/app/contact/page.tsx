import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/ContactForm';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Contact — parlons de votre projet ou de votre situation';
const description =
  "Décrivez votre projet web ou votre situation administrative. Je lis chaque message personnellement et je vous réponds directement.";
const path = '/contact';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-sand py-14 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
                Contact
              </p>
              <h1 className="font-display text-4xl leading-[1.12] text-ink-900 sm:text-5xl">
                Dites-moi ce dont vous avez besoin
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                Un projet de site web, une assurance à revoir, un courrier à écrire ou une situation
                que vous ne savez pas comment aborder : commencez par me l’expliquer avec vos mots.
              </p>

              <dl className="mt-10 space-y-6 text-[15px]">
                <div>
                  <dt className="font-medium text-ink-900">Délai de réponse</dt>
                  <dd className="mt-1 text-ink-600">
                    Généralement sous 24 à 48 heures ouvrables, par la personne qui traitera votre
                    demande : moi.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-ink-900">Zone de travail</dt>
                  <dd className="mt-1 text-ink-600">
                    Basé à {siteConfig.location.city}, dans le canton de {siteConfig.location.region}
                    . Je travaille en Suisse romande et dans toute la Suisse, sur place ou à distance.
                  </dd>
                </div>
                {siteConfig.contact.email || siteConfig.contact.phone ? (
                  <div>
                    <dt className="font-medium text-ink-900">Autres moyens de me joindre</dt>
                    <dd className="mt-1 space-y-1 text-ink-600">
                      {siteConfig.contact.email ? (
                        <p>
                          <a
                            href={`mailto:${siteConfig.contact.email}`}
                            className="underline underline-offset-2 hover:text-ink-900"
                          >
                            {siteConfig.contact.email}
                          </a>
                        </p>
                      ) : null}
                      {siteConfig.contact.phone ? (
                        <p>
                          <a
                            href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                            className="underline underline-offset-2 hover:text-ink-900"
                          >
                            {siteConfig.contact.phone}
                          </a>
                        </p>
                      ) : null}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-medium text-ink-900">Instagram</dt>
                  <dd className="mt-1 text-ink-600">
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-ink-900"
                    >
                      {siteConfig.social.instagramHandle}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-ink-900">Vos documents</dt>
                  <dd className="mt-1 text-ink-600">
                    Vous pouvez joindre un contrat ou un courrier reçu. Vos documents ne servent qu’à
                    traiter votre demande.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200 sm:p-9">
              <Suspense fallback={<div className="h-[600px]" aria-hidden="true" />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Contact', path },
          ]),
        ]}
      />
    </>
  );
}
