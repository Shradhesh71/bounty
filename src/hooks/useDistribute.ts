import { useWriteContract } from 'wagmi';
import { BOUNTY_AGENT_ADDRESS, BountyAgentConfig } from '@/lib/contracts';

export function useDistributePrizes() {
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const distribute = async (bountyId: number, winnerIndexes: number[]) => {
     writeContract({
      address: BOUNTY_AGENT_ADDRESS,
      abi: BountyAgentConfig.abi.abi,
      functionName: 'distributePrizes',
      args: [bountyId, winnerIndexes],
    });
  };
  return { distribute, isPending, isSuccess, isError };
}