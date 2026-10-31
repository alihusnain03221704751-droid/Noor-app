export type UserRoleType = 'Student' | 'Teacher' | 'Content Creator' | 'Other';

export interface UserLoginRecord {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  purpose: string;
  loginTimestamp: string;
  loginDateFormatted: string;
  authMethod: 'google' | 'direct';
}

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: 'member' | 'admin';
  userRole?: UserRoleType;
  loginPurpose?: string;
  lastLoginAt?: string;
  emailVerified: boolean;
  joinedDate: string;
  authProvider: 'google';
  preferences: {
    city: string;
    calculationMethod: 'Karachi' | 'MWL' | 'ISNA' | 'Makkah';
    juristicMethod: 'Hanafi' | 'Shafii';
    azanSound: 'makkah' | 'madinah' | 'fajr' | 'chime';
    prayerAlerts: Record<string, boolean>;
    arabicFontSize: number;
    urduFontSize: number;
    quranReadingTheme: 'light' | 'sepia' | 'dark';
  };
}

export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  tahajjud: string;
  activePrayer: string;
  nextPrayer: {
    name: string;
    nameUrdu: string;
    time: string;
    minutesLeft: number;
  };
  hijriDate: {
    day: number;
    monthNameEn: string;
    monthNameAr: string;
    monthNameUr: string;
    year: number;
    formatted: string;
  };
  gregorianDate: string;
}

export interface CityOption {
  name: string;
  nameUrdu: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameUrdu: string;
  nameEnglish: string;
  revelationPlace: 'Makki' | 'Madani';
  revelationPlaceUrdu: string;
  totalAyat: number;
  totalRukus: number;
  page16LineStart: number;
  paraNumber: number;
}

export interface AyahData {
  numberInSurah: number;
  numberInQuran: number;
  arabicText: string;
  urduTranslation: string;
  juz: number;
  sajda?: boolean;
}

export interface ParaMeta {
  number: number;
  nameArabic: string;
  nameUrdu: string;
  page16LineStart: number;
  page16LineEnd: number;
  surahNames: string[];
}

export interface Line16Data {
  pageNumber: number;
  juzNumber: number;
  surahNumber: number;
  surahNameArabic: string;
  surahNameUrdu: string;
  lines: string[];
  isSurahHeader?: boolean;
}

export interface AzkaarItem {
  id: string;
  titleArabic?: string;
  titleUrdu: string;
  category: 'namaz-steps' | 'morning' | 'evening' | 'after-prayer' | 'sleep' | 'daily' | 'tasbeeh';
  arabicText: string;
  urduTranslation: string;
  reference: string;
  benefitUrdu?: string;
  recommendedRepeat?: number;
}

export interface LockedFeature {
  id: string;
  titleUrdu: string;
  titleEnglish: string;
  badge: string;
  iconName: string;
  descriptionUrdu: string;
  descriptionEnglish: string;
  whyLocked: string;
  futureReleaseTarget: string;
  specifications: string[];
  keyRulesOrPolicy: string;
  statsOrPreview?: {
    label: string;
    value: string;
  }[];
}

export interface MadrasaProgram {
  id: string;
  name: string;
  nameUrdu?: string;
  duration: string;
  gender: 'male' | 'female' | 'both';
  admissionStatus: 'Open' | 'Closed';
  feesDescription: string;
  ageRequirement?: string;
  description?: string;
}

export interface MadrasaTeacher {
  id: string;
  name: string;
  role: string;
  qualification: string;
  experienceYears?: number;
}

export interface MadrasaAdmissionInfo {
  isOpen: boolean;
  sessionStart: string;
  requirements: string[];
  contactPerson: string;
  contactPhone: string;
  scholarshipAvailable: boolean;
  notes?: string;
}

export interface Madrasa {
  id: string;
  name: string;
  nameUrdu?: string;
  wiffaqAffiliation?: string;
  address: string;
  city: string;
  province?: string;
  country: string;
  contactNumber: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  description: string;
  descriptionUrdu?: string;
  lat: number;
  lng: number;
  establishedYear?: number;
  totalStudents: number;
  totalTeachers: number;
  hostelAvailable: boolean;
  campusGender: 'Boys' | 'Girls' | 'Both Campuses';
  programs: MadrasaProgram[];
  teachers: MadrasaTeacher[];
  admissionInfo: MadrasaAdmissionInfo;
  status: 'approved' | 'pending' | 'rejected';
  submittedBy?: {
    name: string;
    email: string;
    timestamp: string;
  };
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  imageUrl?: string;
  rating?: number;
}

export interface Mosque {
  id: string;
  name: string;
  nameUrdu?: string;
  address: string;
  city?: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  jamatInfo?: string;
  facilities?: {
    wudu?: boolean;
    womenPrayerArea?: boolean;
    wheelchair?: boolean;
    parking?: boolean;
    airConditioned?: boolean;
  };
  phone?: string;
  source: 'osm' | 'verified_registry';
}

