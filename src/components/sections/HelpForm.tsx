import { Suspense } from 'react';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/ContactForm';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Le formulaire « J'ai besoin d'aide ».
 * Volontairement minimal : aucune catégorie à choisir, aucun jargon.
 */
export function HelpForm({ id = 'besoin-aide' }: { id?: string }) {
  return (
    <section id={id} className="bg-sand py-16 sm:py-24">
      <Container size="narrow">
        <Reveal>
          <div className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
              J’ai besoin d’aide
            </p>
            <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
              Expliquez-moi simplement votre situation.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-600">
              Pas besoin de savoir quel service choisir. Expliquez-moi simplement ce qui vous pose
              problème et je vous dirai comment je peux vous aider.
            </p>
          </div>

          <div className="mt-10 rounded-2xl bg-white p-6 ring-1 ring-ink-200 sm:p-9">
            <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
              <ContactForm variant="simple" />
            </Suspense>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
