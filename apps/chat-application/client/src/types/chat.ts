export type ChatUserId = 'user-a' | 'user-b';

export interface ChatMessage {
  id: string;
  authorId: ChatUserId;
  authorLabel: string;
  body: string;
  timestamp: string;
}

export interface TypingState {
  userId: ChatUserId;
  isTyping: boolean;
}

export interface ChatPanelConfig {
  userId: ChatUserId;
  title: string;
  accentClassName: string;
}
