"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    const prefersReducedMotion = useReducedMotion();
    const heroRef = useRef(null);
    const headlineRef = useRef(null);
    const contentRef = useRef(null);
    const circleBgRef = useRef(null);
    const [isHighlighted, setIsHighlighted] = useState(false);

    // Start highlighter animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsHighlighted(true);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    // GSAP ScrollTrigger Pinned Hero-to-Section Transition + Layered Parallax
    useEffect(() => {
        if (prefersReducedMotion || typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // 1. Pinned Hero Transition & Cinematic Docking
            const heroTl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "+=70%",
                    pin: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                },
            });

            heroTl.to(headlineRef.current, {
                scale: 0.85,
                y: -40,
                opacity: 0.85,
                ease: "power2.out",
            }, 0);

            heroTl.to(contentRef.current, {
                opacity: 0.3,
                y: -30,
                ease: "power2.out",
            }, 0);

            // 5. Layered Parallax with subtle rotation & scale scrubbing on background decoration
            if (circleBgRef.current) {
                gsap.to(circleBgRef.current, {
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                    },
                    rotation: 45,
                    scale: 1.15,
                    y: 100,
                    ease: "none",
                });
            }
        }, heroRef);

        return () => ctx.revert();
    }, [prefersReducedMotion]);

    return (
        <section
            ref={heroRef}
            id="about"
            className="relative min-h-screen overflow-hidden bg-[#f4f0e8] px-5 pb-16 pt-28 sm:pt-32 md:px-10 md:pb-24 md:pt-36 lg:pt-40"
        >
            {/* =====================================================
                BACKGROUND DECORATION (Layered Parallax + Rotation)
            ====================================================== */}
            <div 
                ref={circleBgRef}
                className="pointer-events-none absolute right-[-180px] top-[18%] z-0 h-[420px] w-[420px] md:right-[-180px] md:top-[15%] md:h-[600px] md:w-[600px]"
            >
                {/* Static circle */}
                <div className="absolute inset-0 rounded-full border border-black/[0.07]" />

                {/* Rotating dashed circle */}
                <div className="absolute inset-[35px] rounded-full border border-dashed border-black/[0.06] md:inset-[50px] animate-[spin_40s_linear_infinite]" />
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center pt-2 sm:pt-3 md:pt-4">

                {/* =================================================
                    MAIN HEADING WITH SCROLL-TRIGGERED HIGHLIGHTER
                ================================================== */}
                <h1
                    ref={headlineRef}
                    className="relative max-w-5xl text-[12vw] font-bold leading-[0.88] tracking-[-0.06em] text-[#111111] sm:text-[9vw] md:text-[6.5vw] lg:text-[5.5rem] will-change-transform"
                >
                    <span className="block overflow-hidden">
                        <span className="inline-block animate-[fadeUp_0.8s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]">
                            WE BUILD
                        </span>
                    </span>

                    <span className="relative block w-fit">
                        WEBSITES

                        {/* Baton-pass underline */}
                        <motion.span
                            initial={{ width: "100%", opacity: 1 }}
                            animate={
                                isHighlighted
                                    ? { width: 0, opacity: 0 }
                                    : { width: "100%", opacity: 1 }
                            }
                            transition={{
                                duration: prefersReducedMotion ? 0.4 : 0.8,
                                ease: [0.76, 0, 0.24, 1],
                            }}
                            className="absolute bottom-[-2px] left-0 h-[2px] bg-[#111111] md:bottom-[-4px] md:h-[3px] origin-left"
                        />
                    </span>

                    {/* HIGHLIGHTER / MARKER REVEAL EFFECT ON 'FOR BUSINESS.' */}
                    <span className="relative inline-block w-fit mt-1 px-2 py-0.5 sm:px-2.5 sm:py-1 -mx-2 sm:-mx-2.5">
                        <motion.span
                            initial={
                                prefersReducedMotion
                                    ? { opacity: 0 }
                                    : { clipPath: "inset(0 100% 0 0)", opacity: 1 }
                            }
                            animate={
                                isHighlighted
                                    ? prefersReducedMotion
                                        ? { opacity: 1 }
                                        : { clipPath: "inset(0 0% 0 0)", opacity: 1 }
                                    : prefersReducedMotion
                                        ? { opacity: 0 }
                                        : { clipPath: "inset(0 100% 0 0)", opacity: 1 }
                            }
                            transition={
                                prefersReducedMotion
                                    ? { duration: 0.4 }
                                    : { duration: 1.0, ease: [0.76, 0, 0.24, 1] }
                            }
                            className="pointer-events-none absolute inset-0 z-0 bg-[#111111] will-change-[clip-path]"
                            aria-hidden="true"
                        />

                        {/* BASE DIMMED TEXT LAYER */}
                        <span className="block text-[#c9c5ba]">
                            FOR BUSINESS.
                        </span>

                        {/* SYNCHRONIZED BRIGHT CREAM TEXT */}
                        <motion.span
                            initial={
                                prefersReducedMotion
                                    ? { opacity: 0 }
                                    : { clipPath: "inset(0 100% 0 0)", opacity: 1 }
                            }
                            animate={
                                isHighlighted
                                    ? prefersReducedMotion
                                        ? { opacity: 1 }
                                        : { clipPath: "inset(0 0% 0 0)", opacity: 1 }
                                    : prefersReducedMotion
                                        ? { opacity: 0 }
                                        : { clipPath: "inset(0 100% 0 0)", opacity: 1 }
                            }
                            transition={
                                prefersReducedMotion
                                    ? { duration: 0.4 }
                                    : { duration: 1.0, ease: [0.76, 0, 0.24, 1] }
                            }
                            className="pointer-events-none absolute inset-0 z-10 block px-2 py-0.5 sm:px-2.5 sm:py-1 text-[#f4f0e8] will-change-[clip-path]"
                            aria-hidden="true"
                        >
                            FOR BUSINESS.
                        </motion.span>
                    </span>
                </h1>

                {/* =================================================
                    FREELANCERS & SUBTEXT IN DOCKED TRANSITION
                ================================================== */}

                <div ref={contentRef} className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-10">

                    {freelancers.map((person, index) => (
                        <div
                            key={person.name}
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
                            <p className="mt-3 text-xs leading-relaxed text-[#111111]/60">
                                {person.description}
                            </p>
                        </div>
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
                        data-magnetic="true"
                        className="magnetic-btn group inline-flex items-center rounded-full bg-[#111111] px-6 py-3 text-sm font-medium !text-[#f4f0e8] transition-[padding,background-color,color] duration-300 will-change-transform hover:px-8"
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
                        data-magnetic="true"
                        className="magnetic-btn inline-flex items-center rounded-full border border-[#111111]/20 px-6 py-3 text-sm font-medium !text-[#111111] transition-[padding,background-color,color] duration-300 will-change-transform hover:bg-[#111111] hover:!text-[#f4f0e8]"
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