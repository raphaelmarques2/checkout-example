import { Product } from '../entities/Product';
import { Reservation } from '../entities/Reservation';
import { ProductRepository } from './ProductRepository';

export class MemoryProductRepository implements ProductRepository {
  private products: Product[] = [];
  private reservations: Reservation[] = [];

  constructor() {}

  async addProduct(product: Product): Promise<void> {
    this.products.push(product);
  }

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async updateProduct(product: Product): Promise<void> {
    const index = this.products.findIndex((p) => p.id === product.id);
    this.products[index] = product;
  }

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    return this.products.filter((product) => productIds.includes(product.id));
  }

  async addReservation(reservation: Reservation): Promise<void> {
    this.reservations.push(reservation);
  }

  async getReservationsByOrderId(orderId: string): Promise<Reservation[]> {
    return this.reservations.filter((r) => r.orderId === orderId);
  }

  async updateReservation(reservation: Reservation): Promise<void> {
    const index = this.reservations.findIndex((r) => r.id === reservation.id);
    this.reservations[index] = reservation;
  }

  async getReservations(): Promise<Reservation[]> {
    return this.reservations;
  }

  async deleteAll(): Promise<void> {
    this.reservations = [];
  }
}
