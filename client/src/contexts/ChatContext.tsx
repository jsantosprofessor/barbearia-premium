import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  participants: { id: string; name: string; role: string }[];
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

interface ChatContextType {
  conversations: ChatConversation[];
  currentConversation: string | null;
  messages: ChatMessage[];
  setCurrentConversation: (convId: string) => void;
  sendMessage: (receiverId: string, receiverName: string, content: string) => void;
  getUnreadCount: () => number;
  startConversation: (userId: string, userName: string, userRole: string) => string;
  allUsers: { id: string; name: string; role: string }[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = "barbearia_premium_chat";

// Get ALL users from localStorage (admin, barbers, AND registered clients)
function getAllChatUsers(): { id: string; name: string; role: string }[] {
  try {
    const usersData = localStorage.getItem("barbearia_premium_users");
    if (usersData) {
      const users = JSON.parse(usersData);
      return users.map((u: any) => ({
        id: u.id,
        name: u.name,
        role: u.role,
      }));
    }
  } catch {}
  // Fallback
  return [
    { id: "admin-001", name: "Administrador", role: "admin" },
    { id: "barber-001", name: "João Temperado", role: "barber" },
    { id: "barber-002", name: "Carlos Silva", role: "barber" },
    { id: "barber-003", name: "Pedro Santos", role: "barber" },
  ];
}

function loadMessages(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: ChatMessage[] = JSON.parse(stored);
      // Ensure all messages have receiverName
      return data.map((msg) => {
        if (msg.receiverName) return msg;
        const users = getAllChatUsers();
        const receiver = users.find((u) => u.id === msg.receiverId);
        return {
          ...msg,
          receiverName: receiver?.name || msg.receiverId,
        };
      });
    }
  } catch {}
  return [];
}

function saveMessages(messages: ChatMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// Listen for storage events from other tabs (e.g., barbeiro opens chat while client sends message in another tab)
function useStorageListener(callback: () => void) {
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        callback();
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [callback]);
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const { user } = useAuth();

  // Load messages on mount
  useEffect(() => {
    setMessages(loadMessages());
  }, []);

  // Listen for storage changes (cross-tab sync)
  useStorageListener(() => {
    setMessages(loadMessages());
  });

  const getConversationId = useCallback(
    (participantId: string) => {
      if (!user) return "";
      const ids = [user.id, participantId].sort();
      return `${ids[0]}_${ids[1]}`;
    },
    [user]
  );

  const conversations = React.useMemo(() => {
    if (!user) return [];
    const convMap = new Map<string, ChatConversation>();
    const allUsers = getAllChatUsers();

    messages.forEach((msg) => {
      // A message belongs to this conversation if the current user is sender or receiver
      if (msg.senderId === user.id || msg.receiverId === user.id) {
        const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        const convId = getConversationId(otherUserId);

        if (!convMap.has(convId)) {
          const otherUser = allUsers.find((u) => u.id === otherUserId) || {
            id: otherUserId,
            name: msg.senderId === user.id ? msg.receiverName : msg.senderName,
            role: msg.senderId === user.id ? "client" : msg.senderRole,
          };

          convMap.set(convId, {
            id: convId,
            participants: [
              { id: user.id, name: user.name, role: user.role },
              otherUser,
            ],
            lastMessage: msg.content,
            lastTimestamp: msg.timestamp,
            unreadCount: 0,
          });
        }

        const conv = convMap.get(convId)!;
        conv.lastMessage = msg.content;
        conv.lastTimestamp = msg.timestamp;

        // Count unread messages for this conversation
        if (msg.receiverId === user.id && !msg.read) {
          conv.unreadCount++;
        }
      }
    });

    return Array.from(convMap.values()).sort(
      (a, b) => new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime()
    );
  }, [messages, user, getConversationId]);

  const conversationMessages = React.useMemo(() => {
    if (!user || !currentConversation) return [];
    return messages
      .filter((msg) => {
        const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        const convId = getConversationId(otherUserId);
        return convId === currentConversation;
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }, [messages, user, currentConversation, getConversationId]);

  const sendMessage = useCallback(
    (receiverId: string, receiverName: string, content: string) => {
      if (!user) return;

      const msg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        receiverId,
        receiverName,
        content,
        timestamp: new Date().toISOString(),
        read: false,
      };

      const updated = [...messages, msg];
      setMessages(updated);
      saveMessages(updated);

      // Set current conversation to this one
      const convId = getConversationId(receiverId);
      setCurrentConversation(convId);
    },
    [user, messages, getConversationId]
  );

  const startConversation = useCallback(
    (userId: string, userName: string, userRole: string) => {
      if (!user) return "";
      const convId = getConversationId(userId);
      setCurrentConversation(convId);
      return convId;
    },
    [user, getConversationId]
  );

  const getUnreadCount = useCallback(() => {
    if (!user) return 0;
    return messages.filter(
      (m) => m.receiverId === user.id && !m.read
    ).length;
  }, [messages, user]);

  // Get all users that the current user can chat with
  const allUsers = React.useMemo(() => {
    if (!user) return [];
    const allAuthUsers = getAllChatUsers();

    if (user.role === "client") {
      // Clients can chat with all barbers and admin
      return allAuthUsers.filter((u) => u.role !== "client" && u.id !== user.id);
    } else if (user.role === "barber") {
      // Barbers can chat with clients, admin, and other barbers
      return allAuthUsers.filter((u) => u.id !== user.id);
    } else if (user.role === "admin") {
      // Admin can chat with everyone
      return allAuthUsers.filter((u) => u.id !== user.id);
    }

    return allAuthUsers;
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages: conversationMessages,
        setCurrentConversation,
        sendMessage,
        getUnreadCount,
        startConversation,
        allUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
