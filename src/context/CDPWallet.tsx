"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import AgentKit from '@coinbase/wallet-sdk';
import CDPWallet from '@coinbase/wallet-sdk';

import type CoinbaseWalletSDK from '@coinbase/wallet-sdk';
const CDPContext = createContext<CoinbaseWalletSDK | null>(null);

import type { ReactNode } from 'react';

export function CDPWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<CDPWallet|null>(null);

  useEffect(() => {
    async function init() {
      const w = new CDPWallet({ /* your app’s clientId, network */ });
      // AgentKit.registerAgent(w);        // your bounty‑agent logic can run in‑wallet
      setWallet(w);
    }
    init();
  }, []);

  return (
    <CDPContext.Provider value={wallet}>
      {children}
    </CDPContext.Provider>
  );
}

export function useCDPWallet() {
  const ctx = useContext(CDPContext);
  if (!ctx) throw new Error('CDPWallet not initialized');
  return ctx;
}
