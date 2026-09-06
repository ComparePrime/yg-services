import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-baseline gap-2"
      aria-label={`${siteConfig.brand} — retour à l'accueil`}
    >
      <span
        className={`font-display text-xl font-semibold tracking-tight ${
          tone === 'light' ? 'text-white' : 'text-ink-900'
        }`}
      >
        YG
      </span>
      <span
        className={`text-sm font-semibold uppercase tracking-[0.22em] ${
          tone === 'light' ? 'text-ink-300' : 'text-ink-500'
        } transition group-hover:text-accent-600`}
      >
        Services
      </span>
    </Link>
  );
}
