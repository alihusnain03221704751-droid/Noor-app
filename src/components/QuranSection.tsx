import React, { useState, useEffect } from 'react';
import { QuranTranslationView } from './QuranTranslationView';
import { Quran16LineView } from './Quran16LineView';
import { SurahAudioPlayer } from './SurahAudioPlayer';
import { QuranDailyGoalTracker } from './QuranDailyGoalTracker';
import { useLanguage } from '../context/LanguageContext';
import { HolyQuranIcon } from './HolyQuranIcon';
import { BookOpen, Layers, Sparkles, CheckCircle2, BookmarkCheck } from 'lucide-react';

export const QuranSection: React.FC = () => {
  const { t, language } = useLanguage();

  const [quranMode, setQuranMode] = useState<'translation' | '16line'>(() => {
    const saved = localStorage.getItem('noor_preferred_quran_mode');
    return saved === '16line' || saved === 'translation' ? saved : 'translation';
  });

  const [activeSurahNumber, setActiveSurahNumber] = useState<number>(() => {
    const saved = localStorage.getItem('noor_active_surah_number');
    return saved ? Number(saved) : 1;
  });

  const handleModeChange = (mode: 'translation' | '16line') => {
    setQuranMode(mode);
    localStorage.setItem('noor_preferred_quran_mode', mode);
  };

  const handleSelectSurah = (num: number) => {
    setActiveSurahNumber(num);
    localStorage.setItem('noor_active_surah_number', num.toString());
  };

  return (
    <div className="space-y-6">
      {/* Visual Progress Bar to Track Daily Quran Reading Goal */}
      <QuranDailyGoalTracker />

      {/* High-Quality Surah Audio Player with External CDN APIs */}
      <SurahAudioPlayer
        currentSurahNumber={activeSurahNumber}
        onSelectSurah={handleSelectSurah}
      />

      {/* Dedicated Quran Mode Switcher Toolbar */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-xs border border-emerald-900/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Title & Mode Indicator */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <HolyQuranIcon size="sm" withGlow={true} className="ring-2 ring-amber-400/50 shrink-0" />
              <h2 className="font-display font-bold text-base sm:text-lg text-[#0a2014] tracking-tight">
                {language === 'en' ? 'Holy Quran Display Mode' : 'قرآن مجید کا ڈسپلے موڈ'}
              </h2>
              <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                {quranMode === 'translation' ? 'TRANSLATION' : '16-LINE MUSHAF'}
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {quranMode === 'translation'
                ? (language === 'en'
                    ? 'Authentic Arabic Uthmani text with Maulana Jalandhry Urdu translation, audio recitation & Ayah search.'
                    : 'مستند عربی متن، اردو ترجمہ، تلاوت اور آیات کی تلاش۔')
                : (language === 'en'
                    ? 'Traditional Indo-Pak Mushaf layout (16 lines per page, strictly without translation, 548 pages).'
                    : 'روایتی ۱۶ سطری پاک و ہند مصحف (۵۴۸ صفحات، بغیر ترجمہ، حفظ قرآن کے لیے مخصوص)۔')}
            </p>
          </div>

          {/* Prominent Toggle Switcher Buttons */}
          <div className="inline-flex p-1.5 bg-[#f4f9f6] rounded-full border border-emerald-900/15 w-full sm:w-auto">
            {/* Option 1: Existing Quran View with Translation */}
            <button
              type="button"
              onClick={() => handleModeChange('translation')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                quranMode === 'translation'
                  ? 'bg-linear-to-r from-[#0a2014] to-[#143825] text-amber-300 ring-1 ring-amber-400/40 shadow-md'
                  : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-100/50'
              }`}
            >
              <HolyQuranIcon size="xs" />
              <span>
                {language === 'en' ? 'Standard Quran (With Translation)' : 'قرآن مجید با ترجمہ'}
              </span>
              {quranMode === 'translation' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>

            {/* Option 2: Dedicated 16-Line Mushaf View */}
            <button
              type="button"
              onClick={() => handleModeChange('16line')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                quranMode === '16line'
                  ? 'bg-linear-to-r from-[#0a2014] to-[#143825] text-amber-300 ring-1 ring-amber-400/40 shadow-md'
                  : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-100/50'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>
                {language === 'en' ? '16-Line Mushaf (No Translation)' : 'سولہ سطری مصحف (قرآن مجید)'}
              </span>
              {quranMode === '16line' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Render Selected View */}
      {quranMode === 'translation' ? (
        <QuranTranslationView
          currentSurahNumber={activeSurahNumber}
          onSurahChange={handleSelectSurah}
        />
      ) : (
        <Quran16LineView />
      )}
    </div>
  );
};
