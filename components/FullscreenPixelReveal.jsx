"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * FullscreenPixelReveal
 * 
 * Exact mirror of FullscreenVerticalBlinds, but with a full-screen grid of pixel tiles:
 * - Pins Section 1 (Services - Dark #111111) over Section 2 (Work - Cream #f4f0e8)
 * - Divides the full viewport into a clean grid of pixel tiles (e.g. 14 columns x 9 rows)
 * - On scroll, each pixel tile shrinks and dissolves (scale 1 -> 0, opacity 1 -> 0) in an organic pseudo-random sequence
 * - As the pixel tiles dissolve away, Section 2 (Work) is unveiled directly underneath in place!
 * - Once fully dissolved, standard scrolling resumes seamlessly into Section 2.
 */
export default function FullscreenPixelReveal({ childrenServices, childrenWork }) {
  const prefersReducedMotion = useReducedMotion();
  const triggerContainerRef = useRef(null);
  const servicesPinLayerRef = useRef(null);
  const tilesRef = useRef([]);

  const [gridConfig, setGridConfig] = useState({ cols: 14, rows: 9 });

  useEffect(() => {
    const updateGrid = () => {
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
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  const totalTiles = gridConfig.cols * gridConfig.rows;

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const validTiles = tilesRef.current.filter(Boolean);
    const triggerEl = triggerContainerRef.current;
    if (!validTiles.length || !triggerEl) return;

    const ctx = gsap.context(() => {
      // 1. Initialize tiles covering 100% of the viewport in dark #111111
      gsap.set(validTiles, {
        scale: 1.02,
        opacity: 1,
        transformOrigin: "center center",
      });

      // 2. Pin Services over Work while the pixel tiles dissolve away
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top",
          end: "+=100%", // 100vh scroll reveal duration
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // Staggered Pixel Dissolve Wipe:
      tl.to(validTiles, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
        stagger: {
          each: 0.015,
          from: "random",
          grid: [gridConfig.rows, gridConfig.cols],
        },
      });

      // Fade Services text content as pixels begin breaking away
      tl.to(
        servicesPinLayerRef.current,
        {
          opacity: 0,
          scale: 0.97,
          duration: 0.5,
          ease: "power2.out",
        },
        0.1
      );
    }, triggerEl);

    return () => ctx.revert();
  }, [gridConfig, prefersReducedMotion]);

  return (
    <div ref={triggerContainerRef} className="relative w-full overflow-hidden">
      {/* 1. Underlying Layer: Section 2 (Work - Cream #f4f0e8) */}
      <div className="relative z-10 w-full bg-[#f4f0e8]">{childrenWork}</div>

      {/* 2. Top Pinned Layer: Section 1 (Services - Dark #111111) with Pixel Tile Grid Mask */}
      <div className="pointer-events-none absolute inset-0 z-20 h-screen w-full overflow-hidden">
        {/* Full-screen Pixel Grid Tiles */}
        <div
          className="absolute inset-0 z-30 grid h-full w-full pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
          }}
          aria-hidden="true"
        >
          {Array.from({ length: totalTiles }).map((_, index) => (
            <div
              key={index}
              ref={(el) => (tilesRef.current[index] = el)}
              className="h-full w-full will-change-transform"
              style={{
                backgroundColor: "#111111",
                margin: "-0.5px", // Eliminates fractional gap lines
              }}
            />
          ))}
        </div>

        {/* Services Interactive/Visual content */}
        <div
          ref={servicesPinLayerRef}
          className="pointer-events-auto relative z-40 h-full w-full overflow-y-auto no-scrollbar"
        >
          {childrenServices}
        </div>
      </div>
    </div>
  );
}
