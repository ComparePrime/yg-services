import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Check } from '@/components/ui/Check';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { documents } from '@/config/documents';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Comment vos documents sont transmis et protégés';
const description =
  'Dépôt sécurisé hébergé en Suisse, aucun document stocké sur ce site, aucun lien de téléchargement public. Ce qui est fait de vos pièces, et pour combien de temps.';
const path = '/transmission-securisee';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path }),
  title: 'Transmission sécurisée de vos documents',
};

const questions = [
  {
    question: 'Pourquoi ne puis-je pas joindre mes documents au formulaire ?',
    answer:
      'Parce qu’une pièce jointe part par courriel. Le courriel n’est pas chiffré de bout en bout, il reste dans une boîte de réception sans durée définie et il se duplique dans les sauvegardes. Pour un certificat de salaire, un frais médical ou une pièce d’identité, ce n’est pas un canal acceptable. Le dépôt sécurisé existe pour cela.',
  },
  {
    question: 'Si quelqu’un trouve mon lien de dépôt, peut-il voir mes documents ?',
    answer:
      'Non. Un lien de dépôt n’autorise que l’envoi : il ne permet ni de lister, ni d’ouvrir, ni de télécharger quoi que ce soit. Quelqu’un qui le possèderait pourrait au pire déposer un fichier indésirable. C’est précisément pour cette raison qu’une boîte de dépôt est utilisée, et non un lien de partage.',
  },
  {
    question: 'Où mes documents sont-ils stockés ?',
    answer:
      'Sur un espace kDrive d’Infomaniak, hébergé en Suisse et soumis au droit suisse. Ils ne sont pas stockés sur ce site, qui ne sert aucun fichier et ne publie aucun lien de téléchargement.',
  },
  {
    question: 'Combien de temps mes documents sont-ils conservés ?',
    answer:
      'Le temps du mandat, puis ils sont supprimés sur demande. Les pièces soumises à une obligation de conservation légale sont gardées le temps prévu par la loi. Vous pouvez demander la suppression de vos documents à tout moment.',
  },
  {
    question: 'Mes documents sont-ils transmis à quelqu’un d’autre ?',
    answer:
      'Non, sauf si vous le demandez — par exemple pour remettre un dossier à votre fiduciaire. Aucun document n’est envoyé à un tiers sans votre accord, et aucun n’est déposé dans un outil qui ne sert pas directement à votre dossier.',
  },
];

export default function TransmissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Vos documents"
        title="Vos documents ne passent pas par ce site"
        lead="Beaucoup de prestations demandent des pièces qui ne se confient pas à la légère. Voici exactement par où elles passent, qui peut les voir, et combien de temps elles sont conservées."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Transmission sécurisée', path },
        ]}
      />

      <Section tone="white">
        <SectionHeading
          eyebrow="Le principe"
          title="Un dépôt, pas une pièce jointe"
          lead="Le site n’héberge aucun fichier, ne sert aucun document et ne publie aucun lien de téléchargement. Il n’y a donc rien à y dérober."
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {documents.garanties.map((garantie) => (
            <li key={garantie} className="flex gap-3 rounded-2xl bg-sand p-6">
              <Check className="mt-1 shrink-0 text-accent-600" />
              <span className="text-[15px] leading-relaxed text-ink-700">{garantie}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand">
        <SectionHeading eyebrow="En pratique" title="Comment cela se passe" />
        <ol className="mt-10 space-y-6">
          {documents.etapes.map((etape, index) => (
            <li key={etape} className="flex gap-5">
              <span className="font-display text-xl text-accent-600">{`0${index + 1}`}</span>
              <p className="pt-0.5 text-[15px] leading-relaxed text-ink-700">{etape}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl bg-white p-7 ring-1 ring-ink-200">
          <h3 className="font-display text-lg text-ink-900">
            Ce qu’il ne faut pas envoyer par courriel
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
            Le formulaire de contact convient à une question, à une capture d’écran ou à un
            document anodin. Il ne convient pas à ceci :
          </p>
          <ul className="mt-4 space-y-2 text-[15px] text-ink-700">
            {documents.jamaisParCourriel.map((item) => (
              <li key={item} className="flex items-baseline gap-2.5">
                <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
            Ces pièces vous sont demandées après votre commande, par le dépôt sécurisé. Vous
            n’avez rien à préparer avant.
          </p>
        </div>
      </Section>

      <Section tone="white" size="narrow">
        <SectionHeading eyebrow="Conservation" title="Combien de temps, et comment supprimer" />
        <dl className="mt-10 space-y-6 text-[15px]">
          {[
            ['Pendant le mandat', documents.conservation.dossierCourant],
            ['Pièces comptables', documents.conservation.piecesComptables],
            ['Suppression', documents.conservation.suppression],
            ['Validité du lien de dépôt', `Le lien expire après ${documents.validiteLien}.`],
          ].map(([terme, texte]) => (
            <div key={terme}>
              <dt className="font-medium text-ink-900">{terme}</dt>
              <dd className="mt-1 leading-relaxed text-ink-600">{texte}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 text-[15px] leading-relaxed text-ink-600">
          Le détail du traitement de vos données figure dans la{' '}
          <Link href="/confidentialite" className="underline underline-offset-2 hover:text-ink-900">
            politique de confidentialité
          </Link>
          , et les règles applicables à une commande dans les{' '}
          <Link
            href="/conditions-prestations"
            className="underline underline-offset-2 hover:text-ink-900"
          >
            conditions de prestation
          </Link>
          .
        </p>
      </Section>

      <Section tone="sand" size="narrow">
        <SectionHeading eyebrow="FAQ" title="Les questions qui reviennent" />
        <div className="mt-10">
          <Faq items={questions} />
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/assistance-administrative">Voir les prestations</Button>
          <Button href="/contact?sujet=administratif" variant="secondary">
            Poser une question
          </Button>
        </div>
      </Section>

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Transmission sécurisée', path },
          ]),
          faqSchema(questions),
        ]}
      />
    </>
  );
}
