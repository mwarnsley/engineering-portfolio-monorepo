import type { ChatPanelConfig, ChatUserId } from '../types/chat';
import { classNames } from '../utils/classNames';

interface PanelHeaderProps {
  config: ChatPanelConfig;
  isConnected: boolean;
  typingUsers: ChatUserId[];
}

export function PanelHeader({
  config,
  isConnected,
  typingUsers,
}: PanelHeaderProps) {
  const otherUserTyping = typingUsers.includes(config.userId === 'user-a' ? 'user-b' : 'user-a');

  return (
    <header className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
      <div>
        <p className={classNames('text-xs font-semibold uppercase tracking-[0.28em]', config.accentClassName)}>
          {config.title}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Live conversation</h2>
        <p className="mt-2 text-sm text-slate-400">
          {otherUserTyping ? 'The other user is typing...' : 'Ready to send a real-time message.'}
        </p>
      </div>
      <span
        className={classNames(
          'rounded-full px-3 py-1 text-xs font-medium',
          isConnected ? 'bg-emerald-400/10 text-emerald-200' : 'bg-rose-400/10 text-rose-200'
        )}
      >
        {isConnected ? 'Online' : 'Offline'}
      </span>
    </header>
  );
}
