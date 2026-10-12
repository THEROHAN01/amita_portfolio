import { GazeEngine } from "@/components/avatar/GazeEngine";
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { MobileHome } from "@/components/mobile/MobileHome";
import { Splash } from "@/components/splash/Splash";
import { AboutView } from "@/components/views/about/AboutView";
import { ContactView } from "@/components/views/contact/ContactView";
import { WorkView } from "@/components/views/work/WorkView";
import { layers } from "@/content/canvas";

/** Everything on this route is known at build time — keep it that way. */
export const ensureStatic = "navigation";

export default function Home() {
  return (
    <main>
      <GazeEngine />
      <CanvasApp layers={layers} views={{ work: <WorkView />, about: <AboutView />, contact: <ContactView /> }}>
        <Splash />
      </CanvasApp>
      <MobileHome />
    </main>
  );
}
