"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const badgeRef = useRef(null);
    const mousePos = useRef({ x: -100, y: -100 });
    const dotPos = useRef({ x: -100, y: -100 });
    const ringPos = useRef({ x: -100, y: -100 });
    const badgePos = useRef({ x: -100, y: -100 });

    const stateRef = useRef({
        visible: false,
        hoverLink: false,
        hoverCard: false,
        hoverText: false,
        isClicked: false,
    });

    useEffect(() => {
        // Detect touch devices
        const isTouchDevice =
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia("(pointer: coarse)").matches;

        // Detect reduced motion preferences
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (isTouchDevice || prefersReducedMotion) {
            return;
        }

        const dot = dotRef.current;
        const ring = ringRef.current;
        const badge = badgeRef.current;
        if (!dot || !ring || !badge) return;

        let rafId;

        // Scope detection helper: active only in Hero (#about) and Portfolio/Work (#work)
        const isScoped = (target) => {
            if (!target) return false;
            return Boolean(
                target.closest && (target.closest("#about") || target.closest("#work"))
            );
        };

        // Cache magnetic buttons
        const getMagneticButtons = () => {
            return Array.from(
                document.querySelectorAll(
                    '[data-magnetic="true"], a[href="#work"], a[href="#contact"], .magnetic-btn'
                )
            );
        };

        let magneticButtons = getMagneticButtons();

        // Mouse movement listener (updates coordinates throttled through RAF)
        const onMouseMove = (e) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;

            const target = e.target;
            const inScope = isScoped(target);
            stateRef.current.visible = inScope;

            if (!inScope) {
                stateRef.current.hoverLink = false;
                stateRef.current.hoverCard = false;
                stateRef.current.hoverText = false;
                // Reset any active magnetic buttons
                magneticButtons.forEach((btn) => {
                    if (btn.style.transform && btn.style.transform !== "translate3d(0px, 0px, 0px)") {
                        btn.style.transform = "translate3d(0px, 0px, 0px)";
                    }
                });
                return;
            }

            // Detect project / portfolio cards
            const card = target.closest(
                '[data-cursor="card"], article, .project-card'
            );
            const isCard = Boolean(card && isScoped(card));

            // Detect links / buttons / interactive controls
            const link = target.closest(
                'a, button, [role="button"], input, select, textarea, [data-cursor="pointer"]'
            );
            const isLink = Boolean(link && !isCard);

            // Detect text / body copy
            const textElem = target.closest(
                'p, span, h1, h2, h3, h4, h5, h6, [data-cursor="text"]'
            );
            const isText = Boolean(textElem && !isLink && !isCard);

            stateRef.current.hoverCard = isCard;
            stateRef.current.hoverLink = isLink;
            stateRef.current.hoverText = isText;

            // Primary CTA Magnetic effect (within 80px, max offset ~15px)
            magneticButtons.forEach((btn) => {
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

                if (dist < 80) {
                    const deltaX = e.clientX - centerX;
                    const deltaY = e.clientY - centerY;
                    const shiftX = (deltaX / 80) * 15;
                    const shiftY = (deltaY / 80) * 15;
                    btn.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
                } else if (btn.style.transform && btn.style.transform !== "translate3d(0px, 0px, 0px)") {
                    btn.style.transform = "translate3d(0px, 0px, 0px)";
                }
            });
        };

        const onMouseDown = () => {
            stateRef.current.isClicked = true;
        };

        const onMouseUp = () => {
            stateRef.current.isClicked = false;
        };

        const onMouseLeaveDoc = () => {
            stateRef.current.visible = false;
            magneticButtons.forEach((btn) => {
                btn.style.transform = "translate3d(0px, 0px, 0px)";
            });
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        document.documentElement.addEventListener("mouseleave", onMouseLeaveDoc);

        let initialized = false;
        const lerp = (start, end, factor) => start + (end - start) * factor;

        // Scroll velocity detection for motion blur cursor stretch
        let scrollVelocity = 0;
        let lastScrollY = window.scrollY;
        let scrollTimeout = null;

        const onScroll = () => {
            const currentY = window.scrollY;
            const deltaY = currentY - lastScrollY;
            scrollVelocity = deltaY;
            lastScrollY = currentY;

            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                scrollVelocity = 0;
            }, 120);
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        // High performance 60fps RAF loop
        const render = () => {
            const { visible, hoverLink, hoverCard, hoverText, isClicked } =
                stateRef.current;

            const targetX = mousePos.current.x;
            const targetY = mousePos.current.y;

            if (!initialized && targetX > 0) {
                dotPos.current.x = targetX;
                dotPos.current.y = targetY;
                ringPos.current.x = targetX;
                ringPos.current.y = targetY;
                badgePos.current.x = targetX;
                badgePos.current.y = targetY;
                initialized = true;
            }

            // Decay scroll velocity smoothly
            scrollVelocity *= 0.88;

            // Dot moves instantly with mouse
            dotPos.current.x = targetX;
            dotPos.current.y = targetY;

            // Ring and Badge trail behind with lerp factor 0.15
            ringPos.current.x = lerp(ringPos.current.x, targetX, 0.15);
            ringPos.current.y = lerp(ringPos.current.y, targetY, 0.15);
            badgePos.current.x = lerp(badgePos.current.x, targetX, 0.15);
            badgePos.current.y = lerp(badgePos.current.y, targetY, 0.15);

            // --- Update Dot (8px) ---
            if (dot) {
                const dotOpacity = visible && !hoverCard ? 1 : 0;
                const dotScale = hoverLink ? 0.7 : hoverText ? 1.2 : 1;
                dot.style.opacity = dotOpacity;
                dot.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0) scale(${dotScale})`;
            }

            // --- Update Ring with Scroll-Velocity Stretch ---
            if (ring) {
                const ringOpacity = visible && !hoverCard && !hoverText ? 1 : 0;
                let ringScale = 1;
                if (hoverLink) {
                    ringScale = 1.5;
                }
                if (isClicked) {
                    ringScale *= 0.8;
                }

                // Calculate vertical stretch factor based on scroll velocity (motion blur feel)
                const absVel = Math.abs(scrollVelocity);
                const stretchY = Math.min(1.7, 1 + absVel * 0.015);
                const compressX = Math.max(0.7, 1 - absVel * 0.008);

                ring.style.opacity = ringOpacity;
                ring.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0) scale(${ringScale * compressX}, ${ringScale * stretchY})`;

                if (hoverLink) {
                    ring.style.backgroundColor = "rgba(255, 255, 255, 0.18)";
                    ring.style.borderColor = "rgba(255, 255, 255, 0.8)";
                } else {
                    ring.style.backgroundColor = "transparent";
                    ring.style.borderColor = "rgba(255, 255, 255, 0.95)";
                }
            }

            // --- Update Project Card "View" Pill Badge ---
            if (badge) {
                const badgeOpacity = visible && hoverCard ? 1 : 0;
                const badgeScale = visible && hoverCard ? (isClicked ? 0.88 : 1) : 0;
                badge.style.opacity = badgeOpacity;
                badge.style.transform = `translate3d(${badgePos.current.x - 38}px, ${badgePos.current.y - 18}px, 0) scale(${badgeScale})`;
            }

            rafId = requestAnimationFrame(render);
        };

        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            document.documentElement.removeEventListener("mouseleave", onMouseLeaveDoc);
        };
    }, []);

    return (
        <>
            {/* Small dot (8px) */}
            <div
                ref={dotRef}
                aria-hidden="true"
                className="pointer-events-none fixed left-0 top-0 z-[99999] h-2 w-2 rounded-full bg-white transition-opacity duration-150"
                style={{
                    mixBlendMode: "difference",
                    willChange: "transform, opacity",
                    opacity: 0,
                }}
            />

            {/* Larger trailing ring (40px, 1.5px border) with cubic-bezier bounce */}
            <div
                ref={ringRef}
                aria-hidden="true"
                className="pointer-events-none fixed left-0 top-0 z-[99998] h-10 w-10 rounded-full border-[1.5px] border-white transition-[border-color,background-color,transform] duration-200"
                style={{
                    mixBlendMode: "difference",
                    willChange: "transform, opacity",
                    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    opacity: 0,
                }}
            />

            {/* Pill-shaped View label badge */}
            <div
                ref={badgeRef}
                aria-hidden="true"
                className="pointer-events-none fixed left-0 top-0 z-[99999] flex h-9 items-center justify-center rounded-full bg-white px-4 text-[11px] font-bold uppercase tracking-wider text-black shadow-lg transition-[transform,opacity] duration-200"
                style={{
                    mixBlendMode: "difference",
                    willChange: "transform, opacity",
                    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    opacity: 0,
                }}
            >
                <span>View ↗</span>
            </div>
        </>
    );
}
