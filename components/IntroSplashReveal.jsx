"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

/**
 * IntroSplashReveal (Option A - FLIP Logo Transform & Page Assembly)
 * 1. Initial State: Centered large "DIVE." logo on solid cream background with pulsing dot loading indicator.
 * 2. Transform: GSAP Flip animates the centered logo smoothly into its final top-left navbar logo position/scale.
 * 3. Content Assembly: Homepage elements assemble and fade in around the settling logo.
 * 4. Scroll Lock & Fast Skip: Scroll is locked during intro (~1.4s), but user click/scroll fast-forwards instantly.
 * 5. Run Once Per Session: Stored in sessionStorage ("dive_intro_played").
 */
export default function IntroSplashReveal({ children }) {
  const prefersReducedMotion = useReducedMotion();
  const [showSplash, setShowSplash] = useState(true);
  const splashContainerRef = useRef(null);
  const splashLogoRef = useRef(null);
  const dotRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if intro has already run this session
    const hasPlayed = sessionStorage.getItem("dive_intro_played");
    if (hasPlayed || prefersReducedMotion) {
      setShowSplash(false);
      return;
    }

    gsap.registerPlugin(Flip);

    const container = splashContainerRef.current;
    const splashLogo = splashLogoRef.current;
    const dot = dotRef.current;
    if (!container || !splashLogo) return;

    // Lock scroll during intro
    document.body.style.overflow = "hidden";

    // Fast-skip listener (click, tap, or scroll)
    const handleSkip = () => {
      if (timelineRef.current && timelineRef.current.isActive()) {
        timelineRef.current.timeScale(4); // Fast forward in ~200ms
      }
    };
    window.addEventListener("pointerdown", handleSkip);
    window.addEventListener("wheel", handleSkip, { passive: true });

    // 1. Subtle Dot Pulse loading loop with graceful rhythmic breathing
    if (dot) {
      gsap.to(dot, {
        scale: 1.3,
        opacity: 0.35,
        yoyo: true,
        repeat: 5,
        duration: 0.45,
        ease: "power2.inOut",
      });
    }

    // 2. Main Intro Sequence - Extended for a luxurious, unhurried pacing
    const tl = gsap.timeline({
      delay: 1.4, // Generous display of centered logo & subtitle (~1.4s)
      onComplete: () => {
        sessionStorage.setItem("dive_intro_played", "true");
        document.body.style.overflow = "";
        setShowSplash(false);
        window.removeEventListener("pointerdown", handleSkip);
        window.removeEventListener("wheel", handleSkip);
      },
    });

    timelineRef.current = tl;

    // Smoothly lift the logo and dissolve the splash curtain into the homepage
    tl.to(
      splashLogo,
      {
        scale: 0.65,
        y: -60,
        opacity: 0,
        duration: 1.1,
        ease: "power3.inOut",
      },
      0
    ).to(
      container,
      {
        opacity: 0,
        duration: 1.1,
        ease: "power2.inOut",
      },
      0.15
    );

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("pointerdown", handleSkip);
      window.removeEventListener("wheel", handleSkip);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {showSplash && (
        <div
          ref={splashContainerRef}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#f4f0e8] select-none cursor-pointer overflow-hidden"
          title="Click to skip"
        >
          {/* Centered Large DIVE. Logo */}
          <div ref={splashLogoRef} className="relative flex flex-col items-center justify-center">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-[-0.06em] text-[#111111] leading-none">
              DIVE
              <span
                ref={dotRef}
                className="inline-block text-[#111111]/40 ml-1 origin-center"
              >
                .
              </span>
            </h1>

            {/* Slogan Subtitle */}
            <p className="mt-3 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-[#111111]/50 text-center font-mono">
              Delve into design. Experience the immersive
            </p>
          </div>

          {/* Skip hint */}
          <div className="absolute bottom-8 text-[9px] uppercase tracking-[0.2em] text-[#111111]/30 font-mono">
            Click anywhere to skip
          </div>
        </div>
      )}

      {/* Main page content */}
      {children}
    </>
  );
}
