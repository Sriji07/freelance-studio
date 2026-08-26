import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Contact from "@/components/Contacts";
import DotMatrixSection from "@/components/DotMatrixSection";
import FullscreenVerticalBlinds from "@/components/FullscreenVerticalBlinds";
import StickyStackedWorkToContact from "@/components/StickyStackedWorkToContact";
import FullscreenContactToPhilosophyTransition from "@/components/FullscreenContactToPhilosophyTransition";
import CornerCurtainTransition from "@/components/CornerCurtainTransition";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <CornerCurtainTransition />

      <main className="relative">
        {/* 1. Venetian Blinds Wipe from Hero (#f4f0e8) into Services (#111111) */}
        <FullscreenVerticalBlinds
          childrenHero={<Hero />}
          childrenServices={<Services />}
        />

        {/* 2 & 3. Sticky Stacked Scroll: Work (#f4f0e8 cream) pinned while Contact (#111111 dark) slides up OVER it */}
        <StickyStackedWorkToContact
          childrenWork={<Work />}
          childrenContact={
            <FullscreenContactToPhilosophyTransition
              childrenContact={<Contact />}
              childrenPhilosophy={<DotMatrixSection />}
            />
          }
        />
      </main>

      <Footer />
    </>
  );
}

