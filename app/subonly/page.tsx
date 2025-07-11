'use client';
import React, { useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { FileText, Check, X, LucideLanguages, Drama, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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

type FormData = {
  subtitle: File | null;
  language: string;
  style: string;
};

export default function SubtitleOnlyForm() {
  const subtitleInputRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      subtitle: null,
      language: "",
      style: "",
    },
  });

  const handleFileSelection = (file: File): void => {
    if (file.name.endsWith(".srt") || file.name.endsWith(".txt")) {
      setValue("subtitle", file);
    }
  };

  const removeFile = (): void => {
    setValue("subtitle", null);
    if (subtitleInputRef.current) subtitleInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data, "SUBTITLE ONLY FORMDATA");
    // Handle subtitle-only submission
  };

  const handleUploadClick = () => {
    subtitleInputRef.current?.click();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-xl border border-border/50 p-8 max-w-xl mx-auto mt-16"
    >
      <div className="space-y-6">
        {/* Subtitle Upload */}
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
            watch("subtitle")
              ? "border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md"
              : "border-border hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 hover:shadow-md"
          }`}
          onClick={handleUploadClick}
        >
          <input
            ref={subtitleInputRef}
            type="file"
            accept=".srt,.txt"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelection(file);
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
                  removeFile();
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
        {/* Language Select */}
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
        {/* Style Prompt Textarea */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
              <Drama className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Style Prompt
              </h2>
              <p className="text-sm text-muted-foreground mb-">
                Describe the style or tone you want for the subtitles
              </p>
            </div>
          </div>
          <Controller
            control={control}
            name="style"
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                placeholder="e.g. Make the subtitles sound formal, comedic, or add your own instructions..."
                className="w-full mt-2 p-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              />
            )}
          />
        </div>
        {/* Submit Button */}
        <div className="text-center mt-8">
          <button
            type="submit"
            className="group relative cursor-pointer px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
} 