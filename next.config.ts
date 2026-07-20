import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    if (!config.externals) {
      config.externals = [];
    }

    if (Array.isArray(config.externals)) {
      // @x402 എന്ന് തുടങ്ങുന്ന എന്ത് വന്നാലും വെബ്പാക്ക് അത് ബിൽഡ് ചെയ്യാൻ നോക്കരുത്
      config.externals.push(/^@x402\/.*/);
    } else {
      config.externals = [config.externals, /^@x402\/.*/];
    }
    
    return config;
  },
};

export default nextConfig;