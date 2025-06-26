import { useWriteContract } from "wagmi";
import { BOUNTY_AGENT_ADDRESS, BountyAgentConfig } from "@/lib/contracts";
import { useX402 } from "@/context/X402Pay";

export function useSubmitWork(bountyId: number) {
  const { open } = useX402();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const submit = async (cid: string, entryFee: number) => {
    open(entryFee, async () => {
      writeContract({
        address: BOUNTY_AGENT_ADDRESS,
        abi: BountyAgentConfig.abi.abi,
        functionName: "submitWork",
        args: [bountyId, cid],
      });
    });
  };
  return { submit, isPending, isSuccess, isError };
}
