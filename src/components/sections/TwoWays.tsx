import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowRight } from '@/components/ui/Check';
import { twoWays } from '@/config/services';

export function TwoWays() {
  return (
    <Section id="deux-facons" tone="white">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
          Deux façons de vous aider
        </p>
        <h2 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
          Un projet web, ou une situation à démêler
        </h2>
        <p className="mt-4 text-lg text-ink-600">
          Deux activités différentes, une même logique : rendre simple ce qui paraît compliqué.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {twoWays.map((way, index) => (
          <Reveal key={way.title} delay={index * 90}>
            <Link
              href={way.href}
              className="group flex h-full flex-col rounded-2xl bg-white p-8 ring-1 ring-ink-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-ink-300 sm:p-10"
            >
              <span aria-hidden="true" className="text-3xl">
                {way.emoji}
              </span>
              <h3 className="mt-5 font-display text-2xl text-ink-900">{way.title}</h3>
              <p className="mt-3 flex-1 text-[17px] leading-relaxed text-ink-600">{way.text}</p>
              <span className="mt-7 inline-flex items-center gap-2 font-medium text-ink-900 transition group-hover:text-accent-700">
                {way.cta}
                <ArrowRight className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
