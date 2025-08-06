'use client';
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
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
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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

export default function UploadSection() {
  const router = useRouter();
  const [mode, setMode] = useState<'translate' | 'assign' | 'workstation'>('translate');
  const [dragActive, setDragActive] = useState<DragActiveState>({
    video: false,
    subtitle: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

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
    // Handle form submission
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
    <section id="upload-section" className="min-h-screen w-full flex items-center justify-center bg-background/60 backdrop-blur-sm dark:bg-slate-950/70">
      {/* Two-column layout */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full h-screen gap-0">
        {/* Left: QuickScribe branding */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 gap-8">
          {/* Translate Section */}
          <div className="w-full flex flex-col items-center mb-6 ">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent tracking-wider mb-2">TRANSLATE</div>
            <div className="text-lg max-w-2xl mx-auto text-muted-foreground text-center mb-3">
            TRANSLATE localizes your SRTs to any language, perfectly preserving the original tone and context. Deliver precise, nuanced translations every time.</div>
          </div>
          {/* Speaker Section */}
          <div className="w-full flex flex-col items-center mb-6 ">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wider mb-2">ASSIGN</div>
            <div className="text-lg max-w-2xl mx-auto text-muted-foreground text-center mb-3">
            ASSIGN streamlines the process of accurately attributing speakers within your SRT files. Precisely label dialogue for clarity and professional presentation.</div>
          </div>
          {/* Editor Section */}
          <div className="w-full flex flex-col items-center ">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent tracking-wider mb-2">WORKSTATION</div>
            <div className="text-lg max-w-2xl mx-auto text-muted-foreground text-center mb-3">
            WORKSTATION is your complete live subtitling editor. Transcribe, add speakers, and maintain perfect lip-sync, all in real-time.</div>
          </div>
        </div>
        {/* Vertical Divider */}
        <div className="hidden md:block h-[80vh] w-px bg-gradient-to-b from-transparent via-border to-transparent dark:via-slate-700"></div>
        {/* Right: Upload section with toggle */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl">
            <div className="bg-card/60 backdrop-blur-md rounded-3xl shadow-2xl border border-border/60 p-0 dark:bg-slate-900/80 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-purple-500/10 w-[90vw] max-w-xl h-[80vh] flex flex-col overflow-y-auto transition-all duration-300">
              {/* Toggle buttons inside the card */}
              <div className="flex w-full p-0 m-0 border-b border-border/30 dark:border-slate-700/50">
                <button
                  className={`flex-1 rounded-none border-0 py-4 text-xl font-semibold transition-all duration-300 ${mode === 'translate' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-card/50 text-blue-500 hover:bg-blue-50 dark:bg-slate-800/50 dark:text-blue-400 dark:hover:bg-slate-700/70'} ${mode === 'translate' ? '' : 'hover:text-blue-600 dark:hover:text-blue-300'}`}
                  style={{borderRight: '1px solid var(--border)'}}
                  onClick={() => setMode('translate')}
                >
                  Translate
                </button>
                <button
                  className={`flex-1 rounded-none border-0 py-4 text-xl font-semibold transition-all duration-300 ${mode === 'assign' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' : 'bg-card/50 text-purple-500 hover:bg-purple-50 dark:bg-slate-800/50 dark:text-purple-400 dark:hover:bg-slate-700/70'} ${mode === 'assign' ? '' : 'hover:text-purple-600 dark:hover:text-purple-300'}`}
                  style={{borderRight: '1px solid var(--border)'}}
                  onClick={() => setMode('assign')}
                >
                  Assign
                </button>
                <button
                  className={`flex-1 rounded-none border-0 py-4 text-xl font-semibold transition-all duration-300 ${mode === 'workstation' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' : 'bg-card/50 text-green-500 hover:bg-green-50 dark:bg-slate-800/50 dark:text-green-400 dark:hover:bg-slate-700/70'} ${mode === 'workstation' ? '' : 'hover:text-green-600 dark:hover:text-green-300'}`}
                  onClick={() => setMode('workstation')}
                >
                  Workstation
                </button>
              </div>
              <div className="p-8">
                {mode === 'translate' ? (
                  <form className="w-full space-y-12">
                    <div className="space-y-10 mb-12">
                      {/* Subtitle Upload */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 dark:from-indigo-400/30 dark:to-purple-500/30 dark:bg-slate-800/50 rounded-xl flex items-center justify-center ring-1 ring-indigo-500/20 dark:ring-indigo-400/30">
                            <FileText className="w-5 h-5 text-indigo-400 dark:text-indigo-300" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground dark:text-slate-100">Subtitle File</h2>
                        </div>
                        <div
                          className={`group relative border-2 border-dashed rounded-2xl w-full h-48 flex flex-col items-center justify-center text-center transition-all duration-500 cursor-pointer transform ${dragActive.subtitle ? 'border-indigo-400 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 scale-[1.02] shadow-lg dark:from-indigo-500/30 dark:to-purple-500/30 dark:border-indigo-400/80 dark:shadow-indigo-500/20' : watch('subtitle') ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md dark:from-emerald-500/30 dark:to-teal-500/30 dark:border-emerald-400/80 dark:shadow-emerald-500/20' : 'border-border hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 hover:shadow-md dark:border-slate-600 dark:hover:border-indigo-400/60 dark:hover:from-indigo-500/20 dark:hover:to-purple-500/20 dark:hover:shadow-indigo-500/10'}`}
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
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-400/30 dark:to-blue-500/30 dark:bg-slate-800/50 rounded-xl flex items-center justify-center ring-1 ring-blue-500/20 dark:ring-blue-400/30">
                            <LucideLanguages className="w-5 h-5 text-blue-400 dark:text-blue-300" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground dark:text-slate-100">Select Language</h2>
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
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-400/30 dark:to-blue-500/30 dark:bg-slate-800/50 rounded-xl flex items-center justify-center ring-1 ring-blue-500/20 dark:ring-blue-400/30">
                            <Drama className="w-5 h-5 text-blue-400 dark:text-blue-300" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground dark:text-slate-100">Select Style</h2>
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
                          "group relative cursor-pointer px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 transform",
                          watch('subtitle')
                            ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 dark:shadow-blue-500/30 dark:hover:shadow-blue-500/50 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-600"
                            : "bg-gradient-to-r from-muted to-muted/50 text-muted-foreground cursor-not-allowed dark:from-slate-700 dark:to-slate-600 dark:text-slate-400"
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
) : mode === 'assign' ? (
                  <form className="w-full space-y-12">
                    <div className="space-y-10 mb-12">
                      {/* Video Upload */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-600/20 dark:from-purple-400/30 dark:to-pink-500/30 dark:bg-slate-800/50 rounded-xl flex items-center justify-center ring-1 ring-purple-500/20 dark:ring-purple-400/30">
                            <Video className="w-5 h-5 text-purple-400 dark:text-purple-300" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground dark:text-slate-100">Video File</h2>
                        </div>
                        <div
                          className={`group relative border-2 border-dashed rounded-2xl w-full h-48 flex flex-col items-center justify-center text-center transition-all duration-500 cursor-pointer transform ${dragActive.video ? 'border-purple-400 bg-gradient-to-br from-purple-500/10 to-pink-500/10 scale-[1.02] shadow-lg dark:from-purple-500/30 dark:to-pink-500/30 dark:border-purple-400/80 dark:shadow-purple-500/20' : watch('video') ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md dark:from-emerald-500/30 dark:to-teal-500/30 dark:border-emerald-400/80 dark:shadow-emerald-500/20' : 'border-border hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-500/5 hover:to-pink-500/5 hover:shadow-md dark:border-slate-600 dark:hover:border-purple-400/60 dark:hover:from-purple-500/20 dark:hover:to-pink-500/20 dark:hover:shadow-purple-500/10'}`}
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
                              <p className="text-sm text-muted-foreground">Supports MP4, AVI, MOV and other video formats</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subtitle Upload */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-600/20 dark:from-pink-400/30 dark:to-purple-500/30 dark:bg-slate-800/50 rounded-xl flex items-center justify-center ring-1 ring-pink-500/20 dark:ring-pink-400/30">
                            <FileText className="w-5 h-5 text-pink-400 dark:text-pink-300" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground dark:text-slate-100">Subtitle File</h2>
                        </div>
                        <div
                          className={`group relative border-2 border-dashed rounded-2xl w-full h-48 flex flex-col items-center justify-center text-center transition-all duration-500 cursor-pointer transform ${dragActive.subtitle ? 'border-pink-400 bg-gradient-to-br from-pink-500/10 to-purple-500/10 scale-[1.02] shadow-lg dark:from-pink-500/30 dark:to-purple-500/30 dark:border-pink-400/80 dark:shadow-pink-500/20' : watch('subtitle') ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md dark:from-emerald-500/30 dark:to-teal-500/30 dark:border-emerald-400/80 dark:shadow-emerald-500/20' : 'border-border hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-500/5 hover:to-purple-500/5 hover:shadow-md dark:border-slate-600 dark:hover:border-pink-400/60 dark:hover:from-pink-500/20 dark:hover:to-purple-500/20 dark:hover:shadow-pink-500/10'}`}
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

                    {/* Action Section */}
                    <div className="text-center space-y-8">
                      <button
                        onClick={handleProcess}
                        disabled={!watch('video') || !watch('subtitle')}
                        className={cn(
                          "group relative cursor-pointer px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 transform",
                          (watch('video') && watch('subtitle'))
                            ? "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 dark:shadow-purple-500/30 dark:hover:shadow-purple-500/50 dark:from-purple-600 dark:via-pink-600 dark:to-purple-600"
                            : "bg-gradient-to-r from-muted to-muted/50 text-muted-foreground cursor-not-allowed dark:from-slate-700 dark:to-slate-600 dark:text-slate-400"
                        )}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          Assign Speakers
                          <div
                            className={`w-2 h-2 rounded-full ${
                              (watch('video') && watch('subtitle'))
                                ? 'bg-white animate-pulse'
                                : 'bg-muted-foreground'
                            }`}
                          ></div>
                        </span>
                        {(watch('video') && watch('subtitle')) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                          <Loader2 className="animate-spin w-4 h-4" /> Assigning Speakers...
                        </div>
                        <div className="w-full h-2 bg-muted rounded">
                          <div
                            className="h-full bg-purple-500 rounded transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">{progress}% complete</div>
                      </div>
                    )}
                    {!isProcessing && progress === 100 && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[2px] dark:bg-black/80">
                        <div className="bg-card/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center dark:bg-card/90 dark:border dark:border-border/50">
                          <div className="flex items-center gap-2 text-purple-400 text-md pt-4">
                            <CheckCircle className="w-8 h-8" /> Speaker assignment complete!{' '}
                          </div>
                          <button
                            className="group relative px-15 py-5 mt-4 rounded-2xl font-semibold text-lg transition-all duration-100 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-purple-600 hover:via-pink-600 hover:to-purple-600"
                            onClick={() => router.push('/editor')}
                          >
                            Move to Editor
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg mb-4">Workstation Mode</p>
                    <p className="text-sm">Coming soon - Full video editing workstation</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
