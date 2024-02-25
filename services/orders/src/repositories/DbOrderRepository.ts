import { eq } from 'drizzle-orm';
import { Order } from '../entities/Order';
import { DbService, TXOptions } from './DbService';
import { OrderRepository } from './OrderRepository';
import { orderItems, orders } from './db-schema';
import { v4 as uuid } from 'uuid';

export class DbOrderRepository implements OrderRepository {
  constructor(private dbService: DbService) {}

  async addOrder(order: Order, { tx }: TXOptions = {}): Promise<void> {
    await this.dbService.transaction(
      async (tx) => {
        await tx.insert(orders).values({
          id: order.id,
          totalAmount: order.totalAmount,
          status: order.status,
        });
        await tx.insert(orderItems).values(
          order.items.map((p) => ({
            id: uuid(),
            productId: p.productId,
            quantity: p.quantity,
            orderId: order.id,
          })),
        );
      },
      { tx },
    );
  }

  async updateOrder(order: Order, { tx }: TXOptions = {}): Promise<void> {
    await this.dbService.transaction(
      async (tx) => {
        await tx
          .update(orders)
          .set({
            totalAmount: order.totalAmount,
            status: order.status,
          })
          .where(eq(orders.id, order.id));

        await tx.delete(orderItems).where(eq(orderItems.orderId, order.id));

        await tx.insert(orderItems).values(
          order.items.map((p) => ({
            id: uuid(),
            productId: p.productId,
            quantity: p.quantity,
            orderId: order.id,
          })),
        );
      },
      { tx },
    );
  }

  async findById(id: string, { tx }: TXOptions = {}): Promise<Order | null> {
    const db = tx ?? this.dbService.db;
    const row = await db.query.orders.findFirst({
      with: {
        items: {
          columns: { productId: true, quantity: true },
        },
      },
      where: (users, { eq }) => eq(users.id, id),
    });

    if (!row) return null;

    return new Order(
      row.id,
      row.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      row.totalAmount,
      row.status,
    );
  }

  async getOrders({ tx }: TXOptions = {}): Promise<Order[]> {
    const db = tx ?? this.dbService.db;
    const rows = await db.query.orders.findMany({
      with: {
        items: {
          columns: { productId: true, quantity: true },
        },
      },
    });
    return rows.map(
      (row) =>
        new Order(
          row.id,
          row.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          row.totalAmount,
          row.status,
        ),
    );
  }
  async deleteAllOrders({ tx }: TXOptions = {}): Promise<void> {
    await this.dbService.transaction(
      async (tx) => {
        await tx.delete(orderItems).execute();
        await tx.delete(orders).execute();
      },
      { tx },
    );
  }
}
