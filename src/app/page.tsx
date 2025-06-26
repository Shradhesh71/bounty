"use client";

import { ConnectBtn } from "@/components/connectButton";
import Profile from "@/components/profile";
import { Button } from "@/components/ui/button";
import { Target, Plus, Upload } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <ConnectBtn />
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-black mb-4 tracking-tight">
            Onchain Bounty Board
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Post bounties. Submit entries. Win crypto + NFTs. Powered by CDP
            Wallet & x402pay.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/create">
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg font-medium rounded-xl transition-all duration-200 min-w-[200px] group">
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Create Bounty
            </Button>
          </Link>
          <Link href="/bounties">
            <Button
              variant="outline"
              className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-6 text-lg font-medium rounded-xl transition-all duration-200 min-w-[200px] group"
            >
              <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-0.5 transition-transform duration-200" />
              Earn Crypto
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center group">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-black group-hover:text-white transition-all duration-200">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Post Bounties</h3>
            <p className="text-gray-600">
              Create bounties for any task with crypto rewards
            </p>
          </div>
          <div className="text-center group">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-black group-hover:text-white transition-all duration-200">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Submit Work</h3>
            <p className="text-gray-600">
              Complete bounties and earn rewards instantly
            </p>
          </div>
          <div className="text-center group">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-black group-hover:text-white transition-all duration-200">
              <div className="w-6 h-6 bg-current rounded-full" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Win Crypto</h3>
            <p className="text-gray-600">
              Get paid in crypto and NFTs for your work
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <Profile />
        </div>
      </div>
    </div>
  );
}
