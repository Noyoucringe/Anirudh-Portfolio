import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { revealTransition, viewport } from '../lib/motion';

export function Arrow({
  direction = 'right',
}: {
  direction?: 'right' | 'up-right' | 'down' | 'up';
}) {
  return (
    <svg className={'arrow arrow-' + direction} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h15m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Mark() {
  return (
    <svg className="brand-mark" viewBox="0 0 38 32" aria-hidden="true" fill="none">
      <path
        d="m2 26 9-20h5l-9 20zm10 0 9-20h5l-9 20zm10 0 6-14 7 14h-6l-1-4-2 4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Action({
  children,
  variant = 'primary',
  direction = 'right',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  direction?: 'right' | 'up-right' | 'down';
}) {
  return (
    <a {...props} className={'action action-' + variant}>
      <span>{children}</span>
      <Arrow direction={direction} />
    </a>
  );
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={false}
      whileInView={reduced ? undefined : { y: [14, 0], opacity: [0.65, 1] }}
      transition={revealTransition}
      viewport={viewport}
    >
      {children}
    </m.div>
  );
}

export function SectionTitle({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="section-title">
      <p className="eyebrow">
        <span className="rule" />
        {label}
      </p>
      <h2>{children}</h2>
    </div>
  );
}
