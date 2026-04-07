import type { Metadata } from "next";
import { Instrument_Sans, Fraunces, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cruise Alpha — Build AI-Powered Polymarket Trading Bots",
  description:
    "Learn to build self-learning, AI-powered trading bots for Polymarket. Train ML models, deploy adaptive strategies, and own the whole system.",
  openGraph: {
    title: "Cruise Alpha — Build AI-Powered Polymarket Trading Bots",
    description:
      "Learn to build self-learning, AI-powered trading bots for Polymarket. Train ML models, deploy adaptive strategies, and own the whole system.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${fraunces.variable} ${geistMono.variable}`}
    >
      <body>
        {children}
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
