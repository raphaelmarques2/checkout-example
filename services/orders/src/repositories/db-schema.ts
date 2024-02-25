import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { OrderStatus } from '../entities/Order';

export const orderStatusEnum = pgEnum('order_status', [
  OrderStatus.CREATED,
  OrderStatus.CANCELED,
  OrderStatus.FINISHED,
]);

export const orderItems = pgTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  orderId: varchar('order_id', { length: 36 })
    .notNull()
    .references(() => orders.id),
});

export const orders = pgTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  totalAmount: real('total_amount').notNull(),
  status: orderStatusEnum('status').notNull(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const schema = {
  orders,
  orderItems,
  ordersRelations,
  orderItemsRelations,
};
