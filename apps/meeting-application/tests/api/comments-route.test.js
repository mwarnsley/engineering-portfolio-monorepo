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

it.each([
  [
    { author: '  Ari  ', message: '  Decision made  ', sentiment: 'decision' },
    { author: 'Ari', message: 'Decision made', sentiment: 'decision' },
  ],
  [{}, { author: '', message: '', sentiment: undefined }],
])('normalizes submitted comment fields %j', async (body, expected) => {
  const meeting = { _id: 'meeting-1', comments: [], save: jest.fn().mockResolvedValue() };
  Meeting.findById.mockResolvedValueOnce(meeting);
  await POST({ json: async () => body }, { params: Promise.resolve({ id: 'meeting-1' }) });
  expect(meeting.comments).toEqual([expected]);
  expect(meeting.save).toHaveBeenCalledTimes(1);
});
it('returns validation errors when saving a comment fails', async () => {
  Meeting.findById.mockResolvedValueOnce({
    comments: [],
    save: jest.fn().mockRejectedValue(new Error('Author is required')),
  });
  const response = await POST(
    { json: async () => ({}) },
    { params: Promise.resolve({ id: 'meeting-1' }) }
  );
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: 'Author is required' });
});
