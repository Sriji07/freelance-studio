"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";

/**
 * SplineStarfieldDiveIntro
 * 1. Background: Deep `#0c0c0e` black cosmic void with 560+ stars.
 * 2. 3D Domino Arch: Standing 3D white dominos orbit and expand outward.
 * 3. Sun/Orb Radial Bloom Expansion: Instead of expanding a rectangle, the bright glowing celestial SUN/ORB on the arch expands radially outward (circle clip-path 0% -> 160%), filling the viewport with glowing light that transforms seamlessly into the cream homepage!
 * 4. Typography: "DIVE." in cream+white gradient.
 * 5. Text synchronization: Hero heading text reveals automatically as the sun expansion reaches the screen boundary.
 */
export default function SplineStarfieldDiveIntro({ children }) {
  const prefersReducedMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textOverlayRef = useRef(null);
  const sunExpansionRef = useRef(null);
  const animFrameRef = useRef(null);
  const timelineRef = useRef(null);

  // 3D Camera & Sun State
  const cameraZ = useRef(-260);
  const cameraY = useRef(0);
  const ringRotation = useRef(0);
  const ringExpansion = useRef(1);

  // Track the on-screen (X, Y) coordinates of the Sun Orb
  const sunScreenPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const textOverlay = textOverlayRef.current;
    const sunExpansion = sunExpansionRef.current;
    if (!container || !canvas) return;

    document.body.style.overflow = "hidden";

    // Skip listener
    const handleSkip = () => {
      if (timelineRef.current && timelineRef.current.isActive()) {
        timelineRef.current.timeScale(4);
      }
    };
    window.addEventListener("pointerdown", handleSkip);

    // Initialize Canvas
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    sunScreenPos.current = { x: width * 0.55, y: height * 0.5 };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // 1. Rich Cosmic Starfield
    const numStars = 560;
    const stars = Array.from({ length: numStars }, () => ({
      x: (Math.random() - 0.5) * 3600,
      y: (Math.random() - 0.5) * 3600,
      z: Math.random() * 2200,
      size: Math.random() * 1.6 + 0.4,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    // 2. Generate 3D Domino Arch
    const numDominos = 48;
    const dominos = [];
    const baseRadiusX = 640;
    const baseRadiusZ = 400;
    const archHeight = 250;

    for (let i = 0; i < numDominos; i++) {
      const theta = (i / numDominos) * Math.PI * 2;
      dominos.push({
        index: i,
        theta,
        width: 32,
        height: 70,
        depth: 15,
      });
    }

    let frameCount = 0;

    // 3. Render Loop
    const render = () => {
      frameCount++;
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, width, height);

      ringRotation.current += 0.0045;

      const fov = 480;
      const cx = width / 2;
      const cy = height * 0.62 + cameraY.current;

      // Draw Stars
      stars.forEach((star) => {
        const sz = star.z;
        if (sz > 10) {
          const k = fov / sz;
          const sx = star.x * k + cx;
          const sy = star.y * k + cy - 60;

          if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
            const twinkle = 0.6 + 0.4 * Math.sin(frameCount * star.twinkleSpeed);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle * Math.min(1, sz / 200)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, star.size * k * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Projected Dominos
      const curRadiusX = baseRadiusX * ringExpansion.current;
      const curRadiusZ = baseRadiusZ * ringExpansion.current;
      const curArchHeight = archHeight * ringExpansion.current;

      const projectedDominos = dominos.map((domino) => {
        const curTheta = domino.theta + ringRotation.current;

        const worldX = Math.cos(curTheta) * curRadiusX;
        const worldZ = Math.sin(curTheta) * curRadiusZ + 600 - cameraZ.current;
        const worldY = -Math.cos(curTheta) * curArchHeight - Math.sin(curTheta) * 90;

        return {
          ...domino,
          curTheta,
          worldX,
          worldY,
          worldZ,
        };
      });

      projectedDominos.sort((a, b) => b.worldZ - a.worldZ);

      // Draw Glowing Celestial SUN / ORB along curve & track its screen position
      const orbTheta = ringRotation.current + Math.PI * 0.28;
      const orbWorldX = Math.cos(orbTheta) * (curRadiusX + 18);
      const orbWorldZ = Math.sin(orbTheta) * curRadiusZ + 600 - cameraZ.current;
      const orbWorldY = -Math.cos(orbTheta) * curArchHeight - Math.sin(orbTheta) * 90 - 45;

      if (orbWorldZ > 20) {
        const ok = fov / orbWorldZ;
        const ox = orbWorldX * ok + cx;
        const oy = orbWorldY * ok + cy;
        const orbR = 46 * ok;

        sunScreenPos.current = { x: ox, y: oy };

        const glow = ctx.createRadialGradient(ox, oy, orbR * 0.1, ox, oy, orbR * 4.0);
        glow.addColorStop(0, "rgba(255, 255, 255, 1)");
        glow.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
        glow.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
        glow.addColorStop(1, "rgba(12, 12, 14, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ox, oy, orbR * 4.0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ox, oy, orbR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw 3D Dominos
      projectedDominos.forEach((domino) => {
        if (domino.worldZ > 30) {
          const k = fov / domino.worldZ;
          const sx = domino.worldX * k + cx;
          const sy = domino.worldY * k + cy;

          const w = domino.width * k;
          const h = domino.height * k;
          const d = domino.depth * k;

          const rot = domino.curTheta + Math.PI / 2;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(Math.sin(rot) * 0.45);

          const depthShade = Math.max(0.3, Math.min(1, 1.3 - domino.worldZ / 950));

          // Front Face
          const grad = ctx.createLinearGradient(0, -h, 0, 0);
          grad.addColorStop(0, `rgba(255, 255, 255, ${0.98 * depthShade})`);
          grad.addColorStop(0.7, `rgba(225, 225, 225, ${0.85 * depthShade})`);
          grad.addColorStop(1, `rgba(130, 130, 130, ${0.5 * depthShade})`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h, w, h, 2 * k);
          ctx.fill();

          // Top Highlight
          ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * depthShade})`;
          ctx.beginPath();
          ctx.moveTo(-w / 2, -h);
          ctx.lineTo(-w / 2 + d * 0.5, -h - d * 0.4);
          ctx.lineTo(w / 2 + d * 0.5, -h - d * 0.4);
          ctx.lineTo(w / 2, -h);
          ctx.closePath();
          ctx.fill();

          // Side Depth Face
          ctx.fillStyle = `rgba(160, 160, 160, ${0.6 * depthShade})`;
          ctx.beginPath();
          ctx.moveTo(w / 2, -h);
          ctx.lineTo(w / 2 + d * 0.5, -h - d * 0.4);
          ctx.lineTo(w / 2 + d * 0.5, -d * 0.4);
          ctx.lineTo(w / 2, 0);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // GSAP Sequence: Ring Expansion + Radial Sun Bloom Expansion into Landing Page (Auto-advancing)
    const tl = gsap.timeline({
      delay: 0.1,
      onComplete: () => {
        document.body.style.overflow = "";
        setShowIntro(false);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        window.removeEventListener("pointerdown", handleSkip);
        window.removeEventListener("resize", handleResize);

        // ONLY fire text reveal event once the entire intro animation has fully finished and unmounted
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("intro-reveal-complete"));
        }
      },
    });

    timelineRef.current = tl;

    // 1. Camera moves forward & Ring expands outward (0.0s - 2.0s)
    tl.to(
      cameraZ,
      {
        current: 380,
        duration: 2.0,
        ease: "power2.inOut",
      },
      0
    )
      .to(
        ringExpansion,
        {
          current: 1.6,
          duration: 2.0,
          ease: "power2.inOut",
        },
        0
      )
      // 2. DIVE Wordmark Reveals in Cream + White
      .to(
        textOverlay,
        {
          opacity: 1,
          scale: 1.04,
          duration: 1.2,
          ease: "power2.out",
        },
        0.1
      )
      // 3. SUN Radial Bloom Expansion (1.4s - 2.3s): Radial circle expands to cover 100% viewport
      .fromTo(
        sunExpansion,
        {
          clipPath: "circle(0% at 55% 45%)",
          opacity: 1,
        },
        {
          clipPath: "circle(160% at 55% 45%)",
          opacity: 1,
          duration: 0.9,
          ease: "power3.inOut",
        },
        1.4
      )
      // 4. Fade out intro overlay as sun wave fully floods the viewport (2.2s - 2.4s)
      .to(
        container,
        {
          opacity: 0,
          duration: 0.25,
        },
        2.2
      );

    return () => {
      document.body.style.overflow = "";
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("pointerdown", handleSkip);
      window.removeEventListener("resize", handleResize);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {showIntro && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#0c0c0e] select-none cursor-pointer overflow-hidden"
          title="Click to enter"
        >
          {/* Animated 3D Domino Arch & Starfield Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none"
          />

          {/* Radial Sun Expansion Layer (Expands radially outward from the glowing orb into the cream landing page) */}
          <div
            ref={sunExpansionRef}
            className="absolute inset-0 z-30 bg-[#f4f0e8] pointer-events-none opacity-0 will-change-transform shadow-[0_0_100px_rgba(255,255,255,0.8)]"
          />

          {/* DIVE Wordmark in Cream + White Blend */}
          <div
            ref={textOverlayRef}
            className="relative z-20 flex flex-col items-center justify-center text-center opacity-0 will-change-transform pointer-events-none"
          >
            <div className="flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="DIVE"
                draggable="false"
                className="
                h-auto
                w-[65vw]
                max-w-[700px]
                object-contain
                sm:w-[60vw]
                md:w-[55vw]
                lg:w-[50vw]
            "
              />

              <span className="ml-1 text-5xl font-black text-[#f4f0e8]/50 sm:text-7xl md:text-8xl lg:text-9xl">
                .
              </span>
            </div>

            <p className="mt-4 text-center font-mono text-[9px] font-semibold uppercase tracking-[0.28em] text-[#faf7f0]/70 sm:text-[10px] md:text-xs lg:text-sm">
              Delve into design. Experience the immersive
            </p>
          </div>

          {/* Skip prompt */}
          <div className="absolute bottom-6 z-20 text-[9px] uppercase tracking-[0.2em] text-[#faf7f0]/35 font-mono">
            Click anywhere to enter
          </div>
        </div>
      )}

      {/* Main Website */}
      {children}
    </>
  );
}
