import { useEffect, useRef } from 'react';
import { chapters, clamp } from './chapters';
import { installRuler } from './instrument';
export default function ScrollRuler() {
  const rail = useRef<HTMLElement>(null);
  useEffect(() => {
    if (rail.current) return installRuler(rail.current);
  }, []);
  return (
    <aside
      className="scroll-instrument"
      ref={rail}
      aria-label="Page navigation"
    >
      <div
        className="scale-area"
        role="slider"
        tabIndex={0}
        aria-label="Document scroll position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        onKeyDown={(e) => {
          let y = scrollY;
          const max = Math.max(
            0,
            document.documentElement.scrollHeight - innerHeight,
          );
          switch (e.key) {
            case 'Home':
              y = 0;
              break;
            case 'End':
              y = max;
              break;
            case 'ArrowUp':
              y -= max * 0.01;
              break;
            case 'ArrowDown':
              y += max * 0.01;
              break;
            case 'PageUp':
              y -= innerHeight;
              break;
            case 'PageDown':
              y += innerHeight;
              break;
            default:
              return;
          }
          e.preventDefault();
          e.currentTarget.dispatchEvent(
            new CustomEvent('seek', { detail: clamp(y, 0, max) }),
          );
        }}
      >
        {Array.from({ length: 101 }, (_, i) => (
          <i
            key={i}
            className={i % 5 ? 'tick' : 'tick major'}
            aria-hidden="true"
          >
            {i % 5 === 0 && <small>{i}</small>}
          </i>
        ))}
        <span className="view-range" />
        <span className="rail-ghost" />
        <span className="rail-needle" />
      </div>
      <nav className="rail-words" aria-label="Chapters">
        {chapters.map(([id, label]) => (
          <a key={id} href={'#' + id}>
            {label}
          </a>
        ))}
      </nav>
      <output className="rail-value" aria-live="off">
        000%
      </output>
      <div aria-hidden="true" className="compact-progress" />
    </aside>
  );
}
