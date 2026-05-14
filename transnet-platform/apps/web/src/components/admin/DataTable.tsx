import { EmptyState } from '@/components/ui/EmptyState';

type DataTableColumn<T> = {
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  emptyTitle?: string;
};

export function DataTable<T>({ data, columns, emptyTitle = 'Nenhum registro encontrado' }: DataTableProps<T>) {
  if (!data.length) return <EmptyState title={emptyTitle} />;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-brand-muted">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.header} className={`px-4 py-3 text-sm text-brand-ink ${column.className ?? ''}`}>
                    {column.cell(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
