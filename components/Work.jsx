"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import projects from "@/data/projects";
import ProjectCard from "./ProjectCard";

const categories = [
    "All",
    "Gyms",
    "Cafés",
    "Hotels",
    "Salons",
    "Restaurants",
    "Homestays",
];

export default function Work() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredProjects =
        activeCategory === "All"
            ? projects
            : projects.filter(
                (project) => project.category === activeCategory
            );

    return (
        <section
            id="work"
            className="relative overflow-hidden bg-[#f4f0e8] px-5 py-24 md:px-10 md:py-32"
        >
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#111111]" />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40 sm:text-xs">
                            02 — Selected Work
                        </span>
                    </div>

                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        <h2 className="max-w-4xl text-5xl font-bold leading-[0.9] tracking-[-0.06em] sm:text-6xl md:text-8xl lg:text-[7rem]">
                            Work made
                            <br />
                            <span className="text-black/20">
                                for real businesses.
                            </span>
                        </h2>

                        <p className="max-w-xs text-sm leading-relaxed text-black/50">
                            Explore some of the websites we've designed for different
                            businesses and industries.
                        </p>
                    </div>
                </motion.div>

                {/* Category selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-16 border-y border-black/10 py-5 md:mt-24"
                >
                    {/* Desktop */}
                    <div className="hidden flex-wrap gap-2 md:flex">
                        {categories.map((category) => {
                            const active = activeCategory === category;

                            return (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`rounded-full px-5 py-2.5 text-sm transition-all duration-300 ${active
                                            ? "bg-[#111111] text-[#f4f0e8]"
                                            : "border border-black/10 text-black/50 hover:border-black/30 hover:text-black"
                                        }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">
                        <label
                            htmlFor="industry"
                            className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-black/40"
                        >
                            Explore by industry
                        </label>

                        <select
                            id="industry"
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                            className="w-full appearance-none border border-black/15 bg-transparent px-4 py-3 text-sm text-black outline-none"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Projects */}
                <motion.div
                    layout
                    className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty state */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-24 text-center"
                    >
                        <p className="text-black/40">
                            Projects coming soon.
                        </p>
                    </motion.div>
                )}

                {/* Bottom */}
                <div className="mt-20 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] text-black/30">
                        {filteredProjects.length}{" "}
                        {filteredProjects.length === 1 ? "Project" : "Projects"}
                    </p>

                    <p className="text-sm text-black/40">
                        More work coming soon.
                    </p>
                </div>
            </div>
        </section>
    );
}