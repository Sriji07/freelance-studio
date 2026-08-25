import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Contact from "@/components/Contacts";
import DotMatrixSection from "@/components/DotMatrixSection";
import VelvetMorphSection from "@/components/VelvetMorphSection";
import FullscreenVerticalBlinds from "@/components/FullscreenVerticalBlinds";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Fullscreen Venetian Blinds Wipe between Hero (Section 1) and Services (Section 2) */}
        <FullscreenVerticalBlinds
          childrenHero={<Hero />}
          childrenServices={<Services />}
        />

        {/* Velvet Morph: Dark -> Cream (#f4f0e8) */}
        <VelvetMorphSection fromColor="#111111" toColor="#f4f0e8" invert={true} />

        {/* 3. Work (#f4f0e8 cream) */}
        <Work />

        {/* Velvet Morph: Cream -> Dark (#111111) */}
        <VelvetMorphSection fromColor="#f4f0e8" toColor="#111111" />

        {/* 4. Contact (#111111 dark) */}
        <Contact />

        {/* 5. Dot Matrix Stage */}
        <DotMatrixSection />
      </main>

      <Footer />
    </>
  );
}
