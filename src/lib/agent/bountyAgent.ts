import { walle } from "@coinbase/coinbase-sdk";

export async function getCoinbaseAgent() {
  const wallet = new CoinbaseWallet({
    appName: "On-Chain Bounty Board",
    appChainIds: [11155111], // Sepolia
    smartWalletOnly: true,
    // Optional: pass API key if needed
    // apiKey: process.env.COINBASE_API_KEY,
  });
  await wallet.connect();
  return wallet;
}
