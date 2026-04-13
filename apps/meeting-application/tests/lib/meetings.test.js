jest.mock('../../lib/mongoose', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('../../models/Meeting', () => ({
  Meeting: {
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

import { connectToDatabase } from '../../lib/mongoose';
import { Meeting } from '../../models/Meeting';
import {
  getDashboardData,
  getMeetingById,
  getMeetingMetrics,
  getMeetings,
  serializeMeeting,
} from '../../lib/meetings';
import { createMeeting } from '../setup/fixtures';

describe('lib/meetings', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-04-10T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('serializes meeting identifiers', () => {
    const meeting = serializeMeeting({
      ...createMeeting(),
      _id: 42,
      comments: [{ _id: 3, author: 'Ari', createdAt: '2026-04-10T12:00:00.000Z', message: 'Hi' }],
    });

    expect(meeting.id).toBe('42');
  });

  it('serializes comment identifiers', () => {
    const meeting = serializeMeeting({
      ...createMeeting(),
      _id: 42,
      comments: [{ _id: 3, author: 'Ari', createdAt: '2026-04-10T12:00:00.000Z', message: 'Hi' }],
    });

    expect(meeting.comments[0].id).toBe('3');
  });

  it('calculates upcoming meetings', () => {
    const metrics = getMeetingMetrics([createMeeting()]);

    expect(metrics.upcomingCount).toBe(1);
  });

  it('counts active discussions', () => {
    const metrics = getMeetingMetrics([
      createMeeting(),
      createMeeting({ comments: [], id: 'meeting-2', startTime: '2026-04-09T12:00:00.000Z' }),
    ]);

    expect(metrics.activeDiscussions).toBe(1);
  });

  it('loads meetings from mongoose', async () => {
    const lean = jest.fn().mockResolvedValue([{ ...createMeeting(), _id: 'db-1' }]);
    const sort = jest.fn().mockReturnValue({ lean });
    Meeting.find.mockReturnValue({ sort });

    const meetings = await getMeetings();

    expect(meetings[0].id).toBe('db-1');
  });

  it('connects before loading meetings', async () => {
    const lean = jest.fn().mockResolvedValue([{ ...createMeeting(), _id: 'db-1' }]);
    const sort = jest.fn().mockReturnValue({ lean });
    Meeting.find.mockReturnValue({ sort });

    await getMeetings();

    expect(connectToDatabase).toHaveBeenCalled();
  });

  it('returns a serialized meeting by id', async () => {
    Meeting.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ ...createMeeting(), _id: 'db-2' }),
    });

    const meeting = await getMeetingById('db-2');

    expect(meeting.id).toBe('db-2');
  });

  it('returns null when a meeting is missing', async () => {
    Meeting.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const meeting = await getMeetingById('missing');

    expect(meeting).toBeNull();
  });

  it('returns dashboard meetings on success', async () => {
    const lean = jest.fn().mockResolvedValue([{ ...createMeeting(), _id: 'db-1' }]);
    const sort = jest.fn().mockReturnValue({ lean });
    Meeting.find.mockReturnValue({ sort });

    const data = await getDashboardData();

    expect(data.error).toBeNull();
  });

  it('returns an error snapshot on failure', async () => {
    connectToDatabase.mockRejectedValueOnce(new Error('Database offline'));

    const data = await getDashboardData();

    expect(data.error).toBe('Database offline');
  });
});
