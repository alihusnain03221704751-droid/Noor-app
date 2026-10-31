import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { IslamicMotif } from './IslamicMotif';
import { IslamicAppIcon } from './IslamicAppIcon';
import {
  Compass,
  ShieldCheck,
  User as UserIcon,
  LogIn,
  Lock,
  Clock,
  BookOpen,
  Heart,
  Home,
  Building2
} from 'lucide-react';
import { triggerLockedFeatureMessage } from '../utils/lockedNotice';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  hijriFormatted: string;
  cityNameUrdu: string;
  cityNameEn: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  hijriFormatted,
  cityNameUrdu,
  cityNameEn
}) => {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const displayCity = language === 'en' ? cityNameEn : cityNameUrdu;

  return (
    <header className="sticky top-0 z-40 bg-[#0a2014]/95 text-white backdrop-blur-md border-b border-emerald-900/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Title with Reference Serif Font */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onTabChange('home')}>
            <IslamicAppIcon type="quran" size="md" withGlow={true} className="group-hover:scale-105 transition-transform shadow-md ring-2 ring-amber-400/40" />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold italic tracking-tight text-2xl sm:text-3xl text-white">
                  Hasan Quran
                </span>
                <span className="text-amber-300 font-urdu text-sm hidden sm:inline tracking-wide">
                  {language === 'en' ? 'Authentic Islamic Companion' : 'حسن قرآن'}
                </span>
              </div>
              <div className="text-emerald-200/80 text-[11px] flex items-center gap-1.5 font-medium">
                <span className="text-emerald-300 font-semibold">{displayCity}</span>
                <span aria-hidden="true" className="text-emerald-600">·</span>
                <span className="text-amber-300 font-serif italic">{hijriFormatted}</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Items with Deep Emerald / Gold styling (Home + 4 Main Options + Upgrade) */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => onTabChange('home')}
              className={`px-3 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-emerald-600 text-white font-bold ring-1 ring-amber-400/40 shadow-xs'
                  : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('nav_home')}</span>
            </button>
            <button
              onClick={() => onTabChange('quran')}
              className={`px-3 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'quran'
                  ? 'bg-emerald-600 text-white font-bold ring-1 ring-amber-400/40 shadow-xs'
                  : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <IslamicAppIcon type="quran" size="xs" />
              <span>{t('nav_quran')}</span>
            </button>
            <button
              onClick={() => onTabChange('prayer')}
              className={`px-3 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'prayer'
                  ? 'bg-emerald-600 text-white font-bold ring-1 ring-amber-400/40 shadow-xs'
                  : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <IslamicAppIcon type="prayer" size="xs" />
              <span>{t('nav_prayers')}</span>
            </button>
            <button
              onClick={() => onTabChange('qibla')}
              className={`px-3 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'qibla'
                  ? 'bg-emerald-600 text-white font-bold ring-1 ring-amber-400/40 shadow-xs'
                  : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <IslamicAppIcon type="qibla" size="xs" />
              <span>{t('nav_qibla')}</span>
            </button>
            <button
              onClick={() => onTabChange('azkaar')}
              className={`px-3 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'azkaar'
                  ? 'bg-emerald-600 text-white font-bold ring-1 ring-amber-400/40 shadow-xs'
                  : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <IslamicAppIcon type="azkaar" size="xs" />
              <span>{language === 'en' ? 'Duas & Dhikr' : 'دعائیں اور اذکار'}</span>
            </button>
            <button
              onClick={() => {
                triggerLockedFeatureMessage(language === 'en' ? 'Upgrade Section' : 'اپگریڈ سیکشن');
                onTabChange('upgrade');
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'upgrade' || activeTab === 'madrasas' || activeTab === 'masajid'
                  ? 'bg-linear-to-r from-amber-400 to-amber-500 text-stone-950 font-bold ring-1 ring-amber-300 shadow-xs'
                  : 'text-amber-300 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Upgrade (Locked)' : 'اپگریڈ (مقفل)'}</span>
            </button>
          </nav>

          {/* User, Language Selector & Admin Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSelector />

            {isAuthenticated && user?.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30 transition-colors"
                title="Admin Control Center"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('admin_panel')}</span>
              </button>
            )}

            {isAuthenticated && user ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/70 border border-emerald-700/60 hover:border-amber-400/50 transition-colors text-xs text-white shadow-xs"
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs ring-1 ring-amber-300/50">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[100px] truncate font-medium">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-semibold ring-1 ring-amber-400/30 shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('google_signin')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
