// src/pages/api/x402/create-payment.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { bountyId, cid, amount } = req.body;
  if (!bountyId || !cid || !amount) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // 1. Call x402pay's create payment endpoint
    const response = await axios.post(
      "https://api.x402pay.com/v1/payments",
      {
        amount,           // e.g. 0.01
        currency: "ETH",  // or whichever chain
        metadata: { bountyId, cid },
        // Optional: success_url, cancel_url
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/submit/${bountyId}?paid=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/submit/${bountyId}?paid=false`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.X402_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 2. Return the URL for the hosted checkout
    return res.status(200).json({ checkoutUrl: response.data.checkout_url });
  } catch (err: any) {
    console.error("x402 create-payment error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to create x402 payment" });
  }
}
