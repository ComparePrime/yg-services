import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { footerNav } from '@/config/navigation';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-800 bg-ink-950 text-ink-300">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl text-white">{siteConfig.brand}</p>
            <p className="mt-1 text-sm text-ink-400">{siteConfig.person.fullName}</p>
            <p className="mt-4 text-sm">{siteConfig.positioning}</p>
            <p className="mt-4 text-sm text-ink-400">
              {siteConfig.location.city} — {siteConfig.location.region} — {siteConfig.location.country}
            </p>
            <p className="mt-1 text-sm text-ink-400">Disponible en Suisse romande et en Suisse.</p>

            <div className="mt-6 flex flex-col gap-2 text-sm">
              {siteConfig.contact.email ? (
                <a href={`mailto:${siteConfig.contact.email}`} className="transition hover:text-white">
                  {siteConfig.contact.email}
                </a>
              ) : null}
              {siteConfig.contact.phone ? (
                <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`} className="transition hover:text-white">
                  {siteConfig.contact.phone}
                </a>
              ) : null}
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Instagram {siteConfig.social.instagramHandle}
              </a>
              {siteConfig.social.linkedin ? (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  LinkedIn
                </a>
              ) : null}
            </div>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
                {group.title}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-ink-800 py-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.brand} — {siteConfig.person.fullName}. Tous droits réservés.
          </p>
          <p>{siteConfig.signature}</p>
        </div>
      </Container>
    </footer>
  );
}
