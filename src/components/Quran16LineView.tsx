import React, { useState, useEffect } from 'react';
import { PARAS_LIST, SURAHS_LIST } from '../data/surahs';
import { SAMPLE_16_LINE_PAGES, get16LinePageImageUrl, get16LinePageFallbackImageUrl } from '../data/quran16Line';
import { Line16Data } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Bookmark,
  Sun,
  Moon,
  Layers,
  Sparkles,
  Sliders,
  Eye,
  FileText,
  Check
} from 'lucide-react';
import { recordReadingAyahs } from '../utils/quranGoalTracker';

export const Quran16LineView: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const saved = localStorage.getItem('noor_16line_last_page');
    return saved ? Math.min(548, Math.max(1, Number(saved))) : 1;
  });

  const [inputPageNum, setInputPageNum] = useState<string>(currentPage.toString());
  const [viewTheme, setViewTheme] = useState<'sepia' | 'white' | 'dark'>('sepia');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [fontSize16Line, setFontSize16Line] = useState<number>(24);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<'scanned' | 'text'>('scanned');
  const [imageError, setImageError] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync last read page
  useEffect(() => {
    localStorage.setItem('noor_16line_last_page', currentPage.toString());
    setInputPageNum(currentPage.toString());
    setImageError(false);

    const savedBookmarks = localStorage.getItem('noor_16line_bookmarks');
    if (savedBookmarks) {
      try {
        const list: number[] = JSON.parse(savedBookmarks);
        setIsBookmarked(list.includes(currentPage));
      } catch {
        setIsBookmarked(false);
      }
    }
  }, [currentPage]);

  // Determine current Para and Surah based on page
  const currentPara = PARAS_LIST.find(
    (p) => currentPage >= p.page16LineStart && currentPage <= p.page16LineEnd
  ) || PARAS_LIST[0];

  const currentSurah = SURAHS_LIST.find((s) => s.page16LineStart === currentPage) ||
    SURAHS_LIST.slice().reverse().find((s) => s.page16LineStart <= currentPage) ||
    SURAHS_LIST[0];

  const samplePageData: Line16Data | undefined = SAMPLE_16_LINE_PAGES[currentPage];

  const handleNextPage = () => {
    if (currentPage < 548) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handlePageJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputPageNum, 10);
    if (!isNaN(num) && num >= 1 && num <= 548) {
      setCurrentPage(num);
    } else {
      setInputPageNum(currentPage.toString());
    }
  };

  const togglePageBookmark = () => {
    const savedBookmarks = localStorage.getItem('noor_16line_bookmarks');
    let list: number[] = savedBookmarks ? JSON.parse(savedBookmarks) : [];
    if (list.includes(currentPage)) {
      list = list.filter((p) => p !== currentPage);
      setIsBookmarked(false);
    } else {
      list = [...list, currentPage];
      setIsBookmarked(true);
    }
    localStorage.setItem('noor_16line_bookmarks', JSON.stringify(list));
  };

  // Keyboard navigation for page flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') handleNextPage(); // In RTL next page is on left
      if (e.key === 'ArrowRight') handlePrevPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-stone-900 p-4 overflow-y-auto' : ''}`}>
      {/* 16-Line Header & Navigation Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/90 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 font-bold text-xs border border-amber-300">
                {language === 'en' ? '16-Line Mushaf (Traditional Hifz Layout)' : 'سولہ سطری مصحف پاک (مخصوص حفظ قرآن)'}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {language === 'en' ? 'Authentic Arabic Only · No Translation' : 'خالص قرآنی متن · بغیر ترجمہ'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-1 flex items-center gap-2">
              <span>{language === 'en' ? `Page ${currentPage} of 548` : `صفحہ نمبر: ${currentPage} / ۵۴۸`}</span>
              <span className="text-stone-300">·</span>
              <span className="text-emerald-800">{currentPara.nameUrdu} ({currentPara.nameArabic})</span>
            </h2>
          </div>

          {/* Quick Selectors: Jump to Para & Jump to Surah */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Para / Juz Selector */}
            <select
              value={currentPara.number}
              onChange={(e) => {
                const paraNum = Number(e.target.value);
                const found = PARAS_LIST.find((p) => p.number === paraNum);
                if (found) setCurrentPage(found.page16LineStart);
              }}
              className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-800 font-medium"
            >
              {PARAS_LIST.map((p) => (
                <option key={p.number} value={p.number}>
                  {language === 'en' ? `Juz ${p.number}: ${p.nameArabic}` : `پارہ ${p.number}: ${p.nameUrdu} (${p.nameArabic})`}
                </option>
              ))}
            </select>

            {/* Surah Selector */}
            <select
              value={currentSurah.number}
              onChange={(e) => {
                const sNum = Number(e.target.value);
                const found = SURAHS_LIST.find((s) => s.number === sNum);
                if (found) setCurrentPage(found.page16LineStart);
              }}
              className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-800 font-medium max-w-[170px]"
            >
              {SURAHS_LIST.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {language === 'en' ? s.nameEnglish : s.nameUrdu}
                </option>
              ))}
            </select>

            {/* Bookmark button */}
            <button
              onClick={togglePageBookmark}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'bg-stone-50 text-stone-400 hover:text-amber-600 border-stone-200'
              }`}
              title={isBookmarked ? 'Page Bookmarked' : 'Bookmark Page'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reading Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Toolbar: Jump to Page Form, Display Mode, Themes, and Zoom */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Jump to Page */}
          <form onSubmit={handlePageJumpSubmit} className="flex items-center gap-1.5">
            <span className="text-stone-600 font-medium">{language === 'en' ? 'Go to Page:' : 'صفحہ درج کریں:'}</span>
            <input
              type="number"
              min="1"
              max="548"
              value={inputPageNum}
              onChange={(e) => setInputPageNum(e.target.value)}
              className="w-16 px-2 py-1 text-center font-mono border border-stone-300 rounded-lg text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
            >
              {language === 'en' ? 'Go' : 'جائیں'}
            </button>
          </form>

          {/* Display Mode: Scanned Image vs High-Legibility Scalable Vector Typography */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setDisplayMode('scanned')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                displayMode === 'scanned'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Scanned Mushaf' : 'عکسِ مصحف'}</span>
            </button>
            <button
              onClick={() => setDisplayMode('text')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                displayMode === 'text'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'en' ? '16 Scalable Lines' : '۱۶ سطری متن'}</span>
            </button>
          </div>

          {/* Theme selector */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setViewTheme('sepia')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewTheme === 'sepia'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'en' ? 'Parchment' : 'قرآنی اوراق'}
            </button>
            <button
              onClick={() => setViewTheme('white')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewTheme === 'white'
                  ? 'bg-white text-stone-900 border border-stone-300 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'en' ? 'White' : 'سفید'}
            </button>
            <button
              onClick={() => setViewTheme('dark')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewTheme === 'dark'
                  ? 'bg-stone-900 text-stone-100 border border-stone-700 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'en' ? 'Night' : 'نائٹ موڈ'}
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              disabled={zoomLevel <= 70}
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5 text-stone-600" />
            </button>
            <span className="font-mono text-stone-600 px-1 text-[11px] font-semibold">{zoomLevel}%</span>
            <button
              disabled={zoomLevel >= 160}
              onClick={() => setZoomLevel((z) => Math.min(160, z + 10))}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5 text-stone-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 16-Line Traditional Quran Page Canvas */}
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Navigation Pager Arrows */}
        <div className="flex items-center justify-between w-full max-w-3xl px-2">
          <button
            disabled={currentPage <= 1}
            onClick={handlePrevPage}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-stone-50 disabled:opacity-30 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 shadow-sm transition-all"
          >
            <ChevronRight className="w-4 h-4 text-emerald-700" />
            <span>{language === 'en' ? `Previous (Page ${currentPage - 1})` : `پچھلا صفحہ (${currentPage - 1})`}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-500 font-bold bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
              PAGE {currentPage} / 548
            </span>

            {/* Quick Log Page to Daily Goal */}
            <button
              onClick={() => recordReadingAyahs(15)}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-2xs transition-colors"
              title={language === 'en' ? 'Log this page to Daily Goal (~15 Ayahs)' : 'صفحہ تلاوت کو روزانہ ہدف میں درج کریں (~۱۵ آیات)'}
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'Log Page (+15)' : 'صفحہ تلاوت (+۱۵)'}</span>
            </button>
          </div>

          <button
            disabled={currentPage >= 548}
            onClick={handleNextPage}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-stone-50 disabled:opacity-30 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 shadow-sm transition-all"
          >
            <span>{language === 'en' ? `Next (Page ${currentPage + 1})` : `اگلا صفحہ (${currentPage + 1})`}</span>
            <ChevronLeft className="w-4 h-4 text-emerald-700" />
          </button>
        </div>

        {/* The 16-Line Page Frame */}
        <div
          className={`w-full max-w-3xl transition-all duration-200 rounded-2xl shadow-2xl overflow-hidden border-2 ${
            viewTheme === 'sepia'
              ? 'bg-[#fcf7e6] text-[#1f1a14] border-[#e8dcb8]'
              : viewTheme === 'dark'
              ? 'bg-stone-950 text-stone-100 border-stone-800'
              : 'bg-white text-stone-900 border-stone-300'
          }`}
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* Top Traditional Islamic Page Header */}
          <div className={`p-4 border-b flex items-center justify-between text-xs sm:text-sm font-bold ${
            viewTheme === 'sepia'
              ? 'border-[#e8dcb8] text-[#5c4728] bg-[#f8f1d8]'
              : viewTheme === 'dark'
              ? 'border-stone-800 text-emerald-400 bg-stone-900'
              : 'border-stone-200 text-emerald-900 bg-stone-50'
          }`}>
            <div>
              <span>{currentSurah.nameUrdu}</span>
              <span className="font-arabic text-xs mr-2">({currentSurah.nameArabic})</span>
            </div>
            <div className="font-mono text-xs font-bold">
              صفحہ {currentPage}
            </div>
            <div>
              <span>{currentPara.nameUrdu}</span>
            </div>
          </div>

          {/* Page Body: High-Res Scanned Page Image OR 16 Scalable Digitized Lines */}
          <div className="p-3 sm:p-6 min-h-[680px] flex flex-col items-center justify-center">
            {displayMode === 'scanned' && !imageError ? (
              <div className="relative w-full flex justify-center">
                <img
                  src={get16LinePageImageUrl(currentPage)}
                  alt={`16 Line Quran Page ${currentPage}`}
                  className="max-h-[840px] w-auto object-contain rounded-md shadow-sm select-none filter contrast-105"
                  loading="eager"
                  onError={() => {
                    // Fall back to digitized text lines
                    setImageError(true);
                  }}
                />
              </div>
            ) : null}

            {/* Structured 16-Line Authentic Text Display */}
            {(displayMode === 'text' || imageError) && (
              <div className="w-full py-4 space-y-1">
                {samplePageData ? (
                  <div className="space-y-1 font-quran text-right select-text">
                    {samplePageData.lines.map((line, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between gap-3 px-2 py-1 rounded transition-colors ${
                          viewTheme === 'sepia'
                            ? 'hover:bg-amber-100/40 border-b border-[#ebdcb8]/40'
                            : viewTheme === 'dark'
                            ? 'hover:bg-stone-900/60 border-b border-stone-800/60'
                            : 'hover:bg-stone-50 border-b border-stone-100'
                        }`}
                      >
                        {showLineNumbers && (
                          <span className="text-[10px] font-mono text-stone-400 opacity-60 w-5 select-none">
                            {idx + 1}
                          </span>
                        )}
                        <div
                          dir="rtl"
                          className="flex-1 text-center font-quran tracking-wide select-text leading-loose"
                          style={{ fontSize: `${fontSize16Line}px`, lineHeight: 2.3 }}
                        >
                          {line}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <img
                      src={get16LinePageFallbackImageUrl(currentPage)}
                      alt={`16 Line Page ${currentPage}`}
                      className="max-h-[750px] mx-auto rounded shadow"
                      onError={() => {
                        // Fallback
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Traditional Islamic Footer with Page Number & Ruku Marker */}
          <div className={`p-3 border-t text-center font-mono text-xs flex items-center justify-between px-6 ${
            viewTheme === 'sepia'
              ? 'border-[#e8dcb8] text-[#7a643e] bg-[#f8f1d8]'
              : viewTheme === 'dark'
              ? 'border-stone-800 text-stone-400 bg-stone-900'
              : 'border-stone-200 text-stone-500 bg-stone-50'
          }`}>
            <span className="text-[11px] font-urdu">مصحف سولہ سطری</span>
            <span className="font-bold">PAGE {currentPage} OF 548</span>
            <span className="text-[11px] font-urdu">منزل {Math.ceil(currentPara.number / 4.3)}</span>
          </div>
        </div>

        {/* Quick Navigation Footer */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setCurrentPage(1)}
            className="text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-stone-900 font-medium"
          >
            {language === 'en' ? 'First Page (Page 1)' : 'پہلا صفحہ'}
          </button>
          <button
            onClick={() => setCurrentPage(548)}
            className="text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-stone-900 font-medium"
          >
            {language === 'en' ? 'Last Page (Page 548)' : 'آخری صفحہ'}
          </button>
        </div>
      </div>
    </div>
  );
};
