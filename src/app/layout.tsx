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