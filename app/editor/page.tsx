"use client" ;

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Edit3, Save, Plus, X, Sparkles, ArrowLeft } from 'lucide-react';
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { saveAs } from "file-saver";
interface SubtitleEntry {
  id: number;
  startTime: number;
  endTime: number;
  text1: string; // First language
  text2: string; // Second language
  editing?: boolean;
  speakerId?: number;
}

interface Speaker {
  id: number;
  name: string;
  color: string;
}

const VideoSubtitleEditor: React.FC = () => {
  const router = useRouter();

  // Video state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Subtitle state
  const [subtitles, setSubtitles] = useState<SubtitleEntry[]>([]);
  const [activeSubtitleId, setActiveSubtitleId] = useState<number | null>(null);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);

  // Add to SubtitleEntry interface:
  //   editing?: boolean;
  //   speakerId?: number;

  // Add editing state for both lines
  const [editingSubtitleId, setEditingSubtitleId] = useState<number | null>(null);
  const [editingText2, setEditingText2] = useState<string>("");
  const editingInputRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSubtitleId !== null && editingInputRef2.current) {
      editingInputRef2.current.focus();
    }
  }, [editingSubtitleId]);

  const handleSubtitleClick = (subtitle: SubtitleEntry) => {
    setEditingSubtitleId(subtitle.id);
    setEditingText2(subtitle.text2);
  };

  const saveSubtitleEdit = (id: number) => {
    setSubtitles((subs) =>
      subs.map((s) =>
        s.id === id ? { ...s, text2: editingText2 } : s
      )
    );
    setEditingSubtitleId(null);
    setEditingText2("");
  };

  const cancelSubtitleEdit = () => {
    setEditingSubtitleId(null);
    setEditingText2("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === "Enter") {
      saveSubtitleEdit(id);
    } else if (e.key === "Escape") {
      cancelSubtitleEdit();
    }
  };

  // When video time changes, scroll to active subtitle
  useEffect(() => {
    if (activeSubtitleId !== null) {
      const element = document.getElementById(`subtitle-${activeSubtitleId}`);
      if (element && subtitleContainerRef.current) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeSubtitleId]);

  // Speaker state
  const [speakers, setSpeakers] = useState<Speaker[]>([
    { id: 1, name: 'Speaker 1', color: '#3B82F6' },
    { id: 2, name: 'Speaker 2', color: '#8B5CF6' },
  ]);
  const [editingSpeaker, setEditingSpeaker] = useState<number | null>(null);
  const [newSpeakerName, setNewSpeakerName] = useState<string>('');

  // Mock SRT data - in real app, this would come from uploaded file
  useEffect(() => {
    const mockSubtitles: SubtitleEntry[] = [
      { id: 1, startTime: 0, endTime: 3, text1: "Welcome to QuickScribe, the ultimate video subtitle tool.", text2: "QuickScribe में आपका स्वागत है, अंतिम वीडियो सबटाइटल टूल।" },
      { id: 2, startTime: 3.5, endTime: 7, text1: "Here you can sync your subtitles with precision timing.", text2: "यहाँ आप अपने सबटाइटल्स को सटीक समय के साथ सिंक कर सकते हैं।" },
      { id: 3, startTime: 7.5, endTime: 12, text1: "The interface is designed to be intuitive and user-friendly.", text2: "इंटरफ़ेस सहज और उपयोगकर्ता के अनुकूल है।" },
      { id: 4, startTime: 12.5, endTime: 16, text1: "You can edit speaker names and customize the experience.", text2: "आप स्पीकर के नाम संपादित कर सकते हैं और अनुभव को अनुकूलित कर सकते हैं।" },
      { id: 5, startTime: 16.5, endTime: 20, text1: "Real-time synchronization keeps everything perfectly aligned.", text2: "रीयल-टाइम सिंक्रोनाइज़ेशन सब कुछ पूरी तरह से संरेखित रखता है।" },
      { id: 6, startTime: 20.5, endTime: 24, text1: "Professional video editing has never been this accessible.", text2: "पेशेवर वीडियो संपादन कभी इतना सुलभ नहीं था।" },
      { id: 7, startTime: 24.5, endTime: 28, text1: "Export your work when you're satisfied with the results.", text2: "जब आप परिणाम से संतुष्ट हों तो अपना कार्य निर्यात करें।" },
    ];
    setSubtitles(mockSubtitles);
  }, []);

  // Video controls
  const togglePlayPause = (): void => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (): void => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Find active subtitle
      const active = subtitles.find(sub => time >= sub.startTime && time <= sub.endTime);
      if (active && active.id !== activeSubtitleId) {
        setActiveSubtitleId(active.id);
        scrollToActiveSubtitle(active.id);
      } else if (!active) {
        setActiveSubtitleId(null);
      }
    }
  };

  const scrollToActiveSubtitle = (subtitleId: number): void => {
    const element = document.getElementById(`subtitle-${subtitleId}`);
    if (element && subtitleContainerRef.current) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const seekToSubtitle = (startTime: number): void => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = (): void => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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
    const colors = ['#EF4444', '#10B981', '#F59E0B', '#EC4899', '#14B8A6'];
    const newSpeaker: Speaker = {
      id: speakers.length + 1,
      name: `Speaker ${speakers.length + 1}`,
      color: colors[speakers.length % colors.length]
    };
    setSpeakers(prev => [...prev, newSpeaker]);
  };

  const removeSpeaker = (id: number): void => {
    setSpeakers(prev => prev.filter(speaker => speaker.id !== id));
  };

  // Assign speaker to active subtitle
  const assignSpeakerToActiveSubtitle = (speakerId: number) => {
    if (activeSubtitleId !== null) {
      setSubtitles((subs) =>
        subs.map((s) =>
          s.id === activeSubtitleId ? { ...s, speakerId } : s
        )
      );
    }
  };

  // Add exportSRT function
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
    <div className="min-h-screen bg-background text-foreground w-screen relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none select-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/30 via-indigo-400/20 to-purple-400/10 blur-3xl opacity-60 dark:from-blue-700/40 dark:via-indigo-700/30 dark:to-purple-700/20 z-0" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-pink-400/20 via-purple-400/10 to-blue-400/10 blur-3xl opacity-50 dark:from-pink-700/30 dark:via-purple-700/20 dark:to-blue-700/20 z-0" />
      </div>
      {/* Header */}
      <div className="bg-card/70 backdrop-blur-sm border-b border-border/50 shadow-sm w-full">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl bg-muted hover:bg-muted/70 transition-colors duration-200 border border-border" onClick={() => {router.back() }}>
                <ArrowLeft className="w-5 h-5 text-foreground/70" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:bg-none dark:text-white">
                  QuickScribe Editor
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

      <div className="w-full h-[calc(100vh-76px)] grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Panel - Subtitles */}
        <div className="bg-card/70 backdrop-blur-sm rounded-none shadow-none border-r border-border/50 p-4 sm:p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Subtitles</h2>
            <div className="ml-auto text-sm text-muted-foreground">
              {subtitles.length} entries
            </div>
          </div>
          <div 
            ref={subtitleContainerRef}
            className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-900 scrollbar-track-transparent"
          >
            {subtitles.map((subtitle) => (
              <div
                key={subtitle.id}
                id={`subtitle-${subtitle.id}`}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden transition-transform transition-opacity ${
                  activeSubtitleId === subtitle.id
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-md scale-100 opacity-100'
                    : 'border-border hover:border-blue-300 hover:bg-card/80 scale-95 opacity-70'
                } ${editingSubtitleId === subtitle.id ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => activeSubtitleId === subtitle.id && handleSubtitleClick(subtitle)}
              >
                {subtitle.speakerId && (
                  <div className="mb-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: speakers.find(s => s.id === subtitle.speakerId)?.color || '#888' }}></span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {speakers.find(s => s.id === subtitle.speakerId)?.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    activeSubtitleId === subtitle.id ? 'bg-blue-400 animate-pulse' : 'bg-muted-foreground/40'
                  }`}></div>
                  <span className="text-sm lg:text-base font-medium text-muted-foreground">
                    {formatTime(subtitle.startTime)} → {formatTime(subtitle.endTime)}
                  </span>
                </div>
                {editingSubtitleId === subtitle.id ? (
                  <div className="space-y-1">
                    <p className={`text-base lg:text-lg leading-relaxed ${
                      activeSubtitleId === subtitle.id ? 'text-foreground font-semibold' : 'text-muted-foreground'
                    }`}>
                      {subtitle.text1}
                    </p>
                    <input
                      ref={editingInputRef2}
                      className="text-base lg:text-lg leading-relaxed text-foreground font-semibold bg-transparent border-b border-blue-400 outline-none w-full"
                      value={editingText2}
                      onChange={e => setEditingText2(e.target.value)}
                      onBlur={() => saveSubtitleEdit(subtitle.id)}
                      onKeyDown={e => handleEditKeyDown(e, subtitle.id)}
                      placeholder="Second language..."
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className={`text-base lg:text-lg leading-relaxed ${
                      activeSubtitleId === subtitle.id ? 'text-foreground font-semibold' : 'text-muted-foreground'
                    }`}>
                      {subtitle.text1}
                    </p>
                    <p className={`text-base lg:text-lg leading-relaxed ${
                      activeSubtitleId === subtitle.id ? 'text-foreground font-semibold' : 'text-muted-foreground'
                    }`}>
                      {subtitle.text2}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Video on top, speakers below */}
        <div className="flex flex-col h-full">
          {/* Video Player */}
          <div className="bg-card/70 backdrop-blur-sm shadow-none border-b border-border/50 p-4 sm:p-6 flex-none">
            <div className="w-full h-[32vw] max-h-[50vh] min-h-[240px] aspect-video bg-background rounded-xl overflow-hidden relative group">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                  }
                }}
                onClick={togglePlayPause}
              >
                {/* In real app, video source would come from uploaded file */}
                <source src="sample-video.mp4" type="video/mp4" />
              </video>
              
              {/* Video overlay controls */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-slate-700" />
                  ) : (
                    <Play className="w-8 h-8 text-slate-700 ml-1" />
                  )}
                </button>
              </div>

              {/* Video progress bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlayPause} className="text-white hover:text-blue-300 transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  
                  <div className="flex-1 bg-white/30 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-400 h-full transition-all duration-100"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>
                  
                  <span className="text-white text-sm font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  
                  <button onClick={toggleMute} className="text-white hover:text-blue-300 transition-colors">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Speaker management below video, fills remaining space */}
          <div className="bg-card/70 backdrop-blur-sm shadow-none flex-1 flex flex-col overflow-y-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Speakers</h2>
              </div>
              <button
                onClick={addSpeaker}
                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {speakers.map((speaker) => (
                <div key={speaker.id} className={`flex items-center gap-3 p-3 bg-muted rounded-xl border border-border cursor-pointer ${activeSubtitleId !== null && subtitles.find(s => s.id === activeSubtitleId)?.speakerId === speaker.id ? 'ring-2 ring-blue-400' : ''}`}
                  onClick={() => assignSpeakerToActiveSubtitle(speaker.id)}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: speaker.color }}
                  ></div>
                  {editingSpeaker === speaker.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={newSpeakerName}
                        onChange={(e) => setNewSpeakerName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-background text-foreground"
                        autoFocus
                      />
                      <button
                        onClick={() => saveSpeakerName(speaker.id)}
                        className="p-1 text-emerald-600 hover:text-emerald-700"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{speaker.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditingSpeaker(speaker.id, speaker.name)}
                          className="p-1 text-muted-foreground hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {speakers.length > 1 && (
                          <button
                            onClick={() => removeSpeaker(speaker.id)}
                            className="p-1 text-muted-foreground hover:text-rose-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSubtitleEditor;