import { PaymentRepository } from './PaymentRepository';
import { Payment } from '../entities/Payment';

export class MemoryPaymentRepository implements PaymentRepository {
  private payments: Payment[] = [];

  async addPayment(payment: Payment): Promise<void> {
    this.payments.push(payment);
  }

  async getPaymentById(paymentId: string): Promise<Payment | null> {
    return this.payments.find((p) => p.id === paymentId) ?? null;
  }

  async updatePayment(payment: Payment): Promise<void> {
    const index = this.payments.findIndex((p) => p.id === payment.id);
    this.payments[index] = payment;
  }

  async getPayments(): Promise<Payment[]> {
    return this.payments;
  }

  async deleteAllPayments(): Promise<void> {
    this.payments = [];
  }
}
