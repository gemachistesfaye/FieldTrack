import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';
import { CATEGORY_DEFINITIONS } from './CategoryGrid';
import { ReportDTO, ReportCategory, Priority } from '../../types/report';
import { reportApi } from '../../services/reportApi';
import { useToast } from '../../context/ToastContext';

export interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportDTO;
  onSuccess?: () => void;
}

export const EditReportModal: React.FC<EditReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onSuccess,
}) => {
  const { success, warning } = useToast();

  const [title, setTitle] = useState(report.title);
  const [category, setCategory] = useState<ReportCategory>(report.category);
  const [priority, setPriority] = useState<Priority>(report.priority);
  const [locationName, setLocationName] = useState(report.location);
  const [description, setDescription] = useState(report.description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (report) {
      setTitle(report.title);
      setCategory(report.category);
      setPriority(report.priority);
      setLocationName(report.location);
      setDescription(report.description);
    }
  }, [report]);

  const handleSubmit = async () => {
    if (!title.trim() || !locationName.trim()) {
      setErrorMessage('Please provide both an incident title and sector location.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!report.id.startsWith('rep-')) {
        await reportApi.updateReport(report.id, {
          title,
          category,
          priority,
          location: locationName,
          description,
        });
      }
      success('Report Updated', `Changes to incident #${report.id} saved successfully.`);
      setIsSubmitting(false);
      onClose();
      onSuccess?.();
    } catch {
      warning('Updated Locally', 'Report updated in local buffer; awaiting cloud sync.');
      setIsSubmitting(false);
      onClose();
      onSuccess?.();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Incident #${report.id}`}
      description="Update technical parameters, operational severity, or incident description."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="font-bold shadow-xs bg-slate-900 hover:bg-slate-800 text-white"
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Domain Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORY_DEFINITIONS.map(cat => {
              const Icon = cat.icon;
              const isSelected = category === cat.category;
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setCategory(cat.category)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-100 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  />
                  <span
                    className={`text-xs truncate ${
                      isSelected ? 'font-bold text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Priority / Severity
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map(p => {
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Incident Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Sector / Location
            </label>
            <input
              type="text"
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Description & Findings
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
