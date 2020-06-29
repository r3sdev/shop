import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CategoryDoc } from './category';

/**
 * An interface that describes the properties
 * that are required to create a new product
 */
interface ProductAttrs {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  category?: CategoryDoc | null;
}

/**
 * An interface that describes the properties
 * that a Product Model has
 */
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ProductDoc | null>;
}

/**
 * An interface that describes the properties
 * that a Product Document has
 */
export interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  imageUrl?: string;
  category?: CategoryDoc;
  version: number;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false
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

productSchema.set('versionKey', 'version');
productSchema.plugin(updateIfCurrentPlugin);

/**
 * Needed to make mongoose type safe
 *
 * @example Product.build({title: 'Title', price: 10})
 */
productSchema.statics.build = (attrs: ProductAttrs) => {
  const _id = attrs.id;
  delete attrs.id;

  return new Product({
    _id,
    ...attrs,
  });
};

productSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  return Product.findOne({
    _id: event.id,
    version: event.version - 1, // Concurrency
  });
};
const Product = mongoose.model<ProductDoc, ProductModel>(
  'Product',
  productSchema,
);

export { Product };
