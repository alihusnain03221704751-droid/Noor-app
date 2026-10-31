import React, { useState, useEffect } from 'react';
import { CITIES_LIST } from '../utils/prayerTimes';
import { CityOption, PrayerTimeData } from '../types';
import { audioPlayer } from '../utils/audioPlayer';
import { useLanguage } from '../context/LanguageContext';
import {
  prayerNotificationEngine,
  PrayerAlertConfig,
  ActiveAlertNotification
} from '../utils/notificationEngine';
import {
  Clock,
  MapPin,
  Bell,
  BellOff,
  BellRing,
  Volume2,
  VolumeX,
  Compass,
  Navigation,
  CheckCircle,
  Play,
  Square,
  AlertCircle,
  Sliders,
  Check,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { IslamicAppIcon } from './IslamicAppIcon';

interface PrayerTimesSectionProps {
  onGoToQibla: () => void;
  selectedCity: CityOption;
  onSelectCity: (city: CityOption) => void;
  prayerTimesData: PrayerTimeData;
  juristicMethod: 'Hanafi' | 'Shafii';
  onSelectJuristicMethod: (method: 'Hanafi' | 'Shafii') => void;
}

export const PrayerTimesSection: React.FC<PrayerTimesSectionProps> = ({
  onGoToQibla,
  selectedCity,
  onSelectCity,
  prayerTimesData,
  juristicMethod,
  onSelectJuristicMethod
}) => {
  const { t, language } = useLanguage();

  // Toggle states for each individual prayer
  const [activeAlerts, setActiveAlerts] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('noor_prayer_alerts');
    return saved
      ? JSON.parse(saved)
      : { Fajr: true, Sunrise: false, Zuhr: true, Asr: true, Maghrib: true, Isha: true };
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('noor_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [selectedAzanVoice, setSelectedAzanVoice] = useState<'makkah' | 'madinah' | 'fajr' | 'chime'>(() => {
    const saved = localStorage.getItem('noor_azan_voice');
    return (saved as 'makkah' | 'madinah' | 'fajr' | 'chime') || 'makkah';
  });

  const [timingOffset, setTimingOffset] = useState<number>(0);
  const [isPlayingAzan, setIsPlayingAzan] = useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);
  const [testNotificationStatus, setTestNotificationStatus] = useState<string>('');

  // Active in-app notification popup
  const [activeInAppAlert, setActiveInAppAlert] = useState<ActiveAlertNotification | null>(null);

  // Sync and check permissions
  useEffect(() => {
    setNotificationPermission(prayerNotificationEngine.getPermissionStatus());

    const unsubscribe = prayerNotificationEngine.subscribeInAppAlert((alert) => {
      setActiveInAppAlert(alert);
    });

    return () => unsubscribe();
  }, []);

  const prayers = [
    { key: 'Fajr', nameEn: 'Fajr', nameUrdu: 'فجر', time: prayerTimesData.fajr, icon: '🌅', desc: t('fajr_desc') },
    { key: 'Sunrise', nameEn: 'Sunrise', nameUrdu: 'طلوع آفتاب', time: prayerTimesData.sunrise, icon: '☀️', desc: t('sunrise_desc') },
    { key: 'Zuhr', nameEn: 'Zuhr', nameUrdu: 'ظہر', time: prayerTimesData.zuhr, icon: '🌤️', desc: t('zuhr_desc') },
    { key: 'Asr', nameEn: 'Asr', nameUrdu: 'عصر', time: prayerTimesData.asr, icon: '🌇', desc: t('asr_desc') },
    { key: 'Maghrib', nameEn: 'Maghrib', nameUrdu: 'مغرب', time: prayerTimesData.maghrib, icon: '🌆', desc: t('maghrib_desc') },
    { key: 'Isha', nameEn: 'Isha', nameUrdu: 'عشاء', time: prayerTimesData.isha, icon: '🌙', desc: t('isha_desc') },
  ];

  // Keep background notification watcher synchronized
  useEffect(() => {
    const config: PrayerAlertConfig = {
      enabledPrayers: activeAlerts,
      soundEnabled,
      azanSound: selectedAzanVoice,
      timingOffsetMinutes: timingOffset
    };

    const cityName = language === 'en' ? selectedCity.name : selectedCity.nameUrdu;

    prayerNotificationEngine.startScheduledWatcher(() => ({
      prayers: prayers.map((p) => ({
        key: p.key,
        nameUrdu: language === 'en' ? p.nameEn : p.nameUrdu,
        nameEn: p.nameEn,
        time: p.time
      })),
      cityName,
      config
    }));

    return () => {
      prayerNotificationEngine.stopScheduledWatcher();
    };
  }, [activeAlerts, soundEnabled, selectedAzanVoice, timingOffset, prayerTimesData, selectedCity, language]);

  // Toggle individual prayer alert
  const togglePrayerAlert = async (prayerKey: string) => {
    if (!activeAlerts[prayerKey] && notificationPermission !== 'granted') {
      const perm = await prayerNotificationEngine.requestBrowserPermission();
      setNotificationPermission(perm);
    }

    const updated = { ...activeAlerts, [prayerKey]: !activeAlerts[prayerKey] };
    setActiveAlerts(updated);
    localStorage.setItem('noor_prayer_alerts', JSON.stringify(updated));
  };

  const handleRequestNotification = async () => {
    const perm = await prayerNotificationEngine.requestBrowserPermission();
    setNotificationPermission(perm);
  };

  const handlePlayAzan = () => {
    if (isPlayingAzan) {
      audioPlayer.stop();
      setIsPlayingAzan(false);
    } else {
      setIsPlayingAzan(true);
      audioPlayer.playAzan(selectedAzanVoice, () => {
        setIsPlayingAzan(false);
      });
    }
  };

  const handleTriggerTestNotification = async () => {
    let perm = notificationPermission;
    if (perm !== 'granted') {
      perm = await prayerNotificationEngine.requestBrowserPermission();
      setNotificationPermission(perm);
    }

    const config: PrayerAlertConfig = {
      enabledPrayers: activeAlerts,
      soundEnabled,
      azanSound: selectedAzanVoice,
      timingOffsetMinutes: timingOffset
    };

    const nextP = prayerTimesData.nextPrayer;
    const pName = language === 'en' ? nextP.name : nextP.nameUrdu;
    const cName = language === 'en' ? selectedCity.name : selectedCity.nameUrdu;

    prayerNotificationEngine.triggerPrayerAlert(
      nextP.name || 'Fajr',
      pName,
      nextP.name || 'Fajr',
      nextP.time || '05:15 AM',
      cName,
      config,
      true
    );

    setTestNotificationStatus(
      language === 'en'
        ? 'Test alert dispatched successfully!'
        : 'ٹیسٹ الرٹ کامیابی سے بھیجا گیا!'
    );
    setTimeout(() => setTestNotificationStatus(''), 4000);
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setLocationStatus(language === 'en' ? 'Browser does not support GPS.' : 'براؤزر جی پی ایس سپورٹ نہیں کرتا۔');
      return;
    }
    setLocationStatus(language === 'en' ? 'Detecting coordinates...' : 'مقام تلاش کیا جا رہا ہے...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const customCity: CityOption = {
          name: 'Current Location (GPS)',
          nameUrdu: 'موجودہ مقام (GPS)',
          country: 'Pakistan',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timezone: 'Asia/Karachi'
        };
        onSelectCity(customCity);
        setLocationStatus(language === 'en' ? 'Location updated successfully!' : 'مقام کامیابی سے شامل کر دیا گیا۔');
        setTimeout(() => setLocationStatus(''), 3000);
      },
      (err) => {
        setLocationStatus(`${language === 'en' ? 'GPS permission error:' : 'لوکیشن کی خرابی:'} ${err.message}`);
        setTimeout(() => setLocationStatus(''), 4000);
      }
    );
  };

  const handleDismissInAppAlert = () => {
    audioPlayer.stop();
    setIsPlayingAzan(false);
    setActiveInAppAlert(null);
  };

  const currentCityLabel = language === 'en' ? `${selectedCity.name}, ${selectedCity.country}` : `${selectedCity.nameUrdu} (${selectedCity.name})`;
  const nextPrayerName = language === 'en' ? prayerTimesData.nextPrayer.name : prayerTimesData.nextPrayer.nameUrdu;

  return (
    <div className="space-y-6">
      {/* Floating In-App Active Prayer Alert Toast Banner */}
      {activeInAppAlert && (
        <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between gap-4 animate-bounce-once">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
              <BellRing className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-amber-300">
                  Hayya 'ala-Salah — {activeInAppAlert.prayerNameUrdu} time has started!
                </span>
              </div>
              <p className="text-xs text-stone-200">
                {selectedCity.name} · {activeInAppAlert.time} · Prepare for prayer in congregation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDismissInAppAlert}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold transition-colors"
            >
              {t('dismiss')}
            </button>
            <button
              onClick={handleDismissInAppAlert}
              className="p-1.5 text-stone-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner with Next Prayer Countdown & Hijri Calendar */}
      <div className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-[#0a2014] via-[#143825] to-[#091a10] text-white p-6 sm:p-8 shadow-xl border border-emerald-700/60 ring-1 ring-amber-400/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <IslamicAppIcon type="prayer" size="lg" withGlow={true} className="ring-2 ring-amber-400/50 shadow-lg" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span className="font-display italic font-normal text-amber-200/90">{t('next_prayer')}:</span>
                  <span className="text-amber-300 font-display font-bold">{nextPrayerName}</span>
                  <span className="text-xl sm:text-2xl text-emerald-200/80 font-mono font-normal">({prayerTimesData.nextPrayer.time})</span>
                </h1>
                <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>{t('current_prayer')}: {prayerTimesData.activePrayer}</span>
                  <span aria-hidden="true" className="text-emerald-500">·</span>
                  <span className="text-white font-medium">{currentCityLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-300 pt-1">
              <div className="flex items-center gap-1.5 text-amber-200 font-medium font-serif italic">
                <span>{t('islamic_date')}:</span>
                <span className="font-semibold text-white">{prayerTimesData.hijriDate.formatted}</span>
              </div>
              <span aria-hidden="true" className="text-emerald-700 hidden sm:inline">|</span>
              <div className="text-stone-300 font-mono text-xs">
                <span>{prayerTimesData.gregorianDate}</span>
              </div>
            </div>
          </div>

          {/* Countdown Clock Card */}
          <div className="bg-[#0a2014]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-emerald-700/60 shadow-inner flex flex-col items-center justify-center min-w-[200px]">
            <span className="text-xs text-amber-200/80 uppercase tracking-wider font-semibold">{t('time_left')}</span>
            <div className="text-3xl font-bold font-mono text-amber-300 my-1">
              {Math.floor(prayerTimesData.nextPrayer.minutesLeft / 60)}h {(prayerTimesData.nextPrayer.minutesLeft % 60).toString().padStart(2, '0')}m
            </div>
            <span className="text-[11px] text-emerald-200/80">
              {language === 'en' ? 'Until next prayer call' : 'اگلی اذان میں وقت باقی ہے'}
            </span>
          </div>
        </div>
      </div>

      {/* City Selector, GPS Locator & Settings Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5d8c3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* City Select */}
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="city-select" className="text-xs font-semibold text-stone-700 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#264a39]" />
            {t('select_city')}
          </label>
          <select
            id="city-select"
            value={selectedCity.name}
            onChange={(e) => {
              const found = CITIES_LIST.find((c) => c.name === e.target.value);
              if (found) onSelectCity(found);
            }}
            aria-label={t('select_city')}
            className="text-xs font-medium bg-[#fcf8f0] border border-[#d9c5a5] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#264a39] text-stone-800"
          >
            {CITIES_LIST.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.nameUrdu}, {c.country})
              </option>
            ))}
          </select>

          {/* GPS Locate Button */}
          <button
            onClick={handleDetectGps}
            className="text-xs px-3 py-1.5 rounded-xl bg-[#264a39]/10 hover:bg-[#264a39]/20 text-[#264a39] border border-[#264a39]/20 flex items-center gap-1.5 transition-colors font-medium"
            title={t('locate_gps')}
          >
            <Navigation className="w-3 h-3 text-[#264a39]" />
            <span>{t('locate_gps')}</span>
          </button>

          {/* Qibla Direction Shortcut */}
          <button
            onClick={onGoToQibla}
            className="text-xs px-3 py-1.5 rounded-xl bg-amber-100/60 hover:bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Compass className="w-3.5 h-3.5 text-amber-800" />
            <span>{t('find_qibla')}</span>
          </button>
        </div>

        {/* Notification Center Trigger & Juristic Method */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowNotificationCenter(!showNotificationCenter)}
            className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-colors ${
              showNotificationCenter
                ? 'bg-[#264a39] text-white border-[#264a39]'
                : 'bg-[#fcf8f0] hover:bg-stone-100 text-stone-800 border-[#d9c5a5]'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('notification_center')}</span>
          </button>

          <select
            value={juristicMethod}
            onChange={(e) => onSelectJuristicMethod(e.target.value as 'Hanafi' | 'Shafii')}
            className="text-xs bg-[#fcf8f0] border border-[#d9c5a5] rounded-xl px-2.5 py-1.5 text-stone-700 font-medium"
          >
            <option value="Hanafi">{t('hanafi')}</option>
            <option value="Shafii">{t('shafii')}</option>
          </select>
        </div>
      </div>

      {locationStatus && (
        <div className="text-xs p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* DEDICATED PRAYER NOTIFICATION CENTER DRAWER / PANEL */}
      {showNotificationCenter && (
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-xl space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-emerald-400">
                  {t('notification_center')}
                </h3>
              </div>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {t('prayer_alert_sub')}
              </p>
            </div>

            {/* Test Notification Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerTestNotification}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('test_alert')}</span>
              </button>
            </div>
          </div>

          {testNotificationStatus && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{testNotificationStatus}</span>
            </div>
          )}

          {/* Master Permission Status Alert */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-stone-800/80 rounded-xl border border-stone-700 text-xs">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full shrink-0 ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : notificationPermission === 'denied'
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`} />
              <div>
                <span className="font-semibold text-stone-200">
                  {t('browser_perm')}{' '}
                </span>
                <span className={`font-mono font-bold uppercase ${
                  notificationPermission === 'granted'
                    ? 'text-emerald-400'
                    : notificationPermission === 'denied'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}>
                  {notificationPermission === 'granted' ? t('granted') : notificationPermission === 'denied' ? t('denied') : t('default_perm')}
                </span>
                {notificationPermission === 'granted' && (
                  <span className="text-emerald-300 text-[11px] block">
                    {language === 'en' ? 'Active. System popup alerts will appear at prayer start time.' : 'اجازت منظور شدہ ہے۔ مقررہ اوقات پر براؤزر پاپ اپ الرٹ موصول ہوگا۔'}
                  </span>
                )}
                {notificationPermission === 'denied' && (
                  <span className="text-rose-300 text-[11px] block">
                    {language === 'en' ? 'Notifications blocked in browser. Click the lock icon in address bar to allow.' : 'براؤزر سیٹنگز میں نوٹیفکیشن بلاک ہے۔ براؤزر ایڈریس بار سے اجازت دیں۔'}
                  </span>
                )}
              </div>
            </div>

            {notificationPermission !== 'granted' && (
              <button
                onClick={handleRequestNotification}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
              >
                {t('enable_notifications')}
              </button>
            )}
          </div>

          {/* Global Sound & Timing Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/80 flex items-center justify-between">
              <div>
                <span className="text-stone-300 font-semibold block">{t('sound')}</span>
                <span className="text-[10px] text-stone-400">{soundEnabled ? 'Audio alerts enabled' : 'Silent alerts'}</span>
              </div>
              <button
                onClick={() => {
                  const updated = !soundEnabled;
                  setSoundEnabled(updated);
                  localStorage.setItem('noor_sound_enabled', JSON.stringify(updated));
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  soundEnabled ? 'bg-emerald-600' : 'bg-stone-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/80 flex items-center justify-between">
              <div>
                <span className="text-stone-300 font-semibold block">{t('azan_voice')}</span>
                <span className="text-[10px] text-stone-400">Reciter audio</span>
              </div>
              <select
                value={selectedAzanVoice}
                onChange={(e) => {
                  const val = e.target.value as 'makkah' | 'madinah' | 'fajr' | 'chime';
                  setSelectedAzanVoice(val);
                  localStorage.setItem('noor_azan_voice', val);
                }}
                className="text-xs bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-stone-200"
              >
                <option value="makkah">{t('makkah_azan')}</option>
                <option value="madinah">{t('madinah_azan')}</option>
                <option value="fajr">{t('fajr_azan')}</option>
                <option value="chime">{t('chime_sound')}</option>
              </select>
            </div>

            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/80 flex items-center justify-between">
              <div>
                <span className="text-stone-300 font-semibold block">{t('alert_time')}</span>
                <span className="text-[10px] text-stone-400">Trigger offset</span>
              </div>
              <select
                value={timingOffset}
                onChange={(e) => setTimingOffset(Number(e.target.value))}
                className="text-xs bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-stone-200"
              >
                <option value={0}>{t('exact_time')}</option>
                <option value={-5}>{t('min_before_5')}</option>
                <option value={-10}>{t('min_before_10')}</option>
              </select>
            </div>
          </div>

          {/* Quick List of All 6 Prayers with Toggles */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block font-sans">
              {t('prayer_alert_heading')}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {prayers.map((prayer) => {
                const isEnabled = activeAlerts[prayer.key] ?? false;
                const displayName = language === 'en' ? prayer.nameEn : prayer.nameUrdu;
                const secondaryName = language === 'en' ? prayer.nameUrdu : prayer.nameEn;

                return (
                  <div
                    key={prayer.key}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                      isEnabled
                        ? 'bg-stone-800/90 border-emerald-600/70 text-white'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{prayer.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-stone-200">
                            {displayName}
                          </span>
                          <span className="text-[11px] text-stone-400 font-sans">
                            ({secondaryName})
                          </span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-emerald-400 block">
                          {prayer.time}
                        </span>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => togglePrayerAlert(prayer.key)}
                      aria-label={`${prayer.nameEn} toggle`}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEnabled ? 'bg-emerald-600' : 'bg-stone-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5 Prayers Grid Cards with Integrated Switch Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prayers.map((prayer) => {
          const isActive = prayerTimesData.activePrayer === prayer.key;
          const isNext = prayerTimesData.nextPrayer.name === prayer.key;
          const isAlertOn = activeAlerts[prayer.key] ?? false;

          const primaryName = language === 'en' ? prayer.nameEn : prayer.nameUrdu;
          const secondaryName = language === 'en' ? prayer.nameUrdu : prayer.nameEn;

          return (
            <div
              key={prayer.key}
              className={`rounded-[24px] p-5 border transition-all duration-200 relative overflow-hidden ${
                isActive
                  ? 'bg-linear-to-br from-[#0a2014] via-[#143825] to-[#0c2417] text-white border-emerald-600 shadow-md ring-2 ring-amber-400/50'
                  : isNext
                  ? 'bg-[#f4f9f6] text-stone-900 border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/30'
                  : 'bg-white text-stone-900 border-emerald-900/10 hover:border-emerald-600/40 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{prayer.icon}</span>
                    <div>
                      <h3 className={`text-xl font-bold font-display ${isActive ? 'text-white' : 'text-stone-900'}`}>
                        {primaryName}
                      </h3>
                      <span className={`text-[11px] ${isActive ? 'text-amber-200/90' : 'text-stone-500'}`}>
                        {secondaryName}
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs mt-1 ${isActive ? 'text-stone-200' : 'text-stone-500'}`}>
                    {prayer.desc}
                  </p>
                </div>

                {/* Individual Prayer Notification Toggle Button & Switch */}
                <div className="flex flex-col items-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => togglePrayerAlert(prayer.key)}
                    className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
                      isAlertOn
                        ? isActive
                          ? 'bg-[#264a39] text-amber-300 border-emerald-600'
                          : 'bg-[#264a39]/10 text-[#264a39] border-[#264a39]/30 shadow-xs'
                        : isActive
                          ? 'bg-black/30 text-stone-400 border-emerald-900'
                          : 'bg-stone-100 text-stone-400 border-stone-200'
                    }`}
                    title={isAlertOn ? t('azan_alert_on') : t('azan_alert_off')}
                  >
                    {isAlertOn ? (
                      <>
                        <Bell className="w-4 h-4 fill-current" />
                        <span className="text-[10px] font-bold font-mono">ON</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="w-4 h-4" />
                        <span className="text-[10px] font-bold font-mono">OFF</span>
                      </>
                    )}
                  </button>
                  <span className="text-[9px] text-stone-400 font-medium">
                    {isAlertOn ? t('azan_alert_on') : t('azan_alert_off')}
                  </span>
                </div>
              </div>

              {/* Exact Time Display */}
              <div className="mt-4 pt-3 border-t border-stone-200/40 flex items-center justify-between">
                <span className="text-xs font-medium text-stone-400">
                  {language === 'en' ? 'Start Time:' : 'وقتِ اذان و نماز:'}
                </span>
                <span className={`text-2xl font-bold font-mono tracking-tight ${isActive ? 'text-amber-300' : 'text-[#1b382b]'}`}>
                  {prayer.time}
                </span>
              </div>

              {isActive && (
                <div className="mt-2 text-right">
                  <span className="inline-block text-[10px] font-semibold bg-[#264a39] text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {t('current_prayer')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Azan Notification System & Audio Testing Box */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base text-emerald-400 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              {t('azan_sound')}
            </h4>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              {language === 'en'
                ? 'Listen to authentic Azan audio recorded in Makkah & Madinah at prayer time, or test audio playback.'
                : 'نماز کے وقت مستند اذانِ مکہ یا اذانِ مدینہ کی آواز سنیں۔ اگر براؤزر بیک گراؤنڈ پابندی لگائے تو خودکار الارم چائم کا متبادل موجود ہے۔'}
            </p>
          </div>

          {/* Azan Audio Voice Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedAzanVoice}
              onChange={(e) => setSelectedAzanVoice(e.target.value as 'makkah' | 'madinah' | 'fajr' | 'chime')}
              className="text-xs bg-stone-800 text-stone-200 border border-stone-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="makkah">{t('makkah_azan')}</option>
              <option value="madinah">{t('madinah_azan')}</option>
              <option value="fajr">{t('fajr_azan')}</option>
              <option value="chime">{t('chime_sound')}</option>
            </select>

            {/* Test Azan Audio Button */}
            <button
              onClick={handlePlayAzan}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                isPlayingAzan
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
              }`}
            >
              {isPlayingAzan ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{t('stop_azan')}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t('play_azan')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Web Notification Permission Status & Test Button */}
        <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>{t('browser_perm')}</span>
            <span className={`font-semibold ${
              notificationPermission === 'granted'
                ? 'text-emerald-400'
                : notificationPermission === 'denied'
                ? 'text-rose-400'
                : 'text-amber-400'
            }`}>
              {notificationPermission === 'granted'
                ? t('granted')
                : notificationPermission === 'denied'
                ? t('denied')
                : t('default_perm')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {notificationPermission !== 'granted' && (
              <button
                onClick={handleRequestNotification}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg text-amber-300 font-medium transition-colors"
              >
                {t('enable_notifications')}
              </button>
            )}

            <button
              onClick={handleTriggerTestNotification}
              className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600 rounded-lg text-emerald-200 font-medium transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{t('test_alert')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
