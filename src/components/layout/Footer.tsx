import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { siteConfig } from '@/config/site';
import { contactLinks, socialLinks } from '@/lib/contact-links';
import { footerNav } from '@/config/navigation';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-800 bg-ink-950 text-ink-300">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            {/* Le logo complet porte déjà le positionnement et la signature :
                ils ne sont pas répétés en texte juste en dessous. */}
            <Logo variant="complet" tone="light" className="h-auto w-52" />
            <p className="mt-5 text-sm text-ink-400">{siteConfig.person.fullName}</p>
            <p className="mt-4 text-sm text-ink-400">
              {siteConfig.location.city} — {siteConfig.location.region} — {siteConfig.location.country}
            </p>
            <p className="mt-1 text-sm text-ink-400">Disponible en Suisse romande et en Suisse.</p>

            <div className="mt-6 flex flex-col gap-2 text-sm">
              {[...contactLinks(), ...socialLinks()].map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="transition hover:text-white"
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label} {link.value}
                </a>
              ))}
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
          <p>
            {siteConfig.location.city} — {siteConfig.location.region} — {siteConfig.location.country}
          </p>
        </div>
      </Container>
    </footer>
  );
}
