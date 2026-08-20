"use client";

import { motion } from "framer-motion";

export default function ProjectCard({
    project,
    isActive,
    tiltAngle = 0,
    index,
    total,
    onClick,
    isHovered,
    onHoverStart,
    onHoverEnd,
    prefersReducedMotion = false,
}) {
    // Subtle rotation like reference (gentle 2-3deg alternation)
    const rotation = prefersReducedMotion ? 0 : (isHovered ? 0 : tiltAngle);
    const translateY = isHovered ? -10 : 0;

    // Small single accent dots per category
    const categoryDots = {
        Gyms: "bg-[#e85d04]",
        Cafés: "bg-[#b07d62]",
        Hotels: "bg-[#3a86ff]",
        Salons: "bg-[#d90429]",
        Restaurants: "bg-[#fb8500]",
        Homestays: "bg-[#2a9d8f]",
    };
    const dotColor = categoryDots[project.category] || "bg-[#111111]";

    return (
        <motion.article
            layout
            onClick={onClick}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            data-cursor="card"
            style={{
                zIndex: isActive ? 30 : (isHovered ? 25 : total - index),
            }}
            animate={{
                rotate: rotation,
                y: translateY,
            }}
            transition={{
                rotate: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 0.3, ease: "easeOut" },
                layout: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
            }}
            className={`tilted-card group relative flex flex-col justify-between cursor-pointer select-none rounded-[6px] bg-[#ffffff] p-5 md:p-6 transition-all duration-300 ${
                isActive
                    ? "border-[2px] border-[#111111] shadow-[0_20px_45px_-10px_rgba(17,17,17,0.18)] scale-[1.02]"
                    : "border border-[#111111]/35 shadow-[0_8px_24px_-6px_rgba(17,17,17,0.06)] hover:border-[#111111]/70 hover:shadow-[0_16px_32px_-8px_rgba(17,17,17,0.12)]"
            }`}
        >
            {/* Top Brand Logo / Category indicator */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                    <span className="font-mono text-[11px] font-medium tracking-wider text-[#111111]/70 uppercase">
                        {project.category}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-[#111111]/25" />
                    <span className="h-1 w-1 rounded-full bg-[#111111]/15" />
                </div>
            </div>

            {/* Main Visual Display Area - Minimalist architectural framing with crisp border */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-[#f5f1e8] border border-[#111111]/15 flex flex-col items-center justify-center p-6 transition-colors duration-300 group-hover:border-[#111111]/30">
                {/* Visual mock card inside */}
                <div className="relative flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-13 w-13 items-center justify-center rounded-[4px] bg-[#ffffff] border border-[#111111]/15 shadow-sm transition-transform duration-500 group-hover:scale-105">
                        <span className="font-mono text-base font-bold text-[#111111]">
                            {project.title.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-[#111111]/50 uppercase">
                        CASE STUDY
                    </span>
                    <h4 className="mt-1 text-base font-semibold tracking-tight text-[#111111] md:text-lg">
                        {project.title}
                    </h4>
                </div>

                {/* View Project button on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#111111]/10 opacity-0 backdrop-blur-[1px] transition-all duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-4 py-2 text-xs font-medium text-[#f4f0e8] shadow-lg">
                        View Project ↗
                    </span>
                </div>
            </div>

            {/* Bottom Metadata & Pricing / Tag Layout */}
            <div className="mt-5">
                <div className="flex items-baseline justify-between">
                    <div>
                        <h3 className="text-lg font-bold tracking-[-0.03em] text-[#111111]">
                            {project.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#111111]/50">
                            {project.category} Website
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="font-mono text-xs font-medium text-[#111111]/60">
                            Custom
                        </span>
                    </div>
                </div>

                {/* Bottom Dots & Indicator Row */}
                <div className="mt-4 flex items-center justify-between border-t border-[#111111]/10 pt-3">
                    <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[#111111]" : "bg-[#111111]/20"}`} />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#111111]/10" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#111111]/10" />
                    </div>

                    <span className="font-mono text-[11px] font-medium text-[#111111]/45">
                        0{index + 1} / 0{total}
                    </span>
                </div>
            </div>
        </motion.article>
    );
}