"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const contactOptions = [
    {
        label: "Email",
        value: "hello@dive.design",
        href: "mailto:hello@dive.design",
    },
    {
        label: "WhatsApp",
        value: "Chat with us",
        href: "#",
    },
    {
        label: "Instagram",
        value: "@dive.design",
        href: "#",
    },
];

const FULL_TEXT = "Have a business";

export default function Contact() {
    const prefersReducedMotion = useReducedMotion();
    const headingRef = useRef(null);
    const isInView = useInView(headingRef, { once: true, amount: 0.3 });
    
    // Typewriter state
    const [typedText, setTypedText] = useState(prefersReducedMotion ? FULL_TEXT : "");
    const [typingComplete, setTypingComplete] = useState(Boolean(prefersReducedMotion));

    useEffect(() => {
        if (prefersReducedMotion || !isInView) {
            if (prefersReducedMotion) {
                setTypedText(FULL_TEXT);
                setTypingComplete(true);
            }
            return;
        }

        let charIndex = 0;
        setTypedText("");
        setTypingComplete(false);

        // Typing interval (smooth mechanical cadence ~65ms per char)
        const interval = setInterval(() => {
            charIndex += 1;
            setTypedText(FULL_TEXT.slice(0, charIndex));

            if (charIndex >= FULL_TEXT.length) {
                clearInterval(interval);
                setTypingComplete(true);
            }
        }, 65);

        return () => clearInterval(interval);
    }, [isInView, prefersReducedMotion]);

    return (
        <section
            id="contact"
            className="relative overflow-hidden bg-[#111111] px-5 py-24 text-[#f4f0e8] md:px-10 md:py-32"
        >
            {/* Decorative circle */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full border border-[#f4f0e8]/10 md:-right-20 md:h-[30rem] md:w-[30rem]"
            />

            <div className="relative z-10 mx-auto max-w-7xl">

                {/* Section heading */}
                <div ref={headingRef}>
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#f4f0e8]" />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f4f0e8]/40 sm:text-xs">
                            03 — Get In Touch
                        </span>
                    </div>

                    <h2 className="max-w-5xl text-5xl font-bold leading-[0.9] tracking-[-0.06em] sm:text-6xl md:text-8xl lg:text-[8rem]">
                        {/* Typewriter Text */}
                        <span className="inline-block">
                            {typedText}
                        </span>

                        {/* Blinking Question Mark (Dramatic entrance after typing pause, then slow hypnotic pulse) */}
                        {typingComplete && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.7, y: 4 }}
                                animate={{
                                    opacity: [0, 1, 1, 0.2, 1, 1, 0.2, 1],
                                    scale: 1,
                                    y: 0,
                                }}
                                transition={{
                                    opacity: {
                                        duration: 2.4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        times: [0, 0.15, 0.35, 0.5, 0.65, 0.8, 0.9, 1],
                                        delay: 0.15,
                                    },
                                    scale: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 },
                                    y: { duration: 0.45, ease: "easeOut", delay: 0.15 },
                                }}
                                className="inline-block text-[#f4f0e8] will-change-[opacity,transform]"
                            >
                                ?
                            </motion.span>
                        )}

                        <br />
                        {/* Subtext: Slow, heavy, cinematic drift into place with extra breathing room */}
                        <motion.span 
                            initial={{ opacity: 0, y: 32 }}
                            animate={typingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                            transition={{ 
                                duration: 1.2, 
                                ease: [0.16, 1, 0.3, 1], // Smooth cinematic expo-out curve
                                delay: 0.65 // Gives the user time to register the question mark
                            }}
                            className="inline-block text-[#f4f0e8]/25 will-change-[opacity,transform]"
                        >
                            Let's build its website.
                        </motion.span>
                    </h2>
                </div>

                {/* Content */}
                <div className="mt-16 grid gap-16 border-t border-[#f4f0e8]/10 pt-10 md:mt-24 md:grid-cols-[1fr_1.2fr] md:gap-20">

                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <p className="max-w-md text-base leading-relaxed text-[#f4f0e8]/50 md:text-lg">
                            Whether you're opening a café, running a gym, managing a
                            homestay or growing a local business, we'd love to hear about
                            it.
                        </p>

                        {/* Contact options */}
                        <div className="mt-10 border-t border-[#f4f0e8]/10">
                            {contactOptions.map((option) => (
                                <a
                                    key={option.label}
                                    href={option.href}
                                    className="group flex items-center justify-between border-b border-[#f4f0e8]/10 py-5"
                                >
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#f4f0e8]/30">
                                            {option.label}
                                        </p>

                                        <p className="mt-1 text-sm text-[#f4f0e8]/70 transition-colors group-hover:text-[#f4f0e8]">
                                            {option.value}
                                        </p>
                                    </div>

                                    <span className="text-[#f4f0e8]/30 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#f4f0e8]">
                                        ↗
                                    </span>
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="space-y-7"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        {/* Name */}
                        <div className="group">
                            <label
                                htmlFor="name"
                                className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#f4f0e8]/30"
                            >
                                Your Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                className="w-full border-b border-[#f4f0e8]/15 bg-transparent py-3 text-base text-[#f4f0e8] outline-none placeholder:text-[#f4f0e8]/20 focus:border-[#f4f0e8] transition-colors"
                            />
                        </div>

                        {/* Business */}
                        <div>
                            <label
                                htmlFor="business"
                                className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#f4f0e8]/30"
                            >
                                Business
                            </label>

                            <input
                                id="business"
                                type="text"
                                className="w-full border-b border-[#f4f0e8]/15 bg-transparent py-3 text-base text-[#f4f0e8] outline-none placeholder:text-[#f4f0e8]/20 focus:border-[#f4f0e8] transition-colors"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#f4f0e8]/30"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                className="w-full border-b border-[#f4f0e8]/15 bg-transparent py-3 text-base text-[#f4f0e8] outline-none placeholder:text-[#f4f0e8]/20 focus:border-[#f4f0e8] transition-colors"
                            />
                        </div>

                        {/* Industry */}
                        <div>
                            <label
                                htmlFor="industry"
                                className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#f4f0e8]/30"
                            >
                                Business Type
                            </label>

                            <select
                                id="industry"
                                defaultValue=""
                                className="w-full border-b border-[#f4f0e8]/15 bg-[#111111] py-3 text-base text-[#f4f0e8]/70 outline-none focus:border-[#f4f0e8]"
                            >
                                <option value="" disabled>
                                    Select an industry
                                </option>
                                <option value="gym">Gym / Fitness</option>
                                <option value="cafe">Café</option>
                                <option value="hotel">Hotel</option>
                                <option value="salon">Salon</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="homestay">Homestay</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Message */}
                        <div>
                            <label
                                htmlFor="message"
                                className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#f4f0e8]/30"
                            >
                                Tell us about your project
                            </label>

                            <textarea
                                id="message"
                                rows="3"
                                className="w-full resize-none border-b border-[#f4f0e8]/15 bg-transparent py-3 text-base text-[#f4f0e8] outline-none placeholder:text-[#f4f0e8]/20 focus:border-[#f4f0e8] transition-colors"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="group mt-3 inline-flex items-center gap-3 rounded-full bg-[#f4f0e8] px-7 py-3.5 text-sm font-semibold text-[#111111] transition-all duration-300 hover:gap-5"
                        >
                            Send Enquiry

                            <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                ↗
                            </span>
                        </button>
                    </motion.form>
                </div>

            </div>
        </section>
    );
}