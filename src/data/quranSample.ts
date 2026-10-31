import { AyahData } from '../types';

// In-memory cache for ultra-fast instant access across the session
const memoryCache: Record<number, AyahData[]> = {};

// Authentic Quran text & Maulana Fateh Muhammad Jalandhry Urdu translation
export const PRELOADED_SURAHS: Record<number, AyahData[]> = {
  // Surah Al-Fatihah (1) - Complete
  1: [
    { numberInSurah: 1, numberInQuran: 1, arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', urduTranslation: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے', juz: 1 },
    { numberInSurah: 2, numberInQuran: 2, arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', urduTranslation: 'سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے', juz: 1 },
    { numberInSurah: 3, numberInQuran: 3, arabicText: 'الرَّحْمَٰنِ الرَّحِيمِ', urduTranslation: 'بڑا مہربان، نہایت رحم کرنے والا ہے', juz: 1 },
    { numberInSurah: 4, numberInQuran: 4, arabicText: 'مَالِكِ يَوْمِ الدِّينِ', urduTranslation: 'روزِ جزا کا مالک ہے', juz: 1 },
    { numberInSurah: 5, numberInQuran: 5, arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', urduTranslation: 'ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں', juz: 1 },
    { numberInSurah: 6, numberInQuran: 6, arabicText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', urduTranslation: 'ہمیں سیدھے راستے کی ہدایت فرما', juz: 1 },
    { numberInSurah: 7, numberInQuran: 7, arabicText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', urduTranslation: 'ان لوگوں کے راستے پر جن پر تو نے انعام فرمایا، نہ کہ ان کے جن پر غضب نازل ہوا اور نہ گمراہوں کے', juz: 1 }
  ],

  // Surah Ya-Sin (36) - Key Selection
  36: [
    { numberInSurah: 1, numberInQuran: 3706, arabicText: 'يس', urduTranslation: 'یٰسٓ (حقیقی معنی اللہ ہی بہتر جانتا ہے)', juz: 22 },
    { numberInSurah: 2, numberInQuran: 3707, arabicText: 'وَالْقُرْآنِ الْحَكِيمِ', urduTranslation: 'قسم ہے حکمت سے بھرے قرآن کی', juz: 22 },
    { numberInSurah: 3, numberInQuran: 3708, arabicText: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ', urduTranslation: 'کہ بے شک آپ پیغمبروں میں سے ہیں', juz: 22 },
    { numberInSurah: 4, numberInQuran: 3709, arabicText: 'عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ', urduTranslation: 'سیدھے راستے پر ہیں', juz: 22 },
    { numberInSurah: 5, numberInQuran: 3710, arabicText: 'تَنْزِيلَ الْعَزِيزِ الرَّحِيمِ', urduTranslation: 'یہ غالب اور مہربان خدا کا نازل کیا ہوا ہے', juz: 22 },
    { numberInSurah: 6, numberInQuran: 3711, arabicText: 'لِتُنْذِرَ قَوْمًا مَا أُنْذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ', urduTranslation: 'تاکہ آپ اس قوم کو ڈرائیں جس کے باپ دادا نہیں ڈرائے گئے تھے سو وہ غافل ہیں', juz: 22 },
    { numberInSurah: 7, numberInQuran: 3712, arabicText: 'لَقَدْ حَقَّ الْقَوْلُ عَلَىٰ أَكْثَرِهِمْ فَهُمْ لَا يُؤْمِنُونَ', urduTranslation: 'بے شک ان میں سے اکثر پر بات ثابت ہو چکی ہے سو وہ ایمان نہیں لائیں گے', juz: 22 },
    { numberInSurah: 8, numberInQuran: 3713, arabicText: 'إِنَّا جَعَلْنَا فِي أَعْنَاقِهِمْ أَغْلَالًا فَهِيَ إِلَى الْأَذْقَانِ فَهُمْ مُقْمَحُونَ', urduTranslation: 'ہم نے ان کی گردنوں میں طوق ڈال دیے ہیں جو ٹھوڑیوں تک ہیں سو ان کے سر اوپر کو اٹھے ہوئے ہیں', juz: 22 },
    { numberInSurah: 9, numberInQuran: 3714, arabicText: 'وَجَعَلْنَا مِنْ بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ', urduTranslation: 'اور ہم نے ان کے آگے ایک دیوار بنا دی اور ان کے پیچھے ایک دیوار، پھر ہم نے انہیں ڈھانک دیا سو وہ کچھ نہیں دیکھتے', juz: 22 },
    { numberInSurah: 10, numberInQuran: 3715, arabicText: 'وَسَوَاءٌ عَلَيْهِمْ أَأَنْذَرْتَهُمْ أَمْ لَمْ تُنْذِرْهُمْ لَا يُؤْمِنُونَ', urduTranslation: 'اور ان کے حق میں برابر ہے آپ انہیں ڈرائیں یا نہ ڈرائیں وہ ایمان نہیں لائیں گے', juz: 22 }
  ],

  // Surah Ar-Rahman (55) - Key Selection
  55: [
    { numberInSurah: 1, numberInQuran: 4902, arabicText: 'الرَّحْمَٰنُ', urduTranslation: 'رحمن (نہایت مہربان خدا)', juz: 27 },
    { numberInSurah: 2, numberInQuran: 4903, arabicText: 'عَلَّمَ الْقُرْآنَ', urduTranslation: 'اسی نے قرآن سکھایا', juz: 27 },
    { numberInSurah: 3, numberInQuran: 4904, arabicText: 'خَلَقَ الْإِنْسَانَ', urduTranslation: 'اسی نے انسان کو پیدا کیا', juz: 27 },
    { numberInSurah: 4, numberInQuran: 4905, arabicText: 'عَلَّمَهُ الْبَيَانَ', urduTranslation: 'اسے بولنا سکھایا', juz: 27 },
    { numberInSurah: 5, numberInQuran: 4906, arabicText: 'الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ', urduTranslation: 'سورج اور چاند ایک حساب کے ساتھ رواں ہیں', juz: 27 },
    { numberInSurah: 6, numberInQuran: 4907, arabicText: 'وَالنَّجْمُ وَالشَّجَرُ يَسْجُدَانِ', urduTranslation: 'اور بوٹیاں اور درخت سجدہ کر رہے ہیں', juz: 27 },
    { numberInSurah: 7, numberInQuran: 4908, arabicText: 'وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ', urduTranslation: 'اور اسی نے آسمان کو بلند کیا اور ترازو رکھی', juz: 27 },
    { numberInSurah: 8, numberInQuran: 4909, arabicText: 'أَلَّا تَطْغَوْا فِي الْمِيزَانِ', urduTranslation: 'تاکہ تم تول میں ناانصافی نہ کرو', juz: 27 },
    { numberInSurah: 9, numberInQuran: 4910, arabicText: 'وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ', urduTranslation: 'اور انصاف کے ساتھ تول قائم رکھو اور تول میں کمی نہ کرو', juz: 27 },
    { numberInSurah: 13, numberInQuran: 4914, arabicText: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', urduTranslation: 'پس (اے جن و انس!) تم اپنے پروردگار کی کون کون سی نعمتوں کو جھٹلاؤ گے؟', juz: 27 }
  ],

  // Surah Al-Mulk (67) - Complete Opening
  67: [
    { numberInSurah: 1, numberInQuran: 5242, arabicText: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', urduTranslation: 'بہت بابرکت ہے وہ ذات جس کے ہاتھ میں تمام بادشاہی ہے اور وہ ہر چیز پر قادر ہے', juz: 29 },
    { numberInSurah: 2, numberInQuran: 5243, arabicText: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ الْعَزِيزُ الْغَفُورُ', urduTranslation: 'جس نے موت اور زندگی کو پیدا کیا تاکہ تمہیں آزمائے کہ تم میں سے اچھے عمل کس کے ہیں، اور وہ غالب بخشنے والا ہے', juz: 29 },
    { numberInSurah: 3, numberInQuran: 5244, arabicText: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ', urduTranslation: 'جس نے سات آسمان اوپر تلے بنائے، تو رحمن کی آفرینش میں کوئی نقص نہ دیکھے گا، سو نظر دوڑا کیا تجھے کوئی شگاف نظر آتا ہے', juz: 29 },
    { numberInSurah: 4, numberInQuran: 5245, arabicText: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ', urduTranslation: 'پھر بار بار نگاہ کر، نگاہ تیری طرف ناکام اور تھک کر پلٹ آئے گی', juz: 29 },
    { numberInSurah: 5, numberInQuran: 5246, arabicText: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ', urduTranslation: 'اور ہم نے قریب والے آسمان کو چراغوں سے آراستہ کیا اور ان کو شیطانوں کو مارنے کا آلہ بنایا اور ان کے لیے دہکتی آگ تیار کر رکھی ہے', juz: 29 }
  ],

  // Surah Ad-Duha (93)
  93: [
    { numberInSurah: 1, numberInQuran: 6081, arabicText: 'وَالضُّحَىٰ', urduTranslation: 'قسم ہے چاشت کے وقت کی', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6082, arabicText: 'وَاللَّيْلِ إِذَا سَجَىٰ', urduTranslation: 'اور رات کی جب وہ چھا جائے', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6083, arabicText: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ', urduTranslation: 'آپ کے پروردگار نے نہ تو آپ کو چھوڑا ہے اور نہ وہ ناراض ہوا ہے', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6084, arabicText: 'وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ', urduTranslation: 'اور بلاشبہ آخرت آپ کے لیے پہلی زندگی سے کہیں بہتر ہے', juz: 30 },
    { numberInSurah: 5, numberInQuran: 6085, arabicText: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', urduTranslation: 'اور عنقریب آپ کا پروردگار آپ کو اتنا دے گا کہ آپ خوش ہو جائیں گے', juz: 30 }
  ],

  // Surah Ash-Sharh (94) - Complete
  94: [
    { numberInSurah: 1, numberInQuran: 6092, arabicText: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ', urduTranslation: 'کیا ہم نے آپ کی خاطر آپ کا سینہ کشادہ نہیں کر دیا؟', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6093, arabicText: 'وَوَضَعْنَا عَنكَ وِزْرَكَ', urduTranslation: 'اور ہم نے آپ پر سے آپ کا بوجھ اتار دیا', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6094, arabicText: 'الَّذِي أَنقَضَ ظَهْرَكَ', urduTranslation: 'جس نے آپ کی پیٹھ توڑ رکھی تھی', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6095, arabicText: 'وَرَفَعْنَا لَكَ ذِكْرَكَ', urduTranslation: 'اور ہم نے آپ کی خاطر آپ کا ذکر بلند کر دیا', juz: 30 },
    { numberInSurah: 5, numberInQuran: 6096, arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', urduTranslation: 'سو بے شک مشکل کے ساتھ آسانی ہے', juz: 30 },
    { numberInSurah: 6, numberInQuran: 6097, arabicText: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', urduTranslation: 'بے شک مشکل کے ساتھ آسانی ہے', juz: 30 },
    { numberInSurah: 7, numberInQuran: 6098, arabicText: 'فَإِذَا فَرَغْتَ فَانصَبْ', urduTranslation: 'پس جب آپ فارغ ہوں تو محنت کیجیے', juz: 30 },
    { numberInSurah: 8, numberInQuran: 6099, arabicText: 'وَإِلَىٰ رَبِّكَ فَارْغَب', urduTranslation: 'اور اپنے پروردگار ہی کی طرف رغبت رکھیے', juz: 30 }
  ],

  // Surah At-Tin (95) - Complete
  95: [
    { numberInSurah: 1, numberInQuran: 6100, arabicText: 'وَالتِّينِ وَالزَّيْتُونِ', urduTranslation: 'انجیر اور زیتون کی قسم', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6101, arabicText: 'وَطُورِ سِينِينَ', urduTranslation: 'اور طورِ سینین کی قسم', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6102, arabicText: 'وَهَٰذَا الْبَلَدِ الْأَمِينِ', urduTranslation: 'اور اس امن والے شہر (مکہ) کی قسم', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6103, arabicText: 'لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ', urduTranslation: 'بے شک ہم نے انسان کو بہترین ساخت پر پیدا کیا', juz: 30 },
    { numberInSurah: 5, numberInQuran: 6104, arabicText: 'ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ', urduTranslation: 'پھر ہم نے اسے سب سے نیچوں کا نیچا کر دیا', juz: 30 },
    { numberInSurah: 6, numberInQuran: 6105, arabicText: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ', urduTranslation: 'سوائے ان کے جو ایمان لائے اور اچھے کام کیے سو ان کے لیے کبھی ختم نہ ہونے والا اجر ہے', juz: 30 },
    { numberInSurah: 7, numberInQuran: 6106, arabicText: 'فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ', urduTranslation: 'پھر اس کے بعد تجھے جزا کے دن کے جھٹلانے پر کیا چیز آمادہ کرتی ہے؟', juz: 30 },
    { numberInSurah: 8, numberInQuran: 6107, arabicText: 'أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ', urduTranslation: 'کیا اللہ سب حاکموں سے بڑا حاکم نہیں ہے؟', juz: 30 }
  ],

  // Surah Al-Qadr (97) - Complete
  97: [
    { numberInSurah: 1, numberInQuran: 6126, arabicText: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ', urduTranslation: 'بے شک ہم نے اس کو شبِ قدر میں نازل فرمایا', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6127, arabicText: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ', urduTranslation: 'اور آپ کو کیا معلوم کہ شبِ قدر کیا ہے؟', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6128, arabicText: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ', urduTranslation: 'شبِ قدر ہزار مہینوں سے بہتر ہے', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6129, arabicText: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ', urduTranslation: 'اس میں فرشتے اور روح القدس اپنے رب کے حکم سے ہر کام کے لیے اترتے ہیں', juz: 30 },
    { numberInSurah: 5, numberInQuran: 6130, arabicText: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ', urduTranslation: 'وہ رات طلوعِ فجر تک سلامتی ہی سلامتی ہے', juz: 30 }
  ],

  // Surah Al-Asr (103) - Complete
  103: [
    { numberInSurah: 1, numberInQuran: 6177, arabicText: 'وَالْعَصْرِ', urduTranslation: 'زمانے کی قسم', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6178, arabicText: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', urduTranslation: 'بے شک انسان خسارے میں ہے', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6179, arabicText: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', urduTranslation: 'سوائے ان لوگوں کے جو ایمان لائے اور نیک عمل کیے اور ایک دوسرے کو حق کی نصیحت اور صبر کی تلقین کی', juz: 30 }
  ],

  // Surah Al-Fil (105) - Complete
  105: [
    { numberInSurah: 1, numberInQuran: 6189, arabicText: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ', urduTranslation: 'کیا آپ نے نہیں دیکھا کہ آپ کے پروردگار نے ہاتھی والوں کے ساتھ کیا کیا؟', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6190, arabicText: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ', urduTranslation: 'کیا ان کی تدبیر کو اکارت نہیں کر دیا؟', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6191, arabicText: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ', urduTranslation: 'اور ان پر غول کے غول پرندے بھیجے', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6192, arabicText: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ', urduTranslation: 'جو ان پر کنکر کی پتھریاں پھینکتے تھے', juz: 30 },
    { numberInSurah: 5, numberInQuran: 6193, arabicText: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ', urduTranslation: 'تو ان کو کھائے ہوئے بھوسے جیسا کر ڈالا', juz: 30 }
  ],

  // Surah Quraysh (106) - Complete
  106: [
    { numberInSurah: 1, numberInQuran: 6194, arabicText: 'لِإِيلَافِ قُرَيْشٍ', urduTranslation: 'قریش کو مانوس کرنے کے سبب', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6195, arabicText: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ', urduTranslation: 'یعنی ان کو سردی اور گرمی کے سفر سے مانوس کرنے کے سبب', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6196, arabicText: 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ', urduTranslation: 'تو ان کو چاہیے کہ اس گھر (کعبہ) کے پروردگار کی عبادت کریں', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6197, arabicText: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ', urduTranslation: 'جس نے ان کو بھوک میں کھانا دیا اور خوف سے امن بخشا', juz: 30 }
  ],

  // Surah Al-Ma'un (107) - Complete
  107: [
    { numberInSurah: 1, numberInQuran: 6198, arabicText: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ', urduTranslation: 'بھلا آپ نے اس شخص کو دیکھا جو جزا کے دن کو جھٹلاتا ہے؟', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6199, arabicText: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ', urduTranslation: 'یہ وہی ہے جو یتیم کو دھکے دیتا ہے', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6200, arabicText: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ', urduTranslation: 'اور مسکین کو کھانا کھلانے کی ترغیب نہیں دیتا', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6201, arabicText: 'فَوَيْلٌ لِّلْمُصَلِّينَ', urduTranslation: 'تو ایسے نمازیوں کے لیے خرابی ہے', juz: 30 },
    { numberInSurah: 5, numberInQuran: 6202, arabicText: 'الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ', urduTranslation: 'جو اپنی نماز سے غافل ہیں', juz: 30 },
    { numberInSurah: 6, numberInQuran: 6203, arabicText: 'الَّذِينَ هُمْ يُرَاءُونَ', urduTranslation: 'جو دکھاوا کرتے ہیں', juz: 30 },
    { numberInSurah: 7, numberInQuran: 6204, arabicText: 'وَيَمْنَعُونَ الْمَاعُونَ', urduTranslation: 'اور برتنے کی عام چیزیں بھی مانگے نہیں دیتے', juz: 30 }
  ],

  // Surah Al-Kawthar (108) - Complete
  108: [
    { numberInSurah: 1, numberInQuran: 6197, arabicText: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', urduTranslation: 'بے شک ہم نے آپ کو کوثر (بے انتہا بھلائی) عطا فرمائی', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6198, arabicText: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', urduTranslation: 'سو آپ اپنے رب کے لیے نماز پڑھیے اور قربانی کیجیے', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6199, arabicText: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', urduTranslation: 'بے شک آپ کا دشمن ہی بے نام و نشان رہے گا', juz: 30 }
  ],

  // Surah Al-Kafirun (109) - Complete
  109: [
    { numberInSurah: 1, numberInQuran: 6200, arabicText: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', urduTranslation: 'کہہ دیجیے کہ اے کافرو!', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6201, arabicText: 'لَا أَعْبُدُ مَا تَعْبُدُونَ', urduTranslation: 'میں ان کی عبادت نہیں کرتا جن کی تم عبادت کرتے ہو', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6202, arabicText: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', urduTranslation: 'اور نہ تم اس کی عبادت کرنے والے ہو جس کی میں عبادت کرتا ہوں', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6203, arabicText: 'وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ', urduTranslation: 'اور نہ میں ان کی عبادت کرنے والا ہوں جن کی تم نے عبادت کی ہے', juz: 30 },
    { numberInSurah: 5, numberInQuran: 6204, arabicText: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', urduTranslation: 'اور نہ تم اس کی عبادت کرنے والے ہو جس کی میں عبادت کرتا ہوں', juz: 30 },
    { numberInSurah: 6, numberInQuran: 6205, arabicText: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', urduTranslation: 'تمہارے لیے تمہارا دین اور میرے لیے میرا دین', juz: 30 }
  ],

  // Surah An-Nasr (110) - Complete
  110: [
    { numberInSurah: 1, numberInQuran: 6206, arabicText: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', urduTranslation: 'جب اللہ کی مدد اور فتح آ پہنچے', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6207, arabicText: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا', urduTranslation: 'اور آپ لوگوں کو دیکھ لیں کہ وہ اللہ کے دین میں فوج در فوج داخل ہو رہے ہیں', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6208, arabicText: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا', urduTranslation: 'تو اپنے رب کی حمد کے ساتھ تسبیح کیجیے اور اس سے بخشش مانگیے، بے شک وہ بڑا توبہ قبول کرنے والا ہے', juz: 30 }
  ],

  // Surah Al-Masad (111) - Complete
  111: [
    { numberInSurah: 1, numberInQuran: 6209, arabicText: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ', urduTranslation: 'ابولہب کے دونوں ہاتھ ٹوٹ جائیں اور وہ ہلاک ہو جائے', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6210, arabicText: 'مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ', urduTranslation: 'نہ اس کا مال اس کے کام آیا اور نہ وہ جو اس نے کمایا', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6211, arabicText: 'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ', urduTranslation: 'عنقریب وہ شعلہ مارتی ہوئی آگ میں داخل ہوگا', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6212, arabicText: 'وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ', urduTranslation: 'اور اس کی عورت بھی جو لکڑیاں ڈھونے والی ہے', juz: 30 },
    { numberInSurah: 5, numberInQuran: 6213, arabicText: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ', urduTranslation: 'اس کی گردن میں مونج کی رسی ہوگی', juz: 30 }
  ],

  // Surah Al-Ikhlas (112) - Complete
  112: [
    { numberInSurah: 1, numberInQuran: 6222, arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ', urduTranslation: 'کہہ دیجیے کہ وہ اللہ ایک ہے', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6223, arabicText: 'اللَّهُ الصَّمَدُ', urduTranslation: 'اللہ بے نیاز (اور سب کا سہارا) ہے', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6224, arabicText: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', urduTranslation: 'نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6225, arabicText: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', urduTranslation: 'اور کوئی اس کے برابر کا نہیں ہے', juz: 30 }
  ],

  // Surah Al-Falaq (113) - Complete
  113: [
    { numberInSurah: 1, numberInQuran: 6226, arabicText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', urduTranslation: 'کہہ دیجیے کہ میں صبح کے رب کی پناہ مانگتا ہوں', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6227, arabicText: 'مِنْ شَرِّ مَا خَلَقَ', urduTranslation: 'ہر اس چیز کی برائی سے جو اس نے پیدا کی ہے', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6228, arabicText: 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ', urduTranslation: 'اور اندھیری رات کی برائی سے جب وہ چھا جائے', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6229, arabicText: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', urduTranslation: 'اور گرہوں پر پھونکنے والیوں کی برائی سے', juz: 30 },
    { numberInSurah: 5, numberInQuran: 6230, arabicText: 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', urduTranslation: 'اور حسد کرنے والے کی برائی سے جب وہ حسد کرے', juz: 30 }
  ],

  // Surah An-Nas (114) - Complete
  114: [
    { numberInSurah: 1, numberInQuran: 6231, arabicText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', urduTranslation: 'کہہ دیجیے کہ میں انسانوں کے پروردگار کی پناہ مانگتا ہوں', juz: 30 },
    { numberInSurah: 2, numberInQuran: 6232, arabicText: 'مَلِكِ النَّاسِ', urduTranslation: 'انسانوں کے بادشاہ کی', juz: 30 },
    { numberInSurah: 3, numberInQuran: 6233, arabicText: 'إِلَٰهِ النَّاسِ', urduTranslation: 'انسانوں کے معبودِ برحق کی', juz: 30 },
    { numberInSurah: 4, numberInQuran: 6234, arabicText: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', urduTranslation: 'وسوسہ ڈالنے والے، پیچھے ہٹ جانے والے کے شر سے', juz: 30 },
    { numberInSurah: 5, numberInQuran: 6235, arabicText: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', urduTranslation: 'جو لوگوں کے سینوں میں وسوسے ڈالتا ہے', juz: 30 },
    { numberInSurah: 6, numberInQuran: 6236, arabicText: 'مِنَ الْجِنَّةِ وَالنَّاسِ', urduTranslation: 'خواہ وہ جنات میں سے ہو یا انسانوں میں سے', juz: 30 }
  ]
};

// Fast local check without network blocking (0ms instant return)
export function getImmediateSurah(surahNumber: number): AyahData[] | null {
  // 1. Check memory cache (0ms)
  if (memoryCache[surahNumber]) {
    return memoryCache[surahNumber];
  }

  // 2. Check bundled preloaded set (0ms)
  if (PRELOADED_SURAHS[surahNumber]) {
    memoryCache[surahNumber] = PRELOADED_SURAHS[surahNumber];
    return PRELOADED_SURAHS[surahNumber];
  }

  // 3. Check persistent localStorage cache (0ms)
  try {
    const cacheKey = `noor_quran_surah_${surahNumber}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache[surahNumber] = parsed;
        return parsed;
      }
    }
  } catch {
    // continue
  }

  return null;
}

// Ultra-fast resilient Quran fetcher with Quran.com Cloudflare edge primary & AlQuran Cloud fallback
export async function fetchSurahWithTranslation(surahNumber: number): Promise<AyahData[]> {
  // 1. Immediate retrieval if already cached locally (0ms)
  const immediate = getImmediateSurah(surahNumber);
  if (immediate) {
    return immediate;
  }

  const cacheKey = `noor_quran_surah_${surahNumber}`;

  // Helper to strip footnote HTML tags from translation text
  const cleanTranslationText = (raw: string): string => {
    return raw.replace(/<[^>]*>?/gm, '').trim();
  };

  // 2. Primary: High-speed Quran.com Cloudflare Edge API (sub-100ms global response, official Jalandhari translation id 234)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);

    const response = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?language=ur&words=false&translations=234&fields=text_uthmani,chapter_id,verse_key,juz_number,sajdah_number&per_page=300`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json.verses && Array.isArray(json.verses) && json.verses.length > 0) {
        const combined: AyahData[] = json.verses.map((v: {
          verse_number: number;
          id: number;
          text_uthmani: string;
          translations?: Array<{ text: string }>;
          juz_number?: number;
          sajdah_number?: number | string | null;
        }) => ({
          numberInSurah: v.verse_number,
          numberInQuran: v.id,
          arabicText: v.text_uthmani,
          urduTranslation: cleanTranslationText(v.translations?.[0]?.text || ''),
          juz: v.juz_number || 1,
          sajda: Boolean(v.sajdah_number)
        }));

        // Store in memory & persistent local storage
        memoryCache[surahNumber] = combined;
        try {
          localStorage.setItem(cacheKey, JSON.stringify(combined));
        } catch {
          // localStorage might be full; in-memory cache remains active
        }

        prefetchAdjacentSurahs(surahNumber);
        return combined;
      }
    }
  } catch (err) {
    console.warn(`Quran.com fast fetch notice for Surah ${surahNumber}, falling back to secondary...`, err);
  }

  // 3. Secondary: AlQuran.cloud API with timeout
  try {
    const controllerSecondary = new AbortController();
    const timeoutSecondary = setTimeout(() => controllerSecondary.abort(), 3500);

    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ur.jalandhry`,
      { signal: controllerSecondary.signal }
    );
    clearTimeout(timeoutSecondary);

    if (response.ok) {
      const json = await response.json();
      if (json.data && json.data.length >= 2) {
        const arEdition = json.data[0].ayahs;
        const urEdition = json.data[1].ayahs;

        const combined: AyahData[] = arEdition.map((item: { numberInSurah: number; number: number; text: string; juz: number; sajda: boolean }, index: number) => ({
          numberInSurah: item.numberInSurah,
          numberInQuran: item.number,
          arabicText: item.text,
          urduTranslation: urEdition[index]?.text || '',
          juz: item.juz,
          sajda: Boolean(item.sajda)
        }));

        memoryCache[surahNumber] = combined;
        try {
          localStorage.setItem(cacheKey, JSON.stringify(combined));
        } catch {
          // ignore
        }

        prefetchAdjacentSurahs(surahNumber);
        return combined;
      }
    }
  } catch (err) {
    console.warn(`Secondary Quran fetch timed out or failed for Surah ${surahNumber}...`, err);
  }

  // 4. Fallback: Preloaded set if available
  if (PRELOADED_SURAHS[surahNumber]) {
    return PRELOADED_SURAHS[surahNumber];
  }

  throw new Error(`Unable to load Surah ${surahNumber}. Please check your connection.`);
}

// Background idle prefetch for adjacent Surahs so next/prev clicks are 0ms instant
export function prefetchAdjacentSurahs(currentNumber: number) {
  const toPrefetch = [currentNumber - 1, currentNumber + 1].filter((n) => n >= 1 && n <= 114);
  toPrefetch.forEach((n) => {
    if (!memoryCache[n] && !PRELOADED_SURAHS[n]) {
      setTimeout(() => {
        fetchSurahWithTranslation(n).catch(() => {});
      }, 800);
    }
  });
}
