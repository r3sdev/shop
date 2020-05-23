export enum OrderStatus {
  /**
   * When the order has been created, but the ticket it is trying to order
   * has not been reserved.
   */ 
  Created = 'created',

  /**
   * The ticket the order is trying to reserve has already been reserved,
   * the user has cancelled the order or when the order expires before payment.
   * 
   * For more fine grained cancellations, this can be split in three.
   */
  Cancelled = 'cancelled',

  /**
   * The order has successfully reserved the ticket.
   */
  AwaitingPayment = 'awaiting:payment',

  /**
   * The order has has reserved the ticket and the user has provided payment
   * successfully.
   */
  Complete = 'complete',
}
