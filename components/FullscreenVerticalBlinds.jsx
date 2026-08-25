"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * FullscreenVerticalBlinds
 * A pinned full-screen vertical blinds / venetian slat wipe effect:
 * - Pins the Hero (Section 1) in place over Section 2 (Services)
 * - Divides the full viewport into 10-12 vertical columns (strips)
 * - On scroll, each strip shrinks (scaleY 1 -> 0, transform-origin bottom) in a staggered left-to-right sequence
 * - As the blinds open, Section 2 is unveiled directly underneath in place!
 */
export default function FullscreenVerticalBlinds({ childrenHero, childrenServices }) {
  const prefersReducedMotion = useReducedMotion();
  const triggerContainerRef = useRef(null);
  const heroPinLayerRef = useRef(null);
  const stripsRef = useRef([]);
  const [stripCount, setStripCount] = useState(11);

  useEffect(() => {
    const updateCount = () => {
      if (typeof window !== "undefined") {
        setStripCount(window.innerWidth < 768 ? 7 : 11);
      }
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const validStrips = stripsRef.current.filter(Boolean);
    const triggerEl = triggerContainerRef.current;
    if (!validStrips.length || !triggerEl) return;

    const ctx = gsap.context(() => {
      // Initialize strips covering 100% height of Section 1
      gsap.set(validStrips, {
        scaleY: 1,
        transformOrigin: "bottom center",
      });

      // Pin the Hero over Services while the Venetian Blinds wipe away
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top",
          end: "+=100%", // Smooth scrolling duration for the blinds reveal
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // Staggered blinds wipe: left-to-right sequential
      tl.to(validStrips, {
        scaleY: 0,
        transformOrigin: "bottom center",
        duration: 1,
        ease: "power3.inOut",
        stagger: {
          each: 0.05,
          from: "start",
        },
      });

      // Fade Hero content as blinds open
      tl.to(
        heroPinLayerRef.current,
        {
          opacity: 0,
          scale: 0.96,
          duration: 0.6,
          ease: "power2.out",
        },
        0.1
      );
    }, triggerEl);

    return () => ctx.revert();
  }, [stripCount, prefersReducedMotion]);

  return (
    <div ref={triggerContainerRef} className="relative w-full overflow-hidden">
      {/* 1. Underlying Layer: Section 2 (Services - Dark) */}
      <div className="relative z-10 w-full bg-[#111111]">{childrenServices}</div>

      {/* 2. Top Pinned Layer: Section 1 (Hero - Cream) with Venetian Blind Strips Mask */}
      <div className="pointer-events-none absolute inset-0 z-20 h-screen w-full overflow-hidden">
        {/* Full-screen Vertical Blind Strips */}
        <div className="absolute inset-0 z-30 flex h-full w-full">
          {Array.from({ length: stripCount }).map((_, index) => (
            <div
              key={index}
              ref={(el) => (stripsRef.current[index] = el)}
              className="h-full flex-1 will-change-transform"
              style={{
                backgroundColor: "#f4f0e8",
                marginRight: index < stripCount - 1 ? "-1px" : "0",
              }}
            />
          ))}
        </div>

        {/* Hero Interactive/Visual content */}
        <div
          ref={heroPinLayerRef}
          className="pointer-events-auto relative z-40 h-full w-full overflow-y-auto no-scrollbar"
        >
          {childrenHero}
        </div>
      </div>
    </div>
  );
}
