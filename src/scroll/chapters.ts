export const chapters = [
  ['home', 'Intro'],
  ['sentinelai', 'SentinelAI'],
  ['winfix', 'WinFix AI'],
  ['qwen', 'Qwen'],
  ['more-projects', 'Archive'],
  ['about', 'Workflow'],
  ['skills', 'Skills'],
  ['experience', 'Experience'],
  ['credentials', 'Credentials'],
  ['contact', 'Contact'],
] as const;
export const clamp = (n: number, min = 0, max = 1) =>
  Math.max(min, Math.min(n, max));
