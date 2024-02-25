export enum ReservationStatus {
  CREATED = "created",
  CANCELED = "canceled",
  CONSUMED = "consumed",
}

export type ReservationDto = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  status: ReservationStatus;
};
