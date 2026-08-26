"use client";

import React, { useState, useRef, useId, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * CardSpread Component (React Bits Pro specification)
 * A fanned deck of cards that spreads open on hover with spring physics,
 * neighbor push mechanics, and individual card lift.
 */
export default function CardSpread({
    children,
    items,
    renderCard,
    className,
    cardWidth = 320,
    cardHeight = 440,
    radius = 850,
    arc = 36,
    closedArc = 8,
    lift = 38,
    push = 24,
    pushReach = 2,
    stiffness = 260,
    damping = 22,
    mass = 0.8,
    interactive = true,
    spreadOnHover = true,
    forceSpread = false,
    onActiveChange,
    selectedId = null,
    onCardClick,
}) {
    const [isHoveredDeck, setIsHoveredDeck] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const containerRef = useRef(null);
    const uniqueId = useId();

    const cardList = items || React.Children.toArray(children);
    const total = cardList.length;
    const isSpread = forceSpread || (spreadOnHover && isHoveredDeck);

    // Calculate angle and position for each card in the fan
    const getCardTransform = (index) => {
        if (total === 0) return { rotate: 0, x: 0, y: 0, scale: 1, zIndex: 1 };

        const centerIndex = (total - 1) / 2;
        const offsetFromCenter = index - centerIndex;

        // Spread angle interpolation
        const currentArc = isSpread ? arc : closedArc;
        const stepAngle = total > 1 ? currentArc / (total - 1) : 0;
        let baseAngle = offsetFromCenter * stepAngle;

        // Natural circular arc vertical dip (formula: r - sqrt(r^2 - x^2) or approximated parabola)
        const spreadSpacing = isSpread ? cardWidth * 0.72 : cardWidth * 0.12;
        let baseX = offsetFromCenter * spreadSpacing;
        let baseY = Math.abs(offsetFromCenter) * (isSpread ? 14 : 4);

        // Circular curvature y-offset
        const arcY = (Math.pow(baseX, 2) / (2 * radius));
        baseY += arcY;

        let cardLift = 0;
        let extraScale = 1;
        let extraZIndex = index;

        // Neighbor Push & Hover Lift calculation
        if (hoveredIndex !== null && isSpread) {
            const dist = index - hoveredIndex;
            const absDist = Math.abs(dist);

            if (dist === 0) {
                // Currently hovered card
                cardLift = lift;
                extraScale = 1.05;
                extraZIndex = 50;
                baseAngle = baseAngle * 0.4; // Straightens up slightly when inspected
            } else if (absDist <= pushReach) {
                // Neighboring cards pushed away
                const factor = (pushReach - absDist + 1) / pushReach;
                const pushDirection = dist > 0 ? 1 : -1;
                baseX += pushDirection * push * factor;
                baseAngle += pushDirection * (4 * factor);
            }
        }

        // Lift moves card along its upward angle
        const angleRad = (baseAngle * Math.PI) / 180;
        const finalX = baseX - Math.sin(angleRad) * cardLift;
        const finalY = baseY - Math.cos(angleRad) * cardLift;

        return {
            rotate: baseAngle,
            x: finalX,
            y: finalY,
            scale: extraScale,
            zIndex: extraZIndex,
        };
    };

    return (
        <div
            ref={containerRef}
            onMouseEnter={() => interactive && setIsHoveredDeck(true)}
            onMouseLeave={() => {
                if (interactive) {
                    setIsHoveredDeck(false);
                    setHoveredIndex(null);
                }
            }}
            className={cn(
                "relative flex w-full items-center justify-center py-20 select-none",
                className
            )}
            style={{
                minHeight: cardHeight + 160,
                perspective: "1200px",
            }}
        >
            {/* Center origin deck container */}
            <div className="relative flex items-center justify-center">
                {cardList.map((item, index) => {
                    const transform = getCardTransform(index);
                    const isHovered = hoveredIndex === index;
                    const isItemActive = selectedId !== null && (item.id === selectedId || index === selectedId);

                    return (
                        <motion.div
                            key={item.id || item.key || `${uniqueId}-${index}`}
                            layout
                            initial={false}
                            animate={{
                                rotate: transform.rotate,
                                x: transform.x,
                                y: transform.y,
                                scale: transform.scale,
                                zIndex: transform.zIndex,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: stiffness,
                                damping: damping,
                                mass: mass,
                            }}
                            onMouseEnter={() => {
                                if (interactive) {
                                    setHoveredIndex(index);
                                    if (onActiveChange) onActiveChange(index, item);
                                }
                            }}
                            onMouseLeave={() => {
                                if (interactive && hoveredIndex === index) {
                                    setHoveredIndex(null);
                                }
                            }}
                            onClick={() => {
                                if (onCardClick) onCardClick(item, index);
                            }}
                            style={{
                                width: cardWidth,
                                height: cardHeight,
                                position: index === 0 ? "relative" : "absolute",
                                top: 0,
                                left: 0,
                                transformOrigin: "50% 120%",
                            }}
                            className={cn(
                                "group cursor-pointer transition-shadow duration-300 will-change-transform",
                                isHovered && "drop-shadow-2xl"
                            )}
                        >
                            {renderCard ? (
                                renderCard(item, {
                                    index,
                                    total,
                                    isHovered,
                                    isSpread,
                                    isActive: isItemActive,
                                })
                            ) : typeof item === "function" ? (
                                item({ index, total, isHovered, isSpread })
                            ) : (
                                item
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
export { CardSpread };
