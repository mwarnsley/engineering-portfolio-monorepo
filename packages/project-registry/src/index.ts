export type ProjectPreviewMode = 'iframe';

export interface ProjectRecord {
  slug: string;
  title: string;
  description: string;
  framework: string;
  category: string;
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
