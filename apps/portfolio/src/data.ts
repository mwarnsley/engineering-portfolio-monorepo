export const YEARS_OF_EXPERIENCE_LABEL = '10+ years';

export interface StackCapability {
  /** Display name of the capability. */
  name: string;
  /** Short grouping label rendered as a badge above the name. */
  category: string;
}

export const coreStack: StackCapability[] = [
  { name: 'React / Next.js', category: 'Frontend' },
  { name: 'TypeScript / ES6+', category: 'Language' },
  { name: 'React Native', category: 'Mobile' },
  { name: 'GraphQL / REST', category: 'API & Data' },
  { name: 'Redux / State Management', category: 'Architecture' },
  { name: 'Jest / RTL / Cypress', category: 'Quality' },
  { name: 'System Design', category: 'Architecture' },
  { name: 'Design Systems & Theming', category: 'UI Systems' },
  { name: 'Performance Optimization', category: 'Performance' },
  { name: 'Node / Express', category: 'Backend' },
  { name: 'MongoDB / Data Modeling', category: 'Data' },
  { name: 'Debugging & Root-Cause Analysis', category: 'Engineering' },
];

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
    location: 'Remote',
    summary:
      'Building accessible, high-performance experiences on Next.js 16 and React 19 with Tailwind CSS v4 design tokens, CMS-driven content, analytics instrumentation, and feature-flagged releases held to WCAG AAA / Section 508 standards.',
    highlights: [
      'Next.js 16 (Turbopack)',
      'React 19',
      'Tailwind CSS v4 design tokens',
      'CSS Modules',
      'Snowplow event tracking',
      'GraphQL / Contentful CMA',
      'Statsig feature flagging',
      'WCAG AAA / Section 508',
      'Playwright + axe-core',
    ],
    isCurrent: true,
  },
  {
    company: 'MilliporeSigma',
    role: 'Senior Front End Engineer',
    dates: 'October 2023 – June 2026',
    location: null,
    summary:
      'Architected high-performance customer interfaces and GraphQL data layers for global e‑commerce systems.',
    highlights: [],
    isCurrent: false,
  },
  {
    company: 'Uptycs',
    role: 'Senior UI Engineer',
    dates: '2020 – 2023',
    location: null,
    summary:
      'Engineered complex security-focused application workflows across web and mobile using React and React Native.',
    highlights: [],
    isCurrent: false,
  },
  {
    company: 'Ally Bank',
    role: 'Senior Front End Engineer',
    dates: 'July 2020 – October 2020',
    location: null,
    summary:
      'Modernized large-scale financial platforms from Ember.js to React, preserving stability and performance.',
    highlights: [],
    isCurrent: false,
  },
  {
    company: 'DataStax',
    role: 'Senior Fullstack Engineer',
    dates: '2018 – 2020',
    location: null,
    summary:
      'Built interactive network visualizations and cloud management interfaces for distributed database systems.',
    highlights: [],
    isCurrent: false,
  },
  {
    company: 'Vibenomics',
    role: 'Senior Fullstack Engineer',
    dates: '2017 – 2018',
    location: null,
    summary:
      'Architected and developed a React/Redux SaaS interface. Translated static designs into production-ready components and integrated with AWS/Firebase.',
    highlights: [],
    isCurrent: false,
  },
  {
    company: 'DirectEmployers Association',
    role: 'Front End Software Developer',
    dates: 'September 2016 – October 2017',
    location: null,
    summary:
      'Architected high-scale Analytics SPAs with React/Redux and orchestrated a complete .jobs domain UI overhaul.',
    highlights: [],
    isCurrent: false,
  },
  {
    company: 'Ion Three',
    role: 'Frontend Developer',
    dates: 'May 2016 – September 2016',
    location: null,
    summary:
      'Engineered custom JS widgets and orchestrated AWS cloud deployments for high-velocity agency digital products.',
    highlights: [],
    isCurrent: false,
  },
  {
    company: 'Navient',
    role: 'Frontend Developer',
    dates: 'March 2016 – May 2016',
    location: null,
    summary:
      'Optimized accessibility and responsive UI components for massive enterprise platforms in the ASP.NET ecosystem.',
    highlights: [],
    isCurrent: false,
  },
  {
    company: 'Simon Property Group',
    role: 'Frontend Developer',
    dates: 'March 2014 – March 2016',
    location: null,
    summary:
      'Scaled dynamic digital experiences across 150+ property platforms and spearheaded the Simon Careers interface.',
    highlights: [],
    isCurrent: false,
  },
];
