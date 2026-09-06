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

              {siteConfig.contact.whatsapp.international ? (
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp.international}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-medium text-ink-900 ring-1 ring-ink-200 transition hover:ring-ink-400"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-accent-600" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.21 3.71.59.26 1.05.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
                  </svg>
                  Écrire sur WhatsApp
                  <span className="text-ink-500">{siteConfig.contact.whatsapp.display}</span>
                </a>
              ) : null}

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
