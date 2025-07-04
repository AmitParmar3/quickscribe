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
import { useRef, useState } from "react";
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
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [dragActive, setDragActive] = useState<DragActiveState>({
    video: false,
    subtitle: false,
  });
  const videoInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      video: null,
      subtitle: null,
      language: "",
      style: "",
    },
  });

  const handleDrag = (
    e: React.DragEvent<HTMLDivElement>,
    type: FileType
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: FileType
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [type]: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0], type);
    }
  };

  const handleFileSelection = (file: File, type: FileType): void => {
    if (type === "video") {
      if (file.type.startsWith("video/")) {
        setValue("video", file);
      }
    } else if (type === "subtitle") {
      if (file.name.endsWith(".srt") || file.name.endsWith(".txt")) {
        setValue("subtitle", file);
      }
    }
  };

  const removeFile = (type: FileType): void => {
    if (type === "video") {
      setValue("video", null);
      if (videoInputRef.current) videoInputRef.current.value = "";
    } else {
      setValue("subtitle", null);
      if (subtitleInputRef.current) subtitleInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data, "FORMDATA");

    // Continue processing
  };

  const handleUploadClick = (type: FileType): void => {
    if (type === "video") {
      videoInputRef.current?.click();
    } else {
      subtitleInputRef.current?.click();
    }
  };
  const handleProcess = () => {
    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      {/* Theme Toggle - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
            {/* Aurora as background at the very top - Only in dark mode */}
      {mounted && resolvedTheme === "dark" && (
        <div className="absolute top-0 left-0 w-full pointer-events-none">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={2}
            amplitude={1}
            speed={1.5}
          />
        </div>
      )}
      
      {/* Particles background - Only in light mode */}
      {mounted && resolvedTheme === "light" && (
        <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-0">
          
        </div>
      )}
      
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden w-full">
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          <SplitText
            text="QuickScribe"
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-center"
            delay={20}
            duration={1.5}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 400 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="text-xl opacity-80 mb-12"
          >
            Your fastest way to transcribe and summarize files
          </GradientText>
         
          <div className="absolute bottom-10 animate-bounce">
            <span className="text-3xl">↓</span>
          </div>
        </div>
      </section>
      
      <motion.div 
        className="min-h-screen bg-background text-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
      {/* uploading files */}
      <motion.div 
        className="pt-12 pb-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <motion.div 
              className="inline-flex items-center gap-3 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                QuickScribe
              </h1>
            </motion.div>
            <motion.p 
              className="text-foreground/80 text-lg font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
              Transform your videos with seamless subtitle integration
            </motion.p>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="max-w-6xl mx-auto px-6 pb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-xl border border-border/50 p-8 dark:bg-card/30 dark:border-border/30"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}  
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.2 }}
        >
          
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Video Upload */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                  <Video className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Video File
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Upload your video content
                  </p>
                </div>
              </div>

              <div
                className={`group relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive.video
                    ? "border-blue-400 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 scale-[1.02] shadow-lg dark:from-blue-500/20 dark:to-indigo-500/20"
                    : watch("video")
                    ? "border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md dark:from-emerald-500/20 dark:to-teal-500/20"
                    : "border-border hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-indigo-500/5 hover:shadow-md dark:hover:from-blue-500/15 dark:hover:to-indigo-500/15"
                }`}
                onDragEnter={(e) => handleDrag(e, "video")}
                onDragLeave={(e) => handleDrag(e, "video")}
                onDragOver={(e) => handleDrag(e, "video")}
                onDrop={(e) => handleDrop(e, "video")}
                onClick={() => handleUploadClick("video")}
              >
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelection(file, "video");
                  }}
                  className="hidden"
                />

                {watch("video") ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto shadow-lg">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground truncate max-w-xs mx-auto">
                        {watch("video")?.name}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {formatFileSize(watch("video")?.size || 0)}
                      </p>
                    </div>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        removeFile("video");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl mx-auto group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-all duration-300">
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-blue-400 transition-colors duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-foreground font-medium">
                        Drop your video file here, or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports MP4, MOV, AVI, and more formats
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subtitle Upload */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Subtitle File
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Upload your subtitle content
                  </p>
                </div>
              </div>

              <div
                className={`group relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive.subtitle
                    ? "border-indigo-400 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 scale-[1.02] shadow-lg dark:from-indigo-500/20 dark:to-purple-500/20"
                    : watch("subtitle")
                    ? "border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md dark:from-emerald-500/20 dark:to-teal-500/20"
                    : "border-border hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 hover:shadow-md dark:hover:from-indigo-500/15 dark:hover:to-purple-500/15"
                }`}
                onDragEnter={(e) => handleDrag(e, "subtitle")}
                onDragLeave={(e) => handleDrag(e, "subtitle")}
                onDragOver={(e) => handleDrag(e, "subtitle")}
                onDrop={(e) => handleDrop(e, "subtitle")}
                onClick={() => handleUploadClick("subtitle")}
              >
                <input
                  ref={subtitleInputRef}
                  type="file"
                  accept=".srt,.txt"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelection(file, "subtitle");
                  }}
                  className="hidden"
                />

                {watch("subtitle") ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto shadow-lg">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground truncate max-w-xs mx-auto">
                        {watch("subtitle")?.name}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {formatFileSize(watch("subtitle")?.size || 0)}
                      </p>
                    </div>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        removeFile("subtitle");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl mx-auto group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-indigo-400 transition-colors duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-foreground font-medium">
                        Drop your subtitle file here, or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports SRT and TXT file formats
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>    
          <div className="grid sm:grid-cols-2 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                  <LucideLanguages className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Select Language
                  </h2>
                  <p className="text-sm text-muted-foreground mb-">
                    Select your output language
                  </p>
                </div>
              </div>
              <Controller
                control={control}
                name="language"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="language" className={cn("w-full !h-12 mt-4", !field.value ? " ":"border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-300 font-semibold")} >
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                  <Drama className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Select Style
                  </h2>
                  <p className="text-sm text-muted-foreground mb-">
                    Select your desired style
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Controller
                  control={control}
                  name="style"
                  render={({ field }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id = "styles" className={cn("w-full !h-12 mt-4", !field.value ? " ":"border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-300 font-semibold")}>
                          <SelectValue placeholder="Choose a style"/>
                        </SelectTrigger>
                        <SelectContent>
                          {styles.map((style) => (
                            <SelectItem key={style} value={style}>
                              {style}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="text-center space-y-6">
            <button
              onClick={handleProcess}
              disabled={!watch("video") || !watch("subtitle")}
              className={cn(
                "group relative cursor-pointer px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300",
                watch("video") && watch("subtitle")
                  ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40"
                  : "bg-gradient-to-r from-muted to-muted/50 text-muted-foreground cursor-not-allowed dark:from-muted/30 dark:to-muted/20"
              )}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Process Files
                <div
                  className={`w-2 h-2 rounded-full ${
                    watch("video") && watch("subtitle")
                      ? "bg-white animate-pulse"
                      : "bg-muted-foreground"
                  }`}
                ></div>
              </span>
              {watch("video") && watch("subtitle") && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>

            {(!watch("video") || !watch("subtitle")) && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                <p className="text-sm font-medium">
                  Please upload both video and subtitle files to continue
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
              </div>
            )}
          </div>
        </motion.form>

        {isProcessing && (
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Loader2 className="animate-spin w-4 h-4" /> Processing
              Translation...
            </div>
            <div className="w-full h-2 bg-muted rounded">
              <div
                className="h-full bg-green-500 rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-muted-foreground">{progress}% complete</div>
          </div>
        )}

        

      {/* Overlay for Move to Editor button */}
      {!isProcessing && progress === 100 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[2px] dark:bg-black/80">
          <div className="bg-card/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center dark:bg-card/90 dark:border dark:border-border/50">
            <div className="flex items-center gap-2 text-green-400 text-md pt-4">
              <CheckCircle className="w-8 h-8" /> Translation complete!{" "}
            </div>
            <button
              className="group relative px-15 py-5 mt-4 rounded-2xl font-semibold text-lg transition-all duration-100 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
              onClick={() => router.push("/editor")}
            >
              Move to Editor
            </button>
          </div>
        </div>
      )}
      </motion.div>
      {/* Footer */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
        >
          <p className="text-muted-foreground text-sm">
            Powered by{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              QuickScribe
            </span>
          </p>
        </motion.div>
      </motion.div>
    </main>
    
  );
} 