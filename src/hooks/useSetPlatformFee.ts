import { useWriteContract } from 'wagmi';
import { BOUNTY_AGENT_ADDRESS, BountyAgentConfig } from '@/lib/contracts';

export function useSetPlatformFee() {
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const setFee = async (bps: number) => {
     writeContract({
      address: BOUNTY_AGENT_ADDRESS,
      abi: BountyAgentConfig.abi.abi,
      functionName: 'setPlatformFee',
      args: [bps],
    });
  };
  return { setFee, isPending, isSuccess, isError };
}