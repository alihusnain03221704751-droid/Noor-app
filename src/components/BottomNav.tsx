import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Home, Lock } from 'lucide-react';
import { IslamicAppIcon, IslamicIconType } from './IslamicAppIcon';
import { triggerLockedFeatureMessage } from '../utils/lockedNotice';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavTabItem {
  id: string;
  label: string;
  islamicIcon?: IslamicIconType;
  fallbackIcon?: React.ElementType;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t, language } = useLanguage();

  const tabs: NavTabItem[] = [
    { id: 'home', label: t('nav_home') || 'Home', fallbackIcon: Home },
    { id: 'quran', label: t('nav_quran'), islamicIcon: 'quran' },
    { id: 'prayer', label: t('nav_prayers'), islamicIcon: 'prayer' },
    { id: 'qibla', label: t('nav_qibla'), islamicIcon: 'qibla' },
    { id: 'azkaar', label: language === 'en' ? 'Dhikr' : 'اذکار', islamicIcon: 'azkaar' },
    { id: 'upgrade', label: language === 'en' ? 'Upgrade (Locked)' : 'اپگریڈ (مقفل)', fallbackIcon: Lock }
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'upgrade') {
      triggerLockedFeatureMessage(language === 'en' ? 'Upgrade Section' : 'اپگریڈ سیکشن');
    }
    onTabChange(tabId);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a2014]/95 text-white backdrop-blur-md border-t border-emerald-900/70 shadow-2xl safe-area-pb">
      <div className="grid grid-cols-6 h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id || (tab.id === 'upgrade' && (activeTab === 'madrasas' || activeTab === 'masajid'));
          const FallbackIcon = tab.fallbackIcon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                isActive
                  ? 'text-amber-300 font-bold'
                  : 'text-emerald-200/60 hover:text-emerald-100'
              }`}
            >
              <div className={`p-1 rounded-full transition-transform ${isActive ? 'scale-110' : ''}`}>
                {tab.islamicIcon ? (
                  <IslamicAppIcon
                    type={tab.islamicIcon}
                    size="sm"
                    withGlow={isActive}
                    className={isActive ? 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'opacity-80 hover:opacity-100'}
                  />
                ) : FallbackIcon ? (
                  <div className={`p-1 rounded-full ${tab.id === 'upgrade' ? 'bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/50' : isActive ? 'bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40' : 'text-emerald-200/60'}`}>
                    <FallbackIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${tab.id === 'upgrade' ? 'stroke-[2.5] text-amber-300' : isActive ? 'stroke-[2.5]' : ''}`} />
                  </div>
                ) : null}
              </div>
              <span className={`text-[9px] mt-0.5 leading-tight text-center truncate max-w-[55px] ${tab.id === 'upgrade' ? 'font-semibold text-amber-300' : isActive ? 'font-bold text-amber-300' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
