"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * CornerCurtainTransition Component
 * High-end O Positive agency style full-page transition originating
 * dynamically from the top-right corner with a slanted diagonal clip-path polygon.
 */
export default function CornerCurtainTransition() {
    const router = useRouter();
    const pathname = usePathname();
    const [targetTitle, setTargetTitle] = useState("Philosophy");

    useEffect(() => {
        if (typeof window === "undefined") return;

        const overlay = document.getElementById("page-transition");
        if (!overlay) return;

        const runTransition = (href, title) => {
            if (title) setTargetTitle(title);
            else if (href === "#services" || href?.includes("services")) setTargetTitle("Philosophy & Tailored Architecture");
            else if (href === "#contact" || href?.includes("contact")) setTargetTitle("Get In Touch");
            else if (href === "#work" || href?.includes("work")) setTargetTitle("Selected Work");
            else setTargetTitle("Dive Studio");

            overlay.classList.remove("exit");
            overlay.classList.add("active");

            // After 800ms (diagonal corner-sweep covers full screen), scroll / navigate
            setTimeout(() => {
                if (href.startsWith("#")) {
                    const targetEl = document.querySelector(href);
                    if (targetEl) {
                        if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
                            window.__lenis.scrollTo(targetEl, { immediate: true });
                        } else if (typeof targetEl.scrollIntoView === "function") {
                            targetEl.scrollIntoView({ behavior: "instant" });
                        } else {
                            window.location.hash = href;
                        }
                    } else {
                        window.location.hash = href;
                    }
                } else if (href.startsWith("http") || href.startsWith("/")) {
                    router.push(href);
                }

                // Exit phase: sweep curtain off to bottom-left
                overlay.classList.add("exit");

                setTimeout(() => {
                    overlay.classList.remove("active", "exit");
                }, 800);
            }, 800);
        };

        // Expose globally so buttons/links can trigger directly
        window.triggerCornerTransition = runTransition;

        const handleTransitionClick = (e) => {
            const link = e.target.closest("a[data-transition='corner-curtain'], a.corner-transition-trigger, a[href='#services'], a[href='#contact'], button[data-transition='corner-curtain']");
            if (!link) return;

            const href = link.getAttribute("href") || link.getAttribute("data-target") || "#services";
            const title = link.getAttribute("data-transition-title") || "";

            e.preventDefault();
            e.stopPropagation();

            runTransition(href, title);
        };

        // Capture phase to guarantee interception before other scroll handlers
        window.addEventListener("click", handleTransitionClick, true);

        return () => {
            window.removeEventListener("click", handleTransitionClick, true);
            delete window.triggerCornerTransition;
        };
    }, [router, pathname]);

    return (
        <div
            id="page-transition"
            className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden"
            aria-hidden="true"
        >
            {/* Primary striking brand curtain slice (#ff3333 vibrant red) */}
            <div className="curtain-slice pointer-events-none" />

            {/* Secondary underlying dark curtain slice (#121212) */}
            <div className="curtain-slice-dark pointer-events-none">
                {/* Center Animated Stage Title during coverage */}
                <div className="curtain-text-badge flex h-full w-full flex-col items-center justify-center text-center p-6 select-none">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#f4f0e8]/50 mb-3">
                        DIVE • STUDIO
                    </span>
                    <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f4f0e8] max-w-xl leading-tight">
                        {targetTitle}
                    </h3>
                    <span className="mt-4 inline-block h-1 w-12 rounded-full bg-[#f4f0e8]" />
                </div>
            </div>
        </div>
    );
}
export { CornerCurtainTransition };
