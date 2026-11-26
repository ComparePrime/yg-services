import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { OrderForm } from '@/components/commande/OrderForm';
import { getCategorie, getPrestation, prestations } from '@/config/catalogue';
import { modeCommande } from '@/lib/order';
import { buildMetadata } from '@/lib/seo';

type Params = { params: Promise<{ prestation: string }> };

export function generateStaticParams() {
  return prestations
    .filter((prestation) => modeCommande(prestation) !== 'devis')
    .map((prestation) => ({ prestation: prestation.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { prestation: slug } = await params;
  const prestation = getPrestation(slug);
  if (!prestation) return {};

  // Les pages de commande ne sont pas indexées : la fiche de prestation est
  // la page de référence pour les moteurs de recherche.
  // Le suffixe de marque est retiré : ces pages ne sont pas indexées et le
  // titre n'a qu'à rester lisible dans l'onglet du navigateur.
  return {
    ...buildMetadata({
      title: `Commander — ${prestation.titreSeo ?? prestation.titre}`,
      description: `Commande de la prestation « ${prestation.titre} ».`,
      path: `/commande/${prestation.slug}`,
      noIndex: true,
    }),
    title: { absolute: `Commander — ${prestation.titreSeo ?? prestation.titre}` },
  };
}

export default async function CommandePage({ params }: Params) {
  const { prestation: slug } = await params;
  const prestation = getPrestation(slug);
  if (!prestation) notFound();

  const categorie = getCategorie(prestation.categorie);
  if (!categorie) notFound();

  // Une prestation sur devis ne se commande pas directement.
  if (modeCommande(prestation) === 'devis') {
    redirect(
      `/contact?sujet=administratif&besoin=${encodeURIComponent(`Devis : ${prestation.titre}`)}`,
    );
  }

  const fiche = `/assistance-administrative/${prestation.categorie}/${prestation.slug}`;

  return (
    <>
      <header className="border-b border-ink-100 bg-sand pb-10 pt-10 sm:pt-14">
        <Container>
          <nav aria-label="Fil d’Ariane">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
              <li>
                <Link href="/assistance-administrative" className="transition hover:text-ink-900">
                  Services administratifs
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={fiche} className="transition hover:text-ink-900">
                  {prestation.titre}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>Commande</li>
            </ol>
          </nav>

          <h1 className="mt-7 font-display text-3xl leading-[1.15] text-ink-900 sm:text-4xl">
            Commander : {prestation.titre}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
            Quelques questions, choisies en fonction de cette prestation. Aucune pièce n’est à
            joindre ici : les documents vous sont demandés après confirmation.
          </p>
        </Container>
      </header>

      <Section tone="white">
        <OrderForm prestation={prestation} />
      </Section>
    </>
  );
}
