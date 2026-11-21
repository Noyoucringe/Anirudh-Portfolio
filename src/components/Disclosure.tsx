import { useId, useState, type ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { ease } from '../lib/motion';
export default function Disclosure({
  title,
  description,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reduced = useReducedMotion();
  return (
    <div className={'disclosure ' + className}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span>
          <strong>{title}</strong>
          {description && <span className="disclosure-description">{description}</span>}
        </span>
        <span className="disclosure-icon" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      <m.div
        id={id}
        className="disclosure-body"
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.38, ease }}
        aria-hidden={!open}
        {...(!open ? { inert: '' } : {})}
      >
        <div className="disclosure-content">{children}</div>
      </m.div>
    </div>
  );
}
