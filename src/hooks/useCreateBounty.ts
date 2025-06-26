import { useWriteContract } from "wagmi";
import { BOUNTY_AGENT_ADDRESS, BountyAgentConfig } from "@/lib/contracts";

export function useCreateBounty() {
  const { writeContract, isPending, isSuccess, isError, error } = useWriteContract();
  const create = async (
    prize: number,
    entryFee: number,
    maxWinners: number,
    deadline: number,
    topic: string,
    description: string
  ) => {
    writeContract({
      address: BOUNTY_AGENT_ADDRESS,
      abi: BountyAgentConfig.abi.abi,
      functionName: "createBounty",
      args: [prize, entryFee, maxWinners, deadline, topic, description],
    });
  };
  console.log("isPending", isPending);
  console.log("isSuccess", isSuccess);
    console.log("isError", isError);
    console.log("error", error);

  return { create, isPending, isSuccess, isError, error};
}
