import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
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
            Raison sociale :{' '}
            <LegalValue value={siteConfig.legal.companyName} label="raison sociale" />
            <br />
            Responsable de la publication : {siteConfig.legal.responsiblePublication}
            <br />
            Adresse : <LegalValue value={siteConfig.legal.address} label="adresse postale" />
            <br />
            Localité : {siteConfig.location.city}, {siteConfig.location.region},{' '}
            {siteConfig.location.country}
            <br />
            E-mail : <LegalValue value={siteConfig.contact.email} label="adresse e-mail" />
            <br />
            Téléphone : <LegalValue value={siteConfig.contact.phone} label="numéro de téléphone" />
            <br />
            Numéro IDE : <LegalValue value={siteConfig.legal.ideNumber} label="numéro IDE" />
            <br />
            Numéro de TVA : <LegalValue value={siteConfig.legal.vatNumber} label="numéro de TVA" />
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par :{' '}
            <LegalValue value={siteConfig.legal.host} label="hébergeur" />
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus présents sur ce site (textes, structure, mise en page, éléments
            graphiques et code) est la propriété de {siteConfig.person.fullName}, sauf mention
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
