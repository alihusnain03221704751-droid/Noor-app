import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeOverview } from './components/HomeOverview';
import { PrayerTimesSection } from './components/PrayerTimesSection';
import { QuranSection } from './components/QuranSection';
import { NamazAzkaarSection } from './components/NamazAzkaarSection';
import { QiblaCompass } from './components/QiblaCompass';
import { FutureUpgradeSection } from './components/FutureUpgradeSection';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { MadrasaSection } from './components/MadrasaSection';
import { MasajidSection } from './components/MasajidSection';
import { LockedFeatureToast } from './components/LockedFeatureToast';
import { MadrasaProvider } from './context/MadrasaContext';
import { CITIES_LIST, calculatePrayerTimes } from './utils/prayerTimes';
import { CityOption, PrayerTimeData } from './types';

function HasanQuranApp() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCity, setSelectedCity] = useState<CityOption>(() => {
    const saved = localStorage.getItem('noor_selected_city');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return CITIES_LIST[0]; // Lahore by default
  });

  const [juristicMethod, setJuristicMethod] = useState<'Hanafi' | 'Shafii'>(() => {
    const saved = localStorage.getItem('noor_juristic_method');
    return saved === 'Shafii' || saved === 'Hanafi' ? saved : 'Hanafi';
  });

  const [prayerTimesData, setPrayerTimesData] = useState<PrayerTimeData>(() =>
    calculatePrayerTimes(new Date(), selectedCity.lat, selectedCity.lng, 'Karachi', juristicMethod)
  );

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Recalculate prayer times every minute or when city/method changes
  useEffect(() => {
    localStorage.setItem('noor_selected_city', JSON.stringify(selectedCity));
    localStorage.setItem('noor_juristic_method', juristicMethod);
    const update = () => {
      setPrayerTimesData(calculatePrayerTimes(new Date(), selectedCity.lat, selectedCity.lng, 'Karachi', juristicMethod));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [selectedCity, juristicMethod]);

  return (
    <div className="min-h-screen bg-warm-canvas text-stone-900 flex flex-col font-sans pb-22 md:pb-12 transition-colors">
      {/* Top Application Header matching Reference styling */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        hijriFormatted={prayerTimesData.hijriDate.formatted}
        cityNameUrdu={selectedCity.nameUrdu}
        cityNameEn={selectedCity.name}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <HomeOverview
            onTabChange={setActiveTab}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            selectedCity={selectedCity}
            prayerTimesData={prayerTimesData}
          />
        )}

        {activeTab === 'prayer' && (
          <PrayerTimesSection
            onGoToQibla={() => setActiveTab('qibla')}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            prayerTimesData={prayerTimesData}
            juristicMethod={juristicMethod}
            onSelectJuristicMethod={setJuristicMethod}
          />
        )}

        {activeTab === 'quran' && <QuranSection />}

        {activeTab === 'azkaar' && <NamazAzkaarSection />}

        {activeTab === 'qibla' && <QiblaCompass selectedCity={selectedCity} />}

        {activeTab === 'madrasas' && (
          <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-400/20 text-amber-500 border border-amber-400/50 mx-auto flex items-center justify-center shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'en' ? 'Locked' : 'مقفل'}</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-stone-900">
              {language === 'en' ? 'Madrasas Directory & Admissions' : 'دینی مدارس ڈائریکٹری و داخلہ جات'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
              {language === 'en'
                ? 'This feature is currently locked and will be available in a future update.'
                : 'یہ فیچر فی الحال مقفل ہے اور آئندہ اپڈیٹ میں دستیاب ہوگا۔'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('upgrade')}
                className="px-5 py-2.5 rounded-full bg-[#0a2014] text-amber-300 font-bold text-xs shadow-md hover:bg-[#143825] transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Return to Upgrade Section' : 'اپگریڈ سیکشن پر واپس جائیں'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'masajid' && (
          <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-500 border border-amber-400/50 mx-auto flex items-center justify-center shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'en' ? 'Locked' : 'مقفل'}</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-stone-900">
              {language === 'en' ? 'Masajid Near Me' : 'قریبی مساجد لوکیٹر'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
              {language === 'en'
                ? 'This feature is currently locked and will be available in a future update.'
                : 'یہ فیچر فی الحال مقفل ہے اور آئندہ اپڈیٹ میں دستیاب ہوگا۔'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('upgrade')}
                className="px-5 py-2.5 rounded-full bg-[#0a2014] text-amber-300 font-bold text-xs shadow-md hover:bg-[#143825] transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Return to Upgrade Section' : 'اپگریڈ سیکشن پر واپس جائیں'}
              </button>
            </div>
          </div>
        )}

        {/* Retain component definitions for future unlock without deleting */}
        {false && (
          <>
            <MadrasaSection onBack={() => setActiveTab('upgrade')} />
            <MasajidSection onBack={() => setActiveTab('upgrade')} />
          </>
        )}

        {activeTab === 'upgrade' && (
          <FutureUpgradeSection onNavigateTab={setActiveTab} />
        )}
      </main>

      {/* Footer Branding & Disclaimer */}
      <footer className="border-t border-emerald-950 bg-[#0a2014] py-8 text-emerald-200/80 text-xs text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="font-display italic font-bold text-lg text-white">Hasan Quran</span>
          <span className="text-emerald-600">·</span>
          <span className="font-urdu text-sm font-semibold text-amber-300">حسن قرآن</span>
        </div>
        <p className="font-urdu text-[11px] text-emerald-100/80 max-w-md mx-auto px-4">
          مستند قرآنی متن اور احادیثِ نبویہ کے ساتھ ڈیزائن کردہ۔ جملہ حقوق محفوظ ہیں۔
        </p>
        <p className="text-[10px] text-emerald-300/60 font-mono">
          Version 1.0 (Production Release) · Phase 2 Upgrades Reserved & Protected
        </p>
      </footer>

      {/* Mobile Bottom Navigation with 6 options including Home */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Global Locked Feature Notification Toast */}
      <LockedFeatureToast />

      {/* Google Sign-In Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MadrasaProvider>
          <HasanQuranApp />
        </MadrasaProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
