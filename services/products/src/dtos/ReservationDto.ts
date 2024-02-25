import { Reservation, ReservationStatus } from '../entities/Reservation';

export class ReservationDto {
  public id: string;
  public orderId: string;
  public productId: string;
  public quantity: number;
  public status: ReservationStatus;

  constructor(reservation: Reservation) {
    this.id = reservation.id;
    this.orderId = reservation.orderId;
    this.productId = reservation.productId;
    this.quantity = reservation.quantity;
    this.status = reservation.status;
  }
}
