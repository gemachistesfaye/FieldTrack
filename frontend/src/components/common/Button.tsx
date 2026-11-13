import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'forest' | 'industrial' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-amber-400 text-slate-950 font-bold hover:bg-amber-500 focus:ring-amber-400 shadow-xs border border-transparent',
      secondary:
        'bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 focus:ring-slate-300 border border-slate-200 shadow-2xs',
      forest:
        'bg-slate-900 text-white font-semibold hover:bg-slate-800 focus:ring-slate-900 shadow-xs border border-transparent',
      industrial:
        'bg-amber-400 text-slate-950 font-bold hover:bg-amber-500 focus:ring-amber-400 shadow-xs border border-transparent',
      outline:
        'border border-slate-200/80 bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:text-slate-900 focus:ring-amber-400 shadow-2xs',
      ghost:
        'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300 font-medium',
      danger:
        'bg-rose-600 text-white font-semibold hover:bg-rose-700 focus:ring-rose-600 shadow-xs border border-transparent',
      success:
        'bg-slate-900 text-white font-semibold hover:bg-slate-800 focus:ring-slate-900 shadow-xs border border-transparent',
    };

    const sizes = {
      xs: 'h-7 px-2.5 text-xs gap-1 rounded-md',
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-sm gap-2',
      lg: 'h-11 px-6 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
