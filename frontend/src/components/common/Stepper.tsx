import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StepItem {
  id: string | number;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

/**
 * Multi-Step Progress Stepper
 * Inspired by 6030449798499995434_121.jpg (Screen 5: "Book Equipment" - Steps 1, 2, 3)
 * Displays numbered/checkmarked step circles with active amber/industrial highlight.
 */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn('w-full py-2', className)}>
      <div className="flex items-center justify-between relative">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isUpcoming = idx > currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator circle and label */}
              <div
                onClick={() => isCompleted && onStepClick && onStepClick(idx)}
                className={cn(
                  'flex items-center gap-2.5 z-10 transition-colors',
                  isCompleted && onStepClick ? 'cursor-pointer' : 'cursor-default'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs',
                    isCurrent && 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 font-extrabold',
                    isCompleted && 'bg-emerald-600 text-white',
                    isUpcoming && 'bg-slate-100 text-slate-400 border border-slate-200'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>

                <div className="hidden sm:block text-left">
                  <p
                    className={cn(
                      'text-xs font-bold leading-tight',
                      isCurrent && 'text-slate-900',
                      isCompleted && 'text-slate-700',
                      isUpcoming && 'text-slate-400'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-slate-500 leading-tight">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-3 sm:mx-4 transition-colors',
                    idx < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
