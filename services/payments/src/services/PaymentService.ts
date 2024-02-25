import { Payment, PaymentStatus } from '../entities/Payment';
import { EventBus } from '../events/EventBus';
import { PaymentCreatedEvent, ReservationCreatedEvent } from '../events/events';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { OrderService } from './OrderService';
import { ExternalPaymentService } from './ExternalPaymentService';
import { PaymentDto } from '../dtos/PaymentDto';
import { v4 as uuid } from 'uuid';

export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private eventBus: EventBus,
    private orderService: OrderService,
    private externalPaymentService: ExternalPaymentService,
  ) {}

  async getPayments(): Promise<PaymentDto[]> {
    const payments = await this.paymentRepository.getPayments();
    return payments.map((payment) => new PaymentDto(payment));
  }

  async createPayment(message: ReservationCreatedEvent): Promise<void> {
    const order = await this.orderService.getOrder(message.payload.orderId);

    const payment = new Payment(
      uuid(),
      message.payload.orderId,
      order.totalAmount,
      PaymentStatus.CREATED,
    );
    await this.paymentRepository.addPayment(payment);

    await this.eventBus.publish<PaymentCreatedEvent>('payment.created', {
      orderId: message.payload.orderId,
      paymentId: payment.id,
    });
  }

  async processPayment(message: PaymentCreatedEvent): Promise<void> {
    const payment = await this.paymentRepository.getPaymentById(
      message.payload.paymentId,
    );
    if (!payment) throw new Error('Payment not found');

    const success = await this.externalPaymentService.pay(payment);

    payment.status = success ? PaymentStatus.PROCESSED : PaymentStatus.FAILED;
    await this.paymentRepository.updatePayment(payment);

    if (success) {
      await this.eventBus.publish('payment.processed', {
        orderId: message.payload.orderId,
        paymentId: payment.id,
      });
    } else {
      await this.eventBus.publish('payment.failed', {
        orderId: message.payload.orderId,
        paymentId: payment.id,
      });
    }
  }

  async reset() {
    await this.paymentRepository.deleteAllPayments();
  }
}
