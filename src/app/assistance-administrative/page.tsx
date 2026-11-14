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
import {
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
  webPageSchema,
} from '@/lib/structured-data';

const title = 'Assistance administrative pour particuliers à Yverdon-les-Bains';
const description =
  'Démarches, courriers, organisation de documents, logement, dossiers fiscaux : YG Services accompagne les particuliers dans leur administration. Yverdon-les-Bains et canton de Vaud.';
const path = '/assistance-administrative';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'Assistance administrative pour particuliers',
};

const adminFaq = faqItems.filter((item) => item.category === 'Assistance administrative');

export default function AssistanceAdministrativePage() {
  return (
    <>
      <PageHero
        eyebrow="Pour les particuliers"
        title="L’administration prise en charge, du courrier au dossier complet"
        lead="Certaines démarches sont simples sur le papier et deviennent vite compliquées dans la réalité. YG Services vous aide à y voir clair, prépare les documents et rédige les courriers."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Assistance administrative', path },
        ]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/contact?sujet=administratif" size="lg">
            Demander un accompagnement
          </Button>
          <Button href="#besoin-aide" variant="secondary" size="lg">
            Expliquer ma situation
          </Button>
        </div>
      </PageHero>

      {/* Bénéfices, avant le détail des prestations */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Ce que cela change"
          title="Du temps gagné, et des démarches qui aboutissent"
          lead="L’objectif n’est pas de faire à votre place sans vous expliquer, mais de vous enlever la charge et de vous laisser un dossier en ordre."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              titre: 'Vous ne ratez plus un délai',
              texte:
                'Les échéances sont repérées et suivies, et les courriers partent dans les formes.',
            },
            {
              titre: 'Vous comprenez ce qui est demandé',
              texte:
                'Chaque courrier reçu est expliqué en français clair, sans jargon administratif.',
            },
            {
              titre: 'Vos papiers restent en ordre',
              texte:
                'Un classement simple est mis en place, que vous pouvez tenir ensuite sans effort.',
            },
          ].map((item, index) => (
            <Reveal as="li" key={item.titre} delay={index * 70}>
              <div className="h-full border-t-2 border-ink-900 pt-5">
                <h3 className="font-display text-lg text-ink-900">{item.titre}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-600">{item.texte}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Prestations détaillées */}
      {adminServices.map((service, index) => (
        <Section key={service.id} id={service.id} tone={index % 2 === 0 ? 'sand' : 'white'}>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
                {service.title}
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-600">{service.intro}</p>

              <p className="mt-6 border-l-2 border-accent-500 pl-4 text-[15px] font-medium leading-relaxed text-ink-800">
                {service.benefice}
              </p>

              {service.disclaimer ? <Disclaimer>{service.disclaimer}</Disclaimer> : null}

              <Button href={service.cta.href} className="mt-7">
                {service.cta.label}
                <ArrowRight />
              </Button>
            </div>

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
          </div>
        </Section>
      ))}

      {/* Comment cela se passe */}
      <Section tone="sand" size="narrow">
        <SectionHeading eyebrow="Déroulement" title="Comment se passe une demande" />
        <ol className="mt-10 space-y-6">
          {[
            ['Vous décrivez votre situation', 'Par le formulaire ou par e-mail, avec vos mots et sans préparer de dossier.'],
            ['Vous recevez une réponse', 'Ce qui peut être fait, comment, dans quel délai et à quel prix. Sans engagement.'],
            ['La prestation est réalisée', 'Les documents sont préparés, les courriers rédigés, et vous relisez avant envoi.'],
          ].map(([titre, texte], index) => (
            <li key={titre} className="flex gap-5">
              <span className="font-display text-xl text-accent-600">{`0${index + 1}`}</span>
              <div>
                <h3 className="font-medium text-ink-900">{titre}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-600">{texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {adminFaq.length > 0 ? (
        <Section tone="white" size="narrow">
          <SectionHeading eyebrow="FAQ" title="Les questions fréquentes" />
          <div className="mt-10">
            <Faq items={adminFaq} />
          </div>
        </Section>
      ) : null}

      <HelpForm />

      <FinalCta
        title="Vous ne savez pas par où commencer ?"
        text="C’est justement le bon moment pour écrire. Décrivez votre situation avec vos mots, YG Services s’occupe du reste."
        ctaLabel="Décrire ma situation"
        ctaHref="/contact?sujet=administratif"
      />

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Assistance administrative', path },
          ]),
          serviceSchema({
            name: 'Assistance administrative',
            description,
            path,
            prestations: adminServices.map((service) => service.title),
          }),
          ...(adminFaq.length > 0 ? [faqSchema(adminFaq)] : []),
        ]}
      />
    </>
  );
}
