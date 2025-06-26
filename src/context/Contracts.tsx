"use client";
import { createContext, useContext } from "react";
import { getContract } from "viem";
import BountyAgentABI from "@/abi/BountyAgent.json";
import BountyNFTABI from "@/abi/BountyNFT.json";
import { BOUNTY_AGENT_ADDRESS, BOUNTY_NFT_ADDRESS } from "@/lib/contracts";

type ContractsContextType = {
  agent: ReturnType<typeof getContract>;
  nft: ReturnType<typeof getContract>;
} | null;

const ContractsContext = createContext<ContractsContextType>(null);

import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export function ContractsProvider({ children }: React.PropsWithChildren<{}>) {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const agent = getContract({
    address: BOUNTY_AGENT_ADDRESS,
    abi: BountyAgentABI.abi,
    client,
  });

  const nft = getContract({
    address: BOUNTY_NFT_ADDRESS,
    abi: BountyNFTABI.abi,
    client,
  });

  return (
    <ContractsContext.Provider value={{ agent, nft }}>
      {children}
    </ContractsContext.Provider>
  );
}

export function useContracts() {
  const ctx = useContext(ContractsContext);
  if (!ctx) throw new Error("useContracts() must be inside ContractsProvider");
  return ctx;
}