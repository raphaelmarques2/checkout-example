import { OrderRepository } from './OrderRepository';
import { Order } from '../entities/Order';

export class MemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async addOrder(order: Order): Promise<void> {
    this.orders.push(order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((orders) => orders.id === id) ?? null;
  }

  async updateOrder(order: Order): Promise<void> {
    const index = this.orders.findIndex((p) => p.id === order.id);
    this.orders[index] = order;
  }

  async getOrders(): Promise<Order[]> {
    return this.orders;
  }

  async deleteAllOrders(): Promise<void> {
    this.orders = [];
  }
}
