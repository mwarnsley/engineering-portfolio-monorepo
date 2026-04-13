import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    sentiment: {
      type: String,
      enum: ['support', 'decision', 'risk', 'idea'],
      default: 'idea',
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const meetingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: String,
      trim: true,
      default: '',
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    attendees: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    actionItems: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
    },
    virtualLink: {
      type: String,
      trim: true,
      default: '',
    },
    mode: {
      type: String,
      enum: ['remote', 'hybrid', 'in-person'],
      default: 'remote',
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

meetingSchema.pre('validate', function () {
  if (this.startTime && this.endTime && this.endTime < this.startTime) {
    this.invalidate('endTime', 'End time must be after the start time.');
  }
});

export const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
