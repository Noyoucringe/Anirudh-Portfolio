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
      aria-label="Interactive Knowledge Atlas"
    >
      <div
        className="optics-surface"
        role="img"
        aria-label="Open research notebook with an emerging neural network."
      >
        <img
          className="optics-plate"
          style={{ objectFit: 'contain' }}
          src="/art/atlas.webp"
          alt=""
        />
      </div>
      <figcaption>
        <strong>Knowledge Atlas</strong>
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
