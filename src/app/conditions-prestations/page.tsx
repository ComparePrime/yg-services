import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Conditions de prestation';
const description =
  'Périmètre, délais, documents, modalités de paiement et conditions d’annulation applicables aux prestations administratives de YG Services.';
const path = '/conditions-prestations';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path, noIndex: true }),
};

export default function ConditionsPage() {
  return (
    <>
      <PageHero
        title="Conditions de prestation"
        lead="Ce qui s’applique à toute commande de prestation administrative. Les conditions propres à chaque prestation figurent sur sa fiche."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Conditions de prestation', path },
        ]}
      />

      <Section tone="white" size="narrow">
        <div className="prose-yg text-[16px]">
          <p>
            Ces conditions régissent les prestations administratives commandées auprès de{' '}
            {siteConfig.brand}. Elles complètent les{' '}
            <Link href="/mentions-legales">mentions légales</Link> et la{' '}
            <Link href="/confidentialite">politique de confidentialité</Link>.
          </p>

          <h2>Nature des prestations</h2>
          <p>
            Les prestations proposées sont des prestations d’assistance administrative et
            documentaire. Elles consistent à réunir, organiser, remplir et rédiger des documents à
            partir des informations et pièces transmises par le client.
          </p>
          <p>
            Elles ne constituent ni un conseil juridique, ni un conseil fiscal, ni une prestation de
            fiduciaire, ni une activité d’intermédiaire en assurance, ni une représentation devant
            une autorité. Lorsqu’une demande relève d’un professionnel agréé, le client en est
            informé et aucune prestation n’est facturée pour cette partie.
          </p>

          <h2>Périmètre d’une prestation</h2>
          <p>
            Chaque fiche indique ce qui est compris et ce qui ne l’est pas, les documents attendus
            et le délai indicatif. Le périmètre affiché au moment de la commande fait foi.
          </p>
          <p>
            Une demande qui s’avère plus étendue que le périmètre commandé fait l’objet d’une
            information et, le cas échéant, d’un devis complémentaire. Aucun supplément n’est
            facturé sans accord préalable du client.
          </p>

          <h2>Obligations du client</h2>
          <p>
            Le client fournit des informations exactes et complètes. Il reste responsable de
            l’exactitude des données transmises, du contenu final des documents qu’il signe ou
            envoie, et du respect des délais qui lui sont opposables.
          </p>
          <p>
            Les démarches exigeant une identification ou une signature personnelle sont effectuées
            par le client. {siteConfig.brand} prépare les documents et la marche à suivre.
          </p>

          <h2>Délais</h2>
          <p>
            Les délais indiqués sont des délais indicatifs en jours ouvrables. Ils courent à compter
            de la réception d’un dossier complet, c’est-à-dire lorsque l’ensemble des informations et
            documents nécessaires a été transmis.
          </p>
          <p>
            Un dossier incomplet suspend le délai. Le client est informé des pièces manquantes dès
            leur constat. Les délais peuvent varier selon la complexité du dossier et, pour les
            prestations fiscales, selon la période de l’année.
          </p>

          <h2>Prix et paiement</h2>
          <p>
            Les prix sont indiqués en francs suisses. Les prestations portant la mention « dès »
            font l’objet d’un montant ferme communiqué après examen du dossier et avant tout
            engagement.
          </p>
          <p>
            Les options éventuelles sont annoncées avant la commande et ajoutées au total. Aucun
            frais n’est facturé sans avoir été annoncé.
          </p>
          <p>
            Le règlement par carte bancaire n’est pas encore disponible. Les commandes sont
            confirmées par écrit et la facture est adressée avant le début du traitement.
          </p>

          <h2>Abonnements mensuels</h2>
          <p>
            Les prestations facturées mensuellement sont conclues pour une durée indéterminée et
            peuvent être résiliées par chaque partie pour la fin d’un mois, moyennant un préavis de
            trente jours. Les prestations déjà exécutées restent dues.
          </p>

          <h2>Annulation et corrections</h2>
          <p>
            Une commande peut être annulée sans frais tant que le traitement n’a pas commencé. Si le
            traitement a débuté, la part déjà réalisée est facturée au prorata.
          </p>
          <p>
            Les corrections de documents sont comprises dans la limite indiquée sur chaque fiche.
            Une correction rendue nécessaire par une erreur de {siteConfig.brand} est effectuée sans
            frais et sans limite. Une modification résultant d’informations erronées ou
            incomplètes fournies par le client peut faire l’objet d’une facturation complémentaire,
            annoncée au préalable.
          </p>

          <h2>Absence de garantie de résultat</h2>
          <p>
            Aucune prestation ne garantit un résultat. L’octroi d’un subside, d’une aide ou d’une
            allocation, l’acceptation d’un dossier, l’obtention d’une baisse de loyer ou l’issue
            d’une contestation relèvent exclusivement de la décision de l’autorité ou du tiers
            concerné.
          </p>

          <h2>Responsabilité</h2>
          <p>
            {siteConfig.brand} répond des dommages causés par une faute dans l’exécution de la
            prestation, dans les limites prévues par le droit suisse. Aucune clause des présentes
            conditions n’a pour effet d’exclure la responsabilité en cas de faute grave ou
            intentionnelle, ni de restreindre les droits impératifs du client.
          </p>

          <h2>Documents et confidentialité</h2>
          <p>
            Les documents transmis ne servent qu’à l’exécution de la prestation commandée. Ils ne
            sont communiqués à aucun tiers sans accord préalable du client et sont supprimés sur
            demande, sous réserve des durées de conservation légales. Les modalités figurent dans la{' '}
            <Link href="/confidentialite">politique de confidentialité</Link>.
          </p>

          <h2>Droit applicable</h2>
          <p>
            Les présentes conditions sont soumises au droit suisse. Les dispositions légales
            impératives en faveur des consommateurs demeurent réservées.
          </p>

          <h2>Questions</h2>
          <p>
            Pour toute question relative à ces conditions, vous pouvez écrire via le{' '}
            <Link href="/contact">formulaire de contact</Link>.
          </p>
        </div>
      </Section>

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Conditions de prestation', path },
          ]),
        ]}
      />
    </>
  );
}
