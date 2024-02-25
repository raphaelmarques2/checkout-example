import { Order, OrderStatus, OrderItem } from '../entities/Order';

export class OrderDto {
  readonly id: string;
  public items: OrderItem[];
  public totalAmount: number;
  public status: OrderStatus;

  constructor(order: Order) {
    this.id = order.id;
    this.items = order.items;
    this.totalAmount = order.totalAmount;
    this.status = order.status;
  }
}
