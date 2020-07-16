import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

/**
 * Note:
 *
 * Even though these attributes might be similar to the ones used in the products
 * service we no not want to share these attributes. The attributes here are required
 * to associate a product with an order and not necesarrily how to create a new product.
 */

interface CategoryAttrs {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  version: number;
}

export interface CategoryDoc extends mongoose.Document {
  title: string;
  description: string;
  imageUrl: string;
  version: number;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
  build(attrs: CategoryAttrs): CategoryDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<CategoryDoc | null>;
}

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

categorySchema.set('versionKey', 'version');
categorySchema.plugin(updateIfCurrentPlugin);

categorySchema.statics.build = (attrs: CategoryAttrs) => {
  const _id = attrs.id;
  delete attrs.id;

  return new Category({
    _id,
    ...attrs,
  });
};

categorySchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  return Category.findOne({
    _id: event.id,
    version: event.version - 1, // Concurrency
  });
};

const Category = mongoose.model<CategoryDoc, CategoryModel>(
  'Category',
  categorySchema,
);

export { Category };
