import React, { useState } from 'react';
import { FUTURE_LOCKED_FEATURES } from '../data/futureFeatures';
import { LockedFeature } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Lock,
  BookOpen,
  Video,
  GraduationCap,
  MapPin,
  Calendar,
  HeartHandshake,
  ShieldAlert,
  Calculator,
  CheckCircle2,
  Bell,
  X,
  Info,
  Clock,
  Heart,
  HelpCircle,
  Coins
} from 'lucide-react';

import { IslamicAppIcon } from './IslamicAppIcon';
import { triggerLockedFeatureMessage } from '../utils/lockedNotice';

interface FutureUpgradeSectionProps {
  onNavigateTab?: (tab: string) => void;
}

export const FutureUpgradeSection: React.FC<FutureUpgradeSectionProps> = ({ onNavigateTab }) => {
  const { t, language } = useLanguage();
  const [selectedFeature, setSelectedFeature] = useState<LockedFeature | null>(null);
  const [activeTab, setActiveTab] = useState<'future' | 'available' | 'charity'>('future');
  const [interestedFeatures, setInterestedFeatures] = useState<string[]>(() => {
    const saved = localStorage.getItem('noor_future_feature_interest');
    return saved ? JSON.parse(saved) : [];
  });

  // Zakat Calculator Helper State
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [silverGrams, setSilverGrams] = useState<number>(0);

  const getFeatureIcon = (name: string) => {
    switch (name) {
      case 'BookOpen': return BookOpen;
      case 'Video': return Video;
      case 'GraduationCap': return GraduationCap;
      case 'MapPin': return MapPin;
      case 'Calendar': return Calendar;
      case 'HeartHandshake': return HeartHandshake;
      default: return Lock;
    }
  };

  const toggleInterest = (featureId: string) => {
    let updated: string[];
    if (interestedFeatures.includes(featureId)) {
      updated = interestedFeatures.filter((id) => id !== featureId);
    } else {
      updated = [...interestedFeatures, featureId];
    }
    setInterestedFeatures(updated);
    localStorage.setItem('noor_future_feature_interest', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Strict Disclaimer matching Holy Quran Green & Gold Aesthetic */}
      <div className="bg-linear-to-br from-[#0a2014] via-[#143825] to-[#091a10] text-white rounded-[32px] p-6 sm:p-8 border border-emerald-700/60 ring-1 ring-amber-400/25 shadow-xl space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-400/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>{language === 'en' ? 'LOCKED · PHASE 2 UPGRADES' : 'مقفل · فیز ۲ اپگریڈز'}</span>
              </span>
              <span className="text-xs text-emerald-200/80 font-mono">RESERVED SUITE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-amber-200">
              {language === 'en' ? 'Hasan Quran — Locked Upgrades & Extensions' : 'حسن قرآن — مقفل اپگریڈز اور توسیعی سیکشن'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
              {language === 'en'
                ? 'All secondary Islamic features and extensions are safely locked and organized here for gradual activation in future Phase 2 releases. The front Home screen is reserved strictly for the 4 primary options.'
                : 'تمام توسیعی فیچرز (دینی مدارس، مساجد، اسلامک ویڈیوز اور کتب خانہ) آئندہ فیز ۲ کے لیے یہاں محفوظ اور مقفل ہیں تاکہ ہوم اسکرین پر صرف ۴ بنیادی سروسز رہیں۔'}
            </p>
          </div>
        </div>

        {/* 3 Section Tabs: Phase 2 Locked Upgrades, Secondary Features (Locked), and Charity/Zakat (Locked) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-800/60">
          <button
            onClick={() => setActiveTab('future')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'future'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'bg-emerald-950/80 text-emerald-200 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Locked Phase 2 Features (6)' : 'مقفل فیز ۲ فیچرز (۶)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'available'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'bg-emerald-950/80 text-emerald-200 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Madrasas & Masajid (Locked)' : 'مدارس و مساجد (مقفل توسیعی فیچرز)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('charity')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'charity'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'bg-emerald-950/80 text-emerald-200 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Sadqa & Zakat (Locked)' : 'صدقہ، زکوٰۃ، فطرانہ (مقفل)'}</span>
          </button>
        </div>
      </div>

      {/* 1. SECONDARY FEATURES SECTION (Madrasas & Masajid Near Me) — FULLY LOCKED */}
      {activeTab === 'available' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center gap-3">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <p className="font-urdu leading-relaxed">
              {language === 'en'
                ? 'All upgrade features (including Masajid Near Me and Madrasas Directory) are currently locked and preserved for future releases. Tapping any locked module informs users of its upcoming availability.'
                : 'تمام توسیعی سروسز (بشمول قریبی مساجد لوکیٹر اور دینی مدارس ڈائریکٹری) فی الحال مقفل ہیں۔ ان پر کلک کرنے سے آئندہ اپڈیٹ کا میسج ظاہر ہوگا۔'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Masajid Near Me (Locked) */}
            <div
              onClick={() => triggerLockedFeatureMessage(language === 'en' ? 'Masajid Near Me' : 'قریبی مساجد لوکیٹر')}
              className="bg-white rounded-[28px] p-6 border-2 border-stone-200 hover:border-amber-400 shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IslamicAppIcon type="masajid" size="lg" withGlow={false} className="ring-2 ring-stone-200 group-hover:ring-amber-400/50 shadow-md transition-all" />
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                        <Lock className="w-3 h-3 text-amber-700" />
                        <span>{language === 'en' ? 'Locked' : 'مقفل'}</span>
                      </span>
                      <h3 className="font-display font-bold text-xl text-[#0a2014] mt-1 group-hover:text-amber-900 transition-colors">
                        {language === 'en' ? 'Masajid Near Me' : 'قریبی مساجد (انٹرایکٹو نقشہ و جی پی ایس)'}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'en'
                    ? 'Interactive OpenStreetMap live GPS map, accurate distance calculation, wudu area details, turn-by-turn navigation links, and city search.'
                    : 'اوپن اسٹریٹ میپ پر قریبی مساجد کا لائیو انٹرایکٹو نقشہ، درست فاصلے کا حساب، وضو و خواتین کی نماز گاہ کی معلومات، اور گوگل میپس نیویگیشن۔'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-stone-600">
                  <div className="p-2 rounded-xl bg-[#f4f9f6] border border-stone-200">
                    <span className="block text-stone-500 text-[10px] font-sans">اسٹیٹس:</span>
                    <span className="font-bold text-amber-800 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" />
                      <span>{language === 'en' ? 'Locked' : 'مقفل (فیز ۲)'}</span>
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#f4f9f6] border border-stone-200">
                    <span className="block text-stone-500 text-[10px] font-sans">سرچ کوریج:</span>
                    <span className="font-bold text-[#0a2014]">40km Live Overpass API</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerLockedFeatureMessage(language === 'en' ? 'Masajid Near Me' : 'قریبی مساجد لوکیٹر');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-950 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-stone-200 hover:border-amber-400"
              >
                <Lock className="w-4 h-4 text-amber-600" />
                <span>{language === 'en' ? 'Locked — Available in Future Update' : 'مقفل — آئندہ اپڈیٹ میں دستیاب ہوگا'}</span>
              </button>
            </div>

            {/* Card 2: Madrasas Directory (Locked) */}
            <div
              onClick={() => triggerLockedFeatureMessage(language === 'en' ? 'Madrasas Directory' : 'دینی مدارس ڈائریکٹری')}
              className="bg-white rounded-[28px] p-6 border-2 border-stone-200 hover:border-amber-400 shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IslamicAppIcon type="madrasa" size="lg" withGlow={false} className="ring-2 ring-stone-200 group-hover:ring-amber-400/50 shadow-md transition-all" />
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                        <Lock className="w-3 h-3 text-amber-700" />
                        <span>{language === 'en' ? 'Locked' : 'مقفل'}</span>
                      </span>
                      <h3 className="font-display font-bold text-xl text-[#0a2014] mt-1 group-hover:text-amber-900 transition-colors">
                        {language === 'en' ? 'Madrasas Directory & Admissions' : 'دینی مدارس ڈائریکٹری و داخلہ جات'}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {language === 'en'
                    ? 'Verified directory of Islamic seminaries across Pakistan, admission notices, boys and girls campuses, contact details, and online registration portal.'
                    : 'پاکستان و عالمِ اسلام کے مستند دینی مدارس، سالانہ داخلہ جات، حفظ و درسِ نظامی کے شعبہ جات، طلبہ و طالبات کے کیمپس، اور رجسٹریشن پورٹل۔'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-stone-600">
                  <div className="p-2 rounded-xl bg-[#f4f9f6] border border-stone-200">
                    <span className="block text-stone-500 text-[10px] font-sans">اسٹیٹس:</span>
                    <span className="font-bold text-amber-800 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" />
                      <span>{language === 'en' ? 'Locked' : 'مقفل (فیز ۲)'}</span>
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#f4f9f6] border border-stone-200">
                    <span className="block text-stone-500 text-[10px] font-sans">ملحقہ وفاق:</span>
                    <span className="font-bold text-[#0a2014]">وفاق المدارس العربیہ</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerLockedFeatureMessage(language === 'en' ? 'Madrasas Directory' : 'دینی مدارس ڈائریکٹری');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-950 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-stone-200 hover:border-amber-400"
              >
                <Lock className="w-4 h-4 text-amber-600" />
                <span>{language === 'en' ? 'Locked — Available in Future Update' : 'مقفل — آئندہ اپڈیٹ میں دستیاب ہوگا'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED SADQA, ZAKAT, FITRANA & KHIDMAT-E-KHALQ SECTION */}
      {activeTab === 'charity' && (
        <div className="space-y-6 animate-fade-in">
          {/* Detailed Categories Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sadqa Card (Locked) */}
            <div
              onClick={() => triggerLockedFeatureMessage(language === 'en' ? 'Sadqa & Charity' : 'نفلی صدقہ و خیرات')}
              className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-400 shadow-sm space-y-3 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                  <Lock className="w-3 h-3 text-amber-700" />
                  <span>{language === 'en' ? 'Locked' : 'مقفل'}</span>
                </span>
              </div>
              <h3 className="font-bold text-lg text-stone-900">
                {language === 'en' ? '1. Voluntary Charity (Sadqa / صدقہ)' : '۱۔ نفلی صدقہ و خیرات (Sadqa)'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'en'
                  ? 'Voluntary financial or in-kind assistance given purely for the pleasure of Allah. Can be given at any time, in any amount, to anyone in genuine need.'
                  : 'اللہ کی رضا کے لیے دیا جانے والا نفلی عطیہ۔ کسی بھی وقت، کسی بھی مقدار میں مصیبت اور پریشانی دور کرنے کی نیت سے مستحق افراد کو دیا جا سکتا ہے۔'}
              </p>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-emerald-800 font-medium">
                {language === 'en' ? '• Repels calamity & expiates minor sins' : '• بلاؤں اور مصیبتوں کو ٹالتا ہے'}
              </div>
            </div>

            {/* Zakat Card (Locked) */}
            <div
              onClick={() => triggerLockedFeatureMessage(language === 'en' ? 'Zakat Calculator & Portal' : 'فرض زکوٰۃ پورٹل')}
              className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-400 shadow-sm space-y-3 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                  <Lock className="w-3 h-3 text-amber-700" />
                  <span>{language === 'en' ? 'Locked' : 'مقفل'}</span>
                </span>
              </div>
              <h3 className="font-bold text-lg text-stone-900">
                {language === 'en' ? '2. Obligatory Zakat (زکوٰۃ)' : '۲۔ فرض زکوٰۃ (Obligatory Zakat)'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'en'
                  ? 'The third pillar of Islam: 2.5% annual obligation on qualifying wealth surpassing the Nisaab threshold held for a full lunar year.'
                  : 'اسلام کا تیسرا رکن: نصاب سے زائد مال پر ۲.۵ فیصد سالانہ ادائیگی جو صرف مخصوص مستحقینِ زکوٰۃ (مصارفِ زکوٰۃ) کو دی جا سکتی ہے۔'}
              </p>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-amber-800 font-medium">
                {language === 'en' ? '• Nisaab: 7.5 tola gold or 52.5 tola silver' : '• نصاب: ۷.۵ تولہ سونا یا ۵۲.۵ تولہ چاندی'}
              </div>
            </div>

            {/* Fitrana Card (Locked) */}
            <div
              onClick={() => triggerLockedFeatureMessage(language === 'en' ? 'Fitrana Guide & Calculator' : 'صدقۃ الفطر')}
              className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-400 shadow-sm space-y-3 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                  <Lock className="w-3 h-3 text-amber-700" />
                  <span>{language === 'en' ? 'Locked' : 'مقفل'}</span>
                </span>
              </div>
              <h3 className="font-bold text-lg text-stone-900">
                {language === 'en' ? '3. Sadaqat-ul-Fitr (Fitrana / فطرانہ)' : '۳۔ صدقۃ الفطر (فطرانہ)'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'en'
                  ? 'Mandatory charity given before Eid-ul-Fitr prayers on behalf of every member of the household so the impoverished can celebrate Eid.'
                  : 'عید الفطر کی نماز سے قبل ادا کیا جانے والا واجب صدقہ، جو گھر کے ہر فرد کی طرف سے مساکین کو دیا جاتا ہے تاکہ وہ بھی عید کی خوشیوں میں شریک ہو سکیں۔'}
              </p>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-teal-800 font-medium">
                {language === 'en' ? '• Approx ~2 kg wheat or equivalent per head' : '• گندم تقریباً ۲ کلوگرام یا اس کی نقد قیمت'}
              </div>
            </div>
          </div>

          {/* Educational Zakat Estimator Guide */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-stone-900">
                {language === 'en' ? 'Zakat Calculation Estimator (2.5% Rate)' : 'زکوٰۃ حساب کرنے کا معلوماتی کیلکولیٹر (۲.۵٪ شرح)'}
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              {language === 'en'
                ? 'Enter your current surplus wealth held for one lunar year to estimate your religious obligation.'
                : 'اپنا سال بھر محفوظ رہنے والا نقد اور زیورات درج کر کے اپنی فرض زکوٰۃ کا اندازہ لگائیں:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {language === 'en' ? 'Cash & Savings (PKR / USD)' : 'نقد رقم اور بچت:'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={cashAmount || ''}
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {language === 'en' ? 'Gold Weight (Grams)' : 'سونے کا وزن (گرام):'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={goldGrams || ''}
                  onChange={(e) => setGoldGrams(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {language === 'en' ? 'Estimated Zakat Payable (2.5%)' : 'تخمینی زکوٰۃ (۲.۵ فیصد):'}
                </label>
                <div className="px-3 py-2 text-sm font-bold font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
                  {Math.round(cashAmount * 0.025).toLocaleString()} {language === 'en' ? '(on cash)' : 'روپے'}
                </div>
              </div>
            </div>
          </div>

          {/* Strict Anti-Fraud & Regulatory Notice */}
          <div className="p-5 bg-stone-900 text-stone-200 rounded-2xl border border-stone-800 space-y-3 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                {language === 'en'
                  ? 'Integrity, Verification & Financial Security Policy'
                  : 'مالی شفافیت، شرعی توثیق اور سیکیورٹی پالیسی'}
              </span>
            </div>
            <p className="text-stone-300">
              {language === 'en'
                ? 'No fake donation buttons or mock payment confirmations exist in this app. Direct financial collection will only be launched after full registration with state banking authorities and formal vetting by certified Shariah scholars. All assistance requests will undergo background identity scrutiny to protect both donors and recipients.'
                : 'اس ایپ میں کوئی جعلی چندہ لنکس یا فرضی پیمنٹ کنفرمیشنز شامل نہیں ہیں۔ حقیقی مالی معاونت صرف اسی وقت کھولی جائے گی جب اسٹیٹ بینک اور مصدقہ شرعی مفتیانِ کرام سے لائسنس یافتہ گیٹ وے منظور ہو۔ مستحقین کی رازداری اور وقار کا مکمل تحفظ کیا جائے گا۔'}
            </p>
          </div>
        </div>
      )}

      {/* ALL 6 LOCKED FEATURES GRID */}
      {activeTab === 'future' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {FUTURE_LOCKED_FEATURES.map((feature) => {
            const Icon = getFeatureIcon(feature.iconName);
            const isInterested = interestedFeatures.includes(feature.id);

            const displayTitle = language === 'en' ? feature.titleEnglish : feature.titleUrdu;
            const displayDesc = language === 'en' ? feature.descriptionEnglish : feature.descriptionUrdu;

            return (
              <div
                key={feature.id}
                onClick={() => {
                  triggerLockedFeatureMessage(displayTitle);
                  setSelectedFeature(feature);
                }}
                className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Header Icon + Lock Pill */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                      <Lock className="w-3 h-3 text-amber-700" />
                      <span>{language === 'en' ? 'Locked' : 'مقفل'}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-stone-500 font-sans mt-0.5">
                      {language === 'en' ? feature.titleUrdu : feature.titleEnglish}
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {displayDesc}
                  </p>

                  {/* Preview Metrics */}
                  {feature.statsOrPreview && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px]">
                      {feature.statsOrPreview.slice(0, 2).map((stat, idx) => (
                        <div key={idx} className="bg-stone-50 p-2 rounded-lg">
                          <span className="text-stone-400 block text-[10px]">{stat.label}</span>
                          <span className="font-semibold text-stone-800">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 group-hover:underline flex items-center gap-1">
                    {t('view_roadmap')} &larr;
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleInterest(feature.id);
                    }}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isInterested
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-stone-50 text-stone-400 hover:text-stone-700 border-stone-200'
                    }`}
                    title={isInterested ? t('notified_saved') : t('notify_me')}
                  >
                    <Bell className={`w-3.5 h-3.5 ${isInterested ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Modal for Inspected Locked Feature */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto text-stone-800">
            {/* Modal Header */}
            <div className="bg-stone-900 text-stone-100 p-6 flex items-center justify-between border-b border-stone-800 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-amber-200">
                    {language === 'en' ? selectedFeature.titleEnglish : selectedFeature.titleUrdu}
                  </h3>
                  <p className="text-xs text-stone-400">{language === 'en' ? selectedFeature.titleUrdu : selectedFeature.titleEnglish}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Why Locked Notice */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{language === 'en' ? 'Why is this feature currently locked?' : 'یہ فیچر فی الحال کیوں مقفل ہے؟'}</span>
                </div>
                <p className="leading-relaxed">{selectedFeature.whyLocked}</p>
              </div>

              {/* Specifications & Architectural Requirements */}
              <div className="space-y-3">
                <h4 className="font-bold text-base text-stone-900">
                  {language === 'en' ? 'Phase 2 Architecture & Specifications:' : 'اس فیچر کے حتمی اطلاق کی خصوصیات:'}
                </h4>
                <div className="space-y-2">
                  {selectedFeature.specifications.map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Policy / Commission / Warnings */}
              <div className="p-4 bg-stone-900 text-stone-200 rounded-2xl border border-stone-800 space-y-2">
                <h5 className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 uppercase font-sans">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  {language === 'en' ? 'Rules, Transparency & Governance:' : 'حکمتِ عملی و قوانین (Rules & Policy):'}
                </h5>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedFeature.keyRulesOrPolicy}
                </p>
              </div>

              {/* Special interactive calculators/explorers for specific locked features */}
              {selectedFeature.id === 'islamic-teacher-ai' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 text-xs">
                  <h5 className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                    <Calculator className="w-4 h-4 text-emerald-700" />
                    {language === 'en' ? '5% Transparent Commission Calculation Example:' : 'پلیٹ فارم کے 5% شفاف کمیشن کا نمونہ حساب:'}
                  </h5>
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-stone-500 block">{language === 'en' ? 'Lesson Fee' : 'کلاس فیس'}</span>
                      <span className="font-bold text-stone-900">PKR 1,000</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-stone-500 block">{language === 'en' ? 'Platform Fee (5%)' : 'پلیٹ فارم (5%)'}</span>
                      <span className="font-bold text-emerald-700">PKR 50</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-stone-500 block">{language === 'en' ? 'Teacher Payout' : 'استاد کی رقم'}</span>
                      <span className="font-bold text-stone-900">PKR 950</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Close & Notify me action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-stone-400">
                  {selectedFeature.futureReleaseTarget}
                </span>

                <button
                  onClick={() => {
                    toggleInterest(selectedFeature.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                    interestedFeatures.includes(selectedFeature.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 text-stone-100 hover:bg-stone-800'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>
                    {interestedFeatures.includes(selectedFeature.id)
                      ? t('notified_saved')
                      : t('notify_me')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
