import { normalizeMeetingPayload } from '../../lib/meeting-payload';

describe('lib/meeting-payload', () => {
  it('trims scalar fields', () => {
    const payload = normalizeMeetingPayload({
      agenda: '  Agenda  ',
      location: '  Room A  ',
      ownerName: '  Marcus  ',
      summary: '  Summary  ',
      title: '  Kickoff  ',
      virtualLink: '  https://example.com  ',
    });

    expect(payload.title).toBe('Kickoff');
  });

  it('splits comma separated lists', () => {
    const payload = normalizeMeetingPayload({
      actionItems: 'One, Two , Three',
      attendees: 'Marcus, Ari',
      tags: 'roadmap, launch',
    });

    expect(payload.actionItems).toEqual(['One', 'Two', 'Three']);
  });

  it('preserves array inputs', () => {
    const payload = normalizeMeetingPayload({
      actionItems: [' One ', 'Two'],
      attendees: [' Marcus ', 'Ari'],
      tags: [' release ', 'ops'],
    });

    expect(payload.attendees).toEqual(['Marcus', 'Ari']);
  });

  it('keeps start and end times untouched', () => {
    const payload = normalizeMeetingPayload({
      endTime: '2026-04-11T10:00:00.000Z',
      startTime: '2026-04-11T09:00:00.000Z',
    });

    expect(payload.startTime).toBe('2026-04-11T09:00:00.000Z');
  });
});
