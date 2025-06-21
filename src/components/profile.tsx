// "use client";

// import { useAccount, useBalance, useEnsName } from "wagmi";
// import { middleEllipsis } from "@/lib/utils";
// import { formatUnits } from "viem";

// export default function Profile() {
//   const { address, chain } = useAccount();

//   const { data } = useBalance({
//     address,
//   });

//   const ens = useEnsName({
//     address,
//   });

//   return (
//     <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
//       <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
//         <h2 className="mb-3 text-2xl font-semibold">Wallet address</h2>
//         <p className="m-0 w-[30ch] text-sm opacity-50">
//           {middleEllipsis(address as string, 12) || ""}
//         </p>
//       </div>

//       <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
//         <h2 className={`mb-3 text-2xl font-semibold`}>Network</h2>
//         <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//           {chain?.name || ""}
//         </p>
//       </div>

//       <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
//         <h2 className={`mb-3 text-2xl font-semibold`}>Balance</h2>
//         <div className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//           {data ? (
//             <p>
//               {Number(formatUnits(data.value, data.decimals)).toFixed(4)}{" "}
//               {data.symbol}
//             </p>
//           ) : (
//             <div />
//           )}
//         </div>
//       </div>

//       <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
//         <h2 className={`mb-3 text-2xl font-semibold`}>EnsName</h2>
//         <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
//           {ens.data || ""}
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useAccount, useBalance, useEnsName } from "wagmi";
import { middleEllipsis } from "@/lib/utils";
import { formatUnits } from "viem";
import { Wallet, Network, Coins, User } from "lucide-react";

export default function Profile() {
  const { address, chain } = useAccount();

  const { data } = useBalance({
    address,
  });

  const ens = useEnsName({
    address,
  });

  if (!address) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-black mb-8 text-center">Wallet Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Wallet Address */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-black transition-all duration-200 group">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-black group-hover:text-white transition-all duration-200">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-black">Wallet Address</h3>
          </div>
          <p className="text-gray-600 font-mono text-sm break-all">
            {middleEllipsis(address as string, 12) || "Not connected"}
          </p>
        </div>

        {/* Network */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-black transition-all duration-200 group">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-black group-hover:text-white transition-all duration-200">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-black">Network</h3>
          </div>
          <p className="text-gray-600 font-medium">
            {chain?.name || "Unknown"}
          </p>
        </div>

        {/* Balance */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-black transition-all duration-200 group">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-black group-hover:text-white transition-all duration-200">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-black">Balance</h3>
          </div>
          <div className="text-gray-600">
            {data ? (
              <p className="font-mono">
                <span className="text-xl font-bold text-black">
                  {Number(formatUnits(data.value, data.decimals)).toFixed(4)}
                </span>
                <span className="ml-2 text-sm font-medium">{data.symbol}</span>
              </p>
            ) : (
              <p className="text-sm">Loading...</p>
            )}
          </div>
        </div>

        {/* ENS Name */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-black transition-all duration-200 group">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-black group-hover:text-white transition-all duration-200">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-black">ENS Name</h3>
          </div>
          <p className="text-gray-600 font-medium break-all">
            {ens.data || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}