import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo';
import { formatChf } from '@/config/tva';
import { paiementActif, verifierPaiement } from '@/lib/stripe';
import { lireCommande } from '@/lib/store';
import { documents, depotDisponible, lienDepot } from '@/config/documents';

export const metadata: Metadata = buildMetadata({
  title: 'Commande confirmée',
  description: 'Confirmation de votre commande.',
  path: '/commande/confirmation',
  noIndex: true,
});

// L'état du paiement est vérifié à chaque affichage : cette page ne peut
// pas être mise en cache.
export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ ref?: string; session?: string }> };

export default async function ConfirmationPage({ searchParams }: Props) {
  const { ref, session } = await searchParams;

  /**
   * Le retour du navigateur ne prouve rien : un visiteur peut forger
   * l'adresse. L'état du paiement est donc redemandé à Stripe côté serveur,
   * et c'est sa réponse seule qui fait foi.
   */
  let paiement: Awaited<ReturnType<typeof verifierPaiement>> | null = null;
  if (session && paiementActif()) {
    try {
      paiement = await verifierPaiement(session);
    } catch {
      paiement = null;
    }
  }

  // L'état enregistré de la commande fait foi pour tout le reste : le
  // paiement vérifié auprès de Stripe ne renseigne que le paiement.
  const commande = ref ? await lireCommande(ref).catch(() => null) : null;
  const paye = paiement?.paye === true || commande?.paiement === 'payee';
  const depot = lienDepot(commande?.depotUrl);

  return (
    <>
      <PageHero
        title={paye ? 'Paiement reçu' : 'Commande enregistrée'}
        lead={
          paye
            ? 'Votre paiement est confirmé et votre commande est en traitement.'
            : 'Votre commande est enregistrée. Vous recevez la confirmation par e-mail.'
        }
        breadcrumb={[
          { name: 'Accueil', path: '/' },
          { name: 'Commande', path: '/commande/confirmation' },
        ]}
      />

      <Section tone="white" size="narrow">
        <dl className="divide-y divide-ink-200 border-y border-ink-200 text-[15px]">
          {ref ? (
            <div className="flex justify-between gap-4 py-3.5">
              <dt className="text-ink-600">Référence</dt>
              <dd className="font-medium text-ink-900">{ref}</dd>
            </div>
          ) : null}
          {paye && paiement?.montant !== null && paiement?.montant !== undefined ? (
            <div className="flex justify-between gap-4 py-3.5">
              <dt className="text-ink-600">Montant réglé</dt>
              <dd className="font-medium text-ink-900">{formatChf(paiement.montant)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 py-3.5">
            <dt className="text-ink-600">État</dt>
            <dd className="text-ink-900">
              {paye
                ? 'Payée'
                : session
                  ? 'Paiement non confirmé pour l’instant'
                  : 'Enregistrée, facture à suivre'}
            </dd>
          </div>
        </dl>

        {session && !paye ? (
          <p className="mt-6 rounded-xl border-l-[3px] border-accent-400 bg-accent-50/70 px-5 py-4 text-[15px] leading-relaxed text-ink-700">
            Le paiement n’apparaît pas encore comme confirmé. Si vous venez de le valider, il peut
            prendre quelques instants à être enregistré. Votre commande est de toute façon bien
            reçue : rien n’est perdu, et vous serez recontacté.
          </p>
        ) : null}

        <h2 className="mt-12 font-display text-2xl text-ink-900">La suite</h2>
        <ol className="mt-6 space-y-5">
          {[
            [
              'Vous recevez la confirmation',
              'Elle récapitule le montant, le délai et la liste exacte des pièces attendues pour votre dossier.',
            ],
            [
              'Vous transmettez vos documents',
              depotDisponible(commande?.depotUrl)
                ? 'Par le dépôt sécurisé hébergé en Suisse, dont le lien figure dans votre confirmation. Les pièces ne passent pas par ce site.'
                : 'Par le moyen indiqué dans ce message. Les pièces ne se déposent pas sur ce site, et aucune pièce sensible ne doit partir par courriel.',
            ],
            [
              'Le délai commence',
              'Il court dès que le dossier est complet. S’il manque une pièce, cela vous est signalé tout de suite.',
            ],
          ].map(([titre, texte], index) => (
            <li key={titre} className="flex gap-5">
              <span className="font-display text-xl text-accent-600">{`0${index + 1}`}</span>
              <div>
                <h3 className="font-medium text-ink-900">{titre}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-600">{texte}</p>
              </div>
            </li>
          ))}
        </ol>

        {depot ? (
          <div className="mt-10 rounded-2xl bg-sand p-7">
            <h3 className="font-display text-lg text-ink-900">Déposer vos documents</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
              Nommez vos fichiers en commençant par votre référence{ref ? ` (${ref})` : ''}. Le
              dépôt n’autorise que l’envoi : personne ne peut consulter ce qui s’y trouve.
              {documents.depotProtege
                ? ' Le mot de passe du dépôt vous est communiqué séparément du lien.'
                : ''}
            </p>
            <Button href={depot} external className="mt-5">
              Ouvrir le dépôt sécurisé
            </Button>
          </div>
        ) : (
          <div className="mt-10 rounded-xl border-l-[3px] border-accent-400 bg-accent-50/70 px-5 py-4 text-[15px] leading-relaxed text-ink-700">
            <span className="font-semibold text-ink-900">Vos documents — </span>
            ne les envoyez pas encore. Les pièces attendues vous seront demandées dans la
            confirmation, par un canal adapté aux documents sensibles.
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/assistance-administrative">Revenir au catalogue</Button>
          <Button href="/transmission-securisee" variant="secondary">
            Comment vos documents sont protégés
          </Button>
        </div>
      </Section>
    </>
  );
}
