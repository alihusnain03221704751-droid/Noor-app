import React, { useState, useEffect, useRef } from 'react';
import { QURAN_RECITERS, QUICK_FEATURED_SURAHS, QariReciter } from '../data/reciters';
import { SURAHS_LIST } from '../data/surahs';
import { useLanguage } from '../context/LanguageContext';
import { recordReadingAyahs } from '../utils/quranGoalTracker';
import { HolyQuranIcon } from './HolyQuranIcon';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Sparkles,
  Headphones,
  Download,
  ExternalLink,
  ChevronDown,
  Sliders,
  Check,
  Disc,
  Radio,
  Share2
} from 'lucide-react';

interface SurahAudioPlayerProps {
  currentSurahNumber: number;
  onSelectSurah?: (surahNum: number) => void;
}

export const SurahAudioPlayer: React.FC<SurahAudioPlayerProps> = ({
  currentSurahNumber,
  onSelectSurah
}) => {
  const { language } = useLanguage();

  // Selected Surah for playback
  const [activeSurahNum, setActiveSurahNum] = useState<number>(currentSurahNumber || 1);
  const [selectedReciterId, setSelectedReciterId] = useState<string>(() => {
    return localStorage.getItem('noor_preferred_reciter') || 'alafasy';
  });

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('noor_audio_volume');
    return saved ? Number(saved) : 0.85;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeReciter = QURAN_RECITERS.find((r) => r.id === selectedReciterId) || QURAN_RECITERS[0];
  const activeSurahMeta = SURAHS_LIST.find((s) => s.number === activeSurahNum) || SURAHS_LIST[0];

  // Sync with prop when user changes surah in Quran view
  useEffect(() => {
    if (currentSurahNumber && currentSurahNumber !== activeSurahNum) {
      setActiveSurahNum(currentSurahNumber);
    }
  }, [currentSurahNumber]);

  // Save reciter preference
  useEffect(() => {
    localStorage.setItem('noor_preferred_reciter', selectedReciterId);
  }, [selectedReciterId]);

  // Audio setup and URL handling
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const primaryUrl = activeReciter.getAudioUrl(activeSurahNum);
    audio.src = primaryUrl;
    audio.preload = 'metadata';
    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackRate;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
      setAudioError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);

      // Record completed Surah Ayahs toward daily goal
      recordReadingAyahs(activeSurahMeta.totalAyat);

      if (isLooping) {
        audio.currentTime = 0;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      } else if (autoPlayNext && activeSurahNum < 114) {
        // Auto play next Surah
        const nextNum = activeSurahNum + 1;
        setActiveSurahNum(nextNum);
        if (onSelectSurah) onSelectSurah(nextNum);
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      // Try fallback URL if available
      if (activeReciter.getFallbackUrl && audio.src !== activeReciter.getFallbackUrl(activeSurahNum)) {
        audio.src = activeReciter.getFallbackUrl(activeSurahNum);
        audio.load();
        if (isPlaying) {
          audio.play().catch(() => {});
        }
      } else {
        setAudioError(
          language === 'en'
            ? 'Unable to load audio stream from external CDN. Please check your internet connection.'
            : 'آڈیو لوڈ کرنے میں دشواری پیش آئی۔ انٹرنیٹ کنکشن چیک کریں۔'
        );
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    if (isPlaying) {
      setIsLoading(true);
      audio.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch((e) => {
        setIsPlaying(false);
        setIsLoading(false);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, [activeSurahNum, selectedReciterId]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      localStorage.setItem('noor_audio_volume', volume.toString());
    }
  }, [volume, isMuted]);

  // Playback rate change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setAudioError(null);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setIsPlaying(false);
          // Try fallback
          if (activeReciter.getFallbackUrl) {
            audioRef.current!.src = activeReciter.getFallbackUrl(activeSurahNum);
            audioRef.current!.play().then(() => setIsPlaying(true)).catch(() => {
              setAudioError('Failed to play recitation stream.');
            });
          }
        });
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Number(e.target.value);
    setCurrentTime(target);
    if (audioRef.current) {
      audioRef.current.currentTime = target;
    }
  };

  const handleSurahChange = (surahNum: number) => {
    setActiveSurahNum(surahNum);
    setCurrentTime(0);
    setAudioError(null);
    if (onSelectSurah) {
      onSelectSurah(surahNum);
    }
    // Automatically start playing selected surah if already playing or requested
    if (isPlaying && audioRef.current) {
      setIsLoading(true);
    }
  };

  const handlePreviousSurah = () => {
    if (activeSurahNum > 1) {
      handleSurahChange(activeSurahNum - 1);
    }
  };

  const handleNextSurah = () => {
    if (activeSurahNum < 114) {
      handleSurahChange(activeSurahNum + 1);
    }
  };

  const formatTime = (secs: number): string => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentStreamUrl = activeReciter.getAudioUrl(activeSurahNum);

  return (
    <div className="bg-linear-to-br from-[#0a2014] via-[#143825] to-[#091a10] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-700/60 ring-1 ring-amber-400/20 relative overflow-hidden transition-all duration-300">
      {/* Subtle Islamic Motif Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-emerald-700/50 relative z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <HolyQuranIcon size="md" withGlow={true} className="ring-2 ring-amber-400/50 shadow-md shrink-0" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="font-display font-bold text-sm sm:text-lg text-white tracking-wide truncate">
                {language === 'en' ? 'High-Quality Audio Recitation' : 'تلاوتِ کلامِ پاک (مکمل آڈیو)'}
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                HQ 128kbps CDN
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 font-urdu">
              {language === 'en'
                ? 'Crystal clear studio recitations by world-renowned Qaris'
                : 'عالمی شہرت یافتہ قراء کرام کی مستند اور دلکش تلاوت'}
            </p>
          </div>
        </div>

        {/* Min/Max toggle button & external download */}
        <div className="flex items-center gap-2">
          <a
            href={currentStreamUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`${activeSurahMeta.nameEnglish}_Recitation.mp3`}
            className="p-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors border border-emerald-600/40 text-xs hidden sm:flex items-center gap-1.5"
            title="آڈیو ڈاؤن لوڈ کریں (MP3)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px]">MP3</span>
          </a>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-xs font-medium text-emerald-100 transition-colors flex items-center gap-1 border border-emerald-600/40"
          >
            <span>{isExpanded ? (language === 'en' ? 'Collapse' : 'مختصر کریں') : (language === 'en' ? 'Expand' : 'پھیلائیں')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Playing Information Banner */}
      <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
        {/* Left Column: Active Surah Name and Qari Info */}
        <div className="md:col-span-4 flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-amber-500/20 to-emerald-600/30 border border-amber-400/40 flex items-center justify-center p-0.5 shadow-sm">
              <HolyQuranIcon size="custom" className="w-12 h-12" withGlow={isPlaying} />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            )}
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm sm:text-base text-white truncate">
                {activeSurahMeta.nameEnglish}
              </h4>
              <span className="font-arabic font-bold text-amber-300 text-sm">
                ({activeSurahMeta.nameArabic})
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 font-urdu flex items-center gap-1.5 truncate">
              <span className="font-medium text-amber-300">{activeReciter.nameUrdu}</span>
              <span className="opacity-50">·</span>
              <span className="text-[11px] text-emerald-300">{activeSurahMeta.revelationPlaceUrdu}</span>
            </p>
          </div>
        </div>

        {/* Center Column: Audio Playback Controls */}
        <div className="md:col-span-8 space-y-3">
          {/* Controls Row: Previous, Play/Pause, Next, Stop, Volume, Rate */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4">
            {/* Sound Wave Animation when active */}
            {isPlaying && (
              <div className="hidden lg:flex items-center gap-0.5 h-5 px-2 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30">
                <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s] h-4" />
                <span className="w-1 bg-amber-300 rounded-full animate-bounce h-2" />
                <span className="w-1 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.25s] h-4" />
                <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.1s] h-3" />
              </div>
            )}

            {/* Playback Speed selector */}
            <div className="flex items-center gap-1 bg-emerald-950/50 p-1 rounded-xl border border-emerald-700/60 text-xs">
              {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                    playbackRate === rate
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                  title={`رفتار: ${rate}x`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Loop / Repeat button */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 rounded-xl border transition-colors ${
                isLooping
                  ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold'
                  : 'bg-emerald-950/50 text-emerald-200 border-emerald-700/60 hover:text-white'
              }`}
              title={isLooping ? 'تکرار فعال ہے (سنگل سورۃ)' : 'سورۃ کا تکرار (Loop)'}
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Previous Surah button */}
            <button
              onClick={handlePreviousSurah}
              disabled={activeSurahNum <= 1}
              className="p-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="پچھلی سورۃ سنیں"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Primary Big Play / Pause Button */}
            <button
              onClick={togglePlay}
              className="p-3.5 sm:px-5 rounded-2xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 flex items-center gap-2"
              title={isPlaying ? 'تلاوت روکیں (Pause)' : 'تلاوت شروع کریں (Play)'}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span className="text-xs font-semibold hidden sm:inline">روکیں</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span className="text-xs font-semibold hidden sm:inline">سنیں</span>
                </>
              )}
            </button>

            {/* Next Surah button */}
            <button
              onClick={handleNextSurah}
              disabled={activeSurahNum >= 114}
              className="p-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="اگلی سورۃ سنیں"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Stop button */}
            <button
              onClick={handleStop}
              className="p-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 hover:text-white transition-colors"
              title="تلاوت بند کریں"
            >
              <Square className="w-4 h-4" />
            </button>

            {/* Volume & Mute Control */}
            <div className="flex items-center gap-2 bg-emerald-950/50 px-2.5 py-1.5 rounded-xl border border-emerald-700/60">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-emerald-200 hover:text-white transition-colors"
                title={isMuted ? 'آواز کھولیں' : 'میوٹ کریں'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 accent-amber-400 cursor-pointer h-1.5 rounded-lg"
              />
            </div>
          </div>

          {/* Scrubbing & Progress Timeline Bar */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-emerald-950/80 rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span className="text-[10px] text-emerald-400/80 font-sans">
                {autoPlayNext ? (language === 'en' ? 'Auto-play Next Surah On' : 'اگلی سورۃ خودکار پلے') : ''}
              </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error message indicator if any */}
      {audioError && (
        <div className="mt-3 p-2.5 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-center justify-between">
          <span>{audioError}</span>
          <button
            onClick={() => {
              setAudioError(null);
              togglePlay();
            }}
            className="px-2.5 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold"
          >
            دوبارہ کوشش
          </button>
        </div>
      )}

      {/* Expanded Controls: Specific Surah Selector + Reciter Dropdown + Quick Featured Surahs */}
      {isExpanded && (
        <div className="mt-5 pt-4 border-t border-emerald-700/50 space-y-4 animate-fade-in relative z-10">
          {/* Pickers Row: Select Reciter & Select Surah */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Reciter Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-200 flex items-center justify-between">
                <span>{language === 'en' ? 'Reciter (قاری کا انتخاب):' : 'تلاوت کنندہ قاری کا انتخاب:'}</span>
                <span className="text-[10px] text-amber-300 font-mono">6 مشہور قراء کرام</span>
              </label>
              <select
                value={selectedReciterId}
                onChange={(e) => setSelectedReciterId(e.target.value)}
                className="w-full bg-[#163325] border border-emerald-600/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {QURAN_RECITERS.map((reciter) => (
                  <option key={reciter.id} value={reciter.id} className="bg-stone-900 text-white">
                    {reciter.nameEnglish} ({reciter.nameUrdu}) - {reciter.style}
                  </option>
                ))}
              </select>
            </div>

            {/* Surah Selector from all 114 Surahs */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-200 flex items-center justify-between">
                <span>{language === 'en' ? 'Select Specific Surah:' : 'مخصوص سورۃ کا انتخاب کریں:'}</span>
                <span className="text-[10px] text-amber-300 font-mono">114 سورتیں دستیاب</span>
              </label>
              <select
                value={activeSurahNum}
                onChange={(e) => handleSurahChange(Number(e.target.value))}
                className="w-full bg-[#163325] border border-emerald-600/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {SURAHS_LIST.map((surah) => (
                  <option key={surah.number} value={surah.number} className="bg-stone-900 text-white">
                    #{surah.number} - {surah.nameEnglish} ({surah.nameUrdu}) · {surah.totalAyat} آیات ({surah.revelationPlaceUrdu})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick One-Touch Surah Chips (Frequently Recited / Virtues) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'en' ? 'Quick Access Specific Surahs:' : 'اہم و کثیر التلاوت سورتیں (ایک کلک پر تلاوت):'}</span>
              </span>
              <span className="text-[11px] text-emerald-300/80 font-urdu hidden sm:inline">
                فضائل و برکات والی سورتیں
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QUICK_FEATURED_SURAHS.map((item) => {
                const isItemActive = activeSurahNum === item.number;
                return (
                  <button
                    key={item.number}
                    onClick={() => handleSurahChange(item.number)}
                    className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      isItemActive
                        ? 'bg-amber-400/20 border-amber-300 text-white shadow-xs ring-1 ring-amber-300/40'
                        : 'bg-emerald-950/40 border-emerald-700/50 hover:bg-emerald-900/60 text-emerald-100 hover:border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isItemActive ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-emerald-800 text-emerald-200'
                      }`}>
                        #{item.number}
                      </span>
                      <span className="font-urdu font-bold text-xs text-amber-200">
                        {item.titleUrdu}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between w-full text-[10px]">
                      <span className="text-emerald-300 truncate max-w-[110px]">{item.nameEnglish}</span>
                      {isItemActive && isPlaying && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
