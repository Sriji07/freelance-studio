"use client";

import { motion } from "framer-motion";

export default function Card({ review, index, isActive }) {
    return (
        <motion.article
            animate={{
                scale: isActive ? 1 : 0.88,
                opacity: isActive ? 1 : 0.72,
            }}
            transition={{
                duration: 0.3,
                ease: "easeOut",
            }}
            className="w-[300px] bg-transparent p-3.5 sm:w-[330px] md:w-[360px]"
        >
            {/* Top */}
            <div className="mb-3 flex items-start justify-between">
                <span className="font-serif text-2xl leading-none text-[#142316]/40">
                    “
                </span>
            </div>

            {/* Review */}
            <p className="text-[15px] leading-[1.45] text-[#142316]/80">
                {review.quote}
            </p>

            {/* Client */}
            <div className="mt-4 pt-3">
                <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-[#142316]">
                    {review.name}
                </p>

                <p className="mt-0.5 text-[8px] uppercase tracking-[0.1em] text-[#142316]/50">
                    {review.role}
                </p>
            </div>
        </motion.article>
    );
}