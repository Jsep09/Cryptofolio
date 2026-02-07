"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const LandingBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background">
      <div className="absolute inset-0 bg-background/90" />
      <VibrantOrbs />
      <PerspectiveGrid />
      <DiagonalBeams />
    </div>
  );
};

const PerspectiveGrid = () => {
  return (
    <div 
      className="absolute inset-0 bg-[linear-gradient(to_right,#444_1px,transparent_1px),linear-gradient(to_bottom,#444_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_0%)] opacity-10"
      style={{
        transform: "perspective(500px) rotateX(20deg)",
        transformOrigin: "top"
      }}
    />
  );
};

const VibrantOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Orb 1 - Top Center (Neon Lime - Growth) */}
      <motion.div
        className="absolute -top-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-neon-lime/10 blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Orb 2 - Bottom Left (Neon Cyan - Tech) */}
      <motion.div
        className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-neon-cyan/10 blur-[100px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut", 
          delay: 2
        }}
      />

       {/* Orb 3 - Bottom Right (Neon Purple - Future) */}
       <motion.div
        className="absolute -bottom-[20%] -right-[10%] w-[55vw] h-[55vw] rounded-full bg-neon-purple/10 blur-[120px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.5, 0.2],
          x: [0, -50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
    </div>
  );
};

const DiagonalBeams = () => {
    // Generate beam data only on the client
    const [beams, setBeams] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        const count = 8;
        const newBeams = Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // Random horizontal start position
            delay: Math.random() * 5, // Random start delay
            duration: Math.random() * 2 + 3, // Random duration between 3-5s
        }));
        setBeams(newBeams);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {beams.map((beam) => (
                <motion.div
                    key={beam.id}
                    className="absolute -top-20 h-[300px] w-[2px] bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-0"
                    style={{ left: `${beam.left}%`, transform: 'rotate(45deg)' }} // Rotated for diagonal effect (needs container adjustment or just x/y movement)
                    // For true diagonal, we move X and Y. Let's just do vertical rain for "Matrix" crypto feel, or slanted rain.
                    // Let's do Slanted Rain: Start top, move down-right.
                    animate={{
                        top: ["-10%", "120%"],
                        left: [`${beam.left}%`, `${beam.left + 20}%`], // Move diagonal
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: beam.duration,
                        repeat: Infinity,
                        delay: beam.delay,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
};
