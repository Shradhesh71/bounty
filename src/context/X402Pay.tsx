"use client";
import { createContext, useContext, useEffect } from 'react';

declare global {
  interface Window {
    X402: {
      open: (options: { amount: number; token: string; onSuccess: (txHash: any) => void }) => void;
    };
  }
}

type X402ContextType = {
  open: (fee: number, onSuccess: (txHash: any) => void) => void;
} | null;

const X402Context = createContext<X402ContextType>(null);

import { ReactNode } from 'react';

export function X402PayProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.x402pay.com/sdk.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // open(entryFee: number, onSuccess: (txHash) => void)
  const open = (fee:any, onSuccess:any) => {
    // assume global X402 defined by sdk.js
    window.X402.open({
      amount: fee,
      token: 'USDC',
      onSuccess,
    });
  };

  return (
    <X402Context.Provider value={{ open }}>
      {children}
    </X402Context.Provider>
  );
}

export function useX402() {
  const ctx = useContext(X402Context);
  if (!ctx) throw new Error('X402PayProvider missing');
  return ctx;
}
