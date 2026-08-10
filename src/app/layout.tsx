import '@coinbase/onchainkit/styles.css'; 
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // ഇവിടെ പ്രൊവൈഡർ ഇംപോർട്ട് ചെയ്യുന്നു

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lightning Swap",
  description: "Minimalist DEX Aggregator on Base",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'base:app_id': '6a7a0d94f47a7e40e7300820',
  },
}; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* മുഴുവൻ ആപ്പിനെയും ഇവിടെ റാപ്പ് ചെയ്യുന്നു */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}