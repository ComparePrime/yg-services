'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getOption, type Prestation } from '@/config/catalogue';
import { questionsPour, type Field } from '@/config/order-fields';
import { formatChf, mentionTva } from '@/config/tva';
import { calculerTotal, modeCommande, validerCommande, type OrderErrors } from '@/lib/order';

type Statut = 'saisie' | 'envoi' | 'envoye' | 'erreur';

const inputClass =
  'w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-[15px] text-ink-900 placeholder:text-ink-400 transition focus:border-ink-400 focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-medium text-ink-800';
const errorClass = 'mt-1.5 text-sm text-red-700';
const helpClass = 'mt-1.5 text-sm text-ink-500';

/**
 * Parcours de commande en trois temps : options, informations,
 * récapitulatif. Le total affiché est recalculé à chaque étape, et
 * recalculé une seconde fois côté serveur à la réception.
 */
export function OrderForm({ prestation }: { prestation: Prestation }) {
  const uid = useId();
  const groupes = useMemo(() => questionsPour(prestation), [prestation]);
  const optionsProposees = useMemo(
    () =>
      (prestation.options ?? [])
        .map((id) => getOption(id))
        .filter((option): option is NonNullable<typeof option> => Boolean(option)),
    [prestation],
  );

  // L'étape « options » est sautée lorsque la prestation n'en propose aucune.
  const etapes = useMemo(
    () =>
      [
        ...(optionsProposees.length > 0 ? ([{ id: 'options', titre: 'Options' }] as const) : []),
        { id: 'informations', titre: 'Vos informations' },
        { id: 'recapitulatif', titre: 'Récapitulatif' },
      ] as { id: string; titre: string }[],
    [optionsProposees.length],
  );

  const [etape, setEtape] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [conditions, setConditions] = useState(false);
  const [consentement, setConsentement] = useState(false);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [statut, setStatut] = useState<Statut>('saisie');
  const [messageServeur, setMessageServeur] = useState('');
  const [reference, setReference] = useState('');

  const total = useMemo(() => calculerTotal(prestation, options), [prestation, options]);
  const mode = modeCommande(prestation);
  const nomChamp = (name: string) => `${uid}-${name}`;

  const majReponse = (name: string, valeur: string) => {
    setReponses((prev) => ({ ...prev, [name]: valeur }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const suite = { ...prev };
      delete suite[name];
      return suite;
    });
  };

  const basculerOption = (id: string) =>
    setOptions((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  /** Contrôle les champs de l'étape courante avant de laisser avancer. */
  const etapeValide = () => {
    if (etapes[etape].id !== 'informations') return true;

    const complets = validerCommande({
      prestation: prestation.slug,
      options,
      reponses,
      conditions: true,
      consentement: true,
    });

    if (Object.keys(complets).length === 0) return true;

    setErrors(complets);
    const premier = Object.keys(complets)[0];
    document.getElementById(nomChamp(premier))?.focus();
    return false;
  };

  const suivant = () => {
    if (!etapeValide()) return;
    setEtape((prev) => Math.min(prev + 1, etapes.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const precedent = () => {
    setEtape((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function envoyer(event: React.FormEvent) {
    event.preventDefault();

    const payload = { prestation: prestation.slug, options, reponses, conditions, consentement };
    const locales = validerCommande(payload);
    if (Object.keys(locales).length > 0) {
      setErrors(locales);
      return;
    }

    setStatut('envoi');
    setMessageServeur('');

    try {
      const reponse = await fetch('/api/commande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await reponse.json();

      if (!reponse.ok || !data.ok) {
        if (data?.errors) setErrors(data.errors);
        setMessageServeur(data?.error ?? 'La commande n’a pas pu être enregistrée.');
        setStatut('erreur');
        return;
      }

      // Si le paiement est actif, Stripe prend la suite. Le retour de
      // navigateur ne vaut pas preuve : la page de confirmation vérifie
      // l'état réel du paiement côté serveur.
      if (data.paiement) {
        window.location.href = data.paiement;
        return;
      }

      setReference(data.reference ?? '');
      setStatut('envoye');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setMessageServeur('La connexion a échoué. Merci de réessayer.');
      setStatut('erreur');
    }
  }

  if (statut === 'envoye') {
    return (
      <div className="rounded-2xl bg-white p-8 ring-1 ring-ink-200 sm:p-10">
        <p className="font-display text-2xl text-ink-900">Commande enregistrée.</p>
        {reference ? (
          <p className="mt-3 text-ink-700">
            Votre référence : <span className="font-medium text-ink-900">{reference}</span>
          </p>
        ) : null}
        <p className="mt-4 text-ink-600">
          Vous recevez un message de confirmation récapitulant le montant et la liste exacte des
          pièces à transmettre. Les documents vous seront demandés séparément : ne les envoyez pas
          par ce site.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button href="/assistance-administrative">Revenir au catalogue</Button>
          <Button href="/conditions-prestations" variant="secondary">
            Conditions de prestation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
      <form onSubmit={envoyer} noValidate className="order-2 lg:order-1">
        {/* Progression */}
        <ol className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {etapes.map((item, index) => (
            <li
              key={item.id}
              aria-current={index === etape ? 'step' : undefined}
              className={
                index === etape
                  ? 'font-medium text-ink-900'
                  : index < etape
                    ? 'text-accent-700'
                    : 'text-ink-500'
              }
            >
              <span aria-hidden="true">{index + 1}. </span>
              {item.titre}
            </li>
          ))}
        </ol>

        <div className="mt-8 space-y-8">
          {etapes[etape].id === 'options' ? (
            <fieldset>
              <legend className="font-display text-xl text-ink-900">
                Des options s’appliquent-elles à votre situation ?
              </legend>
              <p className="mt-2 text-[15px] text-ink-600">
                Ne cochez que ce qui correspond vraiment. Si vous hésitez, laissez vide : la
                situation est vérifiée avant que le montant ne soit confirmé.
              </p>
              <ul className="mt-6 divide-y divide-ink-200 border-y border-ink-200">
                {optionsProposees.map((option) => (
                  <li key={option.id}>
                    <label className="flex cursor-pointer items-start gap-4 py-4">
                      <input
                        type="checkbox"
                        checked={options.includes(option.id)}
                        onChange={() => basculerOption(option.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-ink-900"
                      />
                      <span className="flex-1">
                        <span className="block text-[15px] font-medium text-ink-900">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-sm text-ink-600">
                          {option.description}
                        </span>
                      </span>
                      <span className="shrink-0 font-display text-base text-ink-900">
                        + {formatChf(option.price)}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          ) : null}

          {etapes[etape].id === 'informations'
            ? groupes.map((groupe) => (
                <fieldset key={groupe.id}>
                  <legend className="font-display text-xl text-ink-900">{groupe.title}</legend>
                  {groupe.description ? (
                    <p className="mt-2 text-[15px] text-ink-600">{groupe.description}</p>
                  ) : null}
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {groupe.fields.map((champ) => (
                      <ChampSaisie
                        key={champ.name}
                        champ={champ}
                        id={nomChamp(champ.name)}
                        valeur={reponses[champ.name] ?? ''}
                        erreur={errors[champ.name]}
                        onChange={(valeur) => majReponse(champ.name, valeur)}
                      />
                    ))}
                  </div>
                </fieldset>
              ))
            : null}

          {etapes[etape].id === 'recapitulatif' ? (
            <div>
              <h2 className="font-display text-xl text-ink-900">Avant de valider</h2>

              <dl className="mt-6 divide-y divide-ink-200 border-y border-ink-200 text-[15px]">
                {total.lignes.map((ligne) => (
                  <div key={ligne.label} className="flex justify-between gap-4 py-3">
                    <dt className="text-ink-700">{ligne.label}</dt>
                    <dd className="shrink-0 text-ink-900">{formatChf(ligne.montant)}</dd>
                  </div>
                ))}
                {total.tva.taux !== null ? (
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-ink-600">TVA {total.tva.taux} %</dt>
                    <dd className="shrink-0 text-ink-900">{formatChf(total.tva.montantTva)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 py-3">
                  <dt className="font-medium text-ink-900">Total</dt>
                  <dd className="shrink-0 font-display text-lg text-ink-900">
                    {formatChf(total.tva.total)}
                    {total.recurrence === 'mensuel' ? ' / mois' : ''}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-sm text-ink-500">{mentionTva()}</p>

              {mode === 'apres-examen' ? (
                <p className="mt-5 rounded-xl border-l-[3px] border-accent-400 bg-accent-50/70 px-5 py-4 text-sm leading-relaxed text-ink-700">
                  Ce montant est un ordre de grandeur. Le montant ferme vous est communiqué après
                  examen de votre dossier, avant tout engagement de votre part.
                </p>
              ) : null}

              <div className="mt-8 space-y-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={conditions}
                    onChange={(event) => setConditions(event.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-ink-900"
                    aria-describedby={errors.conditions ? `${uid}-conditions-error` : undefined}
                  />
                  <span className="text-[15px] leading-relaxed text-ink-700">
                    J’ai lu et j’accepte les{' '}
                    <Link
                      href="/conditions-prestations"
                      className="underline underline-offset-2 hover:text-ink-900"
                    >
                      conditions de prestation
                    </Link>
                    , y compris l’absence de garantie de résultat.
                  </span>
                </label>
                {errors.conditions ? (
                  <p id={`${uid}-conditions-error`} className={errorClass}>
                    {errors.conditions}
                  </p>
                ) : null}

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consentement}
                    onChange={(event) => setConsentement(event.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-ink-900"
                    aria-describedby={errors.consentement ? `${uid}-consentement-error` : undefined}
                  />
                  <span className="text-[15px] leading-relaxed text-ink-700">
                    J’accepte que ces informations soient utilisées pour traiter ma commande, selon
                    la{' '}
                    <Link
                      href="/confidentialite"
                      className="underline underline-offset-2 hover:text-ink-900"
                    >
                      politique de confidentialité
                    </Link>
                    .
                  </span>
                </label>
                {errors.consentement ? (
                  <p id={`${uid}-consentement-error`} className={errorClass}>
                    {errors.consentement}
                  </p>
                ) : null}
              </div>

              {/* Champ piège anti-robot. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor={nomChamp('societe')}>Société</label>
                <input id={nomChamp('societe')} name="societe" tabIndex={-1} autoComplete="off" />
              </div>
            </div>
          ) : null}
        </div>

        {statut === 'erreur' && messageServeur ? (
          <p role="alert" className="mt-7 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-800">
            {messageServeur}
          </p>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {etape > 0 ? (
            <Button type="button" variant="secondary" size="lg" onClick={precedent}>
              Revenir
            </Button>
          ) : null}

          {etape < etapes.length - 1 ? (
            <Button type="button" size="lg" onClick={suivant}>
              Continuer
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={statut === 'envoi'}>
              {statut === 'envoi' ? 'Envoi…' : 'Valider la commande'}
            </Button>
          )}
        </div>
      </form>

      {/* Récapitulatif permanent */}
      <aside className="order-1 lg:order-2">
        <div className="rounded-2xl bg-white p-7 ring-1 ring-ink-200 lg:sticky lg:top-28">
          <p className="text-sm text-ink-500">Votre commande</p>
          <p className="mt-1.5 font-display text-lg leading-snug text-ink-900">
            {prestation.titre}
          </p>

          <p className="mt-5 font-display text-3xl text-ink-900">
            {formatChf(total.tva.total)}
            {total.recurrence === 'mensuel' ? (
              <span className="text-base text-ink-500"> / mois</span>
            ) : null}
          </p>
          {mode === 'apres-examen' ? (
            <p className="mt-1.5 text-sm text-ink-500">Montant ferme confirmé après examen.</p>
          ) : null}

          {options.length > 0 ? (
            <ul className="mt-5 space-y-1.5 text-sm text-ink-600">
              {total.lignes.slice(1).map((ligne) => (
                <li key={ligne.label}>
                  + {ligne.label} ({formatChf(ligne.montant)})
                </li>
              ))}
            </ul>
          ) : null}

          <dl className="mt-6 space-y-3 border-t border-ink-100 pt-5 text-sm">
            <div>
              <dt className="text-ink-500">Délai indicatif</dt>
              <dd className="mt-0.5 text-ink-900">{prestation.delai}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Documents à prévoir</dt>
              <dd className="mt-0.5 text-ink-700">{prestation.documents.length} pièces</dd>
            </div>
          </dl>

          <p className="mt-5 text-xs leading-relaxed text-ink-500">
            Aucun document ne se transmet à cette étape. Les pièces vous sont demandées après
            confirmation de la commande.
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------
   Champ de saisie
------------------------------------------------------------------- */

function ChampSaisie({
  champ,
  id,
  valeur,
  erreur,
  onChange,
}: {
  champ: Field;
  id: string;
  valeur: string;
  erreur?: string;
  onChange: (valeur: string) => void;
}) {
  const pleineLargeur = champ.width !== 'half' || champ.type === 'textarea';
  const aideId = champ.help ? `${id}-help` : undefined;
  const erreurId = erreur ? `${id}-error` : undefined;
  const describedBy = [aideId, erreurId].filter(Boolean).join(' ') || undefined;

  const commun = {
    id,
    name: champ.name,
    value: valeur,
    required: champ.required,
    'aria-describedby': describedBy,
    'aria-invalid': erreur ? (true as const) : undefined,
    className: inputClass,
  };

  return (
    <div className={pleineLargeur ? 'sm:col-span-2' : undefined}>
      {champ.type === 'radio' ? (
        <fieldset>
          <legend className={labelClass}>
            {champ.label}
            {champ.required ? null : <span className="font-normal text-ink-500"> (facultatif)</span>}
          </legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {champ.choices?.map((choix) => (
              <label
                key={choix.value}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm transition ${
                  valeur === choix.value
                    ? 'bg-ink-900 text-white'
                    : 'bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-400'
                }`}
              >
                <input
                  type="radio"
                  name={champ.name}
                  value={choix.value}
                  checked={valeur === choix.value}
                  onChange={() => onChange(choix.value)}
                  className="sr-only"
                />
                {choix.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <>
          <label className={labelClass} htmlFor={id}>
            {champ.label}
            {champ.required ? null : <span className="font-normal text-ink-500"> (facultatif)</span>}
          </label>

          {champ.type === 'textarea' ? (
            <textarea
              {...commun}
              rows={5}
              placeholder={champ.placeholder}
              className={`${inputClass} resize-y`}
              onChange={(event) => onChange(event.target.value)}
            />
          ) : champ.type === 'select' ? (
            <select {...commun} onChange={(event) => onChange(event.target.value)}>
              <option value="">Choisir…</option>
              {champ.choices?.map((choix) => (
                <option key={choix.value} value={choix.value}>
                  {choix.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              {...commun}
              type={champ.type}
              placeholder={champ.placeholder}
              autoComplete={champ.autoComplete}
              min={champ.min}
              max={champ.max}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </>
      )}

      {champ.help ? (
        <p id={aideId} className={helpClass}>
          {champ.help}
        </p>
      ) : null}
      {erreur ? (
        <p id={erreurId} className={errorClass}>
          {erreur}
        </p>
      ) : null}
    </div>
  );
}
