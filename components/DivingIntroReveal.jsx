"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";

/**
 * DivingIntroReveal
 * 1. Initial State: Centered "DIVE." wordmark at the "surface", with a horizontal surface horizon line.
 * 2. The Dive (Z-motion plunge): Wordmark scales up (1 -> 3.8x) and rushes DOWN & FORWARD off-screen with vertical motion-blur.
 * 3. Surface Break: Curved sine-wave ripple line sweeps top-to-bottom as the surface overlay dissolves.
 * 4. Descent & Arrival: Homepage content emerges from below (rising up 20px -> 0 with back.out settling bounce).
 * 5. Scroll Lock, Fast Skip (<200ms) & sessionStorage persistence.
 */
export default function DivingIntroReveal({ children }) {
  const prefersReducedMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(true);
  const introContainerRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const surfaceLineRef = useRef(null);
  const waveLineRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if intro has already run this session
    const hasPlayed = sessionStorage.getItem("dive_intro_played");
    if (hasPlayed || prefersReducedMotion) {
      setShowIntro(false);
      return;
    }

    const container = introContainerRef.current;
    const logoWrapper = logoWrapperRef.current;
    const surfaceLine = surfaceLineRef.current;
    const waveLine = waveLineRef.current;

    if (!container || !logoWrapper) return;

    // Lock scroll during intro
    document.body.style.overflow = "hidden";

    // Fast-skip listener (click, tap, or scroll)
    const handleSkip = () => {
      if (timelineRef.current && timelineRef.current.isActive()) {
        timelineRef.current.timeScale(5); // Fast forward in ~150-200ms
      }
    };
    window.addEventListener("pointerdown", handleSkip);
    window.addEventListener("wheel", handleSkip, { passive: true });

    // Initial setup
    gsap.set(logoWrapper, { scale: 1, y: 0, opacity: 1, filter: "blur(0px)" });
    if (surfaceLine) gsap.set(surfaceLine, { scaleX: 0, opacity: 0.4 });
    if (waveLine) gsap.set(waveLine, { y: "-10vh", opacity: 0 });

    const tl = gsap.timeline({
      delay: 0.8, // Hold at the surface before initiating dive
      onComplete: () => {
        sessionStorage.setItem("dive_intro_played", "true");
        document.body.style.overflow = "";
        setShowIntro(false);
        window.removeEventListener("pointerdown", handleSkip);
        window.removeEventListener("wheel", handleSkip);
      },
    });

    timelineRef.current = tl;

    // 1. Initial State (0 - 1.0s): Surface horizon line slowly expands across viewport
    if (surfaceLine) {
      tl.to(surfaceLine, {
        scaleX: 1,
        duration: 1.0,
        ease: "power2.out",
      });
    }

    // 2. The Dive Plunge (1.0s - 2.8s):
    // Wordmark expands dramatically and plunges down with deep vertical blur rush
    tl.to(
      logoWrapper,
      {
        scale: 4.2,
        y: "75vh",
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.8,
        ease: "power3.in", // Smooth gradual build-up into fast downward dive
      },
      "+=0.2"
    );

    // 3. Surface wave sweep (1.8s - 3.2s): Sine-wave ripple sweeps top to bottom
    if (waveLine) {
      tl.fromTo(
        waveLine,
        { y: "-10vh", opacity: 0.8 },
        {
          y: "115vh",
          opacity: 0,
          duration: 1.4,
          ease: "power2.inOut",
        },
        "-=1.4"
      );
    }

    // 4. Surface overlay dissolves into the submerged landing page (ending ~3.5s total)
    tl.to(
      container,
      {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
      },
      "-=0.9"
    );

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("pointerdown", handleSkip);
      window.removeEventListener("wheel", handleSkip);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {showIntro && (
        <div
          ref={introContainerRef}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#f4f0e8] select-none cursor-pointer overflow-hidden"
          title="Click to skip"
        >
          {/* Horizontal Water Surface Line */}
          <div
            ref={surfaceLineRef}
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-[1px] w-full bg-[#111111]/15 origin-center will-change-transform"
          />

          {/* Sine Wave Transition Sweep Line */}
          <div
            ref={waveLineRef}
            className="pointer-events-none absolute left-0 right-0 z-20 w-full will-change-transform"
          >
            <svg
              viewBox="0 0 1440 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-16 opacity-30 text-[#111111]"
            >
              <path
                d="M0,32 C360,72 720,0 1080,48 C1260,70 1380,20 1440,32"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          {/* Centered Large DIVE. Wordmark ("The Surface") */}
          <div
            ref={logoWrapperRef}
            className="relative z-10 flex flex-col items-center justify-center will-change-transform"
          >
            <h1 className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-black tracking-[-0.07em] text-[#111111] leading-none">
              DIVE
              <span className="inline-block text-[#111111]/40 ml-1">.</span>
            </h1>

            {/* Slogan Subtitle */}
            <p className="mt-4 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.28em] text-[#111111]/50 text-center font-mono">
              Delve into design. Experience the immersive
            </p>
          </div>

          {/* Fast Skip Indicator */}
          <div className="absolute bottom-8 z-10 text-[9px] uppercase tracking-[0.2em] text-[#111111]/30 font-mono">
            Click anywhere to dive
          </div>
        </div>
      )}

      {/* Homepage Content */}
      {children}
    </>
  );
}
