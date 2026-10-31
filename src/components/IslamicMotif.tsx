import React from 'react';

interface IslamicMotifProps {
  className?: string;
  variant?: 'dome' | 'crescent' | 'star-burst' | 'floral' | 'lantern' | 'compass-rose';
}

export const IslamicMotif: React.FC<IslamicMotifProps> = ({ className = 'w-6 h-6', variant = 'star-burst' }) => {
  if (variant === 'crescent') {
    return (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path
          d="M27.5 7.5C18.3873 7.5 11 14.8873 11 24C11 33.1127 18.3873 40.5 27.5 40.5C31.5457 40.5 35.2343 39.0531 38.0903 36.634C28.8475 36.2163 21.5 28.5997 21.5 19.25C21.5 14.3948 23.3768 9.97235 26.4678 6.69085C26.8122 7.02715 27.1583 7.29745 27.5 7.5Z"
          fill="currentColor"
        />
        <circle cx="37" cy="13" r="2.5" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'dome') {
    return (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Minaret Left */}
        <rect x="18" y="28" width="8" height="48" rx="2" fill="currentColor" opacity="0.6" />
        <path d="M22 14L26 28H18L22 14Z" fill="currentColor" opacity="0.8" />
        <circle cx="22" cy="12" r="1.5" fill="currentColor" />
        {/* Minaret Right */}
        <rect x="94" y="28" width="8" height="48" rx="2" fill="currentColor" opacity="0.6" />
        <path d="M98 14L102 28H94L98 14Z" fill="currentColor" opacity="0.8" />
        <circle cx="98" cy="12" r="1.5" fill="currentColor" />
        {/* Main Grand Dome */}
        <path
          d="M60 10C42 20 38 42 38 58H82C82 42 78 20 60 10Z"
          fill="currentColor"
          opacity="0.85"
        />
        <circle cx="60" cy="8" r="2.5" fill="currentColor" />
        {/* Smaller side dome */}
        <path d="M38 42C30 46 28 54 28 62H48C48 54 46 46 38 42Z" fill="currentColor" opacity="0.4" />
        <path d="M82 42C90 46 92 54 92 62H72C72 54 74 46 82 42Z" fill="currentColor" opacity="0.4" />
        {/* Base arches */}
        <rect x="22" y="58" width="76" height="18" rx="2" fill="currentColor" opacity="0.9" />
        <path d="M48 76V66C48 62.6863 50.6863 60 54 60H66C69.3137 60 72 62.6863 72 66V76H48Z" fill="#fff" opacity="0.3" />
      </svg>
    );
  }

  if (variant === 'compass-rose') {
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <polygon points="50,6 55,45 50,50 45,45" fill="currentColor" />
        <polygon points="50,94 55,55 50,50 45,55" fill="currentColor" opacity="0.5" />
        <polygon points="6,50 45,45 50,50 45,55" fill="currentColor" opacity="0.5" />
        <polygon points="94,50 55,45 50,50 55,55" fill="currentColor" opacity="0.5" />
        <circle cx="50" cy="50" r="4" fill="currentColor" />
      </svg>
    );
  }

  // Default Star burst / Islamic Geometric Star
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="8" width="16" height="16" stroke="currentColor" strokeWidth="1.5" rx="1" transform="rotate(45 16 16)" opacity="0.75" />
      <rect x="8" y="8" width="16" height="16" stroke="currentColor" strokeWidth="1.5" rx="1" opacity="0.75" />
      <circle cx="16" cy="16" r="2.5" fill="currentColor" />
    </svg>
  );
};
