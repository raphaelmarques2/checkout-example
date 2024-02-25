"use client";

import { ProductDto } from "@/types/ProductDto";
import { useQuery } from "react-query";

async function queryProducts(): Promise<ProductDto[]> {
  const res = await fetch("/api/products");
  return res.json();
}

export function ProductList() {
  const { data: products, status } = useQuery("products", queryProducts, {
    refetchInterval: 1000,
  });

  return (
    <div className="p-1">
      <h1>Products: {status !== "success" && status}</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {products &&
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
