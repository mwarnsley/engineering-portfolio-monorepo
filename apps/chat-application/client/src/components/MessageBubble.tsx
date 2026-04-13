import type { ChatMessage, ChatUserId } from '../types/chat';
import { classNames } from '../utils/classNames';
import { formatTimestamp } from '../utils/time';

interface MessageBubbleProps {
  message: ChatMessage;
  perspectiveUserId: ChatUserId;
}

export function MessageBubble({
  message,
  perspectiveUserId,
}: MessageBubbleProps) {
  const isOwnMessage = message.authorId === perspectiveUserId;

  return (
    <article
      className={classNames(
        'max-w-[85%] rounded-3xl px-4 py-3 shadow-sm transition-transform duration-200',
        isOwnMessage
          ? 'ml-auto rounded-br-md bg-white text-slate-950'
          : 'mr-auto rounded-bl-md bg-slate-800/90 text-slate-100'
      )}
      data-testid={`message-${message.authorId}`}
    >
      <div className="mb-1 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-current/75">
          {message.authorLabel}
        </p>
        <time className="text-xs text-current/70">{formatTimestamp(message.timestamp)}</time>
      </div>
      <p className="text-sm leading-6">{message.body}</p>
    </article>
  );
}
