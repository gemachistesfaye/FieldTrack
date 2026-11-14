import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  showHomeIcon = true,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-slate-500 dark:text-slate-400', className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {showHomeIcon && (
          <li>
            <Link
              to="/"
              className="flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Dashboard Overview"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>
          </li>
        )}

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <React.Fragment key={idx}>
              {(showHomeIcon || idx > 0) && (
                <li className="text-slate-300 dark:text-slate-600">
                  <ChevronRight className="w-3.5 h-3.5" />
                </li>
              )}
              <li>
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
