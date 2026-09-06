import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';

export function Hero() {
  return (
    <section className="border-b border-ink-100 bg-sand">
      <Container>
        <div className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-ink-600 ring-1 ring-ink-200">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
              {siteConfig.location.short}
            </p>

            {/* H1 : formulation utile au référencement, signature de marque juste en dessous. */}
            <h1 className="mt-6 font-display text-4xl leading-[1.1] text-ink-900 sm:text-5xl lg:text-[3.4rem]">
              Création web, administration &amp; optimisation en Suisse romande
            </h1>

            <p className="mt-5 font-display text-xl text-accent-700 sm:text-2xl">
              {siteConfig.signature}
            </p>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
              Je développe des sites web de A à Z et j’accompagne les particuliers dans certaines
              démarches administratives et l’optimisation de leurs assurances et dépenses.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="#deux-facons" size="lg">
                Découvrir mes services
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Parlons de votre projet
              </Button>
            </div>

            <p className="mt-8 text-sm text-ink-500">
              Un seul interlocuteur, du premier message à la mise en ligne.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm pb-12 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-100 ring-1 ring-ink-200">
              <Image
                src={siteConfig.person.photo}
                alt={siteConfig.person.photoAlt}
                fill
                priority
                sizes="(max-width: 1024px) 384px, 480px"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-xl bg-white px-5 py-4 text-center shadow-lg ring-1 ring-ink-200">
              <p className="font-display text-lg text-ink-900">{siteConfig.person.fullName}</p>
              <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-ink-500">
                {siteConfig.brand}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
