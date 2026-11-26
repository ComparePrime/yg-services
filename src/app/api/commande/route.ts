import { NextResponse } from 'next/server';
import { getPrestation } from '@/config/catalogue';
import {
  calculerTotal,
  modeCommande,
  referenceCommande,
  validerCommande,
  type OrderPayload,
} from '@/lib/order';
import { deliverOrder } from '@/lib/order-mailer';
import { paiementActif, creerSessionPaiement } from '@/lib/stripe';

export const runtime = 'nodejs';

/** Limitation par adresse IP, en mémoire. */
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'inconnu';

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Trop de demandes envoyées. Merci de réessayer dans quelques minutes.' },
      { status: 429 },
    );
  }

  let body: Partial<OrderPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Requête invalide.' }, { status: 400 });
  }

  // Champ piège : rempli uniquement par les robots.
  if (body.societe) {
    return NextResponse.json({ ok: true, reference: referenceCommande() });
  }

  // La validation serveur refait tous les contrôles, y compris la
  // vérification que les options retenues sont bien proposées.
  const errors = validerCommande(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const payload = body as OrderPayload;
  const prestation = getPrestation(payload.prestation);
  if (!prestation) {
    return NextResponse.json({ ok: false, error: 'Prestation inconnue.' }, { status: 422 });
  }

  const reference = referenceCommande();

  try {
    await deliverOrder(payload, reference);
  } catch (error) {
    console.error('[commande] Échec de l’acheminement', error);
    return NextResponse.json(
      {
        ok: false,
        error:
          'Votre commande n’a pas pu être enregistrée. Merci de réessayer, ou de nous écrire par e-mail.',
      },
      { status: 502 },
    );
  }

  // Le paiement en ligne n'est proposé que pour un montant ferme, et
  // seulement si Stripe est configuré. Le montant envoyé à Stripe est
  // recalculé ici à partir du catalogue, jamais repris du navigateur.
  if (paiementActif() && modeCommande(prestation) === 'ferme') {
    const total = calculerTotal(prestation, payload.options);
    try {
      const url = await creerSessionPaiement({
        prestation,
        total,
        reference,
        email: payload.reponses.email,
        origin: new URL(request.url).origin,
      });
      if (url) return NextResponse.json({ ok: true, reference, paiement: url });
    } catch (error) {
      // Un échec de paiement ne perd pas la commande : elle est déjà
      // enregistrée et sera facturée.
      console.error('[commande] Session de paiement non créée', error);
    }
  }

  return NextResponse.json({ ok: true, reference });
}
