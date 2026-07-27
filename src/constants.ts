export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  priceUSD?: number;   // ← പുതിയത്
} 

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ether',
    address: '0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', // Native ETH
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' 
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'
  },
  {
    symbol: 'cbBTC', 
    name: 'Coinbase Wrapped BTC',
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    decimals: 8,
    logoURI: 'https://assets.coingecko.com/coins/images/40143/standard/cbbtc.webp?1726136727' 
  },
  {
    symbol: 'VIRTUAL',
    name: 'Virtual Protocol',
    address: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/34057/standard/LOGOMARK.png?1708356054'
  },
  {
    symbol: 'AERO',
    name: 'Aerodrome',
    address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/31745/standard/token.png?1696530564',
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png?1696509996'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xfde4C96c813eD5385353723380B2256E3917aC24',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/39810/standard/weth.png?1724139790'
  },
  {
    symbol: 'BRETT',
    name: 'Brett',
    address: '0x532f27101965dd16442E59d40670FaF5eBB142E4',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/35529/standard/1000050750.png?1709031995'
  },
  {
    symbol: 'DEGEN',
    name: 'Degen',
    address: '0x4ed4E862860bed51a9570b96d89af5e1b0Efefed',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/34515/standard/android-chrome-512x512.png?1706198225'
  },
  {
    symbol: 'MORPHO',
    name: 'Morpho Token',
    address: '0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/29837/standard/Morpho-token-icon.png?1726771230'
  },
  {
    symbol: "CAKE",
    name: "PancakeSwap",
    address: "0x3055913c90fcc1a6ce9a358911721eeb942013a1",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/12632/standard/pancakeswap-cake-logo_%281%29.png?1696512440"
  },
  {
    symbol: "KAITO",
    name: "KAITO",
    address: "0x98d0baa52b2d063e780de12f615f963fe8537553",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/54411/standard/Qm4DW488_400x400.jpg?1739552780"
  },
   {
    symbol: "EURC",
    name: "EURC",
    address: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/26045/standard/EURC.png?1769615705"
  },
  {
    symbol: "SOL",
    name: "Base Bridged SOL",
    address: "0x311935Cd80B76769bF2ecC9D8Ab7635b2139cf82",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/71099/standard/solana.jpg?1765793164"
  },
  {
    symbol: "JITOSOL",
    name: "Jito Staked SOL",
    address: "0x97bE14Dd8f994A5364573BC035D85309E7CB34de",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/28046/standard/JitoSOL_Token_Logo_Green.png?1779807693"
  },
  {
    symbol: "POD",
    name: "Dolphin",
    address: "0xeD664536023d8E4b1640C394777D34aBAFF1dF8F",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/70187/standard/1_to_1_Dolphin_imresizer.jpg?1760947185"
  },
  {
    symbol: "TIBBIR",
    name: "Ribbita by Virtuals",
    address: "0xA4A2E2ca3fBfE21aed83471D28b6f65A233C6e00",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/54970/standard/Untitled_design.png?1742941268"
  },
  {
    symbol: "REI",
    name: "Rei",
    address: "0x6B2504A03ca4D43d0D73776F6aD46dAb2F2a4cFD",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/52005/standard/photo_2025-08-05_23.19.12.jpeg?1754448292"
  }
];  