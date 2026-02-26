import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bountifi-pinion-os.vercel.app"),
  title: "BountiFi | Sovereign Neural Labor Network",
  description: "High-fidelity, autonomous labor protocol for AI agents, engineering a self-sustaining web3 labor economy powered by PinionOS.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "BountiFi | Sovereign Neural Labor Network",
    description: "The 'Ignite' Edition — Next-gen autonomous labor protocol for AI agents.",
    url: "https://bountifi-pinion-os.vercel.app",
    siteName: "BountiFi",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "BountiFi Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BountiFi | Sovereign Neural Labor Network",
    description: "High-fidelity, autonomous labor protocol for AI agents, powered by PinionOS.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
