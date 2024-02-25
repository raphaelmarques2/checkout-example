import { v4 as uuid } from 'uuid';
import { OrderDto } from '../dtos/OrderDto';
import { Order, OrderStatus, OrderItem } from '../entities/Order';
import { OrderRepository } from '../repositories/OrderRepository';
import { EventBus } from '../events/EventBus';
import {
  OrderCanceledEvent,
  OrderCreatedEvent,
  OrderFinishedEvent,
  ReservationCanceledEvent,
  ReservationConsumedEvent,
  ReservationFailedEvent,
} from '../events/events';
import createHttpError from 'http-errors';
import { DbService } from '../repositories/DbService';

export type CreateOrderInput = {
  products: OrderItem[];
  totalAmount: number;
};

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private eventBus: EventBus,
    private dbService: DbService,
  ) {}

  async createOrder(input: CreateOrderInput): Promise<OrderDto> {
    const product = new Order(
      uuid(),
      input.products,
      input.totalAmount,
      OrderStatus.CREATED,
    );

    await this.dbService.transaction(async (tx) => {
      await this.orderRepository.addOrder(product, { tx });

      await this.eventBus.publish<OrderCreatedEvent>('order.created', {
        orderId: product.id,
      });
    });

    return new OrderDto(product);
  }

  async getOrders(): Promise<OrderDto[]> {
    const orders = await this.orderRepository.getOrders();
    return orders.map((order) => new OrderDto(order));
  }

  async getOrder(id: string): Promise<OrderDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new createHttpError.NotFound('Order not found');
    }
    return new OrderDto(order);
  }

  async cancelOrder(
    message: ReservationCanceledEvent | ReservationFailedEvent,
  ) {
    await this.dbService.transaction(async (tx) => {
      const order = await this.orderRepository.findById(
        message.payload.orderId,
        { tx },
      );
      if (!order) {
        throw new createHttpError.NotFound('Order not found');
      }
      order.status = OrderStatus.CANCELED;
      await this.orderRepository.updateOrder(order, { tx });

      await this.eventBus.publish<OrderCanceledEvent>('order.canceled', {
        orderId: order.id,
      });
    });
  }

  async finishOrder(message: ReservationConsumedEvent) {
    await this.dbService.transaction(async (tx) => {
      const order = await this.orderRepository.findById(
        message.payload.orderId,
        { tx },
      );
      if (!order) {
        throw new createHttpError.NotFound('Order not found');
      }
      order.status = OrderStatus.FINISHED;
      await this.orderRepository.updateOrder(order, { tx });

      await this.eventBus.publish<OrderFinishedEvent>('order.finished', {
        orderId: order.id,
      });
    });
  }

  async reset() {
    await this.orderRepository.deleteAllOrders();
  }
}
