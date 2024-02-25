const ORDERS_URL = process.env.ORDERS_URL as string;
const PRODUCTS_URL = process.env.PRODUCTS_URL as string;
const PAYMENTS_URL = process.env.PAYMENTS_URL as string;

export async function POST(request: Request) {
  const clearOrdersUrl = `${ORDERS_URL}/api/v1/reset`;
  const clearProductsUrl = `${PRODUCTS_URL}/api/v1/reset`;
  const clearPaymentsUrl = `${PAYMENTS_URL}/api/v1/reset`;

  await fetch(clearOrdersUrl, { method: "POST" });
  await fetch(clearProductsUrl, { method: "POST" });
  await fetch(clearPaymentsUrl, { method: "POST" });

  return new Response();
}
