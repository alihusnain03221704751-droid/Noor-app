import { Madrasa } from '../types';

export const INITIAL_MADRASAS: Madrasa[] = [
  {
    id: 'madrasa-1',
    name: 'Jamia Ashrafia Lahore',
    nameUrdu: 'جامعہ اشرفیہ لاہور',
    wiffaqAffiliation: 'Wifaq-ul-Madaris Al-Arabia Pakistan',
    address: 'Ferozepur Road, Near Muslim Town Flyover, Ichhra',
    city: 'Lahore',
    province: 'Punjab',
    country: 'Pakistan',
    contactNumber: '+92 42 37583681',
    whatsapp: '+923004000101',
    email: 'info@ashrafia.org.pk',
    website: 'https://ashrafia.org.pk',
    description: 'Premier Islamic educational university established in 1947 by Hazrat Maulana Mufti Muhammad Hassan (RA). Known for authentic classical Islamic sciences, Hadith specialization, and modern educational integration.',
    descriptionUrdu: '۱۹۴۷ء میں قائم شدہ برصغیر کی عظیم الشان اسلامی درسگاہ جہاں درسِ نظامی، تخصص فی الحدیث اور شعبہ حفظ کی اعلیٰ ترین تعلیم دی جاتی ہے۔',
    lat: 31.5204,
    lng: 74.3235,
    establishedYear: 1947,
    totalStudents: 4200,
    totalTeachers: 145,
    hostelAvailable: true,
    campusGender: 'Both Campuses',
    rating: 4.9,
    status: 'approved',
    admissionInfo: {
      isOpen: true,
      sessionStart: 'Shawwal 1446 (Annual New Admissions)',
      requirements: [
        'Passing entrance test in Tajweed and basic Arabic',
        'CNIC / B-Form and 4 passport size photographs',
        'Character certificate from previous institution',
        'Parent / Guardian CNIC copy'
      ],
      contactPerson: 'Maulana Hafiz Asadullah (Admission Incharge)',
      contactPhone: '+92 42 37583682',
      scholarshipAvailable: true,
      notes: '100% Free boarding, dining (Taam), and books for deserving and Hafiz students via Waqf funding.'
    },
    programs: [
      {
        id: 'p-1',
        name: 'Dars-e-Nizami (Shahadat-ul-Aalamiyyah)',
        nameUrdu: 'درسِ نظامی (شہادۃ العالمیہ)',
        duration: '8 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Free (Waqf funded / Sadqah-e-Jariyah)',
        ageRequirement: '14+ years (Matriculation or equivalent)',
        description: 'Comprehensive 8-year degree recognized by HEC as equivalent to M.A. Islamic Studies and Arabic.'
      },
      {
        id: 'p-2',
        name: 'Hifz-ul-Quran with Tajweed',
        nameUrdu: 'حفظ القرآن الکریم مع تجوید',
        duration: '3 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Free of Cost',
        ageRequirement: '9 to 14 years',
        description: 'Complete memorization of 30 Juz with proper Makhaarij and daily revision.'
      },
      {
        id: 'p-3',
        name: 'Takhassus fi al-Fiqh (Ifta Specialization)',
        nameUrdu: 'تخصص فی الفقہ والافتاء',
        duration: '2 Years',
        gender: 'male',
        admissionStatus: 'Open',
        feesDescription: 'Free with monthly stipend',
        ageRequirement: 'Graduate of Shahadat-ul-Aalamiyyah',
        description: 'Advanced legal rulings, contemporary Islamic finance, and jurisprudence research.'
      },
      {
        id: 'p-4',
        name: 'Aalimah Course (Lil Banaat)',
        nameUrdu: 'عالمہ کورس برائے طالبات',
        duration: '6 Years',
        gender: 'female',
        admissionStatus: 'Open',
        feesDescription: 'Nominal maintenance or Free for deserving',
        ageRequirement: '12+ years',
        description: 'Dedicated female campus with female scholars teaching Tafseer, Hadith, and Islamic jurisprudence.'
      }
    ],
    teachers: [
      {
        id: 't-1',
        name: 'Hazrat Maulana Fazl-ur-Rahim Ashrafi',
        role: 'Mohtamim & Principal',
        qualification: 'Al-Aalamiyyah, Senior Scholar',
        experienceYears: 42
      },
      {
        id: 't-2',
        name: 'Maulana Qari Muhammad Arshad',
        role: 'Head of Tajweed & Qirat Department',
        qualification: 'Qirat Sab’ah & Ashrah Certification',
        experienceYears: 28
      },
      {
        id: 't-3',
        name: 'Mufti Ahmad Ali',
        role: 'Senior Mufti (Dar-ul-Ifta)',
        qualification: 'Takhassus fil Ifta, Al-Aalamiyyah',
        experienceYears: 20
      }
    ]
  },
  {
    id: 'madrasa-2',
    name: 'Darul Uloom Karachi',
    nameUrdu: 'جامعہ دارالعلوم کراچی',
    wiffaqAffiliation: 'Wifaq-ul-Madaris Al-Arabia Pakistan',
    address: 'Korangi Creek Road, Sector 28, Korangi Industrial Area',
    city: 'Karachi',
    province: 'Sindh',
    country: 'Pakistan',
    contactNumber: '+92 21 35049774',
    whatsapp: '+923212000202',
    email: 'info@darululoomkarachi.edu.pk',
    website: 'https://darululoomkarachi.edu.pk',
    description: 'Renowned international Islamic seminary founded in 1951 by Mufti Muhammad Shafi (RA). Headed by Justice (R) Mufti Muhammad Taqi Usmani. One of the highest-rated Islamic universities globally.',
    descriptionUrdu: 'مفتیِ اعظم پاکستان مفتی محمد شفیع صاحبؒ کا قائم کردہ عظیم دارالعلوم، موجودہ سرپرست شیخ الاسلام مفتی محمد تقی عثمانی مدظلہ العالی۔',
    lat: 24.8189,
    lng: 67.1264,
    establishedYear: 1951,
    totalStudents: 5500,
    totalTeachers: 180,
    hostelAvailable: true,
    campusGender: 'Both Campuses',
    rating: 5.0,
    status: 'approved',
    admissionInfo: {
      isOpen: true,
      sessionStart: 'Shawwal 10 (Post-Eid-ul-Fitr)',
      requirements: [
        'Written academic assessment and personal interview',
        'Valid Nadra B-Form / CNIC',
        'Previous academic mark sheet',
        'Undertaking of religious conduct'
      ],
      contactPerson: 'Mufti Aziz-ur-Rahman (Registrar)',
      contactPhone: '+92 21 35049775',
      scholarshipAvailable: true,
      notes: 'Full boarding, lodging, healthcare, and educational expenses covered for enrolled students.'
    },
    programs: [
      {
        id: 'p-201',
        name: 'Dars-e-Nizami (Al-Aalamiyyah Degree)',
        nameUrdu: 'درسِ نظامی مکمل نصاب',
        duration: '8 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Free (All expenses waqf supported)',
        ageRequirement: '14+ years',
        description: 'HEC-recognized equivalent to Master in Arabic and Islamic Studies.'
      },
      {
        id: 'p-202',
        name: 'Tahfeez-ul-Quran (Hifz)',
        nameUrdu: 'شعبہ تحفیظ القرآن الکریم',
        duration: '3 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Free of Cost',
        ageRequirement: '8-13 years',
        description: 'Comprehensive Hifz program with certified Asatizah.'
      },
      {
        id: 'p-203',
        name: 'Islamic Banking & Finance Takhassus',
        nameUrdu: 'تخصص فی المعاملات المالیۃ الاسلامیہ',
        duration: '2 Years',
        gender: 'male',
        admissionStatus: 'Open',
        feesDescription: 'Free with research stipends',
        ageRequirement: 'Aalimiyyah + B.Com / BBA preferred',
        description: 'Supervised under Mufti Taqi Usmani guidance on Shariah governance and Sukuk.'
      }
    ],
    teachers: [
      {
        id: 't-201',
        name: 'Justice (R) Mufti Muhammad Taqi Usmani',
        role: 'President & Sheikh-ul-Hadith',
        qualification: 'World-Renowned Shariah Jurist',
        experienceYears: 55
      },
      {
        id: 't-202',
        name: 'Mufti Mahmood Ashraf Usmani',
        role: 'Vice President & Head of Dar-ul-Ifta',
        qualification: 'Senior Mufti and Hadith Scholar',
        experienceYears: 35
      }
    ]
  },
  {
    id: 'madrasa-3',
    name: 'Jamia Binoria International',
    nameUrdu: 'جامعہ بنوریہ عالمیہ کراچی',
    wiffaqAffiliation: 'Wifaq-ul-Madaris Al-Arabia Pakistan',
    address: 'Site Area, Near Siemens Chowrangi, Karachi',
    city: 'Karachi',
    province: 'Sindh',
    country: 'Pakistan',
    contactNumber: '+92 21 32575225',
    whatsapp: '+923331112233',
    email: 'info@binoria.edu.pk',
    website: 'https://binoria.edu.pk',
    description: 'International Islamic educational institute established in 1978 by Mufti Muhammad Naeem (RA). Hosts students from over 60 countries with modern IT labs, multilingual classes, and girls campuses.',
    descriptionUrdu: 'بین الاقوامی اسلامی یونیورسٹی جہاں ۶۰ سے زائد ممالک کے طلبہ و طالبات زیرِ تعلیم ہیں، آن لائن اور روایتی علوم کا حسین امتزاج۔',
    lat: 24.8967,
    lng: 66.9942,
    establishedYear: 1978,
    totalStudents: 6000,
    totalTeachers: 210,
    hostelAvailable: true,
    campusGender: 'Both Campuses',
    rating: 4.8,
    status: 'approved',
    admissionInfo: {
      isOpen: true,
      sessionStart: 'Shawwal / Annual Intake',
      requirements: [
        'National or International Passport / B-Form',
        'Elementary Islamic knowledge test',
        'Physical fitness assessment'
      ],
      contactPerson: 'Maulana Ghulam Rasool',
      contactPhone: '+92 21 32575226',
      scholarshipAvailable: true,
      notes: 'Hostel facilities for overseas as well as national students with modern dining hall.'
    },
    programs: [
      {
        id: 'p-301',
        name: 'Dars-e-Nizami (English & Arabic Medium)',
        nameUrdu: 'درسِ نظامی (انگلش و عربی میڈیم)',
        duration: '8 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Subsidized / Free for eligible',
        ageRequirement: '13-22 years',
        description: 'Complete classical syllabus with English language translation lectures.'
      },
      {
        id: 'p-302',
        name: 'Hifz-ul-Quran (International Stream)',
        nameUrdu: 'حفظ القرآن مع حسنِ صوت',
        duration: '2.5 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Free',
        ageRequirement: '8-14 years',
        description: 'Focus on Tajweed rules and beautiful vocal rendition.'
      },
      {
        id: 'p-303',
        name: 'Online Dars-e-Nizami & Tajweed',
        nameUrdu: 'آن لائن درسِ نظامی و تجوید',
        duration: 'Flexible (1-5 Years)',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Nominal Internet maintenance fee',
        ageRequirement: 'All ages',
        description: 'Live interactive classes for working professionals and expatriates.'
      }
    ],
    teachers: [
      {
        id: 't-301',
        name: 'Mufti Noman Naeem',
        role: 'Chancellor & Mohtamim',
        qualification: 'Ph.D. Islamic Studies, Al-Aalamiyyah',
        experienceYears: 24
      },
      {
        id: 't-302',
        name: 'Maulana Qari Saifullah',
        role: 'Director of Qirat Academy',
        qualification: 'Hafiz & Qari Al-Ashrah',
        experienceYears: 19
      }
    ]
  },
  {
    id: 'madrasa-4',
    name: 'Jamia Uloom-ul-Islamia Banuri Town',
    nameUrdu: 'جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن',
    wiffaqAffiliation: 'Wifaq-ul-Madaris Al-Arabia Pakistan',
    address: 'Allama Banuri Town, Jamshed Road, Karachi',
    city: 'Karachi',
    province: 'Sindh',
    country: 'Pakistan',
    contactNumber: '+92 21 34914193',
    whatsapp: '+923009998877',
    email: 'info@banuri.edu.pk',
    website: 'https://banuri.edu.pk',
    description: 'Historical Islamic seminary founded by Allama Sayyid Muhammad Yousuf Banuri (RA) in 1954. Worldwide famous for its Dar-ul-Ifta (Fatwa department) answering thousands of queries monthly.',
    descriptionUrdu: 'محدثِ عصر علامہ سید محمد یوسف بنوریؒ کی قائم کردہ تاریخی درسگاہ جس کا دارالافتاء دنیا بھر میں سند مانا جاتا ہے۔',
    lat: 24.8821,
    lng: 67.0425,
    establishedYear: 1954,
    totalStudents: 3800,
    totalTeachers: 130,
    hostelAvailable: true,
    campusGender: 'Boys',
    rating: 4.9,
    status: 'approved',
    admissionInfo: {
      isOpen: false,
      sessionStart: 'Admissions Open Next Shawwal',
      requirements: [
        'Quran Recitation test',
        'Written Arabic grammar test for senior years',
        'Character verification'
      ],
      contactPerson: 'Maulana Saeed Ahmad',
      contactPhone: '+92 21 34914194',
      scholarshipAvailable: true,
      notes: 'Strict adherence to Sunnah lifestyle and academic excellence.'
    },
    programs: [
      {
        id: 'p-401',
        name: 'Dars-e-Nizami (Kamil Stream)',
        nameUrdu: 'درسِ نظامی کامل',
        duration: '8 Years',
        gender: 'male',
        admissionStatus: 'Closed',
        feesDescription: 'Free of Cost',
        ageRequirement: '14+ years',
        description: 'Rigorous scholarly training in Tafseer, Hadith, Usul-ul-Fiqh and Mantiq.'
      },
      {
        id: 'p-402',
        name: 'Hifz-e-Quran (Residential)',
        nameUrdu: 'شعبہ حفظ القرآن رہائشی',
        duration: '3 Years',
        gender: 'male',
        admissionStatus: 'Closed',
        feesDescription: 'Free',
        ageRequirement: '9-13 years',
        description: 'Complete Hifz under certified Huffaz with 24/7 supervision.'
      }
    ],
    teachers: [
      {
        id: 't-401',
        name: 'Hazrat Maulana Sayyid Sulaiman Banuri',
        role: 'Mohtamim & Ameer',
        qualification: 'Al-Aalamiyyah, Senior Scholar',
        experienceYears: 32
      }
    ]
  },
  {
    id: 'madrasa-5',
    name: 'Jamia Naeemia Lahore',
    nameUrdu: 'جامعہ نعیمیہ لاہور',
    wiffaqAffiliation: 'Tanzeem-ul-Madaris Ahle Sunnat Pakistan',
    address: 'Near Railway Station, Garhi Shahu, Lahore',
    city: 'Lahore',
    province: 'Punjab',
    country: 'Pakistan',
    contactNumber: '+92 42 36294622',
    whatsapp: '+923005556677',
    email: 'info@jamianaeemia.pk',
    website: 'https://jamianaeemia.pk',
    description: 'Premier Ahle Sunnat seminary in Pakistan founded in 1953 by Mufti Muhammad Husain Naeemi (RA). Pioneer in combining Dars-e-Nizami with computer science, English, and university degrees.',
    descriptionUrdu: 'مفتی محمد حسین نعیمیؒ کا قائم کردہ عظیم تعلیمی مرکز، جہاں دینی علوم کے ساتھ ساتھ عصری تعلیم پر بھی خصوصی توجہ دی جاتی ہے۔',
    lat: 31.5647,
    lng: 74.3412,
    establishedYear: 1953,
    totalStudents: 3100,
    totalTeachers: 95,
    hostelAvailable: true,
    campusGender: 'Both Campuses',
    rating: 4.8,
    status: 'approved',
    admissionInfo: {
      isOpen: true,
      sessionStart: 'Shawwal 15 / Annual Registration',
      requirements: [
        'Matric / Middle certificate for Dars-e-Nizami',
        'Nazra Quran fluency test',
        'Guardian undertaking'
      ],
      contactPerson: 'Dr. Raghib Hussain Naeemi',
      contactPhone: '+92 42 36294623',
      scholarshipAvailable: true,
      notes: 'Scholarships for needy students and free boarding in Naeemia hostel.'
    },
    programs: [
      {
        id: 'p-501',
        name: 'Dars-e-Nizami (Tanzeem-ul-Madaris Syllabus)',
        nameUrdu: 'درسِ نظامی (تنظیم المدارس نصاب)',
        duration: '8 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Free with hostel facility',
        ageRequirement: '13-20 years',
        description: 'Complete Islamic theological course with official Tanzeem-ul-Madaris board exams.'
      },
      {
        id: 'p-502',
        name: 'Hifz-ul-Quran & Tajweed',
        nameUrdu: 'حفظ و تجوید القرآن',
        duration: '3 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Free',
        ageRequirement: '8-14 years',
        description: 'Traditional Hifz with strong focus on Husn-e-Qirat.'
      }
    ],
    teachers: [
      {
        id: 't-501',
        name: 'Dr. Mufti Raghib Hussain Naeemi',
        role: 'Mohtamim & Council of Islamic Ideology Member',
        qualification: 'Ph.D. Islamic Studies, Al-Aalamiyyah',
        experienceYears: 27
      }
    ]
  },
  {
    id: 'madrasa-6',
    name: 'Jamia Al-Kauthar Islamabad',
    nameUrdu: 'جامعۃ الکوثر اسلام آباد',
    wiffaqAffiliation: 'Wifaq-ul-Madaris Al-Shia Pakistan',
    address: 'Sector H-8/2, Islamabad Capital Territory',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    country: 'Pakistan',
    contactNumber: '+92 51 4863381',
    whatsapp: '+923129876543',
    email: 'info@alkauthar.edu.pk',
    website: 'https://alkauthar.edu.pk',
    description: 'Premier Islamic educational complex in the federal capital founded by Allama Sheikh Mohsin Ali Najafi (RA). Features modern classrooms, high-tech research library, and HEC-recognized higher education programs.',
    descriptionUrdu: 'اسلام آباد میں قائم جدید ترین اسلامی ریسرچ یونیورسٹی اور دارالعلوم، وسیع و عریض کیمپس اور شاندار لائبریری کے ساتھ۔',
    lat: 33.6844,
    lng: 73.0479,
    establishedYear: 1992,
    totalStudents: 1800,
    totalTeachers: 68,
    hostelAvailable: true,
    campusGender: 'Boys',
    rating: 4.9,
    status: 'approved',
    admissionInfo: {
      isOpen: true,
      sessionStart: 'August / Zul-Hijjah',
      requirements: [
        'Matriculation with minimum 60% marks',
        'Written test in general Arabic, English, and Islamic sciences',
        'Clearance of medical board'
      ],
      contactPerson: 'Maulana Kazim Raza',
      contactPhone: '+92 51 4863382',
      scholarshipAvailable: true,
      notes: 'Complete scholarship provided covering tuition, boarding, study tour, and medical.'
    },
    programs: [
      {
        id: 'p-601',
        name: 'Islamic Jurisprudence & Philosophy (Hawza)',
        nameUrdu: 'علومِ فقہ و فلسفہ و کلام',
        duration: '8 Years',
        gender: 'male',
        admissionStatus: 'Open',
        feesDescription: 'Fully Funded Scholarship',
        ageRequirement: '16-22 years',
        description: 'Advanced curriculum in Arabic literature, Logic, Usul, and Tafseer.'
      },
      {
        id: 'p-602',
        name: 'Tahfeez-ul-Quran Academy',
        nameUrdu: 'شعبہ حفظ و ترتیل القرآن',
        duration: '2.5 Years',
        gender: 'male',
        admissionStatus: 'Open',
        feesDescription: 'Free of Cost',
        ageRequirement: '9-14 years',
        description: 'Full boarding Hifz program with physical sports and character building.'
      }
    ],
    teachers: [
      {
        id: 't-601',
        name: 'Allama Sheikh Muhammad Ishaq',
        role: 'Dean of Faculty',
        qualification: 'Kharij Level Hawza Certification, Qom',
        experienceYears: 25
      }
    ]
  },
  {
    id: 'madrasa-7',
    name: 'Jamia Salafia Faisalabad',
    nameUrdu: 'جامعہ سلفیہ فیصل آباد',
    wiffaqAffiliation: 'Wifaq-ul-Madaris Al-Salafiyyah Pakistan',
    address: 'Dijkot Road, Faisalabad',
    city: 'Faisalabad',
    province: 'Punjab',
    country: 'Pakistan',
    contactNumber: '+92 41 2661331',
    whatsapp: '+923007654321',
    email: 'info@jamiasalafia.org.pk',
    website: 'https://jamiasalafia.org.pk',
    description: 'Central educational institution of Wifaq-ul-Madaris Al-Salafiyyah established in 1955. Famous for rigorous training in Hadith sciences, Sahihayn commentaries, and Arabic fluency.',
    descriptionUrdu: 'وفاق المدارس السلفیہ پاکستان کا مرکزی دارالعلوم، علومِ حدیث اور تفسیر کا مستند ادارہ۔',
    lat: 31.4187,
    lng: 73.0791,
    establishedYear: 1955,
    totalStudents: 2600,
    totalTeachers: 85,
    hostelAvailable: true,
    campusGender: 'Both Campuses',
    rating: 4.8,
    status: 'approved',
    admissionInfo: {
      isOpen: true,
      sessionStart: 'Shawwal 12',
      requirements: [
        'Quran reading fluency',
        'B-Form copy and father CNIC',
        'Clearance of oral admission test'
      ],
      contactPerson: 'Maulana Yasin Zafar',
      contactPhone: '+92 41 2661332',
      scholarshipAvailable: true,
      notes: 'Free hostel, meals, and books provided to deserving and outstation students.'
    },
    programs: [
      {
        id: 'p-701',
        name: 'Fazilat Course (Al-Aalamiyyah in Hadith)',
        nameUrdu: 'شہادۃ العالمیہ فی الحدیث',
        duration: '8 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Free of Cost',
        ageRequirement: '14+ years',
        description: 'Comprehensive study of Kutub-us-Sittah and Usul-ul-Hadith.'
      },
      {
        id: 'p-702',
        name: 'Hifz-ul-Quran & Qirat Sab’ah',
        nameUrdu: 'حفظ القرآن و قراءات سبعہ',
        duration: '3 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Free of Cost',
        ageRequirement: '8-14 years',
        description: 'Full memorization of the Holy Quran with phonetic precision.'
      }
    ],
    teachers: [
      {
        id: 't-701',
        name: 'Maulana Yasin Zafar',
        role: 'General Secretary & Principal',
        qualification: 'Al-Aalamiyyah, Senior Hadith Scholar',
        experienceYears: 30
      }
    ]
  },
  {
    id: 'madrasa-8',
    name: 'Darul Uloom Haqqania Akora Khattak',
    nameUrdu: 'دارالعلوم حقانیہ اکوڑہ خٹک',
    wiffaqAffiliation: 'Wifaq-ul-Madaris Al-Arabia Pakistan',
    address: 'GT Road, Akora Khattak, Nowshera',
    city: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    country: 'Pakistan',
    contactNumber: '+92 923 510444',
    whatsapp: '+923339112233',
    email: 'info@haqqania.edu.pk',
    website: 'https://haqqania.edu.pk',
    description: 'Renowned historic Islamic university established in 1947 by Hazrat Maulana Abdul Haq (RA). Graduated thousands of scholars and Huffaz across the world.',
    descriptionUrdu: '۱۹۴۷ء میں شیخ الحدیث مولانا عبد الحق صاحبؒ کی قائم کردہ ایشیا کی معروف ترین عظیم دینی یونیورسٹی۔',
    lat: 34.0044,
    lng: 72.1242,
    establishedYear: 1947,
    totalStudents: 4800,
    totalTeachers: 140,
    hostelAvailable: true,
    campusGender: 'Boys',
    rating: 4.9,
    status: 'approved',
    admissionInfo: {
      isOpen: true,
      sessionStart: 'Shawwal 8 (Annual)',
      requirements: [
        'Quran Nazra fluency test',
        'Valid ID / B-Form',
        'Recommendation from a registered Madrassa'
      ],
      contactPerson: 'Maulana Anwar-ul-Haq Haqqani',
      contactPhone: '+92 923 510445',
      scholarshipAvailable: true,
      notes: '100% Free residential accommodation and daily meals provided.'
    },
    programs: [
      {
        id: 'p-801',
        name: 'Dars-e-Nizami (Kamil Hadith Degree)',
        nameUrdu: 'درسِ نظامی دورۂ حدیث شریف',
        duration: '8 Years',
        gender: 'male',
        admissionStatus: 'Open',
        feesDescription: 'Free of Cost',
        ageRequirement: '13+ years',
        description: 'Complete canonical training in Hadith and Tafseer literature.'
      },
      {
        id: 'p-802',
        name: 'Hifz-ul-Quran Al-Kareem',
        nameUrdu: 'شعبہ تحفیظ القرآن الکریم',
        duration: '3 Years',
        gender: 'male',
        admissionStatus: 'Open',
        feesDescription: 'Free',
        ageRequirement: '8-14 years',
        description: 'Memorization under experienced Huffaz and Qaris.'
      }
    ],
    teachers: [
      {
        id: 't-801',
        name: 'Maulana Anwar-ul-Haq Haqqani',
        role: 'Mohtamim & Sheikh-ul-Hadith',
        qualification: 'Al-Aalamiyyah, Senior Scholar',
        experienceYears: 40
      }
    ]
  },
  {
    id: 'madrasa-9',
    name: 'Madrasa Bait-us-Salam DHA & Talagang',
    nameUrdu: 'مدرسہ بیت السلام کراچی و تلہ گنگ',
    wiffaqAffiliation: 'Wifaq-ul-Madaris Al-Arabia Pakistan',
    address: 'DHA Phase 6, Karachi & Bait-us-Salam Campus Talagang',
    city: 'Karachi',
    province: 'Sindh',
    country: 'Pakistan',
    contactNumber: '+92 21 35848821',
    whatsapp: '+923218887766',
    email: 'admissions@baitussalam.org',
    website: 'https://baitussalam.org',
    description: 'Pioneering Islamic institution known for combining authentic Hifz and Dars-e-Nizami with international Cambridge O/A Levels, robotics, mathematics, and high moral grooming.',
    descriptionUrdu: 'روایتی حفظ و درسِ نظامی کے ساتھ جدید کیمبرج تعلیم، روبوٹکس اور سائنس کا بین الاقوامی شہرت یافتہ ماڈل ادارہ۔',
    lat: 24.7892,
    lng: 67.0628,
    establishedYear: 2004,
    totalStudents: 2400,
    totalTeachers: 110,
    hostelAvailable: true,
    campusGender: 'Both Campuses',
    rating: 5.0,
    status: 'approved',
    admissionInfo: {
      isOpen: true,
      sessionStart: 'March & Shawwal Intakes',
      requirements: [
        'Merit test in English, Urdu, Math and Tajweed',
        'Student and parent interview',
        'Medical and fitness clearance'
      ],
      contactPerson: 'Maulana Abdul Sattar',
      contactPhone: '+92 21 35848822',
      scholarshipAvailable: true,
      notes: 'Need-based scholarships available for all qualifying students.'
    },
    programs: [
      {
        id: 'p-901',
        name: 'Hifz with Cambridge Schooling',
        nameUrdu: 'حفظ القرآن مع کیمبرج ایجوکیشن',
        duration: '3-4 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Affordable / Need-based 100% Scholarships',
        ageRequirement: '8-12 years',
        description: 'Complete Quran memorization while simultaneously studying English, Science and Math.'
      },
      {
        id: 'p-902',
        name: 'Dars-e-Nizami with Higher Secondary',
        nameUrdu: 'درسِ نظامی مع انٹرمیڈیٹ',
        duration: '8 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'Scholarships Available',
        ageRequirement: '14+ years',
        description: 'Holistic curriculum preparing future scholars with contemporary understanding.'
      }
    ],
    teachers: [
      {
        id: 't-901',
        name: 'Hazrat Maulana Abdul Sattar',
        role: 'Founder & Patron-in-Chief',
        qualification: 'Al-Aalamiyyah, Educationalist',
        experienceYears: 26
      }
    ]
  },
  {
    id: 'madrasa-pending-1',
    name: 'Madrasa Darul Huda Rawalpindi',
    nameUrdu: 'مدرسہ دار الہدیٰ راولپنڈی',
    wiffaqAffiliation: 'Wifaq-ul-Madaris Al-Arabia Pakistan',
    address: 'Near Commercial Market, Satellite Town',
    city: 'Rawalpindi',
    province: 'Punjab',
    country: 'Pakistan',
    contactNumber: '+92 51 4412345',
    whatsapp: '+923335551122',
    email: 'darulhuda.rwp@gmail.com',
    description: 'Community-oriented madrasa focusing on evening Quran classes for school-going children and full-time morning Hifz course.',
    descriptionUrdu: 'راولپنڈی میں قائم مدرسہ جو اسکول کے بچوں کے لیے ناظرہ اور کل وقتی حفظ القرآن کی تعلیم فراہم کرتا ہے۔',
    lat: 33.6358,
    lng: 73.0722,
    establishedYear: 2016,
    totalStudents: 320,
    totalTeachers: 14,
    hostelAvailable: false,
    campusGender: 'Both Campuses',
    rating: 4.6,
    status: 'pending',
    submittedBy: {
      name: 'Muhammad Asif (Admin Secretary)',
      email: 'asif.rwp@gmail.com',
      timestamp: '2026-10-12T14:30:00.000Z'
    },
    admissionInfo: {
      isOpen: true,
      sessionStart: 'Ramadan / Shawwal',
      requirements: ['B-form copy', 'Interview with guardian'],
      contactPerson: 'Qari Muhammad Asif',
      contactPhone: '+92 51 4412345',
      scholarshipAvailable: true,
      notes: 'Fee concessions for orphans and needy families.'
    },
    programs: [
      {
        id: 'p-pen-1',
        name: 'Hifz-ul-Quran (Day Scholar)',
        nameUrdu: 'حفظ القرآن بغیر رہائش',
        duration: '3 Years',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'PKR 1,500/month (Free for orphans)',
        ageRequirement: '7-15 years',
        description: 'Regular daytime Hifz classes with certified Hafiz.'
      },
      {
        id: 'p-pen-2',
        name: 'Evening Nazra & Tajweed',
        nameUrdu: 'شام کا ناظرہ و تجوید',
        duration: '1 Year',
        gender: 'both',
        admissionStatus: 'Open',
        feesDescription: 'PKR 1,000/month',
        ageRequirement: 'All ages',
        description: 'Ideal for school and college students.'
      }
    ],
    teachers: [
      {
        id: 't-pen-1',
        name: 'Qari Zubair Ahmad',
        role: 'Head of Tajweed',
        qualification: 'Hafiz-e-Quran, Qirat Sanad',
        experienceYears: 11
      }
    ]
  }
];
