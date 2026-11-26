import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

/**
 * CTA de fin de page. Le titre et le texte sont personnalisables
 * pour rester cohérents avec la page qui les précède.
 */
export function FinalCta({
  title = 'Vous avez une idée, un problème ou simplement une question ?',
  text = "Décrivez simplement ce dont vous avez besoin. Vous recevrez une réponse claire, précisant ce qui peut être fait et la suite à donner.",
  ctaLabel = 'Me contacter',
  ctaHref = '/contact',
  secondary,
}: {
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="bg-ink-950 py-20 text-white sm:py-28">
      <Container size="narrow">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-300">{text}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={ctaHref} variant="light" size="lg">
              {ctaLabel}
            </Button>
            {secondary ? (
              <Button
                href={secondary.href}
                size="lg"
                className="bg-transparent text-white ring-1 ring-ink-700 hover:bg-ink-900"
              >
                {secondary.label}
              </Button>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
