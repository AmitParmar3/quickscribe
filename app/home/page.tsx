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
import { useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";
import SubtitleOnlyForm from "../subonly/page";

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
  const [mode, setMode] = useState<'translate' | 'editor'>('translate');

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
    <main className="relative min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      {/* Theme Toggle - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      {/* Backgrounds */}
      {mounted && resolvedTheme === "light" && (
        <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-0"></div>
      )}
      {/* Two-column layout */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full h-screen gap-0">
        {/* Left: QuickScribe branding */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 gap-8">
          {/* Branding */}
          {/* Translate Section */}
          <div className="w-full flex flex-col items-center mb-6 ">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent tracking-wider mb-2">TRANSLATE</div>
            <div className="text-lg max-w-xl mx-auto text-muted-foreground text-center mb-3">
              This tool helps you translate subtitles into your language of choice, while making sure the tone and style of the subtitles are preserved.
            </div>
            <button className="w-32 h-10 shadow-md shadow-black/40 bg-blue-500/90 hover:bg-blue-600 text-white font-semibold text-base rounded-full shadow transition-all duration-200">Go</button>
          </div>
          {/* Speaker Section */}
          <div className="w-full flex flex-col items-center mb-6 ">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wider mb-2">SPEAKER</div>
            <div className="text-lg max-w-xl mx-auto text-muted-foreground text-center mb-3">
              This tool helps you assign speakers to your subtitle file, and export it in multiple formats.
            </div>
            <button className="w-32 h-10 shadow-md shadow-black/40 bg-purple-500/90 hover:bg-purple-600 text-white rounded-full shadow transition-all duration-200">Go</button>
          </div>
          {/* Editor Section */}
          <div className="w-full flex flex-col items-center ">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent tracking-wider mb-2">EDITOR</div>
            <div className="text-lg max-w-xl mx-auto text-muted-foreground text-center mb-3">
              This is a full fledged editor, where you can transcribe your subtitles live, add speakers, while making sure the lipsync is preserved.
            </div>
            <button className="w-32 h-10 shadow-md shadow-black/40 bg-green-500/90 hover:bg-green-600 text-white rounded-full shadow transition-all duration-200">Go</button>
          </div>
        </div>
        {/* Vertical Divider */}
        <div className="hidden md:block h-[80vh] w-px bg-border"></div>
        {/* Right: Upload section with toggle */}
        {/* Upload Card Section: Toggle buttons and upload UI */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl">
            <div className="bg-card/50 backdrop-blur-sm border-10 rounded-3xl shadow-xl border border-border/50 p-0 dark:bg-card/30 dark:border-border/30 w-[90vw] max-w-xl h-[80vh] flex flex-col overflow-y-auto">
              {/* Toggle buttons inside the card */}
              <div className="flex gap-4 p-8 pb-0 border-b border-border/30">
                <button
                  className={`px-6 py-2 rounded-full font-semibold text-lg transition-all duration-200 border-2 ${mode === 'translate' ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-blue-500 border-blue-500 hover:bg-blue-50'}`}
                  onClick={() => setMode('translate')}
                >
                  Translate Subtitles Only
                </button>
                <button
                  className={`px-6 py-2 rounded-full font-semibold text-lg transition-all duration-200 border-2 ${mode === 'editor' ? 'bg-purple-500 text-white border-purple-500' : 'bg-transparent text-purple-500 border-purple-500 hover:bg-purple-50'}`}
                  onClick={() => setMode('editor')}
                >
                  Editor (Subtitles + Video)
                </button>
              </div>
              <div className="p-8">
                {mode === 'translate' ? (
                  <form className="w-full space-y-12">
                    <div className="space-y-10 mb-12">
                      {/* Subtitle Upload (copied from editor UI) */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">Subtitle File</h2>
                        </div>
                        <div
                          className={`group relative border-2 border-dashed rounded-2xl w-full h-48 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${dragActive.subtitle ? 'border-indigo-400 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 scale-[1.02] shadow-lg dark:from-indigo-500/20 dark:to-purple-500/20' : watch('subtitle') ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md dark:from-emerald-500/20 dark:to-teal-500/20' : 'border-border hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 hover:shadow-md dark:hover:from-indigo-500/15 dark:hover:to-purple-500/15'}`}
                          onDragEnter={(e) => handleDrag(e, 'subtitle')}
                          onDragLeave={(e) => handleDrag(e, 'subtitle')}
                          onDragOver={(e) => handleDrag(e, 'subtitle')}
                          onDrop={(e) => handleDrop(e, 'subtitle')}
                          onClick={() => handleUploadClick('subtitle')}
                        >
                          <input
                            ref={subtitleInputRef}
                            type="file"
                            accept=".srt,.txt"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileSelection(file, 'subtitle');
                            }}
                            className="hidden"
                          />
                          {watch('subtitle') ? (
                            <div className="space-y-2">
                              <p className="font-semibold text-foreground truncate max-w-xs mx-auto">{watch('subtitle')?.name}</p>
                              <p className="text-sm text-muted-foreground font-medium">{formatFileSize(watch('subtitle')?.size || 0)}</p>
                              <button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  removeFile('subtitle');
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all duration-200"
                              >
                                <X className="w-4 h-4" /> Remove
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-foreground font-medium">Drop your subtitle file here, or click to browse</p>
                              <p className="text-sm text-muted-foreground">Supports SRT and TXT file formats</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Language and Style Selectors */}
                    <div className="grid sm:grid-cols-2 gap-12 mb-12">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                            <LucideLanguages className="w-5 h-5 text-blue-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">Select Language</h2>
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
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                            <Drama className="w-5 h-5 text-blue-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">Select Style</h2>
                        </div>
                        <Controller
                          control={control}
                          name="style"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="styles" className={cn("w-full !h-12 mt-4", !field.value ? " ":"border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-300 font-semibold")}> <SelectValue placeholder="Choose a style"/> </SelectTrigger>
                              <SelectContent>
                                {styles.map((style) => (
                                  <SelectItem key={style} value={style}>
                                    {style}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                    {/* Action Section */}
                    <div className="text-center space-y-8">
                      <button
                        onClick={handleProcess}
                        disabled={!watch('subtitle')}
                        className={cn(
                          "group relative cursor-pointer px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300",
                          watch('subtitle')
                            ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40"
                            : "bg-gradient-to-r from-muted to-muted/50 text-muted-foreground cursor-not-allowed dark:from-muted/30 dark:to-muted/20"
                        )}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          Process File
                          <div
                            className={`w-2 h-2 rounded-full ${
                              watch('subtitle')
                                ? 'bg-white animate-pulse'
                                : 'bg-muted-foreground'
                            }`}
                          ></div>
                        </span>
                        {watch('subtitle') && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </button>
                      {!watch('subtitle') && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                          <p className="text-sm font-medium">
                            Please upload a subtitle file to continue
                          </p>
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                        </div>
                      )}
                    </div>
                    {isProcessing && (
                      <div className="pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Loader2 className="animate-spin w-4 h-4" /> Processing Translation...
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
                    {!isProcessing && progress === 100 && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[2px] dark:bg-black/80">
                        <div className="bg-card/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center dark:bg-card/90 dark:border dark:border-border/50">
                          <div className="flex items-center gap-2 text-green-400 text-md pt-4">
                            <CheckCircle className="w-8 h-8" /> Translation complete!{' '}
                          </div>
                          <button
                            className="group relative px-15 py-5 mt-4 rounded-2xl font-semibold text-lg transition-all duration-100 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
                            onClick={() => router.push('/editor')}
                          >
                            Move to Editor
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full space-y-12"
                  >
                    <div className="space-y-10 mb-12">
                      {/* Video Upload */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                            <Video className="w-5 h-5 text-blue-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">Video File</h2>
                        </div>
                        <div
                          className={`group relative border-2 border-dashed rounded-2xl w-full h-48 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${dragActive.video ? 'border-blue-400 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 scale-[1.02] shadow-lg dark:from-blue-500/20 dark:to-indigo-500/20' : watch('video') ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md dark:from-emerald-500/20 dark:to-teal-500/20' : 'border-border hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-indigo-500/5 hover:shadow-md dark:hover:from-blue-500/15 dark:hover:to-indigo-500/15'}`}
                          onDragEnter={(e) => handleDrag(e, 'video')}
                          onDragLeave={(e) => handleDrag(e, 'video')}
                          onDragOver={(e) => handleDrag(e, 'video')}
                          onDrop={(e) => handleDrop(e, 'video')}
                          onClick={() => handleUploadClick('video')}
                        >
                          <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileSelection(file, 'video');
                            }}
                            className="hidden"
                          />
                          {watch('video') ? (
                            <div className="space-y-2">
                              <p className="font-semibold text-foreground truncate max-w-xs mx-auto">{watch('video')?.name}</p>
                              <p className="text-sm text-muted-foreground font-medium">{formatFileSize(watch('video')?.size || 0)}</p>
                              <button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  removeFile('video');
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all duration-200"
                              >
                                <X className="w-4 h-4" /> Remove
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-foreground font-medium">Drop your video file here, or click to browse</p>
                              <p className="text-sm text-muted-foreground">Supports MP4, MOV, AVI, and more formats</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Subtitle Upload */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">Subtitle File</h2>
                        </div>
                        <div
                          className={`group relative border-2 border-dashed rounded-2xl w-full h-48 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${dragActive.subtitle ? 'border-indigo-400 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 scale-[1.02] shadow-lg dark:from-indigo-500/20 dark:to-purple-500/20' : watch('subtitle') ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md dark:from-emerald-500/20 dark:to-teal-500/20' : 'border-border hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 hover:shadow-md dark:hover:from-indigo-500/15 dark:hover:to-purple-500/15'}`}
                          onDragEnter={(e) => handleDrag(e, 'subtitle')}
                          onDragLeave={(e) => handleDrag(e, 'subtitle')}
                          onDragOver={(e) => handleDrag(e, 'subtitle')}
                          onDrop={(e) => handleDrop(e, 'subtitle')}
                          onClick={() => handleUploadClick('subtitle')}
                        >
                          <input
                            ref={subtitleInputRef}
                            type="file"
                            accept=".srt,.txt"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileSelection(file, 'subtitle');
                            }}
                            className="hidden"
                          />
                          {watch('subtitle') ? (
                            <div className="space-y-2">
                              <p className="font-semibold text-foreground truncate max-w-xs mx-auto">{watch('subtitle')?.name}</p>
                              <p className="text-sm text-muted-foreground font-medium">{formatFileSize(watch('subtitle')?.size || 0)}</p>
                              <button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  removeFile('subtitle');
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all duration-200"
                              >
                                <X className="w-4 h-4" /> Remove
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-foreground font-medium">Drop your subtitle file here, or click to browse</p>
                              <p className="text-sm text-muted-foreground">Supports SRT and TXT file formats</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Language and Style Selectors */}
                    <div className="grid sm:grid-cols-2 gap-12 mb-12">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                            <LucideLanguages className="w-5 h-5 text-blue-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">Select Language</h2>
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
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                            <Drama className="w-5 h-5 text-blue-400" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">Select Style</h2>
                        </div>
                        <Controller
                          control={control}
                          name="style"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="styles" className={cn("w-full !h-12 mt-4", !field.value ? " ":"border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-300 font-semibold")}> <SelectValue placeholder="Choose a style"/> </SelectTrigger>
                              <SelectContent>
                                {styles.map((style) => (
                                  <SelectItem key={style} value={style}>
                                    {style}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                    {/* Action Section */}
                    <div className="text-center space-y-8">
                      <button
                        onClick={handleProcess}
                        disabled={!watch('video') || !watch('subtitle')}
                        className={cn(
                          "group relative cursor-pointer px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300",
                          watch('video') && watch('subtitle')
                            ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40"
                            : "bg-gradient-to-r from-muted to-muted/50 text-muted-foreground cursor-not-allowed dark:from-muted/30 dark:to-muted/20"
                        )}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          Process Files
                          <div
                            className={`w-2 h-2 rounded-full ${
                              watch('video') && watch('subtitle')
                                ? 'bg-white animate-pulse'
                                : 'bg-muted-foreground'
                            }`}
                          ></div>
                        </span>
                        {watch('video') && watch('subtitle') && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </button>
                      {(!watch('video') || !watch('subtitle')) && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                          <p className="text-sm font-medium">
                            Please upload both video and subtitle files to continue
                          </p>
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                        </div>
                      )}
                    </div>
                    {isProcessing && (
                      <div className="pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Loader2 className="animate-spin w-4 h-4" /> Processing Translation...
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
                    {!isProcessing && progress === 100 && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[2px] dark:bg-black/80">
                        <div className="bg-card/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center dark:bg-card/90 dark:border dark:border-border/50">
                          <div className="flex items-center gap-2 text-green-400 text-md pt-4">
                            <CheckCircle className="w-8 h-8" /> Translation complete!{' '}
                          </div>
                          <button
                            className="group relative px-15 py-5 mt-4 rounded-2xl font-semibold text-lg transition-all duration-100 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
                            onClick={() => router.push('/editor')}
                          >
                            Move to Editor
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-muted-foreground text-sm">
          Powered by{' '}
          <span className="font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            QuickScribe
          </span>
        </p>
      </div>
    </main>
  );
} 