import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'dark',
  as: Tag = 'h2',
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  as?: 'h1' | 'h2' | 'h3';
}) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-2xl`}>
      {eyebrow ? (
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${
            tone === 'light' ? 'text-accent-300' : 'text-accent-700'
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <Tag
        className={`font-display text-3xl leading-tight sm:text-4xl ${
          tone === 'light' ? 'text-white' : 'text-ink-900'
        }`}
      >
        {title}
      </Tag>
      {lead ? (
        <p className={`mt-4 text-lg ${tone === 'light' ? 'text-ink-300' : 'text-ink-600'}`}>{lead}</p>
      ) : null}
    </div>
  );
}
