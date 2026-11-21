export const stages = {
  sentinel: [
    [
      'Impossible travel',
      'Location × time',
      'Compare the distance between consecutive logins with the time available to travel.',
    ],
    [
      'Device change',
      'Device × user',
      'Compare device identifiers in a user’s recent sign-ins. A sudden switch contributes evidence for review.',
    ],
    [
      'Activity burst',
      'Events × time',
      'Look for a cluster of sign-ins inside a short interval. Inspect the contributing events before drawing a conclusion.',
    ],
  ],
  winfix: [
    [
      'Observe',
      'Collect evidence',
      'Read Windows system measurements and record the session.',
    ],
    [
      'Diagnose',
      'Select a check',
      'Resolve the requested diagnostic against the registry of supported checks.',
    ],
    [
      'Explain',
      'Interpret findings',
      'Present the measurements alongside a likely cause.',
    ],
    [
      'Approve',
      'Review the action',
      'A person reviews the predefined fix before it can run.',
    ],
    [
      'Verify',
      'Measure again',
      'Repeat measurements and compare the result with the original session.',
    ],
  ],
  qwen: [
    [
      'Base model',
      'Qwen2.5-1.5B',
      'The original weights supply a baseline for both evaluation paths.',
    ],
    [
      'Data',
      'Code review examples',
      'Training examples pair code with the review task.',
    ],
    [
      'Adapters',
      'Low-rank updates',
      'Trainable LoRA parameters sit alongside the frozen base weights.',
    ],
    [
      'Fine-tune',
      'Update the adapters',
      'Training updates the smaller adapter matrices and saves them separately.',
    ],
    [
      'Evaluate',
      'Run shared prompts',
      'Independent evaluation scripts run the original and adapted models.',
    ],
    [
      'Compare',
      'Inspect both reviews',
      'Compare saved outputs for the same prompt to see what changed.',
    ],
  ],
} as const;
