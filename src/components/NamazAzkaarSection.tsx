import React, { useState } from 'react';
import { AZKAAR_DATA, TASBEEH_PRESETS } from '../data/azkaarData';
import { AzkaarItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Heart,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Share2
} from 'lucide-react';
import { IslamicAppIcon } from './IslamicAppIcon';

export const NamazAzkaarSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('namaz-steps');

  // Digital Tasbeeh Counter state
  const [tasbeehPreset, setTasbeehPreset] = useState(TASBEEH_PRESETS[0]);
  const [counter, setCounter] = useState<number>(0);
  const [totalCountHistory, setTotalCountHistory] = useState<number>(() => {
    const saved = localStorage.getItem('noor_tasbeeh_total');
    return saved ? Number(saved) : 0;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const categories = [
    { id: 'namaz-steps', label: t('namaz_steps'), count: 11 },
    { id: 'morning', label: t('morning_azkaar'), count: 3 },
    { id: 'evening', label: t('evening_azkaar'), count: 2 },
    { id: 'after-prayer', label: t('after_prayer'), count: 2 },
    { id: 'sleep', label: t('sleep_waking'), count: 2 },
    { id: 'daily', label: t('daily_duas'), count: 4 },
    { id: 'tasbeeh', label: t('digital_tasbeeh'), count: 7 },
  ];

  const filteredItems = AZKAAR_DATA.filter((item) => item.category === activeCategory);

  const handleTasbeehClick = () => {
    const newCount = counter + 1;
    setCounter(newCount);
    const newTotal = totalCountHistory + 1;
    setTotalCountHistory(newTotal);
    localStorage.setItem('noor_tasbeeh_total', newTotal.toString());

    // Play subtle audio click / feedback if sound is on
    if (soundEnabled) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(650, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        }
      } catch {
        // Ignore audio error
      }
    }
  };

  const handleResetTasbeeh = () => {
    setCounter(0);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e5d8c3] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <IslamicAppIcon type="azkaar" size="md" withGlow={true} className="ring-2 ring-emerald-500/30 shadow-md" />
          <div>
            <h2 className="font-display font-bold text-lg text-stone-900 tracking-tight">
              {language === 'en' ? 'Daily Azkaar & Digital Tasbeeh' : 'اذکارِ مسنونہ و ڈیجیٹل تسبیح'}
            </h2>
            <p className="text-xs text-stone-500 font-urdu">
              {language === 'en'
                ? 'Authentic morning, evening, prayer steps & interactive tasbeeh counter'
                : 'صبح و شام کے اذکار، نماز کے بعد مسنون دعائیں اور ڈیجیٹل تسبیح کاؤنٹر'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-2xl p-3 shadow-xs border border-emerald-900/15 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-linear-to-r from-[#0a2014] to-[#143825] text-amber-300 ring-1 ring-amber-400/40 shadow-xs font-bold'
                    : 'text-stone-700 hover:text-emerald-950 hover:bg-emerald-50'
                }`}
              >
                <span className="text-xs font-semibold">{cat.label}</span>
                <span className="text-[10px] opacity-75 font-sans">({cat.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER DIGITAL TASBEEH COUNTER IF SELECTED (Matching Habits Streak Screen 4) */}
      {activeCategory === 'tasbeeh' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Preset Selector */}
          <div className="md:col-span-5 bg-white rounded-[28px] p-5 border border-emerald-900/15 shadow-sm space-y-3">
            <h3 className="font-urdu font-bold text-base text-[#0a2014]">
              تسبیح یا ذکر کا انتخاب کریں:
            </h3>

            <div className="space-y-2">
              {TASBEEH_PRESETS.map((preset) => {
                const isSelected = tasbeehPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setTasbeehPreset(preset);
                      setCounter(0);
                    }}
                    className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-[#0a2014] font-bold ring-1 ring-emerald-500/40'
                        : 'border-stone-200 hover:border-emerald-400 text-stone-800 hover:bg-[#f4f9f6]'
                    }`}
                  >
                    <span className="text-xs font-mono text-stone-500 bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                      ہدف: {preset.target}
                    </span>
                    <div>
                      <div className="font-arabic text-base">{preset.titleArabic}</div>
                      <div className="font-urdu text-xs text-stone-600">{preset.titleUrdu}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Habits-Style Deep Sage Tasbeeh Card */}
          <div className="md:col-span-7 rounded-[32px] bg-linear-to-br from-[#0a2014] via-[#143825] to-[#091a10] text-white p-6 sm:p-8 border border-emerald-700/60 ring-1 ring-amber-400/20 shadow-xl text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold font-urdu">
                موجودہ ذکر
              </span>
              <h2 className="font-arabic text-3xl sm:text-4xl font-bold text-amber-100 mt-2" dir="rtl">
                {tasbeehPreset.titleArabic}
              </h2>
              <p className="font-urdu text-emerald-200/90 text-sm">{tasbeehPreset.titleUrdu}</p>
            </div>

            {/* Circular Digital Counter Display matching Reference Streak Ring */}
            <div className="relative w-52 h-52 rounded-full bg-[#0a2014] text-white flex flex-col items-center justify-center shadow-2xl border-4 border-amber-400 ring-4 ring-emerald-500/30">
              <span className="text-xs text-amber-300/80 uppercase tracking-widest font-mono">COUNT</span>
              <div className="text-6xl font-extrabold font-mono text-white my-1">
                {counter}
              </div>
              <span className="text-xs text-stone-400 font-mono">
                ہدف: {tasbeehPreset.target}
              </span>

              {counter >= tasbeehPreset.target && (
                <div className="absolute -bottom-2 bg-amber-400 text-stone-950 font-bold text-[10px] px-3 py-0.5 rounded-full font-urdu shadow-md">
                  ماشاء اللہ! ہدف مکمل
                </div>
              )}
            </div>

            {/* Giant Click Button */}
            <button
              onClick={handleTasbeehClick}
              className="w-full max-w-sm py-4 px-6 rounded-full bg-white text-[#1b382b] hover:bg-amber-100 font-bold text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>سبحان اللہ (تسبیح پڑھیں)</span>
            </button>

            {/* Reset & Sound Controls */}
            <div className="flex items-center gap-4 text-xs relative z-10">
              <button
                onClick={handleResetTasbeeh}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 rounded-xl transition-colors font-medium border border-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>کاؤنٹر صفر کریں (Reset)</span>
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-stone-200 rounded-xl transition-colors font-medium border border-white/10"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
                <span>آواز: {soundEnabled ? 'چالو' : 'بند'}</span>
              </button>
            </div>

            <p className="text-xs text-stone-400 font-mono">
              کل پڑھی گئی تسبیحات: {totalCountHistory}
            </p>
          </div>
        </div>
      ) : (
        /* RENDER CATEGORIZED AZKAAR & STEP-BY-STEP NAMAZ */
        <div className="space-y-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              {/* Title & Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs font-mono">
                    {index + 1}
                  </span>
                  <h3 className="font-urdu font-bold text-lg text-stone-900">
                    {item.titleUrdu}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500">
                  {item.recommendedRepeat && (
                    <span className="bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-full font-urdu border border-amber-200 font-semibold">
                      تعداد: {item.recommendedRepeat} مرتبہ
                    </span>
                  )}
                  <span className="font-urdu text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                    حوالہ: {item.reference}
                  </span>
                </div>
              </div>

              {/* Authentic Arabic Text with Harakaat */}
              <div
                dir="rtl"
                className="font-arabic text-right text-2xl sm:text-3xl font-bold leading-loose text-stone-950 py-1 tracking-wide"
              >
                {item.arabicText}
              </div>

              {/* Urdu Translation */}
              <div
                dir="rtl"
                className="font-urdu text-right text-base text-stone-700 pt-2 border-t border-stone-100 leading-relaxed"
              >
                <span className="font-semibold text-emerald-900 ml-1">ترجمہ: </span>
                {item.urduTranslation}
              </div>

              {/* Benefit / Reference Details */}
              {item.benefitUrdu && (
                <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-200/60 text-xs font-urdu text-emerald-950 leading-relaxed flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">فضیلت و طریقہ: </span>
                    {item.benefitUrdu}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
