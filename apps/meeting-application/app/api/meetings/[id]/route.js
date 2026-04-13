import { errorResponse, successResponse } from '../../../../lib/api';
import { normalizeMeetingPayload } from '../../../../lib/meeting-payload';
import { connectToDatabase } from '../../../../lib/mongoose';
import { serializeMeeting } from '../../../../lib/meetings';
import { Meeting } from '../../../../models/Meeting';

export async function GET(_request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return errorResponse('Meeting not found.', 404);
    }

    return successResponse({ meeting: serializeMeeting(meeting) });
  } catch (error) {
    return errorResponse(error.message, 400);
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const meeting = await Meeting.findByIdAndUpdate(id, normalizeMeetingPayload(body), {
      new: true,
      runValidators: true,
    });

    if (!meeting) {
      return errorResponse('Meeting not found.', 404);
    }

    return successResponse({ meeting: serializeMeeting(meeting) });
  } catch (error) {
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const meeting = await Meeting.findByIdAndDelete(id);

    if (!meeting) {
      return errorResponse('Meeting not found.', 404);
    }

    return successResponse({ ok: true });
  } catch (error) {
    return errorResponse(error.message, 400);
  }
}
