import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { LegalValue } from '@/components/LegalPlaceholder';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Politique de confidentialité';
const description =
  "Comment sont traitées les données transmises via le site yg-services.ch, conformément à la loi fédérale suisse sur la protection des données.";
const path = '/confidentialite';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path, noIndex: true }),
};

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero
        title="Politique de confidentialité"
        lead="Ce que je collecte, pourquoi, pendant combien de temps, et ce que vous pouvez demander à tout moment."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Confidentialité', path },
        ]}
      />

      <Section tone="white" size="narrow">
        <div className="prose-yg text-[16px]">
          <p>
            Cette politique décrit le traitement des données personnelles effectué dans le cadre du
            site {siteConfig.domain}. Elle est établie conformément à la loi fédérale suisse sur la
            protection des données (LPD).
          </p>

          <h2>Responsable du traitement</h2>
          <p>
            {siteConfig.person.fullName} — {siteConfig.brand}
            <br />
            {siteConfig.location.city}, {siteConfig.location.region}, {siteConfig.location.country}
            <br />
            Contact : <LegalValue value={siteConfig.contact.email} label="adresse e-mail" />
          </p>

          <h2>Quelles données je collecte</h2>
          <p>Je collecte uniquement les données que vous me transmettez volontairement :</p>
          <ul>
            <li>Votre prénom et votre nom</li>
            <li>Votre adresse e-mail</li>
            <li>Votre numéro de téléphone, si vous choisissez de l’indiquer</li>
            <li>Le sujet de votre demande</li>
            <li>Le contenu de votre message</li>
            <li>Les documents que vous joignez à votre demande, le cas échéant</li>
          </ul>
          <p>
            Aucun compte utilisateur n’est créé et aucune donnée n’est collectée à votre insu en
            dehors de ce que vous saisissez dans le formulaire.
          </p>

          <h2>Pourquoi ces données sont utilisées</h2>
          <p>
            Vos données servent exclusivement à traiter votre demande : vous répondre, comprendre
            votre situation, établir un devis ou réaliser la prestation convenue. Elles ne sont
            jamais vendues, louées ni transmises à des tiers à des fins publicitaires ou
            commerciales.
          </p>
          <p>
            Si le traitement de votre demande nécessite de transmettre une information à un tiers
            (par exemple une assurance ou une administration), cela ne se fait qu’avec votre accord
            préalable et à votre initiative.
          </p>

          <h2>Documents sensibles</h2>
          <p>
            Certaines demandes impliquent des documents contenant des données sensibles, notamment
            des contrats d’assurance ou des pièces relatives à votre logement. Ces documents sont
            traités avec la même confidentialité que le reste de votre dossier, utilisés uniquement
            pour la prestation demandée, et supprimés sur simple demande de votre part.
          </p>

          <h2>Durée de conservation</h2>
          <p>
            Les demandes sans suite sont conservées le temps nécessaire au traitement de l’échange,
            puis supprimées. Les dossiers ayant donné lieu à une prestation sont conservés le temps
            requis par les obligations légales suisses en matière de comptabilité et de preuve. Vous
            pouvez demander la suppression de vos données à tout moment, sous réserve de ces
            obligations.
          </p>

          <h2>Hébergement et sous-traitants</h2>
          <p>
            Le site est hébergé par : <LegalValue value={siteConfig.legal.host} label="hébergeur" />.
            L’hébergeur peut être amené à traiter des données techniques (journaux de connexion,
            adresses IP) pour assurer le fonctionnement et la sécurité du service.
          </p>
          {siteConfig.legal.hostCountry ? (
            <p>
              Les serveurs de l’hébergeur peuvent se situer hors de Suisse, notamment aux{' '}
              {siteConfig.legal.hostCountry}. Les données techniques liées à la simple consultation
              du site sont donc susceptibles d’être traitées à l’étranger.
            </p>
          ) : null}
          <p>
            Les messages envoyés depuis le formulaire de contact sont acheminés vers ma messagerie
            professionnelle,{' '}
            <LegalValue value={siteConfig.contact.email} label="adresse e-mail de réception" />,
            hébergée par Infomaniak, en Suisse. Le contenu de votre message et les documents que
            vous joignez ne transitent par aucun autre prestataire.
          </p>

          <h2>Cookies</h2>
          <p>
            Ce site ne dépose aucun cookie publicitaire ni cookie de suivi tiers. Aucun consentement
            n’est requis pour le simple fait de consulter ces pages.
          </p>

          <h2>Mesure d’audience</h2>
          {siteConfig.analytics.googleAnalytics ? (
            <p>
              Un outil de mesure d’audience est utilisé pour comprendre comment les pages sont
              consultées. Les données collectées sont statistiques et servent uniquement à améliorer
              le site.
            </p>
          ) : (
            <p>
              Aucun outil de mesure d’audience n’est actuellement actif sur ce site. Si cela devait
              changer, cette page serait mise à jour avant l’activation, avec le nom de l’outil, les
              données collectées et leur finalité.
            </p>
          )}
          {siteConfig.analytics.googleSearchConsole ? (
            <p>
              La Google Search Console est utilisée pour suivre la présence du site dans les
              résultats de recherche. Elle fournit des statistiques agrégées et ne permet pas
              d’identifier les visiteurs individuellement.
            </p>
          ) : null}

          <h2>Sécurité</h2>
          <p>
            Le site est servi en HTTPS et les données transmises via le formulaire circulent de
            manière chiffrée. Je prends les mesures raisonnables pour protéger vos informations, tout
            en rappelant qu’aucune transmission par internet n’est absolument infaillible.
          </p>

          <h2>Vos droits</h2>
          <p>Conformément à la LPD, vous pouvez à tout moment :</p>
          <ul>
            <li>demander l’accès aux données que je détiens à votre sujet ;</li>
            <li>en demander la rectification si elles sont inexactes ;</li>
            <li>en demander la suppression ;</li>
            <li>vous opposer à leur traitement ;</li>
            <li>demander qu’elles vous soient remises dans un format lisible.</li>
          </ul>
          <p>
            Une demande se fait par e-mail à{' '}
            <LegalValue value={siteConfig.contact.email} label="adresse e-mail" /> ou via le{' '}
            <a href="/contact">formulaire de contact</a>. Vous disposez également du droit de vous
            adresser au Préposé fédéral à la protection des données et à la transparence (PFPDT).
          </p>

          <h2>Modifications</h2>
          <p>
            Cette politique peut être adaptée si les outils ou les traitements évoluent. La version
            en ligne est toujours celle qui fait foi.
          </p>
        </div>
      </Section>

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Confidentialité', path },
          ]),
        ]}
      />
    </>
  );
}
