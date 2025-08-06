'use client';
import React from "react";
import { motion } from "framer-motion";
import GradientText from "@/src/blocks/TextAnimations/GradientText/GradientText";
import Aurora from "@/src/blocks/Backgrounds/Aurora/Aurora";
import SplitText from "@/src/blocks/TextAnimations/SplitText/SplitText";
import { ChevronDown, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";
import UploadSection from "@/components/UploadSection";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground transition-colors overflow-x-hidden">
      {/* Theme Toggle - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      {/* Backgrounds */}
      {resolvedTheme === "dark" && (
        <div className="absolute top-0 left-0 w-full pointer-events-none">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={2}
            amplitude={1}
            speed={1.5}
          />
        </div>
      )}
      {resolvedTheme === "light" && (
        <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-0"></div>
      )}
      {/* Landing Content */}
      <section className="flex flex-1 flex-col items-center justify-center w-full px-4 py-12 sm:py-24 min-h-screen overflow-visible">
      <div className="flex flex-col items-center justify-center w-full min-w-[320px] sm:min-w-[400px] h-full overflow-visible">
      <div className="flex flex-col">
        {/* QuickScribe animated text */}
        <SplitText
            text="QuickScribe"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-left leading-tight whitespace-nowrap"
            delay={20}
            duration={1.5}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 400 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="left"
          />
        
        {/* Tagline below QuickScribe */}
        <GradientText
          colors={["#4079ff", "oklch(70.4% 0.14 182.503)",  "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          showBorder={false}
          className="text-xl opacity-80 -mt-0 text-center self-center whitespace-nowrap"
        >
          Elevating Your Subtitles Through Intelligent Automation.
        </GradientText>
      </div>
      
      {/* CTA Button */}
      <motion.div className="mt-12 mb-8">
        <motion.button
          onClick={scrollToUpload}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: 1.5, 
            duration: 0.5
          }}
        >
          Get Started
          <ArrowDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </div>
      </section>
      
      {/* Upload Section */}
      <UploadSection />
      
      {/* Footer */}
      <footer className="w-full py-4 flex justify-center">
        <p className="text-muted-foreground text-sm text-center">
          Powered by{' '}
          <span className="font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            QuickScribe
          </span>
        </p>
      </footer>
    </main>
  );
} 