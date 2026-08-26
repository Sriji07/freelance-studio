"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * StickyStackedWorkToContact
 * 
 * High-end design studio stacked panel transition:
 * - Section 1 (Work): User scrolls naturally through the ENTIRE Work section until the 
 *   project cards are fully in view. Once Work reaches the bottom of the viewport ("bottom bottom"),
 *   Work stays pinned in place.
 * - Section 2 (Contact): Higher stacking order (z-20) with elevation shadow (shadow-[0_-30px_90px_rgba(0,0,0,0.85)]),
 *   sliding up dynamically OVER the fully revealed Work section as the user continues scrolling down.
 */
export default function StickyStackedWorkToContact({
    childrenWork,
    childrenContact,
}) {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef(null);
    const workWrapperRef = useRef(null);
    const contactPanelRef = useRef(null);

    useEffect(() => {
        if (prefersReducedMotion || typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const containerEl = containerRef.current;
        const workEl = workWrapperRef.current;
        const contactEl = contactPanelRef.current;

        if (!containerEl || !workEl || !contactEl) return;

        const ctx = gsap.context(() => {
            // Pin Work ONLY once its bottom reaches the bottom of the viewport
            // (meaning the entire section, heading, pills, AND project cards are 100% visible)
            ScrollTrigger.create({
                trigger: workEl,
                start: "bottom bottom",
                endTrigger: contactEl,
                end: "top top",
                pin: true,
                pinSpacing: false,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            });

            // As Contact panel slides up over the pinned Work section,
            // subtly scale down and dim the work section for rich physical depth
            const innerContent = workEl.querySelector(".work-content-inner") || workEl;
            gsap.to(innerContent, {
                scale: 0.94,
                opacity: 0.35,
                y: -40,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: contactEl,
                    start: "top 95%",
                    end: "top top",
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            });
        }, containerEl);

        return () => ctx.revert();
    }, [prefersReducedMotion]);

    return (
        <div ref={containerRef} className="relative w-full">
            {/* =========================================================================
                SECTION 1: WORK (Cream #f4f0e8, Scrolls naturally till cards are shown, then pins)
            ========================================================================= */}
            <div
                ref={workWrapperRef}
                className="relative z-10 w-full bg-[#f4f0e8] will-change-transform"
            >
                {childrenWork}
            </div>

            {/* =========================================================================
                SECTION 2: CONTACT (Dark #111111, Stacked Higher Order Sliding Up OVER Work)
            ========================================================================= */}
            <div
                ref={contactPanelRef}
                className="relative z-20 min-h-screen w-full bg-[#111111] shadow-[0_-30px_90px_rgba(0,0,0,0.85)] border-t border-[#f4f0e8]/10 will-change-transform"
            >
                {childrenContact}
            </div>
        </div>
    );
}
