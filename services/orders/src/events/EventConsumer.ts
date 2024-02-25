import { OrderService } from '../services/OrderService';
import { EventBus } from './EventBus';
import {
  ReservationCanceledEvent,
  ReservationConsumedEvent,
  ReservationFailedEvent,
} from './events';

export class EventConsumer {
  constructor(
    private eventBus: EventBus,
    private orderService: OrderService,
  ) {
    this.eventBus.subscribe(
      'reservation.canceled',
      (message: ReservationCanceledEvent) =>
        this.handleReservationCanceled(message),
    );
    this.eventBus.subscribe(
      'reservation.failed',
      (message: ReservationFailedEvent) =>
        this.handleReservationFailed(message),
    );

    this.eventBus.subscribe(
      'reservation.consumed',
      (message: ReservationConsumedEvent) =>
        this.handleReservationConsumed(message),
    );
  }

  async handleReservationCanceled(message: ReservationCanceledEvent) {
    console.log('Handling reservation.canceled event', message);
    await this.orderService.cancelOrder(message);
  }

  async handleReservationFailed(message: ReservationFailedEvent) {
    console.log('Handling reservation.failed event', message);
    await this.orderService.cancelOrder(message);
  }

  async handleReservationConsumed(message: ReservationConsumedEvent) {
    console.log('Handling reservation.consumed event', message);
    await this.orderService.finishOrder(message);
  }
}
