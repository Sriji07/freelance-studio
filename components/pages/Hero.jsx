"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
//import OptionWheel from "@/components/ui/OptionWheel";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//import Card from "@/components/Card";
//import reviews from "@/data/reviews";



const wheelItems = [
    "Web Design",
    "UI / UX",
    "Brand Identity",
    "Creative Development",
    "Landing Pages",
    "Responsive Design",
    "Digital Experiences",
    "E-Commerce",
];

export default function Hero() {
    const prefersReducedMotion = useReducedMotion();
    const heroRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const line3BlockRef = useRef(null);
    const line3TextRef = useRef(null);
    const buttonsRef = useRef(null);
    const statsRef = useRef(null);

    // Mouse parallax tracking ref

    // 1. GSAP Hero Text Reveal & ScrollTrigger Setup
    useEffect(() => {
        if (typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (prefersReducedMotion) {
                // Reduced motion fallback: simple fade in
                gsap.set([line1Ref.current, line2Ref.current, line3TextRef.current, line3BlockRef.current, buttonsRef.current, statsRef.current], {
                    opacity: 1,
                    y: 0,
                    scaleX: 1,
                });
                return;
            }

            // Initial states (Hidden behind masks until intro reveals the page)
            gsap.set([line1Ref.current, line2Ref.current, line3TextRef.current], {
                yPercent: 100,
                opacity: 0,
            });
            gsap.set(line3BlockRef.current, {
                scaleX: 0,
                transformOrigin: "left center",
            });
            gsap.set([buttonsRef.current, statsRef.current], {
                opacity: 0,
                y: 20,
            });

            // Master Hero Entry Animation function (Runs on initial reveal & on DIVE back-to-top)
            const playHeroReveal = (isBackToTop = false) => {
                const tl = gsap.timeline({ defaults: { ease: isBackToTop ? "back.out(1.4)" : "expo.out" } });

                if (isBackToTop) {
                    // Reset elements quickly for snappy pop-in
                    gsap.set([line1Ref.current, line2Ref.current, line3TextRef.current], {
                        yPercent: 80,
                        opacity: 0,
                    });
                    gsap.set(line3BlockRef.current, {
                        scaleX: 0,
                        transformOrigin: "left center",
                    });
                    gsap.set(buttonsRef.current, {
                        opacity: 0,
                        y: 18,
                        scale: 0.96,
                    });
                }

                // 1. Line 1 "WE BUILD" (duration 0.75s)
                tl.to(line1Ref.current, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.75,
                }, 0.05);

                // 2. Line 2 "WEBSITES" (staggered 100ms)
                tl.to(line2Ref.current, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.75,
                }, 0.15);

                // 3. Black background block behind "FOR BUSINESS." scaleX 0 -> 1 (200ms before text reveals)
                tl.to(line3BlockRef.current, {
                    scaleX: 1,
                    duration: 0.6,
                    ease: "expo.out",
                }, 0.2);

                // 4. Line 3 "FOR BUSINESS." text reveals (staggered after block)
                tl.to(line3TextRef.current, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.75,
                }, 0.38);

                // 5. Buttons and stats pop in with slight spring
                tl.to([buttonsRef.current, statsRef.current], {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.1,
                    duration: 0.65,
                    ease: "back.out(1.2)",
                }, 0.55);
            };

            // Listen for initial intro reveal completion
            let initialPlayed = false;
            const handleInitialReveal = () => {
                if (initialPlayed) return;
                initialPlayed = true;
                playHeroReveal(false);
            };
            window.addEventListener("intro-reveal-complete", handleInitialReveal);

            // Listen for DIVE logo click (back-to-top transition)
            const handleBackToTopPop = () => {
                // Play snappy popping animation after smooth scroll reaches top
                setTimeout(() => {
                    playHeroReveal(true);
                }, 350);
            };
            window.addEventListener("trigger-velvet-top", handleBackToTopPop);

            // Safety timeout: ensure initial animation plays after 2.5s even if event was missed
            const timer = setTimeout(handleInitialReveal, 2500);

            // ScrollTrigger subtle hero dock/fade
            ScrollTrigger.create({
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    if (heroRef.current) {
                        gsap.set(heroRef.current.querySelector(".hero-content-inner"), {
                            y: progress * -50,
                            opacity: 1 - progress * 0.4,
                        });
                    }
                },
            });

            return () => {
                window.removeEventListener("intro-reveal-complete", playHeroReveal);
                clearTimeout(timer);
            };
        }, heroRef);

        return () => ctx.revert();
    }, [prefersReducedMotion]);

    return (
        <section
            ref={heroRef}
            id="about"
            className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#f4f0e8] px-5 pb-8 pt-20 sm:pt-24 md:px-10 md:pb-10 md:pt-28"
        >
            {/* =====================================================
                RIGHT-SIDE AUTO-ROTATING OPTION WHEEL
            ====================================================== */}
            {/* <div
                className="pointer-events-auto absolute right-[10px] top-1/2 z-10 hidden h-[900px] w-[900px] -translate-y-1/2 md:block lg:right-[0px] lg:h-[980px] lg:w-[980px]"
                aria-label="Client testimonials"
            >
                <OptionWheel
                    items={reviews}
                    renderItem={(review, index, isActive) => (
                        <Card
                            review={review}
                            index={index}
                            isActive={isActive}
                        />
                    )}
                    defaultSelected={0}
                    side="right"
                    textColor="#111111"
                    activeColor="#111111"

                    fontSize={1}
                    spacing={1}

                    curve={2.0}
                    tilt={9}

                    blur={1.2}
                    fade={0.16}
                    minOpacity={0.1}

                    smoothing={300}

                    inset={150}
                    itemHeight={170}

                    loop={true}
                    draggable={true}
                    autoRotate={true}
                    autoRotateInterval={3000}

                    className="font-serif"
                />
            </div> */}

            {/* =====================================================
                MAIN CONTENT (Optimized to fit viewport gracefully)
            ====================================================== */}
            <div className="hero-content-inner relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center will-change-transform">

                {/* =================================================
                    1. HERO TEXT REVEAL (Wrapped in overflow-hidden, clip/mask translateY 100%->0%, expo.out)
                ================================================== */}
                <h1 className="relative max-w-5xl text-[11vw] font-bold leading-[0.9] tracking-[-0.05em] text-[#111111] sm:text-[8vw] md:text-[5.5vw] lg:text-[4.8rem]">

                    {/* Line 1: WE BUILD */}
                    <span className="block overflow-hidden py-0.5">
                        <span ref={line1Ref} className="inline-block will-change-transform">
                            WE BUILD
                        </span>
                    </span>

                    {/* Line 2: WEBSITES */}
                    <span className="block overflow-hidden py-0.5">
                        <span ref={line2Ref} className="inline-block will-change-transform">
                            WEBSITES
                        </span>
                    </span>

                    {/* Line 3: FOR BUSINESS. (with scaleX 0->1 black block 200ms before text) */}
                    <span className="relative inline-block overflow-hidden mt-1 px-3 py-1 sm:px-3.5 sm:py-1 -mx-3 sm:-mx-3.5">
                        {/* Black background accent block with FLIP shared morph hook */}
                        <span
                            ref={line3BlockRef}
                            className="hero-morph-target pointer-events-none absolute inset-0 z-0 bg-[#111111] will-change-transform rounded-[4px]"
                            aria-hidden="true"
                        />

                        {/* Masked text reveal layer */}
                        <span
                            ref={line3TextRef}
                            className="relative z-10 inline-block text-[#f4f0e8] will-change-transform"
                        >
                            FOR BUSINESS.
                        </span>
                    </span>
                </h1>

                {/* =================================================
                    4. BUTTON HOVER INTERACTIONS
                    - Primary: White panel sweeps left->right (scaleX 0->1), text turns black, scales 1.03
                    - Secondary: Outline to black fill, scales 1.03
                ================================================== */}
                <div
                    ref={buttonsRef}
                    className="relative z-20 mt-8 flex flex-wrap items-center gap-3 md:mt-10"
                >
                    {/* Primary Button */}
                    <a
                        href="#work"
                        onClick={(e) => {
                            e.preventDefault();
                            const workSection = document.getElementById("work");
                            if (workSection) {
                                workSection.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        className="btn-primary-sweep px-6 py-3 text-xs sm:text-sm font-medium cursor-pointer"
                    >
                        <span className="btn-text-content inline-flex items-center gap-2">
                            <span>View Our Work</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                                ↗
                            </span>
                        </span>
                    </a>

                    {/* Secondary Button */}
                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            const contactSection = document.getElementById("contact");
                            if (contactSection) {
                                contactSection.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        className="btn-secondary-outline px-6 py-3 text-xs sm:text-sm font-medium cursor-pointer"
                    >
                        <span>Let's Talk</span>
                    </a>
                </div>
            </div>

            {/* =================================================
                BOTTOM INFORMATION / STATS
            ================================================== */}
            <div
                ref={statsRef}
                className="relative z-10 mx-auto w-full max-w-7xl border-t border-[#111111]/10 pt-4 mt-6"
            >
                <div className="flex items-center justify-between">
                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-6">
                        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#111111]/50 sm:text-xs">
                            02 Developers
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[#111111]/20" />

                        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#111111]/50 sm:text-xs">
                            Delve into design.
                        </span>

                        <span className="hidden h-1 w-1 rounded-full bg-[#111111]/20 sm:block" />

                        <span className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-[#111111]/50 sm:block sm:text-xs">
                            Experience the immersive
                        </span>
                    </div>

                    {/* Scroll */}
                    <a
                        href="#services"
                        onClick={(e) => {
                            e.preventDefault();
                            const servicesSection = document.getElementById("services");
                            if (servicesSection) {
                                servicesSection.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#111111]/50 transition-colors hover:text-[#111111] md:flex cursor-pointer"
                    >
                        <span>Scroll</span>
                        <span className="animate-bounce">↓</span>
                    </a>
                </div>
            </div>
        </section>
    );
}