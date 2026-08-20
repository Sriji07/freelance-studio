"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {/* Navbar */}
            <header className="fixed left-0 top-0 z-50 w-full border-b border-black/10 bg-[#f4f0e8]/75 backdrop-blur-xl backdrop-saturate-150">
                <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:h-[82px] md:px-10 lg:px-12">

                    {/* Logo */}
                    <a
                        href="#about"
                        className="relative z-50 text-lg font-bold tracking-[-0.05em] md:text-4xl"
                    >
                        STUDIO<span className="opacity-30">.</span>
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
                            <span>Independent Studio</span>
                            <span>2026</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}