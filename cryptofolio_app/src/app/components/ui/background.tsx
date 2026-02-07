"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
      <div className="absolute inset-0 bg-background/90" />
      <GlowingOrbs />
      <GridPattern />
      <ShootingStars />
    </div>
  );
};

const GridPattern = () => {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_0%)] opacity-20" />
  );
};

const GlowingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Orb 1 - Top Left (Cyan/Blue) */}
      <motion.div
        className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/20 blur-[100px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Orb 2 - Bottom Right (Purple/Pink) */}
      <motion.div
        className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut", 
          delay: 2
        }}
      />

       {/* Orb 3 - Middle (Green/Emerald) */}
       <motion.div
        className="absolute top-[30%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/10 blur-[90px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 20, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
    </div>
  );
};

const ShootingStars = () => {
    // Generate star data only on the client to avoid hydration mismatch
    const [stars, setStars] = useState<{ id: number; top: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        const starCount = 6;
        const newStars = Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            top: Math.random() * 100, // Random vertical position
            delay: Math.random() * 10, // Random start delay
            duration: Math.random() * 3 + 2, // Random duration between 2-5s
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute left-0 h-[1px] w-[100px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0"
                    style={{ top: `${star.top}%` }}
                    animate={{
                        x: ["-10vw", "110vw"], // Move from left to far right
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
};
