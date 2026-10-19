/** @jest-environment node */

jest.mock('../../lib/mongoose', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('../../lib/meeting-payload', () => ({
  normalizeMeetingPayload: jest.fn((payload) => payload),
}));

jest.mock('../../lib/meetings', () => ({
  serializeMeeting: jest.fn((meeting) => ({ id: meeting._id, title: meeting.title })),
}));

jest.mock('../../models/Meeting', () => ({
  Meeting: {
    create: jest.fn(),
    find: jest.fn(),
  },
}));

import { GET, POST } from '../../app/api/meetings/route';
import { Meeting } from '../../models/Meeting';
import { connectToDatabase } from '../../lib/mongoose';

describe('app/api/meetings/route', () => {
  it('returns meetings from GET', async () => {
    Meeting.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ _id: 'meeting-1', title: 'Launch planning' }]),
    });

    const response = await GET();
    const data = await response.json();

    expect(data.meetings[0].id).toBe('meeting-1');
  });

  it('connects to the database before GET', async () => {
    Meeting.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    await GET();

    expect(connectToDatabase).toHaveBeenCalled();
  });

  it('creates meetings from POST payloads', async () => {
    Meeting.create.mockResolvedValue({ _id: 'meeting-2', title: 'New sync' });

    const response = await POST({
      json: async () => ({ title: 'New sync' }),
    });
    const data = await response.json();

    expect(data.meeting.id).toBe('meeting-2');
  });

  it('returns a 400 when POST fails', async () => {
    Meeting.create.mockRejectedValue(new Error('Bad payload'));

    const response = await POST({
      json: async () => ({ title: 'New sync' }),
    });

    expect(response.status).toBe(400);
  });
});

it('reports a failed database connection as a server error', async () => {
  connectToDatabase.mockRejectedValueOnce(new Error('Database offline'));
  const response = await GET();
  expect(response.status).toBe(500);
  expect(await response.json()).toEqual({ error: 'Database offline' });
});
