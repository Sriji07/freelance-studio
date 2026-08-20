"use client";

import { motion } from "framer-motion";

const freelancers = [
    {
        name: "Srijita Mallick",
        role: "Designer & Developer",
        image: "/team/you.jpg",
        description:
            "I focus on creating clean, responsive interfaces that make businesses look professional and easy to discover online.",
    },
    {
        name: "Shubhradip Saha",
        role: "Designer & Developer",
        image: "/team/friend.jpg",
        description:
            "I turn ideas into polished digital experiences, focusing on visual design, usability and the details that make a website feel unique.",
    },
];

export default function Hero() {
    return (
        <section
            id="about"
            className="relative min-h-screen overflow-hidden bg-[#f4f0e8] px-5 pb-16 pt-28 md:px-10 md:pb-20 md:pt-32"
        >
            {/* =====================================================
                BACKGROUND DECORATION
            ====================================================== */}

            <div className="pointer-events-none absolute right-[-180px] top-[18%] z-0 h-[420px] w-[420px] md:right-[-180px] md:top-[15%] md:h-[600px] md:w-[600px]">

                {/* Static circle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 1.2,
                        ease: "easeOut",
                    }}
                    className="absolute inset-0 rounded-full border border-black/[0.07]"
                />

                {/* Rotating dashed circle */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute inset-[35px] rounded-full border border-dashed border-black/[0.06] md:inset-[50px]"
                />
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-7xl flex-col justify-center">

                {/* Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-7 flex items-center gap-3"
                >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#111111]" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#111111]/60 sm:text-xs">
                        Independent Web Design Studio
                    </span>
                </motion.div>

                {/* =================================================
                    MAIN HEADING
                ================================================== */}

                <motion.h1
                    initial={{ opacity: 0, y: 45 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.1,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative max-w-5xl text-[16vw] font-bold leading-[0.83] tracking-[-0.075em] text-[#111111] sm:text-[12vw] md:text-[9vw] lg:text-[7.5rem]"
                >
                    <span className="block">
                        WE BUILD
                    </span>

                    <span className="relative block w-fit">
                        WEBSITES

                        <motion.span
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 0.9,
                                delay: 0.8,
                            }}
                            className="absolute bottom-[-3px] left-0 h-[2px] bg-[#111111] md:bottom-[-7px] md:h-[3px]"
                        />
                    </span>

                    <span className="block text-[#111111]/20">
                        FOR BUSINESS.
                    </span>
                </motion.h1>

                {/* =================================================
                    FREELANCERS
                ================================================== */}

                <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-10">

                    {freelancers.map((person, index) => (
                        <motion.div
                            key={person.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.5 + index * 0.12,
                            }}
                            className="max-w-lg border-t border-[#111111]/15 pt-5"
                        >
                            {/* Profile */}
                            <div className="flex items-center gap-4">

                                {/* Photo */}
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-black/10">
                                    <img
                                        src={person.image}
                                        alt={person.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Name + role */}
                                <div>
                                    <h3 className="text-base font-semibold tracking-[-0.02em]">
                                        {person.name}
                                    </h3>

                                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#111111]/40">
                                        {person.role}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#111111]/55 md:text-base">
                                {person.description}
                            </p>
                        </motion.div>
                    ))}

                </div>

                {/* =================================================
                    BUTTONS
                ================================================== */}

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.8,
                    }}
                    className="relative z-20 mt-8 flex flex-wrap gap-3 md:mt-10"
                >
                    {/* View Work */}
                    <a
                        href="#work"
                        className="group inline-flex items-center rounded-full bg-[#111111] px-6 py-3 text-sm font-medium !text-[#f4f0e8] transition-all duration-300 hover:px-8"
                    >
                        <span className="!text-[#f4f0e8]">
                            View Our Work
                        </span>

                        <span className="ml-2 !text-[#f4f0e8] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                            ↗
                        </span>
                    </a>

                    {/* Contact */}
                    <a
                        href="#contact"
                        className="inline-flex items-center rounded-full border border-[#111111]/20 px-6 py-3 text-sm font-medium !text-[#111111] transition-all duration-300 hover:bg-[#111111] hover:!text-[#f4f0e8]"
                    >
                        Let's Talk
                    </a>
                </motion.div>

                {/* =================================================
                    BOTTOM INFORMATION
                ================================================== */}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.6,
                        delay: 1,
                    }}
                    className="mt-12 border-t border-[#111111]/10 pt-5 md:mt-14"
                >
                    <div className="flex items-center justify-between">

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-6">

                            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#111111]/40 sm:text-xs">
                                02 Designers
                            </span>

                            <span className="h-1 w-1 rounded-full bg-[#111111]/20" />

                            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#111111]/40 sm:text-xs">
                                Multiple Industries
                            </span>

                            <span className="hidden h-1 w-1 rounded-full bg-[#111111]/20 sm:block" />

                            <span className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-[#111111]/40 sm:block sm:text-xs">
                                Built With Purpose
                            </span>

                        </div>

                        {/* Scroll */}
                        <motion.a
                            href="#services"
                            animate={{ y: [0, 4, 0] }}
                            transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] !text-[#111111]/40 md:flex"
                        >
                            Scroll
                            <span>↓</span>
                        </motion.a>

                    </div>
                </motion.div>
            </div>
        </section>
    );
}