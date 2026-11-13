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
        'bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5 max-w-md mx-auto',
        className
      )}
    >
      {/* Route Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {category} Dispatch Mission
          </span>
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{reportTitle}</h4>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {status}
        </span>
      </div>

      {/* Visual Route Points */}
      <div className="space-y-3 relative pl-6 border-l-2 border-dashed border-amber-300 ml-3">
        <div className="relative">
          <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-200" />
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Dispatch Origin</p>
          <p className="text-xs font-bold text-slate-800">{originName}</p>
        </div>

        <div className="relative pt-2">
          <div className="absolute -left-[31px] top-2.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white ring-2 ring-amber-300 animate-pulse" />
          <p className="text-[11px] font-semibold text-amber-600 uppercase">Incident Location</p>
          <p className="text-xs font-bold text-slate-900">{destinationName}</p>
        </div>
      </div>

      {/* Assigned Technician Profile Box matching Screen 8 */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs shrink-0">
            <User className="w-6 h-6 text-slate-600" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h5 className="text-xs font-bold text-slate-900 truncate">{technician.name}</h5>
            <p className="text-[11px] text-slate-500">{technician.role}</p>
            {technician.rating && (
              <p className="text-[11px] text-amber-600 font-bold">★ {technician.rating}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onCallTechnician && (
            <button
              type="button"
              onClick={onCallTechnician}
              title="Call Technician"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Phone className="w-4 h-4" />
            </button>
          )}

          {onMessageTechnician && (
            <button
              type="button"
              onClick={onMessageTechnician}
              title="Message Field Specialist"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stepper Milestones */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Reported
          </span>
          <span className="font-semibold text-slate-800">{timeline.reportedAt}</span>
        </div>

        {timeline.dispatchedAt && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Dispatched
            </span>
            <span className="font-semibold text-slate-800">{timeline.dispatchedAt}</span>
          </div>
        )}

        {timeline.estimatedArrival && (
          <div className="flex items-center justify-between text-amber-700 font-bold pt-1 border-t border-slate-200/60">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
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
        className="w-full justify-center rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 shadow-sm"
        leftIcon={<Radio className="w-4 h-4 text-amber-400 animate-pulse" />}
      >
        Track Live on Field Map
      </Button>
    </div>
  );
};
