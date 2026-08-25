"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * KineticParticleBackdrop
 * Full-viewport high-performance HTML5 Canvas particle backdrop.
 * Theme: 'Aether Flow' / 'Quantum Shift' with deep indigo and neon cyan accents (#030712, #4f46e5, #06b6d4, #00f0ff).
 * Particle density and velocity dynamically react to section navigation speed or cursor velocity.
 */
export default function KineticParticleBackdrop() {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const stateRef = useRef({
    velocityBoost: 1,
    targetBoost: 1,
    mouseX: -1000,
    mouseY: -1000,
  });

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Listen to section morph / navigation burst event
    const handleMorphBurst = (e) => {
      const intensity = e.detail?.intensity || 4.5;
      stateRef.current.targetBoost = intensity;
    };
    window.addEventListener("section-morph-trigger", handleMorphBurst);

    const handleMouseMove = (e) => {
      stateRef.current.mouseX = e.clientX;
      stateRef.current.mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Particle pool definition
    const PARTICLE_COUNT = Math.min(100, Math.floor((width * height) / 14000));
    let particles = [];

    const colors = [
      "rgba(6, 182, 212, 0.45)",  // Neon Cyan
      "rgba(79, 70, 229, 0.40)",  // Deep Indigo
      "rgba(0, 240, 255, 0.55)",  // Quantum Electric Cyan
      "rgba(147, 197, 253, 0.25)", // Soft Aether Ice
    ];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulse: Math.random() * Math.PI,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    };

    initParticles();

    // Render loop
    const render = () => {
      // Smooth decay of navigation velocity boost back to baseline (1.0)
      stateRef.current.velocityBoost +=
        (stateRef.current.targetBoost - stateRef.current.velocityBoost) * 0.08;
      stateRef.current.targetBoost += (1.0 - stateRef.current.targetBoost) * 0.04;

      const boost = stateRef.current.velocityBoost;

      ctx.clearRect(0, 0, width, height);

      // Quantum Nebula Ambient Gradients
      const grad = ctx.createRadialGradient(
        width * 0.7,
        height * 0.3,
        50,
        width * 0.7,
        height * 0.3,
        width * 0.6
      );
      grad.addColorStop(0, "rgba(79, 70, 229, 0.06)"); // Indigo core
      grad.addColorStop(0.6, "rgba(6, 182, 212, 0.03)"); // Cyan rim
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw and update quantum nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Kinetic movement with navigation boost
        p.x += p.vx * boost;
        p.y += p.vy * boost;

        // Bounce / wrap bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse displacement
        const dx = p.x - stateRef.current.mouseX;
        const dy = p.y - stateRef.current.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (1 - dist / 120) * 2;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Pulsing glow size
        p.pulse += p.pulseSpeed;
        const currentSize = p.size + Math.sin(p.pulse) * 0.6;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = boost > 1.5 ? 12 : 6;
        ctx.shadowColor = "rgba(0, 240, 255, 0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Subtle Quantum Constellation Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distBetween < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - distBetween / 110) * 0.18 * (boost > 1.5 ? 1.5 : 1);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("section-morph-trigger", handleMorphBurst);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
