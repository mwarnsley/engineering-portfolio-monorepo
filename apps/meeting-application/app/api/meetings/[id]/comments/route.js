import { errorResponse, successResponse } from '../../../../../lib/api';
import { connectToDatabase } from '../../../../../lib/mongoose';
import { serializeMeeting } from '../../../../../lib/meetings';
import { Meeting } from '../../../../../models/Meeting';

export async function POST(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return errorResponse('Meeting not found.', 404);
    }

    meeting.comments.push({
      author: String(body.author ?? '').trim(),
      message: String(body.message ?? '').trim(),
      sentiment: body.sentiment,
    });

    await meeting.save();

    return successResponse({ meeting: serializeMeeting(meeting) }, { status: 201 });
  } catch (error) {
    return errorResponse(error.message, 400);
  }
}
