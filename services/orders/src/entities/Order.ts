export type OrderItem = {
  productId: string;
  quantity: number;
};

export enum OrderStatus {
  CREATED = 'created',
  CANCELED = 'canceled',
  FINISHED = 'finished',
}

export class Order {
  constructor(
    readonly id: string,
    public items: OrderItem[],
    public totalAmount: number,
    public status: OrderStatus,
  ) {}
}
