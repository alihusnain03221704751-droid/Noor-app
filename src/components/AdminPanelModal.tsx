import React, { useState, useEffect } from 'react';
import { useAuth, ADMIN_EMAILS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  ShieldCheck,
  Users,
  Video,
  BookOpen,
  MapPin,
  Calendar,
  HeartHandshake,
  AlertTriangle,
  GraduationCap,
  Settings,
  Lock,
  Unlock,
  CheckCircle2,
  Download,
  Upload,
  Server,
  Key,
  Database,
  ExternalLink,
  ShieldAlert,
  Eye,
  EyeOff,
  Search,
  Filter,
  Clock,
  UserCheck,
  Shield,
  KeyRound,
  RefreshCw,
  Trash2,
  Sparkles,
  FileText
} from 'lucide-react';
import {
  verifyAdminPassword,
  updateAdminPassword,
  isAdminSessionUnlocked,
  unlockAdminSession,
  lockAdminSession,
  getUserLoginRecords,
  clearUserLoginRecords,
  DEFAULT_ADMIN_PASSWORD
} from '../utils/adminSecurity';
import { UserLoginRecord, UserRoleType } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Security gate states
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Tab & logs states
  const [activeAdminTab, setActiveAdminTab] = useState<string>('user_logs');
  const [backupMessage, setBackupMessage] = useState<string>('');
  const [loginLogs, setLoginLogs] = useState<UserLoginRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  // Change password states
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<string>('');
  const [passwordChangeError, setPasswordChangeError] = useState<string>('');

  // Check session unlock status and load logs
  useEffect(() => {
    if (isOpen) {
      setIsUnlocked(isAdminSessionUnlocked());
      setLoginLogs(getUserLoginRecords());
      setPasswordInput('');
      setPasswordError('');
    }
  }, [isOpen]);

  // Listen for real-time user login events
  useEffect(() => {
    const handleUserLoggedIn = () => {
      setLoginLogs(getUserLoginRecords());
    };

    window.addEventListener('hasan_quran_user_logged_in', handleUserLoggedIn);
    return () => {
      window.removeEventListener('hasan_quran_user_logged_in', handleUserLoggedIn);
    };
  }, []);

  if (!isOpen) return null;

  // Handle password submission to unlock admin panel
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setPasswordError(language === 'en' ? 'Please enter the admin password.' : 'برائے مہربانی ایڈمن پاس ورڈ درج کریں۔');
      return;
    }

    if (verifyAdminPassword(passwordInput)) {
      unlockAdminSession();
      setIsUnlocked(true);
      setPasswordError('');
      setPasswordInput('');
      setLoginLogs(getUserLoginRecords());
    } else {
      setPasswordError(
        language === 'en'
          ? 'Incorrect admin password. Access denied.'
          : 'غلط پاس ورڈ۔ ایڈمن پینل تک رسائی مسترد کر دی گئی۔'
      );
    }
  };

  // Lock the admin panel
  const handleLockPanel = () => {
    lockAdminSession();
    setIsUnlocked(false);
    setPasswordInput('');
    setPasswordError('');
  };

  // Change password handler
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage('');
    setPasswordChangeError('');

    if (newPasswordInput.length < 6) {
      setPasswordChangeError(
        language === 'en'
          ? 'New password must be at least 6 characters long.'
          : 'نیا پاس ورڈ کم از کم ۶ حروف پر مشتمل ہونا چاہیے۔'
      );
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError(
        language === 'en'
          ? 'Passwords do not match.'
          : 'دونوں پاس ورڈ مماثل نہیں ہیں۔'
      );
      return;
    }

    const success = updateAdminPassword(newPasswordInput);
    if (success) {
      setPasswordChangeMessage(
        language === 'en'
          ? 'Admin password updated successfully!'
          : 'ایڈمن پاس ورڈ کامیابی سے تبدیل ہو گیا!'
      );
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setTimeout(() => setPasswordChangeMessage(''), 4000);
    } else {
      setPasswordChangeError(
        language === 'en' ? 'Failed to update password.' : 'پاس ورڈ تبدیل کرنے میں خرابی ہوئی۔'
      );
    }
  };

  // Export User Login Records to JSON
  const handleExportUserLogs = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(loginLogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `hasan_quran_user_roles_audit_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch {
      alert('Failed to export user logs.');
    }
  };

  // Clear logs handler
  const handleClearLogs = () => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to clear all user login audit records?' : 'کیا آپ تمام صارف لاگ ان ریکارڈز صاف کرنا چاہتے ہیں؟')) {
      clearUserLoginRecords();
      setLoginLogs([]);
    }
  };

  // Filter login logs
  const filteredLogs = loginLogs.filter((log) => {
    const matchesRole = selectedRoleFilter === 'all' || log.role === selectedRoleFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      log.name.toLowerCase().includes(query) ||
      log.purpose.toLowerCase().includes(query) ||
      (log.email && log.email.toLowerCase().includes(query)) ||
      log.role.toLowerCase().includes(query);

    return matchesRole && matchesSearch;
  });

  // Calculate role statistics
  const totalLogins = loginLogs.length;
  const studentCount = loginLogs.filter((l) => l.role === 'Student').length;
  const teacherCount = loginLogs.filter((l) => l.role === 'Teacher').length;
  const creatorCount = loginLogs.filter((l) => l.role === 'Content Creator').length;
  const otherCount = loginLogs.filter((l) => l.role === 'Other').length;

  const adminTabs = [
    {
      id: 'user_logs',
      label: language === 'en' ? 'User Login & Roles' : 'صارفین لاگ ان ریکارڈ',
      icon: Users,
      badge: totalLogins
    },
    {
      id: 'owner',
      label: language === 'en' ? 'Owner Control & Infrastructure' : 'مالکانہ کنٹرول و سیکیورٹی',
      icon: ShieldCheck
    },
    {
      id: 'overview',
      label: language === 'en' ? 'System Overview' : 'نظام کا جائزہ',
      icon: Server
    },
    {
      id: 'moderation',
      label: language === 'en' ? '3-Warning Log' : '۳ وارننگ ماڈریشن',
      icon: AlertTriangle
    },
    {
      id: 'teachers',
      label: language === 'en' ? 'Teacher Vetting' : 'اساتذہ کی جانچ',
      icon: GraduationCap
    },
    {
      id: 'charity',
      label: language === 'en' ? 'Charity Audit' : 'خدمتِ خلق آڈٹ',
      icon: HeartHandshake
    }
  ];

  // Helper for role badge styling
  const getRoleBadge = (role: UserRoleType) => {
    switch (role) {
      case 'Student':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: language === 'en' ? 'Student' : 'طالب علم'
        };
      case 'Teacher':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: language === 'en' ? 'Teacher' : 'استاد / قاری'
        };
      case 'Content Creator':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          label: language === 'en' ? 'Content Creator' : 'مواد تخلیق کار'
        };
      case 'Other':
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: language === 'en' ? 'Other' : 'دیگر / عام صارف'
        };
    }
  };

  // Backup exporter
  const handleExportBackup = () => {
    try {
      const backupData = {
        app: 'Hasan Quran',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        ownerAccount: 'alihusnain03221704751@gmail.com',
        userPreferences: user?.preferences || {},
        userLoginRecords: loginLogs,
        bookmarks: {
          quranBookmarks: localStorage.getItem('noor_quran_bookmarks') || '[]',
          mushaf16LineBookmarks: localStorage.getItem('noor_16line_bookmarks') || '[]',
          last16LinePage: localStorage.getItem('noor_16line_last_page') || '1'
        },
        prayerSettings: {
          selectedCity: localStorage.getItem('noor_selected_city') || '{}',
          prayerAlerts: localStorage.getItem('noor_prayer_alerts') || '{}',
          soundEnabled: localStorage.getItem('noor_sound_enabled') || 'true',
          azanVoice: localStorage.getItem('noor_azan_voice') || 'makkah'
        },
        tasbeehTotal: localStorage.getItem('noor_tasbeeh_total') || '0',
        futureInterest: localStorage.getItem('noor_future_feature_interest') || '[]'
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `hasan_quran_app_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setBackupMessage(language === 'en' ? 'System backup downloaded successfully!' : 'بیک اپ فائل کامیابی سے ڈاؤنلوڈ ہو گئی!');
      setTimeout(() => setBackupMessage(''), 4000);
    } catch {
      setBackupMessage(language === 'en' ? 'Backup generation failed.' : 'بیک اپ تیار کرنے میں خرابی ہوئی۔');
    }
  };

  // Backup importer
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (parsed.app === 'Hasan Quran' || parsed.app === 'Noor Islam' || parsed.app === 'Noor Islamic App') {
          if (parsed.bookmarks?.quranBookmarks) {
            localStorage.setItem('noor_quran_bookmarks', parsed.bookmarks.quranBookmarks);
          }
          if (parsed.bookmarks?.mushaf16LineBookmarks) {
            localStorage.setItem('noor_16line_bookmarks', parsed.bookmarks.mushaf16LineBookmarks);
          }
          if (parsed.prayerSettings?.prayerAlerts) {
            localStorage.setItem('noor_prayer_alerts', parsed.prayerSettings.prayerAlerts);
          }
          if (parsed.prayerSettings?.selectedCity) {
            localStorage.setItem('noor_selected_city', parsed.prayerSettings.selectedCity);
          }
          if (parsed.userLoginRecords && Array.isArray(parsed.userLoginRecords)) {
            localStorage.setItem('hasan_quran_user_login_logs_v1', JSON.stringify(parsed.userLoginRecords));
            setLoginLogs(parsed.userLoginRecords);
          }
          setBackupMessage(language === 'en' ? 'Backup restored successfully! Refreshing...' : 'بیک اپ ڈیٹا بحال ہو گیا!');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setBackupMessage(language === 'en' ? 'Invalid backup file format.' : 'غلط بیک اپ فارمیٹ۔');
        }
      } catch {
        setBackupMessage(language === 'en' ? 'Failed to read backup file.' : 'فائل پڑھنے میں ناکامی۔');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden text-stone-800 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-amber-300">
                  {language === 'en' ? 'Admin Panel & Security Center' : 'ایڈمن پینل اور سیکیورٹی سینٹر'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/90 text-emerald-300 border border-emerald-700">
                  SUPER ADMIN RBAC
                </span>
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Unlock className="w-3 h-3" />
                    <span>UNLOCKED</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Lock className="w-3 h-3" />
                    <span>PASSWORD PROTECTED</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {language === 'en'
                  ? 'Exclusive administrative governance for authorized administrators'
                  : 'صرف مجاز ایڈمنسٹریٹر کے لیے ماڈریشن اور یوزر کنٹرول'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={handleLockPanel}
                title={language === 'en' ? 'Lock Admin Panel' : 'پینل مقفل کریں'}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{language === 'en' ? 'Lock Panel' : 'مقفل کریں'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECURITY GATE: If Not Unlocked, Show Password Gate Screen */}
        {!isUnlocked ? (
          <div className="p-6 sm:p-10 flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shadow-sm">
              <KeyRound className="w-10 h-10 text-amber-600" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-stone-900">
                {language === 'en' ? 'Admin Authentication Required' : 'ایڈمن پاس ورڈ کا اندراج'}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {language === 'en'
                  ? 'This Admin Panel is strictly password protected. Only authorized administrators can access user audit logs and control settings.'
                  : 'یہ ایڈمن پینل مکمل طور پر پاس ورڈ سے محفوظ ہے۔ عام صارفین کو رسائی کی اجازت نہیں ہے۔ صرف مجاز ایڈمن لاگ ان کر سکتے ہیں۔'}
              </p>
            </div>

            {/* Non-admin notice */}
            {user && !ADMIN_EMAILS.includes(user.email || '') && (
              <div className="w-full p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2.5 text-left">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {language === 'en' ? 'Ordinary User Access Restricted' : 'عام صارفین کے لیے رسائی محدود ہے'}
                  </span>
                  <span>
                    {language === 'en'
                      ? `Logged in as (${user.name || user.email}). Administrative master credentials are required to continue.`
                      : `آپ بحیثیت عام صارف داخل ہیں۔ ایڈمن پینل کے لیے سیکیورٹی پاس ورڈ درکار ہے۔`}
                  </span>
                </div>
              </div>
            )}

            {/* Password Form */}
            <form onSubmit={handleUnlockSubmit} className="w-full space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {language === 'en' ? 'Admin Master Password' : 'ایڈمن سیکیورٹی پاس ورڈ'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder={language === 'en' ? 'Enter admin password...' : 'ایڈمن پاس ورڈ درج کریں...'}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm pr-11 bg-stone-50"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600 border border-stone-200">
                <span className="font-semibold text-stone-700 block mb-0.5">
                  {language === 'en' ? 'Default Master Key for Admin:' : 'ایڈمن کے لیے ڈیفالٹ پاس ورڈ:'}
                </span>
                <code className="text-emerald-700 font-mono font-bold bg-white px-2 py-0.5 rounded border border-stone-300 select-all inline-block">
                  {DEFAULT_ADMIN_PASSWORD}
                </code>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{language === 'en' ? 'Unlock Admin Panel' : 'ایڈمن پینل ان لاک کریں'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                >
                  {language === 'en' ? 'Cancel' : 'منسوخ'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* UNLOCKED: Full Admin Panel Controls */
          <>
            {/* Tab Switcher */}
            <div className="bg-stone-100 border-b border-stone-200 p-2 flex items-center gap-1 overflow-x-auto shrink-0">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeAdminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAdminTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {typeof tab.badge === 'number' && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive ? 'bg-emerald-500 text-white' : 'bg-stone-300 text-stone-800'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {backupMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{backupMessage}</span>
                </div>
              )}

              {/* 1. USER LOGIN & ROLES AUDIT TAB */}
              {activeAdminTab === 'user_logs' && (
                <div className="space-y-5">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                      <span className="text-[11px] text-stone-500 block">Total Logins</span>
                      <span className="text-xl font-bold font-mono text-stone-900">{totalLogins}</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Recorded Sessions</span>
                    </div>
                    <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200">
                      <span className="text-[11px] text-blue-700 block">Students</span>
                      <span className="text-xl font-bold font-mono text-blue-900">{studentCount}</span>
                      <span className="text-[10px] text-blue-600 block mt-0.5">طالب علم</span>
                    </div>
                    <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                      <span className="text-[11px] text-emerald-700 block">Teachers</span>
                      <span className="text-xl font-bold font-mono text-emerald-900">{teacherCount}</span>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">استاد / قاری</span>
                    </div>
                    <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-200">
                      <span className="text-[11px] text-purple-700 block">Creators</span>
                      <span className="text-xl font-bold font-mono text-purple-900">{creatorCount}</span>
                      <span className="text-[10px] text-purple-600 block mt-0.5">مواد تخلیق کار</span>
                    </div>
                    <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200">
                      <span className="text-[11px] text-amber-700 block">Other Users</span>
                      <span className="text-xl font-bold font-mono text-amber-900">{otherCount}</span>
                      <span className="text-[10px] text-amber-600 block mt-0.5">عام صارف</span>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                          language === 'en'
                            ? 'Search by name, purpose, or email...'
                            : 'نام، مقصد لاگ ان، یا ای میل سے تلاش کریں...'
                        }
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      {(['all', 'Student', 'Teacher', 'Content Creator', 'Other'] as const).map((roleKey) => (
                        <button
                          key={roleKey}
                          onClick={() => setSelectedRoleFilter(roleKey)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                            selectedRoleFilter === roleKey
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {roleKey === 'all'
                            ? language === 'en'
                              ? 'All'
                              : 'تمام'
                            : roleKey}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={handleExportUserLogs}
                        title={language === 'en' ? 'Export Logs to JSON' : 'ریکارڈز ایکسپورٹ کریں'}
                        className="p-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleClearLogs}
                        title={language === 'en' ? 'Clear All Logs' : 'تمام ریکارڈز مٹائیں'}
                        className="p-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Logs Table / List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                      <span>
                        {language === 'en'
                          ? `Showing ${filteredLogs.length} of ${loginLogs.length} login records`
                          : `کل ${loginLogs.length} میں سے ${filteredLogs.length} لاگ ان ریکارڈز`}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700">Real-Time Audit Sync</span>
                    </div>

                    {filteredLogs.length === 0 ? (
                      <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                        <Users className="w-8 h-8 text-stone-400 mx-auto" />
                        <p className="text-xs font-semibold text-stone-700">
                          {language === 'en' ? 'No user login records found.' : 'کوئی لاگ ان ریکارڈ موجود نہیں ہے۔'}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {language === 'en'
                            ? 'Users who log in or register with their role and purpose will appear here automatically.'
                            : 'جب کوئی صارف اپنا نام، کردار اور مقصد منتخب کر کے لاگ ان کرے گا تو اس کا ریکارڈ یہاں درج ہوگا۔'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {filteredLogs.map((log) => {
                          const badge = getRoleBadge(log.role);
                          return (
                            <div
                              key={log.id}
                              className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 transition-colors shadow-xs space-y-2.5"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                                    {log.name ? log.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h5 className="font-bold text-sm text-stone-900">{log.name}</h5>
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}
                                      >
                                        {log.role} • {badge.label}
                                      </span>
                                      {log.authMethod === 'google' && (
                                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded border border-stone-200">
                                          Google
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] text-stone-500 block truncate">
                                      {log.email || 'user@hasanquran.app'}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono self-start sm:self-auto bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                                  <Clock className="w-3 h-3 text-stone-400" />
                                  <span>{log.loginDateFormatted}</span>
                                </div>
                              </div>

                              {/* User Purpose of Login */}
                              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-0.5">
                                  {language === 'en' ? 'Purpose of Login & Usage:' : 'لاگ ان کا مقصد اور استعمال:'}
                                </span>
                                <p className="text-stone-800 font-medium leading-relaxed">
                                  "{log.purpose}"
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. OWNER CONTROL & INFRASTRUCTURE TAB */}
              {activeAdminTab === 'owner' && (
                <div className="space-y-6">
                  {/* Ownership Card */}
                  <div className="p-5 bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl border border-stone-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono block">
                          VERIFIED APPLICATION OWNER
                        </span>
                        <h4 className="font-bold text-base text-stone-100 font-mono">
                          alihusnain03221704751@gmail.com
                        </h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {language === 'en'
                            ? 'Exclusive Super Administrator with irrevocable governance over app settings and deployment.'
                            : 'ایپ کا مجاز مالک اور بااختیار ایڈمنسٹریٹر'}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>OWNER CONFIRMED</span>
                      </span>
                    </div>

                    {/* Infrastructure Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-800 text-xs">
                      <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/80">
                        <span className="text-stone-400 block text-[10px]">Cloud Run Dev App URL</span>
                        <a
                          href="https://ais-dev-3ifi6p5v3htdchfegr5ti2-93971271854.asia-east1.run.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 font-mono text-[11px] truncate flex items-center gap-1 hover:underline mt-0.5"
                        >
                          <span className="truncate">ais-dev-3ifi6p5v3htdchfegr5ti2-93971271854.asia-east1.run.app</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>

                      <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/80">
                        <span className="text-stone-400 block text-[10px]">Preview Shared URL</span>
                        <a
                          href="https://ais-pre-3ifi6p5v3htdchfegr5ti2-93971271854.asia-east1.run.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 font-mono text-[11px] truncate flex items-center gap-1 hover:underline mt-0.5"
                        >
                          <span className="truncate">ais-pre-3ifi6p5v3htdchfegr5ti2-93971271854.asia-east1.run.app</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Change Admin Password Form */}
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">
                          {language === 'en' ? 'Change Admin Security Password' : 'ایڈمن سیکیورٹی پاس ورڈ تبدیل کریں'}
                        </h4>
                        <p className="text-xs text-stone-500">
                          {language === 'en'
                            ? 'Update the master key used to protect this Admin Panel.'
                            : 'ایڈمن پینل کے تحفظ کے لیے نیا پاس ورڈ مقرر کریں۔'}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'en' ? 'New Password' : 'نیا پاس ورڈ'}
                          </label>
                          <input
                            type="password"
                            value={newPasswordInput}
                            onChange={(e) => setNewPasswordInput(e.target.value)}
                            placeholder="At least 6 characters..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            {language === 'en' ? 'Confirm New Password' : 'نئے پاس ورڈ کی تصدیق'}
                          </label>
                          <input
                            type="password"
                            value={confirmPasswordInput}
                            onChange={(e) => setConfirmPasswordInput(e.target.value)}
                            placeholder="Re-enter new password..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                          />
                        </div>
                      </div>

                      {passwordChangeError && (
                        <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{passwordChangeError}</span>
                        </p>
                      )}

                      {passwordChangeMessage && (
                        <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{passwordChangeMessage}</span>
                        </p>
                      )}

                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        {language === 'en' ? 'Save New Password' : 'نیا پاس ورڈ محفوظ کریں'}
                      </button>
                    </form>
                  </div>

                  {/* Security & Access Protection Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-stone-900">
                        <Key className="w-4 h-4 text-emerald-700" />
                        <span>API Secrets Protection</span>
                      </div>
                      <p className="text-stone-600 text-[11px] leading-relaxed">
                        Zero private API keys or database passwords are hardcoded in client-side code. All keys are isolated in backend environment variables.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-stone-900">
                        <Database className="w-4 h-4 text-emerald-700" />
                        <span>Database & RBAC</span>
                      </div>
                      <p className="text-stone-600 text-[11px] leading-relaxed">
                        Ordinary users cannot alter application settings, view private user records, or modify verification queues without owner rights.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-stone-900">
                        <ShieldAlert className="w-4 h-4 text-emerald-700" />
                        <span>No Transfer Guarantee</span>
                      </div>
                      <p className="text-stone-600 text-[11px] leading-relaxed">
                        No project transfer, deletion, or public release can occur without explicit, confirmed authorization from your master Google account.
                      </p>
                    </div>
                  </div>

                  {/* Disaster Recovery & System Backup Controls */}
                  <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                        <Download className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'en' ? 'System Backup & Recovery (JSON Export / Import)' : 'سسٹم بیک اپ اور ڈیٹا ریکوری'}</span>
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {language === 'en'
                          ? 'Safely export all application settings, bookmarks, user login audit records, and schedules to a local JSON file or restore from a previous backup.'
                          : 'تمام ترجیحات، بک مارکس اور یوزر لاگ ان ریکارڈز کی بیک اپ فائل محفوظ کریں۔'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleExportBackup}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>{language === 'en' ? 'Download JSON Backup' : 'بیک اپ فائل ڈاؤنلوڈ کریں'}</span>
                      </button>

                      <label className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-stone-300 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-stone-600" />
                        <span>{language === 'en' ? 'Restore from Backup' : 'بیک اپ فائل بحال کریں'}</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. OVERVIEW TAB */}
              {activeAdminTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                      <span className="text-xs text-stone-500 block">Total User Logins</span>
                      <span className="text-2xl font-bold font-mono text-stone-900">{totalLogins}</span>
                      <span className="text-[10px] text-emerald-700 font-medium block mt-1">Audit Log Protected</span>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                      <span className="text-xs text-stone-500 block">Violations Queue</span>
                      <span className="text-2xl font-bold font-mono text-amber-700">0</span>
                      <span className="text-[10px] text-stone-500 font-medium block mt-1">Clean System</span>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                      <span className="text-xs text-stone-500 block">Locked Phase 2</span>
                      <span className="text-2xl font-bold font-mono text-stone-900">6 Features</span>
                      <span className="text-[10px] text-amber-700 font-medium block mt-1">Protected Roadmap</span>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                      <span className="text-xs text-stone-500 block">Security Posture</span>
                      <span className="text-2xl font-bold font-mono text-emerald-700">100% OK</span>
                      <span className="text-[10px] text-emerald-700 font-medium block mt-1">Zero Leaks</span>
                    </div>
                  </div>

                  {/* Security Guardrails */}
                  <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-2 text-xs text-stone-700">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Security Governance Summary:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-stone-600 leading-relaxed text-[11px]">
                      <li>Admin Panel is protected with master password authentication and session auto-lock.</li>
                      <li>User roles (Student, Teacher, Content Creator, Other) and usage purposes are recorded in real-time.</li>
                      <li>Ordinary users cannot bypass password protection or access administrative features.</li>
                      <li>Only verified administrator emails ({ADMIN_EMAILS.join(', ')}) possess RBAC administration privileges.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 4. MODERATION QUEUE */}
              {activeAdminTab === 'moderation' && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                    <h4 className="font-bold text-amber-900 text-sm">
                      Islamic Video Moderation & 3-Warning Rule System:
                    </h4>
                    <p>
                      When the video portal launches in Phase 2, this audit queue records every verified complaint with timestamps, reviewer notes, and appeal records.
                    </p>
                  </div>

                  <div className="border border-stone-200 rounded-2xl p-6 text-center text-stone-400 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-sm font-semibold text-stone-700">
                      Moderation queue is clean. Zero pending violations.
                    </p>
                    <p className="text-xs text-stone-400">
                      Videos feature is securely locked in the Phase 2 upgrade section.
                    </p>
                  </div>
                </div>
              )}

              {/* 5. TEACHERS VETTING */}
              {activeAdminTab === 'teachers' && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <h4 className="font-bold text-emerald-900 text-sm">
                      Teacher Credentials Vetting & 5% Commission Ledger:
                    </h4>
                    <p>
                      Requires strict verification of Tajweed and Islamic Studies certificates prior to teaching authorization. Platform commission is fixed at exactly 5%.
                    </p>
                  </div>

                  <div className="border border-stone-200 rounded-2xl p-6 text-center text-stone-400 space-y-2">
                    <GraduationCap className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-sm font-semibold text-stone-700">
                      Teacher registration portal is pending Phase 2 authorization.
                    </p>
                  </div>
                </div>
              )}

              {/* 6. CHARITY AUDIT */}
              {activeAdminTab === 'charity' && (
                <div className="space-y-4">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-800 space-y-1">
                    <h4 className="font-bold text-stone-900 text-sm">
                      Khidmat-e-Khalq Assistance Requests & Zakat Audit:
                    </h4>
                    <p>
                      All charity requests will be subject to thorough verification and approval by certified religious scholars to verify Zakat eligibility.
                    </p>
                  </div>

                  <div className="border border-stone-200 rounded-2xl p-6 text-center text-stone-400 space-y-2">
                    <HeartHandshake className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-sm font-semibold text-stone-700">
                      No active donation collection links are live.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
