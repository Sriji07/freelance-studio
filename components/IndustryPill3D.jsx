"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

// Crisp SVG Icons for each industry
const industryIcons = {
  Gyms: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6 20v-2a6 6 0 0 1 12 0v2M4 9h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2zM2 13h20" />
    </svg>
  ),
  Cafés: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
    </svg>
  ),
  Hotels: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l8-4v18M13 10h4v11M9 9h1M9 13h1M9 17h1M16 13h1M16 17h1" />
    </svg>
  ),
  Salons: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  ),
  Restaurants: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2v20M2 15h10a4 4 0 0 0 4-4V2M2 2v6a4 4 0 0 0 4 4h6" />
    </svg>
  ),
  Homestays: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

export default function IndustryPill3D({ name, index }) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for buttery responsiveness
  const springConfig = { damping: 20, stiffness: 260, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig);
  const brightness = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.15, 0.95]), springConfig);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Staggered ambient levitation float offsets
  const floatDelay = index * 0.4;
  const floatDuration = 3.5 + (index % 3) * 0.5;

  return (
    <div
      style={{ perspective: "1000px" }}
      className="cursor-target reveal-pill group inline-block"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={
          prefersReducedMotion
            ? {}
            : isHovered
            ? { y: -8, scale: 1.05 }
            : {
                y: [0, -5, 0],
                rotateZ: [0, index % 2 === 0 ? 0.8 : -0.8, 0],
              }
        }
        transition={
          isHovered
            ? { duration: 0.3, ease: "easeOut" }
            : {
                duration: floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay,
              }
        }
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        whileTap={{ scale: 0.96 }}
        className="relative flex items-center gap-3.5 rounded-2xl border border-[#f4f0e8]/15 bg-gradient-to-b from-[#1c1c1c]/90 to-[#121212]/90 px-6 py-4 sm:px-8 sm:py-5 backdrop-blur-xl transition-colors duration-300 hover:border-[#f4f0e8]/50 hover:from-[#252525] hover:to-[#171717] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9),0_0_25px_rgba(244,240,232,0.15),inset_0_1px_2px_rgba(255,255,255,0.25)] select-none cursor-pointer will-change-transform"
      >
        {/* 3D Dynamic Gloss / Sheen Highlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Ambient Top Edge Specular Rim */}
        <div className="pointer-events-none absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#f4f0e8]/30 to-transparent" />

        {/* 3D Elevated Icon Badge */}
        <div
          style={{ transform: "translateZ(24px)" }}
          className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-[#f4f0e8]/80 transition-all duration-300 group-hover:bg-[#f4f0e8] group-hover:text-[#111111] group-hover:scale-110 shadow-inner"
        >
          {industryIcons[name] || (
            <span className="h-2 w-2 rounded-full bg-[#f4f0e8]" />
          )}
        </div>

        {/* 3D Elevated Label & Subtitle */}
        <div
          style={{ transform: "translateZ(18px)" }}
          className="flex flex-col text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-semibold tracking-[-0.02em] text-[#f4f0e8] transition-colors duration-300 group-hover:text-white">
              {name}
            </span>
            <span className="text-[10px] font-mono font-medium text-[#f4f0e8]/30 group-hover:text-[#f4f0e8]/60 transition-colors">
              0{index + 1}
            </span>
          </div>
          <span className="text-xs text-[#f4f0e8]/45 transition-colors group-hover:text-[#f4f0e8]/75">
            Tailored Experience
          </span>
        </div>

        {/* Hover Arrow Indicator */}
        <div
          style={{ transform: "translateZ(20px)" }}
          className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04] text-[#f4f0e8]/30 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#f4f0e8] group-hover:bg-white/[0.12]"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
