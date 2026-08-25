"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * VelvetMorphOverlay
 * Full-screen fluid SVG curve morphing transition for interactive actions
 * like clicking "DIVE" (Back to Top).
 *
 * It morphs a liquid bezier wave upwards from the bottom, scrolls to top while covered,
 * then morphs smoothly off the top of the viewport.
 */
export default function VelvetMorphOverlay() {
  const overlayRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Listen for custom trigger event
    const triggerVelvetTopTransition = () => {
      const overlay = overlayRef.current;
      const path = pathRef.current;
      if (!overlay || !path) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // If user is already at the top, just gentle scroll
      if (window.scrollY < 80) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const initialPath = "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z";
      const waveUpPath = "M 0 100 Q 50 10 100 100 L 100 100 L 0 100 Z";
      const fullCoverPath = "M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z";
      const waveExitPath = "M 0 0 Q 50 90 100 0 L 100 0 L 0 0 Z";
      const clearedPath = "M 0 0 Q 50 0 100 0 L 100 0 L 0 0 Z";

      const tl = gsap.timeline({
        onStart: () => {
          overlay.style.pointerEvents = "auto";
          overlay.style.visibility = "visible";
        },
        onComplete: () => {
          overlay.style.pointerEvents = "none";
          overlay.style.visibility = "hidden";
        },
      });

      // 1. Liquid wave surges upwards from bottom
      tl.set(path, { attr: { d: initialPath } })
        .to(path, {
          attr: { d: waveUpPath },
          duration: 0.35,
          ease: "power2.in",
        })
        .to(path, {
          attr: { d: fullCoverPath },
          duration: 0.3,
          ease: "power2.out",
        })
        // 2. Scroll smoothly to top while screen is covered in velvety dark cream layer
        .add(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
        })
        // 3. Liquid wave exits smoothly off top
        .to(path, {
          attr: { d: waveExitPath },
          duration: 0.35,
          ease: "power2.in",
        })
        .to(path, {
          attr: { d: clearedPath },
          duration: 0.3,
          ease: "power2.out",
        });
    };

    window.addEventListener("trigger-velvet-top", triggerVelvetTopTransition);
    return () => {
      window.removeEventListener("trigger-velvet-top", triggerVelvetTopTransition);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] pointer-events-none invisible overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        <path
          ref={pathRef}
          d="M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z"
          fill="#111111"
        />
      </svg>
    </div>
  );
}
