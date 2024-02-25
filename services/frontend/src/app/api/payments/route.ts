const PAYMENTS_URL = process.env.PAYMENTS_URL as string;

export async function GET(request: Request) {
  const url = `${PAYMENTS_URL}/api/v1/payments`;

  const data = await fetch(url, { cache: "no-cache" }).then((res) =>
    res.json()
  );

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}
