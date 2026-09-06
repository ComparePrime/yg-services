'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { LogoLink } from './Logo';
import { mainNav, primaryCta } from '@/config/navigation';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Referme le menu mobile à chaque changement de page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloque le défilement de la page quand le menu mobile est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? 'border-ink-200/70 bg-white/90 backdrop-blur-md'
          : 'border-transparent bg-white/70 backdrop-blur-sm'
      }`}
    >
      <Container>
        <div className="flex h-[var(--header-height)] items-center justify-between gap-4">
          <LogoLink className="h-8 w-auto sm:h-9" />

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`rounded-full px-3.5 py-2 text-sm transition ${
                      isActive(link.href)
                        ? 'font-medium text-ink-900'
                        : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <Button href={primaryCta.href}>{primaryCta.label}</Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-ink-800 ring-1 ring-ink-200 transition hover:ring-ink-400 lg:hidden"
          >
            <span className="sr-only sm:not-sr-only">{open ? 'Fermer' : 'Menu'}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="m5 5 10 10M15 5 5 15" /> : <path d="M3.5 6.5h13M3.5 13.5h13" />}
            </svg>
          </button>
        </div>
      </Container>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-ink-200/70 bg-white lg:hidden"
      >
        <Container>
          <nav aria-label="Navigation mobile" className="py-4">
            <ul className="flex flex-col">
              {mainNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`block border-b border-ink-100 py-3.5 text-base ${
                      isActive(link.href) ? 'font-medium text-ink-900' : 'text-ink-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button href={primaryCta.href} size="lg" className="mt-5 w-full">
              {primaryCta.label}
            </Button>
          </nav>
        </Container>
      </div>
    </header>
  );
}
