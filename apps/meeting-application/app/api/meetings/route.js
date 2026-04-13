import { errorResponse, successResponse } from '../../../lib/api';
import { normalizeMeetingPayload } from '../../../lib/meeting-payload';
import { connectToDatabase } from '../../../lib/mongoose';
import { serializeMeeting } from '../../../lib/meetings';
import { Meeting } from '../../../models/Meeting';

export async function GET() {
  try {
    await connectToDatabase();
    const meetings = await Meeting.find({}).sort({ startTime: 1 });

    return successResponse({
      meetings: meetings.map(serializeMeeting),
    });
  } catch (error) {
    return errorResponse(error.message);
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const meeting = await Meeting.create(normalizeMeetingPayload(body));

    return successResponse({ meeting: serializeMeeting(meeting) }, { status: 201 });
  } catch (error) {
    return errorResponse(error.message, 400);
  }
}
