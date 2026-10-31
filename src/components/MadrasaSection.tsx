import React, { useState } from 'react';
import { useMadrasas } from '../context/MadrasaContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Madrasa } from '../types';
import { MadrasaDetailsModal } from './madrasa/MadrasaDetailsModal';
import { MadrasaRegistrationModal } from './madrasa/MadrasaRegistrationModal';
import { MadrasaAdminReviewModal } from './madrasa/MadrasaAdminReviewModal';
import {
  Search,
  MapPin,
  Phone,
  MessageCircle,
  GraduationCap,
  Users,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  Filter,
  Sparkles,
  Building2,
  ChevronRight,
  Info
} from 'lucide-react';
import { IslamicAppIcon } from './IslamicAppIcon';

interface MadrasaSectionProps {
  onBack?: () => void;
}

export const MadrasaSection: React.FC<MadrasaSectionProps> = ({ onBack }) => {
  const { approvedMadrasas, pendingMadrasas } = useMadrasas();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [admissionsOnly, setAdmissionsOnly] = useState<boolean>(false);
  const [selectedCampusGender, setSelectedCampusGender] = useState<'all' | 'Boys' | 'Girls' | 'Both Campuses'>('all');

  // Modals state
  const [viewingMadrasa, setViewingMadrasa] = useState<Madrasa | null>(null);
  const [editingMadrasa, setEditingMadrasa] = useState<Madrasa | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isAdminReviewModalOpen, setIsAdminReviewModalOpen] = useState<boolean>(false);

  // Extract unique cities
  const cities = Array.from(new Set(approvedMadrasas.map((m) => m.city))).filter(Boolean);

  // Filtered List
  const filteredMadrasas = approvedMadrasas.filter((madrasa) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      madrasa.name.toLowerCase().includes(q) ||
      (madrasa.nameUrdu && madrasa.nameUrdu.includes(searchQuery)) ||
      madrasa.city.toLowerCase().includes(q) ||
      madrasa.address.toLowerCase().includes(q) ||
      (madrasa.wiffaqAffiliation && madrasa.wiffaqAffiliation.toLowerCase().includes(q));

    const matchesCity = selectedCity === 'all' || madrasa.city === selectedCity;
    const matchesAdmissions = !admissionsOnly || (madrasa.admissionInfo && madrasa.admissionInfo.isOpen);
    const matchesGender = selectedCampusGender === 'all' || madrasa.campusGender === selectedCampusGender;
    const matchesProgram =
      selectedProgram === 'all' ||
      madrasa.programs.some((p) => p.name.toLowerCase().includes(selectedProgram.toLowerCase()));

    return matchesSearch && matchesCity && matchesAdmissions && matchesGender && matchesProgram;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-linear-to-r from-[#0a2014] via-[#143825] to-[#091a10] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 ring-1 ring-amber-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <IslamicAppIcon type="madrasa" size="md" withGlow={true} className="ring-2 ring-amber-400/50 shadow-lg" />
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
                {language === 'en' ? 'Madrasa Directory & Admissions' : 'مدارس ڈائریکٹری و داخلہ جات'}
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {language === 'en'
                ? 'Islamic Seminaries & Education Centers'
                : 'پاکستان و عالمِ اسلام کے مستند دینی مدارس'}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 font-urdu leading-relaxed">
              {language === 'en'
                ? 'Explore verified madrasas, programs, faculty, admissions criteria, contact numbers, and GPS navigation.'
                : 'درسِ نظامی، حفظ القرآن، تخصصات اور داخلہ جات کی مستند معلومات، رابطہ نمبرز اور گوگل میپ لوکیشن۔'}
            </p>
          </div>

          {/* Action Buttons: Register New & Back to Upgrade */}
          <div className="flex flex-wrap items-center gap-3">
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
              onClick={() => {
                setEditingMadrasa(null);
                setIsRegisterModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-full bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'Register Madrasa' : 'نیا مدرسہ رجسٹر کریں'}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setIsAdminReviewModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-bold border border-emerald-500/40 shadow-sm transition-all flex items-center gap-2 relative"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>{language === 'en' ? 'Admin Approvals' : 'ایڈمن منظوری پینل'}</span>
                {pendingMadrasas.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-bold font-mono">
                    {pendingMadrasas.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e5d8c3] space-y-4">
        {/* Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search by name, city, address or board...' : 'مدرسے کا نام، شہر، پتہ یا وفاق تلاش کریں...'}
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#264a39] text-stone-900 font-urdu"
            />
          </div>

          {/* City Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2.5 px-3 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#264a39] text-stone-800 font-urdu"
            >
              <option value="all">{language === 'en' ? 'All Cities (تمام شہر)' : 'تمام شہر'}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCampusGender}
              onChange={(e) => setSelectedCampusGender(e.target.value as any)}
              className="w-full py-2.5 px-3 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#264a39] text-stone-800 font-urdu"
            >
              <option value="all">{language === 'en' ? 'All Campuses' : 'تمام کیمپسز (طلباء و طالبات)'}</option>
              <option value="Boys">{language === 'en' ? 'Boys Campus' : 'طلباء (Boys)'}</option>
              <option value="Girls">{language === 'en' ? 'Girls Campus' : 'طالبات (Girls)'}</option>
              <option value="Both Campuses">{language === 'en' ? 'Boys & Girls (Separate)' : 'مخلوط / الگ شعبہ جات'}</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-stone-500 font-medium">{language === 'en' ? 'Quick Filter:' : 'فوری فلٹر:'}</span>

            <button
              onClick={() => setAdmissionsOnly(!admissionsOnly)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                admissionsOnly
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {language === 'en' ? '🟢 Admissions Open Only' : '🟢 صرف کھلے داخلے (Admissions Open)'}
            </button>

            {['Dars-e-Nizami', 'Hifz', 'Tajweed', 'Takhassus'].map((prog) => (
              <button
                key={prog}
                onClick={() => setSelectedProgram(selectedProgram === prog ? 'all' : prog)}
                className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                  selectedProgram === prog
                    ? 'bg-[#264a39] text-white border-[#264a39] font-bold shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {prog}
              </button>
            ))}
          </div>

          <div className="text-stone-500 font-mono text-xs">
            {filteredMadrasas.length} {language === 'en' ? 'Madrasas found' : 'مدارس دستیاب'}
          </div>
        </div>
      </div>

      {/* Madrasas Cards Grid */}
      {filteredMadrasas.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#e5d8c3] space-y-3">
          <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-stone-700 font-bold text-base font-urdu">کوئی مدرسہ دستیاب نہیں</h3>
          <p className="text-stone-500 text-xs">براہ کرم تلاش کے الفاظ یا فلٹرز تبدیل کر کے دوبارہ کوشش کریں۔</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCity('all');
              setSelectedProgram('all');
              setAdmissionsOnly(false);
              setSelectedCampusGender('all');
            }}
            className="px-4 py-2 bg-[#264a39] text-white text-xs font-semibold rounded-xl"
          >
            تمام فلٹرز صاف کریں
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMadrasas.map((madrasa) => {
            const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${madrasa.lat},${madrasa.lng}`;
            const whatsappNumber = (madrasa.whatsapp || madrasa.contactNumber).replace(/[^0-9]/g, '');
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `السلام علیکم! میں نورِ اسلام ایپ کے ذریعے ${madrasa.name} کے داخلہ و تعلیمی پروگرام کے متعلق معلومات لینا چاہتا ہوں۔`
            )}`;
            const isAdmissionOpen = madrasa.admissionInfo && madrasa.admissionInfo.isOpen;

            return (
              <div
                key={madrasa.id}
                className="bg-white rounded-2xl border border-[#e5d8c3] hover:border-[#264a39] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Header & Badges */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#f4ece0] text-stone-700 border border-[#e2d5c0] truncate max-w-[200px]">
                      {madrasa.wiffaqAffiliation || 'Wifaq Affiliated'}
                    </span>

                    {isAdmissionOpen ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-urdu shrink-0 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        داخلے جاری ہیں
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200 font-urdu shrink-0">
                        داخلے بند
                      </span>
                    )}
                  </div>

                  {/* Madrasa Title & Urdu Name */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 text-base group-hover:text-[#264a39] transition-colors">
                      {madrasa.name}
                    </h3>
                    {madrasa.nameUrdu && (
                      <div className="font-urdu font-bold text-sm text-[#264a39]">
                        {madrasa.nameUrdu}
                      </div>
                    )}
                  </div>

                  {/* Location & City */}
                  <div className="text-xs text-stone-600 flex items-start gap-1.5 font-urdu">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{madrasa.address}, {madrasa.city}</span>
                  </div>

                  {/* Programs Badges */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-stone-500">پروگرامز:</span>
                    <div className="flex flex-wrap gap-1">
                      {madrasa.programs.slice(0, 3).map((prog) => (
                        <span
                          key={prog.id}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200 text-stone-700 font-urdu"
                        >
                          {prog.nameUrdu || prog.name}
                        </span>
                      ))}
                      {madrasa.programs.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 font-mono">
                          +{madrasa.programs.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats: Students & Teachers */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span>{madrasa.totalStudents || 250}+ طلباء</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-stone-400" />
                      <span>{madrasa.totalTeachers || 15}+ اساتذہ</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-1.5">
                  {/* View Details Button */}
                  <button
                    onClick={() => setViewingMadrasa(madrasa)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#264a39] hover:bg-[#1e392c] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>تفصیلات و داخلہ</span>
                  </button>

                  {/* Phone Call */}
                  <a
                    href={`tel:${madrasa.contactNumber}`}
                    className="p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-stone-700 hover:text-emerald-700 transition-colors"
                    title="کال کریں"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-stone-700 hover:text-emerald-700 transition-colors"
                    title="واٹس ایپ پر رابطہ"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>

                  {/* Map Directions */}
                  <a
                    href={mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-stone-700 hover:text-emerald-700 transition-colors"
                    title="گوگل میپ لوکیشن"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Edit button for admin */}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setEditingMadrasa(madrasa);
                        setIsRegisterModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors"
                      title="ایڈٹ کریں"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Madrasa Details Modal */}
      <MadrasaDetailsModal
        isOpen={!!viewingMadrasa}
        madrasa={viewingMadrasa}
        onClose={() => setViewingMadrasa(null)}
        onEdit={(m) => {
          setViewingMadrasa(null);
          setEditingMadrasa(m);
          setIsRegisterModalOpen(true);
        }}
      />

      {/* Madrasa Registration / Edit Modal */}
      <MadrasaRegistrationModal
        isOpen={isRegisterModalOpen}
        editingMadrasa={editingMadrasa}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setEditingMadrasa(null);
        }}
      />

      {/* Admin Approvals & Management Modal */}
      <MadrasaAdminReviewModal
        isOpen={isAdminReviewModalOpen}
        onClose={() => setIsAdminReviewModalOpen(false)}
        onSelectMadrasa={(m) => {
          setIsAdminReviewModalOpen(false);
          setViewingMadrasa(m);
        }}
        onEditMadrasa={(m) => {
          setIsAdminReviewModalOpen(false);
          setEditingMadrasa(m);
          setIsRegisterModalOpen(true);
        }}
        onAddNew={() => {
          setIsAdminReviewModalOpen(false);
          setEditingMadrasa(null);
          setIsRegisterModalOpen(true);
        }}
      />
    </div>
  );
};
