import { useWriteContract } from 'wagmi';
import { BOUNTY_AGENT_ADDRESS, BountyAgentConfig } from '@/lib/contracts';

export function useCancelBounty() {
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const cancel = async (bountyId: number) => {
     writeContract({
      address: BOUNTY_AGENT_ADDRESS,
      abi: BountyAgentConfig.abi.abi,
      functionName: 'cancelBounty',
      args: [bountyId],
    });
  };
  return { cancel, isPending, isSuccess, isError };
}