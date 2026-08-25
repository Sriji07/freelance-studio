"use client";

import React from "react";
import DotMatrixText from "@/components/ui/dot-text";

export default function DotMatrixDemo() {
  return (
    <div className="relative w-full min-h-[600px] h-screen bg-black flex items-center justify-center overflow-hidden select-none">
      
      {/* 1. Ambient Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* 2. Pure Dot Matrix Typography Stage */}
      <div className="relative z-10 w-full max-w-5xl px-6 h-56 md:h-80 flex items-center justify-center">
        <DotMatrixText
          text={["EaseMize", "Design", "Develop"]}
          transition="fade"
          cycleInterval={3000}
          dotSize={4}
          gap={2.5}
          activeColor="#ffffff"
          inactiveColor="rgba(255, 255, 255, 0.04)"
          showInactive={true}
          className="w-full h-full drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
        />
      </div>

    </div>
  );
}
