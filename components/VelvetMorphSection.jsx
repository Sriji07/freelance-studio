"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * VelvetMorphSection
 * Creates an organic, liquid velvet SVG curve morphing transition between sections
 * on scroll rather than an abrupt hard cut.
 *
 * @param {string} fromColor - Background color of the upper section (e.g. "#f4f0e8" or "#111111")
 * @param {string} toColor - Background color of the lower section (e.g. "#111111" or "#f4f0e8")
 * @param {string} className - Optional extra class names
 * @param {boolean} invert - Invert the curve direction
 */
export default function VelvetMorphSection({
  fromColor = "#f4f0e8",
  toColor = "#111111",
  className = "",
  invert = false,
}) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const pathRef = useRef(null);

  // SVG curved paths: Flat -> Curved Wave -> Deep Bulge -> Flat (Full morph transition)
  const initialPath = invert
    ? "M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z"
    : "M 0 100 Q 50 100 100 100 L 100 0 L 0 0 Z";

  const midCurvePath = invert
    ? "M 0 0 Q 50 65 100 0 L 100 100 L 0 100 Z"
    : "M 0 100 Q 50 35 100 100 L 100 0 L 0 0 Z";

  const deepBulgePath = invert
    ? "M 0 0 Q 50 95 100 0 L 100 100 L 0 100 Z"
    : "M 0 100 Q 50 5 100 100 L 100 0 L 0 0 Z";

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!pathRef.current || !containerRef.current) return;

      // Smooth scroll-driven morph timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2, // Velvety smooth inertia
        },
      });

      tl.fromTo(
        pathRef.current,
        { attr: { d: initialPath } },
        {
          attr: { d: deepBulgePath },
          ease: "power2.inOut",
        }
      ).to(pathRef.current, {
        attr: { d: midCurvePath },
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, initialPath, deepBulgePath, midCurvePath]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-20 sm:h-28 md:h-36 overflow-hidden pointer-events-none select-none z-20 ${className}`}
      style={{ backgroundColor: fromColor }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full block will-change-transform"
      >
        <path
          ref={pathRef}
          d={initialPath}
          fill={toColor}
          className="transition-colors duration-500"
        />
      </svg>
    </div>
  );
}
