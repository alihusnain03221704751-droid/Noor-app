import React, { useState, useEffect } from 'react';
import { Madrasa, MadrasaProgram } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMadrasas } from '../../context/MadrasaContext';
import {
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Compass,
  Plus,
  Trash2
} from 'lucide-react';

interface MadrasaRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMadrasa?: Madrasa | null;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Lahore: { lat: 31.5204, lng: 74.3235 },
  Karachi: { lat: 24.8607, lng: 67.0011 },
  Islamabad: { lat: 33.6844, lng: 73.0479 },
  Rawalpindi: { lat: 33.6007, lng: 73.0679 },
  Faisalabad: { lat: 31.4187, lng: 73.0791 },
  Multan: { lat: 30.1575, lng: 71.5249 },
  Peshawar: { lat: 34.0151, lng: 71.5249 },
  Quetta: { lat: 30.1798, lng: 66.9750 },
  Gujranwala: { lat: 32.1877, lng: 74.1945 },
  Sialkot: { lat: 32.4945, lng: 74.5229 }
};

const DEFAULT_PROGRAMS: MadrasaProgram[] = [
  {
    id: 'prog-hifz',
    name: 'Hifz-ul-Quran Al-Kareem',
    nameUrdu: 'حفظ القرآن الکریم مع تجوید',
    duration: '3 Years',
    gender: 'both',
    admissionStatus: 'Open',
    feesDescription: 'Free of Cost (Waqf funded)',
    ageRequirement: '8-14 years',
    description: 'Complete memorization of 30 Juz with proper pronunciation.'
  },
  {
    id: 'prog-dars',
    name: 'Dars-e-Nizami (Shahadat-ul-Aalamiyyah)',
    nameUrdu: 'درسِ نظامی مکمل نصاب',
    duration: '8 Years',
    gender: 'both',
    admissionStatus: 'Open',
    feesDescription: 'Free (Full Boarding & Taam included)',
    ageRequirement: '14+ years',
    description: 'Classical higher Islamic jurisprudence, Tafseer, and Hadith.'
  },
  {
    id: 'prog-tajweed',
    name: 'Tajweed-o-Qirat Sanad',
    nameUrdu: 'تجوید و قراءات سبعہ',
    duration: '1-2 Years',
    gender: 'both',
    admissionStatus: 'Open',
    feesDescription: 'Free',
    ageRequirement: 'All ages',
    description: 'Specialization in Makhaarij and classical recitation.'
  }
];

export const MadrasaRegistrationModal: React.FC<MadrasaRegistrationModalProps> = ({
  isOpen,
  onClose,
  editingMadrasa
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { submitMadrasa, updateMadrasa } = useMadrasas();

  const isAdmin = user?.role === 'admin';

  // Form State
  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [wiffaqAffiliation, setWiffaqAffiliation] = useState('Wifaq-ul-Madaris Al-Arabia Pakistan');
  const [city, setCity] = useState('Lahore');
  const [customCity, setCustomCity] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionUrdu, setDescriptionUrdu] = useState('');
  const [lat, setLat] = useState<number>(31.5204);
  const [lng, setLng] = useState<number>(74.3235);
  const [establishedYear, setEstablishedYear] = useState<number>(1980);
  const [totalStudents, setTotalStudents] = useState<number>(500);
  const [totalTeachers, setTotalTeachers] = useState<number>(25);
  const [hostelAvailable, setHostelAvailable] = useState<boolean>(true);
  const [campusGender, setCampusGender] = useState<'Boys' | 'Girls' | 'Both Campuses'>('Both Campuses');

  // Admissions
  const [isAdmissionOpen, setIsAdmissionOpen] = useState<boolean>(true);
  const [sessionStart, setSessionStart] = useState<string>('Shawwal 1446 (Annual Intake)');
  const [admissionContactPerson, setAdmissionContactPerson] = useState<string>('');
  const [admissionContactPhone, setAdmissionContactPhone] = useState<string>('');
  const [scholarshipAvailable, setScholarshipAvailable] = useState<boolean>(true);
  const [admissionRequirements, setAdmissionRequirements] = useState<string>(
    'Passing entrance interview\nValid B-Form / CNIC\n2 Passport size photographs'
  );

  // Programs
  const [programs, setPrograms] = useState<MadrasaProgram[]>(DEFAULT_PROGRAMS);

  // Status & Feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    id: string;
    status: 'approved' | 'pending';
  } | null>(null);

  // Populate form if editing
  useEffect(() => {
    if (editingMadrasa) {
      setName(editingMadrasa.name);
      setNameUrdu(editingMadrasa.nameUrdu || '');
      setWiffaqAffiliation(editingMadrasa.wiffaqAffiliation || 'Wifaq-ul-Madaris Al-Arabia Pakistan');
      setCity(editingMadrasa.city);
      setProvince(editingMadrasa.province || 'Punjab');
      setAddress(editingMadrasa.address);
      setContactNumber(editingMadrasa.contactNumber);
      setWhatsapp(editingMadrasa.whatsapp || '');
      setEmail(editingMadrasa.email || '');
      setWebsite(editingMadrasa.website || '');
      setDescription(editingMadrasa.description);
      setDescriptionUrdu(editingMadrasa.descriptionUrdu || '');
      setLat(editingMadrasa.lat);
      setLng(editingMadrasa.lng);
      setEstablishedYear(editingMadrasa.establishedYear || 1990);
      setTotalStudents(editingMadrasa.totalStudents);
      setTotalTeachers(editingMadrasa.totalTeachers);
      setHostelAvailable(editingMadrasa.hostelAvailable);
      setCampusGender(editingMadrasa.campusGender);
      setIsAdmissionOpen(editingMadrasa.admissionInfo.isOpen);
      setSessionStart(editingMadrasa.admissionInfo.sessionStart);
      setAdmissionContactPerson(editingMadrasa.admissionInfo.contactPerson);
      setAdmissionContactPhone(editingMadrasa.admissionInfo.contactPhone);
      setScholarshipAvailable(editingMadrasa.admissionInfo.scholarshipAvailable);
      setAdmissionRequirements(editingMadrasa.admissionInfo.requirements.join('\n'));
      setPrograms(editingMadrasa.programs.length > 0 ? editingMadrasa.programs : DEFAULT_PROGRAMS);
    } else {
      // Reset form
      setName('');
      setNameUrdu('');
      setAddress('');
      setContactNumber('');
      setDescription('');
      setSubmissionResult(null);
      setErrors({});
    }
  }, [editingMadrasa, isOpen]);

  // Update coords when city changes
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (CITY_COORDINATES[newCity]) {
      setLat(CITY_COORDINATES[newCity].lat);
      setLng(CITY_COORDINATES[newCity].lng);
    }
  };

  // Get current GPS
  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(parseFloat(pos.coords.latitude.toFixed(4)));
          setLng(parseFloat(pos.coords.longitude.toFixed(4)));
        },
        (err) => {
          console.warn('Geolocation error:', err);
          alert('GPS permission was not granted or timeout occurred. Using default city coordinates.');
        }
      );
    }
  };

  // Validate Form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = 'Please provide a valid Madrasa name (at least 3 characters).';
    }

    const effectiveCity = city === 'Other' ? customCity : city;
    if (!effectiveCity.trim()) {
      newErrors.city = 'Please specify the city.';
    }

    if (!address.trim() || address.trim().length < 5) {
      newErrors.address = 'Please provide the street address / area (at least 5 characters).';
    }

    if (!contactNumber.trim() || contactNumber.trim().length < 7) {
      newErrors.contactNumber = 'Valid contact phone number is required (e.g. +92 42 37583681).';
    }

    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = 'Please provide a description or background of the madrasa (at least 10 characters).';
    }

    if (isNaN(lat) || isNaN(lng)) {
      newErrors.location = 'Valid latitude and longitude coordinates are required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const effectiveCity = city === 'Other' ? customCity : city;
    const reqList = admissionRequirements
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const madrasaPayload = {
      name: name.trim(),
      nameUrdu: nameUrdu.trim() || undefined,
      wiffaqAffiliation: wiffaqAffiliation.trim(),
      address: address.trim(),
      city: effectiveCity.trim(),
      province: province.trim(),
      country: 'Pakistan',
      contactNumber: contactNumber.trim(),
      whatsapp: whatsapp.trim() || undefined,
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      description: description.trim(),
      descriptionUrdu: descriptionUrdu.trim() || undefined,
      lat,
      lng,
      establishedYear: Number(establishedYear) || 1980,
      totalStudents: Number(totalStudents) || 100,
      totalTeachers: Number(totalTeachers) || 10,
      hostelAvailable,
      campusGender,
      programs,
      teachers: editingMadrasa?.teachers || [
        {
          id: `t-${Date.now()}`,
          name: admissionContactPerson || 'Hazrat Sheikh / Mohtamim',
          role: 'Head of Department / Mohtamim',
          qualification: 'Al-Aalamiyyah, Hafiz-e-Quran',
          experienceYears: 15
        }
      ],
      admissionInfo: {
        isOpen: isAdmissionOpen,
        sessionStart: sessionStart.trim(),
        requirements: reqList.length > 0 ? reqList : ['Valid B-form or CNIC', 'Quran recitation test'],
        contactPerson: admissionContactPerson.trim() || 'Admission Office',
        contactPhone: admissionContactPhone.trim() || contactNumber.trim(),
        scholarshipAvailable
      }
    };

    if (editingMadrasa) {
      updateMadrasa(editingMadrasa.id, madrasaPayload);
      setIsSubmitting(false);
      setSubmissionResult({
        success: true,
        id: editingMadrasa.id,
        status: editingMadrasa.status === 'rejected' ? 'pending' : editingMadrasa.status
      });
    } else {
      const res = submitMadrasa(madrasaPayload);
      setIsSubmitting(false);
      setSubmissionResult(res);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden text-stone-800 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#264a39] text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-300">
                {editingMadrasa
                  ? (language === 'en' ? 'Edit Madrasa Record' : 'مدرسہ ریکارڈ میں ترمیم')
                  : (language === 'en' ? 'Register a Madrasa / Islamic Seminary' : 'نئے مدرسے کی رجسٹریشن')}
              </h3>
              <p className="text-xs text-stone-400">
                {language === 'en'
                  ? 'Submit for verified listing in the Hasan Quran national directory'
                  : 'حسن قرآن ڈائریکٹری میں مستند شمولیت کے لیے کوائف درج کریں'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Success State */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {submissionResult ? (
            <div className="py-8 px-4 text-center space-y-4 max-w-md mx-auto animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-display text-2xl font-bold text-stone-900">
                {editingMadrasa
                  ? 'Madrasa Record Updated!'
                  : submissionResult.status === 'approved'
                  ? 'Madrasa Published Successfully!'
                  : 'Application Submitted for Admin Approval!'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {submissionResult.status === 'approved'
                  ? 'This madrasa listing is now immediately live and accessible to all users across Pakistan and worldwide.'
                  : 'Thank you! Your submission has been received with tracking ID #' +
                    submissionResult.id +
                    '. It will appear publicly as soon as the administrator verifies the board credentials and contacts.'}
              </p>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono text-stone-700">
                Tracking ID: <span className="font-bold text-[#264a39]">{submissionResult.id}</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#264a39] hover:bg-[#1e392c] text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Return to Madrasa Directory
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Admin Notice or Review Explanation */}
              {!isAdmin ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Community Registration Process:</span>
                    <p className="text-stone-700 mt-0.5 leading-relaxed">
                      Submissions are reviewed by the Hasan Quran administrative team to protect students and prevent fraudulent listings. Once approved, your madrasa will be visible in search and map directions.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p>
                    <strong>Super Admin Mode Active:</strong> This listing will be immediately approved and published to the live directory upon submission.
                  </p>
                </div>
              )}

              {/* 1. Basic Information */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#264a39]" />
                  <span>1. Institutional Identity & Board Affiliation</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Madrasa Name (English) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jamia Darul Uloom..."
                      className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#264a39] ${
                        errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-stone-300'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Madrasa Name in Urdu (نام اردو میں)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={nameUrdu}
                      onChange={(e) => setNameUrdu(e.target.value)}
                      placeholder="مثال: جامعہ دارالعلوم..."
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#264a39] font-urdu text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Wifaq / Educational Board
                    </label>
                    <select
                      value={wiffaqAffiliation}
                      onChange={(e) => setWiffaqAffiliation(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#264a39]"
                    >
                      <option value="Wifaq-ul-Madaris Al-Arabia Pakistan">Wifaq-ul-Madaris Al-Arabia Pakistan (وفاق المدارس العربیہ)</option>
                      <option value="Tanzeem-ul-Madaris Ahle Sunnat Pakistan">Tanzeem-ul-Madaris Ahle Sunnat Pakistan (تنظیم المدارس)</option>
                      <option value="Wifaq-ul-Madaris Al-Salafiyyah Pakistan">Wifaq-ul-Madaris Al-Salafiyyah (وفاق المدارس السلفیہ)</option>
                      <option value="Wifaq-ul-Madaris Al-Shia Pakistan">Wifaq-ul-Madaris Al-Shia (وفاق المدارس الشیعہ)</option>
                      <option value="Rabita-tul-Madaris Al-Islamiyyah">Rabita-tul-Madaris Al-Islamiyyah (رابطۃ المدارس)</option>
                      <option value="Autonomous / Waqf Seminary">Autonomous / Waqf Seminary (خود مختار ادارہ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Campus Gender Policy
                    </label>
                    <select
                      value={campusGender}
                      onChange={(e) => setCampusGender(e.target.value as typeof campusGender)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#264a39]"
                    >
                      <option value="Both Campuses">Both Campuses (Boys & Girls Separate)</option>
                      <option value="Boys">Boys Campus Only (برائے طلبہ)</option>
                      <option value="Girls">Girls Campus Only (برائے طالبات)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Location & Map Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#264a39]" />
                  <span>2. City, Address & Map Coordinates</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#264a39]"
                    >
                      <option value="Lahore">Lahore (لاہور)</option>
                      <option value="Karachi">Karachi (کراچی)</option>
                      <option value="Islamabad">Islamabad (اسلام آباد)</option>
                      <option value="Rawalpindi">Rawalpindi (راولپنڈی)</option>
                      <option value="Faisalabad">Faisalabad (فیصل آباد)</option>
                      <option value="Multan">Multan (ملتان)</option>
                      <option value="Peshawar">Peshawar (پشاور)</option>
                      <option value="Quetta">Quetta (کوئٹہ)</option>
                      <option value="Gujranwala">Gujranwala (گوجرانوالہ)</option>
                      <option value="Sialkot">Sialkot (سیالکوٹ)</option>
                      <option value="Other">Other City (دیگر)</option>
                    </select>
                  </div>

                  {city === 'Other' && (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Enter Custom City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="City name..."
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Province
                    </label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Punjab, Sindh, KP, Balochistan..."
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Established Year
                    </label>
                    <input
                      type="number"
                      value={establishedYear}
                      onChange={(e) => setEstablishedYear(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Complete Street Address & Landmark <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Near Ferozepur Road Flyover, Muslim Town, Lahore"
                    className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#264a39] ${
                      errors.address ? 'border-rose-400 bg-rose-50/50' : 'border-stone-300'
                    }`}
                  />
                  {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
                </div>

                {/* Map Coordinates with GPS Auto-detection */}
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#264a39]" />
                      <span>GPS Coordinates for Turn-by-Turn Navigation</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      className="px-3 py-1 bg-white hover:bg-stone-100 text-[#264a39] border border-stone-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Detect from My Device GPS</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lat}
                        onChange={(e) => setLat(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lng}
                        onChange={(e) => setLng(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Contact Numbers & Digital Channels */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#264a39]" />
                  <span>3. Official Contact Numbers & Verification</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Official Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+92 42 37583681"
                      className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#264a39] font-mono ${
                        errors.contactNumber ? 'border-rose-400 bg-rose-50/50' : 'border-stone-300'
                      }`}
                    />
                    {errors.contactNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.contactNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      WhatsApp Inquiry Number
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="info@madrasa.org.pk"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Website (if any)
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://madrasa.org.pk"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Description & Background */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1">
                  4. Institutional Description & History
                </h4>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Description & Educational Vision <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the curriculum, historical background, achievements, and facilities..."
                    className={`w-full p-3 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#264a39] ${
                      errors.description ? 'border-rose-400 bg-rose-50/50' : 'border-stone-300'
                    }`}
                  />
                  {errors.description && <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Description in Urdu (تفصیل اردو میں)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={descriptionUrdu}
                    onChange={(e) => setDescriptionUrdu(e.target.value)}
                    placeholder="مدرسے کی دینی و تعلیمی خدمات اور پسِ منظر..."
                    className="w-full p-3 text-xs border border-stone-300 rounded-xl font-urdu text-right"
                  />
                </div>
              </div>

              {/* 5. Capacity & Facilities */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#264a39]" />
                  <span>5. Student Capacity, Faculty & Hostel</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Enrolled Students
                    </label>
                    <input
                      type="number"
                      value={totalStudents}
                      onChange={(e) => setTotalStudents(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Faculty / Teachers
                    </label>
                    <input
                      type="number"
                      value={totalTeachers}
                      onChange={(e) => setTotalTeachers(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hostelAvailable}
                        onChange={(e) => setHostelAvailable(e.target.checked)}
                        className="w-4 h-4 text-[#264a39] rounded"
                      />
                      <span>Hostel / Residential Facility Available</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 6. Admissions Information */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#264a39]" />
                  <span>6. Admissions Information & Contact Incharge</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAdmissionOpen}
                        onChange={(e) => setIsAdmissionOpen(e.target.checked)}
                        className="w-4 h-4 text-[#264a39] rounded"
                      />
                      <span>Admissions Are Currently OPEN</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scholarshipAvailable}
                        onChange={(e) => setScholarshipAvailable(e.target.checked)}
                        className="w-4 h-4 text-[#264a39] rounded"
                      />
                      <span>Free Waqf / Zakat Scholarships Available</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Session Schedule
                    </label>
                    <input
                      type="text"
                      value={sessionStart}
                      onChange={(e) => setSessionStart(e.target.value)}
                      placeholder="e.g. Shawwal 1446 / Annual"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Admission Incharge Name
                    </label>
                    <input
                      type="text"
                      value={admissionContactPerson}
                      onChange={(e) => setAdmissionContactPerson(e.target.value)}
                      placeholder="e.g. Qari Asadullah"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Admission Office Phone
                    </label>
                    <input
                      type="text"
                      value={admissionContactPhone}
                      onChange={(e) => setAdmissionContactPhone(e.target.value)}
                      placeholder="+92 42 37583682"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Requirements (one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={admissionRequirements}
                    onChange={(e) => setAdmissionRequirements(e.target.value)}
                    placeholder="B-Form / CNIC&#10;Entry Test&#10;Character certificate"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#264a39] hover:bg-[#1e392c] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : editingMadrasa
                    ? 'Save Madrasa Changes'
                    : isAdmin
                    ? 'Publish Madrasa Listing'
                    : 'Submit for Admin Approval'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
