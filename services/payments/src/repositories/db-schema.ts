import { pgEnum, pgTable, real, varchar } from 'drizzle-orm/pg-core';
import { PaymentStatus } from '../entities/Payment';

export const paymentStatusEnum = pgEnum('payment_status', [
  PaymentStatus.CREATED,
  PaymentStatus.FAILED,
  PaymentStatus.PROCESSED,
]);

export const payments = pgTable('payments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  amount: real('amount').notNull(),
  status: paymentStatusEnum('status').notNull(),
});

export const schema = {
  payments,
};
