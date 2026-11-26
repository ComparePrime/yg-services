import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { getCategorie, getOption } from '@/config/catalogue';
import { getModalite, getZone, deplacement } from '@/config/intervention';
import { formatChf, mentionTva, tva } from '@/config/tva';
import { paiementActif, webhookConfigure } from '@/lib/stripe';
import {
  chiffreAffaires,
  listerCommandes,
  piloteEnService,
  STATUTS_COMMANDE,
  STATUTS_PAIEMENT,
  type Commande,
} from '@/lib/store';
import { progressionSeuil } from '@/lib/alerte-tva';

export const metadata: Metadata = {
  title: { absolute: 'Commandes — YG Services' },
  robots: { index: false, follow: false },
};

// Le tableau de bord lit l'état courant : il ne peut pas être mis en cache.
export const dynamic = 'force-dynamic';

const dateLisible = (iso: string) =>
  new Date(iso).toLocaleString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const libelleStatut = (valeur: string) =>
  STATUTS_COMMANDE.find((s) => s.value === valeur)?.label ?? valeur;
const libellePaiement = (valeur: string) =>
  STATUTS_PAIEMENT.find((s) => s.value === valeur)?.label ?? valeur;

const couleurStatut: Record<string, string> = {
  recue: 'bg-accent-50 text-accent-800 ring-accent-200',
  'en-cours': 'bg-amber-50 text-amber-900 ring-amber-200',
  livree: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
  annulee: 'bg-ink-100 text-ink-600 ring-ink-200',
};

export default async function AdminPage() {
  const [commandes, chiffres, pilote] = await Promise.all([
    listerCommandes(),
    chiffreAffaires(),
    piloteEnService(),
  ]);

  const enAttente = commandes.filter((c) => c.statut === 'recue' || c.statut === 'en-cours');
  const progression = progressionSeuil(chiffres.encaisse);
  const prochainSeuil = tva.seuilsAlerte.find((seuil) => chiffres.encaisse < seuil);

  return (
    <div className="min-h-screen bg-sand py-10">
      <Container>
        <header>
          <h1 className="font-display text-3xl text-ink-900">Commandes</h1>
          <p className="mt-2 text-[15px] text-ink-600">
            {commandes.length} commande{commandes.length > 1 ? 's' : ''} enregistrée
            {commandes.length > 1 ? 's' : ''}, dont {enAttente.length} à traiter.
          </p>
        </header>

        {/* Indicateurs */}
        <section aria-labelledby="chiffres" className="mt-8">
          <h2 id="chiffres" className="sr-only">
            Chiffres de l’année
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Encaissé ou facturé', formatChf(chiffres.encaisse), `Année ${chiffres.annee}`],
              [
                'En attente de paiement',
                formatChf(chiffres.engage - chiffres.encaisse),
                'Commandes non annulées',
              ],
              ['À traiter', String(enAttente.length), 'Reçues ou en cours'],
              [
                'Seuil de TVA',
                `${progression} %`,
                prochainSeuil
                  ? `Prochaine alerte à ${formatChf(prochainSeuil)}`
                  : 'Tous les seuils franchis',
              ],
            ].map(([titre, valeur, note]) => (
              <div key={titre} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200">
                <dt className="text-sm text-ink-500">{titre}</dt>
                <dd className="mt-1.5 font-display text-2xl text-ink-900">{valeur}</dd>
                <p className="mt-1 text-xs text-ink-500">{note}</p>
              </div>
            ))}
          </dl>

          {/* Progression vers le seuil d'assujettissement */}
          <div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200">
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-ink-700">
                Chiffre d’affaires {chiffres.annee} face au seuil d’assujettissement
              </span>
              <span className="text-ink-900">
                {formatChf(chiffres.encaisse)} / {formatChf(tva.seuilAssujettissement)}
              </span>
            </div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100"
              role="img"
              aria-label={`${progression} % du seuil d’assujettissement atteint`}
            >
              <div
                className={`h-full rounded-full ${
                  progression >= 90
                    ? 'bg-red-600'
                    : progression >= 70
                      ? 'bg-amber-500'
                      : 'bg-accent-500'
                }`}
                style={{ width: `${Math.max(progression, 1)}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Cumul des commandes payées ou facturées passées par le site, année civile en cours,
              commandes annulées exclues. Les revenus facturés en dehors du site n’y figurent pas.
              Une alerte part par courriel à chaque seuil franchi :{' '}
              {tva.seuilsAlerte.map((s) => formatChf(s)).join(', ')}.
            </p>
          </div>
        </section>

        {/* État technique */}
        <section aria-labelledby="technique" className="mt-6">
          <h2 id="technique" className="sr-only">
            État technique
          </h2>
          <ul className="flex flex-wrap gap-2 text-xs">
            {[
              [`Stockage : ${pilote === 'netlify-blobs' ? 'Netlify Blobs' : 'fichiers locaux'}`, pilote === 'netlify-blobs'],
              [`Paiement par carte : ${paiementActif() ? 'actif' : 'inactif'}`, paiementActif()],
              [`Webhook Stripe : ${webhookConfigure() ? 'configuré' : 'non configuré'}`, webhookConfigure()],
              [`TVA : ${tva.assujetti ? 'assujetti' : 'non assujetti'}`, true],
              [`Frais de déplacement : ${deplacement.fraisActifs ? 'actifs' : 'inactifs'}`, true],
            ].map(([libelle, ok]) => (
              <li
                key={String(libelle)}
                className={`rounded-full px-3 py-1.5 ring-1 ${
                  ok ? 'bg-white text-ink-700 ring-ink-200' : 'bg-amber-50 text-amber-900 ring-amber-200'
                }`}
              >
                {libelle}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink-500">{mentionTva()}</p>
        </section>

        {/* Commandes */}
        <section aria-labelledby="liste" className="mt-10">
          <h2 id="liste" className="font-display text-xl text-ink-900">
            Toutes les commandes
          </h2>

          {commandes.length === 0 ? (
            <p className="mt-5 rounded-2xl bg-white p-6 text-[15px] text-ink-600 ring-1 ring-ink-200">
              Aucune commande enregistrée pour l’instant. Les commandes passées depuis le site
              apparaîtront ici, avec leur référence, leur montant et leur statut.
            </p>
          ) : (
            <ul className="mt-5 space-y-4">
              {commandes.map((commande) => (
                <li key={commande.reference} id={commande.reference}>
                  <CarteCommande commande={commande} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </Container>
    </div>
  );
}

function CarteCommande({ commande }: { commande: Commande }) {
  const categorie = getCategorie(commande.categorie);
  const modalite = commande.modalite ? getModalite(commande.modalite) : undefined;
  const zone = commande.zone ? getZone(commande.zone) : undefined;
  const options = commande.options
    .map((id) => getOption(id)?.label)
    .filter(Boolean)
    .join(', ');

  return (
    <details className="rounded-2xl bg-white ring-1 ring-ink-200 open:ring-ink-400">
      <summary className="cursor-pointer list-none p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="font-medium text-ink-900">
              {commande.reference}
              <span className="ml-3 font-normal text-ink-500">{commande.prestationTitre}</span>
            </p>
            <p className="mt-1 text-sm text-ink-500">
              {dateLisible(commande.recueLe)} · {commande.client.prenom} {commande.client.nom}
              {commande.client.localite ? ` · ${commande.client.localite}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-full px-3 py-1 ring-1 ${
                couleurStatut[commande.statut] ?? 'bg-ink-100 text-ink-700 ring-ink-200'
              }`}
            >
              {libelleStatut(commande.statut)}
            </span>
            <span
              className={`rounded-full px-3 py-1 ring-1 ${
                commande.paiement === 'payee'
                  ? 'bg-emerald-50 text-emerald-900 ring-emerald-200'
                  : 'bg-ink-100 text-ink-700 ring-ink-200'
              }`}
            >
              {libellePaiement(commande.paiement)}
            </span>
            <span className="font-display text-base text-ink-900">
              {formatChf(commande.total)}
              {commande.recurrence === 'mensuel' ? ' / mois' : ''}
            </span>
          </div>
        </div>
      </summary>

      <div className="border-t border-ink-100 p-5">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-ink-800">Commande</h3>
            <dl className="mt-3 space-y-1.5 text-sm">
              {[
                ['Domaine', categorie?.nom ?? commande.categorie],
                ['Options', options || 'aucune'],
                ['Déroulement', modalite?.label ?? 'à distance'],
                ...(zone ? ([['Zone', `${zone.nom} — rendez-vous sous ${zone.delaiRendezVous}`]] as const) : []),
                ['TVA incluse', commande.tva > 0 ? formatChf(commande.tva) : 'aucune'],
                ...(commande.stripeSession
                  ? ([['Session Stripe', commande.stripeSession]] as const)
                  : []),
                ...(commande.payeeLe ? ([['Payée le', dateLisible(commande.payeeLe)]] as const) : []),
              ].map(([cle, valeur]) => (
                <div key={cle} className="flex gap-2">
                  <dt className="shrink-0 text-ink-500">{cle} :</dt>
                  <dd className="break-all text-ink-900">{valeur}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-6 text-sm font-medium text-ink-800">Client</h3>
            <dl className="mt-3 space-y-1.5 text-sm">
              {[
                ['Nom', `${commande.client.prenom} ${commande.client.nom}`],
                ['E-mail', commande.client.email],
                ['Téléphone', commande.client.telephone || 'non communiqué'],
                [
                  'Localité',
                  [commande.client.npa, commande.client.localite, commande.client.canton]
                    .filter(Boolean)
                    .join(' ') || 'non communiquée',
                ],
              ].map(([cle, valeur]) => (
                <div key={cle} className="flex gap-2">
                  <dt className="shrink-0 text-ink-500">{cle} :</dt>
                  <dd className="break-all text-ink-900">{valeur}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-ink-800">Réponses du formulaire</h3>
            <dl className="mt-3 space-y-1.5 text-sm">
              {Object.entries(commande.reponses)
                .filter(([cle, valeur]) => valeur?.trim() && !['prenom', 'nom', 'email'].includes(cle))
                .map(([cle, valeur]) => (
                  <div key={cle} className="flex gap-2">
                    <dt className="shrink-0 text-ink-500">{cle} :</dt>
                    <dd className="text-ink-900">{valeur}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>

        {/* Mise à jour */}
        <form
          action="/api/admin/commande"
          method="post"
          className="mt-8 border-t border-ink-100 pt-6"
        >
          <input type="hidden" name="reference" value={commande.reference} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-ink-800"
                htmlFor={`statut-${commande.reference}`}
              >
                Statut de la commande
              </label>
              <select
                id={`statut-${commande.reference}`}
                name="statut"
                defaultValue={commande.statut}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900"
              >
                {STATUTS_COMMANDE.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-ink-800"
                htmlFor={`paiement-${commande.reference}`}
              >
                Paiement
              </label>
              <select
                id={`paiement-${commande.reference}`}
                name="paiement"
                defaultValue={commande.paiement}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900"
              >
                {STATUTS_PAIEMENT.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-1.5 block text-sm font-medium text-ink-800"
              htmlFor={`notes-${commande.reference}`}
            >
              Notes internes
            </label>
            <textarea
              id={`notes-${commande.reference}`}
              name="notes"
              rows={3}
              defaultValue={commande.notes ?? ''}
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900"
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </details>
  );
}
