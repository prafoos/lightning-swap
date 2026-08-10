"use client";

import { useState, useEffect } from 'react';
import { useWriteContract, useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';

// Verified Base Mainnet Steakhouse USDC Vault Address
const STEAKHOUSE_VAULT = "0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183" as `0x${string}`;
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`; 

const ERC20_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const VAULT_ABI = [
  {
    inputs: [
      { name: "assets", type: "uint256" },
      { name: "receiver", type: "address" },
    ],
    name: "deposit",
    outputs: [{ name: "shares", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "assets", type: "uint256" },
      { name: "receiver", type: "address" },
      { name: "owner", type: "address" },
    ],
    name: "withdraw",
    outputs: [{ name: "shares", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "shares", type: "uint256" }],
    name: "convertToAssets",
    outputs: [{ name: "assets", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default function VaultPanel() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  // Live APY State & Fetching
  const [netApy, setNetApy] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveApy = async () => {
      try {
        const response = await fetch("https://blue-api.morpho.org/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                vaultByAddress(address: "${STEAKHOUSE_VAULT.toLowerCase()}", chainId: 8453) {
                  state {
                    netApy
                  }
                }
              }
            `,
          }),
        });

        const result = await response.json();
        const apyDecimal = result?.data?.vaultByAddress?.state?.netApy;

        if (apyDecimal !== undefined && apyDecimal !== null) {
          const formattedApy = (apyDecimal * 100).toFixed(2);
          setNetApy(formattedApy);
        }
      } catch (error) {
        console.error("Failed to fetch Live APY:", error);
      }
    };

    fetchLiveApy();
  }, []); 
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error: txError } = useWriteContract();

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track Blockchain Confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Read User USDC Balance
  const { data: usdcBalance, refetch: refetchUsdc } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Read User Vault Shares
  const { data: vaultBalance, refetch: refetchVault } = useReadContract({
    address: STEAKHOUSE_VAULT,
    abi: VAULT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Read current asset value for the user's vault shares
  const { data: currentVaultAssets, refetch: refetchCurrentAssets } = useReadContract({
    address: STEAKHOUSE_VAULT,
    abi: VAULT_ABI,
    functionName: 'convertToAssets',
    args: address && vaultBalance ? [vaultBalance as bigint] : undefined,
    query: { enabled: !!address && !!vaultBalance }
  });

  // Read Allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, STEAKHOUSE_VAULT] : undefined,
    query: { enabled: !!address }
  });

  // Refetch data after transaction confirms
  useEffect(() => {
    if (isConfirmed) {
      refetchAllowance();
      refetchUsdc();
      refetchVault();
      refetchCurrentAssets();
    }
  }, [isConfirmed, refetchAllowance, refetchUsdc, refetchVault, refetchCurrentAssets]);

  if (!mounted) return null; // Prevents Next.js Hydration error

  const safeParseAmount = () => {
    try {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return BigInt(0);
      return parseUnits(amount, 6);
    } catch {
      return BigInt(0);
    }
  };

  const parsedAmount = safeParseAmount();
  const allowance = (allowanceData as bigint) || BigInt(0);
  const needsApproval = allowance < parsedAmount;

  const handleDeposit = () => {
  if (!address || parsedAmount === BigInt(0)) return;

  if (needsApproval) {
    writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'approve',
      // Exact തുകയ്ക്ക് പകരം 1,000 USDC അപ്രൂവ് നൽകുന്നു (അലവൻസ് എറർ വരാതിരിക്കാൻ)
      args: [STEAKHOUSE_VAULT, parseUnits("1000", 6)],
    });
  } else {
    writeContract({
      address: STEAKHOUSE_VAULT,
      abi: VAULT_ABI,
      functionName: 'deposit',
      args: [parsedAmount, address],
    });
  }
}; 

  const handleWithdraw = () => {
    if (!address || parsedAmount === BigInt(0)) return;

    writeContract({
      address: STEAKHOUSE_VAULT,
      abi: VAULT_ABI,
      functionName: 'withdraw',
      args: [parsedAmount, address, address],
    });
  };

  const formattedUsdc = usdcBalance ? formatUnits(usdcBalance as bigint, 6) : "0.0";
  const formattedVault = vaultBalance ? formatUnits(vaultBalance as bigint, 18) : "0.0";

  // Convert the user's vault asset value into USDC-equivalent for net profit display
  const currentAssets = currentVaultAssets
    ? parseFloat(formatUnits(currentVaultAssets as bigint, 6))
    : 0;

  const vaultShareAmount = formattedVault ? parseFloat(formattedVault) : 0;

  const netProfit = (currentAssets > 0 && currentAssets > vaultShareAmount)
    ? (currentAssets - vaultShareAmount).toFixed(4)
    : "0.0000";   
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#181B20] border border-gray-800 rounded-2xl text-white shadow-xl">
      <h2 className="text-xl font-bold text-center mb-2">Earn Yield (Steakhouse USDC)</h2>

      <div className="flex justify-between items-center bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-lg mb-4 text-sm">
        <span className="text-gray-300">Net APY</span>
        <span className="text-green-400 font-bold">~ {netApy ? `${netApy}%` : "8.50%"}</span> 
      </div>
      <div className="flex justify-between items-center bg-gray-800/40 border border-gray-700/40 px-4 py-2 rounded-xl mb-4 text-sm">
  <span className="text-gray-300">Earnings / Net Profit</span>
  <span className="text-green-400 font-bold">+{netProfit} USDC</span>
</div>
      <div className="flex bg-[#0D0E11] p-1 rounded-xl mb-4 border border-gray-800">
        <button
          onClick={() => { setActiveTab('deposit'); setAmount(''); }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
            activeTab === 'deposit' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => { setActiveTab('withdraw'); setAmount(''); }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
            activeTab === 'withdraw' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Withdraw
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-[#0D0E11] p-4 rounded-xl border border-gray-800">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{activeTab === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}</span>
            <span>
              Available: {activeTab === 'deposit' 
                ? `${Number(formattedUsdc).toFixed(2)} USDC` 
                : `${Number(formattedVault).toFixed(2)} Vault Shares`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold outline-none text-white"
            />
            <button 
              onClick={() => setAmount(activeTab === 'deposit' ? formattedUsdc : formattedVault)}
              className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-600/30"
            >
              MAX
            </button>
          </div>
        </div>

        {txError && (
          <div className="text-xs text-red-400 bg-red-950/50 p-2 rounded border border-red-800 break-words">
            {txError.message.slice(0, 120)}...
          </div>
        )}

        {activeTab === 'deposit' ? (
          <button
            onClick={handleDeposit}
            disabled={!isConnected || isPending || isConfirming || parsedAmount === BigInt(0)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl font-bold transition"
          >
            {!isConnected 
              ? "Connect Wallet" 
              : isPending 
              ? "Check Wallet..." 
              : isConfirming 
              ? "Confirming Transaction..." 
              : needsApproval 
              ? "Approve USDC" 
              : "Deposit to Vault"}
          </button>
        ) : (
          <button
            onClick={handleWithdraw}
            disabled={!isConnected || isPending || isConfirming || parsedAmount === BigInt(0)}
            className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl font-bold transition"
          >
            {!isConnected 
              ? "Connect Wallet" 
              : isPending 
              ? "Check Wallet..." 
              : isConfirming 
              ? "Confirming Transaction..." 
              : "Withdraw from Vault"}
          </button>
        )}
      </div>
    </div>
  );
} 