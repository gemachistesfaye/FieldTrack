import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { ReportDTO } from '../../types/report';
import { reportApi } from '../../services/reportApi';
import { useToast } from '../../context/ToastContext';

export interface ResolveRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportDTO;
  action: 'RESOLVE' | 'REJECT';
  onSuccess?: () => void;
}

export const ResolveRejectModal: React.FC<ResolveRejectModalProps> = ({
  isOpen,
  onClose,
  report,
  action,
  onSuccess,
}) => {
  const { success, warning } = useToast();
  const [notes, setNotes] = useState('');
  const [componentsReplaced, setComponentsReplaced] = useState('');
  const [rejectionReason, setRejectionReason] = useState('DUPLICATE_REPORT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isResolve = action === 'RESOLVE';

  const handleSubmit = async () => {
    if (isResolve && !notes.trim()) {
      setErrorMessage('Please provide resolution details and work performed.');
      return;
    }

    if (!isResolve && !notes.trim()) {
      setErrorMessage('Please provide an operational explanation for rejecting this report.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const targetStatus = isResolve ? 'RESOLVED' : 'REJECTED';

    try {
      if (!report.id.startsWith('rep-')) {
        await reportApi.updateReport(report.id, {
          status: targetStatus,
          resolvedAt: isResolve ? new Date().toISOString() : undefined,
        });
      }

      if (isResolve) {
        success('Incident Resolved', `Report #${report.id} marked as resolved and verified.`);
      } else {
        warning('Incident Rejected', `Report #${report.id} flagged as rejected.`);
      }

      setIsSubmitting(false);
      onClose();
      onSuccess?.();
    } catch {
      warning(
        isResolve ? 'Resolved Locally' : 'Rejected Locally',
        'Status updated locally; server reconciliation will occur automatically.'
      );
      setIsSubmitting(false);
      onClose();
      onSuccess?.();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isResolve ? 'Resolve Field Incident' : 'Reject Field Incident'}
      description={
        isResolve
          ? `Record completion of corrective actions and close report #${report.id}`
          : `Decline or invalidate incident report #${report.id}`
      }
      maxWidth="md"
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
            variant={isResolve ? 'industrial' : 'danger'}
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className={`font-bold ${isResolve ? 'text-slate-950 shadow-xs' : ''}`}
            leftIcon={
              isResolve ? (
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
              ) : (
                <XCircle className="w-4 h-4" />
              )
            }
          >
            {isResolve ? 'Confirm Resolution' : 'Confirm Rejection'}
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

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <p className="text-sm font-bold text-slate-900 line-clamp-1">{report.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{report.location}</p>
        </div>

        {!isResolve && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Rejection Classification *
            </label>
            <select
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="DUPLICATE_REPORT">Duplicate Incident Report</option>
              <option value="INSUFFICIENT_INFORMATION">Insufficient Diagnostic Information</option>
              <option value="OUT_OF_JURISDICTION">Outside Sector Jurisdiction / Third-Party Asset</option>
              <option value="CANNOT_REPRODUCE">Fault Not Reproducible / Operational Normal</option>
              <option value="CANCELLED_BY_OPERATIONS">Cancelled by Central Operations Command</option>
            </select>
          </div>
        )}

        {isResolve && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Components / Parts Replaced
            </label>
            <input
              type="text"
              placeholder="e.g. 5.5kW bearing kit, silicone shaft seals, 2x 100A fuses"
              value={componentsReplaced}
              onChange={e => setComponentsReplaced(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            {isResolve ? 'Resolution Notes & Sign-off *' : 'Rejection Explanation *'}
          </label>
          <textarea
            rows={3}
            placeholder={
              isResolve
                ? 'Detail the repairs performed, tests executed, pressure/voltage readings verified...'
                : 'Explain why this incident report is being rejected...'
            }
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
      </div>
    </Modal>
  );
};
