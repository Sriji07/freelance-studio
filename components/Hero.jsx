"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
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
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const line3Ref = useRef(null);
    const line3BlockRef = useRef(null);
    const line3TextRef = useRef(null);
    const circleGraphicRef = useRef(null);
    const cardsContainerRef = useRef(null);
    const buttonsRef = useRef(null);
    const statsRef = useRef(null);

    // Mouse parallax tracking ref
    const mousePos = useRef({ x: 0, y: 0 });
    const targetPos = useRef({ x: 0, y: 0 });
    const currentPos = useRef({ x: 0, y: 0 });
    const rafId = useRef(null);

    // 1. GSAP Hero Text Reveal & ScrollTrigger Setup
    useEffect(() => {
        if (typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (prefersReducedMotion) {
                // Reduced motion fallback: simple fade in
                gsap.set([line1Ref.current, line2Ref.current, line3TextRef.current, line3BlockRef.current, cardsContainerRef.current, buttonsRef.current, statsRef.current], {
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
            gsap.set([cardsContainerRef.current, buttonsRef.current, statsRef.current], {
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
                    gsap.set([cardsContainerRef.current, buttonsRef.current], {
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

                // 5. Team cards, Buttons and stats pop in with slight spring
                tl.to(cardsContainerRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "back.out(1.2)",
                }, 0.55);

                tl.to([buttonsRef.current, statsRef.current], {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.1,
                    duration: 0.65,
                    ease: "back.out(1.2)",
                }, 0.7);
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

            // 2. Continuous 90s slow rotation on circle graphic
            if (circleGraphicRef.current) {
                gsap.to(circleGraphicRef.current, {
                    rotation: 360,
                    duration: 90,
                    ease: "none",
                    repeat: -1,
                });
            }

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

    // 2. Mouse Parallax on Background Circle Graphic (Damping factor ~0.05, max 15px)
    useEffect(() => {
        if (prefersReducedMotion || typeof window === "undefined") return;

        const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
            const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

            targetPos.current = {
                x: x * 15,
                y: y * 15,
            };
        };

        const updateParallax = () => {
            // Lerp smoothing (damping ~0.05)
            currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.05;
            currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.05;

            if (circleGraphicRef.current) {
                gsap.set(circleGraphicRef.current, {
                    x: currentPos.current.x,
                    y: currentPos.current.y,
                });
            }

            rafId.current = requestAnimationFrame(updateParallax);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        rafId.current = requestAnimationFrame(updateParallax);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [prefersReducedMotion]);

    return (
        <section
            ref={heroRef}
            id="about"
            className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#f4f0e8] px-5 pb-8 pt-20 sm:pt-24 md:px-10 md:pb-10 md:pt-28"
        >
            {/* =====================================================
                2. AMBIENT BACKGROUND MOTION (Continuous 90s rotation + Smooth 15px lerped mouse parallax)
            ====================================================== */}
            <div
                ref={circleGraphicRef}
                className="pointer-events-none absolute right-[-140px] top-[12%] z-0 h-[380px] w-[380px] md:right-[-100px] md:top-[10%] md:h-[540px] md:w-[540px] will-change-transform opacity-80"
                aria-hidden="true"
            >
                {/* Static/smooth outer ring */}
                <div className="absolute inset-0 rounded-full border border-black/[0.07]" />

                {/* Dashed concentric arc ring */}
                <div className="absolute inset-[30px] rounded-full border border-dashed border-black/[0.08] md:inset-[45px]" />

                {/* Inner ambient accent ring */}
                <div className="absolute inset-[70px] rounded-full border border-black/[0.04] md:inset-[95px]" />
            </div>

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
                    6. TEAM CARDS (Hover: translateY -4px, avatar scale 1.05, soft shadow 0 20px 40px)
                ================================================== */}
                <div ref={cardsContainerRef} className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-8 md:gap-6 max-w-4xl">
                    {freelancers.map((person) => (
                        <div
                            key={person.name}
                            className="team-card rounded-xl border border-[#111111]/10 bg-transparent p-4 sm:p-5 transition-all duration-300"
                        >
                            {/* Profile */}
                            <div className="flex items-center gap-3">
                                {/* Photo */}
                                <div className="team-avatar h-11 w-11 shrink-0 overflow-hidden rounded-full bg-black/10">
                                    <img
                                        src={person.image}
                                        alt={person.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Name + role */}
                                <div>
                                    <h3 className="text-sm font-semibold tracking-[-0.02em] text-[#111111] sm:text-base">
                                        {person.name}
                                    </h3>

                                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#111111]/50 font-mono">
                                        {person.role}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="mt-2.5 text-xs leading-relaxed text-[#111111]/70">
                                {person.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* =================================================
                    4. BUTTON HOVER INTERACTIONS
                    - Primary: White panel sweeps left->right (scaleX 0->1), text turns black, scales 1.03
                    - Secondary: Outline to black fill, scales 1.03
                ================================================== */}
                <div
                    ref={buttonsRef}
                    className="relative z-20 mt-6 flex flex-wrap items-center gap-3 md:mt-8"
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
                            02 Designers
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[#111111]/20" />

                        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#111111]/50 sm:text-xs">
                            Multiple Industries
                        </span>

                        <span className="hidden h-1 w-1 rounded-full bg-[#111111]/20 sm:block" />

                        <span className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-[#111111]/50 sm:block sm:text-xs">
                            Built With Purpose
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