import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* വാലറ്റ് കണക്റ്റിന്റെ വെബ്പാക്ക് കോൺഫിഗറേഷൻ */
  webpack: (config) => {
    if (!config.externals) {
      config.externals = [];
    }

    if (Array.isArray(config.externals)) {
      config.externals.push(/@x402\./);
    } else {
      config.externals = [config.externals, /@x402\./];
    }

    return config;
  },
  
  /* ടർബോപാക്ക് ഓഫ് ചെയ്യാനുള്ള ലൈൻ - ടൈപ്പ് എറർ വരാതിരിക്കാൻ ഒരു @ts-ignore ചേർക്കുന്നു */
  experimental: {
    // @ts-ignore
    turbopack: false,
  },
};

export default nextConfig;