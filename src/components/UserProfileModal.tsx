import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Shield,
  LogOut,
  CheckCircle2,
  User as UserIcon,
  Calendar,
  Mail,
  Settings,
  Download,
  Key
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();

  if (!isOpen || !user) return null;

  const isOwner = user.email.toLowerCase() === 'alihusnain03221704751@gmail.com';

  const handleQuickBackup = () => {
    const backupData = {
      app: 'Hasan Quran',
      user: user.email,
      exportDate: new Date().toISOString(),
      preferences: user.preferences,
      quranBookmarks: localStorage.getItem('noor_quran_bookmarks') || '[]',
      mushaf16LineBookmarks: localStorage.getItem('noor_16line_bookmarks') || '[]',
      prayerAlerts: localStorage.getItem('noor_prayer_alerts') || '{}'
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `hasan_quran_profile_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden text-stone-800">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-6 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-stone-100">{user.name}</h3>
                {user.emailVerified && (
                  <span title={language === 'en' ? 'Verified Google Email' : 'تصدیق شدہ ای میل'}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1 font-mono">
                <Mail className="w-3 h-3 text-stone-500" />
                {user.email}
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Permissions / Role */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600">{t('account_role')}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                user.role === 'admin'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {isOwner
                  ? (language === 'en' ? 'App Owner (Super Admin)' : 'ایپ اونر (سپر ایڈمن)')
                  : user.role === 'admin'
                  ? (language === 'en' ? 'Administrator' : 'ایڈمنسٹریٹر')
                  : t('member')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {t('joined')}
              </span>
              <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5" />
                Google Sub ID:
              </span>
              <span className="font-mono text-[11px] text-stone-600 truncate max-w-[150px]">{user.id}</span>
            </div>
          </div>

          {/* User Preferences Summary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-emerald-600" />
              {t('preferences')}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-stone-600">
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100">
                <span className="text-stone-400 block text-[11px]">{t('active_city')}</span>
                <span className="font-medium text-stone-800">{user.preferences.city}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100">
                <span className="text-stone-400 block text-[11px]">{t('method')}</span>
                <span className="font-medium text-stone-800">{user.preferences.juristicMethod} (Hanafi)</span>
              </div>
            </div>
          </div>

          {/* Quick Data Backup Export */}
          <button
            onClick={handleQuickBackup}
            className="w-full py-2 px-3 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>{language === 'en' ? 'Backup My Settings (JSON)' : 'سیٹنگز کا بیک اپ محفوظ کریں'}</span>
          </button>

          {/* Admin shortcut if admin/owner */}
          {user.role === 'admin' && (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Shield className="w-4 h-4 text-amber-700" />
              {t('admin_panel')}
            </button>
          )}

          {/* Logout Action */}
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 hover:border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
};
