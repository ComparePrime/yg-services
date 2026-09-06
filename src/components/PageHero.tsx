import Link from 'next/link';
import { Container } from '@/components/ui/Container';

/** En-tête de page interne, avec fil d'Ariane visible. */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumb: { name: string; path: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-ink-100 bg-sand pb-14 pt-10 sm:pb-20 sm:pt-14">
      <Container>
        <nav aria-label="Fil d’Ariane">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
            {breadcrumb.map((item, index) => (
              <li key={item.path} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {index === breadcrumb.length - 1 ? (
                  <span className="text-ink-700" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="transition hover:text-ink-900">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8 max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-4xl leading-[1.12] text-ink-900 sm:text-5xl">{title}</h1>
          {lead ? <p className="mt-5 text-lg leading-relaxed text-ink-600">{lead}</p> : null}
          {children}
        </div>
      </Container>
    </section>
  );
}
