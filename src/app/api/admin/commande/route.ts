import { NextResponse } from 'next/server';
import { majCommande, STATUTS_COMMANDE, STATUTS_PAIEMENT } from '@/lib/store';

export const runtime = 'nodejs';

/**
 * Mise à jour d'une commande depuis le tableau de bord.
 * L'accès est contrôlé en amont par le middleware ; cette route refait
 * néanmoins la validation des valeurs reçues.
 */
export async function POST(request: Request) {
  const formulaire = await request.formData();
  const reference = String(formulaire.get('reference') ?? '').trim();
  const statut = String(formulaire.get('statut') ?? '').trim();
  const paiement = String(formulaire.get('paiement') ?? '').trim();
  const notes = String(formulaire.get('notes') ?? '');

  if (!reference) {
    return NextResponse.json({ ok: false, error: 'Référence manquante.' }, { status: 400 });
  }

  const statutValide = STATUTS_COMMANDE.some((s) => s.value === statut);
  const paiementValide = STATUTS_PAIEMENT.some((s) => s.value === paiement);

  if (!statutValide || !paiementValide) {
    return NextResponse.json({ ok: false, error: 'Statut invalide.' }, { status: 422 });
  }

  const commande = await majCommande(reference, {
    statut: statut as never,
    paiement: paiement as never,
    notes: notes.slice(0, 4000),
  });

  if (!commande) {
    return NextResponse.json({ ok: false, error: 'Commande inconnue.' }, { status: 404 });
  }

  // Retour au tableau de bord, sur la commande modifiée.
  const origine = new URL(request.url).origin;
  return NextResponse.redirect(`${origine}/admin#${reference}`, { status: 303 });
}
