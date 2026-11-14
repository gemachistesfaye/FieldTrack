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
      focus: 'border-slate-900 dark:border-white',
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
        bg: 'bg-slate-100 dark:bg-slate-800',
        subtleBg: 'bg-slate-50 dark:bg-slate-900',
        border: 'border-slate-300 dark:border-slate-700',
        text: 'text-slate-900 dark:text-white',
        primary: 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950',
        accent: 'text-slate-900 dark:text-white',
      },
      teal: {
        bg: 'bg-slate-100 dark:bg-slate-800',
        border: 'border-slate-300 dark:border-slate-700',
        text: 'text-slate-900 dark:text-white',
        primary: 'bg-slate-900 hover:bg-slate-800 text-white',
        accent: 'text-slate-700 dark:text-slate-300',
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        accent: 'text-blue-600',
      },
      amber: {
        bg: 'bg-slate-100 dark:bg-slate-800',
        subtleBg: 'bg-slate-50 dark:bg-slate-900',
        border: 'border-slate-300 dark:border-slate-700',
        text: 'text-slate-900 dark:text-white',
        primary: 'bg-slate-900 hover:bg-slate-800 text-white font-bold',
        accent: 'text-slate-700 dark:text-slate-300',
      },
      emerald: {
        bg: 'bg-slate-100 dark:bg-slate-800',
        border: 'border-slate-300 dark:border-slate-700',
        text: 'text-slate-900 dark:text-white',
        accent: 'text-slate-700 dark:text-slate-300',
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
