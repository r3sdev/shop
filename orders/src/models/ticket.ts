import mongoose from 'mongoose';
import {OrderStatus} from '@ramsy-it/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order } from './order';

/**
 * Note:
 *
 * Even though these attributes might be similar to the ones used in the tickets
 * service we no not want to share these attributes. The attributes here are required
 * to associate a ticket with an order and not necesarrily how to create a new ticket.
 */

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const _id = attrs.id;
  delete attrs.id;

  return new Ticket({
    _id,
    ...attrs,
  });
};

ticketSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1, // Concurrency
  });
};

/**
 * This needs to be a function and not an arrow function.
 */
ticketSchema.methods.isReserved = async function () {
  /**
   * Run query to look at all orders. Find an order where the ticket
   * is the ticket we just found *and* the orders status is *not* cancelled.
   * If we find an order from that means the ticket *is* reserved.
   */
  const existingOrder = await Order.findOne({
    ticket: this,
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

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
