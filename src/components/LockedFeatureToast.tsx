import React, { useState, useEffect } from 'react';
import { Lock, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LockedFeatureToast: React.FC = () => {
  const { language } = useLanguage();
  const [visible, setVisible] = useState<boolean>(false);
  const [featureName, setFeatureName] = useState<string>('');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleLockedClicked = (e: Event) => {
      const customEvent = e as CustomEvent<{ featureName?: string }>;
      setFeatureName(customEvent.detail?.featureName || '');
      setVisible(true);

      clearTimeout(timer);
      timer = setTimeout(() => {
        setVisible(false);
      }, 4000);
    };

    window.addEventListener('hasan_quran_locked_feature_clicked', handleLockedClicked);
    return () => {
      window.removeEventListener('hasan_quran_locked_feature_clicked', handleLockedClicked);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-fade-in pointer-events-auto"
    >
      <div className="bg-[#0a2014] text-white border-2 border-[#d4af37]/80 rounded-2xl p-4 shadow-2xl ring-2 ring-amber-400/30 flex items-start gap-3.5 backdrop-blur-md">
        <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/50 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Lock className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40">
              {language === 'en' ? 'Locked' : 'مقفل'}
            </span>
            {featureName && (
              <span className="text-xs text-emerald-200/90 font-medium truncate max-w-[200px]">
                {featureName}
              </span>
            )}
          </div>

          <p className="text-xs text-white font-medium leading-relaxed">
            {language === 'en'
              ? 'This feature is currently locked and will be available in a future update.'
              : 'یہ فیچر فی الحال مقفل ہے اور آئندہ اپڈیٹ میں دستیاب ہوگا۔'}
          </p>
          {language === 'en' && (
            <p className="text-[11px] text-amber-200/80 font-urdu leading-normal">
              یہ فیچر فی الحال مقفل ہے اور آئندہ اپڈیٹ میں دستیاب ہوگا۔
            </p>
          )}
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-emerald-900/50 transition-colors shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
