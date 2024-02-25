export enum ReservationStatus {
  CREATED = 'created',
  CANCELED = 'canceled',
  CONSUMED = 'consumed',
}

export class Reservation {
  constructor(
    readonly id: string,
    readonly orderId: string,
    readonly productId: string,
    readonly quantity: number,
    public status: ReservationStatus,
  ) {}
}
