export enum PaymentStatus {
  CREATED = 'created',
  FAILED = 'failed',
  PROCESSED = 'processed',
}

export class Payment {
  constructor(
    readonly id: string,
    readonly orderId: string,
    readonly amount: number,
    public status: PaymentStatus,
  ) {}
}
