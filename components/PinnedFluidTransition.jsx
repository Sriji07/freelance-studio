"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * PinnedFluidTransition
 * 
 * Fluidly morphs/dissolves from childrenPrevious (Services #111111) directly into childrenNext (Work #f4f0e8).
 * 
 * 1. Pins the transition container for 100vh of scroll.
 * 2. ChildrenPrevious stays fixed in place (no awkward scrolling cuts).
 * 3. A high-density fluid grid of pixel tiles dissolves with dynamic scaling, rounded morphs,
 *    and staggered organic dispersion.
 * 4. As the pixels dissolve away, ChildrenNext is unveiled seamlessly beneath.
 * 5. Once 100% revealed, smooth scroll resumes normally into the remaining content.
 */
export default function PinnedFluidTransition({ childrenPrevious, childrenNext }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const topLayerRef = useRef(null);
  const tilesRef = useRef([]);

  const [grid, setGrid] = useState({ cols: 16, rows: 10 });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 768) {
          setGrid({ cols: 10, rows: 14 });
        } else if (window.innerWidth < 1200) {
          setGrid({ cols: 14, rows: 10 });
        } else {
          setGrid({ cols: 18, rows: 11 });
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalTiles = grid.cols * grid.rows;

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const containerEl = containerRef.current;
    const topLayerEl = topLayerRef.current;
    const tileElements = tilesRef.current.filter(Boolean);

    if (!containerEl || !topLayerEl || tileElements.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Initial State: Pixel tiles cover 100%
      gsap.set(tileElements, {
        scale: 1.05,
        opacity: 1,
        borderRadius: "0%",
        transformOrigin: "center center",
      });

      // 2. Pin container during the fluid dissolve
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerEl,
          start: "bottom bottom", // When user scrolls to the bottom of Services
          end: "+=100%", // 100vh pinned transition duration
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // Fade out top section text/content slightly faster so the fluid tiles take over visually
      tl.to(
        topLayerEl.querySelector(".pinned-content-wrap"),
        {
          opacity: 0,
          scale: 0.96,
          duration: 0.35,
          ease: "power2.out",
        },
        0
      );

      // Fluid organic tile morph: tiles scale down, round out into bubbles/particles, and vanish
      tl.to(
        tileElements,
        {
          scale: 0,
          opacity: 0,
          borderRadius: "50%",
          duration: 0.85,
          ease: "power3.inOut",
          stagger: {
            amount: 0.85,
            from: "random",
            grid: [grid.rows, grid.cols],
          },
        },
        0.1
      );

      // Enable full interactivity on revealed section
      tl.set(topLayerEl, { visibility: "hidden" });
    }, containerEl);

    return () => ctx.revert();
  }, [grid, prefersReducedMotion]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* 1. Underlying Next Section (Work) */}
      <div className="relative z-10 w-full bg-[#f4f0e8]">
        {childrenNext}
      </div>

      {/* 2. Top Pinned Previous Section & Fluid Tile Mask (Services) */}
      <div
        ref={topLayerRef}
        className="pointer-events-auto absolute inset-0 z-20 h-full w-full overflow-hidden"
      >
        {/* Organic Dissolving Pixel Tile Grid Mask */}
        <div
          className="pointer-events-none absolute inset-0 z-30 grid h-full w-full"
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
            gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
          }}
          aria-hidden="true"
        >
          {Array.from({ length: totalTiles }).map((_, index) => (
            <div
              key={index}
              ref={(el) => (tilesRef.current[index] = el)}
              className="w-full h-full bg-[#111111] will-change-transform"
              style={{
                margin: "-0.5px",
              }}
            />
          ))}
        </div>

        {/* Previous Section Content Layer */}
        <div className="pinned-content-wrap relative z-40 h-full w-full">
          {childrenPrevious}
        </div>
      </div>
    </div>
  );
}
