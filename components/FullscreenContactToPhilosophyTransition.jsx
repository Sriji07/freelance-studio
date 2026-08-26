"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * FullscreenContactToPhilosophyTransition
 * 
 * Clean, natural flow corner-origin slanted diagonal clip-path reveal:
 * - Keeps both Get In Touch (Contact) and The Philosophy (DotMatrix) in natural document flow.
 * - Zero height distortion, zero clipping or overlap bugs.
 * - As the user scrolls from Contact into Philosophy, a dual-layer Cream (#f4f0e8) and Dark (#111111)
 *   slanted diagonal polygon sweeps from the top-right corner across the viewport,
 *   unveiling The Philosophy section in pristine alignment!
 */
export default function FullscreenContactToPhilosophyTransition({
    childrenContact,
    childrenPhilosophy,
}) {
    const prefersReducedMotion = useReducedMotion();
    const transitionTriggerRef = useRef(null);
    const philosophyWrapperRef = useRef(null);
    const creamCurtainRef = useRef(null);

    useEffect(() => {
        if (prefersReducedMotion || typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const triggerEl = transitionTriggerRef.current;
        const philosophyEl = philosophyWrapperRef.current;
        const creamCurtain = creamCurtainRef.current;

        if (!triggerEl || !philosophyEl || !creamCurtain) return;

        const ctx = gsap.context(() => {
            // Initial state: Philosophy and Cream curtain collapsed to top-right corner
            gsap.set(philosophyEl, {
                clipPath: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
                willChange: "clip-path",
            });
            gsap.set(creamCurtain, {
                clipPath: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
                willChange: "clip-path",
            });

            // ScrollTrigger timeline that scrubs as Philosophy enters the viewport
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerEl,
                    start: "top 85%",    // Starts smoothly as the seam enters from bottom
                    end: "top 15%",      // Fully sweeps across before reaching comfortable view
                    scrub: 0.7,
                    invalidateOnRefresh: true,
                },
            });

            // 1. Leading Cream slice sweeps open from top-right corner
            tl.to(
                creamCurtain,
                {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    ease: "power2.inOut",
                    duration: 0.75,
                },
                0
            );

            // 2. Philosophy section sweeps immediately behind the cream slice
            tl.to(
                philosophyEl,
                {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    ease: "power2.inOut",
                    duration: 0.85,
                },
                0.08
            );
        }, triggerEl);

        return () => ctx.revert();
    }, [prefersReducedMotion]);

    return (
        <div className="relative w-full">
            {/* 1. Contact Section in 100% Natural Flow */}
            <div className="relative w-full z-10">
                {childrenContact}
            </div>

            {/* 2. Philosophy Section Container with Corner Diagonal Sweep Seam */}
            <div
                ref={transitionTriggerRef}
                className="relative w-full z-20 overflow-hidden"
            >
                {/* Leading Cream (#f4f0e8) Slanted Diagonal Curtain */}
                <div
                    ref={creamCurtainRef}
                    className="pointer-events-none absolute inset-0 z-20 w-full h-full bg-[#f4f0e8]"
                    style={{
                        clipPath: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
                    }}
                    aria-hidden="true"
                />

                {/* Philosophy Section in Natural Flow with Slanted Corner Reveal */}
                <div
                    ref={philosophyWrapperRef}
                    className="relative z-30 w-full bg-[#111111]"
                    style={{
                        clipPath: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
                    }}
                >
                    {childrenPhilosophy}
                </div>
            </div>
        </div>
    );
}
