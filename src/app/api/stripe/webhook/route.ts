import { NextResponse } from 'next/server';
import { lireEvenementWebhook, webhookConfigure } from '@/lib/stripe';
import { notifierPaiement } from '@/lib/order-mailer';

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
      try {
        await notifierPaiement({
          reference: session.client_reference_id ?? session.metadata?.reference ?? 'inconnue',
          prestation: session.metadata?.prestation ?? 'inconnue',
          montant: session.amount_total === null ? null : session.amount_total / 100,
          email: session.customer_details?.email ?? session.customer_email ?? null,
        });
      } catch (error) {
        // Stripe réessaiera : on renvoie une erreur pour ne pas perdre
        // l'événement si la notification échoue.
        console.error('[stripe] Notification de paiement non délivrée', error);
        return NextResponse.json({ ok: false }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
