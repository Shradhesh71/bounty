// "use client";

// import { useState, useEffect } from "react";
// import {
//   useAccount,
//   useReadContract,
//   useWriteContract,
//   useWaitForTransactionReceipt,
// } from "wagmi";
// import { parseUnits } from "viem";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import BOUNTY_AGENT_ABI from "@/abi/BountyAgent.json";
// import ERC20_ABI from "@/abi/ERC20.json";

// const BOUNTY_AGENT_ADDRESS = "0xCb3A52d8Aa05037F71d02b057Cfa3e945f9B6ddc";
// const USDC_ADDRESS = "0x9f582979470b73C72F2EA7465F0A3c17Fc582D9f";

// export default function CreateBountyPage() {
//   const { address, isConnected } = useAccount();
//   const router = useRouter();

//   const [form, setForm] = useState({
//     prize: "",
//     entryFee: "",
//     maxWinners: "",
//     deadline: "",
//     topic: "",
//     description: "",
//   });

//   const [isApprovalPending, setIsApprovalPending] = useState(false);

//   // Fetch current allowance for USDC
//   const { data: allowance, error: allowanceError } = useReadContract(
//     address
//       ? {
//           address: USDC_ADDRESS,
//           abi: ERC20_ABI,
//           functionName: "allowance",
//           args: [address, BOUNTY_AGENT_ADDRESS],
//         }
//       : undefined
//   );
//   console.log("Allowance error:", allowanceError);

//   // Calculate prize amount safely
//   const prizeAmount = form.prize ? parseUnits(form.prize, 6) : BigInt(0);
//   const isApproved =
//     typeof allowance === "bigint" &&
//     allowance !== null &&
//     allowance >= prizeAmount &&
//     prizeAmount > BigInt(0);

//   useEffect(() => {
//   console.log("Allowance:", allowance);
//   console.log("Prize Amount:", prizeAmount);
//   console.log("Is Approved:", isApproved);
//   if (allowanceError) {
//     console.error("Allowance fetch error:", allowanceError);
//   }
// }, [allowance, prizeAmount, allowanceError]);

//   // Approve USDC
//   const { writeContract: approveUSDC, isPending: isApproving } = useWriteContract();

//   // Create bounty
//   const {
//     writeContract: createBounty,
//     data: createBountyData,
//     error: createBountyError,
//     isPending: isCreating,
//   } = useWriteContract();

//   const { isLoading: isWaitingTx, isSuccess: isBountyCreated } =
//     useWaitForTransactionReceipt({
//       hash: createBountyData,
//     });

//   // Handle transaction submission
//   useEffect(() => {
//     if (createBountyData) {
//       toast("Transaction submitted...", { description: createBountyData });
//     }
//   }, [createBountyData]);

//   // Handle transaction success
//   useEffect(() => {
//     if (isBountyCreated) {
//       toast.success("Bounty created successfully!");
//       router.push("/");
//     }
//   }, [isBountyCreated]);

//   // Handle transaction errors
//   useEffect(() => {
//     if (createBountyError) {
//       toast.error("Failed to create bounty", {
//         description: createBountyError.message,
//       });
//     }
//   }, [createBountyError]);

//   // Reset approval pending state
//   useEffect(() => {
//     if (isApproved) {
//       setIsApprovalPending(false);
//     }
//   }, [isApproved]);

//   const handleChange = (e:any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleApprove = () => {
//     approveUSDC({
//       address: USDC_ADDRESS,
//       abi: ERC20_ABI,
//       functionName: "approve",
//       args: [BOUNTY_AGENT_ADDRESS, parseUnits("1000000", 6)],
//     });
//     toast("Approving USDC for BountyAgent...");
//     setIsApprovalPending(true);
//   };

//   const handleCreateBounty = () => {
//     // Validation
//     if (!form.topic) {
//       toast.error("Please enter a bounty topic.");
//       return;
//     }
//     if (!form.description) {
//       toast.error("Please enter a bounty description.");
//       return;
//     }
//     if (!form.prize || parseFloat(form.prize) <= 0) {
//       toast.error("Prize must be greater than 0 USDC.");
//       return;
//     }
//     if (form.entryFee && parseFloat(form.entryFee) < 0) {
//       toast.error("Entry fee cannot be negative.");
//       return;
//     }
//     if (!form.maxWinners || parseInt(form.maxWinners) <= 0) {
//       toast.error("Max winners must be greater than 0.");
//       return;
//     }
//     if (!form.deadline) {
//       toast.error("Please select a deadline.");
//       return;
//     }
//     const deadlineTimestamp = Math.floor(new Date(form.deadline).getTime() / 1000);
//     if (deadlineTimestamp <= Math.floor(Date.now() / 1000)) {
//       toast.error("Deadline must be in the future.");
//       return;
//     }
//     const prizeNumber = parseFloat(form.prize);
//     if (isNaN(prizeNumber) || prizeNumber <= 0) {
//   toast.error("Prize must be a positive number.");
//   return;
// }

//     if (!isApproved) {
//       toast.error("Please approve USDC spending first.");
//       return;
//     }

//     createBounty({
//       address: BOUNTY_AGENT_ADDRESS,
//       abi: BOUNTY_AGENT_ABI.abi,
//       functionName: "createBounty",
//       args: [
//         parseUnits(form.prize, 6),
//         parseUnits(form.entryFee || "0", 6),
//         parseInt(form.maxWinners),
//         deadlineTimestamp,
//         form.topic,
//         form.description,
//       ],
//     });
//   };

//   const isFormValid = () => {
//   const prizeNumber = parseFloat(form.prize);
//   const entryFeeNumber = form.entryFee ? parseFloat(form.entryFee) : 0;
//   const maxWinnersNumber = parseInt(form.maxWinners);
//   const deadlineTimestamp = form.deadline
//     ? Math.floor(new Date(form.deadline).getTime() / 1000)
//     : 0;

//   return (
//     form.topic &&
//     form.description &&
//     !isNaN(prizeNumber) &&
//     prizeNumber > 0 &&
//     (!form.entryFee || (!isNaN(entryFeeNumber) && entryFeeNumber >= 0)) &&
//     !isNaN(maxWinnersNumber) &&
//     maxWinnersNumber > 0 &&
//     form.deadline &&
//     deadlineTimestamp > Math.floor(Date.now() / 1000)
//   );
// };

//   return (
//     <div className="max-w-xl mx-auto py-12">
//       <h2 className="text-2xl font-bold mb-6">Create a Bounty 📝</h2>

//       <div className="space-y-4">
//         <Input
//           name="topic"
//           type="text"
//           placeholder="Bounty Topic (e.g., Develop a DeFi Dashboard)"
//           value={form.topic}
//           onChange={handleChange}
//         />
//         <Textarea
//           name="description"
//           placeholder="Bounty Description (e.g., Create a dashboard with real-time data)"
//           value={form.description}
//           onChange={handleChange}
//         />
//         <Input
//           name="prize"
//           type="number"
//           min="0.000001"
//           step="0.000001"
//           placeholder="Prize (USDC)"
//           value={form.prize}
//           onChange={handleChange}
//         />
//         <Input
//           name="entryFee"
//           type="number"
//           min="0"
//           step="0.000001"
//           placeholder="Entry Fee (USDC)"
//           value={form.entryFee}
//           onChange={handleChange}
//         />
//         <Input
//           name="maxWinners"
//           type="number"
//           min="1"
//           step="1"
//           placeholder="Max Winners"
//           value={form.maxWinners}
//           onChange={handleChange}
//         />
//         <Input
//           name="deadline"
//           type="datetime-local"
//           value={form.deadline}
//           onChange={handleChange}
//         />

//         {!isApproved && (
//           <Button
//             onClick={handleApprove}
//             disabled={!isConnected || isApproving || isApprovalPending}
//           >
//             {isApproving ? "Approving..." : "Approve USDC"}
//           </Button>
//         )}

//         {isApprovalPending && (
//           <p className="text-yellow-500">Waiting for approval to confirm...</p>
//         )}

//         <Button
//           onClick={handleCreateBounty}
//           disabled={!isConnected || isCreating || isWaitingTx || !isFormValid() || !isApproved}
//           className="w-full"
//         >
//           {isCreating || isWaitingTx ? "Creating..." : "Create Bounty"}
//         </Button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useCreateBounty } from "@/hooks/useCreateBounty";

// export default function CreateBountyPage() {
//   const router = useRouter();
//   const { create, isPending, isSuccess, isError, error } = useCreateBounty();
//   if(isError){
//     console.error("Error creating bounty:", error);
//   }

//   {
//     isError && (
//       <p className="text-red-500">
//         Error creating bounty:{" "}
//         {typeof error === "object" && error !== null && "message" in error
//           ? (error as any).message
//           : JSON.stringify(error)}
//       </p>
//     );
//   }
//   const [prize, setPrize] = useState(0);
//   const [entryFee, setEntryFee] = useState(0);
//   const [maxWinners, setMaxWinners] = useState(1);
//   const [deadline, setDeadline] = useState(0);
//   const [topic, setTopic] = useState("");
//   const [description, setDescription] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await create(prize, entryFee, maxWinners, deadline, topic, description);
//   };

//   if (isSuccess) {
//     // after creation, navigate to home or list
//     router.push("/");
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="flex justify-end mb-4">{/* <ConnectButton /> */}</div>
//       <h1 className="text-2xl font-bold mb-6">Create New Bounty</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Prize (USDC)</label>
//           <input
//             type="number"
//             value={prize}
//             onChange={(e) => setPrize(Number(e.target.value))}
//             className="w-full border rounded p-2"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Entry Fee (USDC)</label>
//           <input
//             type="number"
//             value={entryFee}
//             onChange={(e) => setEntryFee(Number(e.target.value))}
//             className="w-full border rounded p-2"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Max Winners</label>
//           <input
//             type="number"
//             min={1}
//             value={maxWinners}
//             onChange={(e) => setMaxWinners(Number(e.target.value))}
//             className="w-full border rounded p-2"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Deadline (Unix Timestamp)</label>
//           <input
//             type="number"
//             value={deadline}
//             onChange={(e) => setDeadline(Number(e.target.value))}
//             className="w-full border rounded p-2"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Topic</label>
//           <input
//             type="text"
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full border rounded p-2 h-32"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={isPending}
//           className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50 cursor-pointer"
//         >
//           {isPending ? "Creating..." : "Create Bounty"}
//         </button>
//         {isError && <p className="text-red-500">Error creating bounty.</p>}
//       </form>
//     </div>
//   );
// }


"use client";

// Ensure you have ethers installed: npm install ethers
// In src/lib/constants.ts, define:
// export const USDC_ADDRESS = '<USDC_TOKEN_ADDRESS_ON_SEPOLIA>';
// export const USDC_ABI = [
//   // Minimal ERC20 ABI entries for allowance and approve
//   "function allowance(address owner, address spender) view returns (uint256)",
//   "function approve(address spender, uint256 amount) returns (bool)",
// ];

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractRead, useWriteContract } from 'wagmi';
import { useCreateBounty } from '@/hooks/useCreateBounty';
import { BOUNTY_AGENT_ADDRESS, USDC_ADDRESS, USDC_ABI } from '@/lib/contracts';
import { parseUnits } from 'ethers'; // recommended import

export default function CreateBountyPage() {
  const router = useRouter();
  const { address } = useAccount();

  // Form state
  const [prize, setPrize] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [maxWinners, setMaxWinners] = useState(1);
  const [deadline, setDeadline] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');

  // Approval state
  const prizeUnits = prize ? parseUnits(prize, 6) : undefined; // USDC has 6 decimals
  const { data: allowance } = useContractRead({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: [address, BOUNTY_AGENT_ADDRESS],
  });
  const { writeContract: approveAsync, isPending: approving } = useWriteContract();

  const needsApprove =
    prizeUnits &&
    allowance &&
    typeof allowance === 'object' &&
    'lt' in allowance &&
    typeof allowance.lt === 'function' &&
    allowance.lt(prizeUnits);

  // Create bounty hook
  const { create, isPending: creating, isSuccess, isError } = useCreateBounty();

  // On success, navigate
  useEffect(() => {
    if (isSuccess) router.push('/');
  }, [isSuccess, router]);

  const handleApprove = async () => {
    if (!prizeUnits) return;
    await approveAsync({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [BOUNTY_AGENT_ADDRESS, prizeUnits],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // convert all inputs
    const prizeVal = Number(prize);
    const feeVal = Number(entryFee);
    const deadlineTs = Math.floor(new Date(deadline).getTime() / 1000);
    await create(
      prizeVal,
      feeVal,
      maxWinners,
      deadlineTs,
      topic,
      description
    );
  };

  return (
    <div className="max-w-3xl max-h- mx-auto p-4">
      <div className="flex justify-end mb-4">
        <ConnectButton />
      </div>
      <h1 className="text-2xl font-bold mb-6">Create New Bounty</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-10 mb-10">
        {/* Prize Input */}
        <div>
          <label className="block mb-1">Prize (USDC)</label>
          <input
            type="text"
            placeholder="e.g. 100"
            value={prize}
            onChange={e => setPrize(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        {/* Entry Fee Input */}
        <div>
          <label className="block mb-1">Entry Fee (USDC)</label>
          <input
            type="text"
            placeholder="e.g. 1"
            value={entryFee}
            onChange={e => setEntryFee(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        {/* Max Winners */}
        <div>
          <label className="block mb-1">Max Winners</label>
          <input
            type="number"
            min={1}
            value={maxWinners}
            onChange={e => setMaxWinners(Number(e.target.value))}
            className="w-full border rounded p-2"
            required
          />
        </div>
        {/* Deadline DatePicker */}
        <div>
          <label className="block mb-1">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        {/* Topic */}
        <div>
          <label className="block mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded p-2 h-32"
            required
          />
        </div>
        {/* Approve or Create */}
        {needsApprove ? (
          <button
            type="button"
            onClick={handleApprove}
            disabled={approving}
            className="bg-yellow-500 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {approving ? 'Approving...' : 'Approve USDC'}
          </button>
        ) : (
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Bounty'}
          </button>
        )}
        {isError && <p className="text-red-500">Error creating bounty.</p>}
      </form>
    </div>
  );
}
