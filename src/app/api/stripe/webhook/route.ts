import { NextResponse } from 'next/server';
import { lireEvenementWebhook, webhookConfigure } from '@/lib/stripe';
import { notifierPaiement } from '@/lib/order-mailer';
import { lireCommande, majCommande } from '@/lib/store';
import { verifierSeuilTva } from '@/lib/alerte-tva';

export const runtime = 'nodejs';

/**
 * Réception des événements Stripe.
 *
 * La signature est vérifiée avant toute lecture du contenu. Un corps non
 * signé, ou signé avec un autre secret, est rejeté sans être traité : c'est
 * ce contrôle, et non la redirection du navigateur, qui établit qu'un
 * paiement a bien eu lieu.
 */
export async function POST(request: Request) {
  if (!webhookConfigure()) {
    return NextResponse.json({ ok: false, error: 'Webhook non configuré.' }, { status: 503 });
  }

  // Le corps brut est nécessaire : la signature porte sur les octets reçus.
  const corps = await request.text();
  const signature = request.headers.get('stripe-signature');

  let evenement;
  try {
    evenement = lireEvenementWebhook(corps, signature);
  } catch (error) {
    console.error('[stripe] Signature refusée', error);
    return NextResponse.json({ ok: false, error: 'Signature invalide.' }, { status: 400 });
  }

  if (evenement.type === 'checkout.session.completed') {
    const session = evenement.data.object;

    // Même après vérification de la signature, on ne traite que les
    // sessions effectivement payées.
    if (session.payment_status === 'paid') {
      const reference = session.client_reference_id ?? session.metadata?.reference ?? null;
      const montant = session.amount_total === null ? null : session.amount_total / 100;

      // Le paiement est inscrit sur la commande enregistrée. C'est ce qui
      // remplace le rapprochement manuel entre Stripe et la commande.
      if (reference) {
        try {
          const commande = await lireCommande(reference);

          if (!commande) {
            console.error('[stripe] Paiement sans commande correspondante', reference);
          } else if (montant !== null && Math.abs(montant - commande.total) > 0.01) {
            // Un écart de montant n'est pas traité en silence : la commande
            // passe en paiement reçu mais l'écart est signalé.
            console.error(
              `[stripe] Écart de montant sur ${reference} : payé ${montant}, attendu ${commande.total}`,
            );
            await majCommande(reference, {
              paiement: 'payee',
              payeeLe: new Date().toISOString(),
              notes: `${commande.notes ? commande.notes + '\n' : ''}Écart de montant : payé CHF ${montant}, attendu CHF ${commande.total}.`,
            });
          } else {
            await majCommande(reference, {
              paiement: 'payee',
              payeeLe: new Date().toISOString(),
            });
          }
        } catch (error) {
          // Stripe réessaiera l'événement : on renvoie une erreur pour ne
          // pas perdre l'information de paiement.
          console.error('[stripe] Commande non mise à jour', error);
          return NextResponse.json({ ok: false }, { status: 500 });
        }
      }

      try {
        await notifierPaiement({
          reference: reference ?? 'inconnue',
          prestation: session.metadata?.prestation ?? 'inconnue',
          montant,
          email: session.customer_details?.email ?? session.customer_email ?? null,
        });
      } catch (error) {
        console.error('[stripe] Notification de paiement non délivrée', error);
        return NextResponse.json({ ok: false }, { status: 500 });
      }

      // Un paiement confirmé fait évoluer le chiffre d'affaires encaissé :
      // le seuil de TVA est revérifié ici aussi.
      try {
        await verifierSeuilTva();
      } catch (error) {
        console.error('[tva] Vérification du seuil impossible', error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
