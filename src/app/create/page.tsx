"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BOUNTY_AGENT_ABI from "@/abi/BountyAgent.json";
import ERC20_ABI from "@/abi/ERC20.json";

const BOUNTY_AGENT_ADDRESS = "0xCb3A52d8Aa05037F71d02b057Cfa3e945f9B6ddc";
const USDC_ADDRESS = "0x9f582979470b73C72F2EA7465F0A3c17Fc582D9f";

export default function CreateBountyPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const [form, setForm] = useState({
    prize: "",
    entryFee: "",
    maxWinners: "",
    deadline: "",
    topic: "",
    description: "",
  });

  const [isApprovalPending, setIsApprovalPending] = useState(false);

  // Fetch current allowance for USDC
  const { data: allowance, error: allowanceError } = useReadContract( 
    address
      ? {
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: "allowance",
          args: [address, BOUNTY_AGENT_ADDRESS],
        }
      : undefined
  );
  console.log("Allowance error:", allowanceError);
  

  // Calculate prize amount safely
  const prizeAmount = form.prize ? parseUnits(form.prize, 6) : BigInt(0);
  const isApproved =
    typeof allowance === "bigint" &&
    allowance !== null &&
    allowance >= prizeAmount &&
    prizeAmount > BigInt(0);

  useEffect(() => {
  console.log("Allowance:", allowance);
  console.log("Prize Amount:", prizeAmount);
  console.log("Is Approved:", isApproved);
  if (allowanceError) {
    console.error("Allowance fetch error:", allowanceError);
  }
}, [allowance, prizeAmount, allowanceError]);

  // Approve USDC
  const { writeContract: approveUSDC, isPending: isApproving } = useWriteContract();

  // Create bounty
  const {
    writeContract: createBounty,
    data: createBountyData,
    error: createBountyError,
    isPending: isCreating,
  } = useWriteContract();

  const { isLoading: isWaitingTx, isSuccess: isBountyCreated } =
    useWaitForTransactionReceipt({
      hash: createBountyData,
    });

  // Handle transaction submission
  useEffect(() => {
    if (createBountyData) {
      toast("Transaction submitted...", { description: createBountyData });
    }
  }, [createBountyData]);

  // Handle transaction success
  useEffect(() => {
    if (isBountyCreated) {
      toast.success("Bounty created successfully!");
      router.push("/");
    }
  }, [isBountyCreated]);

  // Handle transaction errors
  useEffect(() => {
    if (createBountyError) {
      toast.error("Failed to create bounty", {
        description: createBountyError.message,
      });
    }
  }, [createBountyError]);

  // Reset approval pending state
  useEffect(() => {
    if (isApproved) {
      setIsApprovalPending(false);
    }
  }, [isApproved]);

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleApprove = () => {
    approveUSDC({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [BOUNTY_AGENT_ADDRESS, parseUnits("1000000", 6)],
    });
    toast("Approving USDC for BountyAgent...");
    setIsApprovalPending(true);
  };

  const handleCreateBounty = () => {
    // Validation
    if (!form.topic) {
      toast.error("Please enter a bounty topic.");
      return;
    }
    if (!form.description) {
      toast.error("Please enter a bounty description.");
      return;
    }
    if (!form.prize || parseFloat(form.prize) <= 0) {
      toast.error("Prize must be greater than 0 USDC.");
      return;
    }
    if (form.entryFee && parseFloat(form.entryFee) < 0) {
      toast.error("Entry fee cannot be negative.");
      return;
    }
    if (!form.maxWinners || parseInt(form.maxWinners) <= 0) {
      toast.error("Max winners must be greater than 0.");
      return;
    }
    if (!form.deadline) {
      toast.error("Please select a deadline.");
      return;
    }
    const deadlineTimestamp = Math.floor(new Date(form.deadline).getTime() / 1000);
    if (deadlineTimestamp <= Math.floor(Date.now() / 1000)) {
      toast.error("Deadline must be in the future.");
      return;
    }
    const prizeNumber = parseFloat(form.prize);
    if (isNaN(prizeNumber) || prizeNumber <= 0) {
  toast.error("Prize must be a positive number.");
  return;
}

    if (!isApproved) {
      toast.error("Please approve USDC spending first.");
      return;
    }

    createBounty({
      address: BOUNTY_AGENT_ADDRESS,
      abi: BOUNTY_AGENT_ABI.abi,
      functionName: "createBounty",
      args: [
        parseUnits(form.prize, 6),
        parseUnits(form.entryFee || "0", 6),
        parseInt(form.maxWinners),
        deadlineTimestamp,
        form.topic,
        form.description,
      ],
    });
  };

  const isFormValid = () => {
  const prizeNumber = parseFloat(form.prize);
  const entryFeeNumber = form.entryFee ? parseFloat(form.entryFee) : 0;
  const maxWinnersNumber = parseInt(form.maxWinners);
  const deadlineTimestamp = form.deadline
    ? Math.floor(new Date(form.deadline).getTime() / 1000)
    : 0;

  return (
    form.topic &&
    form.description &&
    !isNaN(prizeNumber) &&
    prizeNumber > 0 &&
    (!form.entryFee || (!isNaN(entryFeeNumber) && entryFeeNumber >= 0)) &&
    !isNaN(maxWinnersNumber) &&
    maxWinnersNumber > 0 &&
    form.deadline &&
    deadlineTimestamp > Math.floor(Date.now() / 1000)
  );
};

  return (
    <div className="max-w-xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Create a Bounty 📝</h2>

      <div className="space-y-4">
        <Input
          name="topic"
          type="text"
          placeholder="Bounty Topic (e.g., Develop a DeFi Dashboard)"
          value={form.topic}
          onChange={handleChange}
        />
        <Textarea
          name="description"
          placeholder="Bounty Description (e.g., Create a dashboard with real-time data)"
          value={form.description}
          onChange={handleChange}
        />
        <Input
          name="prize"
          type="number"
          min="0.000001"
          step="0.000001"
          placeholder="Prize (USDC)"
          value={form.prize}
          onChange={handleChange}
        />
        <Input
          name="entryFee"
          type="number"
          min="0"
          step="0.000001"
          placeholder="Entry Fee (USDC)"
          value={form.entryFee}
          onChange={handleChange}
        />
        <Input
          name="maxWinners"
          type="number"
          min="1"
          step="1"
          placeholder="Max Winners"
          value={form.maxWinners}
          onChange={handleChange}
        />
        <Input
          name="deadline"
          type="datetime-local"
          value={form.deadline}
          onChange={handleChange}
        />

        {!isApproved && (
          <Button
            onClick={handleApprove}
            disabled={!isConnected || isApproving || isApprovalPending}
          >
            {isApproving ? "Approving..." : "Approve USDC"}
          </Button>
        )}

        {isApprovalPending && (
          <p className="text-yellow-500">Waiting for approval to confirm...</p>
        )}

        <Button
          onClick={handleCreateBounty}
          disabled={!isConnected || isCreating || isWaitingTx || !isFormValid() || !isApproved}
          className="w-full"
        >
          {isCreating || isWaitingTx ? "Creating..." : "Create Bounty"}
        </Button>
      </div>
    </div>
  );
}