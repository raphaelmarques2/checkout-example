const PRODUCTS_URL = process.env.PRODUCTS_URL as string;

export async function GET(request: Request) {
  const url = `${PRODUCTS_URL}/api/v1/products`;

  const data = await fetch(url, { cache: "no-cache" }).then((res) =>
    res.json()
  );

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}
