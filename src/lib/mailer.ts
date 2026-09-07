import nodemailer, { type Transporter } from 'nodemailer';
import { siteConfig } from '@/config/site';
import { subjectLabel, type ContactPayload } from './contact';

/**
 * Acheminement des demandes du formulaire.
 *
 * Deux modes, choisis automatiquement selon les variables d'environnement :
 *   1. SMTP (Infomaniak ou tout autre fournisseur) si SMTP_HOST est défini ;
 *   2. journalisation serveur sinon, pour que le site reste fonctionnel
 *      en développement et qu'aucune demande ne provoque d'erreur visible.
 *
 * Le mode retenu est renvoyé pour être tracé côté serveur.
 */

export type DeliveryMode = 'smtp' | 'log';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildLines(payload: ContactPayload) {
  return [
    `Sujet : ${subjectLabel(payload.subject)}`,
    `Nom : ${payload.firstName} ${payload.lastName}`,
    `E-mail : ${payload.email}`,
    `Téléphone : ${payload.phone || 'non communiqué'}`,
    '',
    payload.message,
  ];
}

let transporter: Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const port = Number(process.env.SMTP_PORT ?? 465);

  transporter = nodemailer.createTransport({
    host,
    port,
    // Le port 465 est chiffré dès la connexion ; le 587 passe en TLS ensuite.
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER ?? '',
      pass: process.env.SMTP_PASSWORD ?? '',
    },
  });

  return transporter;
}

export async function deliverContactRequest(payload: ContactPayload): Promise<DeliveryMode> {
  const lines = buildLines(payload);
  const inbox = process.env.CONTACT_INBOX || siteConfig.contact.email;
  const mailer = getTransporter();

  if (!mailer || !inbox) {
    console.info(
      '[contact] Nouvelle demande reçue :\n' +
        lines.join('\n') +
        (payload.attachment ? `\n[pièce jointe : ${payload.attachment.filename}]` : ''),
    );
    return 'log';
  }

  await mailer.sendMail({
    // L'expéditeur doit être une adresse du domaine authentifié, sinon le
    // message est rejeté. L'adresse du visiteur est mise en réponse.
    from: `"${siteConfig.brand}" <${process.env.SMTP_FROM || process.env.SMTP_USER || inbox}>`,
    to: inbox,
    replyTo: `"${payload.firstName} ${payload.lastName}" <${payload.email}>`,
    subject: `Nouvelle demande — ${subjectLabel(payload.subject)}`,
    text: lines.join('\n'),
    html: lines.map((line) => `<p>${escapeHtml(line) || '&nbsp;'}</p>`).join(''),
    ...(payload.attachment?.content
      ? {
          attachments: [
            {
              filename: payload.attachment.filename,
              content: Buffer.from(payload.attachment.content, 'base64'),
            },
          ],
        }
      : {}),
  });

  return 'smtp';
}
