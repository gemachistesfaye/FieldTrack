import React from 'react';
import { MapPin, Navigation, Compass, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface LocationCardProps {
  locationName?: string;
  coordinates?: { latitude: number; longitude: number };
  onAllowLocation: () => void;
  onManualLocation?: () => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Geolocation & Landmark Picker Card
 * Direct realization of 6030449798499995438_121.jpg (Screen 3: "Find Properties Near You")
 * Provides an interactive radar map graphic, GPS coordinate tagger, and dual-action triggers.
 */
export const LocationCard: React.FC<LocationCardProps> = ({
  locationName,
  coordinates,
  onAllowLocation,
  onManualLocation,
  isLoading = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6 max-w-md mx-auto text-center',
        className
      )}
    >
      {/* Top Map Pin Illustration / Header */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white shadow-2xs">
          <MapPin className="w-8 h-8 text-slate-900 dark:text-white" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Tag Incident Location
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Allow location access to automatically attach precise GPS coordinates to this field
            report.
          </p>
        </div>
      </div>

      {/* Radar Map Graphic with Central Location Pin */}
      <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/90 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700 overflow-hidden flex items-center justify-center">
        {/* Subtle Map Grid lines */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Pulsing Radar Ring */}
        <div className="absolute w-28 h-28 rounded-full bg-slate-900/10 dark:bg-white/10 animate-ping" />
        <div className="absolute w-20 h-20 rounded-full bg-slate-900/15 dark:bg-white/20 border border-slate-900/30 dark:border-white/40 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        {/* Floating Compass / Re-center Button in Bottom-Right */}
        <button
          type="button"
          onClick={onAllowLocation}
          title="Re-center GPS"
          className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Current Coordinates Tag */}
        {coordinates && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>
              {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
            </span>
          </div>
        )}
      </div>

      {locationName && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
          Landmark: <span className="font-bold text-slate-900 dark:text-white">{locationName}</span>
        </div>
      )}

      {/* Action Buttons matching the reference */}
      <div className="space-y-2.5 pt-1">
        <Button
          type="button"
          variant="forest"
          size="lg"
          className="w-full justify-center rounded-2xl shadow-sm text-sm font-semibold"
          onClick={onAllowLocation}
          isLoading={isLoading}
          leftIcon={<Navigation className="w-4 h-4" />}
        >
          Allow Location
        </Button>

        {onManualLocation && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full justify-center rounded-2xl border-slate-200 text-slate-800 text-sm font-semibold hover:bg-slate-50"
            onClick={onManualLocation}
          >
            Choose Location Manually
          </Button>
        )}
      </div>
    </div>
  );
};
