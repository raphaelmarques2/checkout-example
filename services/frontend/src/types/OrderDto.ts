export type OrderItem = {
  productId: string;
  quantity: number;
};

export enum OrderStatus {
  CREATED = "created",
  CANCELED = "canceled",
  FINISHED = "finished",
}

export type OrderDto = {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
};
