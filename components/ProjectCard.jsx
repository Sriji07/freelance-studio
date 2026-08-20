"use client";

import { motion } from "framer-motion";

export default function ProjectCard({ project }) {
    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="group"
        >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#e8e2d8]">
                <motion.img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.6 }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end justify-between bg-black/0 p-5 transition-all duration-500 group-hover:bg-black/20">
                    <div className="translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="rounded-full bg-[#f4f0e8] px-4 py-2 text-xs font-medium text-[#111111]">
                            View Project ↗
                        </span>
                    </div>
                </div>
            </div>

            {/* Project information */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                            {project.category}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-black/20" />

                        <span className="text-[10px] uppercase tracking-[0.18em] text-black/30">
                            Website
                        </span>
                    </div>

                    <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                        {project.title}
                    </h3>
                </div>

                <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
                    {project.description}
                </p>
            </div>

            {/* Tags */}
            <div className="mt-4 flex gap-2">
                {project.tags.map((tag) => (
                    <span
                        key={tag}
                        className="border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-black/40"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </motion.article>
    );
}