import { Database } from 'lucide-react';

type EmptyStateProps = {
  message?: string;
  className?: string;
};

export default function EmptyState({
  message = 'No data available',
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-center ${className}`}>
      <div className="p-3 rounded-full bg-overlay">
        <Database size={20} className="text-muted" />
      </div>
      <p className="text-subtle text-sm">{message}</p>
    </div>
  );
}
