# On-Chain Bounty Board Frontend

This repository contains the Next.js frontend for the On-Chain Bounty Board hackathon project. It provides a seamless UI for creators to post bounties, contributors to submit work, and admins to distribute prizes—all powered by x402pay and Coinbase CDP Wallet.

## 🚀 Features

* **Create Bounties**: Fill out a form to lock up USDC prizes and set entry fees, deadlines, and metadata.
* **Approve USDC**: Integrated on-page ERC‑20 allowance flow with MetaMask via Wagmi’s `useWriteContract`.
* **Pay & Submit**: Contributors pay entry fees with x402pay and submit IPFS CIDs on-chain.
* **Real‑Time Status**: Wagmi `useContractRead` hooks keep UI synced with on-chain data.
* **Wallet Integration**: RainbowKit + Wagmi for secure wallet connections and transactions.

## 📁 Folder Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── create/           # Create bounty page (page.tsx)
│   └── index/            # List & details pages
├── components/           # Reusable UI components
├── context/              # React contexts: Wagmi, Contracts, CDPWallet, X402Pay
├── hooks/                # Custom hooks for reads & writes
├── lib/                  # Constants & ABIs
│   └── constants.ts      # Addresses & minimal ERC20 ABI
└── styles/               # Global CSS
```

## ⚙️ Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-org/bounty-ui.git
   cd bounty-ui
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**

   * Rename `.env.example` to `.env.local` and set:

     ```env
     NEXT_PUBLIC_BOUNTY_AGENT_ADDRESS=0xYourDeployedAgentAddress
     NEXT_PUBLIC_USDC_ADDRESS=0xYourUSDCSepoliaAddress
     ```
   * In `src/lib/constants.ts`, ensure:

     ```ts
     export const BOUNTY_AGENT_ADDRESS = process.env.NEXT_PUBLIC_BOUNTY_AGENT_ADDRESS!;
     export const USDC_ADDRESS        = process.env.NEXT_PUBLIC_USDC_ADDRESS!;
     export const USDC_ABI = [
       'function allowance(address owner, address spender) view returns (uint256)',
       'function approve(address spender, uint256 amount) returns (bool)',
     ];
     ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**

   Visit `http://localhost:3000` and connect your wallet via the RainbowKit button.

## 🔗 Key Integrations

* **Wagmi & RainbowKit** for wallet connection, on-chain reads, and writes.
* **x402pay widget** loaded as a React context to collect entry fees off-chain for USDC.
* **Coinbase CDP Wallet + AgentKit** context prepared (see `/context/CDPWallet.tsx`) for future agent automation flows.

## 📄 How It Works

1. **Creator Flow** (`/create`):

   * Enter prize, entry fee, max winners, deadline, topic, and description.
   * Approve USDC allowance for the bounty contract.
   * Submit to lock funds on‑chain and emit `BountyCreated`.

2. **Contributor Flow** (`/[bountyId]`):

   * View bounty details and entry fee.
   * Pay entry fee via x402pay.
   * Submit work (IPFS CID) on‑chain using `submitWork`.

3. **Admin Flow**:

   * After deadline, creator calls `distributePrizes` to pay winners, refund non‑winners, and mint NFT proofs.

## 🛠️ Customization

* **USDC Decimals**: Currently set to 6 decimals via `parseUnits(value, 6)`. Adjust if using different tokens.
* **Chains**: Default is Sepolia. Update `context/Wagmi.tsx` to add other chains.
* **Theme**: Customize RainbowKit theme in `context/Wagmi.tsx`.