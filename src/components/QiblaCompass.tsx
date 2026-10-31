import React, { useState, useEffect } from 'react';
import { calculateQiblaBearing } from '../utils/prayerTimes';
import { CityOption } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Navigation, MapPin, Info, ArrowUpRight } from 'lucide-react';
import { IslamicMotif } from './IslamicMotif';
import { IslamicAppIcon } from './IslamicAppIcon';

interface QiblaCompassProps {
  selectedCity: CityOption;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ selectedCity }) => {
  const { t, language } = useLanguage();
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSupport, setHasCompassSupport] = useState<boolean>(false);

  const { bearing, distanceKm } = calculateQiblaBearing(selectedCity.lat, selectedCity.lng);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setHasCompassSupport(true);
        const heading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading ?? (360 - e.alpha);
        setDeviceHeading(heading);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const needleRotation = (bearing - deviceHeading + 360) % 360;
  const cityName = language === 'en' ? selectedCity.name : selectedCity.nameUrdu;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Info Card */}
      <div className="bg-white rounded-[32px] p-6 border border-[#e5d8c3] shadow-sm text-center space-y-3">
        <div className="flex justify-center mb-1">
          <IslamicAppIcon type="qibla" size="lg" withGlow={true} className="ring-2 ring-emerald-500/40 shadow-md" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
            {t('qibla_title')}
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            {language === 'en'
              ? `Direction to the Holy Kaaba in Makkah from ${cityName} (${selectedCity.country})`
              : `مقام: ${selectedCity.nameUrdu} (${selectedCity.name}) سے خانہ کعبہ کا رخ`}
          </p>
        </div>

        <div className="inline-flex items-center gap-6 bg-[#fcf8f0] px-6 py-2.5 rounded-2xl border border-[#d9c5a5] text-xs">
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-bold">{t('bearing')}</span>
            <span className="font-mono font-bold text-[#264a39] text-lg">{bearing}°</span>
          </div>
          <div className="h-7 w-px bg-[#d9c5a5]" />
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-bold">{t('distance')}</span>
            <span className="font-mono font-bold text-stone-900 text-lg">{distanceKm.toLocaleString()} {t('km')}</span>
          </div>
        </div>
      </div>

      {/* Compass Dial Graphic (Matching Holy Quran Medallion Green & Gold Palette) */}
      <div className="rounded-[36px] bg-linear-to-b from-[#0a2014] via-[#143825] to-[#091a10] p-8 sm:p-10 border border-emerald-700/60 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden text-white">
        {/* Subtle decorative background ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 text-emerald-400">
          <IslamicMotif variant="compass-rose" className="w-[420px] h-[420px]" />
        </div>

        {/* Vintage Rose Dial Frame */}
        <div className="relative w-76 h-76 sm:w-80 sm:h-80 rounded-full border-4 border-amber-400/60 bg-linear-to-b from-[#0e2c1c] to-[#081a10] flex items-center justify-center shadow-2xl ring-4 ring-emerald-500/20">
          {/* Compass Dial Cardinal Directions */}
          <span className="absolute top-3 font-display font-bold text-sm text-amber-300">N</span>
          <span className="absolute bottom-3 font-display font-bold text-sm text-emerald-300/70">S</span>
          <span className="absolute right-3 font-display font-bold text-sm text-emerald-300/70">E</span>
          <span className="absolute left-3 font-display font-bold text-sm text-emerald-300/70">W</span>

          {/* Dial Degrees & Marks */}
          <div className="absolute inset-5 rounded-full border border-dashed border-emerald-500/30 pointer-events-none" />
          <div className="absolute inset-10 rounded-full border border-emerald-600/20 pointer-events-none" />

          {/* Rotating Compass Needle Pointer */}
          <div
            className="absolute w-full h-full transition-transform duration-500 ease-out flex items-center justify-center"
            style={{ transform: `rotate(${needleRotation}deg)` }}
          >
            {/* Kaaba Direction Needle (Pointing Up) */}
            <div className="flex flex-col items-center h-full justify-between py-7 pointer-events-none">
              <div className="flex flex-col items-center">
                {/* Kaaba Badge */}
                <div className="w-7 h-7 rounded-lg bg-stone-950 text-white text-xs font-bold flex items-center justify-center shadow-lg border-2 border-amber-400">
                  🕋
                </div>
                {/* Needle top half (Gold & Emerald) */}
                <div className="w-2 h-24 bg-gradient-to-t from-amber-500 via-emerald-500 to-emerald-400 rounded-full shadow-md mt-1" />
              </div>
              {/* Needle bottom half (Bronze) */}
              <div className="w-1.5 h-16 bg-amber-700/60 rounded-full opacity-60" />
            </div>
          </div>

          {/* Center Brass Hub */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-2 border-white shadow-md z-10 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0a2014]" />
          </div>
        </div>

        {/* Live Status and Instructions matching Reference Style */}
        <div className="mt-6 text-center text-xs space-y-1 relative z-10">
          <p className="font-display font-bold text-base text-amber-300">
            {language === 'en'
              ? `Direction to Holy Kaaba: ${bearing}°`
              : `خانہ کعبہ (مکہ مکرمہ) کا رخ: ${bearing}°`}
          </p>
          <p className="text-[11px] text-emerald-200/90 font-medium">
            {hasCompassSupport
              ? (language === 'en' ? 'Live Gyroscope Active · Rotate until arrow points to 🕋 Kaaba' : 'موبائل جائرو سینسر فعال ہے۔ تیر کا رخ کعبہ شریف کی طرف رکھیں۔')
              : (language === 'en' ? 'Astronomical bearing calculated for your coordinates.' : 'کمپاس زاویہ فلکیاتی کلیے کے تحت بالکل درست ہے۔')}
          </p>
        </div>
      </div>
    </div>
  );
};
