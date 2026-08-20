"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const industries = [
    "Gyms",
    "Cafés",
    "Hotels",
    "Salons",
    "Restaurants",
    "Homestays",
];

const services = [
    {
        number: "01",
        title: "Website Design",
        description:
            "Clean, modern designs built around your business and your customers.",
    },
    {
        number: "02",
        title: "Responsive Development",
        description:
            "Websites that look and work beautifully across phones, tablets and desktops.",
    },
    {
        number: "03",
        title: "UI / UX",
        description:
            "Simple and intuitive experiences that make it easy for visitors to take action.",
    },
    {
        number: "04",
        title: "Launch & Support",
        description:
            "From domain and deployment to updates and ongoing improvements.",
    },
];

export default function Services() {
    const prefersReducedMotion = useReducedMotion();
    const sectionRef = useRef(null);
    const orbitContainerRef = useRef(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

    // Scroll parallax & depth
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
    const line1Y = useTransform(scrollYProgress, [0.1, 0.7], [0, -25]);
    const line2Y = useTransform(scrollYProgress, [0.1, 0.7], [0, -45]);

    // 3D Orbital Tilt tracking around the center of "your business."
    const handleMouseMove = (e) => {
        if (prefersReducedMotion || !orbitContainerRef.current) return;
        const rect = orbitContainerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        setTilt({
            rotateX: -deltaY * 12,
            rotateY: deltaX * 16,
            scale: 1.02,
        });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
    };

    // Refs for IntersectionObserver scroll reveals
    const whoWeBuildForRef = useRef(null);
    const serviceRowRefs = useRef([]);

    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;

        // 1. Observer for "Who we build for" heading, intro text & pills
        const whoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        // Reveal heading + intro
                        const headingIntro = target.querySelector(".reveal-heading-intro");
                        if (headingIntro) headingIntro.classList.add("is-revealed");

                        // Reveal staggered pill tags
                        const pills = target.querySelectorAll(".reveal-pill");
                        pills.forEach((pill) => pill.classList.add("is-revealed"));

                        whoObserver.unobserve(target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );

        if (whoWeBuildForRef.current) {
            whoObserver.observe(whoWeBuildForRef.current);
        }

        // 2. Per-row Observer for Numbered List Rows (01-04)
        const rowObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const rowEl = entry.target;
                        rowEl.classList.add("is-revealed");

                        const divider = rowEl.querySelector(".reveal-divider");
                        if (divider) divider.classList.add("is-revealed");

                        rowObserver.unobserve(rowEl);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );

        serviceRowRefs.current.forEach((rowEl) => {
            if (rowEl) rowObserver.observe(rowEl);
        });

        return () => {
            whoObserver.disconnect();
            rowObserver.disconnect();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="services"
            className="relative overflow-hidden bg-[#111111] px-5 py-24 text-[#f4f0e8] md:px-10 md:py-32"
        >
            {/* Background Ambient Glow that revolves around the core */}
            <motion.div
                animate={
                    prefersReducedMotion
                        ? {}
                        : {
                            scale: [1, 1.15, 1],
                            opacity: [0.08, 0.16, 0.08],
                        }
                }
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-[#f4f0e8]/10 blur-3xl md:h-[32rem] md:w-[32rem]"
            />

            <div className="mx-auto max-w-7xl">

                {/* Conceptual "Around" Headline Section (Centered) */}
                <div className="relative mx-auto flex flex-col items-center text-center">

                    {/* Leading Cue Dot with expanding orbital wave */}
                    <div className="mb-6 flex items-center justify-center gap-3">
                        <div className="relative flex items-center justify-center">
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 18,
                                }}
                                className="h-2.5 w-2.5 rounded-full bg-[#f4f0e8]"
                            />

                            {/* Orbiting ripple circle */}
                            <motion.span
                                animate={{
                                    scale: [1, 2.8],
                                    opacity: [0.6, 0],
                                }}
                                transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                }}
                                className="absolute h-2.5 w-2.5 rounded-full border border-[#f4f0e8]"
                            />
                        </div>

                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f4f0e8]/40 sm:text-xs">
                            Tailored Architecture
                        </span>
                    </div>

                    <h2 className="mx-auto max-w-5xl text-center text-5xl font-bold leading-[0.92] tracking-[-0.06em] sm:text-6xl md:text-8xl lg:text-[7rem]">
                        {/* LINE 1: Websites built */}
                        <motion.div
                            style={{
                                y: prefersReducedMotion ? 0 : line1Y,
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.8,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="block text-[#f4f0e8]"
                        >
                            Websites built
                        </motion.div>

                        {/* LINE 2: "around your business." with animated 3D elliptical orbit wrap */}
                        <motion.div
                            ref={orbitContainerRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                y: prefersReducedMotion ? 0 : line2Y,
                                perspective: 1000,
                            }}
                            initial={{ opacity: 0, y: 35 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.85,
                                delay: 0.18,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="relative mt-2 inline-block cursor-pointer text-center"
                        >
                            {/* 3D Tilting Core Container */}
                            <motion.div
                                animate={{
                                    rotateX: tilt.rotateX,
                                    rotateY: tilt.rotateY,
                                    scale: tilt.scale,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                }}
                                className="relative inline-block px-3 py-1"
                            >
                                <span className="relative z-10 text-[#f4f0e8]/35 transition-colors duration-500 hover:text-[#f4f0e8]/80">
                                    <span className="italic font-normal mr-3 text-[#f4f0e8]/50">around</span>
                                    <span className="text-[#f4f0e8]/45">your business.</span>
                                </span>

                                {/* THE ORBITAL WRAP: SVG Ring that encircles the words */}
                                <svg
                                    className="pointer-events-none absolute -inset-x-8 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+4rem)] sm:-inset-x-12 sm:-inset-y-5 sm:h-[calc(100%+2.5rem)] sm:w-[calc(100%+6rem)]"
                                    viewBox="0 0 420 110"
                                    fill="none"
                                    preserveAspectRatio="none"
                                >
                                    {/* Primary Orbit Trace Line drawing around the text */}
                                    <motion.ellipse
                                        cx="210"
                                        cy="55"
                                        rx="200"
                                        ry="46"
                                        stroke="rgba(244, 240, 232, 0.22)"
                                        strokeWidth="1.5"
                                        strokeDasharray="6 8"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 1.6,
                                            delay: 0.4,
                                            ease: "easeInOut",
                                        }}
                                    />

                                    {/* Glowing Accent Arc sweeping around */}
                                    <motion.ellipse
                                        cx="210"
                                        cy="55"
                                        rx="200"
                                        ry="46"
                                        stroke="rgba(244, 240, 232, 0.85)"
                                        strokeWidth="2"
                                        strokeDasharray="60 300"
                                        animate={
                                            prefersReducedMotion
                                                ? {}
                                                : {
                                                    strokeDashoffset: [0, -360],
                                                }
                                        }
                                        transition={{
                                            duration: 6,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    />
                                </svg>

                                {/* Orbiting Satellite Bead travelling around the perimeter */}
                                {!prefersReducedMotion && (
                                    <div className="pointer-events-none absolute inset-0">
                                        <motion.div
                                            animate={{
                                                rotate: 360,
                                            }}
                                            transition={{
                                                duration: 6,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="absolute -inset-x-8 -inset-y-4 sm:-inset-x-12 sm:-inset-y-5"
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                                <span className="h-2 w-2 rounded-full bg-[#f4f0e8] shadow-[0_0_12px_rgba(244,240,232,0.9)]" />
                                                <span className="absolute h-4 w-4 rounded-full bg-[#f4f0e8]/30 blur-[2px]" />
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </h2>
                </div>

                {/* Industries ("Who we build for") */}
                <div
                    ref={whoWeBuildForRef}
                    className="mt-20 border-t border-[#f4f0e8]/10 pt-8 md:mt-28"
                >
                    <div className="reveal-heading-intro mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-[#f4f0e8]">
                                Who we build for
                            </p>

                            <p className="mt-1 max-w-md text-sm text-[#f4f0e8]/40">
                                From local businesses to growing brands, we create websites
                                tailored to different industries.
                            </p>
                        </div>
                    </div>

                    {/* Industry pills */}
                    <div className="flex flex-wrap gap-3">
                        {industries.map((industry, index) => (
                            <button
                                key={industry}
                                style={{ "--pill-delay": `${index * 70}ms` }}
                                className="reveal-pill group rounded-full border border-[#f4f0e8]/20 px-5 py-2.5 text-sm text-[#f4f0e8]/70 transition-all duration-300 hover:border-[#f4f0e8] hover:bg-[#f4f0e8] hover:text-[#111111]"
                            >
                                {industry}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Services list */}
                <div className="mt-20 md:mt-28">
                    {services.map((service, index) => (
                        <div
                            key={service.number}
                            ref={(el) => {
                                serviceRowRefs.current[index] = el;
                            }}
                            className="reveal-row relative overflow-hidden"
                        >
                            {/* Animated divider line leading the row */}
                            <div className="reveal-divider h-px bg-[#f4f0e8]/10" />

                            <div className="group grid py-7 md:grid-cols-[80px_1fr_1fr] md:items-center md:gap-10 md:py-9">
                                {/* Number with mechanical counter effect */}
                                <div className="reveal-row-number mb-3 flex items-center gap-2 md:mb-0">
                                    <span className="font-mono text-xs text-[#f4f0e8]/40 tracking-wider">
                                        [{service.number}]
                                    </span>
                                </div>

                                {/* Unfolding Container for Title and Description */}
                                <div className="reveal-row-content col-span-1 grid gap-4 md:col-span-2 md:grid-cols-2 md:items-center md:gap-10">
                                    {/* Title */}
                                    <h3 className="text-2xl font-medium tracking-[-0.04em] transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="reveal-row-desc text-sm leading-relaxed text-[#f4f0e8]/50 md:justify-self-end md:max-w-md">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Bottom closing border */}
                    <div className="h-px w-full bg-[#f4f0e8]/10" />
                </div>

                {/* Bottom statement */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-16 flex items-center justify-between md:mt-20"
                >
                    <p className="max-w-xl text-sm leading-relaxed text-[#f4f0e8]/40 md:text-base">
                        Don't see your industry? That's okay. We design around the
                        business, not a template.
                    </p>

                    <motion.a
                        href="#work"
                        whileHover={{ x: 5 }}
                        className="hidden text-sm font-medium text-[#f4f0e8] md:block"
                    >
                        Explore our work ↗
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}