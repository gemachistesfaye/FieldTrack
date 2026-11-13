import React from 'react';
import {
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  Radio,
  User,
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface LiveDispatchTrackingProps {
  reportTitle: string;
  category: string;
  status: string;
  originName?: string;
  destinationName: string;
  technician: {
    name: string;
    role: string;
    rating?: string;
    phone?: string;
  };
  timeline: {
    reportedAt: string;
    dispatchedAt?: string;
    estimatedArrival?: string;
  };
  onCallTechnician?: () => void;
  onMessageTechnician?: () => void;
  onTrackLive?: () => void;
  className?: string;
}

/**
 * Real-Time Field Dispatch & Route Tracking Card
 * Inspired by 6030449798499995434_121.jpg (Screen 8: "Track Live / Delivery Route")
 * Displays route points, technician quick-call/chat card, milestone timeline, and live map action.
 */
export const LiveDispatchTrackingCard: React.FC<LiveDispatchTrackingProps> = ({
  reportTitle,
  category,
  status,
  originName = 'Sector 3 Central Depot',
  destinationName,
  technician,
  timeline,
  onCallTechnician,
  onMessageTechnician,
  onTrackLive,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4 max-w-md mx-auto',
        className
      )}
    >
      {/* Route Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {category} Dispatch Mission
          </span>
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{reportTitle}</h4>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
          {status}
        </span>
      </div>

      {/* Visual Route Points */}
      <div className="space-y-3 relative pl-6 border-l-2 border-dashed border-amber-300 ml-3">
        <div className="relative">
          <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-200" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dispatch Origin</p>
          <p className="text-xs font-bold text-slate-800">{originName}</p>
        </div>

        <div className="relative pt-2">
          <div className="absolute -left-[31px] top-2.5 w-4 h-4 rounded-full bg-amber-400 border-2 border-white ring-2 ring-amber-300" />
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Incident Location</p>
          <p className="text-xs font-bold text-slate-900">{destinationName}</p>
        </div>
      </div>

      {/* Assigned Technician Profile Box */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs shrink-0">
            <User className="w-5 h-5 text-slate-600" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h5 className="text-xs font-bold text-slate-900 truncate">{technician.name}</h5>
            <p className="text-xs text-slate-500">{technician.role}</p>
            {technician.rating && (
              <p className="text-xs text-amber-700 font-bold">★ {technician.rating}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onCallTechnician && (
            <button
              type="button"
              onClick={onCallTechnician}
              title="Call Technician"
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              <Phone className="w-4 h-4" />
            </button>
          )}

          {onMessageTechnician && (
            <button
              type="button"
              onClick={onMessageTechnician}
              title="Message Field Specialist"
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stepper Milestones */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
            Reported
          </span>
          <span className="font-semibold text-slate-800">{timeline.reportedAt}</span>
        </div>

        {timeline.dispatchedAt && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
              Dispatched
            </span>
            <span className="font-semibold text-slate-800">{timeline.dispatchedAt}</span>
          </div>
        )}

        {timeline.estimatedArrival && (
          <div className="flex items-center justify-between text-amber-800 font-bold pt-1 border-t border-slate-200/60">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              Estimated On-Site
            </span>
            <span>{timeline.estimatedArrival}</span>
          </div>
        )}
      </div>

      {/* Action Button: Track Live on Field Map */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={onTrackLive}
        className="w-full justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 shadow-xs"
        leftIcon={<Radio className="w-4 h-4 text-amber-400" />}
      >
        Track Live on Field Map
      </Button>
    </div>
  );
};
