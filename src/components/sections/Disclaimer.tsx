/**
 * Mention de cadre : précise ce qu'une prestation n'est pas.
 * Volontairement visible, jamais en petits caractères.
 */
export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 rounded-xl border-l-[3px] border-accent-400 bg-accent-50/70 px-5 py-4 text-sm leading-relaxed text-ink-700">
      <span className="font-semibold text-ink-900">Bon à savoir — </span>
      {children}
    </p>
  );
}
