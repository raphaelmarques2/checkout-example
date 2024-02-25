export type EventMessage<T> = {
  id: string;
  name: string;
  timestamp: string;
  payload: T;
};

export type ReservationCreatedEvent = EventMessage<{
  orderId: string;
}> & {
  name: 'reservation.created';
};

export type PaymentCreatedEvent = EventMessage<{
  orderId: string;
  paymentId: string;
}> & {
  name: 'payment.created';
};

export type PaymentFailedEvent = EventMessage<{
  orderId: string;
  paymentId: string;
}> & {
  name: 'payment.failed';
};

export type PaymentProcessedEvent = EventMessage<{
  orderId: string;
  paymentId: string;
}> & {
  name: 'payment.processed';
};
