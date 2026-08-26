"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * PixelRevealTransition
 * 
 * Sits directly between Services (#111111) and Work (#f4f0e8).
 * As you scroll down past Services, the page pins and a full-screen grid of dark pixel tiles
 * dissolves/scales away in a pseudo-random dispersion wave, unveiling the cream Work page header
 * cleanly with proper layout hierarchy before resuming normal scroll into the carousel cards.
 */
export default function PixelRevealTransition({
  fromColor = "#111111",
  toColor = "#f4f0e8",
}) {
  const prefersReducedMotion = useReducedMotion();
  const triggerContainerRef = useRef(null);
  const gridLayerRef = useRef(null);
  const pixelsRef = useRef([]);

  // Grid dimensions
  const [gridConfig, setGridConfig] = useState({ cols: 14, rows: 9 });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 768) {
          setGridConfig({ cols: 8, rows: 12 });
        } else if (window.innerWidth < 1200) {
          setGridConfig({ cols: 12, rows: 8 });
        } else {
          setGridConfig({ cols: 14, rows: 9 });
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPixels = gridConfig.cols * gridConfig.rows;

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const triggerEl = triggerContainerRef.current;
    const gridLayerEl = gridLayerRef.current;
    const pixelElements = pixelsRef.current.filter(Boolean);

    if (!triggerEl || !gridLayerEl || pixelElements.length === 0) return;

    const ctx = gsap.context(() => {
      // Initialize full coverage black pixel block
      gsap.set(pixelElements, {
        scale: 1.02,
        opacity: 1,
        transformOrigin: "center center",
      });

      // Pin the transition stage while the pixels dissolve
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top",
          end: "+=100%", // 100vh of smooth scroll to dissolve pixels
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // Random dissolve wipe of dark pixel tiles
      tl.to(
        pixelElements,
        {
          scale: 0,
          opacity: 0,
          duration: 1,
          ease: "power3.inOut",
          stagger: {
            amount: 0.8,
            from: "random",
            grid: [gridConfig.rows, gridConfig.cols],
          },
        },
        0
      );

      // Hide overlay so all clicks and interactions pass through completely
      tl.set(gridLayerEl, { visibility: "hidden" });
    }, triggerEl);

    return () => ctx.revert();
  }, [gridConfig, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={triggerContainerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: toColor }}
    >
      {/* Underlying Preview Hint: "02 — Selected Work" Header Preview */}
      <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-10 max-w-7xl mx-auto pointer-events-none select-none">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-2 w-2 rounded-full bg-[#111111]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40 sm:text-xs">
            02 — Selected Work
          </span>
        </div>
        <h2 className="text-5xl font-bold leading-[0.9] tracking-[-0.06em] text-[#111111] sm:text-6xl md:text-8xl lg:text-[7rem]">
          Work made<br />
          <span className="text-black/25">for real businesses.</span>
        </h2>
      </div>

      {/* Pinned Black Pixel Tile Grid Mask */}
      <div
        ref={gridLayerRef}
        className="pointer-events-none absolute inset-0 z-20 grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
        }}
        aria-hidden="true"
      >
        {Array.from({ length: totalPixels }).map((_, index) => (
          <div
            key={index}
            ref={(el) => (pixelsRef.current[index] = el)}
            className="w-full h-full will-change-transform"
            style={{
              backgroundColor: fromColor,
              margin: "-0.5px", // Eliminates subpixel seams
            }}
          />
        ))}
      </div>
    </div>
  );
}
