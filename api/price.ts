import type { VercelRequest, VercelResponse } from "@vercel/node";

const allowedOrigins = [
  "https://general-tensor.webflow.io",
  "https://generaltensor.io",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const apiKey = process.env.CMC_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Missing CMC_API_KEY environment variable" });
  }

  try {
    const url =
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=TAO&convert=USD";

    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: "CoinMarketCap request failed",
        status: response.status,
        details: text,
      });
    }

    const data = await response.json();

    const tao = data?.data?.TAO;
    const usd = tao?.quote?.USD;

    if (!usd) {
      return res.status(500).json({
        error: "Unexpected CoinMarketCap response shape",
        receivedKeys: Object.keys(data?.data || {}),
      });
    }

    return res.status(200).json({
      symbol: "TAO",
      name: tao?.name,
      price_usd: usd.price,
      change_24h_percent: usd.percent_change_24h,
      last_updated: usd.last_updated,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to fetch CoinMarketCap data" });
  }
}
