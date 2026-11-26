import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Check, ArrowRight } from '@/components/ui/Check';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { CatalogueBrowser } from '@/components/catalogue/CatalogueBrowser';
import {
  categories,
  forfaits,
  formatPrix,
  prestations,
  prestationsDe,
} from '@/config/catalogue';
import { faqItems } from '@/config/faq';
import { buildMetadata, absoluteUrl } from '@/lib/seo';
import {
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
  webPageSchema,
} from '@/lib/structured-data';

const title = 'Services administratifs à prix fixes, Yverdon-les-Bains et Suisse romande';
const description =
  'Déclarations d’impôts, subsides, loyer, courriers, comptabilité : des prestations administratives à prix affichés, délais annoncés et périmètre défini. YG Services.';
const path = '/assistance-administrative';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'Services administratifs à prix fixes',
};

const adminFaq = faqItems.filter((item) => item.category === 'Assistance administrative');

export default function CataloguePage() {
  return (
    <>
      <PageHero
        eyebrow="Services administratifs"
        title="Vos démarches prises en charge, à prix affiché"
        lead="Chaque prestation indique son prix, son délai, ce qu’elle comprend et ce qu’elle ne comprend pas. Vous savez à quoi vous vous engagez avant de commander."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Services administratifs', path },
        ]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="#catalogue" size="lg">
            Parcourir les prestations
          </Button>
          <Button href="/contact?sujet=administratif" variant="secondary" size="lg">
            Décrire un besoin particulier
          </Button>
        </div>
      </PageHero>

      {/* Réassurance immédiate */}
      <Section tone="white">
        <ul className="grid gap-6 sm:grid-cols-3">
          {[
            [
              'Prix connu à l’avance',
              'Le montant affiché est celui que vous payez. Les éventuelles options sont annoncées avant la commande.',
            ],
            [
              'Périmètre écrit',
              'Chaque fiche indique ce qui est inclus et ce qui ne l’est pas. Aucune mauvaise surprise en cours de dossier.',
            ],
            [
              'Délai annoncé',
              'Le délai court dès que votre dossier est complet. S’il manque une pièce, cela vous est dit tout de suite.',
            ],
          ].map(([titre, texte], index) => (
            <Reveal as="li" key={titre} delay={index * 70}>
              <div className="h-full border-t-2 border-ink-900 pt-5">
                <h2 className="font-display text-lg text-ink-900">{titre}</h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-600">{texte}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Catégories */}
      <Section tone="sand">
        <SectionHeading
          eyebrow="Les domaines"
          title="Six domaines d’intervention"
          lead="Chaque domaine regroupe des prestations précises, avec leurs documents et leurs délais."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((categorie, index) => {
            const nombre = prestationsDe(categorie.slug).length;
            return (
              <Reveal as="li" key={categorie.slug} delay={index * 60}>
                <Link
                  href={`/assistance-administrative/${categorie.slug}`}
                  className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="font-display text-xl text-ink-900">{categorie.nomCourt}</h3>
                  <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink-600">
                    {categorie.intro}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink-900 transition group-hover:text-accent-700">
                    {nombre} prestation{nombre > 1 ? 's' : ''}
                    <ArrowRight className="transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* Catalogue complet */}
      <Section id="catalogue" tone="white">
        <SectionHeading
          eyebrow="Catalogue"
          title="Toutes les prestations"
          lead="Filtrez par domaine ou cherchez directement ce dont vous avez besoin."
        />
        <div className="mt-10">
          <CatalogueBrowser prestations={prestations} />
        </div>
      </Section>

      {/* Forfaits */}
      <Section tone="sand">
        <SectionHeading
          eyebrow="Forfaits"
          title="Plusieurs démarches regroupées"
          lead="Lorsque les démarches vont ensemble, le forfait évite de commander prestation par prestation."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {forfaits.map((forfait, index) => (
            <Reveal as="li" key={forfait.slug} delay={index * 70}>
              <div className="flex h-full flex-col rounded-2xl bg-white p-7 ring-1 ring-ink-200">
                <h3 className="font-display text-xl text-ink-900">{forfait.titre}</h3>
                <p className="mt-2 text-[15px] text-ink-600">{forfait.accroche}</p>
                <p className="mt-4 font-display text-2xl text-ink-900">
                  {formatPrix(forfait.prix)}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5 text-[15px] text-ink-700">
                  {forfait.inclus.slice(0, 4).map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check className="mt-0.5 text-accent-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-xs text-ink-500">Délai : {forfait.delai}</p>

                <Button href={`/contact?sujet=administratif&besoin=${encodeURIComponent(forfait.titre)}`} className="mt-6 w-full">
                  Demander ce forfait
                </Button>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Déroulement */}
      <Section tone="white" size="narrow">
        <SectionHeading eyebrow="Déroulement" title="Comment se passe une commande" />
        <ol className="mt-10 space-y-6">
          {[
            ['Vous choisissez la prestation', 'Le prix, le délai et le périmètre sont indiqués sur la fiche.'],
            ['Vous décrivez votre situation', 'Un formulaire adapté à la prestation recueille ce qui est nécessaire, sans question inutile.'],
            ['Vous recevez la confirmation', 'Le montant, le délai et la liste des documents à transmettre vous sont confirmés par écrit.'],
            ['Le dossier est traité', 'Le délai court dès que le dossier est complet. Vous recevez le document final par voie sécurisée.'],
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

        <div className="mt-10 rounded-xl border-l-[3px] border-accent-400 bg-accent-50/70 px-5 py-4 text-sm leading-relaxed text-ink-700">
          <span className="font-semibold text-ink-900">Paiement en ligne — </span>
          le règlement par carte n’est pas encore actif. Les commandes passent pour l’instant par le
          formulaire, et la facture vous est adressée avant le début du traitement.
        </div>
      </Section>

      {adminFaq.length > 0 ? (
        <Section tone="sand" size="narrow">
          <SectionHeading eyebrow="FAQ" title="Les questions fréquentes" />
          <div className="mt-10">
            <Faq items={adminFaq} />
          </div>
        </Section>
      ) : null}

      <FinalCta
        title="Votre démarche n’est pas dans la liste ?"
        text="Le catalogue couvre les demandes les plus fréquentes. Pour le reste, décrivez votre situation et vous recevrez une proposition chiffrée."
        ctaLabel="Décrire ma situation"
        ctaHref="/contact?sujet=administratif"
      />

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Services administratifs', path },
          ]),
          serviceSchema({
            name: 'Services administratifs',
            description,
            path,
            prestations: categories.map((categorie) => categorie.nom),
          }),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Catalogue des prestations administratives',
            numberOfItems: prestations.length,
            itemListElement: prestations.map((prestation, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: prestation.titre,
              url: absoluteUrl(
                `/assistance-administrative/${prestation.categorie}/${prestation.slug}`,
              ),
            })),
          },
          ...(adminFaq.length > 0 ? [faqSchema(adminFaq)] : []),
        ]}
      />
    </>
  );
}
