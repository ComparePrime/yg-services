import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container size="narrow">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
          Erreur 404
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
          Cette page n’existe pas
        </h1>
        <p className="mt-5 text-lg text-ink-600">
          La page que vous cherchez a peut-être été déplacée, ou l’adresse comporte une erreur.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Revenir à l’accueil
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Me contacter
          </Button>
        </div>
      </Container>
    </section>
  );
}
