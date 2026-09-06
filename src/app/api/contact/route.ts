import { NextResponse } from 'next/server';
import { validateContact, subjectLabel, type ContactPayload } from '@/lib/contact';

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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function deliver(payload: ContactPayload) {
  const inbox = process.env.CONTACT_INBOX;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  const lines = [
    `Sujet : ${subjectLabel(payload.subject)}`,
    `Nom : ${payload.firstName} ${payload.lastName}`,
    `E-mail : ${payload.email}`,
    `Téléphone : ${payload.phone || 'non communiqué'}`,
    '',
    payload.message,
  ];

  // Sans clé d'envoi configurée, la demande est journalisée côté serveur.
  // Le visiteur reçoit malgré tout une confirmation, et rien n'est perdu.
  if (!apiKey || !inbox || !from) {
    console.info(
      '[contact] Nouvelle demande reçue :\n' +
        lines.join('\n') +
        (payload.attachment ? `\n[pièce jointe : ${payload.attachment.filename}]` : ''),
    );
    return { delivered: false };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [inbox],
      reply_to: payload.email,
      subject: `Nouvelle demande — ${subjectLabel(payload.subject)}`,
      html: lines.map((line) => `<p>${escapeHtml(line)}</p>`).join(''),
      text: lines.join('\n'),
      ...(payload.attachment?.content
        ? {
            attachments: [
              { filename: payload.attachment.filename, content: payload.attachment.content },
            ],
          }
        : {}),
    }),
  });

  if (!response.ok) {
    console.error('[contact] Échec de l’envoi', response.status, await response.text());
    throw new Error('delivery-failed');
  }

  return { delivered: true };
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
    await deliver(body as ContactPayload);
  } catch {
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
