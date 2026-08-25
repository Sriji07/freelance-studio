"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GSAPScrollObserver() {
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (typeof window === "undefined" || prefersReducedMotion) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Find all elements marked for section reveal: headings, descriptions, cards, containers
            const revealContainers = document.querySelectorAll("[data-gsap-reveal-container]");
            
            revealContainers.forEach((container) => {
                const children = container.querySelectorAll("[data-gsap-reveal-item]");
                if (children.length > 0) {
                    gsap.fromTo(
                        children,
                        {
                            opacity: 0,
                            y: 30,
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.9,
                            stagger: 0.1, // Stagger children by 100ms
                            ease: "cubic-bezier(0.16, 1, 0.3, 1)",
                            scrollTrigger: {
                                trigger: container,
                                start: "top 85%",
                                toggleActions: "play none none none", // Play once, no reverse on scroll up
                                once: true,
                            },
                        }
                    );
                }
            });

            // Single standalone reveal items
            const singleItems = document.querySelectorAll("[data-gsap-reveal-single]");
            singleItems.forEach((el) => {
                gsap.fromTo(
                    el,
                    {
                        opacity: 0,
                        y: 30,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none none",
                            once: true,
                        },
                    }
                );
            });
        });

        return () => ctx.revert();
    }, [prefersReducedMotion]);

    return null;
}
