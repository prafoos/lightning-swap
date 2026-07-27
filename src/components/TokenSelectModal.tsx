import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Search, X, Star } from 'lucide-react'; // അല്ലെങ്കിൽ lucide ഇക്കോണുകൾ ഇല്ലാത്തപക്ഷം സാധാരണ SVG ഉപയോഗിക്കാം

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  onSelectToken: (token: Token) => void;
}
function TokenRow({ token, onSelectToken }: { token: Token; onSelectToken: (token: Token) => void }) {
  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address,
    token: token.symbol === 'ETH' ? undefined : (token.address as `0x${string}`),
  });

  const formattedBalance = balanceData 
    ? parseFloat(balanceData.formatted).toFixed(4) 
    : "0.00";

  return (
    <div
      onClick={() => onSelectToken(token)}
      className="flex items-center justify-between p-3 hover:bg-zinc-800/60 cursor-pointer rounded-xl transition-all"
    >
      <div className="flex items-center gap-3">
        <img src={token.logoURI} alt={token.symbol} className="w-8 h-8 rounded-full" />
        <div>
          <div className="font-semibold text-white">{token.symbol}</div>
          <div className="text-xs text-zinc-400">{token.name}</div>
        </div>
      </div>

      <div className="text-right font-medium text-zinc-200">
        {formattedBalance}
      </div>
    </div>
  );
} 

export const TokenSelectModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onSelectToken,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  // Search filter logic
  const filteredTokens = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.address.toLowerCase() === search.toLowerCase()
  );

  // Quick select tokens (top tokens)
  const quickTokens = tokens.slice(0, 4);

  return (
     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"> 
      <div className="bg-[#121318] border border-gray-800 text-white w-full max-w-md rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Select a token</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name, symbol or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1B23] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
          />
        </div>

        {/* Quick Select Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickTokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => {
                onSelectToken(token);
                onClose();
              }}
              className="flex items-center gap-2 bg-[#1A1B23] border border-gray-800 hover:border-gray-600 px-3 py-1.5 rounded-xl text-xs font-semibold"
            >
              <img src={token.logoURI} alt={token.symbol} className="w-4 h-4 rounded-full" />
              <span>{token.symbol}</span>
            </button>
          ))}
        </div>

        {/* List Header */}
        <div className="flex justify-between text-xs text-gray-500 font-semibold mb-2 px-1">
          <span>TOKEN</span>
          <span>BALANCE</span>
        </div>

       {/* Scrollable Token List */}
<div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
  {filteredTokens.map((token) => (
    <TokenRow 
      key={token.address || token.symbol} 
      token={token} 
      onSelectToken={(t) => {
        onSelectToken(t);
        onClose();
      }} 
    />
  ))}

  {filteredTokens.length === 0 && (
        <div className="text-center text-gray-500 py-8 text-sm">
          No tokens found.
        </div>
      )}
    </div>
  </div>
</div>
);
};