import { classNames } from '../utils/classNames';

interface StatusBadgeProps {
  isConnected: boolean;
}

export function StatusBadge({ isConnected }: StatusBadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] transition-colors',
        isConnected
          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
          : 'border-rose-400/30 bg-rose-400/10 text-rose-200'
      )}
    >
      <span
        className={classNames(
          'h-2 w-2 rounded-full',
          isConnected ? 'bg-emerald-300' : 'bg-rose-300'
        )}
      />
      {isConnected ? 'Connected' : 'Disconnected'}
    </span>
  );
}
