'use client';

import { useEffect, useState } from 'react';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  image: string;
}

export default function MarketPanel() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false' 
        );
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
    const interval = setInterval(fetchMarkets, 60000); // every 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-xl h-full min-h-[480px] relative z-0"> 
      <h2 className="text-lg font-bold text-zinc-100 mb-4">Market</h2>

      {loading ? (
        <div className="text-zinc-400 text-sm">Loading...</div>
      ) : (
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-4">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between py-2.5 border-b border-zinc-800/40 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 text-xs w-5 text-right">
                  {coin.market_cap_rank}
                </span>
                <img
                  src={coin.image}
                  alt={coin.symbol}
                  className="w-7 h-7 rounded-full"
                />
                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    {coin.symbol.toUpperCase()}
                  </div>
                  <div className="text-xs text-zinc-500">{coin.name}</div>
                </div>
              </div>

                <div className="text-right min-w-[100px] pr-3"> 
                <div className="text-sm font-medium text-zinc-200">
                  ${coin.current_price?.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </div>
                <div
                  className={`text-xs font-medium ${
                    coin.price_change_percentage_24h >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 