// "use client";

// import { useEffect, useRef } from "react";
// import {
//   useConnectModal,
//   useAccountModal,
//   useChainModal,
// } from "@rainbow-me/rainbowkit";
// import { useAccount, useDisconnect } from "wagmi";
// import { emojiAvatarForAddress } from "@/lib/emojiAvatarForAddress";

// export const ConnectBtn = () => {
//   const { isConnecting, address, isConnected, chain } = useAccount();
//   const { color: backgroundColor, emoji } = emojiAvatarForAddress(
//     address ?? ""
//   );

//   const { openConnectModal } = useConnectModal();
//   const { openAccountModal } = useAccountModal();
//   const { openChainModal } = useChainModal();
//   const { disconnect } = useDisconnect();

//   const isMounted = useRef(false);

//   useEffect(() => {
//     isMounted.current = true;
//   }, []);

//   if (!isConnected) {
//     return (
//       <button
//         className="btn"
//         onClick={async () => {
//           // Disconnecting wallet first because sometimes when is connected but the user is not connected
//           if (isConnected) {
//             disconnect();
//           }
//           openConnectModal?.();
//         }}
//         disabled={isConnecting}
//       >
//         { isConnecting ? 'Connecting...' : 'Connect your wallet' }
//       </button>
//     );
//   }

//   if (isConnected && !chain) {
//     return (
//       <button className="btn" onClick={openChainModal}>
//         Wrong network
//       </button>
//     );
//   }

//   return (
//     <div className="max-w-5xl w-full flex items-center justify-between">
//       <div
//         className="flex justify-center items-center px-4 py-2 border border-neutral-700 bg-neutral-800/30 rounded-xl font-mono font-bold gap-x-2 cursor-pointer"
//         onClick={async () => openAccountModal?.()}
//       >
//         <div
//           role="button"
//           tabIndex={1}
//           className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
//           style={{
//             backgroundColor,
//             boxShadow: "0px 2px 2px 0px rgba(81, 98, 255, 0.20)",
//           }}
//         >
//           {emoji}
//         </div>
//         <p>Account</p>
//       </div>
//       <button className="btn" onClick={openChainModal}>
//         Switch Networks
//       </button>
//     </div>
//   );
// };

"use client";

import { useEffect, useRef } from "react";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { emojiAvatarForAddress } from "@/lib/emojiAvatarForAddress";
import { Wallet, Network } from "lucide-react";

export const ConnectBtn = () => {
  const { isConnecting, address, isConnected, chain } = useAccount();
  const { color: backgroundColor, emoji } = emojiAvatarForAddress(
    address ?? ""
  );

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { disconnect } = useDisconnect();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  if (!isConnected) {
    return (
      <button
        className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={async () => {
          // Disconnecting wallet first because sometimes when is connected but the user is not connected
          if (isConnected) {
            disconnect();
          }
          openConnectModal?.();
        }}
        disabled={isConnecting}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  if (isConnected && !chain) {
    return (
      <button
        className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-200"
        onClick={openChainModal}
      >
        <Network className="w-4 h-4 mr-2" />
        Wrong Network
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Account Button */}
      <button
        className="flex items-center px-4 py-3 border-2 border-gray-200 hover:border-black bg-white hover:bg-gray-50 rounded-xl font-medium transition-all duration-200 group"
        onClick={async () => openAccountModal?.()}
      >
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3"
          style={{
            backgroundColor,
          }}
        >
          {emoji}
        </div>
        <span className="text-gray-900 group-hover:text-black">Account</span>
      </button>

      {/* Network Button */}
      <button
        className="inline-flex items-center px-4 py-3 border-2 border-gray-200 hover:border-black bg-white hover:bg-gray-50 rounded-xl font-medium transition-all duration-200 text-gray-900 hover:text-black"
        onClick={openChainModal}
      >
        <Network className="w-4 h-4 mr-2" />
        Switch Networks
      </button>
    </div>
  );
};
