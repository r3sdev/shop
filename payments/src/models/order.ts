import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@ramsy-dev/microservices-shop-common';

interface OrderAttrs {
  id: string; // do not put in schema
  version: number; // do not put in schema
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number; // do not put in schema
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      require: true,
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

orderSchema.statics.findByEvent = async (order: {
  id: string;
  version: number;
}) => {
  return Order.findOne({
    _id: order.id,
    version: order.version - 1, // Concurrency
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
