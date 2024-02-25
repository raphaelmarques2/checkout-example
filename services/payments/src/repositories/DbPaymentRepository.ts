import { eq } from 'drizzle-orm';
import { Payment } from '../entities/Payment';
import { DbService, TXOptions } from './DbService';
import { PaymentRepository } from './PaymentRepository';
import { payments } from './db-schema';

export class DbPaymentRepository implements PaymentRepository {
  constructor(private dbService: DbService) {}

  async getPayments({ tx }: TXOptions = {}): Promise<Payment[]> {
    const db = tx || this.dbService.db;
    const rows = await db.query.payments.findMany();
    return rows.map((row) => {
      return new Payment(row.id, row.orderId, row.amount, row.status);
    });
  }

  async addPayment(payment: Payment, { tx }: TXOptions = {}): Promise<void> {
    const db = tx || this.dbService.db;
    await db.insert(payments).values({
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      status: payment.status,
    });
  }

  async getPaymentById(
    paymentId: string,
    { tx }: TXOptions = {},
  ): Promise<Payment | null> {
    const db = tx || this.dbService.db;
    const row = await db.query.payments.findFirst({
      where: (payments, { eq }) => eq(payments.id, paymentId),
    });
    if (!row) return null;
    return new Payment(row.id, row.orderId, row.amount, row.status);
  }

  async updatePayment(payment: Payment, { tx }: TXOptions = {}): Promise<void> {
    const db = tx || this.dbService.db;
    await db
      .update(payments)
      .set({
        status: payment.status,
        amount: payment.amount,
      })
      .where(eq(payments.id, payment.id));
  }

  async deleteAllPayments({ tx }: TXOptions = {}): Promise<void> {
    await this.dbService.transaction(
      async (tx) => {
        await tx.delete(payments).execute();
      },
      { tx },
    );
  }
}
