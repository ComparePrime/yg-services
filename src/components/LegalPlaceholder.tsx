/**
 * Affiche une valeur légale, ou un emplacement clairement identifié
 * lorsque l'information n'a pas encore été confirmée.
 * Rien n'est inventé côté site.
 */
export function LegalValue({ value, label }: { value: string; label: string }) {
  if (value) return <>{value}</>;
  return (
    <span className="rounded bg-accent-50 px-2 py-0.5 text-accent-800 ring-1 ring-accent-200">
      [{label} — à compléter]
    </span>
  );
}
