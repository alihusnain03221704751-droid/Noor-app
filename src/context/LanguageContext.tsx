import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'ur' | 'ar' | 'ro';

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Brand & Header
    app_title: 'Hasan Quran',
    app_subtitle: 'Authentic Islamic Companion',
    nav_home: 'Home',
    nav_prayers: 'Prayer Times',
    nav_quran: 'Holy Quran',
    nav_azkaar: 'Namaz & Azkaar',
    nav_qibla: 'Qibla Direction',
    nav_madrasas: 'Madrasas',
    nav_masajid: 'Masajid Near Me',
    nav_future: 'Future Upgrades',
    admin_panel: 'Admin Panel',
    google_signin: 'Sign in with Google',
    logout: 'Log Out',
    account_profile: 'Account Profile',
    active_city: 'City',
    current_prayer: 'Current Prayer',
    next_prayer: 'Next Prayer',
    time_left: 'Time Remaining',
    islamic_date: 'Hijri Date',

    // Language selector
    select_language: 'Language',
    lang_en: 'English',
    lang_ur: 'اردو (Urdu)',
    lang_ar: 'العربية (Arabic)',
    lang_ro: 'Roman Urdu',

    // Prayer Section
    prayers_title: 'Prayer Timings & Azan Notifications',
    select_city: 'Select City:',
    locate_gps: 'Locate via GPS',
    find_qibla: 'Qibla Compass',
    method: 'Method:',
    hanafi: 'Asr Hanafi',
    shafii: 'Asr Shafi\'i',
    notification_center: 'Notification Center',
    azan_alert_on: 'Alert ON',
    azan_alert_off: 'Alert OFF',
    test_alert: 'Test Notification',
    enable_notifications: 'Enable Notifications',
    browser_perm: 'Browser Permission:',
    granted: 'Granted',
    denied: 'Blocked',
    default_perm: 'Required',
    azan_sound: 'Azan Audio & Voice',
    azan_voice: 'Azan Voice:',
    makkah_azan: 'Makkah Al-Mukarramah',
    madinah_azan: 'Madinah Al-Munawwarah',
    fajr_azan: 'Fajr Azan',
    chime_sound: 'Harmonic Chime',
    play_azan: 'Test Audio',
    stop_azan: 'Stop Audio',
    alert_time: 'Timing:',
    exact_time: 'At exact prayer time',
    min_before_5: '5 min before',
    min_before_10: '10 min before',
    prayer_alert_heading: 'Individual Prayer Toggles',
    prayer_alert_sub: 'Toggle notifications for each prayer time using browser Notification API.',

    // Prayers
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    zuhr: 'Zuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    tahajjud: 'Tahajjud',
    fajr_desc: 'Dawn break before sunrise',
    sunrise_desc: 'End of Fajr time',
    zuhr_desc: 'Midday solar zenith',
    asr_desc: 'Late afternoon prayer',
    maghrib_desc: 'Immediately after sunset',
    isha_desc: 'Night prayer',

    // Quran Section
    quran_options: 'Select Quran Reading Mode:',
    option_a: 'Option A: With Urdu Translation',
    option_b: 'Option B: 16-Line Traditional Quran',
    select_surah: 'Select Surah:',
    search_surah: 'Search Surah (name or number)...',
    all: 'All',
    makki: 'Makki',
    madani: 'Madani',
    verses: 'Verses',
    juz: 'Para / Juz',
    font_size: 'Font Sizes',
    arabic_font_size: 'Arabic Font Size',
    urdu_font_size: 'Urdu Font Size',
    bookmark: 'Bookmark',
    prev_surah: 'Previous',
    next_surah: 'Next',
    bismillah_meaning: 'In the name of Allah, the Most Gracious, the Most Merciful',
    traditional_mushaf: '16-Line Indo-Pak Mushaf',
    without_translation: 'Pure Quranic Text (No Translation)',
    page_number: 'Page',
    jump_to_page: 'Jump to Page:',
    go: 'Go',
    parchment: 'Parchment',
    white: 'White',
    dark_mode: 'Dark Mode',
    zoom_in: 'Zoom In',
    zoom_out: 'Zoom Out',
    prev_page: 'Previous Page',
    next_page: 'Next Page',
    first_page: 'First Page',
    last_page: 'Last Page',

    // Azkaar Section
    namaz_steps: 'Step-by-Step Namaz',
    morning_azkaar: 'Morning Azkaar',
    evening_azkaar: 'Evening Azkaar',
    after_prayer: 'After Salah Azkaar',
    sleep_waking: 'Sleep & Waking Duas',
    daily_duas: 'Daily Occasions',
    digital_tasbeeh: 'Digital Tasbeeh',
    repeat_count: 'Count:',
    reference: 'Reference:',
    benefit: 'Benefit & Method:',
    tasbeeh_click: 'SubhanAllah (Tap to Count)',
    reset: 'Reset',
    sound: 'Sound',
    total_dhikr: 'Total Dhikr Completed:',
    target: 'Target:',

    // Qibla Section
    qibla_title: 'Qibla Direction (Holy Kaaba)',
    qibla_sub: 'Compass bearing angle and distance from your location to the Kaaba in Makkah.',
    bearing: 'Bearing Angle',
    distance: 'Distance',
    km: 'km',
    compass_instruction: 'Align your phone towards the Kaaba indicator.',

    // Future Upgrades
    future_title: 'Reserved for Future Upgrade',
    future_badge: 'Phase 2 Upgrade — Currently Locked',
    future_sub: 'These features are designed for future release. They remain locked until authorized. No payments are charged.',
    locked_tag: 'Currently Locked',
    view_roadmap: 'View Roadmap & Specifications',
    notify_me: 'Notify Me on Release',
    notified_saved: 'Interest Recorded',

    // Modals
    account_settings: 'Account Settings',
    account_role: 'Account Role:',
    member: 'Registered Member',
    admin: 'Administrator',
    joined: 'Joined:',
    email: 'Email:',
    preferences: 'Preferences:',
    privacy_title: 'Privacy & Data Protection:',
    close: 'Close',
    dismiss: 'Dismiss',
    save: 'Save'
  },

  ur: {
    // Brand & Header
    app_title: 'حسن قرآن',
    app_subtitle: 'مستند اسلامی رفیق',
    nav_home: 'ہوم (مرکزی صفحہ)',
    nav_prayers: 'اوقاتِ نماز',
    nav_quran: 'قرآن مجید',
    nav_azkaar: 'نماز و اذکار',
    nav_qibla: 'قبلہ رخ',
    nav_madrasas: 'مدارس',
    nav_masajid: 'قریبی مساجد',
    nav_future: 'مستقبل کے فیچرز',
    admin_panel: 'ایڈمن پینل',
    google_signin: 'گوگل سائن ان',
    logout: 'لاگ آؤٹ',
    account_profile: 'اکاؤنٹ پروفائل',
    active_city: 'شہر',
    current_prayer: 'موجودہ نماز',
    next_prayer: 'اگلی نماز',
    time_left: 'باقی وقت',
    islamic_date: 'اسلامی تاریخ',

    // Language selector
    select_language: 'زبان منتخب کریں',
    lang_en: 'English (انگریزی)',
    lang_ur: 'اردو (Urdu)',
    lang_ar: 'العربية (عربی)',
    lang_ro: 'Roman Urdu (رومن اردو)',

    // Prayer Section
    prayers_title: 'نماز کے اوقات اور اذان نوٹیفکیشنز',
    select_city: 'شہر کا انتخاب کریں:',
    locate_gps: 'جی پی ایس لوکیشن',
    find_qibla: 'قبلہ کی سمت',
    method: 'طریقہ:',
    hanafi: 'عصر حنفی',
    shafii: 'عصر شافعی',
    notification_center: 'نوٹیفکیشن سینٹر',
    azan_alert_on: 'الرٹ فعال',
    azan_alert_off: 'الرٹ بند',
    test_alert: 'ٹیسٹ نوٹیفکیشن',
    enable_notifications: 'نوٹیفکیشن چالو کریں',
    browser_perm: 'براؤزر اجازت:',
    granted: 'منظور شدہ',
    denied: 'بلاک شدہ',
    default_perm: 'اجازت درکار',
    azan_sound: 'اذان آڈیو اور مؤذن',
    azan_voice: 'اذان کی آواز:',
    makkah_azan: 'مکہ مکرمہ',
    madinah_azan: 'مدینہ منورہ',
    fajr_azan: 'فجر اذان',
    chime_sound: 'بیات چائم',
    play_azan: 'اذان سنیں',
    stop_azan: 'بند کریں',
    alert_time: 'وقت:',
    exact_time: 'عین وقت پر',
    min_before_5: '۵ منٹ پہلے',
    min_before_10: '۱۰ منٹ پہلے',
    prayer_alert_heading: 'ہر نماز کے لیے انفرادی ٹوگلز',
    prayer_alert_sub: 'براؤزر نوٹیفکیشن کے ذریعے نماز کے وقت الرٹ پائیں۔',

    // Prayers
    fajr: 'فجر',
    sunrise: 'طلوع آفتاب',
    zuhr: 'ظہر',
    asr: 'عصر',
    maghrib: 'مغرب',
    isha: 'عشاء',
    tahajjud: 'تہجد',
    fajr_desc: 'طلوعِ صبح صادق',
    sunrise_desc: 'مکروہ وقت',
    zuhr_desc: 'زوالِ آفتاب کے بعد',
    asr_desc: 'حنفی مثلین',
    maghrib_desc: 'غروبِ آفتاب',
    isha_desc: 'شفقِ احمر کے بعد',

    // Quran Section
    quran_options: 'قرآن مجید کے دونوں اختیارات:',
    option_a: 'آپشن (الف): با ترجمہ',
    option_b: 'آپشن (ب): ۱۶ سطری مصحف',
    select_surah: 'سورۃ کا انتخاب کریں:',
    search_surah: 'سورۃ تلاش کریں (نام یا نمبر)...',
    all: 'تمام',
    makki: 'مکی',
    madani: 'مدنی',
    verses: 'آیات',
    juz: 'پارہ',
    font_size: 'فونٹ سائز',
    arabic_font_size: 'عربی فونٹ سائز',
    urdu_font_size: 'اردو ترجمہ فونٹ سائز',
    bookmark: 'بک مارک',
    prev_surah: 'پچھلی سورۃ',
    next_surah: 'اگلی سورۃ',
    bismillah_meaning: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
    traditional_mushaf: 'سولہ سطری مصحف',
    without_translation: 'خالص قرآنی متن (بغیر ترجمہ)',
    page_number: 'صفحہ',
    jump_to_page: 'صفحہ درج کریں:',
    go: 'جائیں',
    parchment: 'قرآنی اوراق',
    white: 'سفید',
    dark_mode: 'نائٹ موڈ',
    zoom_in: 'زوم بڑھائیں',
    zoom_out: 'زوم کم کریں',
    prev_page: 'پچھلا صفحہ',
    next_page: 'اگلا صفحہ',
    first_page: 'پہلا صفحہ',
    last_page: 'آخری صفحہ',

    // Azkaar Section
    namaz_steps: 'طریقہ نماز',
    morning_azkaar: 'صبح کے اذکار',
    evening_azkaar: 'شام کے اذکار',
    after_prayer: 'نماز کے بعد کے اذکار',
    sleep_waking: 'سونے اور جاگنے کی دعائیں',
    daily_duas: 'روزمرہ مسنون دعائیں',
    digital_tasbeeh: 'ڈیجیٹل تسبیح کاؤنٹر',
    repeat_count: 'تعداد:',
    reference: 'حوالہ:',
    benefit: 'فضیلت و طریقہ:',
    tasbeeh_click: 'سبحان اللہ (تسبیح پڑھیں)',
    reset: 'ری سیٹ',
    sound: 'آواز',
    total_dhikr: 'کل پڑھی گئی تسبیحات:',
    target: 'ہدف:',

    // Qibla Section
    qibla_title: 'سمتِ قبلہ (خانہ کعبہ)',
    qibla_sub: 'آپ کے موجودہ مقام سے خانہ کعبہ کا درست زاویہ اور فاصلہ۔',
    bearing: 'زاویہ رخ',
    distance: 'فاصلہ',
    km: 'کلومیٹر',
    compass_instruction: 'اپنے فون کو کعبہ کے نشان کی سیدھ میں رکھیں۔',

    // Future Upgrades
    future_title: 'مستقبل کے محفوظ فیچرز',
    future_badge: 'فیز ۲ اپگریڈ — فی الحال لاک ہے',
    future_sub: 'یہ ۶ فیچرز آئندہ باضابطہ اپگریڈ کے لیے مخصوص ہیں اور منظوری تک مقفل رہیں گے۔ کوئی فیس وصول نہیں کی جا رہی۔',
    locked_tag: 'فی الحال لاک ہے',
    view_roadmap: 'مکمل روڈ میپ دیکھیں',
    notify_me: 'اجرا پر مجھے مطلع کریں',
    notified_saved: 'اطلاع درج کر لی گئی ہے',

    // Modals
    account_settings: 'اکاؤنٹ سیٹنگز',
    account_role: 'اکاؤنٹ کی نوعیت:',
    member: 'رجسٹرڈ صارف',
    admin: 'ایڈمنسٹریٹر',
    joined: 'شمولیت:',
    email: 'ای میل:',
    preferences: 'ذاتی ترجیحات:',
    privacy_title: 'رازداری اور تحفظ:',
    close: 'بند کریں',
    dismiss: 'ختم کریں',
    save: 'محفوظ کریں'
  },

  ar: {
    // Brand & Header
    app_title: 'حسن القرآن',
    app_subtitle: 'رفيقك الإسلامي الموثوق',
    nav_home: 'الرئيسية',
    nav_prayers: 'مواقيت الصلاة',
    nav_quran: 'القرآن الكريم',
    nav_azkaar: 'الأذكار والأدعية',
    nav_qibla: 'اتجاه القبلة',
    nav_madrasas: 'المدارس الإسلامية',
    nav_masajid: 'المساجد القريبة',
    nav_future: 'ميزات مستقبلية',
    admin_panel: 'لوحة الإدارة',
    google_signin: 'تسجيل الدخول بجوجل',
    logout: 'تسجيل الخروج',
    account_profile: 'الملف الشخصي',
    active_city: 'المدينة',
    current_prayer: 'الصلاة الحالية',
    next_prayer: 'الصلاة القادمة',
    time_left: 'الوقت المتبقي',
    islamic_date: 'التاريخ الهجري',

    // Language selector
    select_language: 'اختر اللغة',
    lang_en: 'English',
    lang_ur: 'اردو (Urdu)',
    lang_ar: 'العربية (Arabic)',
    lang_ro: 'Roman Urdu',

    // Prayer Section
    prayers_title: 'مواقيت الصلاة وإشعارات الأذان',
    select_city: 'اختر المدينة:',
    locate_gps: 'الموقع عبر GPS',
    find_qibla: 'اتجاه القبلة',
    method: 'المذهب:',
    hanafi: 'العصر حنفي',
    shafii: 'العصر شافعي',
    notification_center: 'مركز الإشعارات',
    azan_alert_on: 'التنبيه مفعّل',
    azan_alert_off: 'التنبيه متوقف',
    test_alert: 'إشعار تجريبي',
    enable_notifications: 'تفعيل الإشعارات',
    browser_perm: 'إذن المتصفح:',
    granted: 'ممنوح',
    denied: 'محظور',
    default_perm: 'مطلوب إذن',
    azan_sound: 'صوت الأذان',
    azan_voice: 'المؤذن:',
    makkah_azan: 'مكة المكرمة',
    madinah_azan: 'المدينة المنورة',
    fajr_azan: 'أذان الفجر',
    chime_sound: 'نغمة بيات',
    play_azan: 'تجربة الأذان',
    stop_azan: 'إيقاف',
    alert_time: 'التوقيت:',
    exact_time: 'في الوقت المحدد',
    min_before_5: 'قبل ٥ دقائق',
    min_before_10: 'قبل ١٠ دقائق',
    prayer_alert_heading: 'تفعيل التنبيهات لكل صلاة',
    prayer_alert_sub: 'تنبيهات فورية عند دخول وقت كل صلاة عبر إشعارات المتصفح.',

    // Prayers
    fajr: 'الفجر',
    sunrise: 'الشروق',
    zuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    tahajjud: 'التهجد',
    fajr_desc: 'طلوع الصبح الصادق',
    sunrise_desc: 'شروق الشمس',
    zuhr_desc: 'زوال الشمس',
    asr_desc: 'صلاة العصر',
    maghrib_desc: 'غروب الشمس',
    isha_desc: 'غيبوبة الشفق الأحمر',

    // Quran Section
    quran_options: 'خيارات تلاوة القرآن الكريم:',
    option_a: 'الخيار (أ): مع الترجمة',
    option_b: 'الخيار (ب): مصحف ١٦ سطراً',
    select_surah: 'اختر السورة:',
    search_surah: 'ابحث عن سورة...',
    all: 'الكل',
    makki: 'مكية',
    madani: 'مدنية',
    verses: 'آيات',
    juz: 'الجزء',
    font_size: 'حجم الخط',
    arabic_font_size: 'حجم الخط العربي',
    urdu_font_size: 'حجم خط الترجمة',
    bookmark: 'حفظ العلامة',
    prev_surah: 'السورة السابقة',
    next_surah: 'السورة التالية',
    bismillah_meaning: 'بسم الله الرحمن الرحيم',
    traditional_mushaf: 'مصحف ١٦ سطراً تقليدي',
    without_translation: 'النص القرآني الموثق (بدون ترجمة)',
    page_number: 'الصفحة',
    jump_to_page: 'الانتقال للصفحة:',
    go: 'انتقال',
    parchment: 'ورق قديم',
    white: 'أبيض',
    dark_mode: 'الوضع الليلي',
    zoom_in: 'تكبير',
    zoom_out: 'تصغير',
    prev_page: 'الصفحة السابقة',
    next_page: 'الصفحة التالية',
    first_page: 'الصفحة الأولى',
    last_page: 'الصفحة الأخيرة',

    // Azkaar Section
    namaz_steps: 'صفة الصلاة',
    morning_azkaar: 'أذكار الصباح',
    evening_azkaar: 'أذكار المساء',
    after_prayer: 'أذكار بعد الصلاة',
    sleep_waking: 'أذكار النوم والاستيقاظ',
    daily_duas: 'أدعية يومية مأثورة',
    digital_tasbeeh: 'المسبحة الإلكترونية',
    repeat_count: 'العدد:',
    reference: 'المصدر:',
    benefit: 'الفضل والكيفية:',
    tasbeeh_click: 'سبحان الله (اضغط للتسبيح)',
    reset: 'إعادة ضبط',
    sound: 'الصوت',
    total_dhikr: 'مجموع الأذكار:',
    target: 'الهدف:',

    // Qibla Section
    qibla_title: 'اتجاه القبلة المشرفة',
    qibla_sub: 'زاوية الاتجاه والمسافة من موقعك إلى الكعبة المشرفة بمكة المكرمة.',
    bearing: 'زاوية البوصلة',
    distance: 'المسافة',
    km: 'كم',
    compass_instruction: 'وجه هاتفك نحو علامة الكعبة المشرفة.',

    // Future Upgrades
    future_title: 'ميزات الترقية المستقبلية',
    future_badge: 'المرحلة ٢ — مغلقة حالياً',
    future_sub: 'هذه الميزات مخصصة للمرحلة القادمة وتبقى مغلقة حتى اعتمادها.',
    locked_tag: 'مغلق حالياً',
    view_roadmap: 'عرض خارطة الطريق',
    notify_me: 'أبلغني عند الإطلاق',
    notified_saved: 'تم تسجيل رغبتك',

    // Modals
    account_settings: 'إعدادات الحساب',
    account_role: 'نوع الحساب:',
    member: 'عضو مسجل',
    admin: 'مسؤول النظام',
    joined: 'تاريخ الانضمام:',
    email: 'البريد:',
    preferences: 'التفضيلات:',
    privacy_title: 'الخصوصية والأمان:',
    close: 'إغلاق',
    dismiss: 'تجاهل',
    save: 'حفظ'
  },

  ro: {
    // Roman Urdu
    app_title: 'Hasan Quran',
    app_subtitle: 'Mustanad Islami Companion',
    nav_home: 'Home (Markaz)',
    nav_prayers: 'Namaz Timings',
    nav_quran: 'Quran Majeed',
    nav_azkaar: 'Namaz & Azkaar',
    nav_qibla: 'Qibla Rukh',
    nav_madrasas: 'Madaris',
    nav_masajid: 'Qareebi Masajid',
    nav_future: 'Future Upgrades',
    admin_panel: 'Admin Panel',
    google_signin: 'Google Sign In',
    logout: 'Log Out',
    account_profile: 'Account Profile',
    active_city: 'Shehar (City)',
    current_prayer: 'Mojooda Namaz',
    next_prayer: 'Agli Namaz',
    time_left: 'Baqi Waqt',
    islamic_date: 'Hijri Tareekh',

    // Language selector
    select_language: 'Zuban Chunein',
    lang_en: 'English (Angrezi)',
    lang_ur: 'اردو (Urdu)',
    lang_ar: 'العربية (Arabi)',
    lang_ro: 'Roman Urdu',

    // Prayer Section
    prayers_title: 'Namaz Ke Auqaat aur Azan Alerts',
    select_city: 'Shehar Muntakhib Karein:',
    locate_gps: 'GPS Location',
    find_qibla: 'Qibla Rukh',
    method: 'Tareeqa:',
    hanafi: 'Asr Hanafi',
    shafii: 'Asr Shafi\'i',
    notification_center: 'Notification Center',
    azan_alert_on: 'Alert ON',
    azan_alert_off: 'Alert OFF',
    test_alert: 'Test Notification',
    enable_notifications: 'Alerts Chalu Karein',
    browser_perm: 'Browser Permission:',
    granted: 'Manzoor',
    denied: 'Blocked',
    default_perm: 'Ijazat Darkaar',
    azan_sound: 'Azan Audio & Voice',
    azan_voice: 'Azan Ki Awaz:',
    makkah_azan: 'Makkah Mukarramah',
    madinah_azan: 'Madinah Munawwarah',
    fajr_azan: 'Fajr Azan',
    chime_sound: 'Islamic Chime',
    play_azan: 'Azan Sunein',
    stop_azan: 'Band Karein',
    alert_time: 'Timing:',
    exact_time: 'Theek Namaz Ke Waqt',
    min_before_5: '5 minute pehle',
    min_before_10: '10 minute pehle',
    prayer_alert_heading: 'Har Namaz Ke Liye Alag Toggle',
    prayer_alert_sub: 'Browser Notification ke zariye har namaz ke shuru par alert payein.',

    // Prayers
    fajr: 'Fajr',
    sunrise: 'Tuloo-e-Aftab',
    zuhr: 'Zuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    tahajjud: 'Tahajjud',
    fajr_desc: 'Subah sadiq ka waqt',
    sunrise_desc: 'Suraj nikalne ka waqt',
    zuhr_desc: 'Zawal ke baad',
    asr_desc: 'Asr mislain',
    maghrib_desc: 'Ghurub-e-aftab ke baad',
    isha_desc: 'Shafaq ke baad',

    // Quran Section
    quran_options: 'Quran Majeed Ke Dono Options:',
    option_a: 'Option A: Ba Tarjuma (With Translation)',
    option_b: 'Option B: 16-Line Traditional Mushaf',
    select_surah: 'Surah Chunein:',
    search_surah: 'Surah Talash Karein (naam ya number)...',
    all: 'Tamam',
    makki: 'Makki',
    madani: 'Madani',
    verses: 'Ayat',
    juz: 'Para / Juz',
    font_size: 'Font Size',
    arabic_font_size: 'Arabi Font Size',
    urdu_font_size: 'Urdu Font Size',
    bookmark: 'Bookmark',
    prev_surah: 'Pichli Surah',
    next_surah: 'Agli Surah',
    bismillah_meaning: 'Allah ke naam se shuru jo nihayat meherbaan rehem wala hai',
    traditional_mushaf: 'Solah Satri Quran',
    without_translation: 'Bila Tarjuma Khális Arabi Matan',
    page_number: 'Safha (Page)',
    jump_to_page: 'Safha Number Likhein:',
    go: 'Jayein',
    parchment: 'Parchment Safha',
    white: 'Safaid',
    dark_mode: 'Night Mode',
    zoom_in: 'Zoom In',
    zoom_out: 'Zoom Out',
    prev_page: 'Pichla Safha',
    next_page: 'Agla Safha',
    first_page: 'Pehla Safha',
    last_page: 'Aakhri Safha',

    // Azkaar Section
    namaz_steps: 'Tareeqa-e-Namaz',
    morning_azkaar: 'Subah Ke Azkaar',
    evening_azkaar: 'Shaam Ke Azkaar',
    after_prayer: 'Namaz Ke Baad Ke Azkaar',
    sleep_waking: 'Sone & Jaagne Ki Duayein',
    daily_duas: 'Rozmarrah Masnoon Duayein',
    digital_tasbeeh: 'Digital Tasbeeh Counter',
    repeat_count: 'Tadaad:',
    reference: 'Hawala:',
    benefit: 'Fazilat & Tareeqa:',
    tasbeeh_click: 'SubhanAllah (Tasbeeh Padhein)',
    reset: 'Reset Karein',
    sound: 'Awaz',
    total_dhikr: 'Kul Parhi Gayi Tasbeehat:',
    target: 'Target:',

    // Qibla Section
    qibla_title: 'Qibla Rukh (Khana-e-Kaaba)',
    qibla_sub: 'Aap ke shehar se Khana-e-Kaaba ka theek angle aur fasla.',
    bearing: 'Bearing Angle',
    distance: 'Fasla',
    km: 'km',
    compass_instruction: 'Phone ko Kaaba ke nishan ki taraf rakhein.',

    // Future Upgrades
    future_title: 'Mehfooz Future Upgrades',
    future_badge: 'Phase 2 Upgrade — Filhaal Locked Hai',
    future_sub: 'Yeh 6 features mustaqbil ki upgrade ke liye mehfooz hain aur ijazat milne tak locked raheinge.',
    locked_tag: 'Filhaal Locked Hai',
    view_roadmap: 'Mukammal Roadmap Dekhein',
    notify_me: 'Launch Par Mujhe Notify Karein',
    notified_saved: 'Aap ki darkhwast darj kar li gayi',

    // Modals
    account_settings: 'Account Settings',
    account_role: 'Account Role:',
    member: 'Registered Member',
    admin: 'Administrator',
    joined: 'Shumooliyat:',
    email: 'Email:',
    preferences: 'Zati Tarjeehat:',
    privacy_title: 'Razdari & Data Hifazat:',
    close: 'Band Karein',
    dismiss: 'Dismiss',
    save: 'Mehfooz Karein'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default language is English as requested ("Zoban English ma kro ur Baki zuban ka option rakh do")
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('noor_app_language');
    if (saved === 'en' || saved === 'ur' || saved === 'ar' || saved === 'ro') {
      return saved;
    }
    return 'en'; // English by default
  });

  const isRtl = language === 'ur' || language === 'ar';

  useEffect(() => {
    localStorage.setItem('noor_app_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
