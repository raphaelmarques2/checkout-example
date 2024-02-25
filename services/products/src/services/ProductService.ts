import { v4 as uuid } from 'uuid';
import { OrderService } from './OrderService';
import { ProductRepository } from '../repositories/ProductRepository';
import { Reservation, ReservationStatus } from '../entities/Reservation';
import { EventBus } from '../events/EventBus';
import {
  OrderCreatedEvent,
  PaymentFailedEvent,
  PaymentProcessedEvent,
  ReservationCanceledEvent,
  ReservationConsumedEvent,
  ReservationCreatedEvent,
  ReservationFailedEvent,
} from '../events/events';
import { Product } from '../entities/Product';
import { ReservationDto } from '../dtos/ReservationDto';
import { ProductDto } from '../dtos/ProductDto';

export type ReserveProductInput = {
  orderId: string;
  productId: string;
  customerId: string;
};

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private eventBus: EventBus,
    private orderService: OrderService,
  ) {}

  async getProducts(): Promise<ProductDto[]> {
    const products = await this.productRepository.getProducts();
    return products.map((product) => new ProductDto(product));
  }

  async getReservations(): Promise<ReservationDto[]> {
    const reservations = await this.productRepository.getReservations();
    return reservations.map((reservation) => new ReservationDto(reservation));
  }

  async createReservation(event: OrderCreatedEvent): Promise<void> {
    const order = await this.orderService.getOrder(event.payload.orderId);
    const productIds = await order.items.map((p) => p.productId);
    const products = await this.productRepository.getProductsByIds(productIds);

    if (products.length !== order.items.length) {
      await this.eventBus.publish<ReservationFailedEvent>(
        'reservation.failed',
        { orderId: event.payload.orderId },
      );
      return;
    }
    const productsMap = Object.fromEntries(products.map((p) => [p.id, p]));

    for (const productOrder of order.items) {
      const product = productsMap[productOrder.productId];
      if (product.quantity < productOrder.quantity) {
        await this.eventBus.publish<ReservationFailedEvent>(
          'reservation.failed',
          { orderId: event.payload.orderId },
        );
        return;
      }
    }

    const newReservations = order.items.map((productOrder) => {
      productsMap[productOrder.productId].quantity -= productOrder.quantity;

      return new Reservation(
        uuid(),
        order.id,
        productOrder.productId,
        productOrder.quantity,
        ReservationStatus.CREATED,
      );
    });
    for (const reservation of newReservations) {
      await this.productRepository.addReservation(reservation);
    }
    for (const product of products) {
      await this.productRepository.updateProduct(product);
    }

    await this.eventBus.publish<ReservationCreatedEvent>(
      'reservation.created',
      { orderId: event.payload.orderId },
    );
  }

  async consumeReservation(message: PaymentProcessedEvent) {
    const reservations = await this.productRepository.getReservationsByOrderId(
      message.payload.orderId,
    );

    for (const reservation of reservations) {
      reservation.status = ReservationStatus.CONSUMED;
      await this.productRepository.updateReservation(reservation);
    }

    await this.eventBus.publish<ReservationConsumedEvent>(
      'reservation.consumed',
      { orderId: message.payload.orderId },
    );
  }

  async cancelReservation(message: PaymentFailedEvent) {
    const reservations = await this.productRepository.getReservationsByOrderId(
      message.payload.orderId,
    );

    const productsIds = reservations.map((r) => r.productId);
    const products = await this.productRepository.getProductsByIds(productsIds);

    const productsMap = Object.fromEntries(products.map((p) => [p.id, p]));

    for (const reservation of reservations) {
      const product = productsMap[reservation.productId];
      product.quantity += reservation.quantity;
      await this.productRepository.updateProduct(product);

      reservation.status = ReservationStatus.CANCELED;
      await this.productRepository.updateReservation(reservation);
    }

    await this.eventBus.publish<ReservationCanceledEvent>(
      'reservation.canceled',
      {
        orderId: message.payload.orderId,
      },
    );
  }

  async reset() {
    await this.productRepository.deleteAll();
    await this.populate();
  }

  async initDb() {
    const products = await this.productRepository.getProducts();
    if (products.length === 0) {
      await this.populate();
    }
  }

  private async populate() {
    const products = [
      new Product('a', 'Adapter', 100),
      new Product('b', 'Battery', 100),
      new Product('c', 'Charger', 100),
    ];
    for (const product of products) {
      await this.productRepository.addProduct(product);
    }
  }
}
