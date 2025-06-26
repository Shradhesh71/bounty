// src/pages/api/webhooks/x402.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import crypto from "crypto";
// import client from "@/lib/db"; // your DB client (Prisma/Mongo/etc)

const WEBHOOK_SECRET = process.env.X402_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers["x-402-signature"] as string;
  const payload = req.body;

  // 1. Verify signature (HMAC SHA256)
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest("hex");
  if (sig !== expected) {
    return res.status(400).end("Invalid signature");
  }

  // 2. Handle the event
  const event = payload; // adjust if wrapped in { type, data }
  if (event.type === "payment.completed") {
    const { metadata, amount, currency, id, timestamp } = event.data;
    // await client.payment.create({
    //   data: {
    //     paymentId: id,
    //     bountyId: parseInt(metadata.bountyId),
    //     cid: metadata.cid,
    //     amount,
    //     currency,
    //     timestamp: new Date(timestamp),
    //   },
    // });
  }

  res.status(200).json({ received: true });
}
