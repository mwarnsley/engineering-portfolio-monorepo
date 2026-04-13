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
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

import { DELETE, GET, PUT } from '../../app/api/meetings/[id]/route';
import { Meeting } from '../../models/Meeting';

describe('app/api/meetings/[id]/route', () => {
  it('returns a meeting from GET', async () => {
    Meeting.findById.mockResolvedValue({ _id: 'meeting-1', title: 'Launch planning' });

    const response = await GET({}, { params: Promise.resolve({ id: 'meeting-1' }) });
    const data = await response.json();

    expect(data.meeting.id).toBe('meeting-1');
  });

  it('returns a 404 when GET cannot find a meeting', async () => {
    Meeting.findById.mockResolvedValue(null);

    const response = await GET({}, { params: Promise.resolve({ id: 'missing' }) });

    expect(response.status).toBe(404);
  });

  it('updates a meeting from PUT', async () => {
    Meeting.findByIdAndUpdate.mockResolvedValue({ _id: 'meeting-1', title: 'Updated' });

    const response = await PUT(
      { json: async () => ({ title: 'Updated' }) },
      { params: Promise.resolve({ id: 'meeting-1' }) }
    );
    const data = await response.json();

    expect(data.meeting.title).toBe('Updated');
  });

  it('deletes a meeting from DELETE', async () => {
    Meeting.findByIdAndDelete.mockResolvedValue({ _id: 'meeting-1' });

    const response = await DELETE({}, { params: Promise.resolve({ id: 'meeting-1' }) });
    const data = await response.json();

    expect(data.ok).toBe(true);
  });
});
