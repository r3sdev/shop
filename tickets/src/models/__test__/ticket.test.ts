import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // Create a ticket instance
  const ticket = Ticket.build({
    title: 'Test ticket',
    price: 10,
    userId: 'testUserId',
  });

  // Save ticket to database
  await ticket.save();

  // Fetch ticket twice
  const ticketOne = await Ticket.findById(ticket.id);
  const ticketTwo = await Ticket.findById(ticket.id);

  // Make changes to fetched tickets
  ticketOne!.set({
    title: 'First update',
    price: 11,
  });

  ticketTwo!.set({
    title: 'Second update',
    price: 12,
  });

  // Save the first fetched ticket
  await ticketOne!.save();

  // Save the second fetched ticket and expect an error
  await expect(ticketTwo!.save()).rejects.toThrow();
});

it('increments the version number on multiple saves', async () => {
  // Create a ticket instance
  const ticket = Ticket.build({
    title: 'Test ticket',
    price: 10,
    userId: 'testUserId',
  });

  await ticket.save();
  expect(ticket.version).toBe(0);

  await ticket.save();
  expect(ticket.version).toBe(1);

  await ticket.save();
  expect(ticket.version).toBe(2);
});
