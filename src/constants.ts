export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
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
  } 
];  