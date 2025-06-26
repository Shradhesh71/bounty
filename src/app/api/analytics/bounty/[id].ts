// src/pages/api/analytics/bounty/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
// import client from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bountyId = parseInt(req.query.id as string);
  // const payments = await client.payment.findMany({ where: { bountyId } });
  // const total = payments.reduce((sum: any, p: any) => sum + p.amount, 0);
  res.status(200).json({
    // totalRevenue: total,
    // submissions: payments.length,
    // payments,
  });
}
