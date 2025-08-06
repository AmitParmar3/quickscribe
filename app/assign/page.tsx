'use client';
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";
import Aurora from "@/src/blocks/Backgrounds/Aurora/Aurora";
import { Edit3, Save, Plus, X, MicVocal, Download } from 'lucide-react';
import { saveAs } from "file-saver";
import { useSearchParams } from 'next/navigation';
import { QuickScribeAPI } from "@/lib/api";

interface SubtitleEntry {
  id: number;
  startTime: number;
  endTime: number;
  text1: string; // First language
  text2: string; // Second language
  speakerId?: number;
  lineSpeakers?: { [lineIndex: number]: number }; // For multi-line assignments
}

interface Speaker {
  id: number;
  name: string;
  color: string;
}

export default function SpeakerPage() {
  const { theme, resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
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
  const [selectedSpeaker, setSelectedSpeaker] = useState<number | null>(null);
  const [editingSpeaker, setEditingSpeaker] = useState<number | null>(null);
  const [newSpeakerName, setNewSpeakerName] = useState<string>('');
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null); // For multi-line speaker assignment

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Load data from backend
  const loadDataFromBackend = async (fileId: number) => {
    try {
      const data = await QuickScribeAPI.getFileData(fileId);
      setSubtitles(data.subtitles);
      
      // If speakers are returned from backend, use them, otherwise use default speakers
      if (data.speakers && data.speakers.length > 0) {
        setSpeakers(data.speakers);
      }
    } catch (error) {
      console.error('Failed to load data from backend:', error);
      // Fallback to mock data if backend fails
      loadMockData();
    }
  };

  // Get session ID and load data
  useEffect(() => {
    const urlSessionId = searchParams.get('session_id');
    const storedSessionId = localStorage.getItem('session_id');
    const fileId = localStorage.getItem('file_id');
    
    const finalSessionId = urlSessionId || storedSessionId;
    
    if (finalSessionId && fileId) {
      setSessionId(finalSessionId);
      localStorage.setItem('session_id', finalSessionId); // Backup storage
      
      // Load speakers and subtitles from backend using file_id
      loadDataFromBackend(parseInt(fileId));
    } else {
      console.error('No session ID or file ID found');
      // TODO: Redirect back to upload page or show error
    }
  }, [searchParams]);

  // Mock SRT data - will be replaced with API call
  const loadMockData = () => {
    const mockSubtitles: SubtitleEntry[] = [
      { id: 1, startTime: 0, endTime: 3, text1: "Hello, welcome to our presentation today.", text2: "नमस्ते, आज हमारे प्रेजेंटेशन में आपका स्वागत है।" },
      { id: 2, startTime: 3.5, endTime: 7, text1: "Thank you for joining us.\nI'm excited to be here.", text2: "हमसे जुड़ने के लिए धन्यवाद।\nमैं यहाँ होने के लिए उत्साहित हूँ।" },
      { id: 3, startTime: 7.5, endTime: 12, text1: "Today we'll be discussing the latest developments.\nThis is really important for everyone.", text2: "आज हम नवीनतम विकास पर चर्चा करेंगे।\nयह सभी के लिए वास्तव में महत्वपूर्ण है।" },
      { id: 4, startTime: 12.5, endTime: 16, text1: "Let's start with the overview.", text2: "आइए सिंहावलोकन से शुरू करें।" },
      { id: 5, startTime: 16.5, endTime: 20, text1: "The data shows significant improvements.\nWow, these numbers are impressive!\nI agree completely.", text2: "डेटा महत्वपूर्ण सुधार दिखाता है।\nवाह, ये संख्याएं प्रभावशाली हैं!\nमैं पूरी तरह से सहमत हूं।" },
      { id: 6, startTime: 20.5, endTime: 24, text1: "We can see the trends clearly.", text2: "हम रुझानों को स्पष्ट रूप से देख सकते हैं।" },
      { id: 7, startTime: 24.5, endTime: 28, text1: "This is a crucial point to understand.\nCan you explain that again?\nSure, let me clarify.", text2: "यह समझने के लिए एक महत्वपूर्ण बिंदु है।\nक्या आप इसे फिर से समझा सकते हैं?\nज़रूर, मुझे स्पष्ट करने दें।" },
      { id: 8, startTime: 28.5, endTime: 32, text1: "Let me explain this in detail.\nThat makes perfect sense now.", text2: "मुझे इसे विस्तार से समझाएं।\nअब यह बिल्कुल समझ में आता है।" },
      { id: 9, startTime: 32.5, endTime: 36, text1: "The results are quite impressive.", text2: "परिणाम काफी प्रभावशाली हैं।" },
      { id: 10, startTime: 36.5, endTime: 40, text1: "Thank you for your attention.\nAny questions?\nYes, I have one.", text2: "आपके ध्यान के लिए धन्यवाद।\nकोई सवाल?\nहाँ, मेरे पास एक है।" },
    ];
    setSubtitles(mockSubtitles);
  };

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

  // Helper function to check if subtitle has multiple lines
  const isMultiLine = (subtitle: SubtitleEntry): boolean => {
    return subtitle.text1.includes('\n') || subtitle.text2.includes('\n');
  };

  // Helper function to get lines from text
  const getTextLines = (text: string): string[] => {
    return text.split('\n').filter(line => line.trim() !== '');
  };

  // Helper function to get speaker for a specific line
  const getSpeakerForLine = (subtitle: SubtitleEntry, lineIndex: number): Speaker | undefined => {
    if (subtitle.lineSpeakers && subtitle.lineSpeakers[lineIndex]) {
      return speakers.find(s => s.id === subtitle.lineSpeakers![lineIndex]);
    }
    return undefined;
  };

  // Speaker management
  const startEditingSpeaker = (): void => {
    if (selectedSpeaker) {
      const speaker = speakers.find(s => s.id === selectedSpeaker);
      if (speaker) {
        setEditingSpeaker(selectedSpeaker);
        setNewSpeakerName(speaker.name);
      }
    }
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
    // Clear selection if removed speaker was selected
    if (selectedSpeaker === id) {
      setSelectedSpeaker(null);
    }
  };

  // Assign speaker to selected subtitle
  const assignSpeakerToSubtitle = (speakerId: number) => {
    if (selectedLine) {
      if (selectedLineIndex !== null && isMultiLine(selectedLine)) {
        // Multi-line assignment to specific line
        setSubtitles(prev => 
          prev.map(subtitle => 
            subtitle.id === selectedLine.id 
              ? { 
                  ...subtitle, 
                  lineSpeakers: { 
                    ...subtitle.lineSpeakers, 
                    [selectedLineIndex]: speakerId 
                  } 
                } 
              : subtitle
          )
        );
      } else {
        // Single subtitle assignment (traditional way)
        setSubtitles(prev => 
          prev.map(subtitle => 
            subtitle.id === selectedLine.id ? { ...subtitle, speakerId } : subtitle
          )
        );
      }
    }
  };

  // Handle speaker selection
  const handleSpeakerClick = (speakerId: number) => {
    setSelectedSpeaker(speakerId);
    assignSpeakerToSubtitle(speakerId);
  };

  // Handle line selection in multi-line subtitles
  const handleLineClick = (lineIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedLine && isMultiLine(selectedLine)) {
      setSelectedLineIndex(lineIndex);
    }
  };

  // Export SRT function with backend integration
  const exportSRT = async () => {
    // Save assignments to backend first
    const fileId = localStorage.getItem('file_id');
    if (fileId) {
      try {
        await QuickScribeAPI.saveFileAssignments(parseInt(fileId), speakers, subtitles);
        console.log('Assignments saved to backend successfully');
      } catch (error) {
        console.error('Failed to save assignments:', error);
        // Continue with export even if save fails
      }
    }

    // Generate SRT file
    let srt = "";
    let lastSpeakerId: number | undefined = undefined;
    
    subtitles.forEach((sub, idx) => {
      // Handle multi-line subtitles with individual line speakers
      if (isMultiLine(sub) && sub.lineSpeakers && Object.keys(sub.lineSpeakers).length > 0) {
        // Multi-line with line-specific speakers - add speaker names inline
        const text1Lines = getTextLines(sub.text1);
        const text2Lines = getTextLines(sub.text2);
        
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
        
        // Process text1 with inline speaker names
        const processedText1Lines = text1Lines.map((line, lineIndex) => {
          const lineSpeakerId = sub.lineSpeakers![lineIndex];
          if (lineSpeakerId) {
            const speakerName = speakers.find(s => s.id === lineSpeakerId)?.name;
            if (speakerName) {
              return `{${speakerName}} ${line}`;
            }
          }
          return line;
        });
        
        // Process text2 with inline speaker names
        const processedText2Lines = text2Lines.map((line, lineIndex) => {
          const lineSpeakerId = sub.lineSpeakers![lineIndex];
          if (lineSpeakerId) {
            const speakerName = speakers.find(s => s.id === lineSpeakerId)?.name;
            if (speakerName) {
              return `{${speakerName}} ${line}`;
            }
          }
          return line;
        });
        
        // Add processed lines to SRT
        if (processedText1Lines.length > 0) {
          srt += processedText1Lines.join('\n') + '\n';
        }
        if (processedText2Lines.length > 0) {
          srt += processedText2Lines.join('\n') + '\n';
        }
        srt += "\n";
        
        // Reset lastSpeakerId after multi-line entries to ensure next subtitle works correctly
        lastSpeakerId = undefined;
        
      } else {
        // Traditional single speaker per subtitle OR multi-line without line-specific speakers
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
        
        // Text lines - preserve original format for single-speaker or unassigned multi-line
        if (sub.text1) srt += `${sub.text1}\n`;
        if (sub.text2) srt += `${sub.text2}\n`;
        srt += "\n";
      }
    });
    
    // Download
    const blob = new Blob([srt], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "subtitles.srt");
  };

  return (
    <main className="relative h-screen w-full flex flex-col bg-background text-foreground overflow-hidden dark:bg-gray-950">
      {/* Session ID Check */}
      {(!sessionId || !localStorage.getItem('file_id')) && mounted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
            <h2 className="text-xl font-bold mb-4 text-foreground">No Session Found</h2>
            <p className="text-muted-foreground mb-6">
              Please upload a file first to start speaker assignment.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
            >
              Go Back to Upload
            </button>
          </div>
        </div>
      )}

      {/* Header - enhanced with better dark mode styling */}
      <div className="bg-card/80 backdrop-blur-md shadow-lg w-full dark:bg-gray-900/90 dark:shadow-xl dark:shadow-gray-500/5">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl bg-muted hover:bg-muted/70 transition-all duration-300 border border-border dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 group" onClick={() => window.history.back()}>
                <svg className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg dark:shadow-gray-500/20 ring-1 ring-gray-500/20 dark:ring-gray-400/30">
                  <MicVocal className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-400">
                  Speaker Assignment
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 dark:shadow-gray-500/25 dark:hover:shadow-gray-500/40"
                onClick={exportSRT}
              >
                <Download className="w-4 h-4 inline mr-2" />
                Export Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Fixed Height */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Subtitle Area - Top (Scrollable) */}
        <div className="flex-1 p-6 overflow-hidden dark:border-gray-700/60" style={{height: '60%'}}>
          <div className="h-full flex flex-col max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 className="text-lg font-semibold dark:text-gray-100">Subtitle Content</h2>
              <div className="flex items-center gap-3">
                {selectedLine && (
                  <button
                    onClick={() => {
                      setSelectedLine(null);
                      setSelectedLineIndex(null);
                    }}
                    className="px-3 py-1 text-xs bg-muted hover:bg-muted/70 rounded-lg border border-border transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Clear Selection
                  </button>
                )}
                <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full dark:bg-gray-800 dark:text-gray-400">
                  {subtitles.length} entries
                </div>
              </div>
            </div>
            {/* Scrollable Subtitle Area */}
            <div 
              ref={subtitleContainerRef}
              className="flex-1 bg-card/60 backdrop-blur-md rounded-2xl border border-border/60 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent dark:bg-gray-900/60 dark:border-gray-700/60 shadow-lg"
              onClick={(e) => {
                // Only deselect if clicking on the container itself, not on subtitle cards
                if (e.target === e.currentTarget) {
                  setSelectedLine(null);
                  setSelectedLineIndex(null);
                }
              }}
            >
              <div className="space-y-4">
                {subtitles.map((subtitle) => (
                  <motion.div
                    key={subtitle.id}
                    id={`subtitle-${subtitle.id}`}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-500 overflow-hidden transform ${
                      selectedLine?.id === subtitle.id
                        ? 'border-gray-400 bg-gray-50/70 dark:bg-gray-800/40 shadow-lg scale-102 ring-2 ring-gray-400/30 dark:border-gray-400/80'
                        : 'border-border hover:border-gray-300 hover:bg-card/80 dark:border-gray-600 dark:hover:border-gray-400/60 dark:hover:bg-gray-800/50 hover:shadow-md'
                    }`}
                    onClick={() => {
                      setSelectedLine(subtitle);
                      setSelectedLineIndex(null); // Reset line selection when selecting new subtitle
                    }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Single speaker indicator (for non-multi-line or fallback) */}
                    {subtitle.speakerId && !isMultiLine(subtitle) && (
                      <div className="mb-3 flex items-center gap-3">
                        <span 
                          className="inline-block w-4 h-4 rounded-full shadow-sm ring-2 ring-white dark:ring-gray-800" 
                          style={{ backgroundColor: speakers.find(s => s.id === subtitle.speakerId)?.color || '#888' }}
                        ></span>
                        <span className="text-sm font-semibold text-foreground bg-background/50 px-2 py-1 rounded-md dark:bg-gray-800/50 dark:text-gray-200">
                          {speakers.find(s => s.id === subtitle.speakerId)?.name}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        selectedLine?.id === subtitle.id ? 'bg-gray-400 animate-pulse shadow-lg shadow-gray-400/50' : 'bg-muted-foreground/40'
                      }`}></div>
                      <span className="text-sm font-medium text-muted-foreground bg-muted/30 px-3 py-1 rounded-full dark:bg-gray-700/50 dark:text-gray-300">
                        {formatTime(subtitle.startTime)} → {formatTime(subtitle.endTime)}
                      </span>
                      {isMultiLine(subtitle) && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                          Multi-line
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {/* Text1 rendering */}
                      {isMultiLine(subtitle) ? (
                        <div className="space-y-1">
                          {getTextLines(subtitle.text1).map((line, lineIndex) => {
                            const lineSpeaker = getSpeakerForLine(subtitle, lineIndex);
                            const isLineSelected = selectedLine?.id === subtitle.id && selectedLineIndex === lineIndex;
                            return (
                              <div 
                                key={`text1-${lineIndex}`}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                  isLineSelected 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-400/50' 
                                    : 'hover:bg-background/50 dark:hover:bg-gray-700/30'
                                }`}
                                onClick={(e) => handleLineClick(lineIndex, e)}
                              >
                                {lineSpeaker && (
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span 
                                      className="w-3 h-3 rounded-full shadow-sm ring-1 ring-white dark:ring-gray-800" 
                                      style={{ backgroundColor: lineSpeaker.color }}
                                    ></span>
                                    <span className="text-xs font-medium text-foreground/80 bg-background/30 px-1.5 py-0.5 rounded dark:bg-gray-800/30">
                                      {lineSpeaker.name}
                                    </span>
                                  </div>
                                )}
                                <p className={`text-sm leading-relaxed flex-1 ${
                                  selectedLine?.id === subtitle.id ? 'text-foreground font-semibold dark:text-gray-100' : 'text-muted-foreground dark:text-gray-400'
                                }`}>
                                  {line}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className={`text-sm leading-relaxed transition-all duration-300 ${
                          selectedLine?.id === subtitle.id ? 'text-foreground font-semibold dark:text-gray-100' : 'text-muted-foreground dark:text-gray-400'
                        }`}>
                          {subtitle.text1}
                        </p>
                      )}
                      
                      {/* Text2 rendering */}
                      {isMultiLine(subtitle) ? (
                        <div className="space-y-1">
                          {getTextLines(subtitle.text2).map((line, lineIndex) => {
                            const lineSpeaker = getSpeakerForLine(subtitle, lineIndex);
                            const isLineSelected = selectedLine?.id === subtitle.id && selectedLineIndex === lineIndex;
                            return (
                              <div 
                                key={`text2-${lineIndex}`}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                  isLineSelected 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-400/50' 
                                    : 'hover:bg-background/50 dark:hover:bg-gray-700/30'
                                }`}
                                onClick={(e) => handleLineClick(lineIndex, e)}
                              >
                                {lineSpeaker && (
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span 
                                      className="w-3 h-3 rounded-full shadow-sm ring-1 ring-white dark:ring-gray-800" 
                                      style={{ backgroundColor: lineSpeaker.color }}
                                    ></span>
                                    <span className="text-xs font-medium text-foreground/80 bg-background/30 px-1.5 py-0.5 rounded dark:bg-gray-800/30">
                                      {lineSpeaker.name}
                                    </span>
                                  </div>
                                )}
                                <p className={`text-sm leading-relaxed flex-1 ${
                                  selectedLine?.id === subtitle.id ? 'text-foreground font-semibold dark:text-gray-100' : 'text-muted-foreground dark:text-gray-400'
                                }`}>
                                  {line}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className={`text-sm leading-relaxed transition-all duration-300 ${
                          selectedLine?.id === subtitle.id ? 'text-foreground font-semibold dark:text-gray-100' : 'text-muted-foreground dark:text-gray-400'
                        }`}>
                          {subtitle.text2}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Speaker Assignment UI - Bottom (Fixed) */}
        <div className="p-6 flex-shrink-0" style={{height: '40%'}}>
          <div className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/60 p-6 max-w-4xl mx-auto h-full flex flex-col justify-between dark:bg-gray-900/60 dark:border-gray-700/60 shadow-lg">
            <div className="flex items-center justify-between mb-6 w-full">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold dark:text-gray-100">Speaker Assignment</h3>
                {selectedLine && selectedLineIndex !== null && isMultiLine(selectedLine) && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Line {selectedLineIndex + 1} selected
                    </span>
                  </div>
                )}
                {selectedLine && selectedLineIndex === null && isMultiLine(selectedLine) && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                      Click on individual lines to assign speakers
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {selectedSpeaker && (
                  <button
                    onClick={startEditingSpeaker}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit Selected</span>
                  </button>
                )}
                <button
                  onClick={addSpeaker}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 dark:shadow-gray-500/25"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Speaker</span>
                </button>
              </div>
            </div>
            {/* Speaker Buttons Grid - Scrollable when overflow */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent px-1">
              <div className="flex flex-wrap gap-3 pb-3 w-full min-h-fit">
                {speakers.map((speaker) => (
                  <motion.button
                    key={speaker.id}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium shadow-md ${
                      selectedSpeaker === speaker.id
                        ? 'border-blue-400 bg-blue-50/80 dark:bg-blue-900/40 ring-2 ring-blue-400/50 shadow-lg dark:border-blue-400/80' 
                        : selectedLine && selectedLine.speakerId === speaker.id 
                        ? 'border-gray-400 bg-gray-50/80 dark:bg-gray-800/60 ring-2 ring-gray-400/50 shadow-lg dark:border-gray-400/80' 
                        : 'border-border hover:border-gray-300 hover:bg-card/80 dark:border-gray-600 dark:hover:border-gray-400/60 dark:hover:bg-gray-800/70 hover:shadow-lg'
                    }`}
                    onClick={() => handleSpeakerClick(speaker.id)}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span 
                      className="w-4 h-4 rounded-full inline-block shadow-sm ring-2 ring-white dark:ring-gray-800 flex-shrink-0"
                      style={{ backgroundColor: speaker.color }}
                    ></span>
                    {editingSpeaker === speaker.id ? (
                      <input
                        type="text"
                        value={newSpeakerName}
                        onChange={(e) => setNewSpeakerName(e.target.value)}
                        className="min-w-0 px-2 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-background text-foreground text-center dark:bg-gray-800 dark:border-gray-600"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveSpeakerName(speaker.id);
                          if (e.key === 'Escape') setEditingSpeaker(null);
                        }}
                      />
                    ) : (
                      <span className="font-medium whitespace-nowrap">{speaker.name}</span>
                    )}
                    {speakers.length > 1 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSpeaker(speaker.id);
                        }}
                        className="p-1 text-muted-foreground hover:text-rose-600 transition-colors duration-200 rounded-md hover:bg-background/50 dark:hover:bg-gray-700 flex-shrink-0 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            removeSpeaker(speaker.id);
                          }
                        }}
                      >
                        <X className="w-3 h-3" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 