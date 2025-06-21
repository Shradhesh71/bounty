// "use client";

// import { useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useAccount, useReadContract } from "wagmi";
// import { BountyAgentConfig } from "@/lib/contracts";
// import { Button } from "@/components/ui/button";
// import SubmissionForm from "@/components/SubmissionForm";

// export default function SubmitPage() {
//   const params = useSearchParams();
//   const id = params.get("id");
//   const { address, isConnected } = useAccount();
//   const [bounty, setBounty] = useState<{
//     prize: bigint;
//     entryFee: bigint;
//     maxWinners: number;
//     deadline: bigint;
//   } | null>(null);

//   // Fetch bounty details using useReadContract
//   const { data: bountyData, isLoading, error } = useReadContract({
//     address: BountyAgentConfig.address,
//     abi: BountyAgentConfig.abi.abi,
//     functionName: "bounties",
//     args: [id ? BigInt(1) : BigInt(0)],
//   });
//   console.log("Bounty Data:", bountyData);
//   console.log("Bounty ID:", id);

//   // Process the fetched data when available
//   useEffect(() => {
//     if (bountyData) {
//       const { creator, prize, entryFee, maxWinners, deadline, settled } = bountyData as any;
//       if (!settled) {
//         setBounty({
//           prize,
//           entryFee,
//           maxWinners: Number(maxWinners),
//           deadline,
//         });
//       }
//     }
//   }, [bountyData]);

//   // Handle edge cases
//   if (!id) return <p>No bounty specified.</p>;
//   if (isLoading) return <p>Loading bounty details…</p>;
//   if (error || !bounty) return <p>Failed to load bounty details.</p>;

//   return (
//     <div className="max-w-xl mx-auto py-12 space-y-6">
//       <h2 className="text-2xl font-bold">Submit for Bounty #{id}</h2>
//       <p>Prize Pool: {+(Number(bounty.prize) / 1e18).toFixed(3)} ETH</p>
//       <p>Entry Fee: {+(Number(bounty.entryFee) / 1e18).toFixed(4)} ETH</p>
//       <p>
//         Deadline: {new Date(Number(bounty.deadline) * 1000).toLocaleString()}
//       </p>

//       {!isConnected && (
//         <Button onClick={() => window.alert("Connect your wallet first")}>
//           Connect Wallet
//         </Button>
//       )}

//       {isConnected && (
//         <SubmissionForm bountyId={Number(id)} entryFee={bounty.entryFee} />
//       )}
//     </div>
//   );
// }
"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { BountyAgentConfig } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import SubmissionForm from "@/components/SubmissionForm";

export default function SubmitPage() {
  const params = useParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { address, isConnected } = useAccount();
  const [bounty, setBounty] = useState<{
    prize: bigint;
    entryFee: bigint;
    maxWinners: number;
    deadline: bigint;
  } | null>(null);

  // Validate the id early
  console.log("Bounty ID from params:", id);
  if (!id || isNaN(Number(id))) {
    return <p>Invalid bounty ID.</p>;
  }

  const bountyId = BigInt(id);

  // Fetch bounty details using useReadContract
  const {
    data: bountyData,
    isLoading,
    error,
  } = useReadContract({
    address: BountyAgentConfig.address,
    abi: BountyAgentConfig.abi.abi,
    functionName: "bounties",
    args: [bountyId],
  });
  console.log("Bounty Data:", bountyData);
  console.log("Bounty ID:", id);

  // Process the fetched data when available
  useEffect(() => {
    if (bountyData) {
      const [creator, prize, entryFee, maxWinners, deadline, settled] =
        bountyData as [string, bigint, bigint, bigint, bigint, boolean];
      if (!settled) {
        setBounty({
          prize,
          entryFee,
          maxWinners: Number(maxWinners),
          deadline,
        });
        console.log("Bounty details set:", {
          prize: Number(prize),
          entryFee: Number(entryFee),
          maxWinners: Number(maxWinners),
          deadline: Number(deadline),
        });
      } else {
        setBounty(null); // Handle settled bounties
      }
    }
  }, [bountyData]);

  // Handle edge cases
  if (isLoading) return <p>Loading bounty details…</p>;
  if (error || !bounty) return <p>Bounty not found or already settled.</p>;

  return (
    <div className="max-w-xl mx-auto py-12 space-y-6">
      <h2 className="text-2xl font-bold">Submit for Bounty #{id}</h2>
      <p>Prize Pool: {+(Number(bounty.prize) / 1e18).toFixed(7)} ETH</p>
      <p>Entry Fee: {+(Number(bounty.entryFee) / 1e18).toFixed(7)} ETH</p>
      <p>
        Deadline: {new Date(Number(bounty.deadline) * 1000).toLocaleString()}
      </p>

      {!isConnected && (
        <Button onClick={() => window.alert("Connect your wallet first")}>
          Connect Wallet
        </Button>
      )}

      {isConnected && (
        <SubmissionForm bountyId={Number(id)} entryFee={bounty.entryFee} />
      )}
    </div>
  );
}
