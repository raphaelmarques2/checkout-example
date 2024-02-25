export type EventMessage<T> = {
  id: string;
  name: string;
  timestamp: string;
  payload: T;
};

export type OrderCreatedEvent = EventMessage<{
  orderId: string;
}> & {
  name: 'order.created';
};

export type ReservationCreatedEvent = EventMessage<{
  orderId: string;
}> & {
  name: 'reservation.created';
};

export type ReservationFailedEvent = EventMessage<{
  orderId: string;
}> & {
  name: 'reservation.failed';
};

export type ReservationConsumedEvent = EventMessage<{
  orderId: string;
}> & {
  name: 'reservation.consumed';
};

export type ReservationCanceledEvent = EventMessage<{
  orderId: string;
}> & {
  name: 'reservation.canceled';
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
