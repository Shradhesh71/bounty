import { useContractRead } from 'wagmi';
import { BOUNTY_AGENT_ADDRESS, BountyAgentConfig } from '@/lib/contracts';

type Bounty = {
  creator: string;
  prize: bigint;
  entryFee: bigint;
  maxWinners: number;
  deadline: bigint;
  settled: boolean;
  canceled: boolean;
  topic: string;
  description: string;
};

export function useBountyDetails(bountyId: number) {
  const { data, isLoading, error } = useContractRead({
    address: BOUNTY_AGENT_ADDRESS,
    abi: BountyAgentConfig.abi.abi,
    functionName: 'bounties',
    args: [bountyId],
  });

  const bounty: Bounty | undefined =
    data && typeof data === 'object' && data !== null && 'maxWinners' in data
      ? {
          creator: (data as any).creator,
          prize: (data as any).prize,
          entryFee: (data as any).entryFee,
          maxWinners: Number((data as any).maxWinners),
          deadline: (data as any).deadline,
          settled: (data as any).settled,
          canceled: (data as any).canceled,
          topic: (data as any).topic,
          description: (data as any).description,
        }
      : undefined;

  return { bounty, isLoading, error };
}
