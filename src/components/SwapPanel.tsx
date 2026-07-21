'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { parseUnits, formatUnits } from 'viem';
import { SUPPORTED_TOKENS } from '@/constants';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
}
interface SwapHistoryItem {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  txHash: string;
  timestamp: string;
}

const saveSwapToHistory = (newItem: SwapHistoryItem) => {
  try {
    const existingHistory = JSON.parse(localStorage.getItem('swap_history') || '[]');
    const updatedHistory = [newItem, ...existingHistory];
    localStorage.setItem('swap_history', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history:", error);
  }
};
export default function SwapPanel() {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { sendTransactionAsync } = useSendTransaction();
const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // ടോക്കൺ സ്റ്റേറ്റുകൾ
  const [sellToken, setSellToken] = useState<Token>(SUPPORTED_TOKENS[0]);
  const [buyToken, setBuyToken] = useState<Token>(SUPPORTED_TOKENS[1]);
  const [sellAmount, setSellAmount] = useState<string>('');
  const [buyAmount, setBuyAmount] = useState<string>('');
  
  // API ഡാറ്റ സ്റ്റോർ ചെയ്യാൻ
  const [swapQuote, setSwapQuote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // യൂസർ എമൗണ്ട് ടൈപ്പ് ചെയ്യുമ്പോൾ ലൈവ് ക്വോട്ട് എടുക്കാനുള്ള ഫങ്ഷൻ
  useEffect(() => {
    const fetchQuote = async () => {
      if (!sellAmount || isNaN(Number(sellAmount)) || Number(sellAmount) <= 0) {
        setBuyAmount('');
        setSwapQuote(null);
        return;
      }

      setIsLoading(true);
      try {
        // വിഎം വെച്ച് എമൗണ്ടിനെ ടോക്കൺ ഡെസിമലിലേക്ക് മാറ്റുന്നു (ഉദാ: 1 ETH -> 10^18)
        const parsedAmount = parseUnits(sellAmount, sellToken.decimals).toString();

        // Base Mainnet 0x API-ലേക്ക് റിക്വസ്റ്റ് അയക്കുന്നു
        const res = await fetch(
      `/api/swap?buyToken=${buyToken.address}&sellToken=${sellToken.address}&sellAmount=${parsedAmount}`
    );

    const data = await res.json();
    console.log("0x API Response:", data); //
       if (data && data.data && data.data.routeSummary) {
      // KyberSwap തരുന്ന outputAmount എടുക്കുന്നു
      const rawBuyAmount = data.data.routeSummary.amountOut; 
      
      // കിട്ടിയ എമൗണ്ടിനെ ഹ്യൂമൻ റീഡബിൾ ഫോർമാറ്റിലേക്ക് മാറ്റുന്നു
      const formattedBuyAmount = formatUnits(BigInt(rawBuyAmount), buyToken.decimals);
      
      // ദശാംശ സംഖ്യകൾ ഭംഗിയാക്കാൻ 6 അക്കമായി പരിമിതപ്പെടുത്തുന്നു
      setBuyAmount(Number(formattedBuyAmount).toFixed(6));
      
      // ട്രാൻസാക്ഷൻ ഡാറ്റ പിന്നീട് ഉപയോഗിക്കാൻ സേവ് ചെയ്യുന്നു
      setSwapQuote(data); 
    } 
      } catch (error) {
        console.error('Error fetching 0x quote:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // ടൈപ്പ് ചെയ്യുമ്പോൾ തുടരെ API കോൾ പോകാതിരിക്കാൻ 500ms ഡീബൗൺസ് നൽകുന്നു
    const delayDebounceFn = setTimeout(() => {
      fetchQuote();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [sellAmount, sellToken, buyToken]);

  // ടോക്കണുകൾ പരസ്പരം മാറ്റാൻ
  const handleSwapTokens = () => {
    const temp = sellToken;
    setSellToken(buyToken);
    setBuyToken(temp);
    setSellAmount(buyAmount);
    setBuyAmount(sellAmount);
  };

  // യഥാർത്ഥ സ്വാപ്പ് നടത്തുന്ന ഫങ്ഷൻ
  const handleExecuteSwap = async () => {
    if (!swapQuote) return;

    try {
      const hash = await sendTransactionAsync({
        to: swapQuote.to,
        data: swapQuote.data,
        value: BigInt(swapQuote.value),
      });

      if (hash) {
        saveSwapToHistory({
          id: Date.now().toString(),
          fromToken: sellToken.symbol,
          toToken: buyToken.symbol,
          fromAmount: sellAmount,
          toAmount: buyAmount,
          txHash: hash,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } catch (error) {
      console.error('Swap execution failed:', error);
    }
  };

   

  return (
    <div className="w-full max-w-[460px] bg-zinc-900/90 border border-zinc-800/80 rounded-3xl p-4 backdrop-blur-xl shadow-2xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-1 pb-3">
  <div className="flex items-center gap-2">
    <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Swap</h2>
    <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
      Base Mainnet
    </span>
  </div>

  {/* History Button */}
  <button 
    onClick={() => setIsHistoryOpen(true)}
    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700/50 transition flex items-center gap-1.5"
  >
    📜 History
  </button>
</div>

      {/* Input Section (You Pay) */}
      <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-2xl p-4 mb-1.5 focus-within:border-zinc-700/80 transition">
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span>You pay</span>
          <span>Balance: 0.00</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <input
            type="number"
            placeholder="0"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            className="w-full bg-transparent text-3xl font-medium text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <select
            value={sellToken.symbol}
            onChange={(e) => {
              const token = SUPPORTED_TOKENS.find(t => t.symbol === e.target.value);
              if (token) setSellToken(token);
            }}
            className="bg-zinc-800 hover:bg-zinc-700/80 text-white font-semibold py-2 px-3.5 rounded-xl outline-none cursor-pointer border border-zinc-700/50 text-sm transition"
          >
            {SUPPORTED_TOKENS.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Switch Button */}
      <div className="relative h-2 flex items-center justify-center z-10">
        <button
          onClick={handleSwapTokens}
          className="absolute bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-2 rounded-xl text-zinc-400 hover:text-white transition shadow-md hover:scale-105 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
          </svg>
        </button>
      </div>

      {/* Output Section (You Receive) */}
      <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-2xl p-4 mt-1.5 focus-within:border-zinc-700/80 transition">
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span>You receive</span>
          <span>{isLoading ? 'Fetching quote...' : 'Estimated'}</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <input
            type="text"
            placeholder="0"
            value={buyAmount}
            readOnly
            className="w-full bg-transparent text-3xl font-medium text-white outline-none cursor-not-allowed"
          />
          <select
            value={buyToken.symbol}
            onChange={(e) => {
              const token = SUPPORTED_TOKENS.find(t => t.symbol === e.target.value);
              if (token) setBuyToken(token);
            }}
            className="bg-zinc-800 hover:bg-zinc-700/80 text-white font-semibold py-2 px-3.5 rounded-xl outline-none cursor-pointer border border-zinc-700/50 text-sm transition"
          >
            {SUPPORTED_TOKENS.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Button Section */}
      {!isConnected ? (
        <button
          onClick={() => openConnectModal?.()}
          className="w-full mt-4 bg-blue-600 h-[48px] rounded-xl flex justify-center items-center font-bold text-white transition hover:bg-blue-700 active:scale-[0.98] text-base"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={handleExecuteSwap}
          disabled={!swapQuote || isLoading}
          className="w-full mt-4 bg-blue-600 h-[48px] rounded-xl flex justify-center items-center font-bold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-base"
        >
          {isLoading ? 'Fetching Route...' : 'Swap'}
        </button>
      )}
    </div>
  );
}