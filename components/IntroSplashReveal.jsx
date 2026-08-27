"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

/**
 * IntroSplashReveal
 *
 * 1. Initial State:
 *    Centered large DIVE logo on solid cream background
 *    with pulsing dot loading indicator.
 *
 * 2. Transform:
 *    Logo scales and moves upward before the splash fades.
 *
 * 3. Content Assembly:
 *    Homepage content appears underneath the splash.
 *
 * 4. Scroll Lock & Fast Skip:
 *    Scroll is locked during intro.
 *    User click / scroll fast-forwards the animation.
 *
 * 5. Run Once Per Session:
 *    Stored in sessionStorage as "dive_intro_played".
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
    const hasPlayed = sessionStorage.getItem(
      "dive_intro_played"
    );

    if (hasPlayed || prefersReducedMotion) {
      setShowSplash(false);
      return;
    }

    gsap.registerPlugin(Flip);

    const container = splashContainerRef.current;
    const splashLogo = splashLogoRef.current;
    const dot = dotRef.current;

    if (!container || !splashLogo) return;

    // --------------------------------------------------
    // LOCK SCROLL
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
        timelineRef.current.timeScale(4);
      }
    };

    window.addEventListener("pointerdown", handleSkip);

    window.addEventListener("wheel", handleSkip, {
      passive: true,
    });

    // --------------------------------------------------
    // DOT PULSE
    // --------------------------------------------------

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

    // --------------------------------------------------
    // MAIN INTRO TIMELINE
    // --------------------------------------------------

    const tl = gsap.timeline({
      delay: 1.4,

      onComplete: () => {
        sessionStorage.setItem(
          "dive_intro_played",
          "true"
        );

        document.body.style.overflow = "";

        setShowSplash(false);

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
    // LOGO EXIT ANIMATION
    // --------------------------------------------------

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
    );

    // --------------------------------------------------
    // SPLASH FADE
    // --------------------------------------------------

    tl.to(
      container,
      {
        opacity: 0,
        duration: 1.1,
        ease: "power2.inOut",
      },
      0.15
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
      {showSplash && (
        <div
          ref={splashContainerRef}
          className="
                        fixed
                        inset-0
                        z-[999999]
                        flex
                        select-none
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        overflow-hidden
                        bg-[#f4f0e8]
                    "
          title="Click to skip"
        >
          {/* ---------------------------------------
                        CENTERED LARGE DIVE LOGO
                    ---------------------------------------- */}

          <div
            ref={splashLogoRef}
            className="
                            relative
                            flex
                            flex-col
                            items-center
                            justify-center
                            will-change-transform
                        "
          >
            {/* Logo */}
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

              {/* Animated Dot */}
              <span
                ref={dotRef}
                className="
                                    ml-1
                                    inline-block
                                    origin-center
                                    text-5xl
                                    font-black
                                    text-[#111111]/40

                                    sm:text-7xl

                                    md:text-8xl

                                    lg:text-9xl
                                "
              >
                .
              </span>
            </div>

            {/* ---------------------------------------
                            SLOGAN SUBTITLE
                        ---------------------------------------- */}

            <p
              className="
                                mt-4
                                text-center
                                font-mono
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.25em]
                                text-[#111111]/50

                                sm:mt-5
                                sm:text-[10px]

                                md:text-xs

                                lg:text-sm
                            "
            >
              Delve into design. Experience the immersive
            </p>
          </div>

          {/* ---------------------------------------
                        SKIP HINT
                    ---------------------------------------- */}

          <div
            className="
                            absolute
                            bottom-8
                            font-mono
                            text-[9px]
                            uppercase
                            tracking-[0.2em]
                            text-[#111111]/30
                        "
          >
            Click anywhere to skip
          </div>
        </div>
      )}

      {/* Main page content */}
      {children}
    </>
  );
}