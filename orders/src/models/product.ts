import mongoose from 'mongoose';
import {OrderStatus} from '@ramsy-dev/microservices-shop-common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order } from './order';

/**
 * Note:
 *
 * Even though these attributes might be similar to the ones used in the products
 * service we no not want to share these attributes. The attributes here are required
 * to associate a product with an order and not necesarrily how to create a new product.
 */

interface ProductAttrs {
  id: string;
  title: string;
  price: number;
}

export interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ProductDoc | null>;
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
      min: 0,
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

/**
 * This needs to be a function and not an arrow function.
 */
productSchema.methods.isReserved = async function () {
  /**
   * Run query to look at all orders. Find an order where the product
   * is the product we just found *and* the orders status is *not* cancelled.
   * If we find an order from that means the product *is* reserved.
   */
  const existingOrder = await Order.findOne({
    product: this,
    status: {
      // filter based on status
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema);

export { Product };
