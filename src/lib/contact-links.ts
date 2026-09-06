import { siteConfig } from '@/config/site';

/**
 * Moyens de contact réellement renseignés.
 * Un moyen vide dans la configuration n'apparaît nulle part sur le site.
 */

export type ContactLink = {
  id: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

export function contactLinks(): ContactLink[] {
  const { contact } = siteConfig;
  const links: ContactLink[] = [];

  if (contact.email) {
    links.push({
      id: 'email',
      label: 'E-mail',
      value: contact.email,
      href: `mailto:${contact.email}`,
    });
  }

  if (contact.whatsapp.international) {
    links.push({
      id: 'whatsapp',
      label: 'WhatsApp',
      value: contact.whatsapp.display,
      href: `https://wa.me/${contact.whatsapp.international}`,
      external: true,
    });
  }

  if (contact.phone) {
    links.push({
      id: 'phone',
      label: 'Téléphone',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`,
    });
  }

  return links;
}

export function socialLinks(): ContactLink[] {
  const { social } = siteConfig;
  const links: ContactLink[] = [];

  if (social.instagram) {
    links.push({
      id: 'instagram',
      label: 'Instagram',
      value: social.instagramHandle,
      href: social.instagram,
      external: true,
    });
  }

  if (social.facebook) {
    links.push({
      id: 'facebook',
      label: 'Facebook',
      value: 'YG Services',
      href: social.facebook,
      external: true,
    });
  }

  if (social.linkedin) {
    links.push({
      id: 'linkedin',
      label: 'LinkedIn',
      value: siteConfig.person.fullName,
      href: social.linkedin,
      external: true,
    });
  }

  return links;
}

/** Profils publics, pour les données structurées `sameAs`. */
export function socialProfileUrls(): string[] {
  return socialLinks().map((link) => link.href);
}
