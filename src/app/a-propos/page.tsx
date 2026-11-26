import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/Check';
import { Reassurance } from '@/components/sections/Reassurance';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, organizationSchema, webPageSchema } from '@/lib/structured-data';

const title = 'À propos de YG Services, Yverdon-les-Bains';
const description =
  'YG Services réunit deux activités : la création de sites internet et les services administratifs aux particuliers. Basé à Yverdon-les-Bains.';
const path = '/a-propos';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'À propos',
};

export default function AProposPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Une structure, deux métiers, une même logique"
        lead="YG Services rend lisible ce qui paraît compliqué : un site internet qui doit enfin apporter des demandes, ou une démarche administrative qui traîne depuis des semaines."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'À propos', path },
        ]}
      />

      <Section tone="white" size="narrow">
        <SectionHeading title="Ce que fait YG Services" />
        <div className="mt-7 space-y-5 text-[17px] leading-relaxed text-ink-700">
          <p>
            YG Services est une structure établie à {siteConfig.location.city}, dans le canton de{' '}
            {siteConfig.location.region}, active dans deux domaines qui n’ont a priori rien en
            commun.
          </p>
          <p>
            Le premier est <strong className="text-ink-900">la création de sites internet</strong> :
            conception, développement, référencement et mise en ligne, pour des indépendants, des
            PME, des commerçants et des particuliers.
          </p>
          <p>
            Le second est <strong className="text-ink-900">l’assistance administrative</strong> aux
            particuliers : démarches, courriers, organisation des documents et préparation de
            dossiers.
          </p>
          <p>
            Le point commun tient en une phrase :{' '}
            <strong className="text-ink-900">{siteConfig.tagline}</strong>
          </p>
        </div>
      </Section>

      <Section tone="sand" size="narrow">
        <SectionHeading title="Le fil conducteur" />
        <div className="mt-7 space-y-5 text-[17px] leading-relaxed text-ink-700">
          <p>
            Construire un site et préparer un dossier administratif demandent le même travail de
            fond : prendre une situation confuse, comprendre ce qui compte réellement, et la rendre
            lisible.
          </p>
          <p>
            Une entreprise qui cherche un site est souvent perdue devant les devis et le vocabulaire
            technique. Un particulier qui reçoit un courrier d’une administration ou d’une gérance
            est souvent perdu devant les articles et les délais. Dans les deux cas, la valeur
            ajoutée consiste à faire le tri et à proposer quelque chose de concret.
          </p>
          <p>
            C’est aussi pour cette raison que les deux activités restent clairement séparées sur ce
            site : elles ne s’adressent pas aux mêmes personnes et ne répondent pas aux mêmes
            questions.
          </p>
        </div>
      </Section>

      <Section tone="white" size="narrow">
        <SectionHeading title="La façon de travailler" />
        <div className="mt-7 space-y-5 text-[17px] leading-relaxed text-ink-700">
          <p>
            Chaque demande reçoit une réponse personnelle, généralement sous 24 à 48 heures
            ouvrables. Pas de formulaire qui part dans le vide, pas de relance commerciale.
          </p>
          <p>
            Avant toute proposition, des questions sont posées. Vingt minutes de plus au début
            valent mieux qu’une livraison qui ne correspond pas.
          </p>
          <p>
            Et lorsqu’une demande sort du périmètre des prestations, cela vous est dit. YG Services
            n’est ni avocat, ni fiscaliste, ni fiduciaire. Sur ces sujets, le rôle consiste à
            préparer, organiser et orienter vers la bonne personne.
          </p>
        </div>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/realisations" variant="secondary">
            Voir les réalisations
            <ArrowRight />
          </Button>
          <Button href="/faq" variant="secondary">
            Consulter la FAQ
            <ArrowRight />
          </Button>
        </div>
      </Section>

      <Reassurance tone="sand" />

      <FinalCta
        title="Une question, un projet ou une démarche à régler ?"
        text="Décrivez votre besoin en quelques lignes. Vous recevrez une réponse claire, sans engagement."
        ctaLabel="Nous écrire"
        ctaHref="/contact"
      />

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          organizationSchema(),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'À propos', path },
          ]),
        ]}
      />
    </>
  );
}
