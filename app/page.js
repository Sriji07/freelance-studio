import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Contact from "@/components/Contacts";
import DotMatrixSection from "@/components/DotMatrixSection";
import FullscreenVerticalBlinds from "@/components/FullscreenVerticalBlinds";
import FullscreenServicesToWorkTransition from "@/components/FullscreenServicesToWorkTransition";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden">
        {/* 1. Venetian Blinds Wipe from Hero (#f4f0e8) into Services (#111111) */}
        <FullscreenVerticalBlinds
          childrenHero={<Hero />}
          childrenServices={<Services />}
        />

        {/* 2. Work Section (#f4f0e8 cream) */}
        <Work />

        {/* 3. Contact (#111111 dark) */}
        <Contact />

        {/* 4. Dot Matrix Stage */}
        <DotMatrixSection />
      </main>

      <Footer />
    </>
  );
}
