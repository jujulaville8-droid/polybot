"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  animateHero, animateSection, animateTerminalLine, animateCounter,
  animateProblemCards, animateSteps, animateBento, animateFaq,
  animatePullQuote, animateFinalCta,
} from "./animations";
import ParticleNetwork from "./particles";

/* ─── Terminal animation lines ─── */
const TERMINAL_LINES = [
  { text: "$ cruise-alpha init --project my-ai-bot", type: "input" as const },
  { text: "Scaffolding AI-powered bot project...", type: "output" as const },
  { text: "✓ Project created. Loading ML pipeline...", type: "success" as const },
  { text: "Lesson 1: Connecting to the Polymarket API", type: "output" as const },
  { text: "✓ API connected. 847 markets loaded into feature store.", type: "success" as const },
  { text: "Lesson 2: Training your prediction model", type: "output" as const },
  { text: "✓ Model trained on 18mo data. Accuracy: 71.2%", type: "success" as const },
  { text: "Lesson 3: Deploying the self-learning loop", type: "trade" as const },
  { text: "✓ Reinforcement loop active. Bot adapts to new data.", type: "success" as const },
  { text: "$ cruise-alpha deploy --live", type: "input" as const },
  { text: "✓ AI bot is live and learning. You built this.", type: "profit" as const },
];

/* ─── Ticker markets (the signature visual) ─── */
const TICKER_MARKETS = [
  { name: "Fed Rate Cut July", yes: 0.42, change: +2.1 },
  { name: "ETH > $5k Dec", no: 0.71, change: -1.3 },
  { name: "Trump Wins 2028", yes: 0.31, change: +5.4 },
  { name: "BTC > $200k 2026", yes: 0.18, change: +0.8 },
  { name: "AI Regulation Bill", yes: 0.67, change: -2.7 },
  { name: "SpaceX Mars Landing", yes: 0.09, change: +0.3 },
  { name: "Recession by Q4", yes: 0.44, change: +3.1 },
  { name: "Olympics Paris Bid", yes: 0.88, change: -0.2 },
  { name: "Gold > $3500", yes: 0.56, change: +1.7 },
  { name: "Netflix Hits 400M", yes: 0.73, change: -0.9 },
];

/* ─── FAQ data ─── */
const FAQ_ITEMS = [
  {
    q: "Do I need coding or AI experience?",
    a: "No. The curriculum starts from Python basics and builds up to machine learning concepts step by step. You don't need a math degree. Most students with zero ML background have a trained model running by week 4.",
  },
  {
    q: "Is trading on Polymarket legal?",
    a: "Polymarket operates as a CFTC-regulated prediction market. Legality depends on your jurisdiction. We teach you how to build trading bots and you are responsible for ensuring compliance with your local laws.",
  },
  {
    q: "What are the risks?",
    a: "All trading carries risk of financial loss. The course teaches systematic strategies with built-in risk management (position limits, max drawdown stops, diversification), but no system eliminates risk entirely. Never trade with money you can't afford to lose.",
  },
  {
    q: "What do I get access to?",
    a: "Lifetime access to the full curriculum, video lessons, code templates, a private community of other students, and ongoing updates as Polymarket's API evolves. You also get a 1-on-1 intro call to map out your learning path.",
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
    q: "Which markets can my bot trade?",
    a: "Any Polymarket market. Political predictions, crypto prices, sports, world events. You'll learn to configure which categories and risk parameters fit your goals.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes. 30-day money-back guarantee, no questions asked.",
  },
];

/* ─── Intersection Observer hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ─── Interactive 3D Terminal ─── */
function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [booted, setBooted] = useState(false);
  const { ref: inViewRef, inView } = useInView(0.3);
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const glowRef = useRef({ x: 50, y: 50 });
  const rafRef = useRef(0);

  // Boot-up sequence
  useEffect(() => {
    if (!inView) return;
    // Brief "booting" delay before lines start
    const bootTimer = setTimeout(() => setBooted(true), 600);
    return () => clearTimeout(bootTimer);
  }, [inView]);

  // Start lines after boot
  useEffect(() => {
    if (!booted) return;
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= TERMINAL_LINES.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(timer);
  }, [booted]);

  // 3D tilt + glow tracking
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // Normalize to -1 to 1
      const nx = (e.clientX - centerX) / (rect.width / 2);
      const ny = (e.clientY - centerY) / (rect.height / 2);
      tiltRef.current.targetX = ny * -8; // Rotate around X axis (vertical mouse = X rotation)
      tiltRef.current.targetY = nx * 8;  // Rotate around Y axis
      // Glow position as percentage
      glowRef.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      glowRef.current.y = ((e.clientY - rect.top) / rect.height) * 100;
    };

    const handleLeave = () => {
      tiltRef.current.targetX = 0;
      tiltRef.current.targetY = 0;
    };

    // Smooth interpolation loop
    const update = () => {
      const t = tiltRef.current;
      t.x += (t.targetX - t.x) * 0.08;
      t.y += (t.targetY - t.y) * 0.08;

      el.style.transform = `perspective(800px) rotateX(${t.x}deg) rotateY(${t.y}deg)`;

      // Update glow
      const inner = el.querySelector(".terminal-glow") as HTMLElement;
      if (inner) {
        inner.style.background = `radial-gradient(circle at ${glowRef.current.x}% ${glowRef.current.y}%, oklch(65% 0.19 250 / 0.08) 0%, transparent 60%)`;
      }

      rafRef.current = requestAnimationFrame(update);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    rafRef.current = requestAnimationFrame(update);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const lineColor = (type: string) => {
    switch (type) {
      case "input": return "text-text-secondary";
      case "success": return "text-profit";
      case "trade": return "text-accent";
      case "profit": return "text-profit font-semibold";
      default: return "text-text-tertiary";
    }
  };

  return (
    <div ref={inViewRef}>
      <div
        ref={containerRef}
        className="w-full rounded-2xl border border-border bg-surface-1 overflow-hidden relative transition-shadow duration-500"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          boxShadow: booted
            ? "0 0 40px oklch(65% 0.19 250 / 0.06), 0 20px 60px oklch(8% 0.015 250 / 0.5)"
            : "0 20px 60px oklch(8% 0.015 250 / 0.5)",
        }}
      >
        {/* Glow overlay that follows cursor */}
        <div className="terminal-glow absolute inset-0 pointer-events-none rounded-2xl" />

        {/* Edge glow on boot */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-1000"
          style={{
            opacity: booted ? 1 : 0,
            boxShadow: "inset 0 0 1px oklch(65% 0.19 250 / 0.3)",
          }}
        />

        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border relative">
          <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${booted ? "bg-[oklch(55%_0.2_25)]" : "bg-surface-3"}`} />
          <div className={`w-3 h-3 rounded-full transition-colors duration-500 delay-100 ${booted ? "bg-[oklch(75%_0.18_85)]" : "bg-surface-3"}`} />
          <div className={`w-3 h-3 rounded-full transition-colors duration-500 delay-200 ${booted ? "bg-[oklch(72%_0.19_155)]" : "bg-surface-3"}`} />
          <span className={`ml-3 text-xs font-mono transition-opacity duration-500 delay-300 ${booted ? "text-text-tertiary" : "text-transparent"}`}>
            cruise-alpha — ai-training: module-1
          </span>
        </div>

        {/* Terminal body */}
        <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-6 sm:leading-7 min-h-[240px] sm:min-h-[420px] relative">
          {!booted && inView && (
            <div className="text-text-tertiary animate-pulse">
              Loading Cruise Alpha AI Curriculum v2.4...
            </div>
          )}
          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={lineColor(line.type)}>
              {line.text}
            </div>
          ))}
          {booted && visibleLines < TERMINAL_LINES.length && (
            <span className="cursor-blink text-accent">▊</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Scrolling market ticker (signature visual) ─── */
function MarketTicker() {
  const items = [...TICKER_MARKETS, ...TICKER_MARKETS];

  return (
    <div className="relative overflow-hidden border-y border-border bg-surface-1/60 py-4">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="animate-ticker flex gap-8 w-max">
        {items.map((m, i) => (
          <div key={i} className="flex items-center gap-3 text-sm whitespace-nowrap">
            <span className="text-text-secondary font-medium">{m.name}</span>
            <span className="tabular font-semibold">
              ${(m.yes ?? m.no ?? 0).toFixed(2)}
            </span>
            <span
              className={`tabular text-xs font-medium ${
                m.change > 0 ? "text-profit" : "text-[oklch(65%_0.2_25)]"
              }`}
            >
              {m.change > 0 ? "+" : ""}
              {m.change.toFixed(1)}%
            </span>
            <span className="text-border">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Calendly step (initializes widget on mount) ─── */
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

function CalendlyStep() {
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

    // Widget.js may already be loaded or still loading
    if (window.Calendly) {
      init();
    } else {
      // Wait for the lazy-loaded script
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
    <div className="animate-fade-up">
      <h3 className="text-2xl font-semibold mb-2">Pick a time that works</h3>
      <p className="text-text-secondary mb-8">
        15 minutes. We&apos;ll review your background and map out the right learning path for you.
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
    <div
      id={id}
      className="booking-panel"
      data-open={open ? "true" : "false"}
    >
      <div className="overflow-hidden">
        <div className="mx-auto max-w-2xl pt-12 pb-4">
          {open && <CalendlyStep />}
        </div>
      </div>
    </div>
  );
}

/* ─── Exit Intent (kept — this is an overlay, not a "modal" in the lazy UI sense) ─── */
function ExitIntent() {
  const [show, setShow] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY < 10 && !shown.current) {
        shown.current = true;
        setShow(true);
      }
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[oklch(5%_0.01_250/0.85)]">
      <div className="relative w-[min(480px,90vw)] rounded-2xl border border-border bg-surface-1 p-10 text-center animate-fade-up">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors w-8 h-8 flex items-center justify-center"
          aria-label="Close"
        >
          ✕
        </button>
        <p className="text-lg font-semibold text-accent mb-2">
          Not ready to enroll?
        </p>
        <h3 className="text-2xl font-bold mb-3 font-display">
          Free Guide: Build Your First AI Trading Bot
        </h3>
        <p className="text-text-secondary mb-6 text-sm">
          A starter tutorial to get your feet wet. No spam. Unsubscribe anytime.
        </p>
        <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="you@email.com"
            className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-[oklch(98%_0_0)] hover:bg-accent-hover transition-colors"
          >
            Get the guide
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── FAQ Accordion ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
      >
        <span className="text-lg font-medium pr-8 group-hover:text-accent transition-colors">
          {q}
        </span>
        <span
          className={`text-text-tertiary transition-transform duration-300 flex-shrink-0 text-xl ${
            open ? "rotate-45" : ""
          }`}
          style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
        >
          +
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transitionTimingFunction: "var(--ease-out-quart)",
        }}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-text-secondary leading-relaxed max-w-[65ch]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat panel with counter animation ─── */
const STATS = [
  { value: "68.4%", label: "Avg win rate" },
  { value: "200+", label: "Students enrolled" },
  { value: "3 wks", label: "To first deploy" },
  { value: "92%", label: "Completion rate" },
];

function StatPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          el.querySelectorAll<HTMLElement>(".stat-value").forEach((statEl, i) => {
            const target = STATS[i].value;
            animateCounter(statEl, target);
          });
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-surface-1 p-8">
      <p className="text-xs font-medium text-text-tertiary uppercase tracking-widest mb-6">
        Student outcomes · course stats
      </p>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {STATS.map((stat, i) => (
          <div key={i}>
            <p className="stat-value text-2xl font-display font-bold tabular text-accent">
              {stat.value}
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-tertiary mt-6 border-t border-border pt-4">
        Win rate based on student-built bot backtests.
        Individual results vary based on strategy and market conditions.
      </p>
    </div>
  );
}

/* ─── Section wrapper with custom anime.js reveal ─── */
function Section({
  children,
  id,
  className = "",
  animateFn = animateSection,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  animateFn?: (el: HTMLElement) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          animateFn(el);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animateFn]);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}

/* ─── Floating booking pill ─── */
/* ─── Scroll-linked signal dot ─── */
function SignalDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let raf = 0;
    const update = () => {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / docHeight, 1);
      const vpH = window.innerHeight;

      // Dot travels from 10% to 90% of the viewport
      const top = vpH * 0.1 + progress * vpH * 0.8;
      dot.style.top = `${top}px`;

      // Glow intensity increases as you scroll deeper
      const glow = 0.4 + progress * 0.4;
      dot.style.boxShadow = `0 0 ${8 + progress * 12}px oklch(72% 0.19 155 / ${glow})`;

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed pointer-events-none z-[6] hidden lg:block"
      style={{
        left: "clamp(22px, 4vw, 78px)",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "oklch(72% 0.19 155)",
      }}
    />
  );
}

function FloatingPill({ onClick }: { onClick: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      const pastHero = window.scrollY > 800;
      const bookingPanel = document.getElementById("booking-panel");
      const nearBooking = bookingPanel
        ? bookingPanel.getBoundingClientRect().top < window.innerHeight + 100
        : false;
      setVisible(pastHero && !nearBooking);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <button
      onClick={onClick}
      className={`fixed z-40 right-4 bottom-4 sm:right-8 sm:bottom-8 rounded-full bg-profit px-5 py-2.5 text-xs sm:text-sm font-semibold text-[oklch(12%_0.01_155)] floating-pill transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
    >
      Start learning →
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  /* Hero entrance with anime.js */
  useEffect(() => {
    const el = heroRef.current;
    if (el) animateHero(el);
  }, []);

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

  useEffect(() => {
    const handler = () => setStickyVisible(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* ── STICKY HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300 ${
          stickyVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="text-base font-bold tracking-tight">
            Cruise<span className="text-accent"> Alpha</span>
          </span>
          <button
            onClick={toggleBooking}
            className="rounded-lg bg-profit px-5 py-2 text-sm font-semibold text-[oklch(12%_0.01_155)] hover:bg-profit-hover transition-colors duration-200"
          >
            Start Learning
          </button>
        </div>
      </header>

      {/* ── FULL-PAGE PARTICLE NETWORK ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleNetwork />
      </div>

      {/* ── SIGNAL PATH (desktop only) ── */}
      <div className="signal-path" />
      <SignalDot />

      <main>
        {/* ══════════════ HERO ══════════════ */}
        <section ref={heroRef} className="relative px-6 pt-8 pb-0 sm:pt-12">
          <div className="mx-auto max-w-6xl relative" style={{ zIndex: 2 }}>
            {/* Top bar */}
            <div className="hero-topbar flex items-center justify-between mb-10 sm:mb-14">
              <span className="text-xl font-bold tracking-tight">
                Cruise<span className="text-accent"> Alpha</span>
              </span>
              <button
                onClick={toggleBooking}
                className="rounded-lg bg-profit px-5 py-2.5 text-sm font-semibold text-[oklch(12%_0.01_155)] hover:bg-profit-hover transition-colors duration-200"
              >
                Start Learning
              </button>
            </div>

            <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16 items-center">
              {/* Left — copy */}
              <div>
                <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-4 py-1.5 text-xs font-medium text-text-secondary mb-8">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
                  200+ students building AI bots
                </div>

                <h1 className="hero-headline text-[clamp(2.5rem,5vw+1rem,4.5rem)] font-display font-bold leading-[1.05] tracking-tight mb-6">
                  Build a bot that
                  <br />
                  <span className="text-profit">learns</span> while you sleep
                </h1>

                <p className="hero-sub text-lg sm:text-xl text-text-secondary leading-relaxed max-w-lg mb-10">
                  Learn to build AI-powered Polymarket trading bots that
                  adapt to new data, refine their own strategies, and get
                  smarter with every trade. You write the code, you train
                  the model, you own the whole system.
                </p>

                <div className="hero-cta">
                  <button
                    onClick={toggleBooking}
                    className="rounded-xl bg-profit px-6 py-3.5 text-sm font-semibold text-[oklch(12%_0.01_155)] hover:bg-profit-hover transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-profit"
                  >
                    Book a Free Intro Call
                  </button>
                  <p className="text-xs text-text-tertiary mt-3">
                    Free, no obligation · 15 min
                  </p>
                </div>
              </div>

              {/* Right — terminal */}
              <div className="hero-terminal">
                <AnimatedTerminal />
              </div>
            </div>
          </div>
        </section>

        {/* ── MARKET TICKER (overlaps hero slightly) ── */}
        <div className="mt-16 sm:mt-24 relative z-10">
          <MarketTicker />
        </div>

        {/* ══════════════ DEMO VIDEO ══════════════ */}
        <Section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4 text-center">
              See what you&apos;ll build
            </p>
            <h2 className="text-[clamp(1.75rem,3vw+0.5rem,3rem)] font-display font-bold tracking-tight mb-10 text-center max-w-2xl mx-auto">
              A student&apos;s bot after week 3
            </h2>
            <div className="rounded-2xl border border-border bg-surface-1 overflow-hidden shadow-2xl">
              <video
                src="/demo-timelapse.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-text-tertiary mt-4 text-center">
              Real dashboard. Real strategy. Built from scratch by a student.
            </p>
          </div>
        </Section>

        {/* ══════════════ PROBLEM (PAS) ══════════════ */}
        <Section id="problem" className="px-6 pt-16 pb-16 sm:pt-20 sm:pb-20" animateFn={animateProblemCards}>
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
              The problem
            </p>
            <h2 className="text-[clamp(1.75rem,3vw+0.5rem,3rem)] font-display font-bold tracking-tight mb-6 max-w-2xl">
              Most bots are stuck in the past
            </h2>
            <p className="text-text-secondary text-lg mb-16 max-w-2xl">
              Static bots run the same rules forever. Markets change, strategies
              decay, and your edge disappears. AI-powered bots learn from new
              data and adapt. That&apos;s the difference.
            </p>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  stat: "0",
                  title: "Static bots can\u2019t learn",
                  desc: "Hard-coded rules break when market conditions shift. They don\u2019t adapt, they just stop working.",
                  color: "text-accent",
                },
                {
                  stat: "???",
                  title: "Black box AI is worse",
                  desc: "Vendor bots claim to use AI but you can\u2019t see the model, the data, or why it made a trade.",
                  color: "text-text-primary",
                },
                {
                  stat: "\u221E",
                  title: "Real AI adapts forever",
                  desc: "A self-learning bot retrains on new outcomes, adjusts to regime changes, and compounds its own edge.",
                  color: "text-[oklch(65%_0.2_25)]",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="problem-card rounded-2xl border border-border p-8 hover-lift"
                >
                  <p className={`text-3xl font-display font-bold ${item.color} tabular mb-3`}>
                    {item.stat}
                  </p>
                  <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <Section id="how-it-works" className="px-6 py-16 sm:py-20 bg-evolve-warm" animateFn={animateSteps}>
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
              How it works
            </p>
            <h2 className="text-[clamp(1.75rem,3vw+0.5rem,3rem)] font-display font-bold tracking-tight mb-10 max-w-2xl">
              Three steps to your own AI trading bot
            </h2>

            {/* Horizontal steps with connecting line */}
            <div className="grid gap-12 sm:grid-cols-3 relative">
              {/* Connecting line (desktop only) — draws itself */}
              <div className="steps-line hidden sm:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-accent/20 origin-left" />

              {[
                {
                  step: "01",
                  title: "Book an intro call",
                  desc: "15 minutes. We assess your background and goals, then map out the right track -- from Python basics to advanced ML.",
                },
                {
                  step: "02",
                  title: "Build and train your bot",
                  desc: "Structured lessons take you from API basics to training AI models that learn from market data and improve over time.",
                },
                {
                  step: "03",
                  title: "Deploy a self-learning system",
                  desc: "Ship your AI bot to your own infrastructure. It retrains on new data, adapts to changing markets, and gets smarter on its own.",
                },
              ].map((item, i) => (
                <div key={i} className="step-item relative">
                  <div className="w-12 h-12 rounded-full border border-accent bg-background flex items-center justify-center text-sm font-semibold text-accent mb-6 relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="step-item mt-12">
              <button
                onClick={toggleBooking}
                className="rounded-xl bg-profit px-6 py-3.5 text-sm font-semibold text-[oklch(12%_0.01_155)] hover:bg-profit-hover transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-profit"
              >
                Book a Free Intro Call
              </button>
            </div>
          </div>
        </Section>

        {/* ══════════════ FEATURES (bento, not identical cards) ══════════════ */}
        <Section id="features" className="px-6 py-16 sm:py-20" animateFn={animateBento}>
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
              What you&apos;ll build
            </p>
            <h2 className="text-[clamp(1.75rem,3vw+0.5rem,3rem)] font-display font-bold tracking-tight mb-10 max-w-2xl">
              Every module, a working piece of your AI bot
            </h2>

            {/* Bento grid — varied sizes, NO identical cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto">
              {/* Large hero feature — spans 2 cols */}
              <div className="bento-tile lg:col-span-2 rounded-2xl border border-border bg-surface-1 p-10 flex flex-col justify-between min-h-[200px]">
                <div>
                  <h3 className="text-2xl font-semibold mb-3">AI Prediction Engine</h3>
                  <p className="text-text-secondary leading-relaxed max-w-lg">
                    Train a machine learning model that estimates true market probabilities
                    from historical outcomes, sentiment data, and on-chain signals. Your bot
                    doesn&apos;t follow static rules -- it learns what works and adapts.
                  </p>
                </div>
                <div className="flex gap-3 mt-6">
                  {["ML models", "Feature engineering", "Self-retraining"].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs rounded-full border border-border px-3 py-1 text-text-tertiary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tall feature */}
              <div className="bento-tile sm:row-span-2 rounded-2xl border border-border p-8 hover-lift">
                <h3 className="text-lg font-semibold mb-3">
                  Adaptive Risk Management
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  Risk controls that adjust dynamically based on model confidence and market volatility.
                </p>
                <ul className="space-y-3 text-sm">
                  {[
                    "Confidence-scaled sizing",
                    "Dynamic drawdown stops",
                    "Portfolio-level caps",
                    "Volatility-aware limits",
                    "Automatic de-risking",
                    "Model uncertainty gating",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-text-tertiary">
                      <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Standard features — compact */}
              <div className="bento-tile rounded-2xl border border-border p-8 hover-lift">
                <h3 className="text-lg font-semibold mb-3">Reinforcement Learning Loop</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Build a feedback loop where your bot learns from its own trade
                  outcomes. It retrains on new results and adjusts strategy weights automatically.
                </p>
              </div>

              <div className="bento-tile rounded-2xl border border-border p-8 hover-lift">
                <h3 className="text-lg font-semibold mb-3">Backtesting + Model Eval</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Validate AI models against 18+ months of historical data. Compare
                  model accuracy, calibration, and Sharpe ratio before going live.
                </p>
              </div>

              {/* Wide feature spans 2 */}
              <div className="bento-tile lg:col-span-2 rounded-2xl border border-border p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 hover-lift">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Real-Time Alerts</h3>
                  <p className="text-text-secondary text-sm leading-relaxed max-w-md">
                    Wire up Telegram, Discord, and webhook notifications for trades,
                    market moves, and system health. You&apos;ll build the whole pipeline.
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {["Telegram", "Discord", "Webhook"].map((ch) => (
                    <span
                      key={ch}
                      className="text-xs rounded-full bg-surface-2 px-3 py-1.5 text-text-secondary"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compact feature */}
              <div className="bento-tile rounded-2xl border border-border p-8 hover-lift">
                <h3 className="text-lg font-semibold mb-3">Docker Deployment</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Learn to containerize and deploy your bot. Works on any VPS,
                  home server, or cloud provider. You own the infra.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── PULL QUOTE BRIDGE ── */}
        <Section className="px-6 py-12 sm:py-16" animateFn={animatePullQuote}>
          <div className="mx-auto max-w-4xl text-center">
            <p className="pull-quote text-[clamp(1.5rem,3vw+0.5rem,2.5rem)] font-display font-semibold leading-snug">
              &ldquo;Static bots decay. AI bots compound. The edge is in building one that learns.&rdquo;
            </p>
          </div>
        </Section>

        {/* ══════════════ CREDIBILITY / FOUNDER STORY ══════════════ */}
        <Section id="about" className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] items-start">
              {/* Left — Story */}
              <div>
                <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
                  Why I teach this
                </p>
                <h2 className="text-[clamp(1.75rem,3vw+0.5rem,3rem)] font-display font-bold tracking-tight mb-8">
                  I was the worst manual trader
                </h2>
                <div className="space-y-5 text-text-secondary leading-relaxed">
                  <p>
                    Two years ago, I lost $12K trading prediction markets manually.
                    Not because my analysis was wrong. I was right 63% of the time.
                    But I&apos;d enter late, exit early, and let fear override the math.
                  </p>
                  <p>
                    So I stopped trusting myself and started trusting code. I built a
                    bot to execute my strategy without emotion. But the real breakthrough
                    came when I added AI -- a model that learned from every trade outcome
                    and retrained itself on new data. The bot started finding edges I never would have.
                  </p>
                  <p>
                    Then I realized: the most valuable thing wasn&apos;t the bot itself.
                    It was understanding how to build AI systems that improve on their own.
                    Now I teach others to do the same.
                  </p>
                  <p className="text-text-primary font-medium text-lg">
                    The edge isn&apos;t in the bot. It&apos;s in building one that gets smarter over time.
                  </p>
                </div>
              </div>

              {/* Right — Stats / proof */}
              <div className="space-y-6">
                <StatPanel />

                {/* Philosophy — not cards, just clean rows */}
                <div className="space-y-4">
                  {[
                    {
                      title: "You own everything you build",
                      desc: "Your code, your infrastructure, your keys. No vendor dependency.",
                    },
                    {
                      title: "Lifetime access to the curriculum",
                      desc: "All lessons, updates, and community access. Learn at your own pace.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 py-3">
                      <span className="mt-1 w-2 h-2 rounded-full bg-profit flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <p className="text-sm text-text-tertiary mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={toggleBooking}
                  className="rounded-xl bg-profit px-8 py-4 text-base font-semibold text-[oklch(12%_0.01_155)] hover:bg-profit-hover transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-profit"
                >
                  Book a Free Intro Call
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════ TESTIMONIALS ══════════════ */}
        <Section className="px-6 py-16 sm:py-20" animateFn={animateSection}>
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
              Student stories
            </p>
            <h2 className="text-[clamp(1.75rem,3vw+0.5rem,3rem)] font-display font-bold tracking-tight mb-10 max-w-2xl">
              They built it themselves
            </h2>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  quote: "I had zero ML experience. By week 4 my bot was live with a trained model that keeps improving on its own. It caught a mispricing at 3am that my old static bot would have missed completely.",
                  name: "Marcus T.",
                  role: "Former manual trader, now AI bot builder",
                  metric: "4 wks",
                  metricLabel: "to first AI bot",
                },
                {
                  quote: "I'd bought two trading bots before this. Static rules, both broke within months. Now my bot retrains weekly on new outcomes. It's getting better, not worse. That's the whole difference.",
                  name: "Sarah K.",
                  role: "Crypto trader, 4 years experience",
                  metric: "+12%",
                  metricLabel: "model accuracy gain over 3 months",
                },
                {
                  quote: "I'm a software engineer but had never touched ML. The curriculum made it click. My bot now uses sentiment analysis and on-chain data to generate its own signals. I couldn't have designed those rules manually.",
                  name: "James R.",
                  role: "Software engineer, cohort 2",
                  metric: "3",
                  metricLabel: "AI models in production",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className={`reveal-item rounded-2xl border p-8 flex flex-col justify-between ${
                    i === 1
                      ? "border-accent/30 bg-surface-1"
                      : "border-border"
                  }`}
                >
                  <div>
                    <div className="flex items-baseline gap-2 mb-5">
                      <span className="text-2xl font-display font-bold text-profit tabular">
                        {t.metric}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        {t.metricLabel}
                      </span>
                    </div>
                    <p className="text-text-secondary leading-relaxed text-sm mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-text-tertiary">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <button
                onClick={toggleBooking}
                className="rounded-xl bg-profit px-8 py-4 text-base font-semibold text-[oklch(12%_0.01_155)] hover:bg-profit-hover transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-profit"
              >
                Book a Free Intro Call
              </button>
            </div>
          </div>
        </Section>

        {/* ══════════════ FAQ ══════════════ */}
        <Section id="faq" className="px-6 py-16 sm:py-20 bg-evolve-warm" animateFn={animateFaq}>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
              FAQ
            </p>
            <h2 className="text-[clamp(1.75rem,3vw+0.5rem,3rem)] font-display font-bold tracking-tight mb-12">
              Common questions
            </h2>
            <div>
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="faq-item">
                  <FaqItem q={item.q} a={item.a} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════ FINAL CTA ══════════════ */}
        <Section className="px-6 py-20 sm:py-24 bg-evolve-glow" animateFn={animateFinalCta}>
          <div className="mx-auto max-w-3xl text-center">
            <div className="final-heading">
              <div className="inline-flex items-center gap-2 rounded-full border border-profit/30 bg-profit/5 px-4 py-1.5 text-xs font-medium text-profit mb-6">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
                Next cohort starts soon
              </div>
              <h2 className="text-[clamp(2rem,4vw+0.5rem,3.5rem)] font-display font-bold tracking-tight mb-4">
                Build a bot that gets smarter every day
              </h2>
            </div>
            <p className="final-body text-lg text-text-secondary mb-8 max-w-xl mx-auto">
              Static bots lose their edge. AI bots sharpen theirs. Learn to
              build one that learns from every trade it makes.
            </p>
            <button
              onClick={toggleBooking}
              className="final-button rounded-xl bg-profit px-8 py-4 text-base font-semibold text-[oklch(12%_0.01_155)] hover:bg-profit-hover transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-profit"
            >
              Book a Free Intro Call
            </button>
            <p className="text-xs text-text-tertiary mt-3">
              Free, no obligation · 15 minutes · No credit card required
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
              {[
                "You own the code",
                "30-day money-back",
                "Lifetime access",
                "No vendor lock-in",
              ].map((point, i) => (
                <span key={i} className="final-signal flex items-center gap-2 text-text-tertiary text-xs">
                  <span className="w-1 h-1 rounded-full bg-profit flex-shrink-0" />
                  {point}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── INLINE BOOKING PANEL (replaces modal) ── */}
        <div className="px-6 border-t border-border">
          <InlineBookingPanel open={bookingOpen} id="booking-panel" />
        </div>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="px-6 py-12 border-t border-border">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <span className="text-base font-bold tracking-tight">
                Cruise<span className="text-accent"> Alpha</span>
              </span>
              <div className="flex gap-6 text-sm text-text-tertiary">
                <a href="#" className="hover:text-text-secondary transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-text-secondary transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-text-secondary transition-colors">
                  Twitter/X
                </a>
                <a href="#" className="hover:text-text-secondary transition-colors">
                  Discord
                </a>
              </div>
            </div>
            <p className="text-xs text-text-tertiary leading-relaxed max-w-3xl">
              This course teaches you to build automated trading tools for
              Polymarket. Past performance, whether backtested or live, does not
              guarantee future results. Trading on prediction markets involves
              significant risk of loss. You should not trade with money you
              cannot afford to lose. This is not financial advice.
            </p>
            <p className="text-xs text-text-tertiary mt-4">
              © {new Date().getFullYear()} Cruise Alpha. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

      <FloatingPill onClick={toggleBooking} />
      <ExitIntent />
    </>
  );
}
