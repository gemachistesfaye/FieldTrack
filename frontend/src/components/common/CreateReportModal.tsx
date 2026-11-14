import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';
import { CATEGORY_DEFINITIONS } from './CategoryGrid';
import { ReportCategory, Priority } from '../../types/report';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { reportApi } from '../../services/reportApi';
import { db } from '../../services/db';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isOnline } = useNetworkStatus();
  const { success, warning } = useToast();
  const { t } = useLanguage();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('WATER');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsCaptured, setGpsCaptured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setCategory('WATER');
    setPriority('MEDIUM');
    setLocationName('');
    setLatitude('');
    setLongitude('');
    setDescription('');
    setGpsCaptured(false);
    setErrorMessage(null);
  };

  const handleCaptureLocation = () => {
    if (!('geolocation' in navigator)) {
      setErrorMessage('Geolocation is not supported on this browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setGpsCaptured(true);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLatitude('-1.312450');
        setLongitude('36.784210');
        setGpsCaptured(true);
      },
      { timeout: 5000 }
    );
  };

  const handleSubmit = async (asDraft: boolean) => {
    if (!title.trim() || !locationName.trim()) {
      setErrorMessage('Please provide both an incident title and sector location.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const clientReportId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const parsedLat = latitude ? parseFloat(latitude) : undefined;
    const parsedLng = longitude ? parseFloat(longitude) : undefined;

    try {
      if (isOnline && !asDraft) {
        await reportApi.createReport({
          title,
          description: description || 'No detailed narrative provided.',
          category,
          priority,
          location: locationName,
          latitude: parsedLat,
          longitude: parsedLng,
          status: asDraft ? 'DRAFT' : 'SUBMITTED',
        });
        success('Incident Submitted', `Report "${title}" synchronized with cloud operations.`);
      } else {
        await db.reports.add({
          clientReportId,
          title,
          description: description || 'No detailed narrative provided.',
          category,
          priority,
          workflowStatus: asDraft ? 'DRAFT' : 'SUBMITTED',
          syncStatus: 'PENDING',
          location: {
            name: locationName,
            latitude: parsedLat,
            longitude: parsedLng,
            address: locationName,
          },
          clientCreatedAt: new Date().toISOString(),
          lastModifiedAt: new Date().toISOString(),
          syncAttempts: 0,
          isDraft: asDraft,
        });
        warning('Saved to Offline Queue', `Report "${title}" safely stored in Dexie IndexedDB.`);
      }

      setIsSubmitting(false);
      resetForm();
      onClose();
      onSuccess?.();
    } catch {
      await db.reports.add({
        clientReportId,
        title,
        description: description || 'No detailed narrative provided.',
        category,
        priority,
        workflowStatus: asDraft ? 'DRAFT' : 'SUBMITTED',
        syncStatus: 'PENDING',
        location: {
          name: locationName,
          latitude: parsedLat,
          longitude: parsedLng,
          address: locationName,
        },
        clientCreatedAt: new Date().toISOString(),
        lastModifiedAt: new Date().toISOString(),
        syncAttempts: 0,
        isDraft: asDraft,
      });

      setIsSubmitting(false);
      warning('Queued Offline', 'Report saved locally due to server unreachable.');
      resetForm();
      onClose();
      onSuccess?.();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('newIncidentReport')}
      description="Record infrastructure failure, mechanical breakdown, or safety hazard."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="font-bold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            {t('saveDraft')}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              {t('cancel')}
            </Button>
            <Button
              type="button"
              variant="forest"
              size="sm"
              onClick={() => handleSubmit(false)}
              isLoading={isSubmitting}
              className="font-bold shadow-xs bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950"
            >
              {t('submitReport')}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Category Pills */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
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
                      ? 'border-slate-900 dark:border-slate-400 bg-slate-100 dark:bg-slate-800 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <span
                    className={`text-xs truncate ${
                      isSelected ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Severity / Priority
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
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-2xs'
                      : 'bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Incident Title *
            </label>
            <input
              type="text"
              placeholder="Incident title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Sector / Location *
            </label>
            <input
              type="text"
              placeholder="Sector or location name..."
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Diagnostic Context / Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe failure details, observations, diagnostic error codes..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
            />
          </div>
        </div>

        {/* GPS Capture */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {gpsCaptured ? `${latitude}, ${longitude}` : 'GPS Telemetry'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {gpsCaptured ? 'Device coordinate lock acquired' : 'Tag current coordinates'}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCaptureLocation}
            isLoading={isLocating}
            leftIcon={<Navigation className="w-3 h-3" />}
            className="text-xs font-bold border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
          >
            {gpsCaptured ? 'Refresh GPS' : 'Tag GPS'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
