"use client";

import React from "react";
import { motion } from "framer-motion";
import DotMatrixText from "@/components/ui/dot-text";

const teamMembers = [
  {
    name: "Srijita Mallick",
    defaultTitle: "DEVELOPER",
    role: "Designer & Developer",
    image: "/team/srijita.png",
    description:
      "I focus on creating clean, responsive interfaces that make businesses look professional and easy to discover online.",
  },
  {
    name: "Shubhradip Saha",
    defaultTitle: "DESIGN ARCHITECT",
    role: "Designer & Developer",
    image: "/team/shubhradip.png",
    description:
      "I turn ideas into polished digital experiences, focusing on visual design, usability and the details that make a website feel unique.",
  },
];

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
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f4f0e8]/40 sm:text-xs font-mono">
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
          <p className="mx-auto max-w-xl text-xs uppercase tracking-[0.2em] text-[#f4f0e8]/40 sm:text-sm font-mono">
            From concept to craft to final launch
          </p>
        </motion.div>

        {/* Pure Dot Matrix Typography Stage with Slot-Machine / Roller Hover Transition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="group/dot-stage cursor-target relative mx-auto mt-8 h-48 w-full max-w-5xl overflow-hidden sm:h-60 md:h-72 select-none"
        >
          {/* Vertical Slot-Machine Roller Track */}
          <div className="flex h-[200%] w-full flex-col transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover/dot-stage:-translate-y-1/2 will-change-transform">
            {/* 1. Normal State Dot Matrix Canvas */}
            <div className="flex h-1/2 w-full items-center justify-center">
              <DotMatrixText
                text={["DESIGN", "DEVELOP", "DIVE"]}
                transition="fade"
                cycleInterval={1650}
                dotSize={4}
                gap={3}
                activeColor="#f4f0e8"
                inactiveColor="rgba(244, 240, 232, 0.05)"
                showInactive={true}
                fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                className="h-full w-full drop-shadow-[0_0_30px_rgba(244,240,232,0.35)]"
              />
            </div>

            {/* 2. Hover Revealed Duplicate Roller Stage */}
            <div className="flex h-1/2 w-full items-center justify-center">
              <DotMatrixText
                text={["DESIGN", "DEVELOP", "DIVE"]}
                transition="fade"
                cycleInterval={1650}
                dotSize={4}
                gap={3}
                activeColor="#f4f0e8"
                inactiveColor="rgba(244, 240, 232, 0.05)"
                showInactive={true}
                fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                className="h-full w-full drop-shadow-[0_0_35px_rgba(244,240,232,0.5)]"
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom subtle indicator */}
        <div className="mt-6 flex justify-center items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#f4f0e8]/20 font-mono">
          <span>Design</span>
          <span>•</span>
          <span>Develop</span>
          <span>•</span>
          <span>Dive</span>
        </div>

        {/* =====================================================
            TEAM PROFILE CARDS (Moved cleanly below the philosophy stage)
        ====================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 sm:mt-20 mx-auto grid max-w-4xl gap-5 sm:grid-cols-2"
        >
          {teamMembers.map((person) => (
            <div
              key={person.name}
              className="cursor-target group relative rounded-2xl border border-[#f4f0e8]/10 bg-[#f4f0e8]/[0.02] p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#f4f0e8]/25 hover:bg-[#f4f0e8]/[0.04] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-3.5">
                {/* Avatar with subtle border glow and initials fallback */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f4f0e8]/20 bg-[#f4f0e8]/10 transition-transform duration-300 group-hover:scale-105">
                  <span className="font-mono text-xs font-bold text-[#f4f0e8]/80 select-none">
                    {person.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <img
                    src={person.image}
                    alt={person.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                {/* Rolling Text / Slot-Machine Header Track */}
                <div className="flex flex-col justify-center">
                  <div className="relative h-6 sm:h-7 overflow-hidden">
                    <div className="flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-1/2">
                      {/* State 1 (Default): DEVELOPER / DESIGN ARCHITECT */}
                      <span
                        style={{
                          fontFamily: "'Anton', 'Bebas Neue', sans-serif",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                        className="flex h-6 sm:h-7 items-center text-lg sm:text-xl text-[#f4f0e8] leading-none tracking-wider select-none"
                      >
                        {person.defaultTitle}
                      </span>

                      {/* State 2 (On Hover): SRIJITA MALLICK / SHUBHRADIP SAHA */}
                      <span
                        style={{
                          fontFamily: "'Anton', 'Bebas Neue', sans-serif",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                        className="flex h-6 sm:h-7 items-center text-lg sm:text-xl text-[#f4f0e8] leading-none tracking-wider text-[#f4f0e8] select-none"
                      >
                        {person.name}
                      </span>
                    </div>
                  </div>

                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-[#f4f0e8]/40 font-mono">
                    {person.role}
                  </p>
                </div>
              </div>

              {/* Bio / Description */}
              <p className="mt-3.5 text-xs leading-relaxed text-[#f4f0e8]/60">
                {person.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
