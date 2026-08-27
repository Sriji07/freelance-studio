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
        <footer className="bg-transparent px-5 pb-6 pt-10 text-[#f4f0e8] md:px-10 md:pt-12">

            <div className="mx-auto max-w-7xl">

                {/* Main Footer */}
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

                    {/* Brand */}
                    <div>
                        <motion.a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();

                                window.dispatchEvent(
                                    new CustomEvent("trigger-velvet-top")
                                );
                            }}
                            whileHover={{ x: 4 }}
                            className="inline-block cursor-pointer"
                        >
                            <img
                                src="/images/logo.png"
                                alt="DIVE"
                                draggable="false"
                                className="h-auto w-24 md:w-32"
                            />
                        </motion.a>

                        <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#f4f0e8]/65">
                            Delve into design. Experience the immersive.
                        </p>
                    </div>


                    {/* Navigation — hidden on mobile */}
                    <nav className="hidden flex-wrap gap-x-6 gap-y-3 md:flex md:gap-x-8">
                        {footerLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                data-transition="corner-curtain"
                                onClick={(e) => {
                                    if (
                                        typeof window !== "undefined" &&
                                        window.triggerCornerTransition
                                    ) {
                                        e.preventDefault();

                                        window.triggerCornerTransition(
                                            link.href,
                                            link.name
                                        );
                                    }
                                }}
                                className="group relative cursor-pointer text-xs text-[#f4f0e8]/75 transition-colors duration-300 hover:text-[#f4f0e8]"
                            >
                                {link.name}

                                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#f4f0e8] transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                    </nav>


                    {/* Social — hidden on mobile */}
                    <div className="hidden gap-5 md:flex">
                        <a
                            href="#"
                            className="text-xs text-[#f4f0e8]/75 transition-colors duration-300 hover:text-[#f4f0e8]"
                        >
                            Instagram ↗
                        </a>

                        <a
                            href="#"
                            className="text-xs text-[#f4f0e8]/75 transition-colors duration-300 hover:text-[#f4f0e8]"
                        >
                            WhatsApp ↗
                        </a>
                    </div>

                </div>


                {/* Bottom Bar */}
                <div className="mt-8 flex flex-col gap-3 border-t border-[#f4f0e8]/15 pt-4 text-[8px] uppercase tracking-[0.18em] text-[#f4f0e8]/50 sm:flex-row sm:items-center sm:justify-between">

                    <span>
                        © 2026 DIVE. All rights reserved.
                    </span>

                    <button
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                        className="group flex items-center gap-2 text-left text-[#f4f0e8]/50 transition-colors hover:text-[#f4f0e8]"
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