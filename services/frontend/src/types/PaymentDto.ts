export enum PaymentStatus {
  CREATED = "created",
  FAILED = "failed",
  PROCESSED = "processed",
}

export type PaymentDto = {
  id: string;
  orderId: string;
  status: PaymentStatus;
  amount: number;
};
