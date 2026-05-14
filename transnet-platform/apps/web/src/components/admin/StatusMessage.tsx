import { cn } from '@/utils/cn';

export function StatusMessage({ type, message }: { type: 'success' | 'error'; message?: string }) {
  if (!message) return null;
  return (
    <p
      className={cn(
        'rounded-md px-4 py-3 text-sm font-semibold',
        type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
      )}
    >
      {message}
    </p>
  );
}
