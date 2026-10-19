import { testMatrix } from './generated-test-matrix';
export { testMatrixRun } from './generated-test-matrix';

export type ProjectPreviewMode = 'iframe';
export type ProjectTier = 'flagship' | 'sandbox';

export interface ProjectTestSuite {
  framework: 'Vitest' | 'Jest' | 'Playwright';
  testCount: number;
  coverage: { statements: number; branches: number; functions: number; lines: number };
  suites: { name: string; file: string; type: 'unit' | 'integration' | 'e2e' | 'a11y' }[];
  recentRunDate: string;
  /** Counts and runner status prevent skipped tests or execution errors appearing as passes. */
  passedCount: number;
  failedCount: number;
  skippedCount: number;
  status: 'passed' | 'failed';
  coverageScope: string[];
}

export interface ProjectRecord {
  slug: string;
  title: string;
  description: string;
  framework: string;
  category: string;
  tier: ProjectTier;
  testSuite?: ProjectTestSuite;
  architectureHighlights?: string[];
  challengesSolved?: string[];
  tags: string[];
  appPath: string;
  previewMode: ProjectPreviewMode;
  localDevUrl: string;
  productionUrl: string | null;
  hasBackend: boolean;
  runtimeRequirements: string[];
  featured: boolean;
  sourcePath: string;
  sourceUrl: string;
}

export const projects: ProjectRecord[] = [
  {
    slug: 'react-mash',
    tier: 'sandbox',
    title: 'React MASH',
    description: 'A modern React remake of the classic MASH game using Redux Toolkit.',
    framework: 'React 19 + Vite',
    category: 'React',
    tags: ['React', 'TypeScript', 'Redux Toolkit', 'Vite'],
    appPath: 'apps/react-mash',
    previewMode: 'iframe',
    localDevUrl: 'http://localhost:3002',
    productionUrl: 'https://react-mash.vercel.app',
    hasBackend: false,
    runtimeRequirements: ['Static client bundle with no backend services'],
    featured: true,
    sourcePath: 'apps/react-mash',
    sourceUrl: 'https://github.com/mwarnsley/React-MASH',
  },
  {
    slug: 'meeting-application',
    testSuite: testMatrix['meeting-application'],
    tier: 'flagship',
    architectureHighlights: [
      'Next.js 16 App Router with server-rendered views and API routes.',
      'Mongoose connection and in-flight promise reuse for MongoDB connection pooling.',
      'Meeting-scoped discussion state reconciled with persisted API responses.',
    ],
    challengesSolved: [
      'Reuse database connections across requests and development reloads.',
      'Keep selected discussions synchronized after comments are saved or meetings refresh.',
    ],
    title: 'Meeting Application',
    description:
      'A Next.js meeting management app with scheduling, discussion, and MongoDB-backed workflows.',
    framework: 'Next.js 16',
    category: 'Full Stack',
    tags: ['Next.js', 'React', 'MongoDB', 'Mantine'],
    appPath: 'apps/meeting-application',
    previewMode: 'iframe',
    localDevUrl: 'http://localhost:8000',
    productionUrl: 'https://meeting-application-five.vercel.app',
    hasBackend: true,
    runtimeRequirements: [
      'Next.js server runtime (App Router API routes)',
      'MongoDB connection via Mongoose (MONGODB_URI)',
    ],
    featured: true,
    sourcePath: 'apps/meeting-application',
    sourceUrl: 'https://github.com/mwarnsley/Meeting-Application',
  },
  {
    slug: 'restaurant-finder',
    testSuite: testMatrix['restaurant-finder'],
    tier: 'sandbox',
    title: 'Restaurant Finder',
    description:
      'A React + Express restaurant search app that proxies Geoapify requests through a local server.',
    framework: 'React 19 + Vite + Express',
    category: 'Full Stack',
    tags: ['React', 'Vite', 'Express', 'Geoapify'],
    appPath: 'apps/restaurant-finder',
    previewMode: 'iframe',
    localDevUrl: 'http://localhost:3004',
    productionUrl: 'https://restaurant-finder-rouge.vercel.app',
    hasBackend: true,
    runtimeRequirements: [
      'Express API proxy server (port 3005 locally)',
      'Geoapify API key (GEOAPIFY_API_KEY)',
    ],
    featured: true,
    sourcePath: 'apps/restaurant-finder',
    sourceUrl: 'https://github.com/mwarnsley/RestaurantFinder',
  },
  {
    slug: 'stock-trader',
    testSuite: testMatrix['stock-trader'],
    tier: 'flagship',
    architectureHighlights: [
      'Vue 3 with separate Pinia market, portfolio, and transaction stores.',
      'Finnhub market feeds with simulated fallback pricing.',
      'Trade simulation engine with reactive valuations and local persistence.',
    ],
    challengesSolved: [
      'Coordinate cash, holdings, cost basis, and transaction history after trades.',
      'Keep the dashboard usable when live market data is unavailable.',
    ],
    title: 'Stock Trader',
    description:
      'A Vue stock dashboard with Finnhub market data, charting, and portfolio simulation flows.',
    framework: 'Vue 3 + Vite',
    category: 'Vue',
    tags: ['Vue', 'TypeScript', 'Pinia', 'Finnhub'],
    appPath: 'apps/stock-trader',
    previewMode: 'iframe',
    localDevUrl: 'http://localhost:3006',
    productionUrl: 'https://stock-trader-rouge.vercel.app',
    hasBackend: false,
    runtimeRequirements: ['Finnhub market data API key (VITE_FINNHUB_API_KEY)'],
    featured: true,
    sourcePath: 'apps/stock-trader',
    sourceUrl: 'https://github.com/mwarnsley/Stock-Trader',
  },
  {
    slug: 'gamespot',
    tier: 'sandbox',
    title: 'Gamespot',
    description: 'A Vue game discovery app powered by the RAWG API with local favorites support.',
    framework: 'Vue 3 + Vite',
    category: 'Vue',
    tags: ['Vue', 'TypeScript', 'Pinia', 'RAWG'],
    appPath: 'apps/gamespot',
    previewMode: 'iframe',
    localDevUrl: 'http://localhost:3007',
    productionUrl: 'https://gamespot-flame.vercel.app',
    hasBackend: false,
    runtimeRequirements: ['RAWG game database API key (VITE_RAWG_API_KEY)'],
    featured: true,
    sourcePath: 'apps/gamespot',
    sourceUrl: 'https://github.com/mwarnsley/gamespot',
  },
  {
    slug: 'movies',
    tier: 'sandbox',
    title: 'Movies',
    description: 'A Vue movie discovery app built around TMDB search, listings, and detail pages.',
    framework: 'Vue 3 + Vite',
    category: 'Vue',
    tags: ['Vue', 'Vite', 'TMDB', 'Vue Router'],
    appPath: 'apps/movies',
    previewMode: 'iframe',
    localDevUrl: 'http://localhost:3008',
    productionUrl: 'https://movies-wine-nine.vercel.app',
    hasBackend: false,
    runtimeRequirements: ['TMDB API key (VITE_TMDB_API_KEY)'],
    featured: true,
    sourcePath: 'apps/movies',
    sourceUrl: 'https://github.com/mwarnsley/movies',
  },
  {
    slug: 'chat-application',
    testSuite: testMatrix['chat-application'],
    tier: 'flagship',
    architectureHighlights: [
      'Real-time state distributed between React clients through a Socket.IO gateway.',
      'Express HTTP server with dedicated Socket.IO event registration.',
      'TypeScript payload contracts for message, typing, and reset events.',
    ],
    challengesSolved: [
      'Broadcast messages and typing updates to connected clients.',
      'Normalize message bodies and assign server-side IDs and timestamps before broadcast.',
    ],
    title: 'Chat Application',
    description:
      'A real-time chat simulator with a React client and Socket.IO/Express server kept together in one app.',
    framework: 'React + Vite + Socket.IO',
    category: 'Full Stack',
    tags: ['React', 'Socket.IO', 'Express', 'TypeScript'],
    appPath: 'apps/chat-application',
    previewMode: 'iframe',
    localDevUrl: 'http://localhost:3009',
    productionUrl: 'https://chat-application-iota-drab.vercel.app',
    hasBackend: true,
    runtimeRequirements: ['Express + Socket.IO server', 'Persistent WebSocket connection'],
    featured: true,
    sourcePath: 'apps/chat-application',
    sourceUrl: 'https://github.com/mwarnsley/Chat-Application',
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

const projectsBySlug = new Map(projects.map((project) => [project.slug, project]));

/**
 * Looks up a project by its slug in O(1) time.
 * @param {string} slug - The registry slug, e.g. `"react-mash"`.
 * @returns {ProjectRecord | undefined} The matching record, or `undefined` when no project uses the slug.
 * @example
 * getProjectBySlug('movies')?.title; // returns "Movies"
 */
export function getProjectBySlug(slug: string): ProjectRecord | undefined {
  return projectsBySlug.get(slug);
}
