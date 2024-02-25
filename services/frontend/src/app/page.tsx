"use client";
import { OrderList } from "@/components/OrderList";
import { OrderSender } from "@/components/OrderSender";
import { PaymentList } from "@/components/PaymentList";
import { ReservationList } from "@/components/ReservationList";
import { ProductList } from "@/components/ProductList";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <OrderSender />
        <ProductList />
        <div className="flex space-x-2">
          <OrderList />
          <ReservationList />
          <PaymentList />
        </div>
      </QueryClientProvider>
    </main>
  );
}
