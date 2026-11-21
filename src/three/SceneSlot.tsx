import type { Exhibit } from './models';
export default function SceneSlot({
  kind,
  stage = 0,
  label,
  onSelect,
}: {
  kind: Exhibit;
  stage?: number;
  label: string;
  onSelect?: (i: number) => void;
}) {
  return (
    <div
      className={'scene-slot slot-' + kind}
      data-scene={kind}
      data-stage={stage}
      role="group"
      aria-label={label}
      ref={(node) => {
        if (node) {
          node.onchange = (e) => {
            if (e instanceof CustomEvent) onSelect?.(Number(e.detail));
          };
        }
      }}
    >
      <div className="scene-blueprint" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <span className="scene-caption">{label}</span>
      <div className="orbit-buttons" aria-label="Rotate view">
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            aria-label={d < 0 ? 'Rotate left' : 'Rotate right'}
            onClick={(e) =>
              e.currentTarget
                .closest('[data-scene]')
                ?.dispatchEvent(
                  new CustomEvent('orbit', { detail: d, bubbles: true }),
                )
            }
          >
            {d < 0 ? '↶' : '↷'}
          </button>
        ))}
      </div>
    </div>
  );
}
