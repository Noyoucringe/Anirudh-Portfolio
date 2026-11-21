import SceneSlot from '../three/SceneSlot';
import { useState } from 'react';
import { capabilities } from '../data/profile';

const process = [
  [
    'Observe',
    'Inspect the input',
    'In my finance analyzer, I start with the raw transaction records and look for missing fields and inconsistent labels.',
  ],
  [
    'Understand',
    'Trace the decision',
    'In SentinelAI, each alert points back to the login events and the rule that fired.',
  ],
  [
    'Build',
    'Put the decision in someone’s hands',
    'In WinFix AI, a person sees the proposed action and decides whether to apply it.',
  ],
  [
    'Verify',
    'Keep the comparison fair',
    'I evaluate Qwen with and without the adapter on the same prompts, then compare the saved reviews.',
  ],
];
const contexts = [
  'Qwen Code Reviewer and the Personal Finance Analyzer.',
  'Gateway and service discovery in CargoFlow.',
  'The SentinelAI dashboard and this portfolio.',
  'SQLite records diagnostic sessions in WinFix AI.',
  'Cloud coursework and Git-based project development.',
  'Python powers WinFix and Qwen training.',
];
export default function About() {
  const [phase, setPhase] = useState(0);
  const [skill, setSkill] = useState(0);
  return (
    <section
      id="about"
      className="method"
      tabIndex={-1}
      aria-label="My engineering approach"
    >
      <div className="container">
        <p className="instrument-label">Engineering approach</p>
        <h2>My Workflow</h2>
        <div className="process-bench">
          <div
            className="process-switch"
            role="group"
            aria-label="Engineering process"
          >
            {process.map(([name], i) => (
              <button
                key={name}
                aria-label={name}
                aria-pressed={phase === i}
                onClick={() => setPhase(i)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="process-result" aria-live="polite">
            <SceneSlot
              kind="method"
              label="Verification plotter"
              stage={phase}
              onSelect={setPhase}
            />
            <h3>{process[phase][1]}</h3>
            <p>{process[phase][2]}</p>
          </div>
        </div>
        <div className="tool-explorer" id="skills">
          <h3>Tools I use</h3>
          <SceneSlot
            kind="skills"
            label="Engineering multitool"
            stage={skill}
            onSelect={setSkill}
          />
          <div
            className="stage-options"
            role="group"
            aria-label="Technical skills"
          >
            {capabilities.map((g, i) => (
              <button
                key={g.name}
                onMouseEnter={() => setSkill(i)}
                aria-pressed={skill === i}
                onClick={() => setSkill(i)}
              >
                {g.name}
              </button>
            ))}
          </div>
          <div aria-live="polite">
            <strong>{capabilities[skill].skills}</strong>
            <p>{contexts[skill]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
