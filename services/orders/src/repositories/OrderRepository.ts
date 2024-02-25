import { Order } from '../entities/Order';
import { TXOptions } from './DbService';

export interface OrderRepository {
  addOrder(order: Order, options?: TXOptions): Promise<void>;
  updateOrder(order: Order, options?: TXOptions): Promise<void>;
  findById(id: string, options?: TXOptions): Promise<Order | null>;
  getOrders(options?: TXOptions): Promise<Order[]>;
  deleteAllOrders(options?: TXOptions): Promise<void>;
}
