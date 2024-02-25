"use client";
import { OrderItem } from "@/types/OrderDto";
import { useState } from "react";

export function OrderSender() {
  const [description, setDescription] = useState("");

  const sendOrder = async (data: CreateOrderInput) => {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const clearAll = async () => {
    await fetch("/api/reset", { method: "POST" });
  };

  return (
    <>
      <div className="">
        <button
          className="btn btn-red m-1"
          onClick={clearAll}
          onMouseEnter={() => setDescription("Reset all data")}
          onMouseLeave={() => setDescription("")}
        >
          Reset
        </button>
        {createOrderExamples.map((example, i) => (
          <button
            key={i}
            className="btn m-1"
            onClick={() => sendOrder(example.data)}
            onMouseEnter={() => setDescription(example.description)}
            onMouseLeave={() => setDescription("")}
          >
            {example.name}
          </button>
        ))}
      </div>
      <p className="text-xs italic">Description: {description}</p>
    </>
  );
}

type CreateOrderInput = {
  products: OrderItem[];
  totalAmount: number;
};

const createOrderExamples: {
  name: string;
  description: string;
  data: CreateOrderInput;
}[] = [
  {
    name: "Order 10 A",
    data: {
      products: [{ productId: "a", quantity: 10 }],
      totalAmount: 150,
    },
    description: "Order 10 Adapters",
  },
  {
    name: "Order 5 B",
    data: {
      products: [{ productId: "b", quantity: 5 }],
      totalAmount: 100,
    },
    description: "Order 5 Batteries",
  },
  {
    name: "Order 10 A+B",
    data: {
      products: [
        { productId: "a", quantity: 10 },
        { productId: "b", quantity: 10 },
      ],
      totalAmount: 50,
    },
    description: "Order 10 Adapters and 10 Batteries",
  },
  {
    name: "Order 40 C",
    data: {
      products: [{ productId: "c", quantity: 40 }],
      totalAmount: 1000,
    },
    description: "Order 40 Chargers",
  },
  {
    name: "Order invalid product",
    data: {
      products: [{ productId: "x", quantity: 1 }],
      totalAmount: 10,
    },
    description:
      "Order 1 product X. It will fail because product X doesn't exist.",
  },
  {
    name: "Order invalid amount",
    data: {
      products: [{ productId: "a", quantity: 10 }],
      totalAmount: 0.5,
    },
    description:
      "Order amount $0.50. It will fail on payment step and undo the reservation.",
  },
];
