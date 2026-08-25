"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Ambient3DDominoBackdrop
 * Renders the persistent monochrome (black & white starry void) 3D Domino Ring:
 * - 44 Standing 3D white frosted dominos arranged in an orbital ring.
 * - Glowing celestial moon / orb orbiting along the curve.
 * - Continuous slow ambient 3D orbit rotation (resembling Spline 3D scene).
 * - Reacts to user scroll position (expanding/contracting and tilting in 3D perspective as you scroll).
 * - Pure monochrome black & white cosmic starry backdrop (zero blue/colored tints).
 */
export default function Ambient3DDominoBackdrop() {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animFrameRef = useRef(null);
  const scrollOffset = useRef(0);
  const rotationAngle = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track scroll
    const handleScroll = () => {
      scrollOffset.current = window.scrollY || window.pageYOffset || 0;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 1. Monochrome Deep Starfield (Pure White Stars)
    const numStars = 320;
    const stars = Array.from({ length: numStars }, () => ({
      x: (Math.random() - 0.5) * 3000,
      y: (Math.random() - 0.5) * 3000,
      z: Math.random() * 2000,
      size: Math.random() * 1.5 + 0.4,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    // 2. Generate 3D Domino Ring (44 standing rectangular monoliths)
    const numDominos = 44;
    const dominos = [];
    const baseRadiusX = 540;
    const baseRadiusZ = 380;

    for (let i = 0; i < numDominos; i++) {
      const theta = (i / numDominos) * Math.PI * 2;
      dominos.push({
        index: i,
        theta,
        width: 14,
        height: 72,
        depth: 30,
      });
    }

    // 3. Render Loop
    const render = () => {
      // Clear with pure deep black
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // Rotation speeds & scroll reaction
      rotationAngle.current += 0.0035;
      const scrollNorm = Math.min(scrollOffset.current / 1200, 2.5);

      const fov = 480;
      const cx = width / 2;
      // Domino ring shifts and expands down based on scroll
      const cy = height * 0.58 + scrollNorm * 60;
      const tiltAngle = 0.55 + scrollNorm * 0.15; // 3D tilt pitch angle

      // 1. Draw Starfield
      stars.forEach((star) => {
        const sz = (star.z - rotationAngle.current * 80) % 2000;
        const actualZ = sz < 0 ? sz + 2000 : sz;
        if (actualZ > 20) {
          const k = fov / actualZ;
          const sx = star.x * k + cx;
          const sy = star.y * k + cy;

          if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * Math.min(1, actualZ / 250)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, star.size * k * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // 2. Calculate 3D Projected Domino Ring
      const currentRadiusX = baseRadiusX * (1 + scrollNorm * 0.35);
      const currentRadiusZ = baseRadiusZ * (1 + scrollNorm * 0.35);

      const projectedDominos = dominos.map((domino) => {
        const curTheta = domino.theta + rotationAngle.current;

        // 3D coordinates on tilted ellipse
        const worldX = Math.cos(curTheta) * currentRadiusX;
        const worldZ = Math.sin(curTheta) * currentRadiusZ + 600;
        const worldY = Math.sin(curTheta) * (currentRadiusZ * Math.sin(tiltAngle)) - 40;

        return {
          ...domino,
          curTheta,
          worldX,
          worldY,
          worldZ,
        };
      });

      // Sort by depth for painter's algorithm
      projectedDominos.sort((a, b) => b.worldZ - a.worldZ);

      // 3. Draw Celestial Glowing Orb along the curve
      const orbTheta = rotationAngle.current + Math.PI * 0.42;
      const orbWorldX = Math.cos(orbTheta) * (currentRadiusX + 20);
      const orbWorldZ = Math.sin(orbTheta) * currentRadiusZ + 600;
      const orbWorldY = Math.sin(orbTheta) * (currentRadiusZ * Math.sin(tiltAngle)) - 75;

      if (orbWorldZ > 20) {
        const ok = fov / orbWorldZ;
        const ox = orbWorldX * ok + cx;
        const oy = orbWorldY * ok + cy;
        const orbR = 36 * ok;

        // Multi-stage pure white celestial glow
        const glow = ctx.createRadialGradient(ox, oy, orbR * 0.1, ox, oy, orbR * 3.2);
        glow.addColorStop(0, "rgba(255, 255, 255, 1)");
        glow.addColorStop(0.25, "rgba(255, 255, 255, 0.65)");
        glow.addColorStop(0.6, "rgba(255, 255, 255, 0.2)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ox, oy, orbR * 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ox, oy, orbR, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw Standing 3D Dominos
      projectedDominos.forEach((domino) => {
        if (domino.worldZ > 30) {
          const k = fov / domino.worldZ;
          const sx = domino.worldX * k + cx;
          const sy = domino.worldY * k + cy;

          const w = domino.width * k;
          const h = (domino.height + scrollNorm * 15) * k;
          const d = domino.depth * k;

          // Standing rotation angle aligned with the ring curve
          const rot = domino.curTheta + Math.PI / 2;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(Math.sin(rot) * 0.35); // Gentle dynamic orientation

          // Depth shading (brighter when closer to camera)
          const depthShade = Math.max(0.25, Math.min(1, 1.2 - domino.worldZ / 950));

          // Front Face (Clean Monochrome White Gradient)
          const grad = ctx.createLinearGradient(0, -h, 0, 0);
          grad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * depthShade})`);
          grad.addColorStop(1, `rgba(160, 160, 160, ${0.7 * depthShade})`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h, w, h, 2 * k);
          ctx.fill();

          // Top Extrusion Face Highlight
          ctx.fillStyle = `rgba(255, 255, 255, ${0.65 * depthShade})`;
          ctx.beginPath();
          ctx.moveTo(-w / 2, -h);
          ctx.lineTo(-w / 2 + d * 0.45, -h - d * 0.35);
          ctx.lineTo(w / 2 + d * 0.45, -h - d * 0.35);
          ctx.lineTo(w / 2, -h);
          ctx.closePath();
          ctx.fill();

          // Side Extrusion Face
          ctx.fillStyle = `rgba(120, 120, 120, ${0.45 * depthShade})`;
          ctx.beginPath();
          ctx.moveTo(w / 2, -h);
          ctx.lineTo(w / 2 + d * 0.45, -h - d * 0.35);
          ctx.lineTo(w / 2 + d * 0.45, -d * 0.35);
          ctx.lineTo(w / 2, 0);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
