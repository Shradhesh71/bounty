import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";
import { Inter } from "next/font/google";
import { CDPWalletProvider } from "@/context/CDPWallet";
import { ContractsProvider } from "@/context/Contracts";
import { X402PayProvider } from "@/context/X402Pay";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Onchain Bounty Board",
  description: "Submit, Earn, Win. Built onchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <CDPWalletProvider>
            <ContractsProvider>
              <X402PayProvider>{children}</X402PayProvider>
            </ContractsProvider>
          </CDPWalletProvider>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
