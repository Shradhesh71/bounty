import { X402Client } from "@coinbase/x402pay";

export const x402 = new X402Client({
  apiKey: process.env.NEXT_PUBLIC_X402_API_KEY!,      // front-end key
  environment: "testnet",                              // or "mainnet"
});