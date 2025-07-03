"use client";
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
  "sad",
  "royal",
  "genZ comedy",
  "comedic",
  "funny",
  "millennial",
  "custom",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="pt-12 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                QuickScribe
              </h1>
            </div>
            <p className="text-slate-600 text-lg font-medium">
              Transform your videos with seamless subtitle integration
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto mt-4"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8"
        >
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Video Upload */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Video className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Video File
                  </h2>
                  <p className="text-sm text-slate-500">
                    Upload your video content
                  </p>
                </div>
              </div>

              <div
                className={`group relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive.video
                    ? "border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 scale-[1.02] shadow-lg"
                    : watch("video")
                    ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md"
                    : "border-slate-300 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50 hover:shadow-md"
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
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mx-auto shadow-lg">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-800 truncate max-w-xs mx-auto">
                        {watch("video")?.name}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        {formatFileSize(watch("video")?.size || 0)}
                      </p>
                    </div>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        removeFile("video");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300">
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-700 font-medium">
                        Drop your video file here, or click to browse
                      </p>
                      <p className="text-sm text-slate-400">
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
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Subtitle File
                  </h2>
                  <p className="text-sm text-slate-500">
                    Upload your subtitle content
                  </p>
                </div>
              </div>

              <div
                className={`group relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive.subtitle
                    ? "border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 scale-[1.02] shadow-lg"
                    : watch("subtitle")
                    ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md"
                    : "border-slate-300 hover:border-indigo-300 hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-purple-50/50 hover:shadow-md"
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
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mx-auto shadow-lg">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-800 truncate max-w-xs mx-auto">
                        {watch("subtitle")?.name}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        {formatFileSize(watch("subtitle")?.size || 0)}
                      </p>
                    </div>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        removeFile("subtitle");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto group-hover:from-indigo-100 group-hover:to-purple-200 transition-all duration-300">
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-700 font-medium">
                        Drop your subtitle file here, or click to browse
                      </p>
                      <p className="text-sm text-slate-400">
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <LucideLanguages className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Select Language
                  </h2>
                  <p className="text-sm text-slate-500 mb-">
                    Select your output language
                  </p>
                </div>
              </div>
              <Controller
                control={control}
                name="language"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="language" className={cn("w-full !h-12 mt-4")}>
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Drama className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Select Style
                  </h2>
                  <p className="text-sm text-slate-500 mb-">
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
                        <SelectTrigger className="w-full !h-12 mt-4">
                          <SelectValue placeholder="Choose a style" />
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
                  ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
                  : "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-400 cursor-not-allowed"
              )}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Process Files
                <div
                  className={`w-2 h-2 rounded-full ${
                    watch("video") && watch("subtitle")
                      ? "bg-white animate-pulse"
                      : "bg-slate-400"
                  }`}
                ></div>
              </span>
              {watch("video") && watch("subtitle") && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>

            {(!watch("video") || !watch("subtitle")) && (
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <p className="text-sm font-medium">
                  Please upload both video and subtitle files to continue
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
            )}
          </div>
        </form>

        {isProcessing && (
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="animate-spin w-4 h-4" /> Processing
              Translation...
            </div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-green-500 rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">{progress}% complete</div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            Powered by{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              QuickScribe
            </span>
          </p>
        </div>
      </div>

      {/* Overlay for Move to Editor button */}
      {!isProcessing && progress === 100 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[2px]">
          <div className="bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
            <div className="flex items-center gap-2 text-green-600 text-md pt-4">
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
    </div>
  );
}
