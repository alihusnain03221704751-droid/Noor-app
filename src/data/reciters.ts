export interface QariReciter {
  id: string;
  nameEnglish: string;
  nameUrdu: string;
  nameArabic: string;
  style: string;
  // Function to build external stream URL for a given surah number (1-114)
  getAudioUrl: (surahNumber: number) => string;
  // Fallback URL in case primary CDN is unreachable
  getFallbackUrl?: (surahNumber: number) => string;
}

const padSurah = (num: number): string => {
  return num.toString().padStart(3, '0');
};

export const QURAN_RECITERS: QariReciter[] = [
  {
    id: 'alafasy',
    nameEnglish: 'Mishary Rashid Alafasy',
    nameUrdu: 'مشاری راشد العفاسی',
    nameArabic: 'مشاري بن راشد العفاسي',
    style: 'Murattal (مرتل)',
    getAudioUrl: (num: number) => `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${padSurah(num)}.mp3`,
    getFallbackUrl: (num: number) => `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${num}.mp3`
  },
  {
    id: 'sudais',
    nameEnglish: 'Abdur-Rahman As-Sudais',
    nameUrdu: 'عبد الرحمن السدیس (امام کعبہ)',
    nameArabic: 'عبد الرحمن السديس',
    style: 'Masjid al-Haram Style',
    getAudioUrl: (num: number) => `https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/${padSurah(num)}.mp3`,
    getFallbackUrl: (num: number) => `https://server11.mp3quran.net/sds/${padSurah(num)}.mp3`
  },
  {
    id: 'abdulbasit_murattal',
    nameEnglish: 'Abdul Basit Abdul Samad (Murattal)',
    nameUrdu: 'عبد الباسط عبد الصمد (مرتل)',
    nameArabic: 'عبد الباسط عبد الصمد',
    style: 'Murattal (مرتل)',
    getAudioUrl: (num: number) => `https://download.quranicaudio.com/quran/abdul_basit_murattal/${padSurah(num)}.mp3`,
    getFallbackUrl: (num: number) => `https://cdn.islamic.network/quran/audio-surah/128/ar.abdulbasitmurattal/${num}.mp3`
  },
  {
    id: 'abdulbasit_mujawwad',
    nameEnglish: 'Abdul Basit Abdul Samad (Mujawwad)',
    nameUrdu: 'عبد الباسط عبد الصمد (تجوید)',
    nameArabic: 'عبد الباسط عبد الصمد - مجود',
    style: 'Mujawwad (مجود)',
    getAudioUrl: (num: number) => `https://download.quranicaudio.com/quran/abdulbaset_mujawwad/${padSurah(num)}.mp3`,
    getFallbackUrl: (num: number) => `https://server7.mp3quran.net/basit/${padSurah(num)}.mp3`
  },
  {
    id: 'ghamdi',
    nameEnglish: 'Saad Al-Ghamdi',
    nameUrdu: 'سعد الغامدی',
    nameArabic: 'سعد الغامدي',
    style: 'Murattal (مرتل)',
    getAudioUrl: (num: number) => `https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete/${padSurah(num)}.mp3`,
    getFallbackUrl: (num: number) => `https://server7.mp3quran.net/s_gmd/${padSurah(num)}.mp3`
  },
  {
    id: 'muaiqly',
    nameEnglish: 'Maher Al-Muaiqly',
    nameUrdu: 'ماہر المعیقلی (امام کعبہ)',
    nameArabic: 'ماهر المعيقلي',
    style: 'Murattal (مرتل)',
    getAudioUrl: (num: number) => `https://download.quranicaudio.com/quran/maher_almu3aiqly/year1440/${padSurah(num)}.mp3`,
    getFallbackUrl: (num: number) => `https://server12.mp3quran.net/maher/${padSurah(num)}.mp3`
  }
];

// Highlighted specific surahs for instant quick-play access
export const QUICK_FEATURED_SURAHS = [
  { number: 1, nameEnglish: 'Al-Fatihah', nameUrdu: 'الفاتحة', titleUrdu: 'سورۃ الفاتحہ', benefitUrdu: 'ام الکتاب، شفاء الامراض' },
  { number: 36, nameEnglish: 'Ya-Sin', nameUrdu: 'یس', titleUrdu: 'سورۃ یٰس', benefitUrdu: 'قلب القرآن (قرآن کا دل)' },
  { number: 55, nameEnglish: 'Ar-Rahman', nameUrdu: 'الرحمن', titleUrdu: 'سورۃ الرحمٰن', benefitUrdu: 'عروس القرآن (قرآن کی زینت)' },
  { number: 56, nameEnglish: 'Al-Waqi\'ah', nameUrdu: 'الواقعة', titleUrdu: 'سورۃ الواقعہ', benefitUrdu: 'وسعتِ رزق اور حفاظت' },
  { number: 67, nameEnglish: 'Al-Mulk', nameUrdu: 'الملك', titleUrdu: 'سورۃ الملک', benefitUrdu: 'عذابِ قبر سے نجات کی بشارت' },
  { number: 18, nameEnglish: 'Al-Kahf', nameUrdu: 'الكهف', titleUrdu: 'سورۃ الکہف', benefitUrdu: 'جمعہ کے دن کا نور اور فتنہ دجال سے حفاظت' },
  { number: 112, nameEnglish: 'Al-Ikhlas', nameUrdu: 'الإخلاص', titleUrdu: 'سورۃ الاخلاص', benefitUrdu: 'ثلث القرآن (ایک تہائی قرآن کا ثواب)' },
  { number: 114, nameEnglish: 'An-Nas', nameUrdu: 'الناس', titleUrdu: 'سورۃ الناس', benefitUrdu: 'معوذتین - وسوسوں سے پناہ' }
];
