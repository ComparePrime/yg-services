import nodemailer, { type Transporter } from 'nodemailer';
import { siteConfig } from '@/config/site';
import { getPrestation } from '@/config/catalogue';
import { questionsPour } from '@/config/order-fields';
import { calculerTotal, modeCommande, recapitulatif, type OrderPayload } from '@/lib/order';
import { mentionTva } from '@/config/tva';
import { deplacement, getModalite, getZone } from '@/config/intervention';

/**
 * Acheminement des commandes.
 *
 * Deux destinataires :
 *   1. la boîte de réception de YG Services, avec le détail complet ;
 *   2. le client, avec la confirmation de sa commande et la suite à donner.
 *
 * Sans SMTP_HOST, les commandes sont journalisées côté serveur. Le site
 * reste utilisable en développement sans qu'une commande échoue.
 */

export type ResultatCommande = {
  mode: 'smtp' | 'log';
  reference: string;
};

function escapeHtml(valeur: string) {
  return valeur
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
    secure: port === 465,
    auth: { user: process.env.SMTP_USER ?? '', pass: process.env.SMTP_PASSWORD ?? '' },
  });

  return transporter;
}

/** Détail interne : toutes les réponses, libellé par libellé. */
function lignesInternes(payload: OrderPayload, reference: string): string[] {
  const prestation = getPrestation(payload.prestation);
  if (!prestation) return [];

  const total = calculerTotal(prestation, payload.options, payload.modalite, payload.zone);
  const modalite = payload.modalite ? getModalite(payload.modalite) : undefined;
  const zone = payload.zone ? getZone(payload.zone) : undefined;

  const lignes: string[] = [
    `Référence : ${reference}`,
    `Prestation : ${prestation.titre}`,
    `Mode : ${modeCommande(prestation) === 'ferme' ? 'prix ferme' : 'montant à confirmer après examen'}`,
    `Déroulement : ${modalite?.label ?? 'à distance'}`,
    ...(zone
      ? [
          `Zone : ${zone.nom}`,
          `Rendez-vous sous : ${zone.delaiRendezVous}`,
          `Frais de déplacement : ${
            deplacement.fraisActifs
              ? zone.fraisProposes === null
                ? 'à confirmer'
                : `CHF ${zone.fraisProposes}`
              : 'non facturés (à confirmer avec le client)'
          }`,
        ]
      : []),
    '',
    'Montant',
    ...recapitulatif(prestation, total),
    '',
  ];

  for (const groupe of questionsPour(prestation)) {
    const renseignes = groupe.fields.filter((champ) => payload.reponses[champ.name]?.trim());
    if (renseignes.length === 0) continue;

    lignes.push(groupe.title);
    for (const champ of renseignes) {
      const brut = payload.reponses[champ.name].trim();
      const lisible =
        champ.choices?.find((choix) => choix.value === brut)?.label ?? brut;
      lignes.push(`  ${champ.label} : ${lisible}`);
    }
    lignes.push('');
  }

  lignes.push('Documents attendus');
  for (const document of prestation.documents) lignes.push(`  - ${document}`);

  return lignes;
}

/** Confirmation adressée au client. */
function lignesClient(payload: OrderPayload, reference: string): string[] {
  const prestation = getPrestation(payload.prestation);
  if (!prestation) return [];

  const total = calculerTotal(prestation, payload.options, payload.modalite, payload.zone);
  const ferme = modeCommande(prestation) === 'ferme';
  const modalite = payload.modalite ? getModalite(payload.modalite) : undefined;
  const zone = payload.zone ? getZone(payload.zone) : undefined;

  return [
    `Bonjour ${payload.reponses.prenom ?? ''},`.trim(),
    '',
    `Votre commande est enregistrée sous la référence ${reference}.`,
    '',
    `Prestation : ${prestation.titre}`,
    ...(modalite ? [`Déroulement : ${modalite.label}`] : []),
    ...recapitulatif(prestation, total),
    '',
    mentionTva(),
    '',
    ferme
      ? 'Le montant ci-dessus est ferme. La facture vous parvient avant le début du traitement.'
      : 'Le montant ci-dessus est un ordre de grandeur. Le montant ferme vous est communiqué après examen de votre dossier, et avant tout engagement de votre part.',
    '',
    ...(zone
      ? [
          `Rendez-vous : dans la zone « ${zone.nom} », sous ${zone.delaiRendezVous}. ${deplacement.disponibilites}`,
          deplacement.fraisActifs
            ? ''
            : 'Aucun frais de déplacement n’est inclus dans ce montant. S’il y en a, ils vous sont annoncés par écrit et vous les validez avant tout engagement.',
          '',
        ].filter(Boolean)
      : []),
    'La suite :',
    '  1. Vous recevez un message confirmant le montant et la liste exacte des pièces à transmettre.',
    ...(zone ? ['  2. Le rendez-vous est fixé ensemble, par écrit.'] : []),
    `  ${zone ? '3' : '2'}. Vous transmettez vos documents par le moyen indiqué dans ce message.`,
    `  ${zone ? '4' : '3'}. Le délai court dès que le dossier est complet.`,
    '',
    'Documents à prévoir :',
    ...prestation.documents.map((document) => `  - ${document}`),
    '',
    `Délai indicatif : ${prestation.delai}, dès réception d’un dossier complet.`,
    '',
    'Aucun document ne doit être transmis par ce site : les pièces vous sont demandées séparément.',
    '',
    `Conditions de prestation : ${siteConfig.url}/conditions-prestations`,
    '',
    siteConfig.brand,
  ];
}

function enHtml(lignes: string[]) {
  return lignes.map((ligne) => `<p>${escapeHtml(ligne) || '&nbsp;'}</p>`).join('');
}

export async function deliverOrder(
  payload: OrderPayload,
  reference: string,
): Promise<ResultatCommande> {
  const prestation = getPrestation(payload.prestation);
  if (!prestation) throw new Error('Prestation inconnue');

  const inbox = process.env.CONTACT_INBOX || siteConfig.contact.email;
  const mailer = getTransporter();
  const interne = lignesInternes(payload, reference);

  if (!mailer || !inbox) {
    console.info('[commande] Nouvelle commande :\n' + interne.join('\n'));
    return { mode: 'log', reference };
  }

  const expediteur = `"${siteConfig.brand}" <${
    process.env.SMTP_FROM || process.env.SMTP_USER || inbox
  }>`;
  const client = payload.reponses.email?.trim();
  const nomClient = `${payload.reponses.prenom ?? ''} ${payload.reponses.nom ?? ''}`.trim();

  // La commande interne part en premier : elle ne doit pas être perdue
  // si l'accusé de réception au client échoue.
  await mailer.sendMail({
    from: expediteur,
    to: inbox,
    ...(client ? { replyTo: `"${nomClient}" <${client}>` } : {}),
    subject: `Commande ${reference} — ${prestation.titre}`,
    text: interne.join('\n'),
    html: enHtml(interne),
  });

  if (client) {
    const accuse = lignesClient(payload, reference);
    try {
      await mailer.sendMail({
        from: expediteur,
        to: client,
        replyTo: inbox,
        subject: `Votre commande ${reference} — ${prestation.titre}`,
        text: accuse.join('\n'),
        html: enHtml(accuse),
      });
    } catch (error) {
      // La commande est enregistrée : un accusé non délivré ne doit pas
      // faire échouer la commande du client.
      console.error('[commande] Accusé de réception non délivré', error);
    }
  }

  return { mode: 'smtp', reference };
}

/* ------------------------------------------------------------------
   Notification de paiement, déclenchée par le webhook Stripe
------------------------------------------------------------------- */

export type PaiementConfirme = {
  reference: string;
  prestation: string;
  montant: number | null;
  email: string | null;
};

/**
 * Signale un paiement vérifié. Appelé uniquement depuis le webhook, après
 * contrôle de la signature de l'événement.
 */
export async function notifierPaiement(paiement: PaiementConfirme): Promise<void> {
  const titre = getPrestation(paiement.prestation)?.titre ?? paiement.prestation;
  const lignes = [
    `Paiement confirmé par Stripe.`,
    '',
    `Référence : ${paiement.reference}`,
    `Prestation : ${titre}`,
    `Montant : ${paiement.montant === null ? 'non communiqué' : `CHF ${paiement.montant}`}`,
    `Client : ${paiement.email ?? 'non communiqué'}`,
  ];

  const inbox = process.env.CONTACT_INBOX || siteConfig.contact.email;
  const mailer = getTransporter();

  if (!mailer || !inbox) {
    console.info('[stripe] ' + lignes.join('\n'));
    return;
  }

  await mailer.sendMail({
    from: `"${siteConfig.brand}" <${process.env.SMTP_FROM || process.env.SMTP_USER || inbox}>`,
    to: inbox,
    subject: `Paiement reçu — ${paiement.reference}`,
    text: lignes.join('\n'),
    html: enHtml(lignes),
  });
}

/* ------------------------------------------------------------------
   Alerte de seuil de TVA
------------------------------------------------------------------- */

/**
 * Prévient que le chiffre d'affaires cumulé a franchi un seuil de
 * surveillance. Envoyé une seule fois par seuil et par année civile.
 */
export async function notifierSeuilTva({
  seuil,
  chiffres,
}: {
  seuil: number;
  chiffres: { annee: number; encaisse: number; engage: number; nombreCommandes: number };
}): Promise<void> {
  const chf = (montant: number) => `CHF ${montant.toLocaleString('fr-CH')}`;
  const atteint = seuil >= 100_000;

  const lignes = [
    `Seuil de surveillance franchi : ${chf(seuil)}.`,
    '',
    `Année : ${chiffres.annee}`,
    `Chiffre d’affaires encaissé ou facturé : ${chf(chiffres.encaisse)}`,
    `Dont commandes encore en attente de paiement : ${chf(chiffres.engage - chiffres.encaisse)}`,
    `Nombre de commandes retenues : ${chiffres.nombreCommandes}`,
    '',
    atteint
      ? 'Le seuil d’assujettissement obligatoire à la TVA (CHF 100 000) est atteint. L’assujettissement remonte au début de l’exercice concerné : il y a une démarche à engager auprès de l’AFC sans attendre.'
      : `Le seuil d’assujettissement obligatoire est de ${chf(100_000)}. Il reste ${chf(
          100_000 - chiffres.encaisse,
        )} de marge.`,
    '',
    'Ce cumul ne porte que sur les commandes passées par le site. Les revenus facturés en dehors doivent y être ajoutés pour juger du seuil réel.',
    '',
    'Aucun prix n’a été modifié et la TVA n’a pas été activée : la décision vous revient.',
  ];

  const inbox = process.env.CONTACT_INBOX || siteConfig.contact.email;
  const mailer = getTransporter();

  if (!mailer || !inbox) {
    console.info('[tva] ' + lignes.join('\n'));
    return;
  }

  await mailer.sendMail({
    from: `"${siteConfig.brand}" <${process.env.SMTP_FROM || process.env.SMTP_USER || inbox}>`,
    to: inbox,
    subject: `Seuil de TVA — ${chf(seuil)} franchis (${chiffres.annee})`,
    text: lignes.join('\n'),
    html: enHtml(lignes),
  });
}
