"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import gsap from "gsap";

const navItems = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const prefersReducedMotion = useReducedMotion();
    const [menuOpen, setMenuOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const [scrolledPastHero, setScrolledPastHero] = useState(false);
    const lastScrollY = useRef(0);
    const navItemsRef = useRef([]);
    const logoRef = useRef(null);

    // Scroll state tracking
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Background blur / solid styling once scrolled past 80px
            setScrolledPastHero(currentScrollY > 80);

            // Hide on scroll-down, show on scroll-up
            if (currentScrollY > 150) {
                if (currentScrollY > lastScrollY.current + 8) {
                    setVisible(false); // scrolling down
                } else if (currentScrollY < lastScrollY.current - 8) {
                    setVisible(true); // scrolling up
                }
            } else {
                setVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 1. & 5. Nav Entrance animation (fade in + translateY -10px -> 0, staggered 60ms after hero text finishes ~1.0s)
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (prefersReducedMotion) {
            gsap.set([logoRef.current, ...navItemsRef.current], {
                opacity: 1,
                y: 0,
            });
            return;
        }

        gsap.set([logoRef.current, ...navItemsRef.current], {
            opacity: 0,
            y: -10,
        });

        // Starts after hero text reveals (~1.0s delay)
        gsap.to([logoRef.current, ...navItemsRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.06,
            delay: 0.95,
            ease: "expo.out",
        });
    }, [prefersReducedMotion]);

    return (
        <>
            {/* Navbar Header */}
            <header
                className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${visible ? "translate-y-0" : "-translate-y-full"
                    } ${scrolledPastHero
                        ? "border-b border-black/10 bg-[#f4f0e8]/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                        : "border-b border-transparent bg-transparent"
                    }`}
            >
                <nav className="mx-auto flex min-h-[76px] max-w-[1400px] items-center justify-between px-5 py-3 md:min-h-[90px] md:px-10 lg:px-12">

                    {/* Logo & Slogan */}
                    <a
                        ref={logoRef}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent("trigger-velvet-top"));
                        }}
                        className="relative z-50 flex items-center gap-1.5 cursor-pointer p-0"
                    >
                        <img
                            src="/images/logo1.png"
                            alt="DIVE logo"
                            className="h-15 w-25 object-contain sm:h-12 sm:w-24 md:h-16 md:w-32"
                        />

                        {/* <div className="flex flex-col justify-center p-0">
                            <p className="mt-0 text-[8px] font-semibold uppercase tracking-[0.12em] text-black/60 sm:text-[9px] md:text-[10px]">
                                Delve into design.
                            </p>
                            <p className="mt-0 text-[8px] font-semibold uppercase tracking-[0.12em] text-black/60 sm:text-[9px] md:text-[10px]">
                                Experience the immersive
                            </p>
                        </div> */}
                    </a>

                    {/* Desktop Navigation with 5. GSAP/CSS Nav Link 2px Underline scaleX 0->1 */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navItems.map((item, index) => (
                            <a
                                key={item.name}
                                ref={(el) => (navItemsRef.current[index] = el)}
                                href={item.href}
                                data-transition="corner-curtain"
                                onClick={(e) => {
                                    if (typeof window !== "undefined" && window.triggerCornerTransition) {
                                        e.preventDefault();
                                        window.triggerCornerTransition(item.href, item.name);
                                    }
                                }}
                                className="nav-link-item group relative py-1 text-xl font-medium text-black/70 transition-colors duration-300 hover:text-black cursor-pointer"
                            >
                                <span>{item.name}</span>

                                {/* 5. 2px Black Underline with origin-left and scaleX 0->1 */}
                                <span
                                    className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full bg-black scale-x-0 origin-left transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-x-100 will-change-transform"
                                    aria-hidden="true"
                                />
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="relative z-50 flex h-9 w-9 items-center justify-center md:hidden"
                        aria-label="Toggle menu"
                    >
                        <div className="flex w-6 flex-col gap-1.5">
                            <motion.span
                                animate={{
                                    rotate: menuOpen ? 45 : 0,
                                    y: menuOpen ? 4 : 0,
                                    backgroundColor: menuOpen ? "#f4f0e8" : "#111111",
                                }}
                                transition={{ duration: 0.25 }}
                                className="block h-[1.5px] w-full bg-black"
                            />

                            <motion.span
                                animate={{
                                    rotate: menuOpen ? -45 : 0,
                                    y: menuOpen ? -1 : 0,
                                    backgroundColor: menuOpen ? "#f4f0e8" : "#111111",
                                }}
                                transition={{ duration: 0.25 }}
                                className="block h-[1.5px] w-full bg-black"
                            />
                        </div>
                    </button>
                </nav>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="fixed inset-0 z-40 flex flex-col justify-center bg-black px-6 text-[#f4f0e8] md:hidden"
                    >
                        <div className="flex flex-col gap-5">
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    onClick={(e) => {
                                        setMenuOpen(false);
                                        if (typeof window !== "undefined" && window.triggerCornerTransition) {
                                            e.preventDefault();
                                            window.triggerCornerTransition(item.href, item.name);
                                        }
                                    }}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: index * 0.07,
                                        duration: 0.4,
                                    }}
                                    className="text-5xl font-bold tracking-[-0.06em] cursor-pointer"
                                >
                                    {item.name}
                                </motion.a>
                            ))}
                        </div>

                        {/* Mobile footer */}
                        <div className="absolute bottom-8 left-6 right-6 flex justify-between text-xs uppercase tracking-[0.2em] text-white/40">
                            <span>Dive</span>
                            <span>2026</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}