import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

/**
 * Logo de marque.
 *
 * Le logo d'origine est un verrouillage vertical : illisible dans un en-tête
 * compact. Deux déclinaisons sont donc utilisées, construites à partir du même
 * fichier source :
 *   - `horizontal` : monogramme et mot-symbole côte à côte, pour l'en-tête ;
 *   - `complet`    : verrouillage d'origine avec la signature, pour le pied de page.
 *
 * `tone="light"` sert les versions blanches, destinées aux fonds sombres.
 */

const sources = {
  horizontal: {
    dark: '/images/logo-yg-horizontal.png',
    light: '/images/logo-yg-horizontal-clair.png',
    width: 900,
    height: 191,
  },
  complet: {
    dark: '/images/logo-yg-complet.png',
    light: '/images/logo-yg-complet-clair.png',
    width: 1200,
    height: 943,
  },
} as const;

export function Logo({
  tone = 'dark',
  variant = 'horizontal',
  className = '',
  priority = false,
}: {
  tone?: 'dark' | 'light';
  variant?: keyof typeof sources;
  className?: string;
  priority?: boolean;
}) {
  const source = sources[variant];

  return (
    <Image
      src={tone === 'light' ? source.light : source.dark}
      alt={`${siteConfig.brand} — ${siteConfig.signature}`}
      width={source.width}
      height={source.height}
      priority={priority}
      className={className}
    />
  );
}

/** Logo cliquable renvoyant à l'accueil. Utilisé dans l'en-tête. */
export function LogoLink({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center transition hover:opacity-80"
      aria-label={`${siteConfig.brand} — retour à l'accueil`}
    >
      <Logo variant="horizontal" priority className={className} />
    </Link>
  );
}
