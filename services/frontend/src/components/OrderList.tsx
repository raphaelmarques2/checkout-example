"use client";
import { useQuery } from "react-query";
import { OrderStatus, type OrderDto } from "../types/OrderDto";

async function queryOrders(): Promise<OrderDto[]> {
  const res = await fetch("/api/orders");
  return res.json();
}

export function OrderList() {
  const {
    data: orders,
    status,
    isFetching,
    isLoading,
    isRefetching,
  } = useQuery("orders", queryOrders, {
    refetchInterval: 1000,
  });

  return (
    <div className="p-1">
      <h1>Orders: {status !== "success" && status}</h1>
      <table>
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Products</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.substring(0, 6)}</td>
                <td>
                  {order.items
                    .map((p) => `${p.quantity} ${p.productId}`)
                    .join(", ")}
                </td>
                <td className="text-right">${order.totalAmount}</td>
                <td
                  className={`${
                    order.status === OrderStatus.FINISHED
                      ? "bg-green-200"
                      : order.status === OrderStatus.CANCELED
                      ? "bg-red-200"
                      : ""
                  }`}
                >
                  {order.status}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
