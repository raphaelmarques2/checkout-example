import { Product } from '../entities/Product';
import { Reservation } from '../entities/Reservation';
import { TXOptions } from './DbService';

export interface ProductRepository {
  addProduct(product: Product, options?: TXOptions): Promise<void>;
  getProducts(options?: TXOptions): Promise<Product[]>;
  updateProduct(product: Product, options?: TXOptions): Promise<void>;
  getProductsByIds(
    productIds: string[],
    options?: TXOptions,
  ): Promise<Product[]>;

  getReservations(options?: TXOptions): Promise<Reservation[]>;
  addReservation(reservation: Reservation, options?: TXOptions): Promise<void>;
  getReservationsByOrderId(
    orderId: string,
    options?: TXOptions,
  ): Promise<Reservation[]>;
  updateReservation(
    reservation: Reservation,
    options?: TXOptions,
  ): Promise<void>;

  deleteAll(options?: TXOptions): Promise<void>;
}
