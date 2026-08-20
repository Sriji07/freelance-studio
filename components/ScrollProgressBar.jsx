"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (docHeight > 0) {
                const scrolled = (scrollTop / docHeight) * 100;
                setProgress(Math.min(100, Math.max(0, scrolled)));
            }
        };

        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();

        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div 
            className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none bg-transparent"
            aria-hidden="true"
        >
            <div 
                className="h-full bg-[#111111] transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
