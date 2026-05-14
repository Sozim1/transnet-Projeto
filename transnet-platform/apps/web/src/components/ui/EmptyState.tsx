import { PackageSearch } from 'lucide-react';
import { Button } from './Button';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <PackageSearch className="mx-auto h-10 w-10 text-brand-blue" />
      <h3 className="mt-4 text-lg font-semibold text-brand-ink">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-xl text-sm text-brand-muted">{description}</p>}
      {actionHref && actionLabel && (
        <Button href={actionHref} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
