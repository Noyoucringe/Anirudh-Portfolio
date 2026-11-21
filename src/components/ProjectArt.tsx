import { useState } from 'react';
import SceneSlot from '../three/SceneSlot';
import { stages } from '../data/stages';
type Scene = keyof typeof stages;
const events = [
  'Location jump · Hyderabad to London in 12 minutes',
  'Device switch · new browser after a sign-in',
  'Activity burst · repeated logins in a short interval',
];
const issues = [
  [
    'High CPU usage',
    'Collect process CPU samples',
    'Inspect the busiest processes',
    'Explain which process accounts for the load',
    'Review the proposed action',
    'Compare CPU samples again',
  ],
  [
    'Low disk space',
    'Read free space on the volume',
    'Identify storage pressure',
    'Explain the capacity constraint',
    'Review cleanup before making a change',
    'Measure free space again',
  ],
  [
    'Network connectivity',
    'Read adapter state',
    'Inspect connectivity checks',
    'Explain the failed check',
    'Review the proposed network action',
    'Repeat the connectivity check',
  ],
];
export default function ProjectArt({ id }: { id: Scene }) {
  const [index, setIndex] = useState(0),
    [issue, setIssue] = useState(0);
  const options = stages[id];
  const select = (value: number) => setIndex(value % options.length);
  const controls = (
    <div className="stage-options" role="group" aria-label={id + ' stages'}>
      {options.map(([name], i) => (
        <button key={name} onClick={() => select(i)} aria-pressed={i === index}>
          {name}
        </button>
      ))}
    </div>
  );
  const detail = (
    <div className="stage-detail" key={index + '-' + issue} aria-live="polite">
      <strong>
        {id === 'winfix' ? issues[issue][index + 1] : options[index][1]}
      </strong>
      <p>{options[index][2]}</p>
    </div>
  );
  if (id === 'sentinel')
    return (
      <figure className="control-room">
        <SceneSlot
          kind="sentinel"
          label="Login event network"
          stage={index}
          onSelect={select}
        />
        <label className="demo-choice">
          Synthetic login event
          <select value={index} onChange={(e) => select(+e.target.value)}>
            {events.map((event, i) => (
              <option key={event} value={i}>
                {event}
              </option>
            ))}
          </select>
        </label>
        {detail}
        <a href="/art/sentinel-dashboard.webp">
          <img
            src="/art/sentinel-dashboard.webp"
            width="1432"
            height="930"
            alt="Actual SentinelAI dashboard with built-in sample data"
            loading="lazy"
          />
        </a>
        <figcaption>SentinelAI dashboard · built-in sample data</figcaption>
      </figure>
    );
  if (id === 'winfix')
    return (
      <div className="diagnostic-desk">
        <SceneSlot
          kind="winfix"
          label="Diagnostic modules"
          stage={index}
          onSelect={select}
        />
        <label className="demo-choice">
          Sample issue
          <select
            value={issue}
            onChange={(e) => {
              setIssue(+e.target.value);
              select(0);
            }}
          >
            {issues.map(([name], i) => (
              <option key={name} value={i}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <div className="diagnostic-body">
          {controls}
          <div className="diagnostic-detail">{detail}</div>
        </div>
      </div>
    );
  return (
    <div className="training-bench">
      <SceneSlot
        kind="qwen"
        label="Qwen2.5-1.5B · model cross-section"
        stage={index}
        onSelect={select}
      />
      {controls}
      {detail}
    </div>
  );
}
