"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";

/**
 * DivingIntroReveal
 *
 * 1. Initial State:
 *    Centered DIVE logo at the "surface",
 *    with a horizontal surface horizon line.
 *
 * 2. The Dive:
 *    Logo scales up and rushes downward with
 *    vertical motion blur.
 *
 * 3. Surface Break:
 *    Curved sine-wave ripple sweeps from top to bottom.
 *
 * 4. Descent & Arrival:
 *    Homepage content emerges underneath.
 *
 * 5. Scroll Lock:
 *    Page scrolling is disabled while intro is active.
 *
 * 6. Fast Skip:
 *    Click, tap, or scroll rapidly completes the animation.
 *
 * 7. Session Persistence:
 *    Intro only plays once per browser session.
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

    // Check if intro has already played during this session
    const hasPlayed = sessionStorage.getItem("dive_intro_played");

    // Skip intro if already played or reduced motion is enabled
    if (hasPlayed || prefersReducedMotion) {
      setShowIntro(false);
      return;
    }

    const container = introContainerRef.current;
    const logoWrapper = logoWrapperRef.current;
    const surfaceLine = surfaceLineRef.current;
    const waveLine = waveLineRef.current;

    if (!container || !logoWrapper) return;

    // --------------------------------------------------
    // LOCK PAGE SCROLL
    // --------------------------------------------------

    document.body.style.overflow = "hidden";

    // --------------------------------------------------
    // FAST SKIP
    // --------------------------------------------------

    const handleSkip = () => {
      if (
        timelineRef.current &&
        timelineRef.current.isActive()
      ) {
        timelineRef.current.timeScale(5);
      }
    };

    window.addEventListener("pointerdown", handleSkip);
    window.addEventListener("wheel", handleSkip, {
      passive: true,
    });

    // --------------------------------------------------
    // INITIAL STATES
    // --------------------------------------------------

    gsap.set(logoWrapper, {
      scale: 1,
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
    });

    if (surfaceLine) {
      gsap.set(surfaceLine, {
        scaleX: 0,
        opacity: 0.4,
      });
    }

    if (waveLine) {
      gsap.set(waveLine, {
        y: "-10vh",
        opacity: 0,
      });
    }

    // --------------------------------------------------
    // MAIN TIMELINE
    // --------------------------------------------------

    const tl = gsap.timeline({
      delay: 0.8,

      onComplete: () => {
        sessionStorage.setItem(
          "dive_intro_played",
          "true"
        );

        document.body.style.overflow = "";

        setShowIntro(false);

        window.removeEventListener(
          "pointerdown",
          handleSkip
        );

        window.removeEventListener(
          "wheel",
          handleSkip
        );
      },
    });

    timelineRef.current = tl;

    // --------------------------------------------------
    // 1. SURFACE HORIZON LINE
    // --------------------------------------------------

    if (surfaceLine) {
      tl.to(surfaceLine, {
        scaleX: 1,
        duration: 1.0,
        ease: "power2.out",
      });
    }

    // --------------------------------------------------
    // 2. DIVE
    // --------------------------------------------------

    tl.to(
      logoWrapper,
      {
        scale: 4.2,
        y: "75vh",
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.8,
        ease: "power3.in",
      },
      "+=0.2"
    );

    // --------------------------------------------------
    // 3. SURFACE WAVE
    // --------------------------------------------------

    if (waveLine) {
      tl.fromTo(
        waveLine,
        {
          y: "-10vh",
          opacity: 0.8,
        },
        {
          y: "115vh",
          opacity: 0,
          duration: 1.4,
          ease: "power2.inOut",
        },
        "-=1.4"
      );
    }

    // --------------------------------------------------
    // 4. FADE OUT INTRO
    // --------------------------------------------------

    tl.to(
      container,
      {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
      },
      "-=0.9"
    );

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "pointerdown",
        handleSkip
      );

      window.removeEventListener(
        "wheel",
        handleSkip
      );

      tl.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {showIntro && (
        <div
          ref={introContainerRef}
          className="fixed inset-0 z-[999999] flex select-none cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#f4f0e8]"
          title="Click to skip"
        >
          {/* ---------------------------------------
                        HORIZONTAL WATER SURFACE LINE
                    ---------------------------------------- */}

          <div
            ref={surfaceLineRef}
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-px w-full origin-center bg-[#111111]/15 will-change-transform"
          />

          {/* ---------------------------------------
                        SINE WAVE TRANSITION
                    ---------------------------------------- */}

          <div
            ref={waveLineRef}
            className="pointer-events-none absolute left-0 right-0 z-20 w-full will-change-transform"
          >
            <svg
              viewBox="0 0 1440 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-full text-[#111111] opacity-30"
            >
              <path
                d="M0,32 C360,72 720,0 1080,48 C1260,70 1380,20 1440,32"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          {/* ---------------------------------------
                        DIVE LOGO
                    ---------------------------------------- */}

          <div
            ref={logoWrapperRef}
            className="relative z-10 flex w-full flex-col items-center justify-center px-6 will-change-transform"
          >
            <div className="flex w-full items-center justify-center">
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
            </div>

            {/* ---------------------------------------
                            SLOGAN
                        ---------------------------------------- */}

            <p
              className="
                                mt-5
                                text-center
                                font-mono
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.25em]
                                text-[#111111]/50

                                sm:mt-6
                                sm:text-[10px]

                                md:text-xs
                            "
            >
              Delve into design. Experience the immersive
            </p>
          </div>

          {/* ---------------------------------------
                        SKIP INDICATOR
                    ---------------------------------------- */}

          <div
            className="
                            absolute
                            bottom-8
                            z-10
                            font-mono
                            text-[9px]
                            uppercase
                            tracking-[0.2em]
                            text-[#111111]/30
                        "
          >
            Click anywhere to dive
          </div>
        </div>
      )}

      {/* ---------------------------------------
                HOMEPAGE CONTENT
            ---------------------------------------- */}

      {children}
    </>
  );
}