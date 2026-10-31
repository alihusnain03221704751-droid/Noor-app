import React, { useState, useEffect, useMemo } from 'react';
import { Mosque } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { IslamicAppIcon } from './IslamicAppIcon';
import { MosqueInteractiveMap } from './masajid/MosqueInteractiveMap';
import {
  calculateDistanceKm,
  VERIFIED_REGISTRY_MOSQUES,
  fetchLiveMosquesFromOSM,
  geocodeLocationNominatim
} from '../services/mosqueService';
import {
  Search,
  MapPin,
  Navigation,
  Compass,
  RotateCw,
  Map as MapIcon,
  List,
  Phone,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Sliders,
  X,
  Building,
  Info
} from 'lucide-react';

interface MasajidSectionProps {
  onBack?: () => void;
}

export const MasajidSection: React.FC<MasajidSectionProps> = ({ onBack }) => {
  const { language } = useLanguage();

  // Location and search state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [centerLocation, setCenterLocation] = useState<{ lat: number; lng: number }>({
    lat: 31.5204, // Default Lahore
    lng: 74.3587
  });
  const [activeCityName, setActiveCityName] = useState<string>('Lahore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

  // Status & loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'info' | 'success' | 'warning';
    text: string;
  } | null>(null);

  // Fetched live mosques
  const [liveMosques, setLiveMosques] = useState<Mosque[]>([]);

  // Popular Pakistani cities quick filters
  const QUICK_CITIES = [
    { name: 'Lahore', nameUrdu: 'لاہور', lat: 31.5204, lng: 74.3587 },
    { name: 'Islamabad', nameUrdu: 'اسلام آباد', lat: 33.7297, lng: 73.0372 },
    { name: 'Karachi', nameUrdu: 'کراچی', lat: 24.8607, lng: 67.0011 },
    { name: 'Rawalpindi', nameUrdu: 'راولپنڈی', lat: 33.6007, lng: 73.0679 },
    { name: 'Faisalabad', nameUrdu: 'فیصل آباد', lat: 31.4187, lng: 73.0791 },
    { name: 'Multan', nameUrdu: 'ملتان', lat: 30.1575, lng: 71.5249 },
    { name: 'Peshawar', nameUrdu: 'پشاور', lat: 34.0151, lng: 71.5249 },
    { name: 'Makkah', nameUrdu: 'مکہ مکرمہ', lat: 21.4225, lng: 39.8262 },
    { name: 'Madinah', nameUrdu: 'مدینہ منورہ', lat: 24.4672, lng: 39.6108 }
  ];

  // Request user GPS location
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage({
        type: 'warning',
        text:
          language === 'en'
            ? 'Geolocation is not supported by your browser.'
            : 'آپ کے براؤزر میں جی پی ایس لوکیشن سپورٹ دستیاب نہیں ہے۔'
      });
      return;
    }

    setIsLocating(true);
    setStatusMessage({
      type: 'info',
      text: language === 'en' ? 'Detecting your GPS location...' : 'آپ کا موجودہ مقام تلاش کیا جا رہا ہے...'
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        const loc = { lat: uLat, lng: uLng };
        setUserLocation(loc);
        setCenterLocation(loc);
        setActiveCityName(language === 'en' ? 'Current GPS Location' : 'موجودہ جی پی ایس مقام');
        setIsLocating(false);
        setStatusMessage({
          type: 'success',
          text:
            language === 'en'
              ? 'GPS Location acquired! Searching nearby mosques...'
              : 'جی پی ایس مقام مل گیا۔ قریبی مساجد تلاش کی جا رہی ہیں...'
        });
        loadMosquesForCoordinates(uLat, uLng);
      },
      (err) => {
        setIsLocating(false);
        let msg =
          language === 'en'
            ? 'Location permission denied. Showing mosques for selected city.'
            : 'لوکیشن کی اجازت نہیں ملی۔ آپ اوپر سے شہر منتخب کر سکتے ہیں۔';
        if (err.code === err.POSITION_UNAVAILABLE) {
          msg = language === 'en' ? 'GPS location unavailable.' : 'جی پی ایس سگنل موصول نہیں ہو سکا۔';
        } else if (err.code === err.TIMEOUT) {
          msg = language === 'en' ? 'Location request timed out.' : 'لوکیشن کی درخواست کا وقت ختم ہو گیا۔';
        }
        setStatusMessage({ type: 'warning', text: msg });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Load mosques from OpenStreetMap & registry
  const loadMosquesForCoordinates = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const osmResults = await fetchLiveMosquesFromOSM(lat, lng, 10);
      setLiveMosques(osmResults);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadMosquesForCoordinates(centerLocation.lat, centerLocation.lng);
  }, []);

  // Handle city chip selection
  const handleSelectCity = (c: (typeof QUICK_CITIES)[0]) => {
    setCenterLocation({ lat: c.lat, lng: c.lng });
    setActiveCityName(language === 'en' ? c.name : c.nameUrdu);
    setSelectedMosque(null);
    setStatusMessage({
      type: 'info',
      text:
        language === 'en'
          ? `Searching mosques in ${c.name}...`
          : `${c.nameUrdu} میں مساجد تلاش کی جا رہی ہیں...`
    });
    loadMosquesForCoordinates(c.lat, c.lng);
  };

  // Handle custom search
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setStatusMessage({
      type: 'info',
      text: language === 'en' ? `Searching for "${searchQuery}"...` : `"${searchQuery}" تلاش کیا جا رہا ہے...`
    });

    const geocoded = await geocodeLocationNominatim(searchQuery);
    if (geocoded) {
      setCenterLocation({ lat: geocoded.lat, lng: geocoded.lng });
      setActiveCityName(searchQuery);
      setStatusMessage({
        type: 'success',
        text:
          language === 'en'
            ? `Location found: ${geocoded.displayName.split(',')[0]}`
            : `مقام مل گیا: ${geocoded.displayName.split(',')[0]}`
      });
      loadMosquesForCoordinates(geocoded.lat, geocoded.lng);
    } else {
      setStatusMessage({
        type: 'warning',
        text:
          language === 'en'
            ? `Could not find area coordinates for "${searchQuery}". Searching local names instead.`
            : `"${searchQuery}" کے لیے درست کوآرڈینیٹس نہیں ملے۔ مقامی ناموں میں تلاش جاری ہے۔`
      });
      setIsLoading(false);
    }
  };

  // Merge verified registry and OSM mosques, filtering and computing distance
  const allDisplayMosques = useMemo(() => {
    const combined: Mosque[] = [];
    const seenIds = new Set<string>();

    // Add live OSM mosques
    liveMosques.forEach((m) => {
      combined.push(m);
      seenIds.add(m.id);
    });

    // Add verified registry mosques with computed distance
    VERIFIED_REGISTRY_MOSQUES.forEach((m) => {
      const dist = calculateDistanceKm(centerLocation.lat, centerLocation.lng, m.lat, m.lng);
      // Only include if reasonably within 40km of searched center or if specifically searched
      if (dist < 45 || !seenIds.has(m.id)) {
        combined.push({
          ...m,
          distanceKm: userLocation
            ? calculateDistanceKm(userLocation.lat, userLocation.lng, m.lat, m.lng)
            : dist
        });
        seenIds.add(m.id);
      }
    });

    // Filter by query if user typed something
    const q = searchQuery.toLowerCase().trim();
    const filtered = combined.filter((m) => {
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        (m.nameUrdu && m.nameUrdu.includes(q)) ||
        m.address.toLowerCase().includes(q) ||
        (m.city && m.city.toLowerCase().includes(q))
      );
    });

    // Sort by distance from center or user location
    return filtered.sort((a, b) => {
      const distA = a.distanceKm ?? 9999;
      const distB = b.distanceKm ?? 9999;
      return distA - distB;
    });
  }, [liveMosques, centerLocation, userLocation, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Header */}
      <div className="bg-linear-to-r from-[#0a2014] via-[#143825] to-[#091a10] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 ring-1 ring-amber-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <IslamicAppIcon
                type="masajid"
                size="md"
                withGlow={true}
                className="ring-2 ring-amber-400/50 shadow-lg"
              />
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
                {language === 'en' ? 'Live Mosque Directory & GPS' : 'قریبی مساجد و نماز گاہیں'}
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {language === 'en' ? 'Masajid Near Me' : 'قریبی مساجد (انٹرایکٹو لائیو میپ)'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 font-urdu leading-relaxed">
              {language === 'en'
                ? 'Discover nearby mosques, accurate OpenStreetMap GPS locations, distance calculation, wudu facilities, and turn-by-turn navigation.'
                : 'قریبی مساجد، انٹرایکٹو لائیو نقشہ، فاصلے کا حساب، وضو و جماعت کی معلومات اور گوگل میپس پر درست راستہ۔'}
            </p>
          </div>

          {/* Quick Actions: Back to Upgrade, Locate Me & Refresh */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-amber-300 border border-emerald-600/50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>←</span>
                <span>{language === 'en' ? 'Back to Upgrade' : 'اپگریڈ سیکشن پر واپسی'}</span>
              </button>
            )}

            <button
              onClick={handleRequestLocation}
              disabled={isLocating}
              className="px-4 py-2.5 rounded-full bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{language === 'en' ? 'Locate Me (GPS)' : 'موجودہ مقام (GPS)'}</span>
            </button>

            <button
              onClick={() => loadMosquesForCoordinates(centerLocation.lat, centerLocation.lng)}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-600/50 shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="تازہ ترین کریں"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{language === 'en' ? 'Refresh' : 'تازہ ترین'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Notice Alert */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : statusMessage.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border border-amber-200'
              : 'bg-stone-100 text-stone-800 border border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="p-1 hover:bg-stone-200/50 rounded-lg text-stone-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Toolbar & City Filter Chips */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e5d8c3] space-y-3.5">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search mosque name, city, area (e.g. Lahore, Faisal Mosque, Clifton Karachi)...'
                  : 'مسجد کا نام، محلہ یا شہر تلاش کریں (مثلاً: بادشاہی مسجد، اسلام آباد، گلبرگ لاہور)...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-[#fcf8f0] border border-[#d9c5a5] rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-[#264a39] hover:bg-[#1e392c] text-white text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            {language === 'en' ? 'Search Area' : 'تلاش کریں'}
          </button>
        </form>

        {/* Quick Popular Cities Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 text-[11px] font-semibold shrink-0 mr-1">
            {language === 'en' ? 'Popular Areas:' : 'مشہور شہر:'}
          </span>
          {QUICK_CITIES.map((c) => {
            const isActive = activeCityName === c.name || activeCityName === c.nameUrdu;
            return (
              <button
                key={c.name}
                onClick={() => handleSelectCity(c)}
                className={`px-3 py-1 rounded-full text-xs transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#264a39] text-white font-bold shadow-xs'
                    : 'bg-[#fcf7ee] hover:bg-stone-200/60 text-stone-700 border border-[#e5d8c3]'
                }`}
              >
                {language === 'en' ? c.name : c.nameUrdu}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Switcher & Result Count Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <span className="font-semibold text-stone-900 font-mono">
            {allDisplayMosques.length} {language === 'en' ? 'Mosques Found' : 'مساجد دستیاب ہیں'}
          </span>
          <span className="text-stone-400">·</span>
          <span>
            {language === 'en' ? `Area: ${activeCityName}` : `علاقہ: ${activeCityName}`}
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-medium">
            OpenStreetMap Verified
          </span>
        </div>

        {/* View Switcher: Both | Map | List */}
        <div className="inline-flex p-1 bg-[#fcf7ee] rounded-xl border border-[#d9c5a5] self-start sm:self-auto">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'both'
                ? 'bg-[#264a39] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {language === 'en' ? 'Split View' : 'دونوں (نقشہ و فہرست)'}
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'map'
                ? 'bg-[#264a39] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Map Only' : 'صرف نقشہ'}</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#264a39] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'List Only' : 'صرف فہرست'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="space-y-6">
        {/* Interactive Map Component */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div className="space-y-2">
            <MosqueInteractiveMap
              userLocation={userLocation}
              mosques={allDisplayMosques}
              selectedMosque={selectedMosque}
              onSelectMosque={(m) => setSelectedMosque(m)}
              centerLocation={centerLocation}
            />
            <p className="text-[11px] text-stone-500 font-mono text-center">
              {language === 'en'
                ? 'Click on any mosque pin to view instant name, distance and GPS turn-by-turn navigation.'
                : 'کسی بھی مسجد کے نشان پر کلک کر کے فاصلہ اور ڈائریکشنز دیکھیں۔'}
            </p>
          </div>
        )}

        {/* Mosques List Grid */}
        {(viewMode === 'both' || viewMode === 'list') && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>{language === 'en' ? 'Verified Nearby Mosques' : 'قریبی تصدیق شدہ مساجد'}</span>
              <span className="text-xs text-stone-500 font-normal">
                ({allDisplayMosques.length})
              </span>
            </h2>

            {allDisplayMosques.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#e5d8c3] space-y-3">
                <Building className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-display font-bold text-lg text-stone-800">
                  {language === 'en' ? 'No Mosques Found in this Area' : 'اس علاقے میں مساجد نہیں ملیں'}
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  {language === 'en'
                    ? 'Try expanding your search query, selecting another city from above, or clicking "Locate Me".'
                    : 'اوپر سے کوئی دوسرا شہر منتخب کریں یا اپنا موجودہ GPS مقام فعال کریں۔'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allDisplayMosques.map((m) => {
                  const isSelected = selectedMosque?.id === m.id;
                  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMosque(m);
                        setCenterLocation({ lat: m.lat, lng: m.lng });
                      }}
                      className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                          : 'border-[#e5d8c3] hover:border-emerald-700/40 hover:shadow-sm'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Title and Distance Tag */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <h3 className="font-bold text-sm text-stone-900 line-clamp-1">
                              {m.name}
                            </h3>
                            {m.nameUrdu && (
                              <p className="font-urdu text-xs text-emerald-800 line-clamp-1">
                                {m.nameUrdu}
                              </p>
                            )}
                          </div>

                          {m.distanceKm !== undefined && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-mono font-bold shrink-0 border border-emerald-200">
                              {m.distanceKm} km
                            </span>
                          )}
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-1.5 text-xs text-stone-500">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{m.address}</span>
                        </div>

                        {/* Jamat or Feature Note */}
                        {m.jamatInfo && (
                          <div className="p-2 bg-[#fcf8f0] rounded-xl text-[11px] text-stone-700 border border-[#e5d8c3] font-urdu">
                            {m.jamatInfo}
                          </div>
                        )}

                        {/* Facilities Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {m.facilities?.wudu && (
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium">
                              وضو خانہ
                            </span>
                          )}
                          {m.facilities?.womenPrayerArea && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                              خواتین کی نماز گاہ
                            </span>
                          )}
                          {m.facilities?.airConditioned && (
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium">
                              AC ہال
                            </span>
                          )}
                          {m.facilities?.parking && (
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium">
                              پارکنگ
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMosque(m);
                            setCenterLocation({ lat: m.lat, lng: m.lng });
                            if (viewMode === 'list') {
                              setViewMode('map');
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{language === 'en' ? 'Show on Map' : 'نقشے پر دیکھیں'}</span>
                        </button>

                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3.5 py-1.5 rounded-xl bg-[#264a39] hover:bg-[#1e392c] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5 text-amber-300" />
                          <span>{language === 'en' ? 'Directions' : 'راستہ دیکھیں'}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
