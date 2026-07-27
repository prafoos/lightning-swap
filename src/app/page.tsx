'use client';

import dynamic from 'next/dynamic';

const SwapPanel = dynamic(() => import('@/components/SwapPanel'), {
  ssr: false,
}); 
import { Providers } from './providers'; // curly braces { } ചേർത്തത് ശ്രദ്ധിക്കുക


 import MarketPanel from '../components/MarketPanel';    // ← ഇത് ചേർക്കുക 
export default function Home() {
  return (
    <Providers>
      <main className="flex min-h-screen flex-col items-center justify-start p-4 bg-zinc-950 text-white selection:bg-blue-500/30"> 
        
        {/* Site Header / Title at Left Corner */}
        {/* Site Header / Title at Left Corner & Socials at Right */}
        <header className="relative z-10 w-full max-w-[1200px] flex items-center justify-between pt-8 px-4"> 
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight pointer-events-auto"> 
            Lightning <span className="text-blue-500">Swap</span>
          </h1>

          {/* Social Links */}
          <div className="flex items-center gap-3 relative z-50">
            <span className="text-gray-400 text-sm font-medium">Contact:</span>

            {/* Twitter (X) Link */}
            <a
              href="https://x.com/lightningspdex"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors border border-gray-700 cursor-pointer pointer-events-auto"
              title="Twitter (X)"
            >
              <svg className="w-4 h-4 fill-current text-white pointer-events-none" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Farcaster Link */}
            <a
              href="https://farcaster.xyz/lightningswap"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors border border-gray-700 cursor-pointer pointer-events-auto"
              title="Farcaster"
            >
              <svg className="w-4 h-4 fill-current text-purple-400 pointer-events-none" viewBox="0 0 24 24">
                <path d="M18.24 2.25H5.76A3.51 3.51 0 0 0 2.25 5.76v12.48a3.51 3.51 0 0 0 3.51 3.51h12.48a3.51 3.51 0 0 0 3.51-3.51V5.76a3.51 3.51 0 0 0-3.51-3.51zM16.5 16.5h-9v-1.5h9v1.5zm0-3h-9v-1.5h9v1.5zm0-3h-9V9h9v1.5z" />
              </svg>
            </a>
          </div>
        </header> 

        {/* Background glow effects - moved down slightly for layout */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        {/* Swap + Market Layout */}
       <div className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-center gap-20 mt-16 px-4">   
  {/* Swap Panel */}
  <div className="w-full max-w-[460px]">
    <SwapPanel />
  </div>

  {/* Market Panel */}
  <div className="w-full max-w-[500px]">
    <MarketPanel />
  </div>
</div> 
      </main>
    </Providers>
  );
}