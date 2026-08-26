"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * FullscreenServicesToWorkTransition
 * 
 * High-end cinematic transition between Services (#111111 dark) and Work (#f4f0e8 cream):
 * 1. Pinned Morph Stage: Pins the end of Services as Work enters.
 * 2. 3D Card Recede & Curtain Unfold: The dark Services view recedes slightly into 3D space (`scale: 0.94`, `filter: blur(8px)`).
 * 3. Liquid Wave & Pixel Dispersion Wipe: A dynamic grid of floating matrix tiles and a curved cream liquid aperture expands outward from the center, unveiling the crisp Selected Work section underneath.
 * 4. Bidirectional Scroll: Works smoothly scrolling forward and in reverse when scrolling back up.
 */
export default function FullscreenServicesToWorkTransition({ childrenServices, childrenWork }) {
  const prefersReducedMotion = useReducedMotion();
  const triggerContainerRef = useRef(null);
  const servicesLayerRef = useRef(null);
  const workLayerRef = useRef(null);
  const wipeOverlayRef = useRef(null);
  const tilesRef = useRef([]);

  const [gridConfig, setGridConfig] = useState({ cols: 16, rows: 10 });

  useEffect(() => {
    const updateGrid = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 768) {
          setGridConfig({ cols: 8, rows: 12 });
        } else if (window.innerWidth < 1200) {
          setGridConfig({ cols: 12, rows: 8 });
        } else {
          setGridConfig({ cols: 16, rows: 10 });
        }
      }
    };
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  const totalTiles = gridConfig.cols * gridConfig.rows;

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const triggerEl = triggerContainerRef.current;
    const servicesEl = servicesLayerRef.current;
    const workEl = workLayerRef.current;
    const wipeOverlay = wipeOverlayRef.current;
    const validTiles = tilesRef.current.filter(Boolean);

    if (!triggerEl || !servicesEl || !workEl) return;

    const ctx = gsap.context(() => {
      // 1. Initial states
      gsap.set(workEl, {
        clipPath: "inset(100% 0% 0% 0%)",
        y: 40,
        scale: 1,
      });

      if (validTiles.length > 0) {
        gsap.set(validTiles, {
          scale: 0,
          opacity: 0,
          borderRadius: "50%",
          transformOrigin: "center center",
        });
      }

      // 2. Master Pinned Transition Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "bottom bottom", // Starts exactly when Services reaches viewport bottom
          end: "+=120%",          // 120vh smooth scroll duration
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Step A: Services recedes gently in 3D depth with subtle dark veil
      tl.to(
        servicesEl,
        {
          scale: 0.93,
          opacity: 0.25,
          y: -50,
          filter: "blur(6px)",
          ease: "power2.inOut",
          duration: 0.7,
        },
        0
      );

      // Step B: Floating transition pixel tiles expand dynamically across the seam
      if (validTiles.length > 0) {
        tl.to(
          validTiles,
          {
            scale: 1.05,
            opacity: 1,
            borderRadius: "0%",
            duration: 0.5,
            ease: "power2.inOut",
            stagger: {
              amount: 0.4,
              from: "edges",
              grid: [gridConfig.rows, gridConfig.cols],
            },
          },
          0.1
        );

        tl.to(
          validTiles,
          {
            scale: 0,
            opacity: 0,
            borderRadius: "50%",
            duration: 0.5,
            ease: "power3.inOut",
            stagger: {
              amount: 0.4,
              from: "center",
              grid: [gridConfig.rows, gridConfig.cols],
            },
          },
          0.5
        );
      }

      // Step C: Work Section uncurtains upward smoothly from the bottom
      tl.to(
        workEl,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          ease: "power3.inOut",
          duration: 0.9,
        },
        0.2
      );

    }, triggerEl);

    return () => ctx.revert();
  }, [gridConfig, prefersReducedMotion]);

  return (
    <div ref={triggerContainerRef} className="relative w-full overflow-hidden">
      {/* Services Layer (Dark #111111) */}
      <div ref={servicesLayerRef} className="relative z-10 w-full will-change-transform">
        {childrenServices}
      </div>

      {/* Dynamic Pixel Particle Transition Overlay */}
      <div
        ref={wipeOverlayRef}
        className="pointer-events-none absolute inset-0 z-20 h-screen w-full"
        style={{
          gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
          display: "grid",
        }}
        aria-hidden="true"
      >
        {Array.from({ length: totalTiles }).map((_, index) => (
          <div
            key={index}
            ref={(el) => (tilesRef.current[index] = el)}
            className="w-full h-full bg-[#f4f0e8] will-change-transform"
            style={{ margin: "-0.5px" }}
          />
        ))}
      </div>

      {/* Work Layer (Cream #f4f0e8) - Unfolds on top during transition */}
      <div
        ref={workLayerRef}
        className="absolute inset-0 z-30 w-full h-full will-change-transform bg-[#f4f0e8]"
      >
        {childrenWork}
      </div>
    </div>
  );
}
