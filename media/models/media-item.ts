import mongoose from 'mongoose';

interface MediaItemAttrs {
  url: string;
  kind: string;
  userId: string;
}

interface MediaItemDoc extends mongoose.Document {
  url: string;
  kind: string;
  userId: string;
}

interface MediaItemModel extends mongoose.Model<MediaItemDoc> {
  build(attrs: MediaItemAttrs): MediaItemDoc;
}

const mediaItemSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true
    },
    kind: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    versionKey: false,
    timestamps: true,
  },
);

mediaItemSchema.statics.build = (attrs: MediaItemAttrs) => {
  return new MediaItem(attrs);
};

const MediaItem = mongoose.model<MediaItemDoc, MediaItemModel>(
  'MediaItem',
  mediaItemSchema,
);

export { MediaItem };
