import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@/components/ui/Check';
import type { Project } from '@/config/projects';

/**
 * Carte de réalisation.
 * Si la capture d'écran n'a pas encore été déposée dans /public,
 * un aperçu sobre s'affiche à la place : aucune image d'illustration générique.
 */
export function PortfolioCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-700">
          {project.category}
        </p>
        <h3 className="mt-2 font-display text-xl text-ink-900">{project.name}</h3>
        <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink-600">{project.summary}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.services.slice(0, 3).map((service) => (
            <li key={service} className="rounded-full bg-ink-50 px-2.5 py-1 text-xs text-ink-600">
              {service}
            </li>
          ))}
        </ul>

        <Link
          href={`/realisations#${project.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-900 transition hover:text-accent-700"
        >
          Voir le détail
          <ArrowRight className="transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
