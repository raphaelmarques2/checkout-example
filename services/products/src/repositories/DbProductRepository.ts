import { eq, inArray } from 'drizzle-orm';
import { Product } from '../entities/Product';
import { Reservation } from '../entities/Reservation';
import { DbService, TXOptions } from './DbService';
import { ProductRepository } from './ProductRepository';
import { products, reservations } from './db-schema';

export class DbProductRepository implements ProductRepository {
  constructor(private dbService: DbService) {}

  async addProduct(product: Product, { tx }: TXOptions = {}): Promise<void> {
    const db = tx ?? this.dbService.db;
    await db.insert(products).values({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
    });
  }

  async getProducts({ tx }: TXOptions = {}): Promise<Product[]> {
    const db = tx ?? this.dbService.db;
    const rows = await db.query.products.findMany();
    return rows.map((row) => new Product(row.id, row.name, row.quantity));
  }

  async updateProduct(product: Product, { tx }: TXOptions = {}): Promise<void> {
    const db = tx ?? this.dbService.db;
    await db
      .update(products)
      .set({
        name: product.name,
        quantity: product.quantity,
      })
      .where(eq(products.id, product.id));
  }

  async getProductsByIds(
    productIds: string[],
    { tx }: TXOptions = {},
  ): Promise<Product[]> {
    const db = tx ?? this.dbService.db;
    const rows = await db.query.products.findMany({
      where: inArray(products.id, productIds),
    });
    return rows.map((row) => new Product(row.id, row.name, row.quantity));
  }

  async getReservations({ tx }: TXOptions = {}): Promise<Reservation[]> {
    const db = tx ?? this.dbService.db;
    const rows = await db.query.reservations.findMany();
    return rows.map(
      (row) =>
        new Reservation(
          row.id,
          row.orderId,
          row.productId,
          row.quantity,
          row.status,
        ),
    );
  }

  async addReservation(
    reservation: Reservation,
    { tx }: TXOptions = {},
  ): Promise<void> {
    const db = tx ?? this.dbService.db;
    await db.insert(reservations).values({
      id: reservation.id,
      orderId: reservation.orderId,
      productId: reservation.productId,
      quantity: reservation.quantity,
      status: reservation.status,
    });
  }

  async getReservationsByOrderId(
    orderId: string,
    { tx }: TXOptions = {},
  ): Promise<Reservation[]> {
    const db = tx ?? this.dbService.db;
    const rows = await db.query.reservations.findMany({
      where: eq(reservations.orderId, orderId),
    });
    return rows.map(
      (row) =>
        new Reservation(
          row.id,
          row.orderId,
          row.productId,
          row.quantity,
          row.status,
        ),
    );
  }

  async updateReservation(
    reservation: Reservation,
    { tx }: TXOptions = {},
  ): Promise<void> {
    const db = tx ?? this.dbService.db;
    await db
      .update(reservations)
      .set({
        orderId: reservation.orderId,
        productId: reservation.productId,
        quantity: reservation.quantity,
        status: reservation.status,
      })
      .where(eq(reservations.id, reservation.id));
  }

  async deleteAll({ tx }: TXOptions = {}): Promise<void> {
    await this.dbService.transaction(
      async (tx) => {
        await tx.delete(reservations).execute();
        await tx.delete(products).execute();
      },
      { tx },
    );
  }
}
