import { PaymentService } from '../services/PaymentService';
import { EventBus } from './EventBus';
import { PaymentCreatedEvent, ReservationCreatedEvent } from './events';

export class EventConsumer {
  constructor(
    private eventBus: EventBus,
    private paymentService: PaymentService,
  ) {
    this.eventBus.subscribe(
      'reservation.created',
      (message: ReservationCreatedEvent) =>
        this.handleReservationCreated(message),
    );
    this.eventBus.subscribe('payment.created', (message: PaymentCreatedEvent) =>
      this.handlePaymentCreated(message),
    );
  }

  async handleReservationCreated(message: ReservationCreatedEvent) {
    console.log('EventConsumer: handleReservationCreated', message);
    await this.paymentService.createPayment(message);
  }

  async handlePaymentCreated(message: PaymentCreatedEvent) {
    console.log('EventConsumer: handlePaymentCreated', message);
    await this.paymentService.processPayment(message);
  }
}
