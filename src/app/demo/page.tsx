"use client";

import { useState, useEffect, useRef } from "react";

/* ─── Simulated market data ─── */
const MARKETS = [
  "Fed Rate Cut July 2026",
  "ETH > $5k Dec 2026",
  "Trump Wins 2028",
  "BTC > $200k 2026",
  "AI Regulation Bill",
  "SpaceX Mars Landing",
  "Recession by Q4",
  "Gold > $3500",
  "Netflix Hits 400M Subs",
  "Apple AR Glasses Launch",
  "UK Election 2026",
  "OpenAI IPO 2026",
  "Gas Price > $5 National Avg",
  "Lakers Win Championship",
  "Tesla Stock > $500",
];

const STRATEGIES = ["Market Making", "Arbitrage", "Momentum", "Mean Reversion"];

interface Trade {
  id: number;
  time: string;
  market: string;
  side: "YES" | "NO";
  price: number;
  shares: number;
  pnl: number;
  strategy: string;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function formatMoney(n: number) {
  return (n >= 0 ? "+$" : "-$") + Math.abs(n).toFixed(2);
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/* ─── P&L Sparkline ─── */
function PnlChart({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const width = 600;
  const height = 160;
  const padding = 20;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const lastPoint = points[points.length - 1].split(",");
  const lastValue = data[data.length - 1];

  // Area fill
  const areaPoints = [
    `${padding},${height - padding}`,
    ...points,
    `${parseFloat(lastPoint[0])},${height - padding}`,
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((pct) => (
        <line
          key={pct}
          x1={padding}
          x2={width - padding}
          y1={height - padding - pct * (height - padding * 2)}
          y2={height - padding - pct * (height - padding * 2)}
          stroke="oklch(22% 0.015 250)"
          strokeWidth="0.5"
        />
      ))}

      {/* Area */}
      <polygon
        points={areaPoints}
        fill={lastValue >= 0 ? "oklch(72% 0.19 155 / 0.1)" : "oklch(65% 0.2 25 / 0.1)"}
      />

      {/* Line */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={lastValue >= 0 ? "oklch(72% 0.19 155)" : "oklch(65% 0.2 25)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Current value dot */}
      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r="4"
        fill={lastValue >= 0 ? "oklch(72% 0.19 155)" : "oklch(65% 0.2 25)"}
      />
      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r="8"
        fill={lastValue >= 0 ? "oklch(72% 0.19 155 / 0.3)" : "oklch(65% 0.2 25 / 0.3)"}
      />
    </svg>
  );
}

/* ─── Main Dashboard (Timelapse mode) ─── */
export default function DemoDashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [pnlHistory, setPnlHistory] = useState<number[]>([0]);
  const [totalPnl, setTotalPnl] = useState(0);
  const [balance, setBalance] = useState(10000);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [scanning, setScanning] = useState(847);
  const [activeMarkets, setActiveMarkets] = useState(0);
  const tradeIdRef = useRef(0);
  const simTimeRef = useRef(0); // simulated seconds since midnight
  const logRef = useRef<HTMLDivElement>(null);

  // Generate trades on accelerated simulated clock
  useEffect(() => {
    const interval = setInterval(() => {
      // Advance simulated clock by 5–12 minutes per trade
      simTimeRef.current += Math.floor(randomBetween(300, 720));
      // Wrap at 24h so it doesn't go past a single day
      if (simTimeRef.current >= 86400) {
        clearInterval(interval);
        return;
      }

      const fakeDate = new Date(2026, 3, 6); // Apr 6 2026
      fakeDate.setSeconds(simTimeRef.current);

      const market = MARKETS[Math.floor(Math.random() * MARKETS.length)];
      const side = Math.random() > 0.45 ? "YES" as const : "NO" as const;
      const price = parseFloat(randomBetween(0.15, 0.85).toFixed(2));
      const shares = Math.floor(randomBetween(25, 400));
      // 68% win rate, realistic small gains
      const isWin = Math.random() < 0.68;
      const pnl = isWin
        ? parseFloat(randomBetween(3, 85).toFixed(2))
        : parseFloat((-randomBetween(2, 55)).toFixed(2));
      const strategy = STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)];

      tradeIdRef.current += 1;

      const trade: Trade = {
        id: tradeIdRef.current,
        time: formatTime(fakeDate),
        market,
        side,
        price,
        shares,
        pnl,
        strategy,
      };

      setTrades((prev) => [trade, ...prev].slice(0, 50));
      setTotalPnl((prev) => {
        const next = prev + pnl;
        setPnlHistory((h) => [...h, next].slice(-100));
        return next;
      });
      setBalance((prev) => prev + pnl);
      if (isWin) setWins((prev) => prev + 1);
      else setLosses((prev) => prev + 1);
      setActiveMarkets(Math.floor(randomBetween(8, 18)));
      setScanning(Math.floor(randomBetween(830, 860)));
    }, 400); // Fast interval — ~24h of trades in about 60 seconds

    return () => clearInterval(interval);
  }, []);

  const winRate = wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-[oklch(6%_0.015_250)] text-[oklch(90%_0.01_250)] font-mono text-sm">
      {/* Top bar */}
      <div className="border-b border-[oklch(18%_0.015_250)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[oklch(72%_0.19_155)] animate-pulse" />
          <span className="font-sans font-bold text-base tracking-tight">
            Cruise<span className="text-[oklch(65%_0.19_250)]"> Alpha</span>
          </span>
          <span className="text-[oklch(45%_0.01_250)] text-xs ml-2">v2.4.1</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-[oklch(55%_0.01_250)]">
          <span>Strategy: <span className="text-[oklch(75%_0.01_250)]">Multi-Strategy</span></span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(72%_0.19_155)]" />
            LIVE
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Stats row */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[
            {
              label: "Portfolio Value",
              value: `$${balance.toFixed(2)}`,
              color: "text-[oklch(90%_0.01_250)]",
            },
            {
              label: "Session P&L",
              value: formatMoney(totalPnl),
              color: totalPnl >= 0 ? "text-[oklch(72%_0.19_155)]" : "text-[oklch(65%_0.2_25)]",
            },
            {
              label: "Win Rate",
              value: `${winRate}%`,
              color: parseFloat(winRate) >= 60 ? "text-[oklch(72%_0.19_155)]" : "text-[oklch(90%_0.01_250)]",
            },
            {
              label: "Total Trades",
              value: `${wins + losses}`,
              color: "text-[oklch(90%_0.01_250)]",
            },
            {
              label: "Markets Scanning",
              value: `${scanning}`,
              color: "text-[oklch(65%_0.19_250)]",
            },
            {
              label: "Active Positions",
              value: `${activeMarkets}`,
              color: "text-[oklch(65%_0.19_250)]",
            },
          ].map((stat, i) => (
            <div key={i} className="rounded-lg border border-[oklch(18%_0.015_250)] bg-[oklch(8%_0.012_250)] p-4">
              <p className="text-[10px] uppercase tracking-wider text-[oklch(45%_0.01_250)] mb-1">
                {stat.label}
              </p>
              <p className={`text-xl font-bold tabular-nums ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1.5fr_1fr] gap-6">
          {/* Left: Chart + Trade log */}
          <div className="space-y-6">
            {/* P&L Chart */}
            <div className="rounded-lg border border-[oklch(18%_0.015_250)] bg-[oklch(8%_0.012_250)] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-wider text-[oklch(45%_0.01_250)]">
                  Session P&L
                </p>
                <p className={`text-sm font-bold tabular-nums ${totalPnl >= 0 ? "text-[oklch(72%_0.19_155)]" : "text-[oklch(65%_0.2_25)]"}`}>
                  {formatMoney(totalPnl)}
                </p>
              </div>
              <div className="h-[160px]">
                <PnlChart data={pnlHistory} />
              </div>
            </div>

            {/* Trade log */}
            <div className="rounded-lg border border-[oklch(18%_0.015_250)] bg-[oklch(8%_0.012_250)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[oklch(18%_0.015_250)]">
                <p className="text-[10px] uppercase tracking-wider text-[oklch(45%_0.01_250)]">
                  Trade Log
                </p>
              </div>
              <div className="overflow-hidden max-h-[320px]" ref={logRef}>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[oklch(45%_0.01_250)] text-left">
                      <th className="px-4 py-2 font-medium">Time</th>
                      <th className="px-4 py-2 font-medium">Market</th>
                      <th className="px-4 py-2 font-medium">Side</th>
                      <th className="px-4 py-2 font-medium">Price</th>
                      <th className="px-4 py-2 font-medium">Shares</th>
                      <th className="px-4 py-2 font-medium">Strategy</th>
                      <th className="px-4 py-2 font-medium text-right">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.slice(0, 12).map((trade) => (
                      <tr
                        key={trade.id}
                        className="border-t border-[oklch(14%_0.012_250)] hover:bg-[oklch(10%_0.012_250)]"
                      >
                        <td className="px-4 py-2 text-[oklch(55%_0.01_250)]">{trade.time}</td>
                        <td className="px-4 py-2 text-[oklch(80%_0.01_250)]">{trade.market}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              trade.side === "YES"
                                ? "bg-[oklch(72%_0.19_155/0.15)] text-[oklch(72%_0.19_155)]"
                                : "bg-[oklch(65%_0.2_25/0.15)] text-[oklch(65%_0.2_25)]"
                            }`}
                          >
                            {trade.side}
                          </span>
                        </td>
                        <td className="px-4 py-2 tabular-nums">${trade.price}</td>
                        <td className="px-4 py-2 tabular-nums">{trade.shares}</td>
                        <td className="px-4 py-2 text-[oklch(55%_0.01_250)]">{trade.strategy}</td>
                        <td
                          className={`px-4 py-2 text-right tabular-nums font-medium ${
                            trade.pnl >= 0 ? "text-[oklch(72%_0.19_155)]" : "text-[oklch(65%_0.2_25)]"
                          }`}
                        >
                          {formatMoney(trade.pnl)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Activity feed + Market scanner */}
          <div className="space-y-6">
            {/* Win/Loss bar */}
            <div className="rounded-lg border border-[oklch(18%_0.015_250)] bg-[oklch(8%_0.012_250)] p-4">
              <p className="text-[10px] uppercase tracking-wider text-[oklch(45%_0.01_250)] mb-3">
                Win / Loss
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[oklch(72%_0.19_155)] font-bold">{wins}W</span>
                <div className="flex-1 h-2 rounded-full bg-[oklch(14%_0.012_250)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[oklch(72%_0.19_155)] transition-all duration-500"
                    style={{ width: wins + losses > 0 ? `${(wins / (wins + losses)) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-[oklch(65%_0.2_25)] font-bold">{losses}L</span>
              </div>
            </div>

            {/* Live activity feed */}
            <div className="rounded-lg border border-[oklch(18%_0.015_250)] bg-[oklch(8%_0.012_250)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[oklch(18%_0.015_250)]">
                <p className="text-[10px] uppercase tracking-wider text-[oklch(45%_0.01_250)]">
                  Live Activity
                </p>
              </div>
              <div className="p-4 space-y-3 max-h-[200px] overflow-hidden">
                {trades.slice(0, 6).map((trade) => (
                  <div key={trade.id} className="flex items-start gap-3 text-xs">
                    <span
                      className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        trade.pnl >= 0 ? "bg-[oklch(72%_0.19_155)]" : "bg-[oklch(65%_0.2_25)]"
                      }`}
                    />
                    <div>
                      <span className="text-[oklch(70%_0.01_250)]">
                        {trade.side} {trade.shares} shares of{" "}
                        <span className="text-[oklch(85%_0.01_250)]">{trade.market}</span> @ ${trade.price}
                      </span>
                      <span
                        className={`ml-2 font-medium ${
                          trade.pnl >= 0 ? "text-[oklch(72%_0.19_155)]" : "text-[oklch(65%_0.2_25)]"
                        }`}
                      >
                        {formatMoney(trade.pnl)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Markets being scanned */}
            <div className="rounded-lg border border-[oklch(18%_0.015_250)] bg-[oklch(8%_0.012_250)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[oklch(18%_0.015_250)]">
                <p className="text-[10px] uppercase tracking-wider text-[oklch(45%_0.01_250)]">
                  Market Scanner
                </p>
              </div>
              <div className="p-4 space-y-2">
                {MARKETS.slice(0, 8).map((market, i) => {
                  const spread = randomBetween(0.5, 8).toFixed(1);
                  const isHot = parseFloat(spread) > 4;
                  return (
                    <div
                      key={market}
                      className="flex items-center justify-between text-xs py-1"
                    >
                      <span className="text-[oklch(65%_0.01_250)]">{market}</span>
                      <span
                        className={`tabular-nums ${
                          isHot
                            ? "text-[oklch(72%_0.19_155)] font-medium"
                            : "text-[oklch(45%_0.01_250)]"
                        }`}
                      >
                        {spread}% spread
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
