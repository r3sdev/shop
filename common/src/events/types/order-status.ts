export enum OrderStatus {
  /**
   * When the order has been created, but the product it is trying to order
   * has not been reserved.
   */ 
  Created = 'created',

  /**
   * The product the order is trying to reserve has already been reserved,
   * the user has cancelled the order or when the order expires before payment.
   * 
   * For more fine grained cancellations, this can be split in three.
   */
  Cancelled = 'cancelled',

  /**
   * The order has successfully reserved the product.
   */
  AwaitingPayment = 'awaiting:payment',

  /**
   * The order has has reserved the product and the user has provided payment
   * successfully.
   */
  Complete = 'complete',
}
