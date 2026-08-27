"use client";

export default function ProjectCard({
    project,
    isActive = false,
    isHovered = false,
    index = 0,
    total = 6,
    onClick,
    onHoverStart,
    onHoverEnd,
    className = "",
}) {
    const categoryDots = {
        Gyms: "bg-[#e85d04]",
        Cafés: "bg-[#b07d62]",
        Hotels: "bg-[#3a86ff]",
        Salons: "bg-[#d90429]",
        Restaurants: "bg-[#fb8500]",
        Homestays: "bg-[#2a9d8f]",
    };

    const dotColor =
        categoryDots[project.category] || "bg-[#111111]";

    const hasLink =
        project.link && project.link !== "#";

    return (
        <a
            href={hasLink ? project.link : undefined}
            target={hasLink ? "_blank" : undefined}
            rel={hasLink ? "noopener noreferrer" : undefined}
            onClick={(e) => {
                e.stopPropagation();

                if (!hasLink && onClick) {
                    e.preventDefault();
                    onClick();
                }
            }}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            data-cursor="card"
            className={`tilted-card group relative flex h-full w-full cursor-pointer select-none flex-col justify-between rounded-[10px] bg-[#ffffff] p-5 transition-all duration-300 sm:p-6 ${isActive
                    ? "border-[2px] border-[#111111] shadow-[0_25px_50px_-12px_rgba(17,17,17,0.22)] ring-2 ring-black/5"
                    : isHovered
                        ? "border-[1.5px] border-[#111111] shadow-[0_20px_40px_-10px_rgba(17,17,17,0.16)]"
                        : "border border-[#111111]/30 shadow-[0_10px_30px_-10px_rgba(17,17,17,0.08)]"
                } ${className}`}
        >
            {/* =====================================================
                TOP CATEGORY
            ===================================================== */}
            <div className="mb-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${dotColor}`}
                    />

                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#111111]/80">
                        {project.category}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#111111]/30" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#111111]/15" />
                </div>
            </div>

            {/* =====================================================
                WEBSITE PREVIEW
            ===================================================== */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] border border-[#111111]/15 bg-[#f5f1e8] transition-colors duration-300 group-hover:border-[#111111]/35">

                {project.image ? (
                    <img
                        src={project.image}
                        alt={`${project.title} website preview`}
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                        draggable="false"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-5 text-center">
                        <div className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-[6px] border border-[#111111]/15 bg-[#ffffff] shadow-sm transition-transform duration-500 group-hover:scale-110">
                            <span className="font-mono text-sm font-bold text-[#111111]">
                                {project.title
                                    ? project.title
                                        .substring(0, 2)
                                        .toUpperCase()
                                    : "WS"}
                            </span>
                        </div>

                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#111111]/50">
                            CASE STUDY
                        </span>

                        <h4 className="mt-1 line-clamp-1 text-base font-semibold tracking-tight text-[#111111]">
                            {project.title}
                        </h4>
                    </div>
                )}

                {/* =================================================
                    HOVER OVERLAY
                ================================================= */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#111111]/20 opacity-0 backdrop-blur-[1px] transition-all duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-4 py-2 text-xs font-medium text-[#f4f0e8] shadow-lg">
                        {hasLink
                            ? "View Website ↗"
                            : "View Case Study ↗"}
                    </span>
                </div>
            </div>

            {/* =====================================================
                BOTTOM METADATA
            ===================================================== */}
            <div className="mt-4">
                <div className="flex items-baseline justify-between">
                    <div>
                        <h3 className="text-base font-bold tracking-[-0.03em] text-[#111111] sm:text-lg">
                            {project.title}
                        </h3>

                        <p className="mt-0.5 text-xs text-[#111111]/55">
                            {project.category} Website
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="font-mono text-xs font-medium text-[#111111]/70">
                            Custom
                        </span>
                    </div>
                </div>

                {/* =================================================
                    BOTTOM INDICATOR
                ================================================= */}
                <div className="mt-3.5 flex items-center justify-between border-t border-[#111111]/10 pt-2.5">
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${isActive || isHovered
                                    ? "bg-[#111111]"
                                    : "bg-[#111111]/25"
                                }`}
                        />

                        <span className="h-1.5 w-1.5 rounded-full bg-[#111111]/15" />

                        <span className="h-1.5 w-1.5 rounded-full bg-[#111111]/15" />
                    </div>

                    <span className="font-mono text-[11px] font-medium text-[#111111]/50">
                        0{index + 1} / 0{total}
                    </span>
                </div>
            </div>
        </a>
    );
}