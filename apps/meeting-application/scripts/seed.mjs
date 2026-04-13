import 'dotenv/config';
import mongoose from 'mongoose';
import { Meeting } from '../models/Meeting.js';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is required to seed demo data.');
}

const now = new Date();

const plusHours = (hours) => new Date(now.getTime() + hours * 60 * 60 * 1000);

const seedMeetings = [
  {
    title: 'Product Strategy Sync',
    summary:
      'Align design, product, and engineering on the next release scope and the final feature tradeoffs.',
    agenda:
      'Review customer signals, confirm scope, decide launch blockers, and assign follow-up owners.',
    ownerName: 'Marcus',
    attendees: ['Marcus', 'Ari', 'Nina', 'Darius'],
    tags: ['strategy', 'launch', 'alignment'],
    actionItems: [
      'Share the revised launch checklist',
      'Confirm analytics coverage for onboarding funnel',
      'Publish a customer-facing timeline',
    ],
    location: 'Zoom Room Alpha',
    virtualLink: 'https://example.com/meet/product-strategy-sync',
    mode: 'remote',
    status: 'scheduled',
    startTime: plusHours(20),
    endTime: plusHours(21),
    comments: [
      {
        author: 'Nina',
        message: 'We should lock the onboarding scope before we ask design for a final pass.',
        sentiment: 'decision',
      },
      {
        author: 'Darius',
        message: 'Please call out which launch risks are acceptable versus blockers in the recap.',
        sentiment: 'risk',
      },
    ],
  },
  {
    title: 'Weekly Delivery Review',
    summary:
      'Check execution health across active workstreams and unblock anything drifting behind plan.',
    agenda: 'Status updates, blockers, staffing adjustments, and final delivery confidence check.',
    ownerName: 'Ari',
    attendees: ['Ari', 'Marcus', 'Jules', 'Sam'],
    tags: ['delivery', 'ops'],
    actionItems: [
      'Rebalance QA support for the mobile sprint',
      'Document API contract changes in the changelog',
    ],
    location: 'Studio B',
    virtualLink: '',
    mode: 'hybrid',
    status: 'scheduled',
    startTime: plusHours(46),
    endTime: plusHours(47.5),
    comments: [
      {
        author: 'Sam',
        message:
          'Backend delivery looks healthy, but design review timing is still the biggest unknown.',
        sentiment: 'support',
      },
    ],
  },
  {
    title: 'Retro and Team Feedback Forum',
    summary:
      'Create space for team feedback, reflect on the sprint, and capture improvements for the next cycle.',
    agenda:
      'Celebrate wins, surface friction, discuss collaboration patterns, and decide which process changes to pilot.',
    ownerName: 'Jules',
    attendees: ['Jules', 'Nina', 'Marcus', 'Darius', 'Ari'],
    tags: ['retro', 'feedback', 'culture'],
    actionItems: [
      'Pilot a tighter async pre-read format',
      'Reduce ad hoc status meetings during launch week',
    ],
    location: 'Project Hub',
    virtualLink: 'https://example.com/meet/retro-feedback',
    mode: 'in-person',
    status: 'scheduled',
    startTime: plusHours(72),
    endTime: plusHours(73.5),
    comments: [
      {
        author: 'Marcus',
        message:
          'Would love to keep the retro practical and make sure we leave with two concrete process changes.',
        sentiment: 'idea',
      },
    ],
  },
];

async function run() {
  await mongoose.connect(uri, {
    dbName: 'meeting-application',
  });

  await Meeting.deleteMany({});
  await Meeting.insertMany(seedMeetings);

  console.log('Seeded demo meetings successfully.');

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error('Failed to seed meetings:', error.message);
  process.exit(1);
});
