import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { IslamicMotif } from './IslamicMotif';
import { IslamicAppIcon } from './IslamicAppIcon';
import {
  Clock,
  BookOpen,
  Heart,
  Compass,
  Lock,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
  Building2
} from 'lucide-react';
import { CityOption, PrayerTimeData } from '../types';
import { triggerLockedFeatureMessage } from '../utils/lockedNotice';

interface HomeOverviewProps {
  onTabChange: (tab: string) => void;
  onOpenAuth: () => void;
  selectedCity: CityOption;
  prayerTimesData: PrayerTimeData;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  onTabChange,
  onOpenAuth,
  selectedCity,
  prayerTimesData
}) => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const nextPrayerName = language === 'en' ? prayerTimesData.nextPrayer.name : prayerTimesData.nextPrayer.nameUrdu;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* 1. TOP HERO BANNER - Styled after the Holy Quran Icon's Dark Green, Emerald & Gold Medallion */}
      <div className="relative overflow-hidden rounded-[32px] bg-linear-to-b from-[#0a2014] via-[#143825] to-[#091a10] border-2 border-[#d4af37]/40 shadow-2xl p-6 sm:p-10 text-white">
        {/* Luminous emerald and warm gold radial aura */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Subtle decorative Islamic arabesque motifs */}
        <div className="absolute top-4 right-6 text-amber-400/20 pointer-events-none">
          <IslamicMotif variant="star-burst" className="w-12 h-12" />
        </div>
        <div className="absolute top-12 left-6 text-emerald-400/20 pointer-events-none">
          <IslamicMotif variant="crescent" className="w-9 h-9" />
        </div>

        <div className="flex flex-col items-center text-center space-y-4 pt-1 relative z-10">
          {/* Centered Holy Quran Icon Emblem with Gold Filigree Ring */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-linear-to-tr from-[#d4af37]/40 to-emerald-400/30 p-1 shadow-xl ring-2 ring-amber-400/60 flex items-center justify-center">
              <IslamicAppIcon type="quran" size="custom" className="w-14 h-14" withGlow={true} />
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white italic drop-shadow-sm">
              Hasan Quran
            </h1>
            <p className="font-display text-base sm:text-lg text-amber-200/95 tracking-wide mt-1">
              {language === 'en' ? 'Hasan Quran - Your Daily Deen Companion' : 'حسن قرآن - آپ کا مستند دینی و روحانی رہنما'}
            </p>
          </div>

          {/* Mosque Silhouette Header with Glowing Emerald Accent */}
          <div className="w-full max-w-md py-1 flex justify-center">
            <div className="w-full h-28 rounded-2xl bg-linear-to-t from-emerald-500/20 via-emerald-800/15 to-transparent flex items-end justify-center pb-2 relative overflow-hidden border border-emerald-500/25">
              <IslamicMotif variant="dome" className="w-44 h-22 text-emerald-300/80" />
            </div>
          </div>

          {/* Auth Action Buttons with Gold & Emerald Theme */}
          <div className="w-full max-w-sm space-y-2.5 pt-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => onTabChange('prayer')}
                  className="w-full py-3.5 px-6 rounded-full bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-950/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{language === 'en' ? 'Get Started' : 'شروع کریں'}</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>
                <button
                  onClick={onOpenAuth}
                  className="w-full py-3 px-6 rounded-full bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-100 font-medium text-sm border border-emerald-600/50 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                >
                  {language === 'en' ? 'Sign in with Google' : 'گوگل سے سائن ان کریں'}
                </button>
              </>
            ) : (
              <div className="p-3 bg-[#0a1e13]/85 rounded-2xl border border-emerald-600/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{user?.name}</span>
                    <span className="text-[10px] text-emerald-200/80 block">{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => onTabChange('prayer')}
                  className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-xs cursor-pointer"
                >
                  {language === 'en' ? 'Open Dashboard' : 'ڈیش بورڈ'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. TODAY'S AYAH CARD - Deep Forest Green with Gold Filigree Accents */}
      <div className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-[#0a2014] via-[#143825] to-[#0c2417] text-white p-6 shadow-xl border border-emerald-700/60 ring-1 ring-amber-400/25">
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-2 right-4 text-emerald-600/30">
          <IslamicMotif variant="star-burst" className="w-20 h-20" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'en' ? "Today's Ayah" : 'آج کی قرآنی آیت'}</span>
            </span>
            <span className="text-[11px] text-emerald-200/80 font-serif italic">
              {prayerTimesData.hijriDate.formatted}
            </span>
          </div>

          <div className="space-y-2">
            <p className="font-arabic text-xl sm:text-2xl text-amber-100 text-right leading-loose" dir="rtl">
              وَوَجَدَكَ ضَالًّا فَهَدَىٰ
            </p>
            <p className="font-display text-base sm:text-lg text-white font-medium italic">
              "{language === 'en' ? 'And He found you lost and guided you.' : 'اور آپ کو (راہِ حق کا) متلاشی پایا تو ہدایت فرمائی۔'}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-700/50">
            <span className="text-xs text-amber-300 font-mono font-medium">Quran 93:7 (Surah Ad-Duha)</span>
            <button
              onClick={() => onTabChange('quran')}
              className="px-3.5 py-1.5 rounded-full bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <IslamicAppIcon type="quran" size="xs" />
              <span>{language === 'en' ? 'Reflect / Recite' : 'تلاوت کریں'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. HOME SCREEN — EXACTLY 4 PRIMARY MAIN OPTIONS (Holy Quran, Prayer Times, Qibla Compass, Duas & Dhikr) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0a2014] tracking-tight flex items-center gap-2">
              <span>{language === 'en' ? 'Core Islamic Services' : 'بنیادی دینی خدمات'}</span>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0a2014] border border-emerald-300">
                {language === 'en' ? '4 Main Options' : '۴ بنیادی شعبہ جات'}
              </span>
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              {language === 'en'
                ? 'Authentic Quran, accurate prayer times, Kaaba compass & daily azkaar'
                : 'قرآن مجید، اوقاتِ نماز، قبلہ کمپاس اور مسنون دعائیں و اذکار'}
            </p>
          </div>
          <span className="text-xs text-emerald-900/80 font-medium hidden sm:inline">
            {language === 'en' ? `Location: ${selectedCity.name}` : `مقام: ${selectedCity.nameUrdu}`}
          </span>
        </div>

        {/* 4 Prominent High-Profile Primary Options Cards in 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Holy Quran — قرآن مجید */}
          <button
            onClick={() => onTabChange('quran')}
            className="p-5 rounded-[26px] bg-white hover:bg-[#f6faf8] border-2 border-[#cbe2d5] hover:border-emerald-600 hover:shadow-lg transition-all text-left rtl:text-right flex flex-col justify-between group cursor-pointer relative overflow-hidden ring-1 ring-emerald-500/20"
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#0a2014]/15 via-[#10b981]/20 to-[#d4af37]/25 border-2 border-emerald-500/40 flex items-center justify-center group-hover:scale-105 group-hover:border-amber-400 transition-transform relative shadow-md">
                <IslamicAppIcon type="quran" size="custom" className="w-14 h-14 shadow-sm" withGlow={true} />
              </div>
              <span className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white flex items-center justify-center transition-colors text-xs font-bold border border-emerald-200">
                ➔
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-[#0a2014] group-hover:text-emerald-800 transition-colors font-display">
                  {language === 'en' ? 'Holy Quran' : 'قرآن مجید'}
                </h3>
                <span className="font-arabic font-bold text-amber-600 text-base">القرآن الكريم</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'en'
                  ? 'Complete 114 Surahs, authentic Urdu translation, 16-Line Mushaf & studio tilawat.'
                  : 'مکمل ۱۱۴ سورتیں، مستند اردو ترجمہ، ۱۶ سطری پاک و ہند مصحف اور آڈیو تلاوت۔'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-100/80 flex items-center justify-between text-[11px]">
              <span className="text-[#0a2014] font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-mono">
                114 Surahs · 16-Line
              </span>
              <span className="text-emerald-800 font-bold group-hover:underline">
                {language === 'en' ? 'Open Quran' : 'تلاوت شروع کریں'}
              </span>
            </div>
          </button>

          {/* 2. Prayer Times — نماز کے اوقات */}
          <button
            onClick={() => onTabChange('prayer')}
            className="p-5 rounded-[26px] bg-white hover:bg-[#f6faf8] border-2 border-[#cbe2d5] hover:border-emerald-600 hover:shadow-lg transition-all text-left rtl:text-right flex flex-col justify-between group cursor-pointer relative overflow-hidden ring-1 ring-emerald-500/20"
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#0a2014]/15 via-[#10b981]/20 to-[#d4af37]/25 border-2 border-emerald-500/40 flex items-center justify-center group-hover:scale-105 group-hover:border-amber-400 transition-transform relative shadow-md">
                <IslamicAppIcon type="prayer" size="custom" className="w-14 h-14 shadow-sm" withGlow={true} />
              </div>
              <span className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white flex items-center justify-center transition-colors text-xs font-bold border border-emerald-200">
                ➔
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-[#0a2014] group-hover:text-emerald-800 transition-colors font-display">
                  {language === 'en' ? 'Prayer Times' : 'نماز کے اوقات'}
                </h3>
                <span className="font-arabic font-bold text-amber-600 text-base">مواقيت الصلاة</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'en'
                  ? 'Precise astronomical timings, automated Azan alerts, and remaining time countdown.'
                  : 'مقام کے مطابق ۵ وقت کی نماز کے درست اوقات، اذان الرٹ اور بقیہ وقت۔'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-100/80 flex items-center justify-between text-[11px]">
              <span className="text-[#0a2014] font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-mono">
                {nextPrayerName}: {prayerTimesData.nextPrayer.time}
              </span>
              <span className="text-emerald-800 font-bold group-hover:underline">
                {language === 'en' ? 'View Schedule' : 'تمام اوقات دیکھیں'}
              </span>
            </div>
          </button>

          {/* 3. Qibla Compass — قبلہ کمپاس */}
          <button
            onClick={() => onTabChange('qibla')}
            className="p-5 rounded-[26px] bg-white hover:bg-[#f6faf8] border-2 border-[#cbe2d5] hover:border-emerald-600 hover:shadow-lg transition-all text-left rtl:text-right flex flex-col justify-between group cursor-pointer relative overflow-hidden ring-1 ring-emerald-500/20"
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#0a2014]/15 via-[#10b981]/20 to-[#d4af37]/25 border-2 border-emerald-500/40 flex items-center justify-center group-hover:scale-105 group-hover:border-amber-400 transition-transform relative shadow-md">
                <IslamicAppIcon type="qibla" size="custom" className="w-14 h-14 shadow-sm" withGlow={true} />
              </div>
              <span className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white flex items-center justify-center transition-colors text-xs font-bold border border-emerald-200">
                ➔
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-[#0a2014] group-hover:text-emerald-800 transition-colors font-display">
                  {language === 'en' ? 'Qibla Compass' : 'قبلہ کمپاس'}
                </h3>
                <span className="font-arabic font-bold text-amber-600 text-base">اتجاه القبلة</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'en'
                  ? 'Real-time gyroscope compass pointing straight to the Holy Kaaba in Makkah Mukarramah.'
                  : 'مکہ مکرمہ میں خانہ کعبہ کی درست سمت کی رہنمائی اور لائیو موبائل کمپاس۔'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-100/80 flex items-center justify-between text-[11px]">
              <span className="text-[#0a2014] font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-mono">
                {language === 'en' ? 'Live Kaaba Bearing' : 'درست زاویہ قبلہ'}
              </span>
              <span className="text-emerald-800 font-bold group-hover:underline">
                {language === 'en' ? 'Open Compass' : 'کمپاس کھولیں'}
              </span>
            </div>
          </button>

          {/* 4. Duas & Dhikr — دعائیں اور اذکار */}
          <button
            onClick={() => onTabChange('azkaar')}
            className="p-5 rounded-[26px] bg-white hover:bg-[#f6faf8] border-2 border-[#cbe2d5] hover:border-emerald-600 hover:shadow-lg transition-all text-left rtl:text-right flex flex-col justify-between group cursor-pointer relative overflow-hidden ring-1 ring-emerald-500/20"
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#0a2014]/15 via-[#10b981]/20 to-[#d4af37]/25 border-2 border-emerald-500/40 flex items-center justify-center group-hover:scale-105 group-hover:border-amber-400 transition-transform relative shadow-md">
                <IslamicAppIcon type="azkaar" size="custom" className="w-14 h-14 shadow-sm" withGlow={true} />
              </div>
              <span className="w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white flex items-center justify-center transition-colors text-xs font-bold border border-emerald-200">
                ➔
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-[#0a2014] group-hover:text-emerald-800 transition-colors font-display">
                  {language === 'en' ? 'Duas & Dhikr' : 'دعائیں اور اذکار'}
                </h3>
                <span className="font-arabic font-bold text-amber-600 text-base">الأذكار والتسبيح</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'en'
                  ? 'Masnoon prayers, morning & evening remembrance, and interactive digital Tasbeeh counter.'
                  : 'صبح و شام کے اذکار، مسنون دعائیں، نماز کے بعد کے اذکار اور ڈیجیٹل تسبیح کاؤنٹر۔'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-100/80 flex items-center justify-between text-[11px]">
              <span className="text-[#0a2014] font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-mono">
                {language === 'en' ? 'Digital Tasbeeh' : 'ڈیجیٹل کاؤنٹر'}
              </span>
              <span className="text-emerald-800 font-bold group-hover:underline">
                {language === 'en' ? 'Start Dhikr' : 'اذکار پڑھیں'}
              </span>
            </div>
          </button>
        </div>

        {/* 5. LOCKED UPGRADE SECTION BANNER — Clearly marked as Locked (Phase 2 Reserved) */}
        <div className="rounded-2xl p-4 sm:p-5 bg-linear-to-r from-[#0a2014] via-[#143825] to-[#091a10] text-white border-2 border-amber-500/40 ring-1 ring-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg relative overflow-hidden">
          {/* Subtle locked badge background accent */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border-2 border-amber-400/50 flex items-center justify-center shrink-0 shadow-md">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40 font-mono flex items-center gap-1 shadow-2xs">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>{language === 'en' ? 'LOCKED · PHASE 2' : 'مقفل · فیز ۲ اپگریڈ'}</span>
                </span>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-300/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40 font-medium">
                  {language === 'en' ? 'Reserved for Future Release' : 'مستقبل کے مرحلہ وار اپگریڈز'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-display mt-1">
                {language === 'en' ? 'Explore Upgrade Section (Locked)' : 'اپگریڈ سیکشن (فی الحال مقفل و محفوظ)'}
              </h3>
              <p className="text-xs text-emerald-100/80 font-urdu mt-0.5 leading-relaxed">
                {language === 'en'
                  ? 'All secondary features (Madrasas, Masajid Near Me, Islamic Videos & Library) are locked and reserved for future activation in Phase 2.'
                  : 'تمام ثانوی توسیعی فیچرز (دینی مدارس، قریبی مساجد لوکیٹر، ویڈیوز اور کتب خانہ) آئندہ فیز ۲ کے لیے مقفل اور محفوظ رکھے گئے ہیں۔'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerLockedFeatureMessage(language === 'en' ? 'Upgrade Section' : 'اپگریڈ سیکشن');
              onTabChange('upgrade');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 relative z-10"
            title="Explore locked features in Upgrade Section"
          >
            <Lock className="w-3.5 h-3.5 text-stone-950" />
            <span>{language === 'en' ? 'Locked — Explore Section' : 'مقفل — اپگریڈ سیکشن دیکھیں'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      {/* 4. RAMADAN & FASTING PLANNER CARD */}
      <div className="rounded-[28px] bg-linear-to-br from-[#f8fbf9] via-[#edf5f0] to-[#e4f0e8] border border-[#b8dcce] p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0a2014] font-bold text-[10px] border border-emerald-300">
                {language === 'en' ? 'RAMADAN & FASTING' : 'رمضان المبارک اور روزے کے اوقات'}
              </span>
              <span className="text-xs text-emerald-900/80 font-mono">
                {selectedCity.name}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#0a2014]">
              {language === 'en' ? 'Ramadan Planner' : 'رمضان و روزہ پلانر'}
            </h3>
            <p className="font-display italic text-sm text-emerald-900/80">
              "{language === 'en' ? 'Ya Allah, accept my fast.' : 'یا اللہ، ہمارے روزے اور عبادات قبول فرما۔'}"
            </p>
          </div>

          {/* Suhoor & Iftar Times Pill Cards */}
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl p-3 border border-[#b8dcce] text-center min-w-[105px] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                {language === 'en' ? 'Suhoor' : 'سحری ختم'}
              </span>
              <span className="font-mono text-base font-bold text-[#0a2014] block">
                {prayerTimesData.fajr}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-emerald-400 text-center min-w-[105px] shadow-2xs ring-1 ring-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                {language === 'en' ? 'Iftar' : 'افطار وقت'}
              </span>
              <span className="font-mono text-base font-bold text-emerald-700 block">
                {prayerTimesData.maghrib}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FUTURE UPGRADES & KHIDMAT-E-KHALQ PREVIEW */}
      <div className="rounded-[28px] bg-white border border-[#cbe2d5] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-xl shrink-0">
            🕋
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                PHASE 2 UPGRADE
              </span>
              <span className="text-xs text-stone-500">6 Protected Modules</span>
            </div>
            <h4 className="font-display text-lg font-bold text-[#0a2014] mt-0.5">
              {language === 'en' ? 'Sadqa, Zakat, Fitrana & Welfare Roadmap' : 'صدقہ، زکوٰۃ، فطرانہ اور فلاحی روڈ میپ'}
            </h4>
            <p className="text-xs text-stone-600">
              {language === 'en' ? 'Explore all future locked features & verified charity guidelines.' : 'تمام ۶ محفوظ فیچرز اور شفاف شرعی رہنمائی دیکھیں۔'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            triggerLockedFeatureMessage(language === 'en' ? 'Phase 2 Upgrades' : 'مرحلہ ۲ اپگریڈز');
            onTabChange('upgrade');
          }}
          className="px-4 py-2.5 rounded-full bg-[#0a2014] hover:bg-[#143825] text-amber-300 border border-amber-400/40 text-xs font-semibold shadow-xs flex items-center justify-center gap-2 whitespace-nowrap transition-colors cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'en' ? 'Locked Modules' : 'مقفل فیچرز'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
