const ORDERS_URL = process.env.ORDERS_URL as string;

export async function GET(request: Request) {
  const url = `${ORDERS_URL}/api/v1/orders`;

  const data = await fetch(url, { cache: "no-cache" }).then((res) =>
    res.json()
  );

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}

export async function POST(request: Request) {
  const url = `${ORDERS_URL}/api/v1/orders`;

  const data = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(await request.json()),
  }).then((res) => res.json());

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}
