import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChatMessage, ChatUserId, TypingState } from '../types/chat';
import { createChatSocket, type ChatSocket } from '../services/socket';

const USER_LABELS: Record<ChatUserId, string> = {
  'user-a': 'User A',
  'user-b': 'User B',
};

export interface UseChatSimulatorResult {
  isConnected: boolean;
  messages: ChatMessage[];
  typingUsers: ChatUserId[];
  sendMessage: (userId: ChatUserId, body: string) => void;
  setTyping: (userId: ChatUserId, isTyping: boolean) => void;
  resetChat: () => void;
}

export function useChatSimulator(socketFactory: () => ChatSocket = createChatSocket): UseChatSimulatorResult {
  const socketRef = useRef<ChatSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingMap, setTypingMap] = useState<Record<ChatUserId, boolean>>({
    'user-a': false,
    'user-b': false,
  });

  useEffect(() => {
    const socket = socketFactory();
    socketRef.current = socket;

    const offConnect = socket.onConnect(() => {
      setIsConnected(true);
    });
    const offDisconnect = socket.onDisconnect(() => {
      setIsConnected(false);
    });
    const offMessage = socket.onMessage((message) => {
      setMessages((current) => [...current, message]);
      setTypingMap((current) => ({
        ...current,
        [message.authorId]: false,
      }));
    });
    const offTyping = socket.onTyping((state) => {
      setTypingMap((current) => ({
        ...current,
        [state.userId]: state.isTyping,
      }));
    });
    const offReset = socket.onReset(() => {
      setMessages([]);
      setTypingMap({
        'user-a': false,
        'user-b': false,
      });
    });

    socket.connect();

    return () => {
      offConnect();
      offDisconnect();
      offMessage();
      offTyping();
      offReset();
      socket.disconnect();
    };
  }, [socketFactory]);

  const typingUsers = useMemo(() => {
    return (Object.entries(typingMap) as Array<[ChatUserId, boolean]>)
      .filter(([, isTyping]) => isTyping)
      .map(([userId]) => userId);
  }, [typingMap]);

  const sendMessage = (userId: ChatUserId, body: string) => {
    const trimmedBody = body.trim();
    if (!trimmedBody || !socketRef.current) {
      return;
    }

    socketRef.current.emitMessage({
      authorId: userId,
      authorLabel: USER_LABELS[userId],
      body: trimmedBody,
    });
  };

  const setTyping = (userId: ChatUserId, isTyping: boolean) => {
    socketRef.current?.emitTyping({ userId, isTyping });
  };

  const resetChat = () => {
    socketRef.current?.emitReset();
  };

  return {
    isConnected,
    messages,
    typingUsers,
    sendMessage,
    setTyping,
    resetChat,
  };
}
