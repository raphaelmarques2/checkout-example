import { Product } from '../entities/Product';

export class ProductDto {
  public id: string;
  public name: string;
  public quantity: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.quantity = product.quantity;
  }
}
