"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ParallaxHero() {
  const ref = useRef(null);
  
  // Track scroll progress within the hero section (which we make taller to allow scrolling)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Background Planet Layer: scrolls downwards slowly to recede
  const planetY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const planetOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0]);

  // Midground Ship Layer: transitions from angled orientation to flat profile
  // Approximating the orientation change from image_21 to image_32
  const shipRotateX = useTransform(scrollYProgress, [0, 1], [45, 0]);
  const shipRotateZ = useTransform(scrollYProgress, [0, 1], [-15, 0]);
  const shipScale = useTransform(scrollYProgress, [0, 1], [1.5, 2.2]); // Increased size significantly
  const shipY = useTransform(scrollYProgress, [0, 1], ["20%", "-10%"]); // Moved down initially to avoid early overlap

  // Content fades out as we scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]); // Fades out faster
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div
      ref={ref}
      // Height is 200vh to give enough scroll distance for the transition
      className="relative w-full h-[200vh] bg-black"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center perspective-[1000px]">
        
        {/* Background Layer: Planet and Sunrise */}
        <motion.div
          className="absolute inset-0 z-0 w-full h-full"
          style={{ 
            y: planetY,
            opacity: planetOpacity,
            backgroundImage: "url('/images/planet.png')", // Placeholder for the planet background layer
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}
        >
          {/* Black gradient to blend into the void at the top and bottom */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </motion.div>

        {/* Midground Layer: The Ringed Spaceship (Now z-30 to fly IN FRONT of text) */}
        <motion.div
          className="absolute z-30 w-[800px] h-[400px] flex items-center justify-center pointer-events-none"
          style={{
            y: shipY,
            rotateX: shipRotateX,
            rotateZ: shipRotateZ,
            scale: shipScale,
            transformStyle: "preserve-3d"
          }}
        >
          {/* We use an img tag with the ship layer. User needs to provide a transparent PNG of the ship */}
          <img 
            src="/images/ship.png" 
            alt="Sci-Fi Spaceship" 
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(100,200,255,0.2)]"
          />
        </motion.div>

        {/* Hero Content (Foreground initially, but ship flies past it) */}
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center text-center px-4 pt-12"
          style={{ y: textY, opacity: textOpacity }}
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl mb-4">
            CARTLY
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 max-w-lg mx-auto font-medium shadow-black drop-shadow-lg">
            Prepare for a deep-space burn.
          </p>
          <div className="mt-8 flex gap-4">
          </div>
        </motion.div>

      </div>
    </div>
  );
}
