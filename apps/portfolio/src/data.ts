import {
  Code2,
  Zap,
  Globe,
  Database,
  Layers,
  Shield,
  Workflow,
  Palette,
  Gauge,
  Server,
  Bug,
} from 'lucide-react';

export const technicalArsenal = [
  { name: 'React / Next.js', level: 92, icon: Code2, category: 'Frontend' },
  { name: 'TypeScript / ES6+', level: 90, icon: Zap, category: 'Language' },
  { name: 'React Native', level: 85, icon: Globe, category: 'Mobile' },
  { name: 'GraphQL / REST', level: 88, icon: Database, category: 'API/Data' },
  { name: 'Redux / State', level: 88, icon: Layers, category: 'Architecture' },
  { name: 'TESTING & QA (JEST / RTL / CYPRESS)', level: 80, icon: Shield, category: 'Quality' },
  { name: 'SYSTEM DESIGN / ARCHITECTURE', level: 89, icon: Workflow, category: 'ARCHITECTURE' },
  { name: 'DESIGN SYSTEMS / THEMING', level: 91, icon: Palette, category: 'UI SYSTEMS' },
  { name: 'PERFORMANCE OPTIMIZATION', level: 85, icon: Gauge, category: 'PERFORMANCE' },
  { name: 'NODE / EXPRESS', level: 80, icon: Server, category: 'BACKEND' },
  { name: 'MONGODB / DATABASE DESIGN', level: 60, icon: Database, category: 'DATA' },
  { name: 'DEBUGGING / PROBLEM SOLVING', level: 92, icon: Bug, category: 'ENGINEERING' },
];

export const missionHistory = [
  {
    date: '2023 - PRESENT',
    title: 'MilliporeSigma // Senior Front End Engineer',
    description:
      'Architecting high-performance customer interfaces and GraphQL data layers for global e-commerce systems.',
    status: 'Active',
    type: 'Frontend',
  },
  {
    date: '2020 - 2023',
    title: 'Uptycs // Senior UI Engineer',
    description:
      'Engineered complex security-focused application workflows across web and mobile using React and React Native.',
    status: 'Completed',
    type: 'Security',
  },
  {
    date: 'July 2020 - Oct 2020',
    title: 'Ally Bank // Senior Front End Engineer',
    description:
      'Modernized large-scale financial platforms from Ember.js to React, preserving stability and performance.',
    status: 'Completed',
    type: 'FinTech',
  },
  {
    date: '2018 - 2020',
    title: 'DataStax // Senior Fullstack Engineer',
    description:
      'Built interactive network visualizations and cloud management interfaces for distributed database systems.',
    status: 'Completed',
    type: 'Cloud',
  },
  {
    date: '2017 - 2018',
    title: 'Vibenomics // Senior Fullstack Engineer',
    description:
      'Architected and developed a React/Redux SaaS interface. Translated static designs into production-ready components and integrated with AWS/Firebase.',
    status: 'Completed',
    type: 'SaaS',
  },
  {
    date: 'Sep 2016 - Oct 2017',
    title: 'DirectEmployers Association // Front End Software Developer',
    description:
      'Architected high-scale Analytics SPAs with React/Redux and orchestrated a complete .jobs domain UI overhaul.',
    status: 'Completed',
    type: 'React/Redux',
  },
  {
    date: 'May 2016 - Sep 2016',
    title: 'Ion Three // Frontend Developer',
    description:
      'Engineered custom JS widgets and orchestrated AWS cloud deployments for high-velocity agency digital products.',
    status: 'Completed',
    type: 'Agency',
  },
  {
    date: 'Mar 2016 - May 2016',
    title: 'Navient // Frontend Developer',
    description:
      'Optimized accessibility and responsive UI components for massive enterprise platforms in the ASP.NET ecosystem.',
    status: 'Completed',
    type: 'Enterprise',
  },
  {
    date: 'Mar 2014 - Mar 2016',
    title: 'Simon Property Group // Frontend Developer',
    description:
      'Scaled dynamic digital experiences across 150+ property platforms and spearheaded the Simon Careers interface.',
    status: 'Completed',
    type: 'Enterprise',
  },
];
