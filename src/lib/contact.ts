/** Sujets proposés dans le formulaire. La clé sert aussi de paramètre d'URL (?sujet=). */
export const subjects = [
  { value: 'creer-site', label: 'Créer un site web' },
  { value: 'refaire-site', label: 'Refaire mon site' },
  { value: 'seo', label: 'Référencement (SEO)' },
  { value: 'assurance', label: 'Assurances' },
  { value: 'logement', label: 'Logement / loyer' },
  { value: 'administratif', label: 'Démarche administrative' },
  { value: 'courrier', label: 'Rédaction d’un courrier' },
  { value: 'impots', label: 'Impôts & organisation' },
  { value: 'autre', label: 'Autre / je ne sais pas' },
] as const;

export type SubjectValue = (typeof subjects)[number]['value'];

export const subjectLabel = (value: string) =>
  subjects.find((s) => s.value === value)?.label ?? 'Non précisé';

export type ContactPayload = {
  subject: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  /** Pièce jointe facultative, encodée en base64. */
  attachment?: { filename: string; content: string } | null;
  /** Champ piège anti-robot : doit rester vide. */
  company?: string;
};

/** Taille maximale d'une pièce jointe, en octets. */
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_ATTACHMENTS = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.odt,.txt';

export type ValidationErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validation partagée entre le client et le serveur. */
export function validateContact(data: Partial<ContactPayload>): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.firstName?.trim()) errors.firstName = 'Merci d’indiquer votre prénom.';
  if (!data.lastName?.trim()) errors.lastName = 'Merci d’indiquer votre nom.';

  if (!data.email?.trim()) errors.email = 'Merci d’indiquer votre adresse e-mail.';
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = 'Cette adresse e-mail semble incorrecte.';

  if (!data.message?.trim()) errors.message = 'Décrivez votre situation en quelques lignes.';
  else if (data.message.trim().length < 15)
    errors.message = 'Quelques mots de plus m’aideraient à vous répondre utilement.';

  if (!data.consent) errors.consent = 'Votre accord est nécessaire pour traiter la demande.';

  if (data.attachment?.content) {
    // Le base64 pèse environ 4/3 de la taille réelle du fichier.
    const approximateBytes = (data.attachment.content.length * 3) / 4;
    if (approximateBytes > MAX_ATTACHMENT_BYTES) {
      errors.attachment = 'La pièce jointe dépasse 5 Mo.';
    }
  }

  return errors;
}
