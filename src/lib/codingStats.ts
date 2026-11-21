// Load optional numbers only when a visitor opens the coding profiles.
const CACHE_KEY = 'portfolio:coding-stats:v1';
const maxAge = 60 * 60 * 1000;
type Stats = Partial<Record<'Codeforces' | 'LeetCode', string>>;
let inFlight: Promise<Stats> | undefined;
let memory: { time: number; stats: Stats } | undefined;

function readCache() {
  if (memory) return memory;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (typeof parsed.time === 'number' && parsed.stats && typeof parsed.stats === 'object') {
      const stats: Stats = {};
      if (typeof parsed.stats.Codeforces === 'string') stats.Codeforces = parsed.stats.Codeforces;
      if (typeof parsed.stats.LeetCode === 'string') stats.LeetCode = parsed.stats.LeetCode;
      return { time: parsed.time, stats };
    }
  } catch {
    /* Storage is optional in private sessions. */
  }
}

async function readJson(url: string) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return;
    return await response.json();
  } finally {
    window.clearTimeout(timer);
  }
}

async function fetchStats(): Promise<Stats> {
  const [cf, lc] = await Promise.allSettled([
    readJson('https://codeforces.com/api/user.info?handles=anirudh_7109'),
    readJson('https://alfa-leetcode-api.onrender.com/userProfile/Anirudh_7109'),
  ]);
  const stats: Stats = {};
  if (cf.status === 'fulfilled' && cf.value?.status === 'OK') {
    const user = cf.value.result?.[0];
    if (user?.handle?.toLowerCase() === 'anirudh_7109' && Number.isInteger(user.maxRating))
      stats.Codeforces = user.maxRating + ' peak rating';
  }
  if (lc.status === 'fulfilled') {
    const solved = lc.value?.totalSolved;
    if (Number.isInteger(solved) && solved >= 0) stats.LeetCode = solved + ' solved';
  }
  const entry = { time: Date.now(), stats };
  memory = entry;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* Use memory if storage is unavailable. */
  }
  return stats;
}

export function getCodingStats() {
  const cached = readCache();
  if (cached && Date.now() - cached.time < maxAge) return Promise.resolve(cached.stats);
  inFlight ??= fetchStats().finally(() => {
    inFlight = undefined;
  });
  return inFlight;
}
