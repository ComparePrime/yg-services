'use client';

import { useEffect, useId, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  ACCEPTED_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
  subjects,
  validateContact,
  type ContactPayload,
  type ValidationErrors,
} from '@/lib/contact';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const emptyForm = {
  subject: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  consent: false,
};

/**
 * Formulaire de contact.
 * `variant="simple"` affiche la version courte « Expliquez-moi votre situation »,
 * sans choix de sujet ni pièce jointe.
 */
export function ContactForm({ variant = 'full' }: { variant?: 'full' | 'simple' }) {
  const searchParams = useSearchParams();
  const uid = useId();
  const [values, setValues] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  // Pré-sélectionne le sujet quand on arrive depuis un CTA (?sujet=logement, etc.).
  useEffect(() => {
    const preset = searchParams.get('sujet');
    if (preset && subjects.some((s) => s.value === preset)) {
      setValues((prev) => ({ ...prev, subject: preset }));
    }
  }, [searchParams]);

  const field = (name: string) => `${uid}-${name}`;

  const update = (name: keyof typeof emptyForm, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const readFile = (input: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
      reader.onerror = () => reject(new Error('read-error'));
      reader.readAsDataURL(input);
    });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError('');

    const payload: Partial<ContactPayload> = {
      ...values,
      subject: variant === 'simple' ? 'autre' : values.subject,
    };

    if (file) {
      if (file.size > MAX_ATTACHMENT_BYTES) {
        setErrors({ attachment: 'La pièce jointe dépasse 5 Mo.' });
        return;
      }
      payload.attachment = { filename: file.name, content: await readFile(file) };
    }

    const found = validateContact(payload);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = document.getElementById(field(Object.keys(found)[0]));
      first?.focus();
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        setServerError(data.error ?? 'Une erreur est survenue. Merci de réessayer.');
        setStatus('error');
        return;
      }

      setValues(emptyForm);
      setFile(null);
      setStatus('sent');
    } catch {
      setServerError(
        "Impossible d'envoyer le message. Vérifiez votre connexion et réessayez.",
      );
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="rounded-2xl bg-white p-8 text-center ring-1 ring-ink-200 sm:p-10"
      >
        <p className="font-display text-2xl text-ink-900">Message bien reçu.</p>
        <p className="mx-auto mt-3 max-w-md text-ink-600">
          Merci pour votre message. Je le lis personnellement et je vous réponds directement,
          généralement sous 24 à 48 heures ouvrables.
        </p>
        <Button
          variant="secondary"
          className="mt-7"
          onClick={() => setStatus('idle')}
          type="button"
        >
          Envoyer une autre demande
        </Button>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-[15px] text-ink-900 placeholder:text-ink-400 transition focus:border-ink-400 focus:outline-none';
  const labelClass = 'mb-1.5 block text-sm font-medium text-ink-800';
  const errorClass = 'mt-1.5 text-sm text-red-700';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {variant === 'full' ? (
        <fieldset>
          <legend className={labelClass}>Que puis-je faire pour vous ?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {subjects.map((subject) => {
              const selected = values.subject === subject.value;
              return (
                <label
                  key={subject.value}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm transition ${
                    selected
                      ? 'bg-ink-900 text-white'
                      : 'bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="subject"
                    value={subject.value}
                    checked={selected}
                    onChange={() => update('subject', subject.value)}
                    className="sr-only"
                  />
                  {subject.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={field('firstName')}>
            Prénom
          </label>
          <input
            id={field('firstName')}
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={values.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? `${field('firstName')}-error` : undefined}
            className={inputClass}
          />
          {errors.firstName ? (
            <p id={`${field('firstName')}-error`} className={errorClass}>
              {errors.firstName}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor={field('lastName')}>
            Nom
          </label>
          <input
            id={field('lastName')}
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={values.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? `${field('lastName')}-error` : undefined}
            className={inputClass}
          />
          {errors.lastName ? (
            <p id={`${field('lastName')}-error`} className={errorClass}>
              {errors.lastName}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor={field('email')}>
            E-mail
          </label>
          <input
            id={field('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${field('email')}-error` : undefined}
            className={inputClass}
          />
          {errors.email ? (
            <p id={`${field('email')}-error`} className={errorClass}>
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor={field('phone')}>
            Téléphone <span className="font-normal text-ink-500">(facultatif)</span>
          </label>
          <input
            id={field('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor={field('message')}>
          {variant === 'simple' ? 'Votre situation' : 'Votre message'}
        </label>
        <textarea
          id={field('message')}
          name="message"
          rows={6}
          required
          placeholder={
            variant === 'simple'
              ? 'Par exemple : « J’ai reçu une hausse de loyer et je ne sais pas si je peux la contester. »'
              : 'Décrivez votre projet ou votre situation, même brièvement.'
          }
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${field('message')}-error` : undefined}
          className={`${inputClass} resize-y`}
        />
        {errors.message ? (
          <p id={`${field('message')}-error`} className={errorClass}>
            {errors.message}
          </p>
        ) : null}
      </div>

      {variant === 'full' ? (
        <div>
          <label className={labelClass} htmlFor={field('attachment')}>
            Pièce jointe <span className="font-normal text-ink-500">(facultatif, 5 Mo max.)</span>
          </label>
          <input
            id={field('attachment')}
            name="attachment"
            type="file"
            accept={ACCEPTED_ATTACHMENTS}
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setErrors((prev) => ({ ...prev, attachment: undefined }));
            }}
            className="w-full rounded-xl border border-dashed border-ink-300 bg-white px-4 py-3 text-sm text-ink-600 file:mr-4 file:rounded-full file:border-0 file:bg-ink-100 file:px-4 file:py-2 file:text-sm file:text-ink-800"
          />
          <p className="mt-1.5 text-sm text-ink-500">
            Un contrat, un courrier reçu ou un document utile à votre demande.
          </p>
          {errors.attachment ? <p className={errorClass}>{errors.attachment}</p> : null}
        </div>
      ) : null}

      {/* Champ piège anti-robot, invisible et exclu de la navigation clavier. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor={field('company')}>Société</label>
        <input id={field('company')} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-600">
          <input
            id={field('consent')}
            type="checkbox"
            checked={values.consent}
            onChange={(e) => update('consent', e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            className="mt-1 h-4 w-4 rounded border-ink-300 text-ink-900 focus:ring-ink-400"
          />
          <span>
            J’accepte que mes données soient utilisées pour traiter ma demande, conformément à la{' '}
            <a href="/confidentialite" className="underline underline-offset-2 hover:text-ink-900">
              politique de confidentialité
            </a>
            .
          </span>
        </label>
        {errors.consent ? <p className={errorClass}>{errors.consent}</p> : null}
      </div>

      {serverError ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={status === 'sending'} className="w-full sm:w-auto">
        {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </Button>

      <p className="text-sm text-ink-500">
        Réponse personnelle, généralement sous 24 à 48 heures ouvrables. Aucun engagement.
      </p>
    </form>
  );
}
