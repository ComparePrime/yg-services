import { Check, Dash } from '@/components/ui/Check';
import { comparison } from '@/config/pricing';

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto text-accent-600" />;
  if (value === false) return <Dash className="mx-auto text-ink-300" />;
  return <span className="text-[13px] text-ink-700">{value}</span>;
}

/**
 * Comparatif des formules.
 * Sur mobile : une carte par formule, pour rester lisible sans défilement horizontal.
 * Dès `md` : tableau classique.
 */
export function ComparisonTable() {
  const columns = [
    { key: 'essentiel' as const, label: 'Essentiel' },
    { key: 'pro' as const, label: 'Pro' },
    { key: 'surMesure' as const, label: 'Sur mesure' },
  ];

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-center text-sm">
          <caption className="sr-only">
            Comparatif des trois formules de création de site web
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[34%] py-4 text-left font-medium text-ink-500">
                Ce qui est inclus
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="py-4 font-display text-lg font-medium text-ink-900"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.label} className="border-t border-ink-200">
                <th scope="row" className="py-4 pr-4 text-left font-normal text-ink-800">
                  {row.label}
                </th>
                {columns.map((col) => (
                  <td key={col.key} className="py-4">
                    <Cell value={row[col.key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-6 md:hidden">
        {columns.map((col) => (
          <div key={col.key} className="rounded-2xl bg-white p-6 ring-1 ring-ink-200">
            <h3 className="font-display text-xl text-ink-900">{col.label}</h3>
            <dl className="mt-4 divide-y divide-ink-100 text-sm">
              {comparison.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-ink-600">{row.label}</dt>
                  <dd className="text-right">
                    <Cell value={row[col.key]} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
