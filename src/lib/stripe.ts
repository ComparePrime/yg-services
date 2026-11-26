import Stripe from 'stripe';
import type { Prestation } from '@/config/catalogue';
import type { Total } from '@/lib/order';

/**
 * Paiement par carte, via Stripe Checkout.
 *
 * CHOIX DE CONCEPTION
 * - Checkout hébergé : la saisie de carte se fait sur les pages de Stripe.
 *   Aucune donnée de carte ne touche ce site, ni en transit ni au repos.
 * - Le montant envoyé à Stripe est recalculé côté serveur à partir du
 *   catalogue. Le navigateur n'envoie que des identifiants d'options.
 * - Un retour de navigateur ne vaut pas preuve de paiement. Le paiement
 *   n'est tenu pour acquis qu'après vérification côté serveur :
 *   `verifierPaiement` interroge l'API Stripe, et le webhook contrôle la
 *   signature de l'événement.
 *
 * ACTIVATION : le paiement reste désactivé tant que STRIPE_SECRET_KEY est
 * absente. Dans ce cas, les commandes passent par facture et le site
 * l'indique explicitement au client. Aucune clé n'est inscrite dans le
 * dépôt : elles se renseignent dans les variables d'environnement Netlify.
 *   STRIPE_SECRET_KEY       clé secrète (sk_...)
 *   STRIPE_WEBHOOK_SECRET   secret de signature du webhook (whsec_...)
 */

let client: Stripe | null = null;

function getStripe(): Stripe | null {
  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) return null;
  if (!client) client = new Stripe(cle);
  return client;
}

/** Vrai lorsque le paiement par carte peut être proposé. */
export function paiementActif(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Vrai lorsque la vérification des webhooks est réellement possible.
 *
 * Les DEUX variables sont nécessaires : la vérification de signature passe
 * par le client Stripe, qui a besoin de la clé secrète. Ne tester que
 * STRIPE_WEBHOOK_SECRET ferait répondre « signature invalide » à un
 * webhook pourtant correctement signé, ce qui envoie chercher le problème
 * au mauvais endroit.
 */
export function webhookConfigure(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_SECRET_KEY);
}

/** Convertit un montant en francs vers l'unité attendue par Stripe. */
const enCentimes = (montant: number) => Math.round(montant * 100);

export type DemandePaiement = {
  prestation: Prestation;
  total: Total;
  reference: string;
  email?: string;
  origin: string;
};

/**
 * Crée une session de paiement et renvoie son identifiant et l'adresse de
 * redirection. Renvoie `null` si Stripe n'est pas configuré.
 */
export async function creerSessionPaiement({
  prestation,
  total,
  reference,
  email,
  origin,
}: DemandePaiement): Promise<{ id: string; url: string } | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    locale: 'fr',
    client_reference_id: reference,
    ...(email ? { customer_email: email } : {}),
    line_items: total.lignes.map((ligne) => ({
      quantity: 1,
      price_data: {
        currency: 'chf',
        unit_amount: enCentimes(ligne.montant),
        product_data: { name: ligne.label },
      },
    })),
    payment_intent_data: {
      description: `${reference} — ${prestation.titre}`,
      metadata: { reference, prestation: prestation.slug },
    },
    metadata: { reference, prestation: prestation.slug },
    success_url: `${origin}/commande/confirmation?ref=${encodeURIComponent(
      reference,
    )}&session={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/assistance-administrative/${prestation.categorie}/${prestation.slug}?paiement=annule`,
  });

  return session.url ? { id: session.id, url: session.url } : null;
}

export type EtatPaiement = {
  paye: boolean;
  reference: string | null;
  montant: number | null;
};

/**
 * Vérifie l'état réel d'un paiement auprès de Stripe.
 * C'est la seule source admise : l'URL de retour ne prouve rien.
 */
export async function verifierPaiement(sessionId: string): Promise<EtatPaiement> {
  const stripe = getStripe();
  if (!stripe) return { paye: false, reference: null, montant: null };

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return {
    paye: session.payment_status === 'paid',
    reference: session.client_reference_id ?? null,
    montant: session.amount_total === null ? null : session.amount_total / 100,
  };
}

/**
 * Contrôle la signature d'un webhook et renvoie l'événement.
 * Lève une erreur si la signature est absente ou invalide : un corps de
 * requête non signé n'est jamais traité.
 */
export function lireEvenementWebhook(corps: string, signature: string | null): Stripe.Event {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe) throw new Error('Stripe n’est pas configuré');
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET est absent');
  if (!signature) throw new Error('Signature absente');

  return stripe.webhooks.constructEvent(corps, signature, secret);
}
