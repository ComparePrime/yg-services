import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowRight } from '@/components/ui/Check';
import { universes } from '@/config/intents';

/**
 * Les trois univers de YG Services.
 * Volontairement sobre : pas de carte lourde, juste un filet et de l'espace.
 */
export function Universes() {
  return (
    <Section tone="white">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
          Trois façons de vous aider
        </h2>
        <p className="mt-4 text-lg text-ink-600">
          Des domaines différents, une même logique : rendre lisible ce qui paraît compliqué.
        </p>
      </div>

      <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-3">
        {universes.map((universe, index) => (
          <Reveal key={universe.id} delay={index * 80}>
            <div className="flex h-full flex-col border-t-2 border-ink-900 pt-6">
              <h3 className="font-display text-2xl text-ink-900">{universe.nom}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{universe.resume}</p>

              <ul className="mt-6 flex-1 space-y-2.5 text-[15px] text-ink-700">
                {universe.prestations.map((prestation) => (
                  <li key={prestation} className="flex items-baseline gap-2.5">
                    <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                    {prestation}
                  </li>
                ))}
              </ul>

              <Link
                href={universe.href}
                className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink-900 transition hover:text-accent-700"
              >
                {universe.cta}
                <ArrowRight className="transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
