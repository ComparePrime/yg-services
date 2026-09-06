import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { faqItems } from '@/config/faq';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Questions fréquentes sur mes prestations';
const description =
  "Prix d'un site internet, délais, référencement, analyse d'assurances, baisse de loyer, courriers : mes réponses aux questions fréquentes.";
const path = '/faq';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'Questions fréquentes',
};

const categories = ['Sites web', 'Admin & optimisation', 'Général'] as const;

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Les questions qu’on me pose le plus souvent"
        lead="Si votre question n’est pas ici, écrivez-la moi. J’y réponds directement, et elle finira peut-être sur cette page."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'FAQ', path },
        ]}
      />

      {categories.map((category, index) => {
        const items = faqItems.filter((item) => item.category === category);
        if (items.length === 0) return null;
        return (
          <Section key={category} tone={index % 2 === 0 ? 'white' : 'sand'} size="narrow">
            <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">{category}</h2>
            <div className="mt-8">
              <Faq items={items} />
            </div>
          </Section>
        );
      })}

      <FinalCta
        title="Votre question n’y figure pas ?"
        text="Posez-la moi directement, même si elle vous paraît basique. C’est souvent celles-là qui méritent une vraie réponse."
        ctaLabel="Poser ma question"
        ctaHref="/contact"
      />

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'FAQ', path },
          ]),
          faqSchema(faqItems),
        ]}
      />
    </>
  );
}
