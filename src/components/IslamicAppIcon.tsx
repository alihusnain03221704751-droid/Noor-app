import React from 'react';

export type IslamicIconType = 'quran' | 'prayer' | 'azkaar' | 'qibla' | 'madrasa' | 'masajid';

interface IslamicAppIconProps {
  type?: IslamicIconType;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  withGlow?: boolean;
  alt?: string;
}

const ICON_SOURCES: Record<IslamicIconType, string> = {
  quran: '/holy-quran-icon.jpg',
  prayer: '/prayer-icon.jpg',
  azkaar: '/azkaar-icon.jpg',
  qibla: '/qibla-icon.jpg',
  madrasa: '/madrasa-icon.jpg',
  masajid: '/masajid-icon.jpg'
};

const ICON_ALTS: Record<IslamicIconType, string> = {
  quran: 'القرآن الكريم - Holy Quran',
  prayer: 'أوقات الصلاة - Prayer Times',
  azkaar: 'أذكار و تسبيح - Daily Azkaar',
  qibla: 'اتجاه القبلة - Qibla Compass',
  madrasa: 'المدارس الإسلامية - Islamic Madrasas',
  masajid: 'قریبی مساجد - Masajid Near Me'
};

export const IslamicAppIcon: React.FC<IslamicAppIconProps> = ({
  type = 'quran',
  className = '',
  size = 'md',
  withGlow = false,
  alt
}) => {
  const sizeClasses: Record<string, string> = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
    custom: ''
  };

  const imageSrc = ICON_SOURCES[type] || ICON_SOURCES.quran;
  const imageAlt = alt || ICON_ALTS[type] || 'Islamic Icon';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 aspect-square ${withGlow ? 'group' : ''}`}>
      {withGlow && (
        <span className="absolute inset-0 rounded-full bg-emerald-400/40 blur-xs group-hover:blur-sm transition-all pointer-events-none" />
      )}
      <img
        src={imageSrc}
        alt={imageAlt}
        loading="eager"
        decoding="async"
        draggable={false}
        referrerPolicy="no-referrer"
        className={`rounded-full aspect-square object-cover shadow-xs border border-emerald-400/50 relative z-10 select-none transition-transform duration-200 ${
          sizeClasses[size] || ''
        } ${className}`}
      />
    </div>
  );
};

// Backwards compatibility helper
export const HolyQuranIcon: React.FC<Omit<IslamicAppIconProps, 'type'>> = (props) => {
  return <IslamicAppIcon type="quran" {...props} />;
};
