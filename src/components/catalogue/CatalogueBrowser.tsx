'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight } from '@/components/ui/Check';
import {
  categories,
  formatPrix,
  type Prestation,
} from '@/config/catalogue';

/**
 * Parcours du catalogue : recherche libre et filtre par catégorie.
 *
 * Les prestations sont rendues côté serveur dans le HTML initial, puis
 * filtrées ici. Sans JavaScript, la liste complète reste lisible et chaque
 * fiche accessible par son lien.
 */
export function CatalogueBrowser({ prestations }: { prestations: Prestation[] }) {
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('toutes');

  const normalise = (valeur: string) =>
    valeur.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const resultats = useMemo(() => {
    const terme = normalise(recherche.trim());
    return prestations.filter((prestation) => {
      if (categorie !== 'toutes' && prestation.categorie !== categorie) return false;
      if (!terme) return true;
      const champs = normalise(
        [prestation.titre, prestation.accroche, prestation.pourQui, ...prestation.inclus].join(' '),
      );
      return terme.split(/\s+/).every((mot) => champs.includes(mot));
    });
  }, [prestations, recherche, categorie]);

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="recherche-prestation" className="sr-only">
            Rechercher une prestation
          </label>
          <div className="flex items-center gap-3 rounded-full bg-white px-5 py-1.5 ring-1 ring-ink-200 transition focus-within:ring-2 focus-within:ring-accent-500">
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-ink-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            >
              <circle cx="9" cy="9" r="5.5" />
              <path d="m13.5 13.5 3 3" />
            </svg>
            <input
              id="recherche-prestation"
              type="search"
              value={recherche}
              onChange={(event) => setRecherche(event.target.value)}
              placeholder="Rechercher une prestation…"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategorie('toutes')}
            aria-pressed={categorie === 'toutes'}
            className={`rounded-full px-4 py-2 text-sm transition ${
              categorie === 'toutes'
                ? 'bg-ink-900 text-white'
                : 'bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-400'
            }`}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setCategorie(cat.slug)}
              aria-pressed={categorie === cat.slug}
              className={`rounded-full px-4 py-2 text-sm transition ${
                categorie === cat.slug
                  ? 'bg-ink-900 text-white'
                  : 'bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-400'
              }`}
            >
              {cat.nomCourt}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-500" role="status">
        {resultats.length} prestation{resultats.length > 1 ? 's' : ''}
      </p>

      {resultats.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center ring-1 ring-ink-200">
          <p className="text-ink-700">Aucune prestation ne correspond à cette recherche.</p>
          <p className="mt-2 text-[15px] text-ink-600">
            Votre besoin n’est peut-être pas listé. Décrivez-le, vous recevrez une réponse indiquant
            ce qui est possible.
          </p>
          <Link
            href="/contact?sujet=administratif"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800"
          >
            Décrire mon besoin
            <ArrowRight />
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resultats.map((prestation) => (
            <li key={prestation.slug}>
              <PrestationCard prestation={prestation} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PrestationCard({ prestation }: { prestation: Prestation }) {
  const categorie = categories.find((c) => c.slug === prestation.categorie);

  return (
    <article className="group relative flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {categorie ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
          {categorie.nomCourt}
        </p>
      ) : null}

      <h3 className="mt-2.5 font-display text-lg leading-snug text-ink-900">
        <Link
          href={`/assistance-administrative/${prestation.categorie}/${prestation.slug}`}
          className="after:absolute after:inset-0"
        >
          {prestation.titre}
        </Link>
      </h3>

      <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink-600">
        {prestation.accroche}
      </p>

      <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-ink-100 pt-4">
        <span className="font-display text-xl text-ink-900">
          {formatPrix(prestation.prix, prestation.aPartirDe, prestation.recurrence)}
        </span>
        <span className="text-right text-xs text-ink-500">{prestation.delai}</span>
      </div>

      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink-900 transition group-hover:text-accent-700">
        Voir la prestation
        <ArrowRight className="transition group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}
