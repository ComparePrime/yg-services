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

const title = 'Création de site web à Yverdon-les-Bains et en Suisse romande';
const description =
  "Conception, design, développement, référencement et mise en ligne : je crée votre site web de A à Z. Trois formules claires, un seul interlocuteur.";
const path = '/sites-web';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'Création de site web à Yverdon',
};

const webFaq = faqItems.filter((item) => item.category === 'Sites web');

export default function SitesWebPage() {
  return (
    <>
      <PageHero
        eyebrow="Création web"
        title="Je crée votre site web de A à Z"
        lead="De la première discussion jusqu’à la mise en ligne, je prends en charge l’ensemble du projet. Vous n’avez ni agence à coordonner, ni prestataire intermédiaire."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Sites web', path: '/sites-web' },
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
          lead="Chaque projet suit le même déroulement. Vous savez toujours où nous en sommes et ce qui vient ensuite."
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
          l’hébergement font l’objet d’un coût annuel séparé, que je vous indique dès le devis.
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
            title="Des sites que j’ai conçus et développés"
            lead="Vous pouvez les consulter directement."
          />
          <Button href="/realisations" variant="secondary">
            Toutes mes réalisations
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
            Un beau site que personne ne trouve ne sert à rien. Chaque projet que je livre est
            optimisé techniquement : structure des titres, métadonnées uniques, vitesse de
            chargement, version mobile, données structurées, plan du site.
          </p>
          <p>
            Avec la formule Pro, je vais plus loin sur le référencement local : je travaille les
            pages sur les termes que vos clients utilisent réellement dans le Nord vaudois, le canton
            de Vaud ou la Suisse romande, et je configure la Search Console pour suivre les
            résultats.
          </p>
          <p>
            Ce que je ne fais pas : créer vingt pages presque identiques en changeant simplement le
            nom de la ville. Cela ne fonctionne plus, et cela dessert le site entier. Je préfère dix
            pages réellement utiles.
          </p>
        </div>
        <Button href="/blog/referencement-local-entreprise-vaudoise" variant="secondary" className="mt-8">
          Lire mon article sur le référencement local
          <ArrowRight />
        </Button>
      </Section>

      {/* FAQ */}
      <Section tone="sand" size="narrow">
        <SectionHeading eyebrow="FAQ" title="Les questions qu’on me pose avant de commencer" />
        <div className="mt-10">
          <Faq items={webFaq} />
        </div>
      </Section>

      <FinalCta
        title="Parlons de votre site"
        text="Dites-moi ce que vous voulez obtenir, et je vous dirai ce que je peux faire, dans quel délai et à quel prix."
        ctaLabel="Décrire mon projet"
        ctaHref="/contact?sujet=creer-site"
        secondary={{ href: '/realisations', label: 'Voir mes réalisations' }}
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
