import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import Link from 'next/link';
import { LegalValue } from '@/components/LegalPlaceholder';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/structured-data';

const title = 'Mentions légales';
const description = 'Mentions légales du site yg-services.ch, éditeur, hébergement et propriété intellectuelle.';
const path = '/mentions-legales';

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path, noIndex: true }),
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero
        title="Mentions légales"
        lead="Informations relatives à l’éditeur du site et à son hébergement."
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Mentions légales', path },
        ]}
      />

      <Section tone="white" size="narrow">
        <div className="prose-yg text-[16px]">
          <h2>Éditeur du site</h2>
          <p>
            Nom commercial : {siteConfig.brand}
            <br />
            {siteConfig.legal.registeredInCommercialRegister ? (
              <>
                Raison sociale :{' '}
                <LegalValue value={siteConfig.legal.companyName} label="raison sociale" />
                <br />
                Numéro IDE : <LegalValue value={siteConfig.legal.ideNumber} label="numéro IDE" />
                <br />
              </>
            ) : (
              <>
                Forme : activité indépendante exercée en nom propre, non inscrite au registre du
                commerce.
                <br />
              </>
            )}
            {siteConfig.legal.vatNumber ? (
              <>
                Numéro de TVA : {siteConfig.legal.vatNumber}
                <br />
              </>
            ) : null}
            Exploitant :{' '}
            <LegalValue value={siteConfig.legal.operator} label="exploitant" />
            <br />
            {siteConfig.legal.responsiblePublication ? (
              <>
                Responsable de la publication : {siteConfig.legal.responsiblePublication}
                <br />
              </>
            ) : null}
            Adresse : <LegalValue value={siteConfig.legal.address} label="adresse postale" />
            <br />
            E-mail : <LegalValue value={siteConfig.contact.email} label="adresse e-mail" />
          </p>
          <p>
            Le contact se fait par le formulaire du site ou par e-mail. Aucun numéro de téléphone
            n’est publié : la loi n’en exige pas pour un site de commerce électronique suisse.
          </p>

          <h2>Vente de prestations en ligne</h2>
          <p>
            Ce site permet de commander des prestations. Les informations suivantes sont fournies
            au titre de l’art. 3 al. 1 let. s de la loi fédérale contre la concurrence déloyale
            (LCD) :
          </p>
          <ul>
            <li>
              <strong>Identité et adresse de contact</strong> : indiquées ci-dessus, adresse
              électronique comprise.
            </li>
            <li>
              <strong>Prix</strong> : indiqués en francs suisses sur chaque fiche de prestation,
              suppléments non optionnels compris. Les options éventuelles et les frais de
              déplacement éventuels sont annoncés avant la commande et figurent sur une ligne
              distincte du récapitulatif.
            </li>
            <li>
              <strong>Étapes techniques menant au contrat</strong> : choix de la prestation, choix
              du déroulement et des options, saisie des informations, récapitulatif chiffré, puis
              validation. Le récapitulatif précède toujours la validation.
            </li>
            <li>
              <strong>Confirmation de commande</strong> : une confirmation est adressée sans délai
              par voie électronique, avec la référence, le montant, le délai et les pièces
              attendues.
            </li>
          </ul>
          <p>
            Les conditions applicables à une commande figurent dans les{' '}
            <Link href="/conditions-prestations">conditions de prestation</Link>. Le droit suisse
            ne prévoit pas de droit de révocation général pour les achats en ligne ; les
            conditions de prestation accordent néanmoins une annulation sans frais tant que le
            traitement n’a pas commencé.
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par :{' '}
            <LegalValue value={siteConfig.legal.host} label="hébergeur" />
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus présents sur ce site (textes, structure, mise en page, éléments
            graphiques et code) est la propriété de {siteConfig.brand}, sauf mention
            contraire. Toute reproduction, représentation ou diffusion, totale ou partielle, sans
            autorisation écrite préalable est interdite.
          </p>
          <p>
            Les noms et visuels des projets présentés dans la rubrique Réalisations restent la
            propriété de leurs titulaires respectifs. Ils sont mentionnés à titre de références de
            travail.
          </p>

          <h2>Nature des prestations</h2>
          <p>
            Les prestations d’accompagnement administratif proposées sur ce site sont de nature
            administrative et organisationnelle. Elles ne constituent ni un conseil juridique, ni un
            conseil fiscal, ni une prestation de fiduciaire, ni une activité réglementée dans ces
            domaines. Lorsqu’une situation nécessite l’intervention d’un professionnel spécialisé,
            cela vous est indiqué.
          </p>
          <p>
            Les informations publiées sur ce site, notamment dans la rubrique Conseils, sont données
            à titre indicatif et à jour au moment de leur publication. Elles ne remplacent pas
            l’examen d’une situation individuelle.
          </p>

          <h2>Responsabilité</h2>
          <p>
            Je m’efforce d’assurer l’exactitude des informations publiées. Ma responsabilité ne peut
            toutefois être engagée en cas d’erreur, d’omission, d’indisponibilité temporaire du site,
            ou d’utilisation faite des informations qui y figurent.
          </p>
          <p>
            Ce site peut contenir des liens vers des sites tiers. Je n’exerce aucun contrôle sur leur
            contenu et décline toute responsabilité à leur égard.
          </p>

          <h2>Droit applicable</h2>
          <p>
            Le présent site et les prestations qui y sont décrites sont soumis au droit suisse. Le for
            est celui du siège de l’éditeur, sous réserve des dispositions légales impératives.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question relative à ces mentions légales, vous pouvez me contacter via le{' '}
            <a href="/contact">formulaire de contact</a>.
          </p>
        </div>
      </Section>

      <JsonLd
        data={[
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Mentions légales', path },
          ]),
        ]}
      />
    </>
  );
}
