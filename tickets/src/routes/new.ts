import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@ramsy-it/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    // const existingTicket = await Ticket.findOne({ title });

    // if (existingTicket) {
    //   throw new BadRequestError('Ticket with same title already exists');
    // }

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    /**
     * INFO:
     *
     * In this setup and a very specific situation where we might have issues with losing the connection to NATS
     * after saving the data, we might run into data consistency issues. We do not expect that to happen.
     *
     * When we run into the issues the solution would be to save both the data and the event with a database
     * transaction which ensures both fields need to be saved. We will then add a sent flag to the event where
     * we can detect whether the event has been sent or not. We will need to implement new code to watch
     * for new database actions and process the events. That will prevent any consistency issues.
     *
     * When this is implemented we can remove the await keyword safely and gain some performance as well.
     */

    await new TicketCreatedPublisher(natsWrapper.client).publish(
      {
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      },
    );

    res.status(201).send(ticket);
  },
);

export { router as createTicketRouter };
