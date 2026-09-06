import Image from 'next/image';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/Check';
import { WhyMe } from '@/components/sections/WhyMe';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, personSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Yoann Guiot | Création web & services administratifs';
const description =
  "Je m'appelle Yoann Guiot, je vis à Yverdon-les-Bains. Je crée des sites web et j'accompagne les particuliers dans leurs démarches administratives.";
const path = '/a-propos';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path, type: 'profile' }),
  title: { absolute: 'Yoann Guiot | Création web & services administratifs' },
};

export default function AProposPage() {
  return (
    <>
      <section className="bg-sand pb-16 pt-12 sm:pb-24 sm:pt-16">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
                À propos
              </p>
              <h1 className="font-display text-4xl leading-[1.12] text-ink-900 sm:text-5xl">
                Bonjour, moi c’est Yoann.
              </h1>
              <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-ink-700">
                <p>
                  J’ai 30 ans, je suis marié et papa d’un enfant. Je vis à Yverdon-les-Bains, dans le
                  Nord vaudois, et c’est depuis là que je travaille.
                </p>
                <p>
                  Mon parcours n’est pas linéaire, et c’est plutôt une bonne nouvelle pour vous. J’ai
                  d’abord travaillé dans le domaine de l’assurance, où j’ai suivi une formation AFA
                  (Association pour la formation professionnelle en assurance). J’y ai appris à lire
                  des contrats, à repérer ce qui compte vraiment dans les petites lignes et à
                  expliquer des choses compliquées à des gens qui n’ont pas envie de les lire.
                </p>
                <p>
                  En parallèle, j’ai développé une vraie passion pour le digital. J’ai appris à
                  construire des sites web, puis à les rendre visibles, puis à les rendre utiles.
                  Aujourd’hui je conçois et je développe des sites complets, seul, du premier croquis
                  jusqu’à la mise en ligne.
                </p>
              </div>
            </div>

            <div className="mx-auto w-full max-w-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-100 ring-1 ring-ink-200">
                <Image
                  src={siteConfig.person.photo}
                  alt={siteConfig.person.photoAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 384px, 420px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="white" size="narrow">
        <SectionHeading title="Le fil rouge entre mes deux activités" />
        <div className="mt-7 space-y-5 text-[17px] leading-relaxed text-ink-700">
          <p>
            À première vue, créer un site web et aider quelqu’un à contester une hausse de loyer
            n’ont rien à voir. Dans les faits, c’est exactement le même travail : prendre une
            situation confuse, comprendre ce qui compte, et la rendre lisible.
          </p>
          <p>
            Une entreprise qui a besoin d’un site est souvent perdue devant les devis et le jargon
            technique. Un particulier qui reçoit un courrier de sa gérance ou de son assurance est
            souvent perdu devant les articles et les délais. Dans les deux cas, mon rôle est de faire
            le tri et de proposer quelque chose de concret.
          </p>
          <p>
            C’est pour ça que ma signature est celle-ci :{' '}
            <strong className="text-ink-900">« {siteConfig.signature} »</strong>
          </p>
        </div>
      </Section>

      <Section tone="sand" size="narrow">
        <SectionHeading title="Comment je travaille" />
        <div className="mt-7 space-y-5 text-[17px] leading-relaxed text-ink-700">
          <p>
            Vous m’écrivez, je vous réponds. Pas de formulaire qui part dans le vide, pas de
            commercial qui rappelle trois fois. C’est moi qui lis votre message et c’est moi qui vous
            réponds.
          </p>
          <p>
            Avant de vous proposer quoi que ce soit, je pose des questions. Je préfère prendre vingt
            minutes de plus au début plutôt que de livrer quelque chose qui ne correspond pas.
          </p>
          <p>
            Et quand une demande sort de mon domaine, je le dis. Je ne suis ni avocat, ni fiscaliste,
            ni fiduciaire. Sur ces sujets, mon rôle est de préparer, d’organiser et de vous orienter
            vers la bonne personne, pas de faire semblant.
          </p>
        </div>
        <Button href="/realisations" variant="secondary" className="mt-8">
          Voir ce que j’ai réalisé
          <ArrowRight />
        </Button>
      </Section>

      <WhyMe tone="white" />

      <FinalCta
        title="Une question, un projet, un doute ?"
        text="Écrivez-moi directement. Je réponds personnellement à chaque message."
        ctaLabel="Me contacter"
        ctaHref="/contact"
      />

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          personSchema(),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'À propos', path },
          ]),
        ]}
      />
    </>
  );
}
