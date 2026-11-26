import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/Check';
import { PricingCard } from '@/components/PricingCard';
import { ComparisonTable } from '@/components/ComparisonTable';
import { PortfolioCard } from '@/components/PortfolioCard';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { plans } from '@/config/pricing';
import { webProcess } from '@/config/services';
import { featuredProjects } from '@/config/projects';
import { faqItems } from '@/config/faq';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Création de sites internet à Yverdon-les-Bains et en Suisse romande';
const description =
  'Sites vitrines, boutiques en ligne et refonte pour indépendants, PME et particuliers. Conception, développement, référencement et mise en ligne par YG Services.';
const path = '/sites-web';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'Création de sites internet à Yverdon',
};

const webFaq = faqItems.filter((item) => item.category === 'Sites internet');

export default function SitesWebPage() {
  return (
    <>
      <PageHero
        eyebrow="Indépendants, PME et particuliers"
        title="Un site internet qui apporte des demandes"
        lead="De la première discussion jusqu’à la mise en ligne, YG Services prend en charge l’ensemble du projet. Ni agence à coordonner, ni prestataire intermédiaire."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Sites internet', path: '/sites-web' },
        ]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="#formules" size="lg">
            Voir les formules
          </Button>
          <Button href="/contact?sujet=creer-site" variant="secondary" size="lg">
            Décrire mon projet
          </Button>
        </div>
      </PageHero>

      {/* Méthode */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Ma méthode"
          title="Sept étapes, dans cet ordre"
          lead="Chaque projet suit le même déroulement. Vous savez toujours où en est le travail et ce qui vient ensuite."
        />
        <ol className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {webProcess.map((step, index) => (
            <Reveal as="li" key={step.step} delay={index * 50}>
              <div className="border-t-2 border-ink-900 pt-5">
                <p className="font-display text-sm text-accent-600">{step.step}</p>
                <h3 className="mt-1.5 font-display text-xl text-ink-900">{step.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-600">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Formules */}
      <Section id="formules" tone="sand">
        <SectionHeading
          eyebrow="Les formules"
          title="Trois formules, un devis clair"
          lead="Le montant est fixé avant le début du travail. Aucune ligne ne s’ajoute en cours de route sans votre accord."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 80}>
              <PricingCard plan={plan} />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink-500">
          Les montants indiqués sont des prix de départ. Le devis final dépend du nombre de pages,
          des contenus à produire et des fonctionnalités souhaitées. Le nom de domaine et
          l’hébergement font l’objet d’un coût annuel séparé, indiqué dès le devis.
        </p>
      </Section>

      {/* Comparatif */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Comparatif"
          title="Ce que contient chaque formule"
          lead="Pour choisir sans lire trois pages de conditions."
        />
        <div className="mt-12">
          <ComparisonTable />
        </div>
        <div className="mt-10">
          <Button href="/contact?sujet=creer-site" size="lg">
            Demander un devis
            <ArrowRight />
          </Button>
        </div>
      </Section>

      {/* Réalisations */}
      <Section tone="sand">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Exemples"
            title="Des sites conçus et développés par YG Services"
            lead="Ces sites sont consultables directement."
          />
          <Button href="/realisations" variant="secondary">
            Toutes les réalisations
            <ArrowRight />
          </Button>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 70}>
              <PortfolioCard project={project} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Référencement local */}
      <Section tone="white" size="narrow">
        <SectionHeading
          eyebrow="Référencement"
          title="Un site qu’on trouve, pas seulement un site qui existe"
        />
        <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink-600">
          <p>
            Un beau site que personne ne trouve ne sert à rien. Chaque projet livré est
            optimisé techniquement : structure des titres, métadonnées uniques, vitesse de
            chargement, version mobile, données structurées, plan du site.
          </p>
          <p>
            La formule Pro va plus loin sur le référencement local : les pages sont travaillées sur
            les termes que vos clients utilisent réellement dans le Nord vaudois, le canton de Vaud
            ou la Suisse romande, et la Search Console est configurée pour suivre les résultats.
          </p>
          <p>
            Ce qui n’est pas fait : créer vingt pages presque identiques en changeant simplement le
            nom de la ville. Cela ne fonctionne plus et dessert le site entier. Dix pages réellement
            utiles valent mieux.
          </p>
        </div>
        <Button href="/blog/referencement-local-entreprise-vaudoise" variant="secondary" className="mt-8">
          Lire l’article sur le référencement local
          <ArrowRight />
        </Button>
      </Section>

      {/* FAQ */}
      <Section tone="sand" size="narrow">
        <SectionHeading eyebrow="FAQ" title="Les questions posées avant de commencer" />
        <div className="mt-10">
          <Faq items={webFaq} />
        </div>
      </Section>

      <FinalCta
        title="Parlons de votre site"
        text="Décrivez ce que vous voulez obtenir. Vous recevrez une réponse précisant ce qui est réalisable, dans quel délai et à quel prix."
        ctaLabel="Décrire mon projet"
        ctaHref="/contact?sujet=creer-site"
        secondary={{ href: '/realisations', label: 'Voir les réalisations' }}
      />

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Sites web', path },
          ]),
          faqSchema(webFaq),
        ]}
      />
    </>
  );
}
