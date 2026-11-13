import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Send, MapPin, Wifi, WifiOff } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const NewReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();

  const [formData, setFormData] = useState({
    title: '',
    category: 'WATER_POINT',
    priority: 'MEDIUM',
    locationName: '',
    latitude: '',
    longitude: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCaptureLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
        },
        error => {
          alert('Could not retrieve GPS coordinates: ' + error.message);
        }
      );
    }
  };

  const handleSubmit = (asDraft: boolean) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        asDraft
          ? 'Draft saved locally in IndexedDB.'
          : isOnline
            ? 'Report submitted and synchronized successfully!'
            : 'Offline: Report safely queued in local storage. Will sync when back online.'
      );
      navigate('/reports');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          {isOnline ? (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Wifi className="w-3.5 h-3.5" /> Online: Direct Cloud Sync
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <WifiOff className="w-3.5 h-3.5" /> Offline Mode: Local Dexie Cache Active
            </span>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Field Incident Report</CardTitle>
          <CardDescription>
            Record infrastructure failure, equipment breakdown, or service interruption.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Incident Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Pump #3 Bearing Jam & Overheating"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-800"
              >
                <option value="WATER">Water Infrastructure</option>
                <option value="EQUIPMENT">Damaged Equipment</option>
                <option value="ELECTRICAL">Electrical Grid</option>
                <option value="INFRASTRUCTURE">Civil Infrastructure</option>
                <option value="SAFETY">Safety Concern</option>
                <option value="SERVICE_INTERRUPTION">Service Interruption</option>
                <option value="OTHER">Other Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Priority Level <span className="text-rose-500">*</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-800"
              >
                <option value="LOW">Low (Routine maintenance)</option>
                <option value="MEDIUM">Medium (Degraded output)</option>
                <option value="HIGH">High (Major stoppage)</option>
                <option value="CRITICAL">Critical (Immediate hazard)</option>
              </select>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Location Name / Landmark <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  placeholder="e.g. Kibera Sector 3 Borehole Well"
                  className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCaptureLocation}
                  leftIcon={<MapPin className="w-4 h-4 text-teal-600" />}
                >
                  GPS
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Latitude (e.g. -1.312000)"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-600"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Longitude (e.g. 36.784000)"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide symptoms, damage details, safety notes, or parts needed..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit(true)}
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save as Draft
            </Button>

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={() => navigate('/reports')}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleSubmit(false)}
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit Incident
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
