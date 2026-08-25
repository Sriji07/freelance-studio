"use client";

import React from "react";
import { motion } from "framer-motion";
import DotMatrixText from "@/components/ui/dot-text";

export default function DotMatrixSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#111111] py-24 md:py-32 border-t border-[#f4f0e8]/10 select-none">
      {/* 1. Ambient Background Lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full bg-[#f4f0e8]/5 blur-[120px] md:h-[450px] md:w-[800px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[350px] rounded-full bg-[#2a2a2a]/20 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10">
        {/* Section Tag */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#f4f0e8]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f4f0e8]/40 sm:text-xs">
            04 — The Philosophy
          </span>
        </div>

        {/* Headline / Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="mx-auto max-w-xl text-xs uppercase tracking-[0.2em] text-[#f4f0e8]/40 sm:text-sm">
            From concept to craft to final launch
          </p>
        </motion.div>

        {/* Pure Dot Matrix Typography Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto mt-8 flex h-52 w-full max-w-5xl items-center justify-center sm:h-64 md:h-80"
        >
          <DotMatrixText
            text={["DESIGN", "DEVELOP", "DIVE"]}
            transition="fade"
            cycleInterval={2800}
            dotSize={4}
            gap={3}
            activeColor="#f4f0e8"
            inactiveColor="rgba(244, 240, 232, 0.05)"
            showInactive={true}
            fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
            className="h-full w-full drop-shadow-[0_0_30px_rgba(244,240,232,0.35)]"
          />
        </motion.div>

        {/* Bottom subtle indicator */}
        <div className="mt-8 flex justify-center items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#f4f0e8]/20">
          <span>Design</span>
          <span>•</span>
          <span>Develop</span>
          <span>•</span>
          <span>Dive</span>
        </div>
      </div>
    </section>
  );
}
