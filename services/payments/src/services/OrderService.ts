import axios from 'axios';

export class OrderService {
  baseURL: string;

  constructor() {
    this.baseURL = process.env.ORDERS_URL!;
  }

  async getOrder(id: string): Promise<OrderDto> {
    const response = await axios.get(`${this.baseURL}/api/v1/orders/${id}`);
    return response.data;
  }
}

export type OrderItem = {
  productId: string;
  quantity: number;
};

export enum OrderStatus {
  CREATED = 'created',
  CANCELED = 'canceled',
  FINISHED = 'finished',
}

export type OrderDto = {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
};
