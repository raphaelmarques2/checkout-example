import { Payment } from '../entities/Payment';
import { TXOptions } from './DbService';

export interface PaymentRepository {
  getPayments(options?: TXOptions): Promise<Payment[]>;
  addPayment(payment: Payment, options?: TXOptions): Promise<void>;
  getPaymentById(
    paymentId: string,
    options?: TXOptions,
  ): Promise<Payment | null>;
  updatePayment(payment: Payment, options?: TXOptions): Promise<void>;
  deleteAllPayments(options?: TXOptions): Promise<void>;
}
