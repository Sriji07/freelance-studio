"use client";

import { motion } from "framer-motion";

const footerLinks = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Contact", href: "#contact" },
];

export default function Footer() {
    return (
        <footer className="bg-[#111111] px-5 pb-6 pt-16 text-[#f4f0e8] md:px-10 md:pt-20">
            <div className="mx-auto max-w-7xl">

                {/* Main footer */}
                <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">

                    {/* Brand */}
                    <div>
                        <motion.a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.dispatchEvent(new CustomEvent("trigger-velvet-top"));
                            }}
                            whileHover={{ x: 4 }}
                            className="inline-block text-3xl font-bold tracking-[-0.06em] md:text-4xl cursor-pointer"
                        >
                            DIVE<span className="text-[#f4f0e8]/30">.</span>
                        </motion.a>

                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f4f0e8]/40">
                            Delve into design. Experience the immersive.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <p className="mb-5 text-[10px] uppercase tracking-[0.2em] text-[#f4f0e8]/30">
                            Explore
                        </p>

                        <nav className="flex flex-wrap gap-x-6 gap-y-3 md:gap-x-8">
                            {footerLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    data-transition="corner-curtain"
                                    onClick={(e) => {
                                        if (typeof window !== "undefined" && window.triggerCornerTransition) {
                                            e.preventDefault();
                                            window.triggerCornerTransition(link.href, link.name);
                                        }
                                    }}
                                    className="group relative text-sm text-[#f4f0e8]/70 transition-colors duration-300 hover:text-[#f4f0e8] cursor-pointer"
                                >
                                    {link.name}

                                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#f4f0e8] transition-all duration-300 group-hover:w-full" />
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Social */}
                    <div>
                        <p className="mb-5 text-[10px] uppercase tracking-[0.2em] text-[#f4f0e8]/30">
                            Connect
                        </p>

                        <div className="flex gap-5">
                            <a
                                href="#"
                                className="text-sm text-[#f4f0e8]/70 transition-colors hover:text-[#f4f0e8]"
                            >
                                Instagram ↗
                            </a>

                            <a
                                href="#"
                                className="text-sm text-[#f4f0e8]/70 transition-colors hover:text-[#f4f0e8]"
                            >
                                WhatsApp ↗
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="mt-16 flex flex-col gap-3 border-t border-[#f4f0e8]/10 pt-5 text-[9px] uppercase tracking-[0.18em] text-[#f4f0e8]/25 sm:flex-row sm:items-center sm:justify-between">
                    <span>© 2026 Dive. All rights reserved.</span>

                    <button
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                        className="group flex items-center gap-2 text-left transition-colors hover:text-[#f4f0e8]/60"
                    >
                        Back to top

                        <span className="transition-transform duration-300 group-hover:-translate-y-1">
                            ↑
                        </span>
                    </button>
                </div>
            </div>
        </footer>
    );
}