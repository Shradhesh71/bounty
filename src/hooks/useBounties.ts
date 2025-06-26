import { useContractRead } from 'wagmi';
import { BOUNTY_AGENT_ADDRESS, BountyAgentConfig } from "@/lib/contracts";

export function useBounties() {
  const { data, isError, isLoading } = useContractRead({
    address: BOUNTY_AGENT_ADDRESS,
    abi: BountyAgentConfig.abi.abi,
    functionName: 'bountyCount',
  });
  const count = data ? Number(data) : 0;
  return { count, isError, isLoading };
}