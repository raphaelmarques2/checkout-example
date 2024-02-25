import { ProductService } from '../services/ProductService';
import { EventBus } from './EventBus';
import {
  OrderCreatedEvent,
  PaymentFailedEvent,
  PaymentProcessedEvent,
} from './events';

export class EventConsumer {
  constructor(
    private eventBus: EventBus,
    private productService: ProductService,
  ) {
    this.eventBus.subscribe(
      'order.created',
      async (message: OrderCreatedEvent) => this.handleOrderCreated(message),
    );
    this.eventBus.subscribe(
      'payment.failed',
      async (message: PaymentFailedEvent) => this.handlePaymentFailed(message),
    );
    this.eventBus.subscribe(
      'payment.processed',
      async (message: PaymentProcessedEvent) =>
        this.handlePaymentProcessed(message),
    );
  }
  async handleOrderCreated(message: OrderCreatedEvent) {
    console.log('event received', message);
    await this.productService.createReservation(message);
  }

  async handlePaymentFailed(message: PaymentFailedEvent) {
    console.log('event received', message);
    await this.productService.cancelReservation(message);
  }

  async handlePaymentProcessed(message: PaymentProcessedEvent) {
    console.log('event received', message);
    await this.productService.consumeReservation(message);
  }
}
