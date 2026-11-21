const git = (repo: string) => 'https://github.com/Noyoucringe/' + repo;

export type Project = {
  id: string;
  name: string;
  field: string;
  tagline: string;
  stack: string[];
  problem: string;
  implementation: string;
  result: string;
  source: string;
  demo?: string;
};

export const selectedProjects: Project[] = [
  {
    id: 'sentinel',
    name: 'SentinelAI',
    field: 'Security analytics',
    tagline: 'Spot the login that doesn’t belong.',
    stack: ['React', 'TypeScript', 'Recharts'],
    problem:
      'A suspicious sign-in is easy to miss in a spreadsheet of otherwise ordinary events.',
    implementation:
      'A browser-side rules engine compares the time, location, and device behind each login. Configurable rules flag impossible travel, sudden device changes, and bursts of activity.',
    result:
      'Load the sample or a CSV, filter the alerts, and inspect the reasons behind an individual risk score.',
    source: git('SentinelAI'),
    demo: 'https://sentinel-ai-flax.vercel.app/',
  },
  {
    id: 'winfix',
    name: 'WinFix AI',
    field: 'Desktop software / AI',
    tagline: 'Understand the problem. Verify the fix.',
    stack: ['Python', 'PySide6', 'SQLite', 'Win32'],
    problem:
      'Windows troubleshooting needs a clear connection between a symptom, the evidence, and the action that follows.',
    implementation:
      'I built a desktop workflow that gathers diagnostics, explains likely causes, and asks for approval before applying a predefined fix.',
    result:
      'The agent validates requested checks against a tool registry. A verification stage measures again after a fix, while SQLite retains the session history. Optional local or cloud models help guide the investigation.',
    source: git('WinFix-AI'),
  },
  {
    id: 'qwen',
    name: 'Qwen Code Reviewer',
    field: 'Qwen fine-tuning / ML research',
    tagline: 'What changes when a small model learns to review code?',
    stack: ['Python', 'PyTorch', 'PEFT / LoRA'],
    problem:
      'Fine-tuning can change a model’s answers. The harder part is measuring which changes actually help.',
    implementation:
      'I fine-tuned Qwen2.5-1.5B with low-rank adapters. Separate evaluation scripts run the base and adapted models against a shared benchmark.',
    result:
      'Saved outputs make it possible to compare the two models on the same prompts and examine trade-offs in their reviews.',
    source: git('qwen-code-review-finetuning'),
  },
];

export const moreProjects: {
  name: string;
  detail: string;
  tech: string;
  url?: string;
  demo?: string;
}[] = [
  {
    name: 'CargoFlow',
    detail:
      'Team logistics project in development, with Spring Cloud gateway, service discovery, and configuration infrastructure.',
    tech: 'Java / Spring Cloud',
    url: git('CargoFlow'),
  },
  {
    name: 'TriviaChamp',
    detail:
      'Team quiz application with offline question banks and timed online play.',
    tech: 'JavaScript / Python',
    url: git('TriviaChamp'),
  },
  {
    name: 'Personal Finance Analyzer',
    detail:
      'Cleans bank statements and maps transactions to spending categories.',
    tech: 'Python / Pandas',
    url: git('WhereIsMyMoneyGoing-'),
  },
  {
    name: 'E-Commerce Order Tracker',
    detail: 'Tracks orders and exposes their status through a web interface.',
    tech: 'Web application',
    url: git('Ecommerce-order-tracker-fedf'),
    demo: 'https://ecommerce-order-tracker-fedf.onrender.com/',
  },
  {
    name: 'Movie Recommendation / Watch Diary Bot',
    detail:
      'A Telegram workflow uses webhooks and an LLM prompt to return personalized movie recommendations.',
    tech: 'n8n / Telegram / REST APIs',
  },
];
