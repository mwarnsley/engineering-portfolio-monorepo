/** @jest-environment node */

jest.mock('../../lib/mongoose', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('../../lib/meetings', () => ({
  serializeMeeting: jest.fn((meeting) => ({ id: meeting._id, comments: meeting.comments })),
}));

jest.mock('../../models/Meeting', () => ({
  Meeting: {
    findById: jest.fn(),
  },
}));

import { POST } from '../../app/api/meetings/[id]/comments/route';
import { Meeting } from '../../models/Meeting';

describe('app/api/meetings/[id]/comments/route', () => {
  it('adds a comment to a meeting', async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    const comments = [];
    const meeting = {
      _id: 'meeting-1',
      comments,
      save,
    };

    Meeting.findById.mockResolvedValue(meeting);

    const response = await POST(
      {
        json: async () => ({
          author: 'Marcus',
          message: 'Decision made',
          sentiment: 'decision',
        }),
      },
      { params: Promise.resolve({ id: 'meeting-1' }) }
    );

    expect(response.status).toBe(201);
  });

  it('returns a 404 when the meeting is missing', async () => {
    Meeting.findById.mockResolvedValue(null);

    const response = await POST(
      {
        json: async () => ({
          author: 'Marcus',
          message: 'Decision made',
          sentiment: 'decision',
        }),
      },
      { params: Promise.resolve({ id: 'meeting-1' }) }
    );

    expect(response.status).toBe(404);
  });
});
