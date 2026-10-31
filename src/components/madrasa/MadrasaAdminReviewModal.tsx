import React, { useState } from 'react';
import { Madrasa } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMadrasas } from '../../context/MadrasaContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  Building,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Eye,
  MapPin,
  Phone
} from 'lucide-react';

interface MadrasaAdminReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMadrasa: (m: Madrasa) => void;
  onEditMadrasa: (m: Madrasa) => void;
  onAddNew: () => void;
}

export const MadrasaAdminReviewModal: React.FC<MadrasaAdminReviewModalProps> = ({
  isOpen,
  onClose,
  onSelectMadrasa,
  onEditMadrasa,
  onAddNew
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const {
    madrasas,
    approvedMadrasas,
    pendingMadrasas,
    rejectedMadrasas,
    approveMadrasa,
    rejectMadrasa,
    deleteMadrasa,
    resetToDefaults,
    exportMadrasasJson,
    importMadrasasJson
  } = useMadrasas();

  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string>('');

  if (!isOpen) return null;

  const currentList =
    activeFilter === 'pending'
      ? pendingMadrasas
      : activeFilter === 'approved'
      ? approvedMadrasas
      : activeFilter === 'rejected'
      ? rejectedMadrasas
      : madrasas;

  const handleApprove = (id: string, name: string) => {
    approveMadrasa(id);
    setActionMessage(`Approved "${name}" successfully. It is now publicly listed.`);
    setTimeout(() => setActionMessage(''), 3500);
  };

  const handleConfirmReject = (id: string, name: string) => {
    rejectMadrasa(id, rejectReason || 'Document verification required.');
    setRejectingId(null);
    setRejectReason('');
    setActionMessage(`Rejected "${name}". Feedback recorded.`);
    setTimeout(() => setActionMessage(''), 3500);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}" from the system?`)) {
      deleteMadrasa(id);
      setActionMessage(`Deleted "${name}".`);
      setTimeout(() => setActionMessage(''), 3500);
    }
  };

  const handleExport = () => {
    const jsonStr = exportMadrasasJson();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `hasan_quran_madrasas_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setActionMessage('Madrasa directory backup downloaded.');
    setTimeout(() => setActionMessage(''), 3500);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const ok = importMadrasasJson(text);
      if (ok) {
        setActionMessage('Madrasa records successfully restored from backup.');
      } else {
        setActionMessage('Failed to import: Invalid JSON file.');
      }
      setTimeout(() => setActionMessage(''), 3500);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden text-stone-800 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-amber-300">
                  Madrasa Governance & Approval Portal
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Review community submissions, edit institutional records, and manage approvals.
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

        {/* Action / Success Banner */}
        {actionMessage && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 px-6">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* KPI Row & Tool Bar */}
        <div className="bg-stone-50 border-b border-stone-200 p-4 px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Review ({pendingMadrasas.length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('approved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'approved'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved ({approvedMadrasas.length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('rejected')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'rejected'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Rejected ({rejectedMadrasas.length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>All ({madrasas.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAddNew}
              className="px-3 py-1.5 rounded-xl bg-[#264a39] hover:bg-[#1e392c] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Madrasa</span>
            </button>

            <button
              onClick={handleExport}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-medium flex items-center gap-1 transition-colors"
              title="Export all madrasas as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <label
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="Import madrasas from JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (confirm('Reset to initial verified Madrasa seed data?')) {
                  resetToDefaults();
                  setActionMessage('Reset to default Madrasas.');
                }
              }}
              className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-700 border border-stone-300 transition-colors"
              title="Reset to default seed data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* List of Madrasas under selected tab */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {currentList.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <Building className="w-10 h-10 mx-auto text-stone-300" />
              <p className="font-semibold text-sm text-stone-600">
                No madrasa records found in this view.
              </p>
              <p className="text-xs">
                {activeFilter === 'pending'
                  ? 'All submitted madrasas have been reviewed and approved.'
                  : 'Try selecting a different filter above.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentList.map((m) => (
                <div
                  key={m.id}
                  className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-[#264a39]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-stone-900 truncate">
                        {m.name}
                      </span>
                      {m.nameUrdu && (
                        <span className="font-urdu text-sm text-[#264a39] truncate" dir="rtl">
                          {m.nameUrdu}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'pending'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {m.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {m.wiffaqAffiliation}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{m.city} ({m.address})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{m.contactNumber}</span>
                      </span>
                      <span>
                        Students: <strong className="text-stone-900">{m.totalStudents}</strong>
                      </span>
                      <span>
                        Programs: <strong className="text-stone-900">{m.programs.length}</strong>
                      </span>
                    </div>

                    {m.submittedBy && (
                      <p className="text-[11px] text-stone-500">
                        Submitted by: <strong>{m.submittedBy.name}</strong> ({m.submittedBy.email}) on{' '}
                        {new Date(m.submittedBy.timestamp).toLocaleDateString()}
                      </p>
                    )}

                    {m.rejectionReason && (
                      <p className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                        <strong>Reason:</strong> {m.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectMadrasa(m)}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    {m.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(m.id, m.name)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {m.status !== 'rejected' && (
                      <button
                        onClick={() => setRejectingId(m.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      onClick={() => onEditMadrasa(m)}
                      className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(m.id, m.name)}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inline Rejection Dialog */}
          {rejectingId && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 border border-stone-200 shadow-xl">
                <h4 className="font-bold text-sm text-stone-900">
                  Provide Reason for Rejection
                </h4>
                <p className="text-xs text-stone-600">
                  Explain why this listing is being rejected or what documents are missing:
                </p>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Official board affiliation certificate required..."
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setRejectingId(null);
                      setRejectReason('');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const item = madrasas.find((x) => x.id === rejectingId);
                      if (item) handleConfirmReject(item.id, item.name);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Confirm Rejection
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
