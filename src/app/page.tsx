'use client';

import SwapPanel from '@/components/SwapPanel';
import { Providers } from './providers'; // curly braces { } ചേർത്തത് ശ്രദ്ധിക്കുക

export default function Home() {
  return (
    <Providers>
      <main className="flex min-h-screen flex-col items-center justify-start p-4 bg-zinc-950 text-white selection:bg-blue-500/30">
        
        {/* Site Header / Title at Left Corner */}
<header className="w-full max-w-[1200px] flex items-center justify-start pt-8 pb-16 px-6 md:px-8">
  <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tighter">
    Lightning <span className="text-blue-500">Swap</span>
  </h1>
</header>

        {/* Background glow effects - moved down slightly for layout */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Swap Panel Container */}
        <div className="relative z-10 w-full flex flex-col items-center flex-grow justify-center -mt-20">
          <SwapPanel />
        </div>
      </main>
    </Providers>
  );
}