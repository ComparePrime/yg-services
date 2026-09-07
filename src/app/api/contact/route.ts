import { NextResponse } from 'next/server';
import { validateContact, type ContactPayload } from '@/lib/contact';
import { deliverContactRequest } from '@/lib/mailer';

export const runtime = 'nodejs';

/** Limitation simple par adresse IP, en mémoire (suffisant pour un site vitrine). */
const RATE_LIMIT_MAX = 5;
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

  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Requête invalide.' }, { status: 400 });
  }

  // Champ piège : rempli uniquement par les robots.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    await deliverContactRequest(body as ContactPayload);
  } catch (error) {
    console.error('[contact] Échec de l’acheminement', error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Votre message n'a pas pu être envoyé. Merci de réessayer, ou de m'écrire directement par e-mail.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
