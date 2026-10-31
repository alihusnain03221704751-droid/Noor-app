import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRoleType } from '../types';
import {
  X,
  ShieldCheck,
  Key,
  AlertCircle,
  Info,
  Lock,
  GraduationCap,
  BookOpen,
  Video,
  User,
  Sparkles,
  CheckCircle2,
  LogIn
} from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const {
    clientId,
    isConfigured,
    setClientId,
    setAuthError,
    loginWithGoogleCredential,
    loginWithRole,
    loginAsDemoUser,
    authError
  } = useAuth();
  const { t, language } = useLanguage();

  // User Registration & Role state
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('Student');
  const [loginPurpose, setLoginPurpose] = useState<string>('Quran Recitation & Daily Hifz Routine');
  const [activeTabMode, setActiveTabMode] = useState<'register' | 'google'>('register');

  const [inputClientId, setInputClientId] = useState<string>(clientId || '');
  const [manualToken, setManualToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [formValidationMsg, setFormValidationMsg] = useState<string>('');
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const roleOptions: {
    id: UserRoleType;
    labelEn: string;
    labelUrdu: string;
    descEn: string;
    descUrdu: string;
    icon: React.ElementType;
    colorClasses: string;
  }[] = [
    {
      id: 'Student',
      labelEn: 'Student',
      labelUrdu: 'طالب علم',
      descEn: 'Learning Quran, Tajweed & Islamic Studies',
      descUrdu: 'قرآن مجید، تجوید اور دینی تعلیم حاصل کرنا',
      icon: GraduationCap,
      colorClasses: 'border-emerald-300 bg-emerald-50 text-emerald-900 ring-emerald-500'
    },
    {
      id: 'Teacher',
      labelEn: 'Teacher',
      labelUrdu: 'استاد / قاری',
      descEn: 'Teaching Quran, Hadith & Shariah courses',
      descUrdu: 'تجوید، حفظ اور دینی علوم کی تدریس',
      icon: BookOpen,
      colorClasses: 'border-amber-300 bg-amber-50 text-amber-900 ring-amber-500'
    },
    {
      id: 'Content Creator',
      labelEn: 'Content Creator',
      labelUrdu: 'مواد تخلیق کار',
      descEn: 'Creating Islamic media, writings & articles',
      descUrdu: 'اسلامی ویڈیوز، کتب اور مضامین کی تخلیق',
      icon: Video,
      colorClasses: 'border-teal-300 bg-teal-50 text-teal-900 ring-teal-500'
    },
    {
      id: 'Other',
      labelEn: 'Other',
      labelUrdu: 'دیگر / عام صارف',
      descEn: 'General Quran reading, prayer times & azkaar',
      descUrdu: 'تلاوتِ قرآن، اوقاتِ نماز اور روزمرہ اذکار',
      icon: User,
      colorClasses: 'border-stone-300 bg-stone-50 text-stone-900 ring-stone-500'
    }
  ];

  const purposeSuggestions = [
    'Quran Recitation & Daily Hifz Routine',
    'Learning Tajweed & Understanding Meanings',
    'Teaching Quran & Mentoring Students',
    'Publishing Islamic Media & Educational Content',
    'Daily Prayer Timings, Azan Alerts & Qibla Direction',
    'General Islamic Learning & Spiritual Growth'
  ];

  // Initialize official Google Identity Services button if clientId is present
  useEffect(() => {
    if (!isOpen || !clientId) return;

    const timer = setTimeout(() => {
      const googleObj = (window as unknown as {
        google?: {
          accounts?: {
            id?: {
              initialize: (config: {
                client_id: string;
                callback: (res: { credential: string }) => void;
                auto_select?: boolean;
              }) => void;
              renderButton: (
                element: HTMLElement,
                options: {
                  theme?: string;
                  size?: string;
                  text?: string;
                  shape?: string;
                  width?: number;
                }
              ) => void;
            };
          };
        };
      }).google;

      if (googleObj?.accounts?.id && googleBtnContainerRef.current) {
        try {
          googleObj.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: { credential: string }) => {
              if (response.credential) {
                setIsLoadingAuth(true);
                const success = await loginWithGoogleCredential(
                  response.credential,
                  selectedRole,
                  loginPurpose || 'Quran Recitation & Learning'
                );
                setIsLoadingAuth(false);
                if (success) {
                  onClose();
                }
              }
            }
          });

          googleBtnContainerRef.current.innerHTML = '';
          googleObj.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: 'filled_black',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 280
          });
        } catch (err: unknown) {
          console.warn('Google Identity button render notice:', err);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, clientId, loginWithGoogleCredential, selectedRole, loginPurpose, onClose]);

  if (!isOpen) return null;

  const handleDirectRegisterAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setFormValidationMsg(language === 'en' ? 'Please enter your name.' : 'براہ کرم اپنا نام درج کریں۔');
      return;
    }
    setFormValidationMsg('');
    setIsLoadingAuth(true);

    const ok = await loginWithRole(
      userName.trim(),
      selectedRole,
      loginPurpose.trim() || 'Quran Recitation & Learning',
      userEmail.trim()
    );

    setIsLoadingAuth(false);
    if (ok) {
      onClose();
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputClientId.trim()) return;
    setClientId(inputClientId.trim());
  };

  const handleManualTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    setIsLoadingAuth(true);
    const ok = await loginWithGoogleCredential(manualToken.trim(), selectedRole, loginPurpose);
    setIsLoadingAuth(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden text-stone-800 max-h-[92vh] flex flex-col">
        {/* Header with Deep Bottle Green & Gold Styling */}
        <div className="bg-[#0a2014] text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/50 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white font-display">
                  {language === 'en' ? 'User Registration & Login' : 'صارف رجسٹریشن اور لاگ ان'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/80 text-amber-300 border border-amber-400/30">
                  4 ROLES
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                {language === 'en'
                  ? 'Select your role and purpose to personalize your Islamic experience'
                  : 'اپنا نام، کردار (Role) اور مقصد منتخب کر کے لاگ ان کریں'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300/70 hover:text-white hover:bg-emerald-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: Direct Role Registration OR Google OAuth */}
        <div className="bg-stone-100 p-2 border-b border-stone-200 flex items-center gap-1.5 shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTabMode('register')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTabMode === 'register'
                ? 'bg-white text-[#0a2014] shadow-sm font-bold border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LogIn className="w-4 h-4 text-emerald-700" />
            <span>{language === 'en' ? 'Quick Role Registration & Sign In' : 'نام و کردار کے ساتھ رجسٹریشن'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabMode('google')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTabMode === 'google'
                ? 'bg-white text-[#0a2014] shadow-sm font-bold border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{language === 'en' ? 'Google Account Sync' : 'گوگل اکاؤنٹ سنک'}</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {formValidationMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formValidationMsg}</span>
            </div>
          )}

          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </div>
            </div>
          )}

          {/* 1. COLLECT USER'S NAME AND PURPOSE */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                {language === 'en' ? '1. Your Full Name (آپ کا نام):' : '۱۔ آپ کا مکمل نام:'}
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Muhammad Tariq' : 'مثلاً: محمد طارق'}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-stone-900 bg-white shadow-2xs"
              />
            </div>

            {/* 2. CHOOSE 1 OF THE 4 REQUIRED ROLES */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center justify-between">
                <span>{language === 'en' ? '2. Select Your Role (اپنا کردار منتخب کریں):' : '۲۔ اپنا کردار (Role) منتخب کریں:'}</span>
                <span className="text-[10px] text-emerald-700 font-mono font-normal">
                  {selectedRole}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 rounded-2xl border-2 text-left rtl:text-right transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? `${role.colorClasses} ring-2 shadow-md`
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white shadow-xs' : 'bg-stone-100 text-stone-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-stone-900">
                            {language === 'en' ? role.labelEn : role.labelUrdu}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                          {language === 'en' ? role.descEn : role.descUrdu}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. PURPOSE OF LOGIN / REASON */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                {language === 'en' ? '3. Purpose of Login (لاگ ان کا مقصد / وجہ):' : '۳۔ لاگ ان کا مقصد / وجہ:'}
              </label>
              <input
                type="text"
                value={loginPurpose}
                onChange={(e) => setLoginPurpose(e.target.value)}
                placeholder={language === 'en' ? 'Why are you logging in today?' : 'ایپ استعمال کرنے کا مقصد درج کریں'}
                className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 bg-white"
              />

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {purposeSuggestions.slice(0, 3).map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLoginPurpose(suggestion)}
                    className="text-[10px] px-2 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 text-stone-600 transition-colors cursor-pointer"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Email (Optional for direct, required for google) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'en' ? 'Email Address (Optional / اختیاری ای میل):' : 'ای میل ایڈریس (اختیاری):'}
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="e.g. user@example.com"
                className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 bg-white"
              />
            </div>
          </div>

          {/* ACTION BUTTON BASED ON ACTIVE TAB */}
          {activeTabMode === 'register' ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDirectRegisterAndLogin}
                disabled={isLoadingAuth}
                className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-[#0a2014] to-[#143825] hover:from-[#143825] hover:to-[#1a4730] text-amber-300 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ring-1 ring-amber-400/40 active:scale-[0.99]"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>
                  {isLoadingAuth
                    ? (language === 'en' ? 'Saving Registration...' : 'رجسٹریشن محفوظ ہو رہی ہے...')
                    : (language === 'en' ? `Sign In as ${selectedRole}` : `${selectedRole} کے طور پر لاگ ان کریں`)}
                </span>
                <span>➔</span>
              </button>
              <p className="text-[11px] text-center text-stone-500 mt-2">
                {language === 'en'
                  ? 'Your name, role, login timestamp, and purpose will be securely recorded in the Admin Panel.'
                  : 'آپ کا نام، منتخب کردہ کردار، تاریخ و وقت اور مقصد ایڈمن پینل میں محفوظ ہوگا۔'}
              </p>
            </div>
          ) : (
            /* Google OAuth Mode */
            <div className="space-y-4 pt-2 border-t border-stone-200">
              {isConfigured ? (
                <div className="space-y-3 text-center">
                  <p className="text-xs text-stone-600">
                    {language === 'en'
                      ? `Click below to authenticate with Google as ${selectedRole}:`
                      : `گوگل کے ذریعے بطور ${selectedRole} سائن ان کریں:`}
                  </p>
                  <div className="flex flex-col items-center justify-center py-2 min-h-[50px]">
                    <div ref={googleBtnContainerRef} className="flex justify-center" />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveClientId} className="space-y-3">
                  <label className="block text-xs font-semibold text-stone-700">
                    {language === 'en' ? 'Google OAuth Client ID:' : 'گوگل OAuth کلائنٹ آئی ڈی:'}
                  </label>
                  <input
                    type="text"
                    value={inputClientId}
                    onChange={(e) => setInputClientId(e.target.value)}
                    placeholder="xxxxxxxxxxxx.apps.googleusercontent.com"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!inputClientId.trim()}
                    className="w-full py-2 px-4 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                  >
                    {language === 'en' ? 'Save Client ID' : 'کلائنٹ آئی ڈی محفوظ کریں'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo Logins with Defined Roles */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'en' ? 'Quick Review Logins' : 'فوری ٹیسٹ سیشنز'}</span>
              </span>
              <span className="text-[10px] text-amber-800 font-mono bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                1-Click
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  loginAsDemoUser('admin', 'Teacher', 'Super Administrator Management & Governance');
                  onClose();
                }}
                className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-black text-amber-300 font-semibold text-[11px] text-center border border-amber-400/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Super Admin (Ali Husnain)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsDemoUser('member', selectedRole, loginPurpose);
                  onClose();
                }}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-[11px] text-center border border-stone-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Demo {selectedRole} User</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
