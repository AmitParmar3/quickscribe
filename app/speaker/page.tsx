'use client';
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";
import Aurora from "@/src/blocks/Backgrounds/Aurora/Aurora";
import { Edit3, Save, Plus, X, MicVocal, Download } from 'lucide-react';
import { saveAs } from "file-saver";

interface SubtitleEntry {
  id: number;
  startTime: number;
  endTime: number;
  text1: string; // First language
  text2: string; // Second language
  speakerId?: number;
}

interface Speaker {
  id: number;
  name: string;
  color: string;
}

export default function SpeakerPage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [subtitles, setSubtitles] = useState<SubtitleEntry[]>([]);
  const [activeSubtitleId, setActiveSubtitleId] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<SubtitleEntry | null>(null);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);

  // Speaker state
  const [speakers, setSpeakers] = useState<Speaker[]>([
    { id: 1, name: 'Speaker 1', color: '#3B82F6' },
    { id: 2, name: 'Speaker 2', color: '#8B5CF6' },
    { id: 3, name: 'Speaker 3', color: '#EF4444' },
    { id: 4, name: 'Speaker 4', color: '#10B981' },
    { id: 5, name: 'Speaker 5', color: '#F59E0B' },
    { id: 6, name: 'Speaker 6', color: '#EC4899' },
  ]);
  const [editingSpeaker, setEditingSpeaker] = useState<number | null>(null);
  const [newSpeakerName, setNewSpeakerName] = useState<string>('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Mock SRT data - in real app, this would come from uploaded file
  useEffect(() => {
    const mockSubtitles: SubtitleEntry[] = [
      { id: 1, startTime: 0, endTime: 3, text1: "Hello, welcome to our presentation today.", text2: "नमस्ते, आज हमारे प्रेजेंटेशन में आपका स्वागत है।" },
      { id: 2, startTime: 3.5, endTime: 7, text1: "Thank you for joining us.", text2: "हमसे जुड़ने के लिए धन्यवाद।" },
      { id: 3, startTime: 7.5, endTime: 12, text1: "Today we'll be discussing the latest developments.", text2: "आज हम नवीनतम विकास पर चर्चा करेंगे।" },
      { id: 4, startTime: 12.5, endTime: 16, text1: "Let's start with the overview.", text2: "आइए सिंहावलोकन से शुरू करें।" },
      { id: 5, startTime: 16.5, endTime: 20, text1: "The data shows significant improvements.", text2: "डेटा महत्वपूर्ण सुधार दिखाता है।" },
      { id: 6, startTime: 20.5, endTime: 24, text1: "We can see the trends clearly.", text2: "हम रुझानों को स्पष्ट रूप से देख सकते हैं।" },
      { id: 7, startTime: 24.5, endTime: 28, text1: "This is a crucial point to understand.", text2: "यह समझने के लिए एक महत्वपूर्ण बिंदु है।" },
      { id: 8, startTime: 28.5, endTime: 32, text1: "Let me explain this in detail.", text2: "मुझे इसे विस्तार से समझाएं।" },
      { id: 9, startTime: 32.5, endTime: 36, text1: "The results are quite impressive.", text2: "परिणाम काफी प्रभावशाली हैं।" },
      { id: 10, startTime: 36.5, endTime: 40, text1: "Thank you for your attention.", text2: "आपके ध्यान के लिए धन्यवाद।" },
    ];
    setSubtitles(mockSubtitles);
  }, []);

  // When subtitle is selected, scroll to it
  useEffect(() => {
    if (selectedLine && subtitleContainerRef.current) {
      const element = document.getElementById(`subtitle-${selectedLine.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedLine]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Speaker management
  const startEditingSpeaker = (id: number, currentName: string): void => {
    setEditingSpeaker(id);
    setNewSpeakerName(currentName);
  };

  const saveSpeakerName = (id: number): void => {
    setSpeakers(prev => prev.map(speaker => 
      speaker.id === id ? { ...speaker, name: newSpeakerName } : speaker
    ));
    setEditingSpeaker(null);
    setNewSpeakerName('');
  };

  const addSpeaker = (): void => {
    const colors = ['#EF4444', '#10B981', '#F59E0B', '#EC4899', '#14B8A6', '#8B5CF6', '#3B82F6', '#06B6D4'];
    const newSpeaker: Speaker = {
      id: speakers.length + 1,
      name: `Speaker ${speakers.length + 1}`,
      color: colors[speakers.length % colors.length]
    };
    setSpeakers(prev => [...prev, newSpeaker]);
  };

  const removeSpeaker = (id: number): void => {
    setSpeakers(prev => prev.filter(speaker => speaker.id !== id));
    // Clear assignments for removed speaker
    setSubtitles(prev => 
      prev.map(subtitle => 
        subtitle.speakerId === id ? { ...subtitle, speakerId: undefined } : subtitle
      )
    );
  };

  // Assign speaker to selected subtitle
  const assignSpeakerToSubtitle = (speakerId: number) => {
    if (selectedLine) {
      setSubtitles(prev => 
        prev.map(subtitle => 
          subtitle.id === selectedLine.id ? { ...subtitle, speakerId } : subtitle
        )
      );
    }
  };

  // Export SRT function from editor
  const exportSRT = () => {
    let srt = "";
    let lastSpeakerId: number | undefined = undefined;
    subtitles.forEach((sub, idx) => {
      // Speaker logic
      if (sub.speakerId && sub.speakerId !== lastSpeakerId) {
        const speakerName = speakers.find(s => s.id === sub.speakerId)?.name;
        if (speakerName) {
          srt += `${speakerName}\n`;
        }
        lastSpeakerId = sub.speakerId;
      }
      // Serial
      srt += `${idx + 1}\n`;
      // Timestamp
      const format = (t: number) => {
        const pad = (n: number, z = 2) => ("00" + n).slice(-z);
        const ms = Math.floor((t % 1) * 1000);
        const s = Math.floor(t) % 60;
        const m = Math.floor(t / 60) % 60;
        const h = Math.floor(t / 3600);
        return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
      };
      srt += `${format(sub.startTime)} --> ${format(sub.endTime)}\n`;
      // Text lines
      if (sub.text1) srt += `${sub.text1}\n`;
      if (sub.text2) srt += `${sub.text2}\n`;
      srt += "\n";
    });
    // Download
    const blob = new Blob([srt], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "subtitles.srt");
  };

  return (
    <main className="relative h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header - match editor page */}
      <div className="bg-card/70 backdrop-blur-sm border-b border-border/50 shadow-sm w-full">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl bg-muted hover:bg-muted/70 transition-colors duration-200 border border-border" onClick={() => window.history.back()}>
                <svg className="w-5 h-5 text-foreground/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <MicVocal />
                  {/* You can use a Sparkles icon here if you want, or leave blank */}
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:bg-none dark:text-white">
                  Speaker Assignment
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg"
                onClick={exportSRT}
              >
                Export Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Fixed Height */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Subtitle Area - Top (Scrollable) */}
        <div className="flex-1 p-4 border-b border-border/50 overflow-hidden" style={{height: '60%'}}>
          <div className="h-full flex flex-col max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h2 className="text-lg font-semibold">Subtitle Content</h2>
              <div className="text-sm text-muted-foreground">
                {subtitles.length} entries
              </div>
            </div>
            {/* Scrollable Subtitle Area */}
            <div 
              ref={subtitleContainerRef}
              className="flex-1 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-900 scrollbar-track-transparent"
            >
              <div className="space-y-3">
                {subtitles.map((subtitle) => (
                  <motion.div
                    key={subtitle.id}
                    id={`subtitle-${subtitle.id}`}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                      selectedLine?.id === subtitle.id
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-md scale-100 opacity-100'
                        : subtitle.speakerId
                        ? 'border-green-500/50 bg-green-500/5'
                        : 'border-border hover:border-blue-300 hover:bg-card/80 scale-95 opacity-70'
                    }`}
                    onClick={() => setSelectedLine(subtitle)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {subtitle.speakerId && (
                      <div className="mb-2 flex items-center gap-2">
                        <span 
                          className="inline-block w-3 h-3 rounded-full" 
                          style={{ backgroundColor: speakers.find(s => s.id === subtitle.speakerId)?.color || '#888' }}
                        ></span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {speakers.find(s => s.id === subtitle.speakerId)?.name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedLine?.id === subtitle.id ? 'bg-blue-400 animate-pulse' : 'bg-muted-foreground/40'
                      }`}></div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {formatTime(subtitle.startTime)} → {formatTime(subtitle.endTime)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm leading-relaxed ${
                        selectedLine?.id === subtitle.id ? 'text-foreground font-semibold' : 'text-muted-foreground'
                      }`}>
                        {subtitle.text1}
                      </p>
                      <p className={`text-sm leading-relaxed ${
                        selectedLine?.id === subtitle.id ? 'text-foreground font-semibold' : 'text-muted-foreground'
                      }`}>
                        {subtitle.text2}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Speaker Assignment UI - Bottom (Fixed) */}
        <div className="p-4 flex-shrink-0" style={{height: '40%'}}>
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-4 max-w-4xl mx-auto h-full flex flex-col justify-between">
            <div className="flex items-center justify-end mb-4 w-full">
              <button
                onClick={addSpeaker}
                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {/* Speaker Buttons Row - single line */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-900 scrollbar-track-transparent w-full">
              {speakers.map((speaker) => (
                <motion.button
                  key={speaker.id}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 min-w-fit max-w-xs text-xs font-medium truncate ${
                    selectedLine && selectedLine.speakerId === speaker.id 
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-400' 
                      : 'border-border hover:border-blue-300 hover:bg-card/80'
                  }`}
                  onClick={() => assignSpeakerToSubtitle(speaker.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  style={{whiteSpace: 'nowrap'}}
                >
                  <span 
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: speaker.color }}
                  ></span>
                  {editingSpeaker === speaker.id ? (
                    <input
                      type="text"
                      value={newSpeakerName}
                      onChange={(e) => setNewSpeakerName(e.target.value)}
                      className="w-20 px-1 py-0.5 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-background text-foreground text-center"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveSpeakerName(speaker.id);
                        if (e.key === 'Escape') setEditingSpeaker(null);
                      }}
                    />
                  ) : (
                    <span className="truncate max-w-[80px]">{speaker.name}</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingSpeaker(speaker.id, speaker.name);
                    }}
                    className="p-1 text-muted-foreground hover:text-blue-600 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  {speakers.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSpeaker(speaker.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 