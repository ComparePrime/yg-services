import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Check, ArrowRight } from '@/components/ui/Check';
import { Disclaimer } from '@/components/sections/Disclaimer';
import { Faq } from '@/components/Faq';
import { HelpForm } from '@/components/sections/HelpForm';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { adminServices } from '@/config/services';
import { faqItems } from '@/config/faq';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Aide administrative et optimisation dans le canton de Vaud';
const description =
  "Assurances, logement, impôts, courriers, démarches familiales : je vous aide à y voir clair et à préparer les bonnes démarches. Yverdon-les-Bains, Vaud.";
const path = '/admin-optimisation';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'Aide administrative & optimisation',
};

const adminFaq = faqItems.filter((item) => item.category === 'Admin & optimisation');

export default function AdminPage() {
  return (
    <>
      <PageHero
        eyebrow="Admin & optimisation"
        title="Y voir plus clair, puis faire les bonnes démarches"
        lead="Certaines démarches sont simples sur le papier et deviennent vite compliquées dans la réalité. Mon objectif est de vous aider à comprendre votre situation et à préparer ce qui doit l’être."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Admin & optimisation', path },
        ]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="#besoin-aide" size="lg">
            Expliquer ma situation
          </Button>
          <Button href="#bilan-global" variant="secondary" size="lg">
            Je veux faire le point
          </Button>
        </div>
      </PageHero>

      {/* Sommaire rapide */}
      <div className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-4 sm:px-8">
          {adminServices.map((service) => (
            <Link
              key={service.id}
              href={`#${service.id}`}
              className="shrink-0 rounded-full bg-ink-50 px-4 py-2 text-sm text-ink-700 transition hover:bg-ink-100 hover:text-ink-900"
            >
              {service.title}
            </Link>
          ))}
        </div>
      </div>

      {adminServices.map((service, index) => (
        <Section key={service.id} id={service.id} tone={index % 2 === 0 ? 'white' : 'sand'}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <span aria-hidden="true" className="text-3xl">
                {service.emoji}
              </span>
              <h2 className="mt-4 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
                {service.title}
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-600">{service.intro}</p>
              {service.disclaimer ? <Disclaimer>{service.disclaimer}</Disclaimer> : null}
              <Button href={service.cta.href} className="mt-7">
                {service.cta.label}
                <ArrowRight />
              </Button>
            </div>

            <div>
              <Reveal>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl bg-white px-4 py-3 text-[15px] text-ink-700 ring-1 ring-ink-200"
                    >
                      <Check className="mt-0.5 text-accent-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {service.premium ? (
                <Reveal delay={90}>
                  <div className="mt-6 rounded-2xl bg-ink-950 p-7 text-ink-300 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-400">
                      Prestation approfondie
                    </p>
                    <h3 className="mt-3 font-display text-2xl text-white">
                      {service.premium.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed">{service.premium.text}</p>
                    <ul className="mt-5 space-y-2.5 text-[15px]">
                      {service.premium.points.map((point) => (
                        <li key={point} className="flex gap-2.5">
                          <Check className="text-accent-400" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      href={service.premium.cta.href}
                      variant="light"
                      className="mt-7 w-full sm:w-auto"
                    >
                      {service.premium.cta.label}
                    </Button>
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </Section>
      ))}

      {/* Bilan global */}
      <Section id="bilan-global" tone="white" size="narrow">
        <div className="rounded-2xl bg-sand p-8 ring-1 ring-ink-200 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-700">
            Prestation complète
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
            Je veux faire le point
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-600">
            Plutôt que de traiter un sujet isolé, nous reprenons l’ensemble. Vous me transmettez ce
            que vous avez, je regarde chaque poste et je vous rends un point de situation écrit.
          </p>
          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {[
              'Vos assurances',
              'Votre logement et votre loyer',
              'Vos abonnements',
              'Vos contrats télécoms',
              'Votre véhicule',
              'Votre organisation administrative',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] text-ink-700">
                <Check className="mt-0.5 text-accent-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-7 text-[15px] leading-relaxed text-ink-600">
            L’objectif n’est pas de tout changer, mais d’identifier les postes qui méritent une
            vérification ou une optimisation, et de vous dire lesquels ne bougent pas.
          </p>
          <Button href="/contact?sujet=autre" size="lg" className="mt-8">
            Demander un bilan global
            <ArrowRight />
          </Button>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="sand" size="narrow">
        <SectionHeading eyebrow="FAQ" title="Ce qu’on me demande le plus souvent" />
        <div className="mt-10">
          <Faq items={adminFaq} />
        </div>
      </Section>

      <HelpForm />

      <FinalCta
        title="Vous ne savez pas par où commencer ?"
        text="C’est justement le bon moment pour m’écrire. Décrivez votre situation avec vos mots, je m’occupe du reste."
        ctaLabel="Décrire ma situation"
        ctaHref="/contact"
      />

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Admin & optimisation', path },
          ]),
          faqSchema(adminFaq),
        ]}
      />
    </>
  );
}
