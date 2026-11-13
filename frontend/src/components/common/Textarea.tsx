import React, { TextareaHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showCount = false,
      maxLength,
      id,
      required,
      disabled,
      onChange,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const [charLength, setCharLength] = useState(
      typeof value === 'string'
        ? value.length
        : typeof defaultValue === 'string'
          ? defaultValue.length
          : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharLength(e.target.value.length);
      if (onChange) onChange(e);
    };

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              {label}
              {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}

          {showCount && maxLength && (
            <span className="text-xs text-slate-500 font-medium">
              {charLength}/{maxLength}
            </span>
          )}
        </div>

        <div className="relative rounded-lg shadow-2xs">
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            maxLength={maxLength}
            onChange={handleChange}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              'w-full text-sm rounded-lg border bg-white text-slate-900 placeholder-slate-400 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent',
              'p-3 min-h-[96px] resize-y',
              error
                ? 'border-rose-300 focus:ring-rose-500 text-rose-900'
                : 'border-slate-300 hover:border-slate-400',
              disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200',
              className
            )}
            {...props}
          />

          {error && (
            <div className="absolute top-3 right-3 pointer-events-none text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
