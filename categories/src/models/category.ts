import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';
import { ProductDoc } from './product';

/**
 * An interface that describes the properties
 * that are required to create a new product
 */
interface CategoryAttrs {
  title: string;
  description: string;
  imageUrl: string;
  products?: ProductDoc[]
}

/**
 * An interface that describes the properties
 * that a Product Model has
 */
interface CategoryModel extends mongoose.Model<CategoryDoc> {
  build(attrs: CategoryAttrs): CategoryDoc;
}

/**
 * An interface that describes the properties
 * that a Product Document has
 */
export interface CategoryDoc extends mongoose.Document {
  title: string;
  description: string;
  imageUrl: string;
  version: number;
  products?: ProductDoc[]
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
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
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

/**
 * Needed to make mongoose type safe
 *
 * @example Product.build({title: 'Title', price: 10})
 */
categorySchema.statics.build = (attrs: CategoryAttrs) => {
  return new Category(attrs);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>('Category', categorySchema);

export { Category };
