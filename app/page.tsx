'use client';
import React from "react";
import { motion, useInView } from "framer-motion";
import GradientText from "@/src/blocks/TextAnimations/GradientText/GradientText";
import Aurora from "@/src/blocks/Backgrounds/Aurora/Aurora";
import SplitText from "@/src/blocks/TextAnimations/SplitText/SplitText";
import AnimatedContent from '@/src/blocks/Animations/AnimatedContent/AnimatedContent';
const text = "QuickScribe";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Upload,
  Video,
  FileText,
  X,
  Check,
  Sparkles,
  LucideLanguages,
  Drama,
  Loader2,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";


interface DragActiveState {
  video: boolean;
  subtitle: boolean;
}

type FileType = "video" | "subtitle";

type FormData = {
  video: File | null;
  subtitle: File | null;
  language: string;
  style: string;
};

const styles = [
  "Sad",
  "Royal",
  "GenZ comedy",
  "Comedic",
  "Funny",
  "Millennial",
  "Custom",
];

const languages = [
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Korean",
];

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground transition-colors">
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
      <section className="flex flex-1 flex-col items-center justify-center w-full px-4 py-12 sm:py-24">
      <div className="flex flex-col items-center justify-center w-full min-w-[320px] sm:min-w-[400px] h-full overflow-x-auto">
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
    </div>
      </section>
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