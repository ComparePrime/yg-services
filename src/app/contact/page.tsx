import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/ContactForm';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { contactLinks, socialLinks } from '@/lib/contact-links';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Contact — parlons de votre projet ou de votre situation';
const description =
  "Décrivez votre projet de site internet ou votre situation administrative. Chaque message reçoit une réponse personnelle.";
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
                Un projet de site internet, une démarche administrative, un courrier à rédiger ou
                une situation que vous ne savez pas comment aborder : décrivez-la avec vos mots.
              </p>


              <dl className="mt-10 space-y-6 text-[15px]">
                <div>
                  <dt className="font-medium text-ink-900">Délai de réponse</dt>
                  <dd className="mt-1 text-ink-600">
                    Généralement sous 24 à 48 heures ouvrables, par e-mail.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-ink-900">Zone de travail</dt>
                  <dd className="mt-1 text-ink-600">
                    YG Services est basé à {siteConfig.location.city}, dans le canton de{' '}
                    {siteConfig.location.region}, et intervient en Suisse romande, sur place ou à
                    distance.
                  </dd>
                </div>
                {contactLinks().length > 0 ? (
                  <div>
                    <dt className="font-medium text-ink-900">Autres moyens de me joindre</dt>
                    <dd className="mt-1 space-y-1 text-ink-600">
                      {contactLinks().map((link) => (
                        <p key={link.id}>
                          <span className="text-ink-500">{link.label} : </span>
                          <a
                            href={link.href}
                            className="underline underline-offset-2 hover:text-ink-900"
                            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          >
                            {link.value}
                          </a>
                        </p>
                      ))}
                    </dd>
                  </div>
                ) : null}
                {socialLinks().length > 0 ? (
                  <div>
                    <dt className="font-medium text-ink-900">Me suivre</dt>
                    <dd className="mt-1 space-y-1 text-ink-600">
                      {socialLinks().map((link) => (
                        <p key={link.id}>
                          <span className="text-ink-500">{link.label} : </span>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 hover:text-ink-900"
                          >
                            {link.value}
                          </a>
                        </p>
                      ))}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-medium text-ink-900">Vos documents</dt>
                  <dd className="mt-1 text-ink-600">
                    Vous pouvez joindre un courrier reçu ou un document utile. Vos documents ne
                    servent qu’à traiter votre demande et sont supprimés sur simple demande.
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
