"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * VelvetMorphSection
 * Creates an organic, liquid velvet SVG curve morphing transition combined with
 * a smooth cinematic scroll page slide-in / reveal effect between sections.
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

  // SVG curved paths: Flat -> Curved Wave -> Deep Bulge -> Flat (Full liquid morph transition)
  const initialPath = invert
    ? "M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z"
    : "M 0 100 Q 50 100 100 100 L 100 0 L 0 0 Z";

  const deepBulgePath = invert
    ? "M 0 0 Q 50 100 100 0 L 100 100 L 0 100 Z"
    : "M 0 100 Q 50 0 100 100 L 100 0 L 0 0 Z";

  const finalFlatPath = invert
    ? "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z"
    : "M 0 0 Q 50 0 100 0 L 100 0 L 0 0 Z";

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!pathRef.current || !containerRef.current) return;

      // 1. Fluid liquid wave curve morph tied to scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      tl.fromTo(
        pathRef.current,
        { attr: { d: initialPath } },
        {
          attr: { d: deepBulgePath },
          ease: "power2.inOut",
          duration: 0.6,
        }
      ).to(pathRef.current, {
        attr: { d: finalFlatPath },
        ease: "power2.out",
        duration: 0.4,
      });

      // 2. Parallax scale & upward slide-in effect on the succeeding sibling section
      const nextSection = containerRef.current.nextElementSibling;
      if (nextSection) {
        gsap.fromTo(
          nextSection,
          {
            y: 80,
            scale: 0.98,
            transformOrigin: "top center",
          },
          {
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              end: "bottom 30%",
              scrub: 0.9,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, initialPath, deepBulgePath, finalFlatPath]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-24 sm:h-36 md:h-48 overflow-hidden pointer-events-none select-none z-20 will-change-transform ${className}`}
      style={{ backgroundColor: fromColor }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full block will-change-transform drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)]"
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
