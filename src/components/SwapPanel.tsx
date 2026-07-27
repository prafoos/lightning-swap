 'use client';
import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useBalance, useSendTransaction } from 'wagmi';
import { useConnectModal, ConnectButton } from '@rainbow-me/rainbowkit';
import { parseUnits, formatUnits, maxUint256 } from 'viem';
import { SUPPORTED_TOKENS } from '@/constants';
import { TokenSelectModal } from './TokenSelectModal'; 
// Standard ERC20 ABI (Allowance & Approve ചെക്ക് ചെയ്യാൻ)
const erc20Abi = [
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
] as const; 
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
  // Modal State & Handler
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSide, setActiveSide] = useState<'pay' | 'receive'>('pay');

  const handleSelectToken = (token: typeof SUPPORTED_TOKENS[0]) => {
    if (activeSide === 'pay') {
      setSellToken(token);
    } else {
      setBuyToken(token);
    }
  }; 
const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // ടോക്കൺ സ്റ്റേറ്റുകൾ
  const [sellToken, setSellToken] = useState<Token>(SUPPORTED_TOKENS[0]);
  const [buyToken, setBuyToken] = useState<Token>(SUPPORTED_TOKENS[1]);
  const [sellAmount, setSellAmount] = useState<string>('');
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [swapQuote, setSwapQuote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { writeContractAsync: approveAsync, isPending: isApproving } = useWriteContract();

  const KYBERSWAP_ROUTER = "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5";
  const isNativeETH = sellToken.symbol === "ETH";

  // 1. Allowance ചെക്ക് ചെയ്യുന്നു
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: sellToken.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address, KYBERSWAP_ROUTER] : undefined,
    query: {
      enabled: !!address && !isNativeETH && !!sellToken.address,
    }
  });

  // 2. Token Balance എമ്യൂലേഷൻ (Sell & Buy Tokens)
  const { data: sellBalanceData, refetch: refetchSellBalance, error: sellBalanceError } = useBalance({
    address,
    token: sellToken.symbol === "ETH" ? undefined : (sellToken.address as `0x${string}`),
    query: {
      enabled: !!address,
    },
  }); 
   // 3. Insufficient Balance Validation Logic
  const payAmount = Number(sellAmount || 0);
const currentBalance = Number(sellBalanceData?.formatted || 0);
const isInsufficientBalance = payAmount > 0 && payAmount > currentBalance;
  useEffect(() => {
  console.log("Sell Token Details:", sellToken);
  console.log("Sell Balance Data:", sellBalanceData);
  console.log("Check Balance Logic:", { payAmount, currentBalance, isInsufficientBalance });
  
  if (sellBalanceError) {
    console.error("Balance Fetch Error:", sellBalanceError);
  }
}, [sellToken, sellBalanceData, sellBalanceError, payAmount, currentBalance]); 
   // swapQuote-ൽ നിന്നോ sellToken-ൽ നിന്നോ dynamic price എടുക്കുന്നു
  // 1. sellToken-ൽ ഡയറക്ട് priceUSD ഉണ്ടോ എന്ന് നോക്കുന്നു
let tokenPriceUSD = Number(
  (sellToken as any)?.priceUSD || 
  (sellToken as any)?.price || 
  0
);

const payVal = parseFloat(sellAmount || "0");
const receiveVal = parseFloat(buyAmount || "0");
const buySym = (buyToken?.symbol || "").toUpperCase();
const sellSym = (sellToken?.symbol || "").toUpperCase();

let calculatedUSD = 0;

if (payVal > 0) {
  // KyberSwap quote-ൽ നിന്ന് amountInUsd ഉപയോഗിക്കുക (ഏറ്റവും കൃത്യം)
  const amountInUsd = Number(swapQuote?.data?.routeSummary?.amountInUsd || 0);
  
  if (amountInUsd > 0) {
    calculatedUSD = amountInUsd;
  } 
  // Fallback (quote ഇല്ലെങ്കിൽ)
  else if (["USDC", "USDT", "DAI"].includes(buySym)) {
    calculatedUSD = receiveVal;
  } else if (tokenPriceUSD > 0) {
    calculatedUSD = payVal * tokenPriceUSD;
  }
} 

const totalUSDValue = calculatedUSD < 0.01 && calculatedUSD > 0 
  ? calculatedUSD.toFixed(4) 
  : calculatedUSD.toFixed(2);        
  // MAX Button Handler
  const handleMax = () => {
    if (sellBalanceData?.formatted) {
      if (sellToken?.symbol === 'ETH') {
        const maxEth = Math.max(0, parseFloat(sellBalanceData.formatted) - 0.0005);
        setSellAmount(maxEth.toString());
      } else {
        setSellAmount(sellBalanceData.formatted);
      }
    }
  };  
  const { data: buyBalanceData, refetch: refetchBuyBalance } = useBalance({
    address,
    token: buyToken.symbol === "ETH" ? undefined : (buyToken.address as `0x${string}`),
    query: {
      enabled: !!address,
    },
  }); 

  // 3. വിൽക്കാൻ ഉദ്ദേശിക്കുന്ന തുക BigInt ആക്കി മാറ്റുന്നു
  const requiredAmount = sellAmount && !isNaN(Number(sellAmount))
    ? parseUnits(sellAmount, sellToken.decimals || 18)
    : BigInt(0);

  const currentAllowance = (allowance as bigint) ?? BigInt(0);
  const needsApproval = !isNativeETH && currentAllowance < requiredAmount;

  // 4. Token Approve ചെയ്യാനുള്ള ഫങ്ഷൻ
  const handleApprove = async () => {
    try {
      const tx = await approveAsync({
        address: sellToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [KYBERSWAP_ROUTER, maxUint256],
      });
      
      if (tx) {
        alert("Approval Successful!");
        refetchAllowance();
      }
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

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
    if (sellToken?.symbol === buyToken?.symbol) return; 
    try {
      let executableData = swapQuote.data?.encodedSwapData || swapQuote.encodedSwapData;
      let routerAddress = swapQuote.data?.routerAddress || swapQuote.routerAddress;
      
      // KyberSwap തിരികെ നൽകുന്ന ഏതെങ്കിലും ഒരു field-ൽ value കാണും
      let rawValue = swapQuote.data?.value || swapQuote.data?.amountIn || swapQuote.value || "0";

      // Native ETH അല്ല വിൽക്കുന്നത് എങ്കിൽ (ഉദാഹരണത്തിന് USDC/USDT) value എപ്പോഴും 0 ആയിരിക്കണം
      if (sellToken.symbol !== "ETH") {
        rawValue = "0";
      }

      // 1. build API വഴി calldata ലഭിച്ചിട്ടില്ലെങ്കിൽ build ചെയ്യുക
      if (!executableData && swapQuote.data?.routeSummary) {
        console.log("Building transaction via KyberSwap Build API...");

        const buildResponse = await fetch("https://aggregator-api.kyberswap.com/base/api/v1/route/build", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-client-id": "LightningSwap"
          },
          body: JSON.stringify({
            routeSummary: swapQuote.data.routeSummary,
            recipient: address,
            slippageTolerance: 50,
            sender: address,
          }),
        });

        const buildResult = await buildResponse.json();

        if (buildResult.code === 0 && buildResult.data) {
          executableData = buildResult.data.data || buildResult.data.encodedSwapData;
          routerAddress = buildResult.data.routerAddress || routerAddress;
          
          // Native ETH ആണെങ്കിൽ വിൽക്കുന്ന തുക (amountIn) തന്നെ value ആയി പാസ് ചെയ്യണം
          if (sellToken.symbol === "ETH") {
            rawValue = buildResult.data.value || buildResult.data.amountIn || parseUnits(sellAmount, 18).toString();
          } else {
            rawValue = "0";
          }
        } else {
          alert("KyberSwap Build API Failed: " + (buildResult.message || "Unknown error"));
          return;
        }
      }

      if (!executableData) {
        alert("No executable transaction data found!");
        return;
      }

      console.log("Submitting Tx with Value:", rawValue);

      // 2. Transaction അയക്കുന്നു
      const hash = await sendTransactionAsync({
        to: routerAddress as `0x${string}`,
        data: executableData as `0x${string}`,
        value: BigInt(rawValue), // <-- ETH സ്പെസിഫിക് Value പാസ് ചെയ്യുന്നു
      });

      if (hash) {
        saveSwapToHistory({
          id: Date.now().toString(),
          fromToken: sellToken.symbol,
          toToken: buyToken.symbol,
          fromAmount: sellAmount,
          toAmount: buyAmount,
          txHash: hash,
          timestamp: new Date().toLocaleTimeString(),
        });

        alert("Swap Executed Successfully!");

      setTimeout(() => {
        refetchAllowance();
        refetchSellBalance();
        refetchBuyBalance();
      }, 3000); 
      }

    } catch (error) {
      console.error("Swap execution failed:", error);
    }
  }; 

   

  return (
    <div className="w-full max-w-[800px] bg-zinc-900/90 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-xl">  
      {/* Panel Header */}
   <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-100">Swap</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Base Mainnet
            </span>
          </div>
          <ConnectButton />
        </div>

  {/* History Button */}
  <button 
    onClick={() => setIsHistoryOpen(true)}
    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700/50 transition flex items-center gap-1.5"
  >
    📜 History
  </button>


      {/* Input Section (You Pay) */}
      <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-2xl p-4 mb-1.5 focus-within:border-zinc-700/80 transition">
        <div className="flex justify-between items-center text-xs text-zinc-400 mb-2">
          <span>You pay</span>
          <div className="flex items-center gap-1.5">
            <span>
              Balance: {sellBalanceData ? Number(sellBalanceData.formatted).toFixed(4) : '0.00'}
            </span>
            <button
              type="button"
              onClick={handleMax}
              className="text-[10px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold px-1.5 py-0.5 rounded transition border border-blue-500/30"
            >
              MAX
            </button>
          </div>
        </div> 
        <div className="flex justify-between items-center gap-4">
          <input
            type="number"
            placeholder="0"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            className="w-full bg-transparent text-3xl font-medium text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
  type="button"
  onClick={() => {
    setActiveSide('pay');
    setIsModalOpen(true);
  }}
  className="flex items-center gap-2 bg-[#23262F] hover:bg-[#2C303B] border border-gray-700/50 px-3 py-1.5 rounded-xl text-white font-bold transition-all shrink-0"
>
  <img src={sellToken.logoURI} alt={sellToken.symbol} className="w-5 h-5 rounded-full" />
  <span>{sellToken.symbol}</span>
  <span className="text-xs text-gray-400">▼</span>
</button>
        </div>
        <div className="text-xs text-zinc-400 font-medium pl-1 mt-1">
  {sellAmount && parseFloat(sellAmount) > 0 
    ? `~$${totalUSDValue}` 
    : "$0.00"}
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
          <span className="text-xs text-zinc-400">
  {isLoading ? 'Fetching quote...' : `Balance: ${buyBalanceData?.formatted ? Number(buyBalanceData.formatted).toFixed(4) : "0.00"}`}
</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <input
            type="text"
            placeholder="0"
            value={buyAmount}
            readOnly
            className="w-full bg-transparent text-3xl font-medium text-white outline-none cursor-not-allowed"
          />
          <button
  type="button"
  onClick={() => {
    setActiveSide('receive');
    setIsModalOpen(true);
  }}
  className="flex items-center gap-2 bg-[#23262F] hover:bg-[#2C303B] border border-gray-700/50 px-3 py-1.5 rounded-xl text-white font-bold transition-all shrink-0"
>
  <img src={buyToken.logoURI} alt={buyToken.symbol} className="w-5 h-5 rounded-full" />
  <span>{buyToken.symbol}</span>
  <span className="text-xs text-gray-400">▼</span>
</button>
        </div>
      </div>

    {/* Action Button Section */}
      {!isConnected ? (
        <button
          onClick={() => openConnectModal?.()}
          className="w-full mt-4 bg-blue-600 h-[48px] rounded-xl flex justify-center items-center font-bold text-white"
        >
          Connect Wallet
        </button>
      ) : isInsufficientBalance ? (
        <button
          disabled
          className="w-full mt-4 py-3.5 px-4 rounded-xl font-bold text-base bg-red-500/20 text-red-500 cursor-not-allowed border border-red-500/30"
        >
         Insufficient {sellToken?.symbol ? sellToken.symbol : "balance"}  
        </button>
      ) : needsApproval ? (
        <button
          onClick={handleApprove}
          disabled={isApproving}
          className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black h-[48px] rounded-xl font-bold"
        >
          {isApproving ? "Approving..." : `Approve ${sellToken?.symbol}`}
        </button>
      ) : (
        <button
          onClick={handleExecuteSwap}
          disabled={!swapQuote || isLoading || (sellToken?.symbol === buyToken?.symbol)}
          className={`w-full mt-4 py-3.5 px-4 rounded-xl font-bold text-base transition-all ${
            !swapQuote || isLoading || (sellToken?.symbol === buyToken?.symbol)
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          }`}
        >
          {sellToken?.symbol === buyToken?.symbol
            ? "Select different tokens"
            : isLoading
            ? "Fetching Route..."
            : "Swap"}
        </button>
      )}
          {/* Swap History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                📜 Swap History
              </h3>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {(() => {
                const savedHistory = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('swap_history') || '[]') : [];
                if (savedHistory.length === 0) {
                  return <p className="text-sm text-zinc-500 text-center py-8">No swaps recorded yet</p>;
                }
                return savedHistory.map((tx: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 text-sm">
                    <div>
                      <p className="text-zinc-200 font-semibold">
  {tx.sellAmount || tx.fromAmount || tx.amount || '0'} {tx.sellToken?.symbol || tx.sellToken || tx.fromToken || ''} ➔ {tx.buyAmount || tx.toAmount || ''} {tx.buyToken?.symbol || tx.buyToken || tx.toToken || ''}
</p> 
                      <p className="text-[10px] text-zinc-500">{tx.timestamp || tx.date}</p>
                    </div>
                    {tx.hash && (
                      <a 
                        href={`https://basescan.org/tx/${tx.hash}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:underline bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20"
                      >
                        Basescan ↗
                      </a>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
       <TokenSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tokens={SUPPORTED_TOKENS}
        onSelectToken={handleSelectToken}
      /> 
        </div>
      );
      }