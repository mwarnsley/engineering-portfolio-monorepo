import { ChatPanel } from './ChatPanel';
import { StatusBadge } from '../../components/StatusBadge';
import { useChatSimulator } from '../../hooks/useChatSimulator';
import type { ChatPanelConfig } from '../../types/chat';

const PANELS: ChatPanelConfig[] = [
  {
    userId: 'user-a',
    title: 'User A',
    accentClassName: 'text-sky-300',
  },
  {
    userId: 'user-b',
    title: 'User B',
    accentClassName: 'text-mint',
  },
];

export function ChatSimulator() {
  const { isConnected, messages, typingUsers, sendMessage, setTyping, resetChat } =
    useChatSimulator();

  return (
    <main className="min-h-screen px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-200">
                Socket.IO Demo
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Real-time chat, simplified for a polished portfolio demo.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">
                Type as User A or User B and watch messages, typing state, and connection
                updates flow through the same Socket.IO channel in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge isConnected={isConnected} />
              <button
                type="button"
                onClick={resetChat}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/15"
              >
                Clear chat
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {PANELS.map((panel) => (
              <ChatPanel
                key={panel.userId}
                config={panel}
                messages={messages}
                isConnected={isConnected}
                typingUsers={typingUsers}
                onSendMessage={sendMessage}
                onTypingChange={setTyping}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
