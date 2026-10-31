import { LockedFeature } from '../types';

export const FUTURE_LOCKED_FEATURES: LockedFeature[] = [
  {
    id: 'islamic-books',
    titleUrdu: 'اسلامک کتب خانہ (اسلامی کتب و پی ڈی ایف)',
    titleEnglish: 'Islamic Books Library',
    badge: 'مستقبل کا اپگریڈ — فی الحال لاک ہے',
    iconName: 'BookOpen',
    descriptionUrdu: 'مستند اور قانونی اسلامی کتب کا جامع کتب خانہ۔ اس فیچر کے اجرا پر 50 منتخب بنیادی کتب ڈاؤنلوڈ اور آن لائن مطالعہ کے لیے فراہم کی جائیں گی۔',
    descriptionEnglish: 'Curated digital Islamic library featuring 50 verified core books available for reading and offline downloads across Tafseer, Hadith, Seerah, and Fiqh.',
    whyLocked: 'یہ فیچر دوسرے فیز (Phase 2 Upgrade) کے لیے مخصوص ہے اور مصدقہ ڈیجیٹل کتب کے کاپی رائٹ اور تصدیق کے بعد کھولا جائے گا۔',
    futureReleaseTarget: 'اگلا مرحلہ (Phase 2 Upgrade)',
    statsOrPreview: [
      { label: 'منتخب ابتدائی کتب', value: '50 مستند کتب' },
      { label: 'شعبہ جات', value: 'تفسیر، حدیث، سیرت، فقہ، تاریخ' },
      { label: 'سہولیات', value: 'پی ڈی ایف ڈاؤنلوڈ، بک مارک، فل اسکرین ریڈر' }
    ],
    specifications: [
      '50 منتخب بنیادی اسلامی کتب کی پی ڈی ایف ڈاؤنلوڈ کی سہولت',
      'تفسیر القرآن، کتبِ احادیث، سیرت النبی ﷺ اور فقہی مسائل کے الگ الگ زمرہ جات',
      'ان ایپ بک مارکنگ، آخری پڑھے گئے صفحے کی محفوظ یادداشت اور سرچ سسٹم',
      'تمام کتب صرف قانونی اور مجاز اشاعتی اداروں سے تصدیق شدہ ہوں گی'
    ],
    keyRulesOrPolicy: 'تمام کتب کے قانونی حقوق اور درست متن کی سخت جانچ پڑتال کے بعد ہی فراہم کی جائیں گی، کوئی ناقص یا غیر مجاز مواد شامل نہیں ہوگا۔'
  },
  {
    id: 'islamic-videos',
    titleUrdu: 'اسلامک ویڈیوز اور مواد کی جانچ پڑتال',
    titleEnglish: 'Islamic Videos & Content Moderation System',
    badge: 'مستقبل کا اپگریڈ — فی الحال لاک ہے',
    iconName: 'Video',
    descriptionUrdu: 'مستند علمائے کرام کے بیانات، تلاوت اور تعلیمی ویڈیوز۔ تین وارننگ اور چوتھی خلاف ورزی پر خودکار سسپنشن کا سخت ماڈریشن پالیسی سسٹم۔',
    descriptionEnglish: 'Verified Islamic lectures, recitations, and webinars with an automated 3-Warning & 4th-Violation suspension enforcement and human review appeals system.',
    whyLocked: 'ویڈیو ہوسٹنگ اور ماڈریشن ایڈمن ریویو پینل کی تکمیل تک یہ فیچر لاک رکھا گیا ہے۔',
    futureReleaseTarget: 'اگلا مرحلہ (Phase 2 Upgrade)',
    statsOrPreview: [
      { label: 'ماڈریشن نظام', value: '3 وارننگ سسٹم + 4th سسپنشن' },
      { label: 'اپیل پروسیس', value: 'انسانی ایڈمن جائزہ' },
      { label: 'کوالٹی معیار', value: '100% مستند مواد' }
    ],
    specifications: [
      'مجاز صارفین اور اداروں کی طرف سے اسلامی ویڈیوز جمع کرانے کا پورٹل',
      'عوامی رپورٹنگ ٹولز اور نامناسب مواد کی فوری شکایت کا نظام',
      'تین وارننگ اور چوتھی خلاف ورزی پر خودکار اکاؤنٹ بلاک پالیسی',
      'ایڈمن جائزہ اور اپیل کی مکمل سہولت تاکہ غلط فہمی یا جھوٹی رپورٹ سے بچا جا سکے'
    ],
    keyRulesOrPolicy: '۳ وارننگ سسٹم: پہلی خلاف ورزی پر تنبیہ، دوسری پر حتمی نوٹس، تیسری پر آخری تنبیہ، چوتھی تصدیق شدہ خلاف ورزی پر اکاؤنٹ خودکار طریقے سے معطل کر دیا جائے گا۔'
  },
  {
    id: 'islamic-teacher-ai',
    titleUrdu: 'آن لائن اسلامک استاد اور اے آئی تعلیمی پلیٹ فارم',
    titleEnglish: 'Online Islamic Teacher & AI Learning Platform',
    badge: 'مستقبل کا اپگریڈ — فی الحال لاک ہے',
    iconName: 'GraduationCap',
    descriptionUrdu: 'مصدقہ اساتذہ سے تجوید و قرآن اور دینی تعلیم حاصل کرنے کا پورٹل، 5% شفاف کمیشن ماڈل، اور اسلامی مراجع پر مبنی مصدقہ اے آئی معاون۔',
    descriptionEnglish: 'Online Quran & Islamic studies teacher marketplace with transparent 5% platform commission, verified tutor credentials, and verified AI Islamic learning assistant.',
    whyLocked: 'اساتذہ کی اسناد کی تصدیق اور محفوظ پیمنٹ گیٹ وے انٹیگریشن مکمل ہونے تک یہ فیچر لاک ہے۔',
    futureReleaseTarget: 'اگلا مرحلہ (Phase 2 Upgrade)',
    statsOrPreview: [
      { label: 'پلیٹ فارم کمیشن', value: 'صرف 5% (شفاف حساب)' },
      { label: 'مثال (PKR 1000 فیس)', value: 'استاد: 950 روپے | پلیٹ فارم: 50 روپے' },
      { label: 'اے آئی اسلامی معاون', value: 'صرف مستند دینی مراجع' }
    ],
    specifications: [
      'اساتذہ کی رجسٹریشن: اسناد، تدریسی زبان، دستیابی اور پیشگی اسکروٹنی',
      'طلبہ کی رجسٹریشن، اساتذہ کا انتخاب اور کلاس شیڈولنگ',
      'محفوظ ان ایپ میسجنگ اور کلاس روم سسٹم مع تحفظ برائے نو عمر طلبہ',
      'اے آئی لرننگ اسسٹنٹ: بغیر کسی غلط نسبت کے، اختلافی مسائل پر علمائے کرام سے رجوع کی واضح ہدایت'
    ],
    keyRulesOrPolicy: 'پلیٹ فارم کمیشن بالکل شفاف 5% ہوگا۔ اگر فیس 1,000 روپے ہے تو استاد کو 950 روپے ملیں گے اور 50 روپے پلیٹ فارم فیس ہوگی۔ کوئی پوشیدہ کٹوتی نہیں ہوگی۔'
  },
  {
    id: 'mosque-locator',
    titleUrdu: 'قریبی مساجد تلاش کریں (مسجد لوکیٹر)',
    titleEnglish: 'Mosque Locator & Direction Finder',
    badge: 'مستقبل کا اپگریڈ — فی الحال لاک ہے',
    iconName: 'MapPin',
    descriptionUrdu: 'آپ کے قریب ترین مساجد کا تفصیلی نقشہ، جماعت کے اوقات، سہولیات (وضو خانہ، خواتین کی نماز گاہ)، اور سمت کی رہنمائی۔',
    descriptionEnglish: 'Interactive GPS map locator for nearby mosques, verified prayer/jam\'aat timings, facilities (wudu area, female prayer halls), and navigation directions.',
    whyLocked: 'مساجد کے جی پی ایس ڈیٹا اور منتظمین کی تصدیق کا عمل مکمل ہونے تک یہ فیچر لاک رکھا گیا ہے۔',
    futureReleaseTarget: 'اگلا مرحلہ (Phase 2 Upgrade)',
    statsOrPreview: [
      { label: 'کوریج ہدف', value: 'پاکستان اور بین الاقوامی شہر' },
      { label: 'تفصیلات', value: 'پتہ، فون، اوقاتِ جماعت، سہولیات' },
      { label: 'نقشہ سروس', value: 'گوگل میپس ڈائریکشنز' }
    ],
    specifications: [
      'انٹرایکٹو نقشے پر قریبی مساجد کی فوری نشاندہی (صرف صارف کی اجازت کے ساتھ)',
      'شہر، محلہ اور نام سے مساجد کی تلاش',
      'مسجد انتظامیہ کے لیے نئی لسٹنگ یا تصحیح جمع کرانے کی سہولت',
      'جھوٹی یا ڈپلیکیٹ لسٹنگ سے بچاؤ کے لیے تصدیقی عمل'
    ],
    keyRulesOrPolicy: 'صرف صارف کی اجازت سے لوکیشن حاصل کی جائے گی۔ دستی شہر کے انتخاب کی مکمل آزادی ہوگی۔'
  },
  {
    id: 'mahfil-locator',
    titleUrdu: 'محفل لوکیٹر — آج میرے قریب محفل کہاں ہے؟',
    titleEnglish: 'Mahfil Locator (Today & Upcoming Events)',
    badge: 'مستقبل کا اپگریڈ — فی الحال لاک ہے',
    iconName: 'Calendar',
    descriptionUrdu: 'آج اور آئندہ کی محافلِ میلاد، نعت، دروسِ قرآن اور دینی اجتماعات کی تلاش۔ شہر، تاریخ اور فاصلے کے لحاظ سے فوری فلٹر۔',
    descriptionEnglish: 'Community Islamic events explorer answering "Where is a Mahfil happening near me today?", featuring event posters, venues, timings, and verified submissions.',
    whyLocked: 'منتظمین کی رجسٹریشن اور ایونٹ ویریفکیشن پینل مکمل ہونے تک یہ فیچر لاک ہے۔',
    futureReleaseTarget: 'اگلا مرحلہ (Phase 2 Upgrade)',
    statsOrPreview: [
      { label: 'بنیادی مقصد', value: 'آج میرے قریب کہاں محفل ہو رہی ہے؟' },
      { label: 'سہولیات', value: 'پوسٹر، وقت، پتہ، خطیب و نعت خواں' },
      { label: 'فلٹر', value: 'آج کی محافل / آئندہ تاریخیں' }
    ],
    specifications: [
      'لاگ ان صارفین یا منتظمین کے لیے محفل کے کوائف (عنوان، تاریخ، وقت، مقام، خطیب، پوسٹر) جمع کرانے کی سہولت',
      'اشاعت سے قبل ایڈمن ریویو تاکہ جعلی یا منسوخ شدہ محفل پوسٹ نہ ہو',
      'آج ہونے والی محافل کی علیحدہ واضح فہرست اور نقشے پر مقامات',
      'شہر، تاریخ، اور فاصلے کے لحاظ سے سرچ کی سہولت'
    ],
    keyRulesOrPolicy: 'منسوخ شدہ یا پرانی محافل فوری طور پر ایکسپائر نشان زد کی جائیں گی۔ منتظمین اپنی محفل ایڈٹ یا کینسل کر سکیں گے۔'
  },
  {
    id: 'khidmat-e-khalq',
    titleUrdu: 'خدمتِ خلق (صدقہ، زکوٰۃ، فطرانہ اور امداد)',
    titleEnglish: 'Khidmat-e-Khalq (Charity & Welfare Portal)',
    badge: 'مستقبل کا اپگریڈ — فی الحال لاک ہے',
    iconName: 'HeartHandshake',
    descriptionUrdu: 'مستحق افراد اور تصدیق شدہ فلاحی اداروں کی معاونت کا پورٹل۔ صدقہ، زکوٰۃ، فطرانہ، راشن تقسیم اور تعلیمی و طبی امداد کی شفاف رہنمائی۔',
    descriptionEnglish: 'Dedicated humanitarian welfare directory connecting verified charity requests and organizations across Sadqa, Zakat, Fitrana, food rations, and medical aid.',
    whyLocked: 'اسٹیٹ بینک اور سیکیورٹیز قوانین کے تحت پیمنٹ گیٹ وے اور علمائے کرام سے زکوٰۃ کی شرعی تصدیق کا مکمل لائسنس حاصل ہونے تک کوئی چندہ وصول نہیں کیا جائے گا۔',
    futureReleaseTarget: 'اگلا مرحلہ (Phase 2 Upgrade)',
    statsOrPreview: [
      { label: 'شعبہ جات', value: '۹ فلاحی زمرہ جات' },
      { label: 'زکوٰۃ اہلیت', value: 'علمائے کرام سے شرعی توثیق' },
      { label: 'رازداری', value: 'مستحقین کی عزتِ نفس کا مکمل تحفظ' }
    ],
    specifications: [
      'مستقل زمرہ جات: صدقہ، زکوٰۃ، فطرانہ، مالی امداد، راشن و خوراک، طبی علاج، تعلیمی اخراجات، لباس و چھت، رضاکارانہ خدمات',
      'مستحق افراد یا فلاحی اداروں کی درخواستی فارم اور سخت تصدیقی اسکروٹنی',
      'مستحقین کی ذاتی رازداری اور وقار کا مکمل تحفظ (کوئی غیر مناسب تشہیر نہیں)',
      'زکوٰۃ کے لیے الگ اور عام صدقات کے لیے الگ کیٹیگری کی واضح تفریق'
    ],
    keyRulesOrPolicy: 'جب تک مستند لائسنس یافتہ پیمنٹ گیٹ وے اور تصدیق مکمل نہ ہو، ایپ میں کسی قسم کی رقم وصول نہیں کی جائے گی اور نہ ہی کوئی جعلی پیمنٹ دعویٰ کیا جائے گا۔'
  }
];
