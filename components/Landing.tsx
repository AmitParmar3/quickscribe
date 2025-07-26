import { useMemo } from "react";
import SplitText from "@/src/blocks/TextAnimations/SplitText/SplitText";
import GradientText from "@/src/blocks/TextAnimations/GradientText/GradientText";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-w-[320px] sm:min-w-[400px] h-full overflow-x-auto">
      <div className="flex flex-col">
        {/* QuickScribe animated text */}
        {useMemo(() => (
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
        ), [])}
        {/* Tagline below QuickScribe */}
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          showBorder={false}
          className="text-xl opacity-80 mt-0 text-center self-center ml-10 sm:ml-30 whitespace-nowrap"
        >
          Your fastest way to transcribe and summarize files
        </GradientText>
      </div>
    </div>
  );
} 