'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { ArrowRight } from '@/components/ui/Check';
import { siteConfig } from '@/config/site';
import { suggestions } from '@/config/intents';
import { matchIntent, contactHref, type MatchResult } from '@/lib/match-intent';

/**
 * Entrée principale du site : le visiteur décrit son besoin avec ses mots,
 * et je l'oriente vers le bon univers.
 *
 * Amélioration progressive : sans JavaScript, le formulaire est un simple
 * GET vers /contact, qui reçoit la phrase saisie et la reporte dans le
 * message. Avec JavaScript, la réponse s'affiche directement ici.
 *
 * Le site n'analyse pas la situation du visiteur et ne le laisse pas croire :
 * la reconnaissance sert uniquement à l'orienter.
 */

type State = { kind: 'idle' } | { kind: 'match'; result: MatchResult; query: string } | { kind: 'none'; query: string };

export function NeedSearch() {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [state, setState] = useState<State>({ kind: 'idle' });
  const resultRef = useRef<HTMLDivElement>(null);

  const orient = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const result = matchIntent(trimmed);
    setState(result ? { kind: 'match', result, query: trimmed } : { kind: 'none', query: trimmed });
    // On amène le lecteur sur la réponse sans faire sauter la page.
    window.requestAnimationFrame(() => {
      resultRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <section className="border-b border-ink-100 bg-sand">
      <Container size="narrow">
        <div className="py-16 text-center sm:py-24 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">
            {siteConfig.brand}
          </p>
          <p className="mt-2.5 text-sm text-accent-700">Digital • Administration • Optimisation</p>

          <h1 className="mx-auto mt-7 max-w-2xl font-display text-[2rem] leading-[1.12] text-ink-900 sm:text-5xl">
            En quoi puis-je vous aider aujourd’hui&nbsp;?
          </h1>

          {/* Sans JavaScript, la saisie part directement vers le formulaire de contact. */}
          <form
            method="get"
            action="/contact"
            onSubmit={(event) => {
              event.preventDefault();
              orient(query);
            }}
            className="mx-auto mt-9 max-w-xl"
            role="search"
          >
            <label htmlFor={inputId} className="sr-only">
              Décrivez votre besoin en quelques mots
            </label>
            <input type="hidden" name="sujet" value="autre" />

            <div className="flex items-center gap-2 rounded-full bg-white py-2 pl-5 pr-2 text-left ring-1 ring-ink-200 transition focus-within:ring-2 focus-within:ring-accent-500 sm:pl-6">
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
                id={inputId}
                name="besoin"
                type="text"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Décrivez simplement votre besoin…"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none sm:text-base"
              />

              <button
                type="submit"
                aria-label="Voir comment je peux vous aider"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white transition hover:bg-ink-800"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>

          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-ink-600">
            Pas besoin de savoir exactement ce qu’il vous faut. Expliquez-moi simplement votre
            situation.
          </p>

          <ul className="mt-7 flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion.label}>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(suggestion.query);
                    orient(suggestion.query);
                  }}
                  className="rounded-full bg-white px-4 py-2 text-sm text-ink-700 ring-1 ring-ink-200 transition hover:ring-ink-400 hover:text-ink-900"
                >
                  {suggestion.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Réponse à la recherche */}
          <div
            ref={resultRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="focus:outline-none"
          >
            {state.kind === 'match' ? (
              <Answer
                eyebrow="Vous êtes peut-être au bon endroit."
                titre={state.result.intent.titre}
                univers={state.result.universe.nom}
                texte={state.result.intent.reponse}
                etapes={state.result.intent.etapes}
                primaire={{
                  href: contactHref(state.query, state.result.intent.sujet),
                  label: 'Parler de ma situation',
                }}
                secondaire={{ href: state.result.intent.service, label: 'Voir le service' }}
              />
            ) : null}

            {state.kind === 'none' ? (
              <Answer
                eyebrow="Je ne suis pas certain de la meilleure façon de vous aider."
                titre="Expliquez-moi simplement votre situation"
                texte="Décrivez-moi ce qui vous amène, même en quelques lignes et même si vous ne savez pas quelle démarche effectuer. Je vous répondrai personnellement et je vous dirai si je peux vous aider."
                primaire={{ href: contactHref(state.query), label: 'Me parler de mon besoin' }}
              />
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Answer({
  eyebrow,
  titre,
  univers,
  texte,
  etapes,
  primaire,
  secondaire,
}: {
  eyebrow: string;
  titre: string;
  univers?: string;
  texte: string;
  etapes?: string[];
  primaire: { href: string; label: string };
  secondaire?: { href: string; label: string };
}) {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white p-7 text-left ring-1 ring-ink-200 sm:p-8">
      <p className="text-[15px] text-ink-600">{eyebrow}</p>

      {univers ? (
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-700">
          {univers}
        </p>
      ) : null}

      <h2 className={`font-display text-2xl text-ink-900 ${univers ? 'mt-1.5' : 'mt-4'}`}>
        {titre}
      </h2>

      <p className="mt-3.5 text-[15px] leading-relaxed text-ink-600">{texte}</p>

      {etapes?.length ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {etapes.map((etape) => (
            <li key={etape} className="rounded-full bg-ink-50 px-3 py-1.5 text-[13px] text-ink-600">
              {etape}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href={primaire.href}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-ink-800"
        >
          {primaire.label}
          <ArrowRight />
        </Link>
        {secondaire ? (
          <Link
            href={secondaire.href}
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-ink-900 ring-1 ring-ink-200 transition hover:ring-ink-400"
          >
            {secondaire.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
