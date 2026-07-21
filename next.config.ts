import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* വാലറ്റ് കണക്റ്റിന്റെ വെബ്പാക്ക് കോൺഫിഗറേഷൻ */
  webpack: (config) => {
    if (!config.externals) {
      config.externals = [];
    }

   if (Array.isArray(config.externals)) {
  config.externals.push(/^@x402/);
} else {
  config.externals = [config.externals, /^@x402/];
} 

    if (Array.isArray(config.externals)) {
      config.externals.push(/^@x402/);
    } else {
      config.externals = [config.externals, /^@x402/];
    } 

    // റിയാക്റ്റ് നേറ്റീവ് മൊബൈൽ ഡിപെൻഡൻസി എറർ ഫിക്സ് ചെയ്യാൻ ഇത് ചേർക്കുക
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    config.resolve.fallback['@react-native-async-storage/async-storage'] = false;

    return config;
  },
  
  /* ടർബോപാക്ക് ഓഫ് ചെയ്യാനുള്ള ലൈൻ */
  experimental: {
    // @ts-ignore
    turbopack: false,
  },
};

export default nextConfig;