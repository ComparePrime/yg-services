import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { reassurance } from '@/config/services';

/** Éléments de réassurance, communs aux deux activités. */
export function Reassurance({ tone = 'sand' }: { tone?: 'sand' | 'white' }) {
  return (
    <Section tone={tone}>
      <SectionHeading
        eyebrow="Travailler avec YG Services"
        title="Ce sur quoi vous pouvez compter"
        lead="Un cadre clair, annoncé à l’avance, du premier message à la livraison."
      />
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reassurance.map((item, index) => (
          <Reveal as="li" key={item.title} delay={index * 60}>
            <div className="h-full rounded-2xl bg-white p-6 ring-1 ring-ink-200/80">
              <h3 className="font-display text-lg text-ink-900">{item.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-600">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
