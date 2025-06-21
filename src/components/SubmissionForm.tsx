"use client";

import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BountyAgentConfig } from "@/lib/contracts";

interface Props {
  bountyId: number;
  entryFee: bigint;
}

export default function SubmissionForm({ bountyId, entryFee }: Props) {
  const [cid, setCid] = useState("");
  const { data: hash, error, writeContract, isPending } = useWriteContract();

  // Wait for transaction confirmation
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Notify user when transaction is sent
  useEffect(() => {
    if (hash) {
      toast("Submission tx sent", { description: hash });
    }
  }, [hash]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error("Submission failed", { description: error.message });
    }
  }, [error]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Work submitted! Good luck 🎉");
      setCid("");
    }
  }, [isSuccess]);

  const handleSubmit = () => {
    if (!cid) {
      toast.error("Please enter your work link/CID");
      return;
    }
    // writeContract({
    //   ...BountyAgentConfig,
    //   functionName: "submitWork",
    //   args: [BigInt(bountyId), cid],
    //   value: entryFee,
    // });
  };

  // inside SubmissionForm component
  const startSubmission = async () => {
    if (!cid) {
      return toast.error("Enter your submission link");
    }

    try {
      // 1. Hit your API to create an x402 payment
      const resp = await fetch("/api/x402/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId,
          cid,
          amount: Number(entryFee) / 1e18, // amount in ETH
        }),
      });
      const { checkoutUrl } = await resp.json();
      if (!checkoutUrl) throw new Error("No checkout URL returned");

      // 2. Redirect user to the hosted checkout page
      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast.error("Payment initialization failed: " + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="IPFS CID or URL to your submission"
        value={cid}
        onChange={(e) => setCid(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending
          ? "Submitting…"
          : `Pay & Submit (${+(Number(entryFee) / 1e18).toFixed(7)} ETH)`}
      </Button>
    </div>
  );
}
