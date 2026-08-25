"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";

export default function PageTransition() {
    const pathname = usePathname();
    const prefersReducedMotion = useReducedMotion();
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion || typeof window === "undefined") return;

        const panel = document.getElementById("route-transition-curtain");
        if (!panel) return;

        // Slide up from bottom (translateY 100% -> 0), then slide off to top (0 -> -100%)
        const tl = gsap.timeline({
            onStart: () => setIsTransitioning(true),
            onComplete: () => setIsTransitioning(false),
        });

        tl.fromTo(
            panel,
            { yPercent: 100 },
            {
                yPercent: 0,
                duration: 0.4,
                ease: "power3.inOut",
            }
        ).to(panel, {
            yPercent: -100,
            duration: 0.4,
            ease: "power3.inOut",
            delay: 0.05,
        });
    }, [pathname, prefersReducedMotion]);

    if (prefersReducedMotion) return null;

    return (
        <div
            id="route-transition-curtain"
            className="pointer-events-none fixed inset-0 z-[9999] bg-[#111111] will-change-transform"
            style={{ transform: "translateY(100%)" }}
            aria-hidden="true"
        />
    );
}
