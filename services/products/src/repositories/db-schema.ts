import { integer, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { ReservationStatus } from '../entities/Reservation';

export const reservationStatusEnum = pgEnum('reservation_status', [
  ReservationStatus.CREATED,
  ReservationStatus.CANCELED,
  ReservationStatus.CONSUMED,
]);

export const products = pgTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
});

export const reservations = pgTable('reservations', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  productId: varchar('product_id', { length: 36 })
    .references(() => products.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  status: reservationStatusEnum('status').notNull(),
});

export const schema = {
  products,
  reservations,
};
