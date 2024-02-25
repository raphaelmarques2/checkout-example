import { Payment, PaymentStatus } from '../entities/Payment';

export class PaymentDto {
  readonly id: string;
  readonly orderId: string;
  readonly status: PaymentStatus;
  readonly amount: number;

  constructor(order: Payment) {
    this.id = order.id;
    this.orderId = order.orderId;
    this.status = order.status;
    this.amount = order.amount;
  }
}
