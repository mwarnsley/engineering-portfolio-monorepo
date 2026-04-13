export function createMeeting(overrides = {}) {
  return {
    id: 'meeting-1',
    actionItems: ['Share recap'],
    agenda: 'Review status and next steps',
    attendees: ['Marcus', 'Ari'],
    comments: [
      {
        id: 'comment-1',
        author: 'Ari',
        createdAt: '2026-04-10T12:00:00.000Z',
        message: 'Looks good to me.',
        sentiment: 'support',
      },
    ],
    createdAt: '2026-04-10T10:00:00.000Z',
    endTime: '2026-04-10T15:00:00.000Z',
    location: 'Zoom Room',
    mode: 'remote',
    ownerName: 'Marcus',
    startTime: '2026-04-10T14:00:00.000Z',
    status: 'scheduled',
    summary: 'Align the team on launch priorities.',
    tags: ['launch'],
    title: 'Launch planning',
    updatedAt: '2026-04-10T11:00:00.000Z',
    virtualLink: 'https://example.com/room',
    ...overrides,
  };
}

export function createDashboardData(overrides = {}) {
  const meetings = overrides.meetings || [createMeeting()];

  return {
    error: null,
    meetings,
    metrics: {
      activeDiscussions: meetings.filter((meeting) => meeting.comments.length > 0).length,
      thisWeekCount: meetings.length,
      totalMeetings: meetings.length,
      upcomingCount: meetings.length,
    },
    ...overrides,
  };
}
