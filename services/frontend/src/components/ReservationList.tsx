"use client";

import { ReservationDto, ReservationStatus } from "@/types/ReservationDto";
import { useQuery } from "react-query";

async function queryReservations(): Promise<ReservationDto[]> {
  const res = await fetch("/api/reservations");
  return res.json();
}

export function ReservationList() {
  const { data: reservations, status } = useQuery(
    "reservations",
    queryReservations,
    {
      refetchInterval: 1000,
    }
  );

  return (
    <div className="p-1">
      <h1>Reservations: {status !== "success" && status}</h1>
      <table>
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations &&
            reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.orderId.substring(0, 6)}</td>
                <td>{reservation.productId}</td>
                <td className="text-right">{reservation.quantity}</td>
                <td
                  className={`${
                    reservation.status === ReservationStatus.CONSUMED
                      ? "bg-green-200"
                      : reservation.status === ReservationStatus.CANCELED
                      ? "bg-red-200"
                      : ""
                  }`}
                >
                  {reservation.status}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
