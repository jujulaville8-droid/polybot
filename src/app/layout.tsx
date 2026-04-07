import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
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
      className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body>
        {children}
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://unpkg.com/@phosphor-icons/web"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
