import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ProductAttrs {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

/**
 * An interface that describes the properties
 * that are required to create a new product
 */
interface CartAttrs {
  userId?: string;
  guestId?: string;
  products?: ProductAttrs[];
}

/**
 * An interface that describes the properties
 * that a Product Model has
 */
interface CartModel extends mongoose.Model<CartDoc> {
  build(attrs: CartAttrs): CartDoc;
}

/**
 * An interface that describes the properties
 * that a Product Document has
 */
interface CartDoc extends mongoose.Document {
  userId?: string;
  guestId?: string;
  products: ProductAttrs[];
}

var productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
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
  },
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    guestId: {
      type: String,
    },
    products: {
      type: [productSchema],
      default: [],
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

cartSchema.set('versionKey', 'version');
cartSchema.plugin(updateIfCurrentPlugin);

/**
 * Needed to make mongoose type safe
 *
 * @example Product.build({title: 'Title', price: 10})
 */
cartSchema.statics.build = (attrs: CartAttrs) => {
  return new Cart(attrs);
};

const Cart = mongoose.model<CartDoc, CartModel>('Cart', cartSchema);

export { Cart };
