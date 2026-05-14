import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-2 block text-sm font-semibold text-brand-ink">{label}</span>}
    <textarea
      ref={ref}
      className={cn(
        'min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/15',
        className,
      )}
      {...props}
    />
    {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
  </label>
));

Textarea.displayName = 'Textarea';
