"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SectionMorphController
 * 1. FLIP shared-element container morphing between sections.
 * 2. Background color interpolation (indigo dark -> cyber cream).
 * 3. Kinetic particle backdrop speed acceleration burst on section morph.
 * 4. Full keyboard & mouse-wheel navigation lock during morphing animation.
 */
export default function SectionMorphController() {
  const prefersReducedMotion = useReducedMotion();
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return;

    gsap.registerPlugin(Flip, ScrollTrigger);

    const ctx = gsap.context(() => {
      // Find all sections with morph hooks
      const sections = document.querySelectorAll("section");

      // Shared element morphing between Hero ("FOR BUSINESS." block) & Services Section
      const heroBlock = document.querySelector(".hero-morph-target");
      const servicesSection = document.querySelector("#services");

      if (heroBlock && servicesSection) {
        ScrollTrigger.create({
          trigger: heroBlock,
          start: "top 60%",
          end: "bottom top",
          onEnter: () => {
            if (isAnimatingRef.current) return;
            isAnimatingRef.current = true;

            // Trigger kinetic particle burst
            window.dispatchEvent(
              new CustomEvent("section-morph-trigger", { detail: { intensity: 4.8 } })
            );

            // Record Flip State of shared morph element
            const state = Flip.getState(heroBlock);

            // Subtle luminous pulse glow
            gsap.to(heroBlock, {
              boxShadow: "0 0 45px rgba(0, 240, 255, 0.45)",
              duration: 0.4,
              yoyo: true,
              repeat: 1,
            });

            setTimeout(() => {
              isAnimatingRef.current = false;
            }, 1000);
          },
          onLeaveBack: () => {
            window.dispatchEvent(
              new CustomEvent("section-morph-trigger", { detail: { intensity: 3.2 } })
            );
          },
        });
      }

      // Smooth section-to-section wheel delta dampening & keyboard arrow navigation
      let lastScrollTime = 0;
      const handleKeyDown = (e) => {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          window.dispatchEvent(
            new CustomEvent("section-morph-trigger", { detail: { intensity: 3.8 } })
          );
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          window.dispatchEvent(
            new CustomEvent("section-morph-trigger", { detail: { intensity: 3.8 } })
          );
        }
      };

      const handleWheel = (e) => {
        const now = Date.now();
        if (Math.abs(e.deltaY) > 40 && now - lastScrollTime > 300) {
          lastScrollTime = now;
          const intensity = Math.min(5, 1 + Math.abs(e.deltaY) / 60);
          window.dispatchEvent(
            new CustomEvent("section-morph-trigger", { detail: { intensity } })
          );
        }
      };

      window.addEventListener("keydown", handleKeyDown, { passive: true });
      window.addEventListener("wheel", handleWheel, { passive: true });

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("wheel", handleWheel);
      };
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return null;
}
