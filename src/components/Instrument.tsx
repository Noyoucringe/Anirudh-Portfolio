import { useEffect, useRef } from 'react';
export default function Instrument() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let live = true,
      dispose: (() => void) | undefined;
    import('../three/SignalInstrument').then(({ mountInstrument }) => {
      if (live && ref.current) dispose = mountInstrument(ref.current);
    });
    return () => {
      live = false;
      dispose?.();
    };
  }, []);
  return (
    <figure
      ref={ref}
      className="optics"
      aria-label="Interactive optical encoder"
    >
      <div
        className="optics-surface"
        role="img"
        aria-label="Optical encoder with 36 machined vanes."
      >
        <svg
          className="optics-plate"
          aria-hidden="true"
          viewBox="-130 -110 260 220"
        >
          <g transform="rotate(-16) scale(1 .82)">
            {Array.from({ length: 36 }, (_, i) => (
              <path
                key={i}
                d="M45 0 Q62 -14 99 -7 L102 1 Q75 -2 49 12Z"
                transform={'rotate(' + i * 10 + ')'}
                fill={i % 12 < 3 ? '#6089ff' : '#a5b4cb'}
                stroke="#273450"
              />
            ))}
          </g>
        </svg>
      </div>
      <figcaption>
        <strong>Optical encoder</strong>
        <span className="instrument-controls">
          <button value="-1" aria-label="Rotate instrument left">
            ↶
          </button>
          <span className="instrument-readout" aria-hidden="true">
            0°
          </span>
          <button value="1" aria-label="Rotate instrument right">
            ↷
          </button>
        </span>
      </figcaption>
    </figure>
  );
}
