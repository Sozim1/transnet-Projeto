import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, className, children, ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-2 block text-sm font-semibold text-brand-ink">{label}</span>}
    <select
      ref={ref}
      className={cn(
        'h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/15',
        className,
      )}
      {...props}
    >
      {children}
    </select>
    {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
  </label>
));

Select.displayName = 'Select';
