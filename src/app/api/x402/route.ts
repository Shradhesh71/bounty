import { createX402ExpressHandler } from "x402-express";

export default createX402ExpressHandler({
  apiKey: process.env.X402_API_KEY,
  onPayment: async (paymentId, amount, metadata) => {
    // Handle successful payment
    // Mark user as paid, unlock submission form, etc.
    // You can use a database or global state here
    return { status: "ok" };
  },
});
