// "use client";

// import { useState, useEffect } from "react";
// import { useAccount, useReadContract } from "wagmi";
// import { BountyAgentConfig } from "@/lib/contracts";
// import WinnersForm from "@/components/WinnersForm";

// export default function AdminPage({ params }: { params: { id: string } }) {
//   const bountyId = BigInt(params.id);
//   const { address, isConnected } = useAccount();
//   const [bounty, setBounty] = useState<{
//     creator: string;
//     prize: bigint;
//     entryFee: bigint;
//     maxWinners: number;
//     deadline: bigint;
//     settled: boolean;
//   } | null>(null);
//   const [submissions, setSubmissions] = useState<
//     { contributor: string; cid: string }[]
//   >([]);

//   // Read bounty details
//   const {
//     data: bountyData,
//     isLoading: isBountyLoading,
//     error: bountyError,
//   } = useReadContract({
//     ...BountyAgentConfig,
//     abi: BountyAgentConfig.abi.abi,
//     functionName: "bounties",
//     args: [bountyId],
//   });

//   // Read submissions
//   const { data: submissionsData, isLoading: isSubmissionsLoading } =
//     useReadContract({
//       ...BountyAgentConfig,
//       abi: BountyAgentConfig.abi.abi,
//       functionName: "submissions",
//       args: [bountyId],
//       query: { refetchInterval: 10000 }, // Replaces `watch: true` for polling
//     });

//   // Process bounty data
//   useEffect(() => {
//     if (bountyData) {
//       const [creator, prize, entryFee, maxWinners, deadline, settled] =
//         bountyData as any[];
//       setBounty({
//         creator,
//         prize,
//         entryFee,
//         maxWinners: Number(maxWinners),
//         deadline,
//         settled,
//       });
//     }
//   }, [bountyData]);

//   // Process submissions data
//   useEffect(() => {
//     if (submissionsData) {
//       const list = (submissionsData as [string, string][]).map((item) => ({
//         contributor: item[0],
//         cid: item[1],
//       }));
//       setSubmissions(list);
//     }
//   }, [submissionsData]);

//   // Handle loading and error states
//   if (isBountyLoading || isSubmissionsLoading) return <p>Loading...</p>;
//   if (bountyError || !bounty) return <p>Failed to load bounty details.</p>;
//   if (!isConnected || address !== bounty.creator) {
//     return <p>Only the bounty creator can access this page.</p>;
//   }
//   if (bounty.settled) {
//     return <p>Prizes already distributed.</p>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto py-12 space-y-6">
//       <h2 className="text-2xl font-bold">Admin — Bounty #{params.id}</h2>
//       <p>Prize Pool: {(Number(bounty.prize) / 1e18).toFixed(3)} ETH</p>
//       <p>Submissions so far: {submissions.length}</p>

//       {submissions.length === 0 ? (
//         <p>No submissions yet.</p>
//       ) : (
//         <WinnersForm
//           bountyId={bountyId}
//           submissions={submissions}
//           maxWinners={Number(bounty.maxWinners)}
//         />
//       )}
//     </div>
//   );
// }
