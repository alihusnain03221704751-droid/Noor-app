import { CityOption, PrayerTimeData } from '../types';

export const CITIES_LIST: CityOption[] = [
  { name: 'Lahore', nameUrdu: 'لاہور', country: 'Pakistan', lat: 31.5204, lng: 74.3587, timezone: 'Asia/Karachi' },
  { name: 'Karachi', nameUrdu: 'کراچی', country: 'Pakistan', lat: 24.8607, lng: 67.0011, timezone: 'Asia/Karachi' },
  { name: 'Islamabad', nameUrdu: 'اسلام آباد', country: 'Pakistan', lat: 33.6844, lng: 73.0479, timezone: 'Asia/Karachi' },
  { name: 'Rawalpindi', nameUrdu: 'راولپنڈی', country: 'Pakistan', lat: 33.5651, lng: 73.0169, timezone: 'Asia/Karachi' },
  { name: 'Faisalabad', nameUrdu: 'فیصل آباد', country: 'Pakistan', lat: 31.4504, lng: 73.1350, timezone: 'Asia/Karachi' },
  { name: 'Multan', nameUrdu: 'ملتان', country: 'Pakistan', lat: 30.1575, lng: 71.5249, timezone: 'Asia/Karachi' },
  { name: 'Peshawar', nameUrdu: 'پشاور', country: 'Pakistan', lat: 34.0151, lng: 71.5249, timezone: 'Asia/Karachi' },
  { name: 'Quetta', nameUrdu: 'کوئٹہ', country: 'Pakistan', lat: 30.1798, lng: 66.9750, timezone: 'Asia/Karachi' },
  { name: 'Gujranwala', nameUrdu: 'گوجرانوالہ', country: 'Pakistan', lat: 32.1877, lng: 74.1945, timezone: 'Asia/Karachi' },
  { name: 'Sialkot', nameUrdu: 'سیالکوٹ', country: 'Pakistan', lat: 32.4945, lng: 74.5229, timezone: 'Asia/Karachi' },
  { name: 'Hyderabad', nameUrdu: 'حیدرآباد', country: 'Pakistan', lat: 25.3960, lng: 68.3578, timezone: 'Asia/Karachi' },
  { name: 'Sargodha', nameUrdu: 'سرگودھا', country: 'Pakistan', lat: 32.0836, lng: 72.6711, timezone: 'Asia/Karachi' },
  { name: 'Bahawalpur', nameUrdu: 'بہاولپور', country: 'Pakistan', lat: 29.3544, lng: 71.6911, timezone: 'Asia/Karachi' },
  { name: 'Sukkur', nameUrdu: 'سکھر', country: 'Pakistan', lat: 27.7052, lng: 68.8574, timezone: 'Asia/Karachi' },
  { name: 'Abbottabad', nameUrdu: 'ایبٹ آباد', country: 'Pakistan', lat: 34.1688, lng: 73.2215, timezone: 'Asia/Karachi' },
  { name: 'Makkah', nameUrdu: 'مکہ مکرمہ', country: 'Saudi Arabia', lat: 21.3891, lng: 39.8579, timezone: 'Asia/Riyadh' },
  { name: 'Madinah', nameUrdu: 'مدینہ منورہ', country: 'Saudi Arabia', lat: 24.5247, lng: 39.5692, timezone: 'Asia/Riyadh' },
  { name: 'Dubai', nameUrdu: 'دبئی', country: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'London', nameUrdu: 'لندن', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  { name: 'New York', nameUrdu: 'نیویارک', country: 'USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' }
];

export const CALCULATION_METHODS = {
  Karachi: { name: 'Karachi (Univ. of Islamic Sciences)', fajrAngle: 18, ishaAngle: 18 },
  MWL: { name: 'Muslim World League (MWL)', fajrAngle: 18, ishaAngle: 17 },
  ISNA: { name: 'ISNA (North America)', fajrAngle: 15, ishaAngle: 15 },
  Makkah: { name: 'Umm al-Qura University (Makkah)', fajrAngle: 18.5, ishaAngle: 19 }
};

// Math helpers
const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (radians: number) => (radians * 180) / Math.PI;

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  methodName: 'Karachi' | 'MWL' | 'ISNA' | 'Makkah' = 'Karachi',
  juristic: 'Hanafi' | 'Shafii' = 'Hanafi'
): PrayerTimeData {
  const method = CALCULATION_METHODS[methodName] || CALCULATION_METHODS.Karachi;

  // Day of the year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Fractional year (radians)
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1);

  // Equation of time in minutes
  const eqtime = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );

  // Solar declination in radians
  const decl = 0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Timezone offset in hours
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

  // Solar noon in hours (Local Mean Time)
  const solarNoonHours = 12 + (timezoneOffsetHours - lng / 15) - (eqtime / 60);

  // Helper to compute hour angle for sun altitude angle
  const getHourAngle = (angleDeg: number) => {
    const latRad = rad(lat);
    const cosHA = (Math.sin(rad(angleDeg)) - Math.sin(latRad) * Math.sin(decl)) /
      (Math.cos(latRad) * Math.cos(decl));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return 180;
    return deg(Math.acos(cosHA));
  };

  // Sunrise / Sunset (zenith = 90.833 degrees => altitude = -0.833)
  const sunriseHourAngle = getHourAngle(-0.833);
  const sunriseHours = solarNoonHours - sunriseHourAngle / 15;
  const sunsetHours = solarNoonHours + sunriseHourAngle / 15;

  // Fajr (altitude = -fajrAngle)
  const fajrHourAngle = getHourAngle(-method.fajrAngle);
  const fajrHours = solarNoonHours - fajrHourAngle / 15;

  // Isha (altitude = -ishaAngle)
  const ishaHourAngle = getHourAngle(-method.ishaAngle);
  const ishaHours = solarNoonHours + ishaHourAngle / 15;

  // Asr shadow factor
  const shadowFactor = juristic === 'Hanafi' ? 2 : 1;
  const latRad = rad(lat);
  const noonSunAltitude = 90 - Math.abs(lat - deg(decl));
  const minShadow = 1 / Math.tan(rad(noonSunAltitude));
  const asrSunAltitude = deg(Math.atan(1 / (shadowFactor + minShadow)));
  const asrHourAngle = getHourAngle(asrSunAltitude);
  const asrHours = solarNoonHours + asrHourAngle / 15;

  // Zuhr is slightly after solar noon (typically +3 minutes)
  const zuhrHours = solarNoonHours + (3 / 60);

  // Maghrib is right after sunset (typically +2 minutes)
  const maghribHours = sunsetHours + (2 / 60);

  // Tahajjud is recommended in the last third of the night
  // Night duration = Fajr next day - Maghrib
  const tahajjudHours = fajrHours - 1.5; // ~1.5 hours before fajr

  const formatTime = (decimalHours: number): string => {
    let normalized = decimalHours % 24;
    if (normalized < 0) normalized += 24;
    const hours = Math.floor(normalized);
    const minutes = Math.floor((normalized - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const toMinutes = (decimalHours: number): number => {
    let normalized = decimalHours % 24;
    if (normalized < 0) normalized += 24;
    return Math.floor(normalized * 60);
  };

  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  const prayerSchedule = [
    { name: 'Fajr', nameUrdu: 'فجر', mins: toMinutes(fajrHours), display: formatTime(fajrHours) },
    { name: 'Sunrise', nameUrdu: 'طلوع آفتاب', mins: toMinutes(sunriseHours), display: formatTime(sunriseHours) },
    { name: 'Zuhr', nameUrdu: 'ظہر', mins: toMinutes(zuhrHours), display: formatTime(zuhrHours) },
    { name: 'Asr', nameUrdu: 'عصر', mins: toMinutes(asrHours), display: formatTime(asrHours) },
    { name: 'Maghrib', nameUrdu: 'مغرب', mins: toMinutes(maghribHours), display: formatTime(maghribHours) },
    { name: 'Isha', nameUrdu: 'عشاء', mins: toMinutes(ishaHours), display: formatTime(ishaHours) },
  ];

  // Determine active and next prayer
  let activePrayer = 'Isha';
  let nextPrayer = {
    name: prayerSchedule[0].name,
    nameUrdu: prayerSchedule[0].nameUrdu,
    time: prayerSchedule[0].display,
    minutesLeft: (prayerSchedule[0].mins + 1440 - currentMinutes) % 1440
  };

  for (let i = 0; i < prayerSchedule.length; i++) {
    const current = prayerSchedule[i];
    const next = prayerSchedule[(i + 1) % prayerSchedule.length];
    
    if (currentMinutes >= current.mins && (currentMinutes < next.mins || next.mins < current.mins)) {
      activePrayer = current.name;
      const minsLeft = next.mins >= currentMinutes ? next.mins - currentMinutes : (next.mins + 1440) - currentMinutes;
      nextPrayer = {
        name: next.name,
        nameUrdu: next.nameUrdu,
        time: next.display,
        minutesLeft: minsLeft
      };
      break;
    }
  }

  const hijri = getHijriDate(date);

  return {
    fajr: formatTime(fajrHours),
    sunrise: formatTime(sunriseHours),
    zuhr: formatTime(zuhrHours),
    asr: formatTime(asrHours),
    maghrib: formatTime(maghribHours),
    isha: formatTime(ishaHours),
    tahajjud: formatTime(tahajjudHours),
    activePrayer,
    nextPrayer,
    hijriDate: hijri,
    gregorianDate: date.toLocaleDateString('en-PK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
}

// Authentic Umm al-Qura approximate algorithm for Hijri calculation
export function getHijriDate(date: Date, offsetDays = 0): {
  day: number;
  monthNameEn: string;
  monthNameAr: string;
  monthNameUr: string;
  year: number;
  formatted: string;
} {
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + offsetDays);

  const islamicMonths = [
    { en: 'Muharram', ar: 'المحرّم', ur: 'محرم الحرام' },
    { en: 'Safar', ar: 'صفر', ur: 'صفر المظفر' },
    { en: 'Rabi al-Awwal', ar: 'ربيع الأوّل', ur: 'ربیع الاول' },
    { en: 'Rabi al-Thani', ar: 'ربيع الثاني', ur: 'ربیع الثانی' },
    { en: 'Jumada al-Awwal', ar: 'جمادى الأولى', ur: 'جمادی الاول' },
    { en: 'Jumada al-Thani', ar: 'جمادى الآخرة', ur: 'جمادی الثانی' },
    { en: 'Rajab', ar: 'رجب', ur: 'رجب المرجب' },
    { en: 'Shaban', ar: 'شعبان', ur: 'شعبان المعظم' },
    { en: 'Ramadan', ar: 'رمضان', ur: 'رمضان المبارک' },
    { en: 'Shawwal', ar: 'شوّال', ur: 'شوال المکرم' },
    { en: 'Dhu al-Qadah', ar: 'ذو القعدة', ur: 'ذی القعدہ' },
    { en: 'Dhu al-Hijjah', ar: 'ذو الحجّة', ur: 'ذی الحجہ' },
  ];

  // Julian Day
  const m = adjustedDate.getMonth() + 1;
  const y = adjustedDate.getFullYear();
  const d = adjustedDate.getDate();

  let jd = Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4) +
    Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4) +
    d - 32075;

  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) +
    (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
    (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  
  let hijriMonth = Math.floor((24 * l) / 709);
  let hijriDay = l - Math.floor((709 * hijriMonth) / 24);
  let hijriYear = 30 * n + j - 30;

  // Bound checks
  if (hijriMonth < 1) hijriMonth = 1;
  if (hijriMonth > 12) hijriMonth = 12;
  const mIdx = hijriMonth - 1;

  const monthObj = islamicMonths[mIdx] || islamicMonths[0];

  return {
    day: hijriDay,
    monthNameEn: monthObj.en,
    monthNameAr: monthObj.ar,
    monthNameUr: monthObj.ur,
    year: hijriYear,
    formatted: `${hijriDay} ${monthObj.ur} ${hijriYear}ھ`
  };
}

// Calculate Qibla bearing from coordinates
export function calculateQiblaBearing(lat: number, lng: number): { bearing: number; distanceKm: number } {
  const kaabaLat = 21.422487;
  const kaabaLng = 39.826206;

  const lat1 = rad(lat);
  const lat2 = rad(kaabaLat);
  const deltaLng = rad(kaabaLng - lng);

  const y = Math.sin(deltaLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLng);
  let bearing = deg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  // Haversine distance
  const R = 6371; // Earth radius km
  const dLat = lat2 - lat1;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return { bearing: Math.round(bearing * 10) / 10, distanceKm };
}
