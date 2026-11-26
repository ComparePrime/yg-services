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
import { enregistrerCommande, majCommande, type Commande } from '@/lib/store';
import { verifierSeuilTva } from '@/lib/alerte-tva';

export const runtime = 'nodejs';

/**
 * Limitation par adresse IP, en mémoire.
 * `ORDER_RATE_LIMIT` permet de la relever pour jouer la suite de tests
 * sans que les contrôles suivants se heurtent au plafond. En production,
 * la variable n'est pas définie et la valeur par défaut s'applique.
 */
const RATE_LIMIT_MAX = Number(process.env.ORDER_RATE_LIMIT ?? 8);
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
  const total = calculerTotal(prestation, payload.options, payload.modalite, payload.zone);

  const commande: Commande = {
    reference,
    recueLe: new Date().toISOString(),
    prestation: prestation.slug,
    prestationTitre: prestation.titre,
    categorie: prestation.categorie,
    options: payload.options,
    ...(payload.modalite ? { modalite: payload.modalite } : {}),
    ...(payload.zone ? { zone: payload.zone } : {}),
    total: total.tva.total,
    tva: total.tva.montantTva,
    devise: 'CHF',
    ...(prestation.recurrence ? { recurrence: prestation.recurrence } : {}),
    client: {
      prenom: payload.reponses.prenom ?? '',
      nom: payload.reponses.nom ?? '',
      email: payload.reponses.email ?? '',
      ...(payload.reponses.telephone ? { telephone: payload.reponses.telephone } : {}),
      ...(payload.reponses.npa ? { npa: payload.reponses.npa } : {}),
      ...(payload.reponses.localite ? { localite: payload.reponses.localite } : {}),
      ...(payload.reponses.canton ? { canton: payload.reponses.canton } : {}),
    },
    reponses: payload.reponses,
    statut: 'recue',
    paiement: 'en-attente',
  };

  // L'enregistrement passe AVANT l'envoi des courriels : une commande ne
  // doit pas dépendre de la bonne réception d'un message. Si l'écriture
  // échoue, la commande est refusée plutôt que perdue en silence.
  try {
    await enregistrerCommande(commande);
  } catch (error) {
    console.error('[commande] Échec de l’enregistrement', error);
    return NextResponse.json(
      {
        ok: false,
        error:
          'Votre commande n’a pas pu être enregistrée. Merci de réessayer, ou de nous écrire par e-mail.',
      },
      { status: 502 },
    );
  }

  // Les courriels suivent. Un échec d'acheminement est signalé au client
  // mais la commande reste enregistrée : elle sera retrouvée au tableau
  // de bord, ce qui n'était pas le cas auparavant.
  let courrielsEnvoyes = true;
  try {
    await deliverOrder(payload, reference);
  } catch (error) {
    console.error('[commande] Échec de l’acheminement', error);
    courrielsEnvoyes = false;
  }


  // Le paiement en ligne n'est proposé que pour un montant ferme, et
  // seulement si Stripe est configuré. Le montant envoyé à Stripe est
  // recalculé ici à partir du catalogue, jamais repris du navigateur.
  if (paiementActif() && modeCommande(prestation) === 'ferme') {
    try {
      const session = await creerSessionPaiement({
        prestation,
        total,
        reference,
        email: payload.reponses.email,
        origin: new URL(request.url).origin,
      });
      if (session) {
        // L'identifiant de session est conservé afin de rapprocher le
        // paiement de la commande sans intervention manuelle.
        await majCommande(reference, { stripeSession: session.id });
        return NextResponse.json({ ok: true, reference, paiement: session.url });
      }
    } catch (error) {
      // Un échec de paiement ne perd pas la commande : elle est déjà
      // enregistrée. Elle bascule en facturation, sinon elle resterait en
      // attente d'un paiement que le client ne peut pas effectuer.
      console.error('[commande] Session de paiement non créée', error);
    }
  }

  // Aucune session de paiement n'a été ouverte : la commande part en
  // facturation, qu'il s'agisse d'un montant à confirmer, d'un paiement
  // désactivé ou d'un échec de création de session.
  await majCommande(reference, { paiement: 'facturee' }).catch(() => null);

  // La surveillance du seuil de TVA vient APRÈS l'établissement du statut
  // de paiement : sinon la commande qui vient d'être passée ne serait pas
  // comptée et l'alerte partirait avec un tour de retard. Dans le cas d'un
  // paiement par carte, c'est le webhook qui déclenche la vérification, au
  // moment où le paiement est réellement confirmé.
  try {
    await verifierSeuilTva();
  } catch (error) {
    console.error('[tva] Vérification du seuil impossible', error);
  }

  return NextResponse.json({ ok: true, reference, courriels: courrielsEnvoyes });
}
