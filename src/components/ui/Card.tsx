import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 ring-1 ring-ink-200/80 sm:p-8 ${
        interactive ? 'transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-ink-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
