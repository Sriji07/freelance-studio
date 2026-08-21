"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const [scrolledPastHero, setScrolledPastHero] = useState(false);
    const lastScrollY = useRef(0);

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

    return (
        <>
            {/* Navbar */}
            <header 
                className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
                    visible ? "translate-y-0" : "-translate-y-full"
                } ${
                    scrolledPastHero 
                        ? "border-b border-black/10 bg-[#f4f0e8]/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]" 
                        : "border-b border-transparent bg-transparent"
                }`}
            >
                <nav className="mx-auto flex min-h-[76px] max-w-[1400px] items-center justify-between px-5 py-3 md:min-h-[90px] md:px-10 lg:px-12">

                    {/* Logo & Slogan */}
                    <a
                        href="#about"
                        className="relative z-50 flex flex-col justify-center"
                    >
                        <span className="text-2xl font-black leading-none tracking-[-0.06em] sm:text-3xl md:text-5xl">
                            DIVE<span className="opacity-30">.</span>
                        </span>
                        <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-black/60 sm:text-[10px] md:text-[11px]">
                            Delve into design. Experience the immersive
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="group relative text-xl font-medium text-black/70 transition-colors duration-300 hover:text-black"
                            >
                                {item.name}

                                <span className="absolute -bottom-1 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
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
                                }}
                                transition={{ duration: 0.25 }}
                                className="block h-[1.5px] w-full bg-black"
                            />

                            <motion.span
                                animate={{
                                    rotate: menuOpen ? -45 : 0,
                                    y: menuOpen ? -1 : 0,
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
                                    onClick={() => setMenuOpen(false)}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: index * 0.07,
                                        duration: 0.4,
                                    }}
                                    className="text-5xl font-bold tracking-[-0.06em]"
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