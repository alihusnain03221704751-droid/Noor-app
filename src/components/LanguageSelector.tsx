import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

export const LanguageSelector: React.FC<{ variant?: 'compact' | 'full' }> = ({ variant = 'compact' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: LanguageCode; label: string; sub: string; flag: string }[] = [
    { code: 'en', label: 'English', sub: 'Default', flag: '🇬🇧' },
    { code: 'ur', label: 'اردو', sub: 'Urdu', flag: '🇵🇰' },
    { code: 'ar', label: 'العربية', sub: 'Arabic', flag: '🇸🇦' },
    { code: 'ro', label: 'Roman Urdu', sub: 'Aasan', flag: '📖' }
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-emerald-500 text-xs font-medium transition-colors shadow-xs"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-semibold">{currentLang.label}</span>
        <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 shadow-2xl z-50 overflow-hidden py-1 animate-fade-in">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-800">
            {t('select_language')}
          </div>
          {languages.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors text-xs ${
                  isSelected
                    ? 'bg-emerald-950/70 text-emerald-300 font-bold'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.flag}</span>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-[10px] text-stone-400">{item.sub}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
