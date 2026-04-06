"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface Pulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

const ACCENT_R = 90;
const ACCENT_G = 140;
const ACCENT_B = 255;

const PROFIT_R = 52;
const PROFIT_G = 211;
const PROFIT_B = 153;

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const frameRef = useRef(0);
  const reducedMotion = useRef(false);

  const getParticleCount = useCallback(() => {
    if (typeof window === "undefined") return 120;
    return window.innerWidth < 768 ? 55 : 120;
  }, []);

  const initParticles = useCallback(
    (width: number, height: number) => {
      const count = getParticleCount();
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.8,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      return particles;
    },
    [getParticleCount]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;

    // Cap DPR at 2 on mobile for performance
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 3);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particlesRef.current = initParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener("mousemove", handleMouse);
    document.addEventListener("mouseleave", handleMouseLeave);

    const CONNECTION_DIST = 160;
    const MOUSE_RADIUS = 120;

    let lastPulseTime = 0;

    const draw = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      if (!reducedMotion.current) {
        // Update positions
        for (const p of particles) {
          // Mouse repulsion
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            p.vx += (dx / dist) * force * 0.15;
            p.vy += (dy / dist) * force * 0.15;
          }

          // Damping
          p.vx *= 0.98;
          p.vy *= 0.98;

          // Move
          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${p.opacity})`;
        ctx.fill();
      }

      // Spawn pulses
      if (!reducedMotion.current && time - lastPulseTime > 1200 + Math.random() * 800) {
        lastPulseTime = time;
        // Find a connected pair
        for (let attempt = 0; attempt < 20; attempt++) {
          const a = Math.floor(Math.random() * particles.length);
          const b = Math.floor(Math.random() * particles.length);
          if (a === b) continue;
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          if (Math.sqrt(dx * dx + dy * dy) < CONNECTION_DIST) {
            pulsesRef.current.push({
              fromIndex: a,
              toIndex: b,
              progress: 0,
              speed: 0.015 + Math.random() * 0.01,
            });
            break;
          }
        }
      }

      // Draw pulses
      const activePulses: Pulse[] = [];
      for (const pulse of pulsesRef.current) {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) continue;
        activePulses.push(pulse);

        const from = particles[pulse.fromIndex];
        const to = particles[pulse.toIndex];
        if (!from || !to) continue;

        const px = from.x + (to.x - from.x) * pulse.progress;
        const py = from.y + (to.y - from.y) * pulse.progress;

        // Glow
        const pulseAlpha = Math.sin(pulse.progress * Math.PI) * 0.8;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PROFIT_R}, ${PROFIT_G}, ${PROFIT_B}, ${pulseAlpha * 0.3})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PROFIT_R}, ${PROFIT_G}, ${PROFIT_B}, ${pulseAlpha})`;
        ctx.fill();

        // Brighten the connection line
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `rgba(${PROFIT_R}, ${PROFIT_G}, ${PROFIT_B}, ${pulseAlpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      pulsesRef.current = activePulses;

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
}
