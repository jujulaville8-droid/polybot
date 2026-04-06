"use client";

import { animate, stagger } from "animejs";

/* ─── Hero entrance ─── */
export function animateHero(container: HTMLElement) {
  const q = (sel: string) => container.querySelector(sel) as HTMLElement | null;

  const targets = [
    { el: q(".hero-topbar"), delay: 0, y: -10 },
    { el: q(".hero-badge"), delay: 100, y: 20 },
    { el: q(".hero-headline"), delay: 250, y: 40 },
    { el: q(".hero-sub"), delay: 450, y: 30 },
    { el: q(".hero-cta"), delay: 600, y: 20 },
  ];

  targets.forEach(({ el, delay, y }) => {
    if (!el) return;
    animate(el, {
      opacity: [0, 1],
      translateY: [y, 0],
      duration: 800,
      ease: "outExpo",
      delay,
    });
  });

  const terminal = q(".hero-terminal");
  if (terminal) {
    animate(terminal, {
      opacity: [0, 1],
      translateX: [60, 0],
      duration: 900,
      ease: "outExpo",
      delay: 400,
    });
  }
}

/* ─── Generic section reveal ─── */
export function animateSection(el: HTMLElement) {
  const children = el.querySelectorAll(".reveal-item");

  if (children.length > 0) {
    el.style.opacity = "1";
    animate(children, {
      opacity: [0, 1],
      translateY: [32, 0],
      duration: 700,
      ease: "outQuart",
      delay: stagger(100),
    });
  } else {
    animate(el, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 700,
      ease: "outQuart",
    });
  }
}

/* ─── Problem cards: stagger from left with rotation snap ─── */
export function animateProblemCards(el: HTMLElement) {
  el.style.opacity = "1";
  const cards = el.querySelectorAll(".problem-card");
  animate(cards, {
    opacity: [0, 1],
    translateX: [-40, 0],
    rotate: [-2, 0],
    duration: 700,
    ease: "outExpo",
    delay: stagger(120),
  });
}

/* ─── How it works: line draws, then steps appear ─── */
export function animateSteps(el: HTMLElement) {
  el.style.opacity = "1";

  // Draw the connecting line
  const line = el.querySelector(".steps-line") as HTMLElement;
  if (line) {
    animate(line, {
      scaleX: [0, 1],
      duration: 800,
      ease: "outExpo",
    });
  }

  // Then reveal each step
  const steps = el.querySelectorAll(".step-item");
  animate(steps, {
    opacity: [0, 1],
    translateY: [24, 0],
    duration: 600,
    ease: "outQuart",
    delay: stagger(200, { start: 400 }),
  });
}

/* ─── Bento features: scale up with position-based stagger ─── */
export function animateBento(el: HTMLElement) {
  el.style.opacity = "1";
  const tiles = el.querySelectorAll(".bento-tile");
  animate(tiles, {
    opacity: [0, 1],
    scale: [0.92, 1],
    translateY: [20, 0],
    duration: 600,
    ease: "outQuart",
    delay: stagger(80),
  });
}

/* ─── FAQ items: alternate slide directions ─── */
export function animateFaq(el: HTMLElement) {
  el.style.opacity = "1";
  const items = el.querySelectorAll(".faq-item");
  items.forEach((item, i) => {
    animate(item, {
      opacity: [0, 1],
      translateX: [i % 2 === 0 ? -20 : 20, 0],
      duration: 500,
      ease: "outQuart",
      delay: i * 80,
    });
  });
}

/* ─── Pull quote reveal ─── */
export function animatePullQuote(el: HTMLElement) {
  animate(el, {
    opacity: [0, 1],
    scale: [0.96, 1],
    duration: 1000,
    ease: "outExpo",
  });
}

/* ─── Final CTA dramatic reveal ─── */
export function animateFinalCta(el: HTMLElement) {
  el.style.opacity = "1";

  const heading = el.querySelector(".final-heading");
  const body = el.querySelector(".final-body");
  const button = el.querySelector(".final-button");
  const signals = el.querySelectorAll(".final-signal");

  if (heading) animate(heading, { opacity: [0, 1], translateY: [30, 0], duration: 800, ease: "outExpo" });
  if (body) animate(body, { opacity: [0, 1], translateY: [20, 0], duration: 700, ease: "outExpo", delay: 200 });
  if (button) animate(button, { opacity: [0, 1], translateY: [15, 0], scale: [0.95, 1], duration: 600, ease: "outExpo", delay: 400 });
  if (signals.length) animate(signals, { opacity: [0, 1], translateX: [20, 0], duration: 500, ease: "outQuart", delay: stagger(60, { start: 500 }) });
}

/* ─── Terminal line entrance ─── */
export function animateTerminalLine(el: HTMLElement, index: number) {
  animate(el, {
    opacity: [0, 1],
    translateX: [-12, 0],
    duration: 400,
    ease: "outQuart",
    delay: index * 50,
  });
}

/* ─── Stats counter animation ─── */
export function animateCounter(el: HTMLElement, target: string) {
  const num = parseFloat(target.replace(/[^0-9.\-]/g, ""));
  if (isNaN(num)) {
    el.textContent = target;
    return;
  }

  const prefix = target.match(/^[+\-]/) ? target[0] : "";
  const suffix = target.match(/%$/) ? "%" : "";
  const hasDecimal = target.includes(".");
  const decimalPlaces = hasDecimal
    ? (target.split(".")[1]?.replace(/[^0-9]/g, "").length || 0)
    : 0;

  const obj = { val: 0 };

  animate(obj, {
    val: [0, Math.abs(num)],
    duration: 1200,
    ease: "outExpo",
    onUpdate: () => {
      el.textContent = `${prefix}${obj.val.toFixed(decimalPlaces)}${suffix}`;
    },
  });
}
