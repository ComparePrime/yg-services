import type { ElementType, ReactNode } from 'react';
import { Container } from './Container';

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  tone?: 'white' | 'sand' | 'ink';
  size?: 'default' | 'narrow' | 'wide';
  as?: ElementType;
};

const tones: Record<NonNullable<SectionProps['tone']>, string> = {
  white: 'bg-white text-ink-900',
  sand: 'bg-sand text-ink-900',
  ink: 'bg-ink-950 text-ink-100',
};

export function Section({
  children,
  id,
  className = '',
  tone = 'white',
  size = 'default',
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag id={id} className={`${tones[tone]} py-16 sm:py-24 ${className}`}>
      <Container size={size}>{children}</Container>
    </Tag>
  );
}
