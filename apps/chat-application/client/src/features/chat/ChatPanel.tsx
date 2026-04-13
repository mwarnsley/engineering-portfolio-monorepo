import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from '../../components/MessageBubble';
import { PanelHeader } from '../../components/PanelHeader';
import type { ChatMessage, ChatPanelConfig, ChatUserId } from '../../types/chat';
import { classNames } from '../../utils/classNames';

interface ChatPanelProps {
  config: ChatPanelConfig;
  messages: ChatMessage[];
  isConnected: boolean;
  typingUsers: ChatUserId[];
  onSendMessage: (userId: ChatUserId, body: string) => void;
  onTypingChange: (userId: ChatUserId, isTyping: boolean) => void;
}

export function ChatPanel({
  config,
  messages,
  isConnected,
  typingUsers,
  onSendMessage,
  onTypingChange,
}: ChatPanelProps) {
  const [draft, setDraft] = useState('');
  const typingTimeoutRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const scheduleTypingReset = () => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      onTypingChange(config.userId, false);
    }, 1200);
  };

  const handleInputChange = (value: string) => {
    setDraft(value);
    onTypingChange(config.userId, value.trim().length > 0);
    scheduleTypingReset();
  };

  const handleSend = () => {
    if (!draft.trim()) {
      return;
    }

    onSendMessage(config.userId, draft);
    onTypingChange(config.userId, false);
    setDraft('');
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
  };

  return (
    <section className="flex min-h-[520px] flex-col rounded-[2rem] border border-white/10 bg-slate-900/75 p-5 shadow-panel backdrop-blur xl:p-6">
      <PanelHeader config={config} isConnected={isConnected} typingUsers={typingUsers} />

      <div
        ref={listRef}
        className="mt-5 flex flex-1 flex-col gap-3 overflow-y-auto pr-1"
        aria-label={`${config.title} message list`}
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              perspectiveUserId={config.userId}
            />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">
            No messages yet. Start the conversation from either panel.
          </div>
        )}
      </div>

      <div className="mt-5 flex items-end gap-3">
        <label className="flex-1">
          <span className="sr-only">{config.title} message input</span>
          <textarea
            value={draft}
            onChange={(event) => handleInputChange(event.target.value)}
            onBlur={() => onTypingChange(config.userId, false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            rows={3}
            placeholder={`Send a message as ${config.title}`}
            className="min-h-[88px] w-full resize-none rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/20"
          />
        </label>
        <button
          type="button"
          onClick={handleSend}
          disabled={!draft.trim() || !isConnected}
          className={classNames(
            'rounded-2xl px-5 py-3 text-sm font-semibold text-slate-950 transition',
            !draft.trim() || !isConnected
              ? 'cursor-not-allowed bg-slate-300/40 text-slate-200/70'
              : 'bg-white hover:-translate-y-0.5 hover:bg-sky-200'
          )}
        >
          Send
        </button>
      </div>
    </section>
  );
}
