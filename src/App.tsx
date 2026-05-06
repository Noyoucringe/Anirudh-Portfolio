import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Beams from './Beams';
import ClickSpark from './ClickSpark';
import GlareHover from './GlareHover';
import CircularText from './CircularText';
import PillNav from './PillNav';
import GradualBlur from './GradualBlur';
import StarBorder from './StarBorder';
import TiltedCard from './TiltedCard';
import { Text_03 } from './Text_03';
import BorderGlow from './BorderGlow';
import './ShinyText.css';

const featureCards = [
  { title: 'Intermediate Programming', description: 'Understanding logic, functions, and data structures.' },
  { title: 'Web Fundamentals', description: 'HTML, TailwindCSS, JavaScript, React for building clean interfaces.' },
  { title: 'Learning by Doing', description: 'Small projects to apply concepts and improve each time.' },
  { title: 'Debugging Practice', description: 'Reading errors, testing fixes, and learning from mistakes.' },
];

const processSteps = [
  { step: '01', title: 'Learn', description: 'Pick a topic and understand the basics.' },
  { step: '02', title: 'Practice', description: 'Build small projects to apply what I learned.' },
  { step: '03', title: 'Improve', description: 'Fix mistakes, clean up code, and keep moving forward.' },
  { step: '04', title: 'Reflect', description: 'Write down what worked and what to try next.' },
];

const skillGroups = [
  {
    title: 'Programming Languages',
    items: [
      { name: 'C', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
      { name: 'C++', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
      { name: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
      { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { name: 'Go', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
    ],
  },
  {
    title: 'Web Development',
    items: [
      { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'HTML5', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'CSS3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
      { name: 'Tailwind', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    ],
  },
  {
    title: 'Databases & Tools',
    items: [
      { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
      { name: 'Firebase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
      { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
      { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/FFFFFF' },
      { name: 'VS Code', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
      { name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
    ],
  },
  {
    title: 'Design & Content',
    items: [
      { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
      { name: 'Canva', logo: '/canva-logo-v2.svg' },
    ],
  },
];

const projects = [
  {
    title: 'TriviaChamp - Quiz Application',
    description: 'OOP-based quiz application with modular classes for questions, scoring, and user interaction.',
    tags: ['Java', 'OOP'],
    link: 'https://triviachamp.onrender.com/',
    label: 'View Deployment',
  },
  {
    title: 'Personal Finance Analyzer',
    description: 'Analyzed messy bank statements using data cleaning and visualization to derive spending insights.',
    tags: ['Python', 'Pandas'],
    link: 'https://github.com/Noyoucringe/WhereIsMyMoneyGoing-.git',
    label: 'View Repository',
  },
  {
    title: 'Smart Campus Ecosystem',
    description: 'A web portal to streamline campus services, notices, and student interactions in one place.',
    tags: ['Web App', 'Full Stack'],
    link: 'https://github.com/Noyoucringe/Smart-Campus-Ecosystem-web',
    label: 'View Repository',
  },
  {
    title: 'PixelFlex',
    description: 'A Project for tracking the mental health of students in a college using this application.',
    tags: ['Web App'],
    link: 'https://github.com/Noyoucringe/pixelflex-app',
    label: 'View Repository',
  },
  {
    title: 'E-commerce Order Tracker',
    description: 'Real-time order tracking system using backend APIs and dynamic status updates.',
    tags: ['Node.js', 'REST API'],
    link: 'https://ecommerce-order-tracker-fedf.onrender.com/',
    label: 'View Deployment',
  },
  {
    title: 'SentinelAI',
    description: 'Web-based analytics platform that detects suspicious login behavior and identity theft using behavioral anomaly detection',
    tags: ['Cybersecurity'],
    link: 'https://sentinel-ai-flax.vercel.app/',
    label: 'View Deployment',
  },
];

const certifications = [
  {
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issued: 'Feb 2026',
    expires: 'Feb 2029',
    credentialId: null,
    skills: ['Cloud Foundations', 'Cloud Applications'],
    link: 'https://www.credly.com/badges/0315afe9-f5f3-4ff1-94d5-ca71104e0cee/public_url',
    logo: '/AWSLOGO.webp',
  },
  {
    title: 'GitHub Foundations',
    issuer: 'GitHub',
    issued: 'Feb 2026',
    expires: 'Feb 2028',
    credentialId: '91F58703F2FF5440',
    skills: ['Git'],
    link: 'https://learn.microsoft.com/en-us/users/meghamshanirudhpulivendala-7498/credentials/91f58703f2ff5440?ref=https%3A%2F%2Fwww.linkedin.com%2F',
    logo: '/githublogo.webp',
  },
  {
    title: 'Advanced Automation Professional',
    issuer: 'Automation Anywhere',
    issued: 'Dec 2025',
    expires: null,
    credentialId: 'AAADVC2024A360 - 170458608',
    skills: ['Automation'],
    link: 'https://certificates.automationanywhere.com/26f1acf4-a1ef-4c78-b6fb-26ff30ec19a9#acc.9IRtFoBc',
    logo: '/AUTOLOGO.jpg',
  },
];

type CodingPlatform = 'codeforces' | 'leetcode' | 'codechef';
type CodingStatus = 'unconfigured' | 'loading' | 'ready' | 'error';
type CodingBadgeTone = 'green' | 'amber' | 'red' | 'blue' | 'orange' | 'slate';

type CodingBadge = {
  label: string;
  value: string;
  tone: CodingBadgeTone;
};

type CodingProfile = {
  key: CodingPlatform;
  platform: string;
  handle: string;
  iconUrl: string;
  profileUrl: string;
  primaryLabel: string;
  primaryValue: string;
  progress: number;
  badges: CodingBadge[];
  status: CodingStatus;
  error?: string;
  updatedAt?: string;
};

const codingHandles: Record<CodingPlatform, string> = {
  codeforces: 'anirudh_7109',
  leetcode: 'Anirudh_7109',
  codechef: 'worth_poem_59',
};

const codingRefreshIntervalMs = 1000 * 60 * 5;
const codingPlatformsDisplay: CodingPlatform[] = ['leetcode', 'codeforces', 'codechef'];

const navItems = [
  { label: 'FOCUS AREAS', href: '#work' },
  { label: 'WORKFLOW', href: '#process' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CODING', href: '#coding' },
  { label: 'CERTIFICATIONS', href: '#certifications' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT', href: '#contact' },
];

const navItemsCompact = [
  { label: 'FOCUS', href: '#work' },
  { label: 'FLOW', href: '#process' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CODE', href: '#coding' },
  { label: 'CERTS', href: '#certifications' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT', href: '#contact' },
];

const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';
type ContactFormValues = { name: string; email: string; message: string };
type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const initialContactFormValues: ContactFormValues = {
  name: '',
  email: '',
  message: '',
};

const codingPlatformMeta: Record<CodingPlatform, { title: string; website: string; iconUrl: string }> = {
  codeforces: {
    title: 'Codeforces',
    website: 'https://codeforces.com',
    iconUrl: 'https://cdn.simpleicons.org/codeforces/FFFFFF',
  },
  leetcode: {
    title: 'LeetCode',
    website: 'https://leetcode.com',
    iconUrl: 'https://cdn.simpleicons.org/leetcode/FFA116',
  },
  codechef: {
    title: 'CodeChef',
    website: 'https://www.codechef.com',
    iconUrl: 'https://cdn.simpleicons.org/codechef/FFFFFF',
  },
};

function formatNumber(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '--';
  return value.toLocaleString('en-US');
}

function formatWhole(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '--';
  return Math.round(value).toLocaleString('en-US');
}

function formatPlusCount(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '--';
  return `${Math.max(0, Math.round(value)).toLocaleString('en-US')}+`;
}

function asTitleCase(value: string | undefined): string {
  if (!value) return '--';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function clampProgress(value: number | null, maxValue: number): number {
  if (value === null || Number.isNaN(value) || maxValue <= 0) return 0;
  return Math.max(0, Math.min(1, value / maxValue));
}

function parseNumericValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, '').trim());
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function getValueByPath(data: unknown, path: string): unknown {
  if (!data || typeof data !== 'object') return undefined;

  return path.split('.').reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, data);
}

function getFirstNumericAtPaths(data: unknown, paths: string[]): number | null {
  for (const path of paths) {
    const value = parseNumericValue(getValueByPath(data, path));
    if (value !== null) return value;
  }
  return null;
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

async function fetchCodeforcesStats(handle: string): Promise<Omit<CodingProfile, 'status'>> {
  const [userInfoRaw, submissionsRaw, ratingHistoryRaw] = await Promise.all([
    fetchJson(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`),
    fetchJson(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`),
    fetchJson(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`),
  ]);

  const userInfo = userInfoRaw as {
    status?: string;
    result?: Array<{ rank?: string; maxRank?: string; rating?: number; maxRating?: number }>;
    comment?: string;
  };
  const submissions = submissionsRaw as {
    status?: string;
    result?: Array<{ verdict?: string; problem?: { contestId?: number; index?: string; name?: string } }>;
    comment?: string;
  };
  const ratingHistory = ratingHistoryRaw as {
    status?: string;
    result?: Array<{ contestId?: number }>;
    comment?: string;
  };

  if (userInfo.status !== 'OK' || !userInfo.result?.length) {
    throw new Error(userInfo.comment || 'Unable to load Codeforces profile.');
  }
  if (submissions.status !== 'OK') {
    throw new Error(submissions.comment || 'Unable to load Codeforces submissions.');
  }
  if (ratingHistory.status !== 'OK') {
    throw new Error(ratingHistory.comment || 'Unable to load Codeforces rating history.');
  }

  const profile = userInfo.result[0];
  const solvedSet = new Set<string>();
  const maxRating = profile.maxRating ?? profile.rating ?? null;
  const contestCount = (ratingHistory.result || []).length;

  (submissions.result || []).forEach((entry) => {
    if (entry.verdict !== 'OK' || !entry.problem) return;
    const contest = entry.problem.contestId ?? 'global';
    const index = entry.problem.index ?? entry.problem.name ?? 'unknown';
    solvedSet.add(`${contest}-${index}`);
  });

  const primaryLabel = maxRating !== null ? 'Max Rating' : 'Problems Solved';
  const primaryValue = maxRating !== null ? formatWhole(maxRating) : formatNumber(solvedSet.size);
  const progress = maxRating !== null ? clampProgress(maxRating, 3000) : clampProgress(solvedSet.size, 1200);

  return {
    key: 'codeforces',
    platform: codingPlatformMeta.codeforces.title,
    handle,
    iconUrl: codingPlatformMeta.codeforces.iconUrl,
    profileUrl: `https://codeforces.com/profile/${handle}`,
    primaryLabel,
    primaryValue,
    progress,
    badges: [
      { label: asTitleCase(profile.rank || profile.maxRank), value: '', tone: 'blue' },
      { label: `${formatNumber(solvedSet.size)} solved`, value: '', tone: 'green' },
      { label: `${formatPlusCount(contestCount)} contests`, value: '', tone: 'slate' },
    ],
  };
}

async function fetchLeetCodeStats(handle: string): Promise<Omit<CodingProfile, 'status'>> {
  const profileData = await fetchJson(`https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(handle)}`);

  const solved = getFirstNumericAtPaths(profileData, ['totalSolved', 'solvedProblem']);
  const easySolved = getFirstNumericAtPaths(profileData, ['easySolved', 'totalSubmissions.1.count']);
  const mediumSolved = getFirstNumericAtPaths(profileData, ['mediumSolved', 'totalSubmissions.2.count']);
  const hardSolved = getFirstNumericAtPaths(profileData, ['hardSolved', 'totalSubmissions.3.count']);

  return {
    key: 'leetcode',
    platform: codingPlatformMeta.leetcode.title,
    handle,
    iconUrl: codingPlatformMeta.leetcode.iconUrl,
    profileUrl: `https://leetcode.com/u/${handle}/`,
    primaryLabel: 'Problems Solved',
    primaryValue: formatPlusCount(solved),
    progress: clampProgress(solved, 3500),
    badges: [
      { label: 'Easy', value: formatWhole(easySolved), tone: 'green' },
      { label: 'Med', value: formatWhole(mediumSolved), tone: 'amber' },
      { label: 'Hard', value: formatWhole(hardSolved), tone: 'red' },
    ],
  };
}

async function fetchCodeChefStats(handle: string): Promise<Omit<CodingProfile, 'status'>> {
  const primaryUrl = `https://competeapi.vercel.app/user/codechef/${encodeURIComponent(handle)}`;
  const fallbackUrl = `https://codechef-api.vercel.app/handle/${encodeURIComponent(handle)}`;

  let data: unknown;
  try {
    data = await fetchJson(primaryUrl);
  } catch {
    try {
      data = await fetchJson(fallbackUrl);
    } catch {
      const proxiedText = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.codechef.com/users/${handle}`)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Request failed (${response.status})`);
          }
          return response.text();
        });

      const currentRatingMatch = proxiedText.match(/\n(\d{3,4})\n\n\(Div\s*[1-5]\)/i);
      const highestRatingMatch = proxiedText.match(/Highest Rating\s*(\d{3,5})/i);
      const solvedMatch = proxiedText.match(/Total Problems Solved:\s*(\d+)/i);
      const globalRankMatch = proxiedText.match(/\*\s*\[\*\*(\d+)\*\*\]\([^\)]*\)\s*Global Rank/i);
      const contestsMatch = proxiedText.match(/No\. of Contests Participated:\s*\*\*(\d+)\*\*/i);

      const currentRating = parseNumericValue(currentRatingMatch?.[1]);
      const highestRating = parseNumericValue(highestRatingMatch?.[1]);
      const solved = parseNumericValue(solvedMatch?.[1]);
      const globalRank = parseNumericValue(globalRankMatch?.[1]);
      const contests = parseNumericValue(contestsMatch?.[1]);

      const effectiveRating = highestRating ?? currentRating;
      const stars =
        effectiveRating === null
          ? null
          : effectiveRating >= 2500
            ? 7
            : effectiveRating >= 2200
              ? 6
              : effectiveRating >= 2000
                ? 5
                : effectiveRating >= 1800
                  ? 4
                  : effectiveRating >= 1600
                    ? 3
                    : effectiveRating >= 1400
                      ? 2
                      : 1;

      return {
        key: 'codechef',
        platform: codingPlatformMeta.codechef.title,
        handle,
        iconUrl: codingPlatformMeta.codechef.iconUrl,
        profileUrl: `https://www.codechef.com/users/${handle}`,
        primaryLabel: effectiveRating !== null ? 'Max Rating' : 'Problems Solved',
        primaryValue: effectiveRating !== null ? formatWhole(effectiveRating) : formatNumber(solved),
        progress: effectiveRating !== null ? clampProgress(effectiveRating, 3000) : clampProgress(solved, 2000),
        badges: [
          { label: `${formatWhole(stars)}★`, value: '', tone: 'orange' },
          { label: `${formatPlusCount(contests)} contests`, value: '', tone: 'slate' },
          { label: `Global ${formatNumber(globalRank)}`, value: '', tone: 'blue' },
          { label: `Solved ${formatNumber(solved)}`, value: '', tone: 'green' },
        ],
      };
    }
  }

  const rank = getFirstNumericAtPaths(data, ['rankings.global', 'globalRank', 'global_rank']);
  const currentRating = getFirstNumericAtPaths(data, ['currentRating', 'rating', 'rating_number']);
  const maxRating = getFirstNumericAtPaths(data, ['highestRating', 'maxRating', 'highest_rating', 'max_rank']) ?? currentRating;
  const stars = getFirstNumericAtPaths(data, ['stars', 'starRating', 'star']);
  const contests = getFirstNumericAtPaths(data, ['allContestCount', 'contestCount', 'contests']);

  const normalizedStars =
    stars !== null
      ? stars
      : maxRating === null
        ? null
        : maxRating >= 2500
          ? 7
          : maxRating >= 2200
            ? 6
            : maxRating >= 2000
              ? 5
              : maxRating >= 1800
                ? 4
                : maxRating >= 1600
                  ? 3
                  : maxRating >= 1400
                    ? 2
                    : 1;

  return {
    key: 'codechef',
    platform: codingPlatformMeta.codechef.title,
    handle,
    iconUrl: codingPlatformMeta.codechef.iconUrl,
    profileUrl: `https://www.codechef.com/users/${handle}`,
    primaryLabel: 'Max Rating',
    primaryValue: formatWhole(maxRating),
    progress: clampProgress(maxRating, 3000),
    badges: [
      { label: `${formatWhole(normalizedStars)}★`, value: '', tone: 'orange' },
      { label: `${formatPlusCount(contests)} contests`, value: '', tone: 'slate' },
      { label: `Global ${formatNumber(rank)}`, value: '', tone: 'blue' },
    ],
  };
}

function createInitialCodingProfiles(): Record<CodingPlatform, CodingProfile> {
  return {
    codeforces: {
      key: 'codeforces',
      platform: codingPlatformMeta.codeforces.title,
      handle: codingHandles.codeforces,
      iconUrl: codingPlatformMeta.codeforces.iconUrl,
      profileUrl: codingHandles.codeforces
        ? `https://codeforces.com/profile/${codingHandles.codeforces}`
        : codingPlatformMeta.codeforces.website,
      primaryLabel: 'Max Rating',
      primaryValue: '--',
      progress: 0,
      badges: [
        { label: '--', value: '', tone: 'blue' },
        { label: '-- contests', value: '', tone: 'slate' },
      ],
      status: codingHandles.codeforces ? 'loading' : 'unconfigured',
    },
    leetcode: {
      key: 'leetcode',
      platform: codingPlatformMeta.leetcode.title,
      handle: codingHandles.leetcode,
      iconUrl: codingPlatformMeta.leetcode.iconUrl,
      profileUrl: codingHandles.leetcode
        ? `https://leetcode.com/u/${codingHandles.leetcode}/`
        : codingPlatformMeta.leetcode.website,
      primaryLabel: 'Problems Solved',
      primaryValue: '--',
      progress: 0,
      badges: [
        { label: 'Easy', value: '--', tone: 'green' },
        { label: 'Med', value: '--', tone: 'amber' },
        { label: 'Hard', value: '--', tone: 'red' },
      ],
      status: codingHandles.leetcode ? 'loading' : 'unconfigured',
    },
    codechef: {
      key: 'codechef',
      platform: codingPlatformMeta.codechef.title,
      handle: codingHandles.codechef,
      iconUrl: codingPlatformMeta.codechef.iconUrl,
      profileUrl: codingHandles.codechef
        ? `https://www.codechef.com/users/${codingHandles.codechef}`
        : codingPlatformMeta.codechef.website,
      primaryLabel: 'Max Rating',
      primaryValue: '--',
      progress: 0,
      badges: [
        { label: '--★', value: '', tone: 'orange' },
        { label: '-- contests', value: '', tone: 'slate' },
      ],
      status: codingHandles.codechef ? 'loading' : 'unconfigured',
    },
  };
}

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefers(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return prefers;
}

function useCompactNavLabels(): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const update = () => setCompact(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return compact;
}

function useScrollVariables(prefersReducedMotion: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector('.site-header');

    const updateScrollVars = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollHeight = root.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollY / scrollHeight : 0;

      root.style.setProperty('--scroll', `${scrollY}px`);
      root.style.setProperty('--progress', progress.toString());

      if (header) {
        header.classList.toggle('compact', scrollY > 20);
      }
    };

    updateScrollVars();

    const handler = prefersReducedMotion
      ? updateScrollVars
      : () => requestAnimationFrame(updateScrollVars);

    window.addEventListener('scroll', handler);
    window.addEventListener('resize', updateScrollVars);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', updateScrollVars);
    };
  }, [prefersReducedMotion]);
}

function useRevealAnimations(prefersReducedMotion: boolean) {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (prefersReducedMotion || revealItems.length === 0) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    let lastScrollY = window.scrollY || window.pageYOffset;
    let initialRevealDone = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const currentScrollY = window.scrollY || window.pageYOffset;
        const scrollingDown = currentScrollY > lastScrollY;

        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.classList.contains('is-visible')) {
            return;
          }

          const target = entry.target as HTMLElement;
          if (scrollingDown || !initialRevealDone) {
            target.classList.add('is-visible');
          } else {
            target.style.transition = 'none';
            target.classList.add('is-visible');
            requestAnimationFrame(() => {
              target.style.transition = '';
            });
          }
        });

        lastScrollY = currentScrollY;
        initialRevealDone = true;
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    revealItems.forEach((item) => {
      const delay = Number(item.dataset.delay || 0);
      if (delay) {
        item.style.transitionDelay = `${delay}ms`;
      }
      observer.observe(item);
    });

    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        item.classList.add('is-visible');
      }
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion]);
}

function useCursorGlow(prefersReducedMotion: boolean) {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    if (prefersReducedMotion) {
      glow.style.display = 'none';
      return;
    }

    let isTouch = false;

    const moveGlow = (x: number, y: number) => {
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isTouch) return;
      glow.classList.remove('touch');
      glow.style.opacity = '0.35';
      moveGlow(event.clientX, event.clientY);
    };

    const handleMouseLeave = () => {
      if (!isTouch) {
        glow.style.opacity = '0';
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      isTouch = true;
      const touch = event.touches[0];
      if (!touch) return;
      glow.classList.add('touch');
      glow.style.opacity = '0.45';
      moveGlow(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      moveGlow(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
      glow.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [prefersReducedMotion]);

  return glowRef;
}

function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const useCompactLabels = useCompactNavLabels();
  const heroRef = useRef<HTMLElement>(null);

  useScrollVariables(prefersReducedMotion);
  useRevealAnimations(prefersReducedMotion);

  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [formValues, setFormValues] = useState<ContactFormValues>(initialContactFormValues);
  const [formTouched, setFormTouched] = useState<Record<keyof ContactFormValues, boolean>>({
    name: false,
    email: false,
    message: false,
  });
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isCodingSyncing, setIsCodingSyncing] = useState(false);
  const [codingProfiles, setCodingProfiles] = useState<Record<CodingPlatform, CodingProfile>>(
    createInitialCodingProfiles
  );
  const latestCodingProfilesRef = useRef<Record<CodingPlatform, CodingProfile>>(createInitialCodingProfiles());

  useEffect(() => {
    latestCodingProfilesRef.current = codingProfiles;
  }, [codingProfiles]);

  const navItemsForDisplay = useMemo(
    () => (useCompactLabels ? navItemsCompact : navItems),
    [useCompactLabels]
  );

  const scrollBehavior: ScrollBehavior = useMemo(
    () => (prefersReducedMotion ? 'auto' : 'smooth'),
    [prefersReducedMotion]
  );

  const handleNavClick = (targetId: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: scrollBehavior });
    }
  };

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace('#', ''));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    let rafId = 0;

    const updateActiveFromScroll = () => {
      const header = document.querySelector('.site-header') as HTMLElement | null;
      const headerHeight = header?.offsetHeight ?? 0;
      const triggerY = headerHeight + window.innerHeight * 0.22;

      let nextActiveIndex = 0;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= triggerY) {
          nextActiveIndex = index;
        }
      });

      setActiveNavIndex((prev) => (prev === nextActiveIndex ? prev : nextActiveIndex));
    };

    const onScrollOrResize = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateActiveFromScroll);
    };

    updateActiveFromScroll();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  useEffect(() => {
    let stopTimer: number | null = null;

    const onScroll = () => {
      setIsUserScrolling(true);
      if (stopTimer) {
        window.clearTimeout(stopTimer);
      }
      stopTimer = window.setTimeout(() => {
        setIsUserScrolling(false);
      }, 180);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (stopTimer) {
        window.clearTimeout(stopTimer);
      }
    };
  }, []);

  const validateField = (field: keyof ContactFormValues, value: string): string => {
    const trimmed = value.trim();

    if (field === 'name') {
      if (trimmed.length < 2) return 'Please enter at least 2 characters.';
      return '';
    }

    if (field === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Please enter a valid email address.';
      return '';
    }

    if (field === 'message') {
      if (trimmed.length < 12) return 'Message should be at least 12 characters.';
      return '';
    }

    return '';
  };

  const validateAllFields = (values: ContactFormValues): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};

    (Object.keys(values) as Array<keyof ContactFormValues>).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) {
        nextErrors[field] = error;
      }
    });

    return nextErrors;
  };

  const handleFieldChange = (field: keyof ContactFormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const nextValue = event.target.value;

    setFormValues((prev) => ({ ...prev, [field]: nextValue }));

    if (formTouched[field] || submitAttempted) {
      const nextError = validateField(field, nextValue);
      setFormErrors((prev) => ({ ...prev, [field]: nextError || undefined }));
    }
  };

  const handleFieldBlur = (field: keyof ContactFormValues) => () => {
    setFormTouched((prev) => ({ ...prev, [field]: true }));
    const nextError = validateField(field, formValues[field]);
    setFormErrors((prev) => ({ ...prev, [field]: nextError || undefined }));
  };

  const handlePillNavSelect = (index: number, href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActiveNavIndex(index);

    const id = href.replace('#', '');
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: scrollBehavior });
    }
  };

  const refreshCodingProfiles = useCallback(async () => {
    setIsCodingSyncing(true);

    const fetchers: Record<CodingPlatform, (handle: string) => Promise<Omit<CodingProfile, 'status'>>> = {
      codeforces: fetchCodeforcesStats,
      leetcode: fetchLeetCodeStats,
      codechef: fetchCodeChefStats,
    };

    const nextProfiles = { ...latestCodingProfilesRef.current };

    try {
      await Promise.all(
        (Object.keys(fetchers) as CodingPlatform[]).map(async (platform) => {
          const handle = codingHandles[platform].trim();
          if (!handle) {
            nextProfiles[platform] = {
              ...nextProfiles[platform],
              status: 'unconfigured',
              error: 'Add your handle in App.tsx to enable live stats.',
            };
            return;
          }

          try {
            const data = await fetchers[platform](handle);
            nextProfiles[platform] = {
              ...data,
              status: 'ready',
              updatedAt: new Date().toISOString(),
            };
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to sync at the moment.';
            nextProfiles[platform] = {
              ...nextProfiles[platform],
              handle,
              status: 'error',
              error: message,
            };
          }
        })
      );

      setCodingProfiles(nextProfiles);
    } finally {
      setIsCodingSyncing(false);
    }
  }, []);

  useEffect(() => {
    void refreshCodingProfiles();

    const interval = window.setInterval(() => {
      void refreshCodingProfiles();
    }, codingRefreshIntervalMs);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refreshCodingProfiles();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [refreshCodingProfiles]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    const nextErrors = validateAllFields(formValues);
    setFormErrors(nextErrors);
    setFormTouched({ name: true, email: true, message: true });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append('name', formValues.name.trim());
    formData.append('email', formValues.email.trim());
    formData.append('message', formValues.message.trim());

    setFormStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/mdkwbgln', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setFormStatus('success');
      setFormValues(initialContactFormValues);
      setFormTouched({ name: false, email: false, message: false });
      setFormErrors({});
      setSubmitAttempted(false);
      setTimeout(() => setFormStatus('idle'), 2500);
    } catch (error) {
      console.error(error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 2500);
    }
  };

  const hasClientValidationErrors = submitAttempted && Object.keys(formErrors).length > 0;

  const statusMeta = useMemo(() => {
    if (hasClientValidationErrors) {
      return { tone: 'error', message: 'Please fix the highlighted fields before sending.' };
    }
    if (formStatus === 'sending') return { tone: 'sending', message: 'Sending...' };
    if (formStatus === 'success') return { tone: 'success', message: 'Message sent successfully.' };
    if (formStatus === 'error') return { tone: 'error', message: 'Message failed. Please try again.' };
    return { tone: 'idle', message: '' };
  }, [formStatus, hasClientValidationErrors]);

  const currentSectionLabel = navItems[activeNavIndex]?.label ?? 'FOCUS AREAS';

  return (
    <>
      <div className="darkveil-layer" aria-hidden="true">
        <Beams
          beamWidth={5}
          beamHeight={21}
          beamNumber={20}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.55}
          scale={0.2}
          rotation={30}
        />
      </div>
      <ClickSpark sparkColor="#8b5cf6" sparkSize={15} sparkRadius={25} sparkCount={8} duration={400}>
      <div className="app-shell">
        <GradualBlur
          target="page"
          position="bottom"
          height="7rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
          className="scroll-bottom-blur"
          style={{
            opacity: isUserScrolling ? 1 : 0,
            transition: 'opacity 220ms ease-out',
          }}
        />
        <div className="corner-circular-text" aria-hidden="true">
          <CircularText
            text="MEGHAMSH*ANIRUDH*PORTFOLIO*"
            onHover="speedUp"
            spinDuration={20}
            className="corner-circular-text-inner"
          />
        </div>
        <div className="scroll-progress" aria-hidden="true">
        <span />
      </div>

      <header className="site-header">
        <PillNav
          logo="/logo-mark.svg"
          logoAlt="Meghamsh Anirudh Logo"
          items={navItemsForDisplay}
          activeHref={navItems[activeNavIndex]?.href}
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
          initialLoadAnimation={false}
          reducedMotion={prefersReducedMotion}
          onItemSelect={handlePillNavSelect}
        />
      </header>

      <div className="section-chip" aria-live="polite">
        <span className="section-chip-label" key={currentSectionLabel}>
          {currentSectionLabel}
        </span>
      </div>

      <div className="section-progress-rail" aria-hidden="true">
        <span className="section-progress-fill" />
        <span className="section-progress-dot" />
      </div>

      <main>
        <section className="hero" id="top" ref={heroRef}>
          <div className="hero-content" data-reveal>
            <p className="eyebrow hero-eyebrow">HI, I&apos;M MEGHAMSH ANIRUDH.</p>
            <div className="hero-headline-wrap" aria-label="Learning by building clean projects.">
              <Text_03 text="LEARNING BY" className="hero-animated-title hero-headline hero-headline-primary" />
              <Text_03 text="BUILDING CLEAN PROJECTS" className="hero-animated-title hero-headline hero-headline-secondary" />
            </div>
            <p className="hero-lead">
              Computer Science undergraduate focused on <em>full-stack development</em>, <em>AI</em>, and <em>problem solving</em>. Built <em>scalable web apps</em> and <em>API-driven systems</em> using React, Node.js, Java, and Python. Strong in <em>OOP</em>, <em>cloud computing</em>, and <em>machine learning fundamentals</em> with internship experience in software development and AI/ML. Always exploring modern tech to build practical projects with real-world impact.
            </p>
            <div className="hero-cta">
              <StarBorder
                as="a"
                href="#projects"
                onClick={handleNavClick('projects')}
                className="hero-star-btn hero-star-btn--primary"
                color="#c084fc"
                speed="5s"
              >
                View Projects
              </StarBorder>
              <StarBorder
                as="a"
                href="#contact"
                onClick={handleNavClick('contact')}
                className="hero-star-btn hero-star-btn--ghost"
                color="#8b5cf6"
                speed="5s"
              >
                Let&apos;s Talk
              </StarBorder>
            </div>
            <div className="hero-stats">
              <div>
                <span className="stat-value shiny-text">2+</span>
                <span className="stat-label">Years Learning</span>
              </div>
              <div>
                <span className="stat-value shiny-text">5+</span>
                <span className="stat-label">Projects Built</span>
              </div>
              <div>
                <span className="stat-value shiny-text">Intermediate</span>
                <span className="stat-label">Always Improving</span>
              </div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <GlareHover
              width="100%"
              height="100%"
              glareColor="#ffffff"
              glareOpacity={0.22}
              glareAngle={-30}
              glareSize={320}
              transitionDuration={900}
              className="visual-card top"
              data-reveal
              data-delay="150"
            >
              <p className="visual-title">Learning Basics</p>
              <p className="visual-desc">Core programming, logic, and data structures.</p>
            </GlareHover>
            <GlareHover
              width="100%"
              height="100%"
              glareColor="#ffffff"
              glareOpacity={0.22}
              glareAngle={-30}
              glareSize={320}
              transitionDuration={900}
              className="visual-card mid"
              data-reveal
              data-delay="300"
            >
              <p className="visual-title">FullStack Practice</p>
              <p className="visual-desc">Clean layouts, simple interactions, and UI polish.</p>
            </GlareHover>
            <GlareHover
              width="100%"
              height="100%"
              glareColor="#ffffff"
              glareOpacity={0.22}
              glareAngle={-30}
              glareSize={320}
              transitionDuration={900}
              className="visual-card bottom"
              data-reveal
              data-delay="450"
            >
              <p className="visual-title">Project Mindset</p>
              <p className="visual-desc">Build, review, learn, and repeat.</p>
            </GlareHover>
          </div>
        </section>

        <section className="feature-rail" id="work">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap section-title-pressure" aria-label="Focus Areas">
              <Text_03 text="FOCUS AREAS" className="section-animated-title" />
            </div>
            <p className="section-subtitle">What I&apos;m practicing right now.</p>
          </div>
          <div className="feature-grid">
            {featureCards.map((card, index) => (
              <GlareHover
                key={card.title}
                width="100%"
                height="100%"
                glareColor="#ffffff"
                glareOpacity={0.2}
                glareAngle={-28}
                glareSize={300}
                transitionDuration={850}
                className="feature-card"
                data-reveal
                data-delay={(index + 1) * 100}
              >
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </GlareHover>
            ))}
          </div>
        </section>

        <section className="process" id="process">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap section-title-pressure" aria-label="Workflow">
              <Text_03 text="WORKFLOW" className="section-animated-title" />
            </div>
            <p className="section-subtitle">Simple steps I follow while learning.</p>
          </div>
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <GlareHover
                key={step.title}
                width="100%"
                height="100%"
                glareColor="#ffffff"
                glareOpacity={0.2}
                glareAngle={-28}
                glareSize={300}
                transitionDuration={850}
                className="process-step"
                data-reveal
                data-delay={index * 150}
              >
                <span className="step-number">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </GlareHover>
            ))}
          </div>
        </section>

        <section className="skills-section" id="skills">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap section-title-pressure" aria-label="Skills">
              <Text_03 text="SKILLS" className="section-animated-title" />
            </div>
            <p className="section-subtitle">The weapons I wield to build, ship, and solve.</p>
          </div>

          {skillGroups.map((group, groupIndex) => (
            <div className="skills-group" key={group.title}>
              <h3 className="skills-group-title" data-reveal data-delay={groupIndex * 120}>
                {group.title}
              </h3>
              <div className="skills-grid">
                {group.items.map((item, itemIndex) => (
                  <article
                    className="skill-card"
                    key={item.name}
                    data-reveal
                    data-delay={groupIndex * 120 + 90 + itemIndex * 40}
                  >
                    <img src={item.logo} alt={item.name} loading="lazy" width={28} height={28} />
                    <span>{item.name}</span>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="coding-section" id="coding">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap section-title-pressure" aria-label="Coding Profiles">
              <Text_03 text="CODING PROFILES" className="section-animated-title" />
            </div>
            <p className="section-subtitle">Live ranks and solved counts synced from my competitive coding profiles.</p>
            <div className="coding-header-actions">
              <button
                type="button"
                className="coding-sync-btn"
                onClick={() => void refreshCodingProfiles()}
                disabled={isCodingSyncing}
              >
                {isCodingSyncing ? 'Syncing...' : 'SYNC'}
              </button>
            </div>
          </div>

          <div className="coding-grid">
            {codingPlatformsDisplay.map((platformKey, index) => {
              const profile = codingProfiles[platformKey];
              const statusLabel =
                profile.status === 'ready'
                  ? 'Live'
                  : profile.status === 'loading'
                    ? 'Syncing'
                    : profile.status === 'error'
                      ? 'Error'
                      : 'Setup';

              return (
                <BorderGlow
                  key={platformKey}
                  className={`coding-glow platform-${profile.key}`}
                  edgeSensitivity={15}
                  glowColor="40 80 80"
                  backgroundColor="#120F17"
                  borderRadius={24}
                  glowRadius={36}
                  glowIntensity={1}
                  coneSpread={25}
                  animated={false}
                  colors={['#c084fc', '#f472b6', '#38bdf8']}
                >
                  <article className="coding-card" data-reveal data-delay={index * 120}>
                    <div className="coding-card-head">
                      <div className="coding-id-block">
                        <img src={profile.iconUrl} alt={`${profile.platform} logo`} className="coding-platform-logo" width={36} height={36} />
                        <div>
                          <p className="coding-platform">{profile.platform}</p>
                          <p className="coding-handle">{profile.handle ? `@${profile.handle}` : 'Handle not configured'}</p>
                        </div>
                      </div>
                      <a
                        href={profile.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="coding-open-link"
                        aria-label={`Open ${profile.platform} profile`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 16L16 8M10 8H16V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </div>

                    <div className="coding-primary-row">
                      <span>{profile.primaryLabel}</span>
                      <strong>{profile.primaryValue}</strong>
                    </div>

                    <div className="coding-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(profile.progress * 100)}>
                      <span className="coding-progress-fill" style={{ width: `${Math.max(8, Math.round(profile.progress * 100))}%` }} />
                    </div>

                    <div className="coding-badges">
                      {profile.badges.map((badge, badgeIndex) => (
                        <span className={`coding-badge tone-${badge.tone}`} key={`${badge.label}-${badgeIndex}`}>
                          {badge.value ? (
                            <>
                              <strong>{badge.label}</strong>
                              <em>{badge.value}</em>
                            </>
                          ) : (
                            <strong>{badge.label}</strong>
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="coding-meta-row">
                      <span className={`coding-status is-${profile.status}`}>{statusLabel}</span>
                      <span className="coding-sync-time">
                        {profile.updatedAt ? `Synced ${new Date(profile.updatedAt).toLocaleTimeString()}` : 'Waiting for first sync'}
                      </span>
                    </div>

                    {profile.error && <p className="coding-error">{profile.error}</p>}
                  </article>
                </BorderGlow>
              );
            })}
          </div>
        </section>

        <section className="certifications-section" id="certifications">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap section-title-pressure" aria-label="Certifications">
              <Text_03 text="CERTIFICATIONS" className="section-animated-title" />
            </div>
            <p className="section-subtitle">Verified credentials</p>
          </div>

          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <BorderGlow
                key={cert.title}
                className="cert-glow"
                edgeSensitivity={15}
                glowColor="40 80 80"
                backgroundColor="#120F17"
                borderRadius={24}
                glowRadius={36}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
              >
                <article className="cert-card" data-reveal data-delay={index * 120}>
                  <div className="cert-card-head">
                    <div className="cert-id">
                      <img src={cert.logo} alt={`${cert.issuer} logo`} width={36} height={36} loading="lazy" />
                      <div>
                        <p className="cert-title">{cert.title}</p>
                        <p className="cert-issuer">{cert.issuer}</p>
                      </div>
                    </div>
                    <a
                      className="cert-verify-link"
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Verify ${cert.title}`}
                    >
                      Show credential
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>

                  <div className="cert-meta">
                    <div>
                      <span className="cert-meta-label">Issued</span>
                      <strong>{cert.issued}</strong>
                    </div>
                    <div>
                      <span className="cert-meta-label">Expires</span>
                      <strong>{cert.expires ?? 'Dec 2027'}</strong>
                    </div>
                    {cert.credentialId && (
                      <div>
                        <span className="cert-meta-label">Credential ID</span>
                        <strong>{cert.credentialId}</strong>
                      </div>
                    )}
                  </div>

                  <div className="cert-skills">
                    {cert.skills.map((skill) => (
                      <span className="cert-skill" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              </BorderGlow>
            ))}
          </div>
        </section>

        <section className="projects" id="projects">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap section-title-pressure" aria-label="Projects">
              <Text_03 text="PROJECTS" className="section-animated-title" />
            </div>
            <p className="section-subtitle">Small builds that helped me learn.</p>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={project.title} className="tilted-project-wrap" data-reveal data-delay={index * 100}>
                <TiltedCard
                  imageSrc={transparentPixel}
                  altText={project.title}
                  captionText={project.title}
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  rotateAmplitude={16}
                  scaleOnHover={1.06}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent
                  overlayContent={
                    <article className="project-card tilted-project-content">
                      <div className="project-meta">
                        {project.tags.map((tag) => (
                          <span className="project-tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <a className="project-link" href={project.link} target="_blank" rel="noopener noreferrer">
                        {project.label}
                      </a>
                    </article>
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap section-title-pressure" aria-label="Contact">
              <Text_03 text="CONTACT" className="section-animated-title" />
            </div>
            <p className="section-subtitle">Let&apos;s build something clean together.</p>
          </div>
          <div className="contact-grid">
            <div className="contact-card" data-reveal>
              <p className="contact-kicker">Available for internships and collaborations</p>
              <p className="contact-lead">Let&apos;s turn your idea into a clean and reliable build.</p>
              <div className="contact-cta-row">
                <a className="btn primary" href="mailto:anirudhbittu77@gmail.com">
                  Email Me
                </a>
                <a className="btn ghost" href="/ANIRUDH'S%20RESUME.pdf" download>
                  Download Resume
                </a>
              </div>
              <p className="contact-trust-line">I usually reply within 24 hours. Open to On-site & Hybrid opportunities.</p>
              <div className="contact-links">
                <a href="mailto:anirudhbittu77@gmail.com">anirudhbittu77@gmail.com</a>
                <a href="tel:+918639206379">+91 8639206379</a>
                <a href="https://github.com/Noyoucringe" target="_blank" rel="noopener noreferrer">
                  GitHub Profile
                </a>
                <a
                  href="https://www.linkedin.com/in/meghamsh-anirudh-pulivendala-02b371276/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn Profile
                </a>
              </div>
            </div>
            <form className="contact-form" data-reveal data-delay={150} onSubmit={handleFormSubmit} noValidate>
              <div className={`form-row ${formErrors.name ? 'has-error' : formTouched.name && formValues.name.trim() ? 'has-success' : ''}`}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formValues.name}
                  onChange={handleFieldChange('name')}
                  onBlur={handleFieldBlur('name')}
                  aria-invalid={Boolean(formErrors.name)}
                  aria-describedby={formErrors.name ? 'name-error' : undefined}
                  required
                />
                {formErrors.name && (
                  <span className="form-error" id="name-error">
                    {formErrors.name}
                  </span>
                )}
              </div>
              <div className={`form-row ${formErrors.email ? 'has-error' : formTouched.email && formValues.email.trim() ? 'has-success' : ''}`}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formValues.email}
                  onChange={handleFieldChange('email')}
                  onBlur={handleFieldBlur('email')}
                  aria-invalid={Boolean(formErrors.email)}
                  aria-describedby={formErrors.email ? 'email-error' : undefined}
                  required
                />
                {formErrors.email && (
                  <span className="form-error" id="email-error">
                    {formErrors.email}
                  </span>
                )}
              </div>
              <div className={`form-row ${formErrors.message ? 'has-error' : formTouched.message && formValues.message.trim() ? 'has-success' : ''}`}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project"
                  rows={5}
                  value={formValues.message}
                  onChange={handleFieldChange('message')}
                  onBlur={handleFieldBlur('message')}
                  aria-invalid={Boolean(formErrors.message)}
                  aria-describedby={formErrors.message ? 'message-error' : undefined}
                  required
                />
                {formErrors.message && (
                  <span className="form-error" id="message-error">
                    {formErrors.message}
                  </span>
                )}
              </div>
              <button type="submit" className="btn primary" disabled={formStatus === 'sending'}>
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              <div className={`form-status ${statusMeta.tone !== 'idle' ? `is-${statusMeta.tone}` : ''}`}>
                {statusMeta.tone === 'success' && (
                  <span className="status-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12.5L10 17L19 8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                {statusMeta.message}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-title">ANIRUDH'S PORTFOLIO</div>
          <div className="footer-socials">
            <a
              href="https://www.linkedin.com/in/meghamsh-anirudh-pulivendala-02b371276/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="footer-social"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.3V9h3.4v1.56h.05c.47-.9 1.62-1.85 3.34-1.85 3.58 0 4.24 2.36 4.24 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"
                />
              </svg>
            </a>
            <a
              href="https://github.com/Noyoucringe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="footer-social"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.6 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.49-1.1-1.49-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05.8-.23 1.65-.34 2.5-.34s1.7.12 2.5.34c1.9-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.6 17.52 2 12 2z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-bottom">
          <div className="footer-copy">
            <p>© 2026 Meghamsh Anirudh</p>
            <span>All rights reserved</span>
          </div>
          <div className="footer-links">
            <a href="#projects" onClick={handleNavClick('projects')}>Projects</a>
            <a href="#work" onClick={handleNavClick('work')}>Focus Areas</a>
            <a href="#contact" onClick={handleNavClick('contact')}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
    </ClickSpark>
    </>
  );
}

export default App;
