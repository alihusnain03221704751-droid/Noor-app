import React, { useState } from 'react';
import { Madrasa } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  GraduationCap,
  Users,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Navigation,
  Share2,
  Edit,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface MadrasaDetailsModalProps {
  madrasa: Madrasa | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (madrasa: Madrasa) => void;
}

export const MadrasaDetailsModal: React.FC<MadrasaDetailsModalProps> = ({
  madrasa,
  isOpen,
  onClose,
  onEdit
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'faculty' | 'admissions' | 'location'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !madrasa) return null;

  const isAdmin = user?.role === 'admin';

  // Format clean whatsapp number
  const cleanWhatsapp = madrasa.whatsapp?.replace(/[^0-9]/g, '') || madrasa.contactNumber.replace(/[^0-9]/g, '');

  // Google Maps directions URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${madrasa.lat},${madrasa.lng}`;

  const handleShare = () => {
    const text = `${madrasa.name} (${madrasa.city}) - Admissions & Information on Hasan Quran App.\nContact: ${madrasa.contactNumber}\nDirections: ${googleMapsUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden text-stone-800 my-auto max-h-[90vh] flex flex-col">
        {/* Header with Islamic Deep Sage theme */}
        <div className="bg-gradient-to-r from-[#1e392c] via-[#264a39] to-[#1c3a2d] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-stone-200 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>{madrasa.wiffaqAffiliation || 'Registered Islamic Seminary'}</span>
              </span>

              {madrasa.status === 'approved' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Verified & Approved</span>
                </span>
              )}

              {madrasa.status === 'pending' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/30 text-amber-200 border border-amber-400/40 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span>Pending Admin Review</span>
                </span>
              )}

              {madrasa.admissionInfo.isOpen ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                  Admissions Open
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-700 text-stone-300">
                  Admissions Closed
                </span>
              )}
            </div>

            <div className="pt-1">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {madrasa.name}
              </h2>
              {madrasa.nameUrdu && (
                <p className="font-urdu text-lg sm:text-xl text-amber-200 mt-0.5" dir="rtl">
                  {madrasa.nameUrdu}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-stone-300 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{madrasa.address}, {madrasa.city}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact & Directions Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-4 mt-3 border-t border-emerald-700/50">
            <a
              href={`tel:${madrasa.contactNumber}`}
              className="px-3.5 py-1.5 rounded-xl bg-white text-[#264a39] hover:bg-amber-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#264a39]" />
              <span>Call: {madrasa.contactNumber}</span>
            </a>

            {cleanWhatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Assalamu Alaikum, I am inquiring about admissions at ${madrasa.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Inquiry</span>
              </a>
            )}

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Map Directions</span>
            </a>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors ml-auto"
              title="Share listing"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            {isAdmin && onEdit && (
              <button
                onClick={() => {
                  onEdit(madrasa);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 border border-amber-400/40 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Admin Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-2 flex items-center gap-1 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: language === 'en' ? 'Overview' : 'جائزہ', icon: Building },
            { id: 'programs', label: `${language === 'en' ? 'Programs' : 'تعلیمی شعبہ جات'} (${madrasa.programs.length})`, icon: BookOpen },
            { id: 'faculty', label: `${language === 'en' ? 'Teachers' : 'اساتذہ کرام'} (${madrasa.teachers.length})`, icon: GraduationCap },
            { id: 'admissions', label: language === 'en' ? 'Admissions' : 'داخلہ معلومات', icon: Award },
            { id: 'location', label: language === 'en' ? 'Location & Map' : 'مقام و نقشہ', icon: MapPin }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#264a39] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Highlight Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Total Students</span>
                  <span className="text-xl font-bold font-mono text-[#264a39]">{madrasa.totalStudents.toLocaleString()}+</span>
                  <span className="text-[10px] text-stone-400">Enrolled Talaba</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Faculty</span>
                  <span className="text-xl font-bold font-mono text-stone-900">{madrasa.totalTeachers}+</span>
                  <span className="text-[10px] text-stone-400">Certified Asatizah</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Established</span>
                  <span className="text-xl font-bold font-mono text-amber-800">{madrasa.establishedYear || '1947'}</span>
                  <span className="text-[10px] text-stone-400">Foundation Year</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">Hostel / Boarding</span>
                  <span className="text-sm font-bold text-emerald-700 block mt-1">
                    {madrasa.hostelAvailable ? 'Available (رہائش موجود)' : 'Day Scholars Only'}
                  </span>
                  <span className="text-[10px] text-stone-400">Accommodation</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#264a39]" />
                  <span>About & Mission</span>
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed font-sans">
                  {madrasa.description}
                </p>
                {madrasa.descriptionUrdu && (
                  <p className="text-base text-stone-800 leading-loose font-urdu bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60" dir="rtl">
                    {madrasa.descriptionUrdu}
                  </p>
                )}
              </div>

              {/* Facility Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#264a39]" />
                    <span>Campus Gender Policy:</span>
                  </span>
                  <span className="text-stone-700 font-medium">{madrasa.campusGender}</span>
                  <p className="text-[11px] text-stone-500">
                    {madrasa.campusGender === 'Both Campuses'
                      ? 'Separate dedicated branches for boys and girls with female faculty for female students.'
                      : `Specialized dedicated campus for ${madrasa.campusGender.toLowerCase()}.`}
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#264a39]" />
                    <span>Examination Board / Wifaq:</span>
                  </span>
                  <span className="text-stone-700 font-medium">{madrasa.wiffaqAffiliation || 'Autonomous Islamic Seminary'}</span>
                  <p className="text-[11px] text-stone-500">
                    Officially accredited for Shahadat-ul-Aalamiyyah, HEC equivalence, and national sanad.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. EDUCATION PROGRAMS TAB */}
          {activeTab === 'programs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-base text-stone-900">
                  Offered Academic Programs & Sanad
                </h4>
                <span className="text-xs text-stone-500">
                  {madrasa.programs.length} Active Courses
                </span>
              </div>

              <div className="space-y-3">
                {madrasa.programs.map((program) => (
                  <div
                    key={program.id}
                    className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-[#264a39]/40 transition-all space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-stone-900 text-sm">
                          {program.name}
                        </h5>
                        {program.nameUrdu && (
                          <span className="font-urdu text-sm text-[#264a39] block mt-0.5" dir="rtl">
                            {program.nameUrdu}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 font-mono">
                          Duration: {program.duration}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          program.admissionStatus === 'Open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}>
                          {program.admissionStatus}
                        </span>
                      </div>
                    </div>

                    {program.description && (
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {program.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs text-stone-600">
                      <span className="font-medium">
                        <strong className="text-stone-900">Fees / Waqf:</strong> {program.feesDescription}
                      </span>
                      {program.ageRequirement && (
                        <span>
                          <strong className="text-stone-900">Age:</strong> {program.ageRequirement}
                        </span>
                      )}
                      <span>
                        <strong className="text-stone-900">Gender:</strong> {program.gender.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. FACULTY & TEACHERS TAB */}
          {activeTab === 'faculty' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-base text-stone-900">
                  Distinguished Faculty & Scholars
                </h4>
                <span className="text-xs text-stone-500 font-mono">
                  {madrasa.teachers.length} Listed Scholars
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {madrasa.teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#264a39] text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-bold text-stone-900 text-sm">
                            {teacher.name}
                          </h5>
                          <span className="text-xs text-[#264a39] font-medium block">
                            {teacher.role}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 mt-2">
                        <strong>Qualification:</strong> {teacher.qualification}
                      </p>
                    </div>

                    {teacher.experienceYears && (
                      <div className="pt-2 border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center justify-between">
                        <span>Teaching Experience:</span>
                        <span className="font-mono font-bold text-stone-800">{teacher.experienceYears} Years</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ADMISSIONS TAB */}
          {activeTab === 'admissions' && (
            <div className="space-y-5">
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                madrasa.admissionInfo.isOpen
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-stone-100 border-stone-300 text-stone-800'
              }`}>
                {madrasa.admissionInfo.isOpen ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h5 className="font-bold text-sm">
                    {madrasa.admissionInfo.isOpen
                      ? 'Admissions Are Currently Open'
                      : 'Admissions Are Currently Closed for This Intake'}
                  </h5>
                  <p className="text-xs leading-relaxed">
                    Session Schedule: <strong>{madrasa.admissionInfo.sessionStart}</strong>
                  </p>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="space-y-3">
                <h5 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#264a39]" />
                  <span>Admission Requirements & Criteria</span>
                </h5>
                <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2">
                  {madrasa.admissionInfo.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scholarship & Free Education */}
              {madrasa.admissionInfo.scholarshipAvailable && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                  <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Free Waqf / Zakat & Sadqah Scholarship Available:</span>
                  </h5>
                  <p className="text-stone-700 leading-relaxed">
                    Deserving, orphan, and out-of-city students are offered full exemption from boarding, meals, and academic fees under community Waqf and Sadqah funds.
                  </p>
                  {madrasa.admissionInfo.notes && (
                    <p className="font-medium text-amber-900 pt-1">
                      Note: {madrasa.admissionInfo.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Admission Representative Details */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <span className="font-bold text-stone-900 block">
                  Admission Office Incharge:
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-stone-800">{madrasa.admissionInfo.contactPerson}</p>
                    <p className="text-stone-500 font-mono text-[11px]">{madrasa.admissionInfo.contactPhone}</p>
                  </div>
                  <a
                    href={`tel:${madrasa.admissionInfo.contactPhone}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#264a39] text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Admission Office</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 5. LOCATION & MAP TAB */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#264a39]" />
                    <span>Address & Coordinates</span>
                  </span>
                  <span className="font-mono text-xs text-stone-500">
                    {madrasa.lat.toFixed(4)}° N, {madrasa.lng.toFixed(4)}° E
                  </span>
                </div>

                <p className="text-xs text-stone-700">
                  {madrasa.address}, {madrasa.city}, {madrasa.province || 'Pakistan'}
                </p>

                {/* Visual Map Representation Card */}
                <div className="relative w-full h-48 rounded-xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 overflow-hidden flex flex-col items-center justify-center text-center p-4 border border-stone-300 shadow-inner">
                  {/* Visual grid lines mimicking map */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                      <MapPin className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{madrasa.name}</p>
                      <p className="text-xs text-amber-200 font-mono">{madrasa.city} · {madrasa.lat}, {madrasa.lng}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#264a39] hover:bg-[#1e392c] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Launch Google Maps Directions</span>
                  </a>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(`${madrasa.lat},${madrasa.lng}`);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors"
                  >
                    {copiedLink ? 'Coordinates Copied!' : 'Copy GPS Coordinates'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
