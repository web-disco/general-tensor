import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigin = "https://general-tensor.webflow.io/";

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // 4️⃣ Return normalized response
    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch CoinGecko data" });
  }
}
