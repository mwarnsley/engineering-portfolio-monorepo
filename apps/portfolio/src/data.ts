export const YEARS_OF_EXPERIENCE_LABEL = '10+ years';

export interface StackCapability {
  /** Display name of the capability. */
  name: string;
  /** Short grouping label rendered as a badge above the name. */
  category: string;
}

export const coreStack: StackCapability[] = [
  { name: 'React 19 / Next.js App Router', category: 'Frontend' },
  { name: 'TypeScript / JavaScript ES6+', category: 'Language' },
  { name: 'React Native', category: 'Mobile' },
  { name: 'GraphQL / Apollo Client / REST', category: 'API & Data' },
  { name: 'Redux / Context API', category: 'State' },
  { name: 'Node.js / Express / WebSockets', category: 'Backend' },
  { name: 'DynamoDB / NoSQL', category: 'Data' },
  { name: 'Contentful CMA / CDA', category: 'Content' },
  { name: 'JWT / OAuth / SSO', category: 'Authentication' },
  { name: 'GA4 / GTM / Snowplow / Adobe Analytics', category: 'Analytics' },
  { name: 'Statsig / Optimizely / LaunchDarkly', category: 'Experimentation' },
  { name: 'Jest / RTL / Vitest / Playwright / Cypress', category: 'Testing' },
  { name: 'WCAG AAA / Section 508 / USWDS / Axe-core', category: 'Accessibility' },
  { name: 'Atomic Design / Tailwind CSS v4 / CSS Modules', category: 'UI Systems' },
  { name: 'Vite / Turborepo / pnpm / GitHub Actions', category: 'Delivery' },
  { name: 'AWS / Docker / Nginx / Vercel', category: 'Cloud' },
  { name: 'D3.js / Chart.js / Recharts / Vis.js / Mapbox', category: 'Visualization' },
  { name: 'Core Web Vitals / Lighthouse / Sentry', category: 'Performance' },
];

export const profile = {
  title: 'Senior Frontend Engineer',
  location: 'Greenwood, IN',
  email: 'marcus.warnsley@gmail.com',
  phone: '260-403-0877',
  summary: `Performance-focused Senior Frontend Engineer with ${YEARS_OF_EXPERIENCE_LABEL} of software engineering experience building scalable, accessible React, React Native, and Node.js platforms. Specializing in modular design systems, real-time streaming, and WCAG AAA / Section 508 accessibility standards.`,
  focusAreas: [
    'Accessible Design Systems',
    'Real-Time Streaming',
    'React / React Native',
    'Performance Optimization',
  ],
  education: {
    degree: 'Bachelor of Science in Business Information Systems',
    institution: 'Indiana Wesleyan University',
    details: '2015 · Marion, IN · GPA: 3.7/4.0',
  },
};

export interface ExperienceEntry {
  /** Employer name. */
  company: string;
  /** Job title held at the company. */
  role: string;
  /** Human-readable date range. */
  dates: string;
  /** Work arrangement or location, when known. */
  location: string | null;
  /** One-sentence summary of the work. */
  summary: string;
  /** Notable technologies and outcomes rendered as chips. */
  highlights: string[];
  /** Whether this is a current position. */
  isCurrent: boolean;
}

export const careerExperience: ExperienceEntry[] = [
  {
    company: 'Understood.org',
    role: 'Senior Frontend Engineer (Contractor)',
    dates: 'August 2026 – Present',
    location: 'New York, NY (Remote)',
    isCurrent: true,
    summary:
      'Building reusable, accessible components for a Next.js 16 and React 19 platform serving millions of families, educators, and professionals, with CMS-driven content, event tracking, and controlled experimentation.',
    highlights: [
      'Next.js 16 (Turbopack)',
      'React 19',
      'Tailwind CSS v4 / CSS Modules',
      'USWDS / WCAG AAA / Section 508',
      'Snowplow / Sentry / Vercel Analytics',
      'Apollo Client / Contentful migrations',
      'Statsig feature flagging',
      'Jest',
      'Playwright + axe-core',
    ],
  },
  {
    company: 'MilliporeSigma',
    role: 'Senior Frontend Engineer',
    dates: 'October 2023 – June 2026',
    location: 'St. Louis, MO (Remote)',
    isCurrent: false,
    summary:
      'Architected mobile-first React and Next.js interfaces for an enterprise catalog of 300k+ products, including secure authentication, a streaming AI chatbot, and data-driven experimentation. Reduced initial bundle sizes by 20% and scaled test coverage to 85%+.',
    highlights: [
      'GraphQL / REST',
      'JWT / OAuth',
      'WebSockets',
      'LaunchDarkly / Optimizely',
      'Google / Adobe Analytics',
      'Jest / RTL / Cypress',
      'Code splitting / Core Web Vitals',
    ],
  },
  {
    company: 'Uptycs (Native Security)',
    role: 'Senior UI Engineer',
    dates: 'November 2020 – October 2023',
    location: 'Waltham, MA (Remote)',
    isCurrent: false,
    summary:
      'Scaled an enterprise security SaaS platform handling 10k+ concurrent real-time events, built a reusable atomic design system, and optimized analytical dashboards for large streaming datasets.',
    highlights: [
      'React / TypeScript',
      'Atomic Design',
      'D3.js / Chart.js / Recharts',
      'Node.js / Express',
      'Jest / RTL',
    ],
  },
  {
    company: 'Ally Bank',
    role: 'Senior UI Engineer (Contractor)',
    dates: 'August 2020 – November 2020',
    location: 'Detroit, MI (Remote)',
    isCurrent: false,
    summary:
      'Modernized four transactional domains from Ember.js to React with zero customer downtime, improving rendering performance and delivering accessible, mobile-first banking interfaces.',
    highlights: ['Ember.js → React', 'Tailwind CSS', 'WCAG accessibility', 'Jest'],
  },
  {
    company: 'DataStax',
    role: 'Senior Fullstack Engineer',
    dates: 'September 2018 – August 2020',
    location: 'Santa Clara, CA (Remote)',
    isCurrent: false,
    summary:
      'Built React and Redux management consoles for distributed data platforms, including interactive node-and-edge visualizations and real-time analytical tables backed by GraphQL and Node.js services.',
    highlights: [
      'React / Redux',
      'Vis.js',
      'Tailwind CSS',
      'GraphQL / Node.js / Express',
      'Jest / RTL',
    ],
  },
  {
    company: 'Vibenomics',
    role: 'Lead Front End Software Engineer',
    dates: 'October 2017 – September 2018',
    location: 'Fishers, IN (Remote)',
    isCurrent: false,
    summary:
      'Led greenfield frontend architecture for a real-time media scheduling platform, establishing engineering standards, modular state management, and deployment pipelines across a containerized AWS serverless ecosystem.',
    highlights: [
      'Docker / Nginx',
      'Node.js',
      'DynamoDB / S3 / CloudFront',
      'Lambda / API Gateway',
      'Jest',
    ],
  },
  {
    company: 'DirectEmployers Association',
    role: 'Frontend Software Developer',
    dates: 'September 2016 – October 2017',
    location: 'Indianapolis, IN',
    isCurrent: false,
    summary:
      'Led frontend development for a compliance and reporting analytics portal using React and Redux, with interactive D3.js and Chart.js visualizations and automated tests in peer-reviewed Git workflows.',
    highlights: ['React / Redux', 'D3.js / Chart.js', 'Automated testing'],
  },
  {
    company: 'Ion Three Consulting · Navient · Simon Property Group',
    role: 'Previous Frontend Roles',
    dates: 'March 2014 – September 2016',
    location: 'Indiana',
    isCurrent: false,
    summary:
      'Developed responsive layouts, enterprise web architectures, and interactive JavaScript interfaces with a focus on accessibility, rendering performance, and automated unit testing.',
    highlights: [],
  },
];
