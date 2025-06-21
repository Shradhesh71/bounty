"use client";

import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BountyAgentConfig } from "@/lib/contracts";

interface Props {
  bountyId: bigint;
  submissions: { contributor: string; cid: string }[];
  maxWinners: number;
}

export default function WinnersForm({
  bountyId,
  submissions,
  maxWinners,
}: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const { data: hash, error, writeContract, isPending } = useWriteContract();

  // Wait for transaction confirmation
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Notify user when transaction is sent
  useEffect(() => {
    if (hash) {
      toast("Distribution tx sent", { description: hash });
    }
  }, [hash]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error("Distribution failed", { description: error.message });
    }
  }, [error]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Prizes distributed! 🎉");
    }
  }, [isSuccess]);

  const toggle = (idx: number) => {
    setSelected((curr) =>
      curr.includes(idx)
        ? curr.filter((i) => i !== idx)
        : curr.length < maxWinners
        ? [...curr, idx]
        : curr
    );
  };

  const handleDistribute = () => {
    if (selected.length === 0) {
      toast.error("Please select at least one winner");
      return;
    }
    // Map selected indices to contributor addresses
    const winners = selected.map((idx) => submissions[idx].contributor);
    writeContract({
      ...BountyAgentConfig,
      abi: BountyAgentConfig.abi.abi,
      functionName: "distributePrizes",
      args: [bountyId, winners],
    });
  };

  return (
    <div className="space-y-4">
      <p>
        Select up to {maxWinners} winner{maxWinners > 1 ? "s" : ""}:
      </p>
      <ul className="space-y-2">
        {submissions.map((s, idx) => (
          <li key={idx} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selected.includes(idx)}
              onChange={() => toggle(idx)}
              className="h-4 w-4 cursor-pointer"
            />
            <div>
              <p className="font-medium">{s.contributor}</p>
              <p className="text-sm text-muted-foreground">{s.cid}</p>
            </div>
          </li>
        ))}
      </ul>
      <Button
        onClick={handleDistribute}
        disabled={isPending || selected.length === 0}
      >
        {isPending
          ? "Distributing..."
          : `Distribute to ${selected.length} winner${
              selected.length > 1 ? "s" : ""
            }`}
      </Button>
    </div>
  );
}
