"use client" ;

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Edit3, Save, Plus, X, Sparkles, ArrowLeft } from 'lucide-react';
import { useRouter } from "next/navigation";
interface SubtitleEntry {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
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
      { id: 1, startTime: 0, endTime: 3, text: "Welcome to QuickScribe, the ultimate video subtitle tool." },
      { id: 2, startTime: 3.5, endTime: 7, text: "Here you can sync your subtitles with precision timing." },
      { id: 3, startTime: 7.5, endTime: 12, text: "The interface is designed to be intuitive and user-friendly." },
      { id: 4, startTime: 12.5, endTime: 16, text: "You can edit speaker names and customize the experience." },
      { id: 5, startTime: 16.5, endTime: 20, text: "Real-time synchronization keeps everything perfectly aligned." },
      { id: 6, startTime: 20.5, endTime: 24, text: "Professional video editing has never been this accessible." },
      { id: 7, startTime: 24.5, endTime: 28, text: "Export your work when you're satisfied with the results." },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors duration-200" onClick={() => {router.back() }}>
                <ArrowLeft className="w-5 h-5 text-slate-600" />
                
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  QuickScribe Editor
                </h1>
              </div>
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg">
              Export Project
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Subtitles */}
          <div className="col-span-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Subtitles</h2>
              <div className="ml-auto text-sm text-slate-500">
                {subtitles.length} entries
              </div>
            </div>

            <div 
              ref={subtitleContainerRef}
              className="space-y-3 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent"
            >
              {subtitles.map((subtitle) => (
                <div
                  key={subtitle.id}
                  id={`subtitle-${subtitle.id}`}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    activeSubtitleId === subtitle.id
                      ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onClick={() => seekToSubtitle(subtitle.startTime)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      activeSubtitleId === subtitle.id ? 'bg-blue-400 animate-pulse' : 'bg-slate-300'
                    }`}></div>
                    <span className="text-sm font-medium text-slate-600">
                      {formatTime(subtitle.startTime)} → {formatTime(subtitle.endTime)}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    activeSubtitleId === subtitle.id ? 'text-slate-800 font-medium' : 'text-slate-600'
                  }`}>
                    {subtitle.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-6 space-y-6">
            {/* Video Player */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative group">
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

            {/* Speakers Panel */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">Speakers</h2>
                </div>
                <button
                  onClick={addSpeaker}
                  className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {speakers.map((speaker) => (
                  <div key={speaker.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
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
                          className="flex-1 px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                        <span className="text-sm font-medium text-slate-700">{speaker.name}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditingSpeaker(speaker.id, speaker.name)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {speakers.length > 1 && (
                            <button
                              onClick={() => removeSpeaker(speaker.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
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
    </div>
  );
};

export default VideoSubtitleEditor;