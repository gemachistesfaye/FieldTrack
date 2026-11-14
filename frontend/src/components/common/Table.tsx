import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

export const Table: React.FC<TableProps> = ({ className, wrapperClassName, children, ...props }) => {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs',
        wrapperClassName
      )}
    >
      <table className={cn('w-full text-left border-collapse text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <thead className={cn('bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800', className)} {...props}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <tbody className={cn('divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900', className)} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <tr
      className={cn('hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors group cursor-default', className)}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <td className={cn('px-4 py-3.5 text-sm text-slate-700 dark:text-slate-200 align-middle', className)} {...props}>
      {children}
    </td>
  );
};

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  totalPages,
  totalItems,
  onPageChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400',
        className
      )}
    >
      <div>
        {totalItems !== undefined ? (
          <span>
            Showing page <span className="font-semibold text-slate-900 dark:text-white">{page}</span> of{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{totalPages || 1}</span> ({totalItems}{' '}
            items)
          </span>
        ) : (
          <span>
            Page <span className="font-semibold text-slate-900 dark:text-white">{page}</span> of{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{totalPages || 1}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="xs"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="xs"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
