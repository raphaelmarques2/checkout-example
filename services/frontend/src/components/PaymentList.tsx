"use client";

import { PaymentDto, PaymentStatus } from "@/types/PaymentDto";
import { useQuery } from "react-query";

async function queryPayments(): Promise<PaymentDto[]> {
  const res = await fetch("/api/payments");
  return res.json();
}

export function PaymentList() {
  const { data: payments, status } = useQuery("payments", queryPayments, {
    refetchInterval: 1000,
  });

  return (
    <div className="p-1">
      <h1>Payments: {status !== "success" && status}</h1>
      <table>
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments &&
            payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.orderId.substring(0, 6)}</td>
                <td className="text-right">${payment.amount}</td>
                <td
                  className={`${
                    payment.status === PaymentStatus.PROCESSED
                      ? "bg-green-200"
                      : payment.status === PaymentStatus.FAILED
                      ? "bg-red-200"
                      : ""
                  }`}
                >
                  {payment.status}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
