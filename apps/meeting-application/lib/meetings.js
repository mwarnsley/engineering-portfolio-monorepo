import dayjs from 'dayjs';
import { connectToDatabase } from './mongoose';
import { Meeting } from '../models/Meeting';

const serializeComment = (comment) => ({
  id: String(comment._id),
  author: comment.author,
  createdAt: new Date(comment.createdAt).toISOString(),
  message: comment.message,
  sentiment: comment.sentiment,
});

export const serializeMeeting = (meeting) => ({
  id: String(meeting._id),
  actionItems: meeting.actionItems ?? [],
  agenda: meeting.agenda ?? '',
  attendees: meeting.attendees ?? [],
  comments: (meeting.comments ?? []).map(serializeComment),
  createdAt: new Date(meeting.createdAt).toISOString(),
  endTime: new Date(meeting.endTime).toISOString(),
  location: meeting.location ?? '',
  mode: meeting.mode,
  ownerName: meeting.ownerName,
  startTime: new Date(meeting.startTime).toISOString(),
  status: meeting.status,
  summary: meeting.summary,
  tags: meeting.tags ?? [],
  title: meeting.title,
  updatedAt: new Date(meeting.updatedAt).toISOString(),
  virtualLink: meeting.virtualLink ?? '',
});

export async function getMeetings() {
  await connectToDatabase();
  const meetings = await Meeting.find({}).sort({ startTime: 1 }).lean();
  return meetings.map(serializeMeeting);
}

export async function getMeetingById(id) {
  await connectToDatabase();
  const meeting = await Meeting.findById(id).lean();
  return meeting ? serializeMeeting(meeting) : null;
}

export function getMeetingMetrics(meetings) {
  const now = dayjs();

  return {
    activeDiscussions: meetings.filter((meeting) => meeting.comments.length > 0).length,
    upcomingCount: meetings.filter((meeting) => dayjs(meeting.startTime).isAfter(now)).length,
    thisWeekCount: meetings.filter((meeting) => dayjs(meeting.startTime).isSame(now, 'week'))
      .length,
    totalMeetings: meetings.length,
  };
}

export async function getDashboardData() {
  try {
    const meetings = await getMeetings();

    return {
      error: null,
      meetings,
      metrics: getMeetingMetrics(meetings),
    };
  } catch (error) {
    return {
      error: error.message,
      meetings: [],
      metrics: {
        activeDiscussions: 0,
        thisWeekCount: 0,
        totalMeetings: 0,
        upcomingCount: 0,
      },
    };
  }
}
