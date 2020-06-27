import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CategoryDoc } from './category';

/**
 * An interface that describes the properties
 * that are required to create a new product
 */
interface ProductAttrs {
  title: string;
  price: number;
  cost: number;
  category?: CategoryDoc | null;
  userId: string;
}

/**
 * An interface that describes the properties
 * that a Product Model has
 */
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

/**
 * An interface that describes the properties
 * that a Product Document has
 */
interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  cost: number;
  category?: CategoryDoc;
  userId: string;
  version: number;
  orderId?: string;
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
    cost: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: false,
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
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  'Product',
  productSchema,
);

export { Product };
