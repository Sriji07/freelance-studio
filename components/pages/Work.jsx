"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projects from "@/data/projects";
import ProjectCard from "../ProjectCard";
import CardSpread from "../ui/card-spread";

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
    const [selectedProject, setSelectedProject] = useState(null);
    const [isForceSpread, setIsForceSpread] = useState(false);
    const [hoveredCardId, setHoveredCardId] = useState(null);

    // Mobile Carousel State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastNavDirection, setLastNavDirection] = useState("next");
    const [isMobile, setIsMobile] = useState(false);
    const [containerWidth, setContainerWidth] = useState(1200);
    const mobileContainerRef = useRef(null);

    const sectionRef = useRef(null);
    const titleHeadingRef = useRef(null);
    const watermarkRef = useRef(null);

    const filteredProjects =
        activeCategory === "All"
            ? projects
            : projects.filter(
                (project) => project.category === activeCategory
            );

    const safeIndex = Math.min(currentIndex, Math.max(0, filteredProjects.length - 1));

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setSelectedProject(null);
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

    // Pixel Reveal Grid Setup
    const [gridConfig, setGridConfig] = useState({ cols: 18, rows: 12 });
    const pixelOverlayRef = useRef(null);
    const tileRefs = useRef([]);

    // Card dimensions for Desktop CardSpread
    const [cardDimensions, setCardDimensions] = useState({
        width: 330,
        height: 450,
        arc: 40,
        radius: 860,
    });

    useEffect(() => {
        const updateDimensions = () => {
            if (typeof window !== "undefined") {
                const width = window.innerWidth;
                const mobile = width < 768;
                setIsMobile(mobile);

                if (mobile) {
                    setGridConfig({ cols: 10, rows: 14 });
                } else if (width < 1024) {
                    setGridConfig({ cols: 14, rows: 10 });
                    setCardDimensions({
                        width: 300,
                        height: 420,
                        arc: 36,
                        radius: 760,
                    });
                } else {
                    setGridConfig({ cols: 18, rows: 12 });
                    setCardDimensions({
                        width: 330,
                        height: 450,
                        arc: 42,
                        radius: 880,
                    });
                }

                if (mobileContainerRef.current) {
                    setContainerWidth(mobileContainerRef.current.offsetWidth || width);
                } else {
                    setContainerWidth(width);
                }
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const totalTiles = gridConfig.cols * gridConfig.rows;

    // GSAP ScrollTrigger Pixel Reveal & 3D Kinetic Typography Animation
    useEffect(() => {
        if (prefersReducedMotion || typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        const overlay = pixelOverlayRef.current;
        const validTiles = tileRefs.current.filter(Boolean);

        if (!section || !overlay || validTiles.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.set(validTiles, {
                scale: 1.02,
                opacity: 1,
                borderRadius: "0%",
                transformOrigin: "center center",
            });
            gsap.set(overlay, { display: "grid", opacity: 1 });

            // 1. Pixel-Out ScrollTrigger Timeline (finishes briskly as section enters)
            const tlPixel = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "top 75%",
                    pin: false,
                    scrub: 0.3,
                    invalidateOnRefresh: true,
                    onLeave: () => {
                        gsap.set(overlay, { display: "none" });
                    },
                },
            });

            tlPixel.to(validTiles, {
                scale: 0,
                opacity: 0,
                borderRadius: "50%",
                duration: 0.4,
                ease: "power2.inOut",
                stagger: {
                    amount: 0.35,
                    from: "random",
                    grid: [gridConfig.rows, gridConfig.cols],
                },
            }, 0);

            // 2. 3D Kinetic Perspective Typography Animation (triggers immediately as header enters)
            const wordContainers = titleHeadingRef.current?.querySelectorAll(".route-city-word");
            if (wordContainers && wordContainers.length > 0) {
                gsap.set(wordContainers, {
                    transformPerspective: 1000,
                    transformOrigin: "50% 100% -20px",
                    rotationX: 45,
                    yPercent: 40,
                    filter: "blur(6px)",
                    opacity: 0,
                });

                const textTl = gsap.timeline({ paused: true });

                textTl.to(wordContainers, {
                    rotationX: 0,
                    rotationY: 0,
                    z: 0,
                    yPercent: 0,
                    filter: "blur(0px)",
                    opacity: 1,
                    delay: 0.3, // Starts 0.3s later
                    stagger: {
                        each: 0.03,
                        ease: "power2.out",
                    },
                    duration: 0.38,
                    ease: "power3.out",
                });

                ScrollTrigger.create({
                    trigger: titleHeadingRef.current,
                    start: "top 95%", // Triggers immediately as the header enters the bottom of screen
                    onEnter: () => textTl.play(),
                    onLeaveBack: () => textTl.reverse(),
                });
            }

            // Layered Parallax with subtle rotate on background watermark
            if (watermarkRef.current) {
                gsap.to(watermarkRef.current, {
                    rotation: 5,
                    scale: 1.12,
                    y: 60,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                    },
                });
            }
        }, section);

        return () => ctx.revert();
    }, [gridConfig, prefersReducedMotion]);

    // Mobile Carousel geometry calculations
    const mobileCardWidth = 290;
    const mobileCardGap = 20;
    const mobileCardStepPx = mobileCardWidth + mobileCardGap;
    const mobileTrackTranslateX = (containerWidth / 2) - (mobileCardWidth / 2) - (safeIndex * mobileCardStepPx);

    return (
        <section
            ref={sectionRef}
            id="work"
            className="relative min-h-screen overflow-hidden bg-[#f4f0e8] px-5 py-24 md:px-10 md:py-32"
        >
            {/* Full-Screen Black Layer Screen with Pixel Tile Grid */}
            <div
                ref={pixelOverlayRef}
                className="pointer-events-none absolute inset-0 z-40 h-screen w-full"
                style={{
                    gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
                    display: "grid",
                }}
                aria-hidden="true"
            >
                {Array.from({ length: totalTiles }).map((_, index) => (
                    <div
                        key={index}
                        ref={(el) => (tileRefs.current[index] = el)}
                        className="w-full h-full bg-[#111111] will-change-transform"
                        style={{
                            margin: "-0.5px",
                        }}
                    />
                ))}
            </div>

            {/* Ghost Watermark Number */}
            <div
                ref={watermarkRef}
                className="pointer-events-none absolute right-[-5vw] top-[10%] select-none font-mono text-[22vw] font-black leading-none text-black/[0.03] will-change-transform md:right-[-2vw]"
                aria-hidden="true"
            >
                02
            </div>

            <div className="work-content-inner relative z-10 mx-auto max-w-7xl will-change-transform">
                {/* Header with Masked Split-Word Rise */}
                <div>
                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#111111]" />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40 sm:text-xs">
                            Our Designs                        </span>
                    </div>

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <h2
                            ref={titleHeadingRef}
                            className="max-w-4xl text-4xl font-bold leading-[0.9] tracking-[-0.06em] sm:text-5xl md:text-7xl lg:text-[6rem]"
                        >
                            <span className="inline-block overflow-hidden pb-1">
                                <span className="route-city-word inline-block will-change-transform">
                                    Work
                                </span>
                            </span>{" "}

                            <span className="inline-block overflow-hidden pb-1">
                                <span className="route-city-word inline-block will-change-transform">
                                    made
                                </span>
                            </span>

                            <br />

                            <span className="text-black/30">
                                <span className="inline-block overflow-hidden pb-1">
                                    <span className="route-city-word inline-block will-change-transform">
                                        for
                                    </span>
                                </span>{" "}

                                <span className="inline-block overflow-hidden pb-1">
                                    <span className="route-city-word inline-block will-change-transform">
                                        real
                                    </span>
                                </span>{" "}

                                <span className="inline-block overflow-hidden pb-1">
                                    <span className="route-city-word inline-block will-change-transform">
                                        businesses.
                                    </span>
                                </span>
                            </span>
                        </h2>

                        <p className="max-w-xs text-sm leading-relaxed text-black/50">
                            {isMobile
                                ? "Swipe horizontally or use buttons to explore our portfolio of bespoke websites."
                                : "Hover over the fanned deck of cards to spread open our portfolio of bespoke digital solutions."}
                        </p>
                    </div>
                </div>

                {/* Filter Pills Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-14 flex flex-col gap-4 border-y border-black/10 py-5 sm:flex-row sm:items-center sm:justify-between md:mt-20"
                >
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {categories.map((category) => {
                            const active = activeCategory === category;

                            return (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`relative rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${active
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

                    {/* Desktop Spread Toggle Button */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => setIsForceSpread((prev) => !prev)}
                            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${isForceSpread
                                ? "border-[#111111] bg-[#111111] text-[#f4f0e8]"
                                : "border-black/20 bg-black/5 text-black/70 hover:border-black/40 hover:bg-black/10"
                                }`}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                            {isForceSpread ? "Stacked Deck" : "Spread Deck"}
                        </button>
                    </div>
                </motion.div>

                {/* --- 1. PC / DESKTOP VIEW: React Bits Pro Card Spread Animation --- */}
                <div className="hidden md:block relative mt-8 w-full overflow-visible">
                    {filteredProjects.length > 0 ? (
                        <CardSpread
                            items={filteredProjects}
                            cardWidth={cardDimensions.width}
                            cardHeight={cardDimensions.height}
                            radius={cardDimensions.radius}
                            arc={cardDimensions.arc}
                            closedArc={8}
                            lift={42}
                            push={28}
                            pushReach={2}
                            stiffness={280}
                            damping={24}
                            forceSpread={isForceSpread}
                            spreadOnHover={true}
                            selectedId={selectedProject?.id}
                            onCardClick={(project) => setSelectedProject(project)}
                            renderCard={(project, { index, total, isHovered, isSpread, isActive }) => (
                                <ProjectCard
                                    project={project}
                                    index={index}
                                    total={total}
                                    isHovered={isHovered}
                                    isActive={isActive}
                                />
                            )}
                        />
                    ) : (
                        <div className="py-24 text-center">
                            <p className="text-black/40">Projects coming soon.</p>
                        </div>
                    )}
                </div>

                {/* --- 2. MOBILE VIEW: Previous Curved Swipe Carousel Track --- */}
                <div className="block md:hidden relative mt-8 w-full overflow-visible">
                    {filteredProjects.length > 0 ? (
                        <div
                            ref={mobileContainerRef}
                            className="tilted-carousel-container relative w-full overflow-visible py-8"
                        >
                            <motion.div
                                drag="x"
                                dragConstraints={{
                                    left: (containerWidth / 2) - (mobileCardWidth / 2) - ((filteredProjects.length - 1) * mobileCardStepPx),
                                    right: (containerWidth / 2) - (mobileCardWidth / 2),
                                }}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x < -40 && safeIndex < filteredProjects.length - 1) {
                                        handleNext();
                                    } else if (info.offset.x > 40 && safeIndex > 0) {
                                        handlePrev();
                                    }
                                }}
                                animate={{
                                    x: prefersReducedMotion ? 0 : mobileTrackTranslateX,
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0.34, 1.56, 0.64, 1],
                                }}
                                className="flex items-center gap-5"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredProjects.map((project, index) => {
                                        const offsetFromActive = index - safeIndex;
                                        const arcRotation = prefersReducedMotion
                                            ? 0
                                            : Math.max(-5, Math.min(5, offsetFromActive * 2.5));

                                        const arcY = prefersReducedMotion
                                            ? 0
                                            : Math.pow(Math.abs(offsetFromActive), 1.5) * 8;

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
                                                            scale: 0.92,
                                                            rotate: arcRotation,
                                                            y: arcY + 30,
                                                        }
                                                }
                                                animate={{
                                                    opacity: 1,
                                                    scale: isActive ? 1.02 : 0.98,
                                                    rotate: arcRotation,
                                                    y: arcY,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.85,
                                                    transition: { duration: 0.25 },
                                                }}
                                                transition={{
                                                    duration: 0.45,
                                                    ease: [0.34, 1.56, 0.64, 1],
                                                }}
                                                className="w-[290px] flex-shrink-0"
                                                style={{ height: "390px" }}
                                            >
                                                <ProjectCard
                                                    project={project}
                                                    index={index}
                                                    total={filteredProjects.length}
                                                    isActive={isActive}
                                                    isHovered={isHovered}
                                                    onHoverStart={() => setHoveredCardId(project.id)}
                                                    onHoverEnd={() => setHoveredCardId(null)}
                                                    onClick={() => setCurrentIndex(index)}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>

                            {/* Mobile Carousel Nav Pill Controls */}
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <button
                                    onClick={handlePrev}
                                    disabled={safeIndex === 0}
                                    aria-label="Previous project card"
                                    className={`flex h-10 w-20 items-center justify-center rounded-full border transition-all duration-300 ${safeIndex === 0
                                        ? "cursor-not-allowed border-[#111111]/10 bg-transparent text-[#111111]/20"
                                        : lastNavDirection === "prev"
                                            ? "border-[#111111] bg-[#111111] text-[#f4f0e8] shadow-sm active:scale-95"
                                            : "border-[#111111]/25 bg-transparent text-[#111111] hover:border-[#111111]"
                                        }`}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <span className="font-mono text-xs font-semibold text-black/60">
                                    0{safeIndex + 1} / 0{filteredProjects.length}
                                </span>

                                <button
                                    onClick={handleNext}
                                    disabled={safeIndex >= filteredProjects.length - 1}
                                    aria-label="Next project card"
                                    className={`flex h-10 w-20 items-center justify-center rounded-full border transition-all duration-300 ${safeIndex >= filteredProjects.length - 1
                                        ? "cursor-not-allowed border-[#111111]/10 bg-transparent text-[#111111]/20"
                                        : lastNavDirection === "next"
                                            ? "border-[#111111] bg-[#111111] text-[#f4f0e8] shadow-sm active:scale-95"
                                            : "border-[#111111]/25 bg-transparent text-[#111111] hover:border-[#111111]"
                                        }`}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-black/40">Projects coming soon.</p>
                        </div>
                    )}
                </div>

                {/* Bottom Footer Info */}
                <div className="mt-8 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] text-black/40">
                        Showing {filteredProjects.length} {filteredProjects.length === 1 ? "Project" : "Projects"}
                    </p>

                    <p className="text-xs sm:text-sm text-black/50">
                        {isMobile
                            ? "Swipe or tap buttons to navigate through projects"
                            : "Hover over cards to fan open the deck • Click any card to view details"}
                    </p>
                </div>
            </div>
        </section>
    );
}