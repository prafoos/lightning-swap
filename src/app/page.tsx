'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Providers } from './providers';
import MarketPanel from '../components/MarketPanel';
import VaultPanel from '../components/VaultPanel';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const SwapPanel = dynamic(() => import('@/components/SwapPanel'), {
  ssr: false,
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<'swap' | 'earn'>('swap');

  return (
    <Providers>
      <main className="flex min-h-screen flex-col items-center justify-start p-4 bg-zinc-950 text-white">
        
        {/* Header */}
        <header className="relative z-10 w-full max-w-[1200px] flex items-center justify-between pt-8 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Lightning <span className="text-blue-500">Swap</span>
          </h1>

          {/* Connect Button */}
          <div className="relative z-50">
            <ConnectButton />
          </div>
        </header>

        {/* Tabs */}
        <div className="relative z-10 flex gap-4 mt-10">
          <button
            onClick={() => setActiveTab('swap')}
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeTab === 'swap'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            Swap
          </button>

          <button
            onClick={() => setActiveTab('earn')}
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeTab === 'earn'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            Earn
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-center gap-20 mt-10 px-4">
          {activeTab === 'swap' ? (
            <>
              <div className="w-full max-w-[460px]">
                <SwapPanel />
              </div>
              <div className="w-full max-w-[380px]">
                <MarketPanel />
              </div>
            </>
          ) : (
            <div className="w-full max-w-[460px]">
              <VaultPanel />
            </div>
          )}
        </div>
      </main>
    </Providers>
  );
} 