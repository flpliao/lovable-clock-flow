interface EmptyStateProps {
  data: unknown[];
  message: string;
  className?: string;
}

export function EmptyState({ data, message, className }: EmptyStateProps) {
  if (data.length > 0) return null;

  return (
    <div className={`text-center py-12 text-slate-600 ${className || ''}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
