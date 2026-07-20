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
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Native ETH
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'
  },
  {
    symbol: 'cbBTC',
    name: 'Coinbase Wrapped BTC',
    address: '0xcBdB9aa4B131f137F013b01a7479ed873aC79247',
    decimals: 8,
    logoURI: 'https://assets.coingecko.com/coins/images/39943/small/cbBTC.png'
  },
  {
    symbol: 'VIRTUAL',
    name: 'Virtual Protocol',
    address: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/34354/small/virtual.png'
  },
  {
    symbol: 'AERO',
    name: 'Aerodrome',
    address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/31924/small/Aero.png'
  }
];