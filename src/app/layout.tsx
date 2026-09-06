import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { absoluteUrl } from '@/lib/seo';
import { personSchema, professionalServiceSchema, websiteSchema } from '@/lib/structured-data';

/*
 * Les deux polices sont chargées en `display: optional`.
 * Elles sont préchargées et servies depuis le même domaine : sur une connexion
 * normale elles s'affichent dès le premier rendu. Sur une connexion lente, la
 * police de repli (ajustée automatiquement aux mêmes métriques) est conservée
 * pour toute la page, ce qui supprime le décalage visuel au chargement (CLS).
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'optional',
  weight: 'variable',
  axes: ['SOFT', 'WONK'],
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Création web, administration & optimisation en Suisse romande | YG Services',
    template: `%s | ${siteConfig.brand}`,
  },
  description:
    "Je crée des sites web de A à Z et j'accompagne les particuliers dans leurs démarches administratives et l'optimisation de leurs assurances et dépenses. Yverdon-les-Bains, Vaud, Suisse romande.",
  applicationName: siteConfig.brand,
  authors: [{ name: siteConfig.person.fullName, url: absoluteUrl('/a-propos') }],
  creator: siteConfig.person.fullName,
  publisher: siteConfig.brand,
  alternates: { canonical: absoluteUrl('/') },
  manifest: '/site.webmanifest',
  formatDetection: { telephone: false, address: false, email: false },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: '#1c2026',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CH" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col bg-white antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:text-white"
        >
          Aller au contenu principal
        </a>
        <Header />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={[websiteSchema(), personSchema(), professionalServiceSchema()]} />
      </body>
    </html>
  );
}
