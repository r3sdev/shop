import mongoose from 'mongoose';

interface EventAttrs {
  event: string;
  eventData?: any;
  userId?: string;
}

interface EventDoc extends mongoose.Document {
  event: string;
  eventData?: any;
  userId?: string;
}

interface EventModel extends mongoose.Model<EventDoc> {
  build(attrs: EventAttrs): EventDoc;
}

const eventSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    event: {
      type: String,
      required: true,
    },
    eventData: {
      type: Object,
      required: false,
    },
    userId: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    versionKey: false,
  },
);

eventSchema.statics.build = (attrs: EventAttrs) => {
  return new Event(attrs);
};

const Event = mongoose.model<EventDoc, EventModel>('Event', eventSchema);

export { Event };
