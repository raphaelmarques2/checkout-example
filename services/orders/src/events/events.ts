export type EventMessage<T> = {
  id: string;
  name: string;
  timestamp: string;
  payload: T;
};

export type OrderCreatedEvent = EventMessage<{ orderId: string }> & {
  name: 'order.created';
};
export type OrderCanceledEvent = EventMessage<{ orderId: string }> & {
  name: 'order.canceled';
};
export type OrderFinishedEvent = EventMessage<{ orderId: string }> & {
  name: 'order.finished';
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

export type ReservationFailedEvent = EventMessage<{
  orderId: string;
}> & {
  name: 'reservation.failed';
};
