"use client";

import { motion } from "framer-motion";

const industries = [
    "Gyms",
    "Cafés",
    "Hotels",
    "Salons",
    "Restaurants",
    "Homestays",
];

const services = [
    {
        number: "01",
        title: "Website Design",
        description:
            "Clean, modern designs built around your business and your customers.",
    },
    {
        number: "02",
        title: "Responsive Development",
        description:
            "Websites that look and work beautifully across phones, tablets and desktops.",
    },
    {
        number: "03",
        title: "UI / UX",
        description:
            "Simple and intuitive experiences that make it easy for visitors to take action.",
    },
    {
        number: "04",
        title: "Launch & Support",
        description:
            "From domain and deployment to updates and ongoing improvements.",
    },
];

export default function Services() {
    return (
        <section
            id="services"
            className="relative overflow-hidden bg-[#111111] px-5 py-24 text-[#f4f0e8] md:px-10 md:py-32"
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
                        <span className="h-2 w-2 rounded-full bg-[#f4f0e8]" />


                    </div>

                    <h2 className="max-w-4xl text-5xl font-bold leading-[0.9] tracking-[-0.06em] sm:text-6xl md:text-8xl lg:text-[7rem]">
                        Websites built
                        <br />
                        <span className="text-[#f4f0e8]/25">
                            around your business.
                        </span>
                    </h2>
                </motion.div>

                {/* Industries */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="mt-20 border-t border-[#f4f0e8]/10 pt-8 md:mt-28"
                >
                    <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-[#f4f0e8]">
                                Who we build for
                            </p>

                            <p className="mt-1 max-w-md text-sm text-[#f4f0e8]/40">
                                From local businesses to growing brands, we create websites
                                tailored to different industries.
                            </p>
                        </div>


                    </div>

                    {/* Industry pills */}
                    <div className="flex flex-wrap gap-3">
                        {industries.map((industry, index) => (
                            <motion.button
                                key={industry}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.06,
                                }}
                                className="group rounded-full border border-[#f4f0e8]/20 px-5 py-2.5 text-sm text-[#f4f0e8]/70 transition-all duration-300 hover:border-[#f4f0e8] hover:bg-[#f4f0e8] hover:text-[#111111]"
                            >
                                {industry}


                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Services list */}
                <div className="mt-20 border-t border-[#f4f0e8]/10 md:mt-28">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.number}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.08,
                            }}
                            className="group grid border-b border-[#f4f0e8]/10 py-7 md:grid-cols-[80px_1fr_1fr] md:items-center md:gap-10 md:py-9"
                        >
                            {/* Number */}
                            <span className="mb-3 text-xs text-[#f4f0e8]/30 md:mb-0">
                                {service.number}
                            </span>

                            {/* Title */}
                            <h3 className="text-2xl font-medium tracking-[-0.04em] transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
                                {service.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#f4f0e8]/40 md:mt-0 md:justify-self-end">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom statement */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-16 flex items-center justify-between md:mt-20"
                >
                    <p className="max-w-xl text-sm leading-relaxed text-[#f4f0e8]/40 md:text-base">
                        Don't see your industry? That's okay. We design around the
                        business, not a template.
                    </p>

                    <motion.a
                        href="#work"
                        whileHover={{ x: 5 }}
                        className="hidden text-sm font-medium text-[#f4f0e8] md:block"
                    >
                        Explore our work ↗
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}