/**
 * FieldSync Design System Tokens
 * Grounded in the visual language of professional industrial field ops and maintenance tools.
 * Clean light-theme surfaces, deep slate typography, restrained teal/cyan/blue accents.
 */

export const tokens = {
  colors: {
    // Surface & Backgrounds
    surface: {
      canvas: 'bg-slate-50',
      card: 'bg-white',
      subtle: 'bg-slate-50/80',
      muted: 'bg-slate-100',
      hover: 'hover:bg-slate-50',
      active: 'bg-slate-100',
      overlay: 'bg-slate-900/40 backdrop-blur-xs',
    },
    // Borders & Dividers
    border: {
      subtle: 'border-slate-100',
      default: 'border-slate-200/80',
      strong: 'border-slate-300',
      focus: 'border-amber-500',
    },
    // Typography Colors
    text: {
      primary: 'text-slate-900',
      secondary: 'text-slate-700',
      muted: 'text-slate-500',
      subtle: 'text-slate-400',
      inverted: 'text-white',
    },
    // Brand & Intent Accents
    brand: {
      forest: {
        bg: 'bg-emerald-50',
        subtleBg: 'bg-[#EAF3EE]',
        border: 'border-[#1B4332]/20',
        text: 'text-[#1B4332]',
        primary: 'bg-[#1B4332] hover:bg-[#143527] text-white',
        accent: 'text-[#1B4332]',
      },
      teal: {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        text: 'text-teal-700',
        primary: 'bg-teal-600 hover:bg-teal-700 text-white',
        accent: 'text-teal-600',
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        accent: 'text-blue-600',
      },
      amber: {
        bg: 'bg-amber-50',
        subtleBg: 'bg-amber-100/60',
        border: 'border-amber-300',
        text: 'text-amber-900',
        primary: 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold',
        accent: 'text-amber-500',
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        accent: 'text-emerald-600',
      },
      rose: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        accent: 'text-rose-600',
      },
    },
  },
  radius: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  },
  shadow: {
    subtle: 'shadow-2xs',
    card: 'shadow-xs hover:shadow-sm transition-shadow',
    dropdown: 'shadow-lg border border-slate-200/80',
    modal: 'shadow-2xl border border-slate-200/60',
  },
  spacing: {
    pagePadding: 'p-4 sm:p-6 lg:p-8',
    cardPadding: 'p-5 sm:p-6',
    gap: 'gap-4 sm:gap-6',
  },
};
