export function Loading({ label = 'Carregando' }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white">
      <div className="flex items-center gap-3 text-sm font-semibold text-brand-muted">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
        {label}
      </div>
    </div>
  );
}
