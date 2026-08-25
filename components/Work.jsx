"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projects from "@/data/projects";
import ProjectCard from "./ProjectCard";

const categories = [
    "All",
    "Gyms",
    "Cafés",
    "Hotels",
    "Salons",
    "Restaurants",
    "Homestays",
];

export default function Work() {
    const prefersReducedMotion = useReducedMotion();
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredCardId, setHoveredCardId] = useState(null);
    const [lastNavDirection, setLastNavDirection] = useState("next"); // 'prev' | 'next'

    const sectionRef = useRef(null);
    const titleHeadingRef = useRef(null);
    const watermarkRef = useRef(null);

    const filteredProjects =
        activeCategory === "All"
            ? projects
            : projects.filter(
                (project) => project.category === activeCategory
            );

    // Ensure currentIndex stays within bounds when filter changes
    const safeIndex = Math.min(currentIndex, Math.max(0, filteredProjects.length - 1));

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentIndex(0);
    };

    const handlePrev = () => {
        setLastNavDirection("prev");
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setLastNavDirection("next");
        setCurrentIndex((prev) => Math.min(filteredProjects.length - 1, prev + 1));
    };

    // Calculate center offset so the active card is always in the center
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(1200);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth || window.innerWidth);
            } else if (typeof window !== "undefined") {
                setContainerWidth(window.innerWidth);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // GSAP ScrollTrigger Scrubbing: Split text word reveal + Background Watermark Parallax
    useEffect(() => {
        if (prefersReducedMotion || typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Split-Text masked word rising reveal
            const words = titleHeadingRef.current?.querySelectorAll(".split-word-inner");
            if (words && words.length > 0) {
                gsap.fromTo(
                    words,
                    { yPercent: 100, opacity: 0 },
                    {
                        yPercent: 0,
                        opacity: 1,
                        stagger: 0.08,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: titleHeadingRef.current,
                            start: "top 90%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }

            // Layered Parallax with subtle rotate (3-5deg) & scale (1 -> 1.1) on background watermark
            if (watermarkRef.current) {
                gsap.to(watermarkRef.current, {
                    rotation: 5,
                    scale: 1.12,
                    y: 60,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [prefersReducedMotion]);

    const cardWidth = 340;
    const cardGap = 32;
    const cardStepPx = cardWidth + cardGap;
    const trackTranslateX = (containerWidth / 2) - (cardWidth / 2) - (safeIndex * cardStepPx);

    return (
        <section
            ref={sectionRef}
            id="work"
            className="relative overflow-hidden bg-[#f4f0e8] px-5 py-24 md:px-10 md:py-32"
        >
            {/* 5. Ghost Watermark Number with Scrubbed Rotation and Scale */}
            <div 
                ref={watermarkRef}
                className="pointer-events-none absolute right-[-5vw] top-[10%] select-none font-mono text-[22vw] font-black leading-none text-black/[0.03] will-change-transform md:right-[-2vw]"
                aria-hidden="true"
            >
                02
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">

                {/* Header with Masked Split-Word Rise */}
                <div>
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#111111]" />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40 sm:text-xs">
                            02 — Selected Work
                        </span>
                    </div>

                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        {/* 2. Split-Text Masked Heading */}
                        <h2 
                            ref={titleHeadingRef}
                            className="max-w-4xl text-5xl font-bold leading-[0.9] tracking-[-0.06em] sm:text-6xl md:text-8xl lg:text-[7rem]"
                        >
                            <span className="inline-block overflow-hidden pb-1">
                                <span className="split-word-inner inline-block">Work</span>
                            </span>{" "}
                            <span className="inline-block overflow-hidden pb-1">
                                <span className="split-word-inner inline-block">made</span>
                            </span>
                            <br />
                            <span className="text-black/25">
                                <span className="inline-block overflow-hidden pb-1">
                                    <span className="split-word-inner inline-block">for</span>
                                </span>{" "}
                                <span className="inline-block overflow-hidden pb-1">
                                    <span className="split-word-inner inline-block">real</span>
                                </span>{" "}
                                <span className="inline-block overflow-hidden pb-1">
                                    <span className="split-word-inner inline-block">businesses.</span>
                                </span>
                            </span>
                        </h2>

                        <p className="max-w-xs text-sm leading-relaxed text-black/50">
                            Explore some of the websites we've designed for different
                            businesses and industries.
                        </p>
                    </div>
                </div>

                {/* Filter Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-16 flex items-center justify-between border-y border-black/10 py-5 md:mt-24"
                >
                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {categories.map((category) => {
                            const active = activeCategory === category;

                            return (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                                        active
                                            ? "text-[#f4f0e8]"
                                            : "border border-black/15 text-black/60 hover:border-black/40 hover:text-black"
                                    }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="activeFilterPill"
                                            className="absolute inset-0 rounded-full bg-[#111111]"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{category}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Tilted-Card Carousel Track (Curved semi-circular arc layout, center-anchored) */}
                <div 
                    ref={containerRef}
                    className="tilted-carousel-container relative mt-12 w-full overflow-visible py-12"
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{
                            left: (containerWidth / 2) - (cardWidth / 2) - ((filteredProjects.length - 1) * cardStepPx),
                            right: (containerWidth / 2) - (cardWidth / 2),
                        }}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -60 && safeIndex < filteredProjects.length - 1) {
                                handleNext();
                            } else if (info.offset.x > 60 && safeIndex > 0) {
                                handlePrev();
                            }
                        }}
                        animate={{
                            x: prefersReducedMotion ? 0 : trackTranslateX,
                        }}
                        transition={{
                            duration: 0.55,
                            ease: [0.34, 1.56, 0.64, 1],
                        }}
                        className="flex items-center gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project, index) => {
                                // Semi-circular arc formula:
                                // Cards to the left tilt negative, cards to the right tilt positive
                                // Distance from active center creates vertical curved droop (Y offset)
                                const offsetFromActive = index - safeIndex;
                                
                                // Progressive tilt across the visible arc
                                const arcRotation = prefersReducedMotion 
                                    ? 0 
                                    : Math.max(-6, Math.min(6, offsetFromActive * 2.8));

                                // Concave arch: active center is highest, outer edges dip lower or follow natural arc
                                const arcY = prefersReducedMotion 
                                    ? 0 
                                    : Math.pow(Math.abs(offsetFromActive), 1.6) * 10;

                                const isActive = index === safeIndex;
                                const isHovered = hoveredCardId === project.id;

                                return (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={
                                            prefersReducedMotion
                                                ? { opacity: 0 }
                                                : {
                                                    opacity: 0,
                                                    scale: 0.9,
                                                    rotate: arcRotation,
                                                    y: arcY + 40,
                                                }
                                        }
                                        animate={{
                                            opacity: 1,
                                            scale: isActive ? 1.03 : 1,
                                            rotate: prefersReducedMotion ? 0 : (isHovered ? 0 : arcRotation),
                                            y: isHovered ? arcY - 12 : arcY,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.8,
                                            x: -40,
                                            transition: { duration: 0.3, ease: "easeIn" },
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            ease: [0.34, 1.56, 0.64, 1],
                                        }}
                                        className="w-[340px] flex-shrink-0"
                                    >
                                        <ProjectCard
                                            project={project}
                                            index={index}
                                            total={filteredProjects.length}
                                            tiltAngle={arcRotation}
                                            isActive={isActive}
                                            isHovered={isHovered}
                                            onHoverStart={() => setHoveredCardId(project.id)}
                                            onHoverEnd={() => setHoveredCardId(null)}
                                            onClick={() => setCurrentIndex(index)}
                                            prefersReducedMotion={prefersReducedMotion}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Bottom Carousel Pill Nav Controls (Clean black/cream design system matching the rest of the site) */}
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={safeIndex === 0}
                        aria-label="Previous card"
                        className={`flex h-11 w-24 items-center justify-center rounded-full border transition-all duration-300 ${
                            safeIndex === 0
                                ? "cursor-not-allowed border-[#111111]/10 bg-transparent text-[#111111]/20"
                                : lastNavDirection === "prev"
                                    ? "border-[#111111] bg-[#111111] text-[#f4f0e8] shadow-sm hover:scale-105"
                                    : "border-[#111111]/25 bg-transparent text-[#111111] hover:border-[#111111] hover:bg-[#111111]/5"
                        }`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={safeIndex >= filteredProjects.length - 1}
                        aria-label="Next card"
                        className={`flex h-11 w-24 items-center justify-center rounded-full border transition-all duration-300 ${
                            safeIndex >= filteredProjects.length - 1
                                ? "cursor-not-allowed border-[#111111]/10 bg-transparent text-[#111111]/20"
                                : lastNavDirection === "next"
                                    ? "border-[#111111] bg-[#111111] text-[#f4f0e8] shadow-sm hover:scale-105"
                                    : "border-[#111111]/25 bg-transparent text-[#111111] hover:border-[#111111] hover:bg-[#111111]/5"
                        }`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-24 text-center"
                    >
                        <p className="text-black/40">
                            Projects coming soon.
                        </p>
                    </motion.div>
                )}

                {/* Bottom Footer Info */}
                <div className="mt-14 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] text-black/40">
                        Showing {filteredProjects.length > 0 ? safeIndex + 1 : 0} of {filteredProjects.length} Projects
                    </p>

                    <p className="text-sm text-black/40">
                        Swipe or use navigation buttons to browse projects.
                    </p>
                </div>
            </div>
        </section>
    );
}