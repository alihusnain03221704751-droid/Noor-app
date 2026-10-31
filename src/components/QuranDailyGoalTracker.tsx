import React, { useState, useEffect } from 'react';
import {
  loadDailyReadingState,
  recordReadingAyahs,
  updateDailyTarget,
  resetTodayReading,
  DailyReadingState,
  QURAN_READING_UPDATED_EVENT
} from '../utils/quranGoalTracker';
import { useLanguage } from '../context/LanguageContext';
import { HolyQuranIcon } from './HolyQuranIcon';
import {
  Trophy,
  Flame,
  Plus,
  Minus,
  Settings2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  RotateCcw,
  Check,
  ChevronDown
} from 'lucide-react';

export const QuranDailyGoalTracker: React.FC = () => {
  const { language } = useLanguage();
  const [state, setState] = useState<DailyReadingState>(() => loadDailyReadingState());
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [customGoalInput, setCustomGoalInput] = useState<string>('20');
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Sync with storage and events
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<DailyReadingState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      } else {
        setState(loadDailyReadingState());
      }
    };

    window.addEventListener(QURAN_READING_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(QURAN_READING_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const { targetAyahs, readAyahs, streakDays } = state;
  const progressPercent = Math.min(100, targetAyahs > 0 ? Math.round((readAyahs / targetAyahs) * 100) : 0);
  const isGoalAchieved = readAyahs >= targetAyahs;
  const remainingAyahs = Math.max(0, targetAyahs - readAyahs);

  // Trigger brief celebration animation when reaching goal
  useEffect(() => {
    if (isGoalAchieved && readAyahs > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isGoalAchieved, readAyahs]);

  const handleIncrement = (count: number) => {
    recordReadingAyahs(count);
  };

  const handleSetTarget = (newTarget: number) => {
    updateDailyTarget(newTarget);
    setIsEditingGoal(false);
  };

  const PRESET_GOALS = [5, 10, 20, 30, 50, 100];

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-[#0a2014] via-[#143825] to-[#0c2417] text-white p-5 sm:p-6 shadow-xl border border-emerald-700/60 ring-1 ring-amber-400/25">
      {/* Background Decorative Motifs */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Header Row: Title, Streak Badge & Goal Config Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <HolyQuranIcon size="sm" withGlow={true} className="ring-2 ring-amber-400/50 shrink-0" />
              {isGoalAchieved && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-bold shadow-xs">
                  ✓
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-white tracking-wide">
                  {language === 'en' ? 'Daily Quran Reading Goal' : 'روزانہ تلاوتِ قرآن کا ہدف'}
                </h3>
                {isGoalAchieved && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{language === 'en' ? 'Achieved' : 'مکمل'}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/80 font-urdu">
                {language === 'en'
                  ? 'Track your daily Quran recitation progress and maintain consistent habit'
                  : 'روزانہ تلاوتِ کلامِ پاک کی نگرانی اور استقامت کا ذریعہ'}
              </p>
            </div>
          </div>

          {/* Badges: Streak & Target Selector Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Daily Streak Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                streakDays > 0
                  ? 'bg-amber-500/15 text-amber-300 border-amber-400/40 shadow-xs'
                  : 'bg-emerald-950/60 text-emerald-200/70 border-emerald-800/40'
              }`}
              title={language === 'en' ? `${streakDays} Days Consistent Reading Streak` : `${streakDays} روزہ مسلسل تلاوت`}
            >
              <Flame className={`w-4 h-4 ${streakDays > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-stone-400'}`} />
              <span className="font-mono font-bold text-sm">{streakDays}</span>
              <span className="text-[11px] font-urdu">
                {language === 'en' ? 'Day Streak' : 'روزہ تسلسل'}
              </span>
            </div>

            {/* Goal Setting Toggle */}
            <button
              onClick={() => {
                setCustomGoalInput(targetAyahs.toString());
                setIsEditingGoal(!isEditingGoal);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-200 hover:text-white border border-emerald-700/60 text-xs font-medium transition-colors"
              title={language === 'en' ? 'Change daily goal' : 'روزانہ کا ہدف تبدیل کریں'}
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-mono font-bold text-amber-300">{targetAyahs}</span>
              <span className="text-[11px]">{language === 'en' ? 'Goal' : 'ہدف'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isEditingGoal ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Goal Preset / Edit Drawer */}
        {isEditingGoal && (
          <div className="p-4 rounded-2xl bg-[#07170e] border border-emerald-700/60 space-y-3 animate-fade-in text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-200 flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'en' ? 'Set Daily Target (Number of Ayahs)' : 'روزانہ آیات کی تلاوت کا ہدف مقرر کریں:'}</span>
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                {language === 'en' ? 'Current: ' : 'موجودہ: '}{targetAyahs} {language === 'en' ? 'Ayahs' : 'آیات'}
              </span>
            </div>

            {/* Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_GOALS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSetTarget(p)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    targetAyahs === p
                      ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300 shadow-sm'
                      : 'bg-emerald-900/60 text-emerald-200 hover:text-white hover:bg-emerald-800 border border-emerald-700/50'
                  }`}
                >
                  {p} {language === 'en' ? 'Ayahs' : 'آیات'}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min="1"
                max="1000"
                value={customGoalInput}
                onChange={(e) => setCustomGoalInput(e.target.value)}
                placeholder="Custom goal"
                className="w-28 px-3 py-1.5 bg-[#0a2014] text-white border border-emerald-700 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={() => {
                  const val = parseInt(customGoalInput, 10);
                  if (!isNaN(val) && val > 0) {
                    handleSetTarget(val);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-xs"
              >
                {language === 'en' ? 'Apply' : 'محفوظ کریں'}
              </button>
              <button
                onClick={() => setIsEditingGoal(false)}
                className="px-3 py-1.5 rounded-xl text-stone-400 hover:text-white"
              >
                {language === 'en' ? 'Cancel' : 'منسوخ'}
              </button>
            </div>
          </div>
        )}

        {/* PROGRESS METRICS & VISUAL PROGRESS BAR */}
        <div className="space-y-2">
          {/* Numbers Row */}
          <div className="flex items-baseline justify-between text-xs">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white">
                {readAyahs}
              </span>
              <span className="text-emerald-300 font-mono text-sm sm:text-base">
                / {targetAyahs}
              </span>
              <span className="text-emerald-200/90 font-urdu text-xs sm:text-sm font-medium">
                {language === 'en' ? 'Ayahs Read Today' : 'آیات آج تلاوت کی گئیں'}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 font-mono">
              <span className={`text-lg sm:text-xl font-bold ${isGoalAchieved ? 'text-amber-300' : 'text-emerald-300'}`}>
                {progressPercent}%
              </span>
              <span className="text-emerald-200/70 text-[10px] uppercase font-sans">
                {language === 'en' ? 'Completed' : 'مکمل'}
              </span>
            </div>
          </div>

          {/* Visual Progress Bar Container with Glowing Gradient Fill */}
          <div className="relative w-full h-4 sm:h-5 rounded-full bg-emerald-950/70 border border-emerald-700/50 p-0.5 shadow-inner overflow-hidden">
            {/* Background Subtle Track Pattern */}
            <div className="absolute inset-0 bg-radial from-emerald-900/30 to-transparent pointer-events-none" />

            {/* Glowing Gradient Progress Bar */}
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                isGoalAchieved
                  ? 'bg-linear-to-r from-emerald-500 via-emerald-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                  : 'bg-linear-to-r from-[#059669] via-[#10b981] to-[#34d399] shadow-[0_0_8px_rgba(16,185,129,0.5)]'
              }`}
              style={{ width: `${progressPercent}%` }}
            >
              {/* Animated Leading Shimmer Light */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />

              {/* End Knob when progress > 0 */}
              {progressPercent > 0 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-xs border border-amber-300" />
              )}
            </div>
          </div>

          {/* Motivational Encouragement Banner */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-emerald-200">
              {isGoalAchieved ? (
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold font-urdu">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {language === 'en'
                      ? "Masha'Allah! You have completed today's reading goal."
                      : 'ماشاء اللہ! آپ نے آج کی تلاوت کا ہدف کامیابی سے مکمل فرما لیا ہے۔'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-200/90 text-[11px] sm:text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {language === 'en'
                      ? `${remainingAyahs} more ${remainingAyahs === 1 ? 'Ayah' : 'Ayahs'} to complete today's goal.`
                      : `ہدف کی تکمیل کے لیے مزید ${remainingAyahs} آیات کی تلاوت باقی ہے۔`}
                  </span>
                </div>
              )}
            </div>

            <span className="text-[10px] text-emerald-300/80 font-mono hidden sm:inline">
              {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ur-PK', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* QUICK LOGGING & INCREMENT CONTROLS */}
        <div className="pt-2 border-t border-emerald-800/50 flex flex-wrap items-center justify-between gap-2.5">
          {/* Quick Increment Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-emerald-200/80 font-medium mr-1 font-urdu">
              {language === 'en' ? 'Quick Log:' : 'تلاوت درج کریں:'}
            </span>

            <button
              onClick={() => handleIncrement(1)}
              className="px-3 py-1.5 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer ring-1 ring-amber-400/20"
              title="Add 1 Ayah to progress"
            >
              <Plus className="w-3 h-3" />
              <span>{language === 'en' ? '+1 Ayah' : '+۱ آیت'}</span>
            </button>

            <button
              onClick={() => handleIncrement(5)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-100 hover:text-white border border-emerald-700/60 font-bold text-xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              title="Add 5 Ayahs to progress"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>{language === 'en' ? '+5 Ayahs' : '+۵ آیات'}</span>
            </button>

            <button
              onClick={() => handleIncrement(10)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-100 hover:text-white border border-emerald-700/60 font-bold text-xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              title="Add 10 Ayahs to progress"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>{language === 'en' ? '+10 Ayahs' : '+۱۰ آیات'}</span>
            </button>

            {readAyahs > 0 && (
              <button
                onClick={() => handleIncrement(-1)}
                className="p-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900 text-stone-400 hover:text-stone-200 border border-emerald-800/40 transition-colors"
                title={language === 'en' ? 'Subtract 1 Ayah' : '۱ آیت کم کریں'}
              >
                <Minus className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Reset Today's Count button if user wants fresh start */}
          {readAyahs > 0 && (
            <button
              onClick={() => {
                if (window.confirm(language === 'en' ? "Reset today's reading count to 0?" : "کیا آپ آج کی تلاوت کاؤنٹر صفر کرنا چاہتے ہیں؟")) {
                  resetTodayReading();
                }
              }}
              className="text-[11px] text-emerald-300/70 hover:text-rose-300 flex items-center gap-1 transition-colors"
              title="Reset today's count"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'en' ? 'Reset Today' : 'صفر کریں'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
