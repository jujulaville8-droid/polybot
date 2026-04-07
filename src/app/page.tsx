"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Ticker markets ─── */
const TICKER_ITEMS = [
  { name: "FED RATE CUT (-25BPS)", price: "78¢", change: "+2¢", up: true },
  { name: "ETH > $3K EOY", price: "42¢", change: "-1¢", up: false },
  { name: "BITCOIN $100K 2025", price: "64¢", change: "+0.5¢", up: true },
  { name: "US GDP > 2.5% Q4", price: "51¢", change: null, up: false },
  { name: "SPX > 6000 EOY", price: "82¢", change: "+1¢", up: true },
];

/* ─── FAQ data ─── */
const FAQ_ITEMS = [
  {
    q: "Do I need to be a Python expert?",
    a: "No. You need basic familiarity with coding concepts (variables, loops). We supply the architectural blueprints and explain the math step-by-step. It is a steep learning curve, but entirely guided.",
  },
  {
    q: "What is the minimum capital to deploy on Polymarket?",
    a: "Because gas fees on Polygon are fractions of a cent, you can run and forward-test this bot with as little as $10 USDC. We highly recommend testing with micro-amounts before allocating serious capital.",
  },
  {
    q: "Is using an API bot against Polymarket Terms of Service?",
    a: "No. Polymarket openly provides developer documentation and API access specifically for programmatic access. They rely on market makers and algo traders to provide liquidity.",
  },
  {
    q: "Does this guarantee I will make a 71% return?",
    a: "Absolutely not. 71.2% refers to the historical directional accuracy of the model on specific backtest datasets, not financial returns. Predictive models guide probabilities, but market conditions change. This is an educational course on engineering, not financial advice.",
    isDanger: true,
  },
  {
    q: "What are the risks?",
    a: "All trading carries risk of financial loss. The course teaches systematic strategies with built-in risk management (position limits, max drawdown stops, diversification), but no system eliminates risk entirely. Never trade with money you can't afford to lose.",
  },
  {
    q: "How is this different from buying a bot?",
    a: "Bought bots run static rules that decay over time. Here, you build an AI-powered bot that retrains on new data and adapts to changing markets. You understand the model, the features, and the training pipeline. No black boxes, no vendor dependency.",
  },
  {
    q: "How long does it take?",
    a: "Most students deploy their first AI bot within 4 weeks, spending a few hours per week. The full curriculum covers advanced ML strategies over 6-8 weeks, but you can go at your own pace.",
  },
  {
    q: "What kind of AI does the bot use?",
    a: "You'll build models using gradient-boosted trees and logistic regression for probability estimation, plus a reinforcement learning loop for strategy optimization. The bot retrains on new market outcomes automatically. No GPT wrapper stuff -- real predictive ML.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes. 30-day money-back guarantee, no questions asked.",
  },
];

/* ─── Intersection observer for scroll reveals ─── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

/* ─── Calendly inline widget ─── */
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

function CalendlyEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const init = () => {
      if (window.Calendly) {
        el.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: "https://calendly.com/qqwebsitesolutions/qq-solutions-consultation",
          parentElement: el,
        });
      }
    };

    if (window.Calendly) {
      init();
    } else {
      const check = setInterval(() => {
        if (window.Calendly) {
          clearInterval(check);
          init();
        }
      }, 200);
      return () => clearInterval(check);
    }
  }, []);

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-2">Pick a time that works</h3>
      <p className="text-text-muted mb-8 text-sm">
        15 minutes. We&apos;ll review your background and map out the right
        learning path for you.
      </p>
      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden"
        style={{ minWidth: "320px", height: "700px" }}
      />
    </div>
  );
}

/* ─── Inline booking panel ─── */
function InlineBookingPanel({
  open,
  id,
}: {
  open: boolean;
  id: string;
}) {
  return (
    <div id={id} className="booking-panel" data-open={open ? "true" : "false"}>
      <div className="overflow-hidden">
        <div className="mx-auto max-w-2xl pt-12 pb-4">
          {open && <CalendlyEmbed />}
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar (desktop) ─── */
function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-bg/95 z-20 sticky top-0 h-screen font-mono text-xs text-text-muted shrink-0">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <span className="text-text-main font-bold tracking-widest uppercase">
          Cruise.Alpha
        </span>
        <i className="ph ph-terminal-window text-lg" />
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-text-muted/60 mb-2 block">
            System Status
          </span>
          <div className="flex items-center gap-2">
            <div className="relative w-2 h-2 rounded-full bg-neon pulse-dot" />
            <span className="text-neon font-medium">Core Online</span>
          </div>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-text-muted/60 mb-1 block">
            Course Syllabus
          </span>
          {[
            { href: "#hero", icon: "ph-file-code", label: "00_init.py" },
            { href: "#problem", icon: "ph-chart-line-up", label: "01_the_edge.md" },
            { href: "#curriculum", icon: "ph-tree-structure", label: "02_architecture.yml" },
            { href: "#features", icon: "ph-cpu", label: "03_tech_stack.json" },
            { href: "#faq", icon: "ph-question", label: "04_faq.txt" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:bg-surface-light hover:text-text-main px-2 py-1.5 rounded transition-colors flex items-center gap-2"
            >
              <i className={`ph ${item.icon}`} />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-border">
        <div className="flex justify-between items-center bg-surface p-2 rounded border border-border">
          <span>Model Acc:</span>
          <span className="text-neon">71.2%</span>
        </div>
      </div>
    </aside>
  );
}

/* ─── Market Ticker ─── */
function MarketTicker() {
  const renderItems = () => (
    <div className="flex items-center space-x-6 pr-6">
      {TICKER_ITEMS.map((item, i) => (
        <span key={i}>
          <span className="text-text-main">{item.name}:</span> {item.price}{" "}
          {item.change ? (
            <span className={item.up ? "text-neon" : "text-danger"}>
              {item.up ? "↑" : "↓"}
              {item.change}
            </span>
          ) : (
            <span className="text-text-muted">&ndash;</span>
          )}
          {i < TICKER_ITEMS.length - 1 && (
            <span className="text-border ml-6">|</span>
          )}
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-surface border-b border-border overflow-hidden flex items-center h-8 text-[11px] font-mono select-none">
      <div className="scrolling-ticker text-text-muted">
        {renderItems()}
        {renderItems()}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const toggleBooking = useCallback(() => {
    setBookingOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          document
            .getElementById("booking-panel")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
      return next;
    });
  }, []);

  /* Section reveal refs */
  const problemRef = useReveal();
  const curriculumRef = useReveal();
  const featuresRef = useReveal();
  const faqRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      {/* Global overlays */}
      <div className="fixed inset-0 pointer-events-none grid-bg z-0 opacity-60" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <MarketTicker />

        <div className="p-4 md:p-8 lg:p-12 space-y-24 max-w-7xl mx-auto w-full box-border">
          {/* ══════════════ HERO ══════════════ */}
          <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            {/* Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 rounded-full text-xs font-mono text-accent">
                <i className="ph-fill ph-robot text-sm" />
                <span>DEPLOY YOUR OWN ALGOS</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                Stop buying bots.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8FAFC] to-[#94A3B8]">
                  Engineer an edge.
                </span>
              </h1>

              <p className="text-lg text-text-muted max-w-xl font-light">
                Learn to build a self-learning, ML-powered API trading rig for
                Polymarket. We don&apos;t sell you a black-box signal; we teach
                you how to write the architecture that generated a{" "}
                <span className="text-neon font-mono">71.2% accuracy</span>{" "}
                across 10k epochs.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={toggleBooking}
                  className="group relative px-6 py-4 bg-neon text-bg font-bold font-mono uppercase tracking-wide rounded hover:brightness-110 transition-all w-full sm:w-auto text-center flex items-center justify-center gap-2 glow-box"
                >
                  Initialize Architecture Call
                  <i className="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                  <i className="ph ph-infinity text-lg" />
                  <span>LIFETIME ACCESS + 1:1 SETUP</span>
                </div>
              </div>
            </div>

            {/* Terminal */}
            <div className="lg:col-span-6 relative min-w-0 mb-8">
              <div className="glass-panel rounded-xl overflow-hidden shadow-2xl shadow-neon/5 border border-border/50">
                {/* Terminal header */}
                <div className="bg-surface border-b border-border px-4 py-2 flex items-center justify-between text-xs font-mono text-text-muted">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  </div>
                  <span>~/cruise_alpha/deploy.py</span>
                  <i className="ph ph-copy" />
                </div>

                {/* Terminal body */}
                <div className="p-6 pb-12 font-mono text-sm leading-relaxed">
                  <span className="text-accent">import</span> polymarket_api
                  <br />
                  <span className="text-accent">import</span> xgboost{" "}
                  <span className="text-accent">as</span> xgb
                  <br />
                  <br />
                  <span className="text-text-muted">
                    # Initialize Core Learner
                  </span>
                  <br />
                  model = xgb.XGBClassifier(n_estimators=
                  <span className="text-neon">1000</span>, learning_rate=
                  <span className="text-neon">0.01</span>)
                  <br />
                  <br />
                  <span className="text-text-muted">
                    &gt;&gt; Fetching historical tensor data... [OK]
                  </span>
                  <br />
                  <span className="text-text-muted">
                    &gt;&gt; Training on market: &quot;Fed_Rate_Nov&quot;
                  </span>
                  <br />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-full bg-surface-light h-2 rounded overflow-hidden">
                      <div className="bg-neon h-full w-[80%]" />
                    </div>
                    <span className="text-xs">EPOCH_80%</span>
                  </div>
                  <br />
                  <span className="text-neon">
                    &gt; EXPECTED VALUE: $0.62
                  </span>
                  <br />
                  <span className="text-danger">
                    &gt; CURRENT PRICE: $0.48
                  </span>
                  <br />
                  <span className="text-text-main">
                    &gt; ALPHA DETECTED. EXECUTING LIMIT ORDER.{" "}
                    <span className="bg-text-main w-2 h-4 inline-block align-middle cursor-blink" />
                  </span>
                </div>
              </div>

              {/* Accuracy widget — overlaps terminal's empty bottom-left area */}
              <div className="absolute -bottom-8 left-6 glass-panel p-4 rounded-lg flex items-center gap-4 text-sm font-mono border-l-2 border-l-neon shadow-xl w-64 hidden sm:flex z-10">
                <div className="w-10 h-10 rounded bg-neon/10 flex items-center justify-center text-neon text-xl">
                  <i className="ph-fill ph-chart-polar" />
                </div>
                <div>
                  <div className="text-text-muted text-[10px]">
                    CURRENT EDGE PROBABILITY
                  </div>
                  <div className="text-xl font-bold glow-text text-neon">
                    71.20%
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════ PROBLEM VS SOLUTION ══════════════ */}
          <section
            ref={problemRef as React.RefObject<HTMLElement>}
            id="problem"
            className="reveal-section pt-12 border-t border-border/50"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                The Retail Trap vs. The Engineering Reality
              </h2>
              <p className="text-text-muted text-sm font-mono mt-2">
                Why 90% of buyers lose money on pre-packaged signals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bad card */}
              <div className="glass-panel p-6 rounded-xl border-t-2 border-t-danger/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-danger/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-text-main">
                      Buying &quot;Black Box&quot; Bots
                    </h3>
                    <p className="text-sm text-text-muted mt-1">
                      Static logic. Decays as markets adapt.
                    </p>
                  </div>
                  <i className="ph ph-trend-down text-danger text-2xl" />
                </div>
                <div className="bg-surface border border-border rounded-lg p-4 font-mono text-xs text-text-muted opacity-80 h-32 flex flex-col justify-end relative">
                  <svg
                    className="absolute inset-0 w-full h-full p-4"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <path
                      d="M0,20 L20,30 L40,25 L60,50 L80,60 L100,85"
                      fill="none"
                      stroke="#FF3366"
                      strokeWidth="2"
                      className="opacity-50"
                    />
                  </svg>
                  <div className="flex justify-between border-t border-border pt-2 relative z-10">
                    <span>Day 1: +5%</span>
                    <span className="text-danger">Day 30: -18%</span>
                  </div>
                </div>
              </div>

              {/* Good card */}
              <div className="glass-panel p-6 rounded-xl border-t-2 border-t-neon/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-text-main glow-text">
                      Building a Self-Learning Agent
                    </h3>
                    <p className="text-sm text-text-muted mt-1">
                      Dynamic ML. Retrains on new market data.
                    </p>
                  </div>
                  <i className="ph ph-trend-up text-neon text-2xl" />
                </div>
                <div className="bg-surface border border-border rounded-lg p-4 font-mono text-xs text-text-muted h-32 flex flex-col justify-end relative">
                  <svg
                    className="absolute inset-0 w-full h-full p-4"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <path
                      d="M0,80 L20,70 L40,75 L60,40 L80,30 L100,10"
                      fill="none"
                      stroke="#00FF88"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="spark-path"
                    />
                  </svg>
                  <div className="flex justify-between border-t border-border pt-2 relative z-10">
                    <span>Epoch 1: Base</span>
                    <span className="text-neon glow-text">
                      Epoch 10k: +Alpha
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════ CURRICULUM PIPELINE ══════════════ */}
          <section
            ref={curriculumRef as React.RefObject<HTMLElement>}
            id="curriculum"
            className="reveal-section pt-12"
          >
            <div className="mb-10">
              <h2 className="text-3xl font-bold">
                Execution Pipeline
                <span className="text-accent text-xl">()</span>
              </h2>
              <p className="text-text-muted text-sm font-mono mt-2">
                The exact curriculum syllabus, built top-to-bottom.
              </p>
            </div>

            <div className="relative border-l-2 border-border/50 ml-4 md:ml-8 space-y-12">
              {/* Phase 1 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-surface border-2 border-border flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-text-muted" />
                </div>
                <div className="glass-panel p-6 rounded-lg border border-border group hover:border-accent/50 transition-colors">
                  <h3 className="text-accent font-mono text-sm mb-2">
                    Phase_01: Data Ingestion
                  </h3>
                  <h4 className="text-xl font-bold mb-4">
                    Polymarket API Integration
                  </h4>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">
                    You cannot trade what you cannot see. We build custom Python
                    wrappers connecting via WebSockets to stream live order
                    books, historical resolution data, and liquidity depth
                    directly from Polymarket smart contracts.
                  </p>
                  <div className="bg-bg p-3 rounded font-mono text-xs overflow-x-auto text-text-muted border border-border">
                    <span className="text-accent">await</span>{" "}
                    <span className="text-[#c678dd]">PolymarketClient</span>
                    ().subscribe(market_id=
                    <span className="text-[#e5c07b]">
                      &apos;0x...1a4&apos;
                    </span>
                    )
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-surface border-2 border-border flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-text-muted" />
                </div>
                <div className="glass-panel p-6 rounded-lg border border-border group hover:border-[#c678dd]/50 transition-colors">
                  <h3 className="text-[#c678dd] font-mono text-sm mb-2">
                    Phase_02: Feature Engineering
                  </h3>
                  <h4 className="text-xl font-bold mb-4">
                    Quantifying Sentiment &amp; Order Flow
                  </h4>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">
                    Raw data is useless. Learn to transform order book
                    imbalances, time-decay factors, and external scraping
                    metrics (Twitter sentiment, news APIs) into normalized
                    tensors ready for machine consumption.
                  </p>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
                    <div className="bg-surface p-2 rounded border border-border">
                      T_Imbalance
                    </div>
                    <div className="bg-surface p-2 rounded border border-border">
                      Sentiment_Var
                    </div>
                    <div className="bg-surface p-2 rounded border border-border">
                      Vol_Oscillator
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 3 — highlighted */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-neon/20 border-2 border-neon flex items-center justify-center pulse-dot">
                  <div className="w-2 h-2 rounded-full bg-neon" />
                </div>
                <div className="glass-panel p-6 rounded-lg border border-neon/30 shadow-[0_0_30px_-10px_rgba(0,255,136,0.1)]">
                  <h3 className="text-neon font-mono text-sm mb-2 glow-text">
                    Phase_03: Model Training (The CoreEdge)
                  </h3>
                  <h4 className="text-xl font-bold mb-4 text-text-main glow-text">
                    Gradient Boosted Decision Trees
                  </h4>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">
                    The heart of Cruise Alpha. We construct, train, and test an
                    XGBoost model. Learn splitting logic, hyperparameter tuning,
                    and k-fold cross-validation to prevent overfitting. Your bot
                    learns to identify mispriced probability.
                  </p>
                  <div className="h-2 w-full bg-surface rounded overflow-hidden flex">
                    <div className="h-full bg-danger w-1/4" />
                    <div className="h-full bg-accent w-1/4" />
                    <div className="h-full bg-neon w-2/4" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono mt-1 text-text-muted">
                    <span>Variance</span>
                    <span>Generalization</span>
                    <span className="text-neon">Alpha Generated</span>
                  </div>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-surface border-2 border-border flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-text-muted" />
                </div>
                <div className="glass-panel p-6 rounded-lg border border-border group hover:border-accent/50 transition-colors">
                  <h3 className="text-text-muted font-mono text-sm mb-2">
                    Phase_04: Live Execution
                  </h3>
                  <h4 className="text-xl font-bold mb-4">
                    Position Sizing &amp; Kelly Criterion
                  </h4>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">
                    Having an edge is step one. Sizing your bets correctly
                    ensures survival. We implement the Kelly Criterion
                    dynamically to size automated positions based on the
                    model&apos;s confidence level.
                  </p>
                  <div className="flex items-center gap-4 bg-bg p-3 rounded border border-border">
                    <i className="ph ph-shield-check text-2xl text-text-muted" />
                    <div className="text-xs font-mono text-text-muted">
                      <div className="flex justify-between w-48">
                        <span>Confidence:</span>
                        <span className="text-text-main">82%</span>
                      </div>
                      <div className="flex justify-between w-48">
                        <span>Capital Allocation:</span>
                        <span className="text-accent">4.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════ FEATURE BENTO ══════════════ */}
          <section
            ref={featuresRef as React.RefObject<HTMLElement>}
            id="features"
            className="reveal-section pt-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
              {/* Tech stack — spans 2 */}
              <div className="md:col-span-2 glass-panel p-6 rounded-xl border border-border flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center mb-4">
                    <i className="ph ph-wrench text-text-main" />
                  </div>
                  <h3 className="text-lg font-bold">Tech Stack Provided</h3>
                  <p className="text-sm text-text-muted mt-2 max-w-md">
                    No hidden dependencies. We build entirely on
                    industry-standard, open-source data science tools. You own
                    the code.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6 lg:mt-4 font-mono text-xs">
                  {[
                    { label: "Python 3.10", color: "text-[#3776AB]" },
                    { label: "Pandas", color: "text-[#6b21a8]" },
                    { label: "Scikit-Learn", color: "text-[#F37626]" },
                    { label: "XGBoost", color: "text-text-main" },
                    { label: "REST/WSS", color: "text-accent" },
                  ].map((item) => (
                    <span
                      key={item.label}
                      className={`px-2 py-1 bg-surface border border-border rounded ${item.color}`}
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* 1-on-1 */}
              <div className="glass-panel p-6 rounded-xl border border-border bg-gradient-to-br from-surface to-bg">
                <div className="w-8 h-8 rounded bg-neon/10 border border-neon/30 flex items-center justify-center mb-4">
                  <i className="ph ph-phone-call text-neon text-lg" />
                </div>
                <h3 className="text-lg font-bold">1-on-1 Initialization</h3>
                <p className="text-sm text-text-muted mt-2">
                  Every enrollment includes a 45-minute private call to set up
                  your environment, debug dependencies, and ensure your first
                  scripts execute correctly.
                </p>
              </div>

              {/* Lifetime access */}
              <div className="glass-panel p-6 rounded-xl border border-border">
                <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center mb-4">
                  <i className="ph ph-clock-counter-clockwise text-text-main" />
                </div>
                <h3 className="text-lg font-bold">Lifetime Access</h3>
                <p className="text-sm text-text-muted mt-2">
                  Polymarket updates their API? The course updates. You get
                  lifetime access to the repository, updates, and architectural
                  changes.
                </p>
              </div>

              {/* Guarantee — spans 2 */}
              <div className="md:col-span-2 glass-panel p-6 rounded-xl border border-border flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">
                    30-Day Runtime Guarantee
                  </h3>
                  <p className="text-sm text-text-muted mt-2">
                    If you cannot get the bot to run backtests on your local
                    machine within 30 days, we&apos;ll dive in to fix it. If we
                    can&apos;t, full refund. Zero risk on execution.
                  </p>
                </div>
                <div className="w-full md:w-auto text-center md:text-right font-mono">
                  <div className="text-3xl text-text-main font-bold">100%</div>
                  <div className="text-[10px] text-text-muted tracking-wider uppercase">
                    Risk Reversal
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════ FAQ ══════════════ */}
          <section
            ref={faqRef as React.RefObject<HTMLElement>}
            id="faq"
            className="reveal-section pt-12 max-w-3xl mx-auto w-full"
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold">System Diagnostics (FAQ)</h2>
              <div className="text-neon font-mono text-xs mt-2 glow-text">
                Status: {FAQ_ITEMS.length} Queries Resolved
              </div>
            </div>

            <div className="space-y-2">
              {FAQ_ITEMS.map((item, i) => (
                <details
                  key={i}
                  className="bg-surface border border-border rounded-lg group cursor-pointer overflow-hidden p-1"
                >
                  <summary className="p-4 text-sm font-medium flex justify-between items-center text-text-main group-hover:text-neon transition-colors select-none">
                    {item.q}
                    <i className="ph ph-caret-down text-text-muted group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-text-muted leading-relaxed">
                    {item.isDanger ? (
                      <>
                        <strong className="text-danger">
                          Absolutely not.
                        </strong>{" "}
                        {item.a.replace("Absolutely not. ", "")}
                      </>
                    ) : (
                      item.a
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* ══════════════ FINAL CTA ══════════════ */}
          <section
            ref={ctaRef as React.RefObject<HTMLElement>}
            id="calendly"
            className="reveal-section pt-12 pb-24 relative"
          >
            <div className="absolute inset-0 bg-neon/5 blur-[100px] pointer-events-none rounded-full" />

            <div className="glass-panel border-2 border-neon/20 rounded-2xl p-8 md:p-12 text-center relative z-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon/10 rounded-full blur-[40px] pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-neon/20 rounded text-[10px] uppercase tracking-[0.2em] font-mono text-neon mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-neon animate-ping" />
                Capacity Limited
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                Ready to compile?
              </h2>
              <p className="text-text-muted max-w-xl mx-auto mb-8">
                The market doesn&apos;t wait for manual traders. Book an intro
                call to see if your technical background is a fit for Cruise
                Alpha.
              </p>

              <button
                onClick={toggleBooking}
                className="relative group inline-flex items-center justify-center overflow-hidden rounded bg-neon font-mono font-bold text-bg px-8 py-5 text-lg transition-transform hover:scale-[1.02] active:scale-[0.98] glow-box"
              >
                <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-full" />
                <span className="relative flex items-center gap-3">
                  <i className="ph-bold ph-calendar-plus text-xl" />
                  Select Date &amp; Time
                </span>
              </button>

              <div className="mt-4 text-xs font-mono text-text-muted flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <i className="ph ph-check text-neon" /> No Commitment
                </span>
                <span className="flex items-center gap-1">
                  <i className="ph ph-check text-neon" /> 15 Min Overview
                </span>
              </div>
            </div>
          </section>

          {/* ── INLINE BOOKING PANEL ── */}
          <div className="border-t border-border">
            <InlineBookingPanel open={bookingOpen} id="booking-panel" />
          </div>

          {/* ══════════════ FOOTER ══════════════ */}
          <footer className="border-t border-border/50 pt-8 pb-12 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-text-muted relative z-10">
            <div>
              &copy; {new Date().getFullYear()} Cruise Alpha. All rights
              reserved.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a
                href="#"
                className="hover:text-text-main transition-colors"
              >
                TOS
              </a>
              <a
                href="#"
                className="hover:text-text-main transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-text-main transition-colors"
              >
                Risk Disclaimer
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
