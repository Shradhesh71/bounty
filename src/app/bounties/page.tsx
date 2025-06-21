// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useReadContract, useReadContracts } from "wagmi";
// import { BountyAgentConfig } from "@/lib/contracts";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { formatEther } from "viem";

// interface Bounty {
//   id: number;
//   creator: string;
//   prize: bigint;
//   entryFee: bigint;
//   maxWinners: number;
//   deadline: bigint;
//   settled: boolean;
// }

// export default function BountiesPage() {
//   const [bounties, setBounties] = useState<Bounty[]>([]);

//   // Fetch the total number of bounties
//   const { data: bountyCountData } = useReadContract({
//     address: BountyAgentConfig.address,
//     abi: BountyAgentConfig.abi.abi,
//     functionName: "bountyCount",
//   });

//   // Convert bountyCount to a number, default to 0 if not available
//   const count = bountyCountData ? Number(bountyCountData) : 0;

//   // Generate an array of contract calls based on the count
//   const contracts = Array.from({ length: count }, (_, i) => ({
//     address: BountyAgentConfig.address,
//     abi: BountyAgentConfig.abi.abi as any,
//     functionName: "bounties",
//     args: [BigInt(i + 1)],
//   }));

//   // Fetch details of all bounties
//   const { data: bountiesData } = useReadContracts({
//     contracts,
//   });

//   console.log("bountiesData:", bountiesData);
//   console.log("bountyCountData:", bountyCountData);

//   // Process the fetched bounty data and filter out settled bounties
//   useEffect(() => {
//     if (bountiesData) {
//       const list: Bounty[] = bountiesData
//         .map((result, idx) => {
//           if (result.status === "success") {
//             const [creator, prize, entryFee, maxWinners, deadline, settled] =
//               result.result as [
//                 string,
//                 bigint,
//                 bigint,
//                 bigint,
//                 bigint,
//                 boolean
//               ];
//             return {
//               id: idx + 1,
//               creator,
//               prize,
//               entryFee,
//               maxWinners: Number(maxWinners),
//               deadline,
//               settled,
//             };
//           }
//           return null;
//         })
//         .filter(
//           (bounty): bounty is Bounty => bounty !== null && !bounty.settled
//         );
//       setBounties(list);
//     }
//   }, [bountiesData]);

//   return (
//     <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {bounties.map((b) => (
//         <Card key={b.id} className="shadow">
//           <CardHeader>
//             <h3 className="text-lg font-bold">Bounty #{b.id}</h3>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <p>Prize: {formatEther(b.prize)} ETH</p>
//             <p>Fee: {formatEther(b.entryFee)} ETH</p>
//             <p>Max Winners: {b.maxWinners}</p>
//             <p>
//               Deadline: {new Date(Number(b.deadline) * 1000).toLocaleString()}
//             </p>
//             <div className="flex space-x-2">
//               <Link href={`/submit/${b.id}`}>
//                 <Button size="sm">Submit</Button>
//               </Link>
//               <Link href={`/admin/${b.id}`}>
//                 <Button variant="outline" size="sm">
//                   Admin
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//       {bounties.length === 0 && (
//         <p>
//           No active bounties.{" "}
//           <Link href="/create">
//             <Button>Create one?</Button>
//           </Link>
//         </p>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReadContract, useReadContracts } from "wagmi";
import { BountyAgentConfig } from "@/lib/contracts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatUnits } from "viem";

interface Bounty {
  id: number;
  creator: string;
  prize: bigint;
  entryFee: bigint;
  maxWinners: number;
  deadline: bigint;
  settled: boolean;
  topic: string;
  description: string;
}

export default function BountiesPage() {
  const [bounties, setBounties] = useState<Bounty[]>([]);

  // Fetch the total number of bounties
  const { data: bountyCountData } = useReadContract({
    address: BountyAgentConfig.address,
    abi: BountyAgentConfig.abi.abi,
    functionName: "bountyCount",
  });

  // Convert bountyCount to a number, default to 0 if not available
  const count = bountyCountData ? Number(bountyCountData) : 0;

  // Generate an array of contract calls based on the count
  const contracts = Array.from({ length: count }, (_, i) => ({
    address: BountyAgentConfig.address,
    abi: BountyAgentConfig.abi.abi as any,
    functionName: "bounties",
    args: [BigInt(i + 1)],
  }));

  // Fetch details of all bounties
  const { data: bountiesData } = useReadContracts({
    contracts,
  });

  // Process the fetched bounty data and filter out settled bounties
  useEffect(() => {
    if (bountiesData) {
      const list: Bounty[] = bountiesData
        .map((result, idx) => {
          if (result.status === "success") {
            const [creator, prize, entryFee, maxWinners, deadline, settled, topic, description] =
              result.result as [
                string,
                bigint,
                bigint,
                bigint,
                bigint,
                boolean,
                string,
                string
              ];
            return {
              id: idx + 1,
              creator,
              prize,
              entryFee,
              maxWinners: Number(maxWinners),
              deadline,
              settled,
              topic,
              description,
            };
          }
          return null;
        })
        .filter(
          (bounty): bounty is Bounty => bounty !== null && !bounty.settled
        );
      setBounties(list);
    }
  }, [bountiesData]);

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bounties.map((b) => (
        <Card key={b.id} className="shadow">
          <CardHeader>
            <h3 className="text-lg font-bold">{b.topic || `Bounty #${b.id}`}</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{b.description}</p>
            <p>Prize: {formatUnits(b.prize, 6)} USDC</p>
            <p>Fee: {formatUnits(b.entryFee, 6)} USDC</p>
            <p>Max Winners: {b.maxWinners}</p>
            <p>
              Deadline: {new Date(Number(b.deadline) * 1000).toLocaleString()}
            </p>
            <div className="flex space-x-2">
              <Link href={`/submit/${b.id}`}>
                <Button size="sm">Submit</Button>
              </Link>
              <Link href={`/admin/${b.id}`}>
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
      {bounties.length === 0 && (
        <p>
          No active bounties.{" "}
          <Link href="/create">
            <Button>Create one?</Button>
          </Link>
        </p>
      )}
    </div>
  );
}