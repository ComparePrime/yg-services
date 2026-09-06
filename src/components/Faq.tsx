import type { FaqItem } from '@/config/faq';

/**
 * FAQ en HTML natif (details / summary) : accessible au clavier,
 * fonctionnelle sans JavaScript et indexable par les moteurs de recherche.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-ink-200 border-y border-ink-200">
      {items.map((item) => (
        <details key={item.question} className="group py-1">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left">
            <h3 className="text-base font-medium text-ink-900 sm:text-lg">{item.question}</h3>
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-ink-400 transition duration-300 group-open:rotate-45"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M10 4v12M4 10h12" />
              </svg>
            </span>
          </summary>
          <p className="pb-6 pr-10 text-[15px] leading-relaxed text-ink-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
