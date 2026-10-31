import React, { useState, useEffect } from 'react';
import { SURAHS_LIST } from '../data/surahs';
import { fetchSurahWithTranslation, getImmediateSurah } from '../data/quranSample';
import { AyahData, SurahMeta } from '../types';
import { audioPlayer } from '../utils/audioPlayer';
import { useLanguage } from '../context/LanguageContext';
import { recordReadingAyahs } from '../utils/quranGoalTracker';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Volume2,
  Square,
  Sliders,
  Check,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuranTranslationViewProps {
  currentSurahNumber?: number;
  onSurahChange?: (surahNum: number) => void;
}

export const QuranTranslationView: React.FC<QuranTranslationViewProps> = ({
  currentSurahNumber,
  onSurahChange
}) => {
  const { t, language } = useLanguage();
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(currentSurahNumber || 1);

  useEffect(() => {
    if (currentSurahNumber && currentSurahNumber !== selectedSurahNumber) {
      setSelectedSurahNumber(currentSurahNumber);
    }
  }, [currentSurahNumber]);

  const handleSelectSurah = (num: number) => {
    setSelectedSurahNumber(num);
    if (onSurahChange) {
      onSurahChange(num);
    }
  };
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPlace, setFilterPlace] = useState<'all' | 'Makki' | 'Madani'>('all');
  const [ayat, setAyat] = useState<AyahData[]>([]);
  const [isLoadingAyat, setIsLoadingAyat] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Font sizes
  const [arabicFontSize, setArabicFontSize] = useState<number>(28);
  const [urduFontSize, setUrduFontSize] = useState<number>(18);
  const [showFontControls, setShowFontControls] = useState<boolean>(false);

  // Audio recitation state
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);

  // Bookmarked Ayahs
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('noor_quran_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const currentSurahMeta = SURAHS_LIST.find((s) => s.number === selectedSurahNumber) || SURAHS_LIST[0];

  useEffect(() => {
    let isMounted = true;

    // Check immediate cache first for 0ms instant display
    const immediate = getImmediateSurah(selectedSurahNumber);
    if (immediate) {
      setAyat(immediate);
      setIsLoadingAyat(false);
    } else {
      setIsLoadingAyat(true);
    }
    setErrorMsg(null);

    fetchSurahWithTranslation(selectedSurahNumber)
      .then((data) => {
        if (isMounted) {
          setAyat(data);
          setIsLoadingAyat(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          if (!immediate) {
            setErrorMsg(
              language === 'en'
                ? 'Difficulty loading Surah text. Please check your connection and retry.'
                : 'سورۃ کا متن لوڈ کرنے میں دشواری پیش آئی۔ براہ کرم دوبارہ کوشش کریں۔'
            );
          }
          setIsLoadingAyat(false);
        }
      });

    return () => {
      isMounted = false;
      audioPlayer.stop();
      setPlayingAyahNumber(null);
    };
  }, [selectedSurahNumber, language]);

  const toggleBookmark = (surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    let updated: string[];
    if (bookmarks.includes(key)) {
      updated = bookmarks.filter((b) => b !== key);
    } else {
      updated = [...bookmarks, key];
    }
    setBookmarks(updated);
    localStorage.setItem('noor_quran_bookmarks', JSON.stringify(updated));
  };

  const handlePlayRecitation = (ayah: AyahData) => {
    if (playingAyahNumber === ayah.numberInSurah) {
      audioPlayer.stop();
      setPlayingAyahNumber(null);
    } else {
      setPlayingAyahNumber(ayah.numberInSurah);
      audioPlayer.playAyahRecitation(ayah.numberInQuran, () => {
        setPlayingAyahNumber(null);
      });
    }
  };

  const filteredSurahs = SURAHS_LIST.filter((s) => {
    const matchesSearch =
      s.nameUrdu.includes(searchQuery) ||
      s.nameArabic.includes(searchQuery) ||
      s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery.trim();
    const matchesPlace = filterPlace === 'all' || s.revelationPlace === filterPlace;
    return matchesSearch && matchesPlace;
  });

  return (
    <div className="space-y-6">
      {/* Surah Header & Control Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Surah Title Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
                {currentSurahMeta.number}
              </span>
              <h2 className="text-2xl font-bold font-urdu text-stone-900">
                {currentSurahMeta.nameUrdu}
              </h2>
              <span className="text-lg font-arabic font-bold text-emerald-800">
                ({currentSurahMeta.nameArabic})
              </span>
            </div>
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <span>{currentSurahMeta.nameEnglish}</span>
              <span aria-hidden="true">·</span>
              <span className="font-urdu">{currentSurahMeta.revelationPlaceUrdu}</span>
              <span aria-hidden="true">·</span>
              <span>کل آیات: {currentSurahMeta.totalAyat}</span>
              <span aria-hidden="true">·</span>
              <span>پارہ: {currentSurahMeta.paraNumber}</span>
            </div>
          </div>

          {/* Quick Actions & Font Size Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFontControls(!showFontControls)}
              className="px-3 py-2 rounded-xl text-xs font-medium border border-stone-300 hover:bg-stone-50 flex items-center gap-1.5 text-stone-700 transition-colors"
              title="فونٹ سائز ایڈجسٹ کریں"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>فونٹ سائز</span>
            </button>

            {/* Previous Surah */}
            <button
              disabled={selectedSurahNumber <= 1}
              onClick={() => handleSelectSurah(Math.max(1, selectedSurahNumber - 1))}
              className="p-2 rounded-xl border border-stone-300 hover:bg-stone-50 disabled:opacity-30 text-stone-700 transition-colors"
              title="پچھلی سورۃ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Surah */}
            <button
              disabled={selectedSurahNumber >= 114}
              onClick={() => handleSelectSurah(Math.min(114, selectedSurahNumber + 1))}
              className="p-2 rounded-xl border border-stone-300 hover:bg-stone-50 disabled:opacity-30 text-stone-700 transition-colors"
              title="اگلی سورۃ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Adjustable Font Sizes Panel */}
        {showFontControls && (
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/90 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-stone-700">
                <span>عربی فونٹ سائز (Arabic Size):</span>
                <span className="font-mono">{arabicFontSize}px</span>
              </div>
              <input
                type="range"
                min="20"
                max="44"
                value={arabicFontSize}
                onChange={(e) => setArabicFontSize(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-stone-700">
                <span>اردو ترجمہ فونٹ سائز (Urdu Size):</span>
                <span className="font-mono">{urduFontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="28"
                value={urduFontSize}
                onChange={(e) => setUrduFontSize(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Surah Selector List Sidebar + Ayah Reading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 114 Surahs Picker (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-urdu font-bold text-base text-stone-800">سورۃ کا انتخاب کریں:</h3>
            <span className="text-[11px] text-stone-500 font-mono">114 سورتیں</span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="سورۃ تلاش کریں (نام یا نمبر)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 font-urdu"
            />
          </div>

          {/* Makki / Madani Filters */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterPlace('all')}
              className={`flex-1 py-1 rounded-md transition-colors ${
                filterPlace === 'all' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600'
              }`}
            >
              تمام
            </button>
            <button
              onClick={() => setFilterPlace('Makki')}
              className={`flex-1 py-1 rounded-md transition-colors ${
                filterPlace === 'Makki' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-stone-600'
              }`}
            >
              مکی
            </button>
            <button
              onClick={() => setFilterPlace('Madani')}
              className={`flex-1 py-1 rounded-md transition-colors ${
                filterPlace === 'Madani' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-stone-600'
              }`}
            >
              مدنی
            </button>
          </div>

          {/* Scrollable Surahs List */}
          <div className="max-h-[580px] overflow-y-auto space-y-1 pr-1">
            {filteredSurahs.map((surah) => {
              const isSelected = surah.number === selectedSurahNumber;
              return (
                <button
                  key={surah.number}
                  onClick={() => handleSelectSurah(surah.number)}
                  className={`w-full text-right p-2.5 rounded-xl transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-emerald-900 text-white border-emerald-800 shadow-sm'
                      : 'hover:bg-stone-50 text-stone-800 border-transparent hover:border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono ${
                      isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {surah.number}
                    </span>
                    <div className="text-left">
                      <div className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-stone-800'}`}>
                        {surah.nameEnglish}
                      </div>
                      <div className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`}>
                        {surah.totalAyat} آیات · {surah.revelationPlaceUrdu}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-urdu font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-emerald-900'}`}>
                      {surah.nameUrdu}
                    </div>
                    <div className={`font-arabic text-xs ${isSelected ? 'text-stone-200' : 'text-stone-500'}`}>
                      {surah.nameArabic}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ayat Reading Area with Urdu Translation (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Bismillah Banner (Unless Surah At-Tawbah 9) */}
          {selectedSurahNumber !== 9 && (
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white p-6 rounded-2xl shadow-sm text-center border border-emerald-800/50">
              <p className="font-arabic text-3xl font-bold tracking-wide text-amber-200 leading-relaxed" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-xs font-urdu text-emerald-100 mt-2">
                شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے
              </p>
            </div>
          )}

          {/* Loading or Error State */}
          {isLoadingAyat && (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 space-y-3">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-urdu text-sm">مستند قرآنی آیات اور اردو ترجمہ لوڈ ہو رہا ہے...</p>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800 text-center space-y-2">
              <p className="font-semibold text-sm">{errorMsg}</p>
              <button
                onClick={() => setSelectedSurahNumber(selectedSurahNumber)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs"
              >
                دوبارہ لوڈ کریں
              </button>
            </div>
          )}

          {/* Ayat List */}
          {!isLoadingAyat && !errorMsg && (
            <div className="space-y-4">
              {ayat.map((ayah) => {
                const bookmarkKey = `${selectedSurahNumber}:${ayah.numberInSurah}`;
                const isBookmarked = bookmarks.includes(bookmarkKey);
                const isPlaying = playingAyahNumber === ayah.numberInSurah;

                return (
                  <div
                    key={ayah.numberInSurah}
                    id={`ayah-${ayah.numberInSurah}`}
                    className={`bg-white rounded-2xl p-6 border transition-all duration-200 ${
                      isPlaying
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'border-stone-200/80 hover:border-stone-300 shadow-sm'
                    }`}
                  >
                    {/* Ayah Header Tooling */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
                          {ayah.numberInSurah}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">
                          آیت #{ayah.numberInQuran}
                        </span>
                        {ayah.sajda && (
                          <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-urdu">
                            سجدہ واجب
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Log Ayah to Daily Goal Button */}
                        <button
                          onClick={() => recordReadingAyahs(1)}
                          className="px-2 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-950 transition-colors flex items-center gap-1 text-[11px] font-medium"
                          title={language === 'en' ? 'Log this Ayah to Daily Reading Goal (+1)' : 'روزانہ تلاوت کے ہدف میں شمار کریں (+۱ آیت)'}
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline font-mono text-[10px]">+1 Goal</span>
                        </button>

                        {/* Audio Recitation Button */}
                        <button
                          onClick={() => handlePlayRecitation(ayah)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isPlaying
                              ? 'bg-rose-50 text-rose-600 border-rose-200'
                              : 'bg-stone-50 text-stone-600 hover:text-emerald-700 border-stone-200'
                          }`}
                          title={isPlaying ? 'تلاوت روکیں' : 'آیت کی تلاوت سنیں (مشاری العفاسی)'}
                        >
                          {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleBookmark(selectedSurahNumber, ayah.numberInSurah)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isBookmarked
                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'bg-stone-50 text-stone-400 hover:text-amber-600 border-stone-200'
                          }`}
                          title={isBookmarked ? 'بک مارک ہٹائیں' : 'بک مارک محفوظ کریں'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Authentic Arabic Text with Harakaat */}
                    <div
                      dir="rtl"
                      className="font-quran text-right leading-loose text-stone-900 tracking-wide select-text py-2"
                      style={{ fontSize: `${arabicFontSize}px`, lineHeight: 2.3 }}
                    >
                      {ayah.arabicText}
                      <span className="inline-block mx-2 text-emerald-800 font-mono text-sm opacity-80" aria-label={`آیت ${ayah.numberInSurah}`}>
                        ۝{ayah.numberInSurah}
                      </span>
                    </div>

                    {/* Authentic Urdu Translation (Maulana Fateh Muhammad Jalandhry) */}
                    <div
                      dir="rtl"
                      className="font-urdu text-right text-stone-700 mt-3 pt-3 border-t border-stone-100 select-text leading-relaxed"
                      style={{ fontSize: `${urduFontSize}px`, lineHeight: 1.9 }}
                    >
                      {ayah.urduTranslation}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
