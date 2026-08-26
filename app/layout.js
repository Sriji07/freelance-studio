import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import TargetCursor from "@/components/TargetCursor";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import GSAPScrollObserver from "@/components/GSAPScrollObserver";
import VelvetMorphOverlay from "@/components/VelvetMorphOverlay";
import SectionMorphController from "@/components/SectionMorphController";
import SplineStarfieldDiveIntro from "@/components/SplineStarfieldDiveIntro";
import Ambient3DDominoBackdrop from "@/components/Ambient3DDominoBackdrop";

export const metadata = {
  title: "Dive — Delve into design. Experience the immersive",
  description:
    "Delve into design. Experience the immersive.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#030712] text-[#f4f0e8] selection:bg-white selection:text-[#030712]">
        <SplineStarfieldDiveIntro>
          <SmoothScrollProvider>
            {/* Monochrome 3D Domino Ring & Starfield Backdrop */}
            <Ambient3DDominoBackdrop />
            {/* Section Morphing Controller */}
            <SectionMorphController />
            {/* Fullscreen Velvet Morph */}
            <VelvetMorphOverlay />
            {/* Global Scroll Observer */}
            <GSAPScrollObserver />
            <ScrollProgressBar />
            <CustomCursor />
            <TargetCursor
              targetSelector=".cursor-target"
              sectionSelector="#services"
              spinDuration={2}
              hideDefaultCursor={false}
              hoverDuration={0.2}
              parallaxOn={true}
              cursorColor="#ffffff"
            />
            {children}
          </SmoothScrollProvider>
        </SplineStarfieldDiveIntro>
      </body>
    </html>
  );
}