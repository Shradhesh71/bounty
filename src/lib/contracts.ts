// src/lib/contracts.ts
import BOUNTY_AGENT_ABI from "@/abi/BountyAgent.json";
export const BOUNTY_AGENT_ADDRESS =
  "0xCb3A52d8Aa05037F71d02b057Cfa3e945f9B6ddc";
// "0xA5A57A5c5D4cbBdD7C8582cE6E25D6b34702b14A";
export const BountyAgentConfig = {
  address: BOUNTY_AGENT_ADDRESS as `0x${string}`,
  abi: BOUNTY_AGENT_ABI,
};

export const USDC_ADDRESS = '0x35df7448d18C27bC03544dF3Cd1b16195E489254';
export const USDC_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

export const BOUNTY_NFT_ADDRESS = "0x83361a50558123Fbbe033E8E079e954A4614bA7d";