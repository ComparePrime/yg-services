import { Button } from '@/components/ui/Button';
import { Check } from '@/components/ui/Check';
import type { Plan } from '@/config/pricing';

export function PricingCard({ plan }: { plan: Plan }) {
  const featured = Boolean(plan.highlight);

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl p-7 sm:p-8 ${
        featured
          ? 'bg-ink-950 text-ink-200 ring-1 ring-ink-800 shadow-xl'
          : 'bg-white text-ink-700 ring-1 ring-ink-200'
      }`}
    >
      {plan.highlight ? (
        <span className="absolute -top-3 left-7 rounded-full bg-accent-500 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
          {plan.highlight}
        </span>
      ) : null}

      <h3 className={`font-display text-2xl ${featured ? 'text-white' : 'text-ink-900'}`}>
        {plan.name}
      </h3>
      <p className="mt-2.5 text-[15px] leading-relaxed">{plan.tagline}</p>

      <p className="mt-6 flex items-baseline gap-2">
        {plan.price === null ? (
          <span className={`font-display text-3xl ${featured ? 'text-white' : 'text-ink-900'}`}>
            Sur devis
          </span>
        ) : (
          <>
            <span className={`text-sm ${featured ? 'text-ink-400' : 'text-ink-500'}`}>
              {plan.priceNote}
            </span>
            <span className={`font-display text-3xl ${featured ? 'text-white' : 'text-ink-900'}`}>
              CHF {plan.price.toLocaleString('fr-CH')}
            </span>
          </>
        )}
      </p>

      <ul className="mt-7 flex-1 space-y-3 text-[15px]">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <Check className={featured ? 'text-accent-400' : 'text-accent-600'} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        href={plan.cta.href}
        variant={featured ? 'light' : 'secondary'}
        size="lg"
        className="mt-8 w-full"
      >
        {plan.cta.label}
      </Button>
    </div>
  );
}
