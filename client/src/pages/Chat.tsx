import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, MessageCircle, Users, ChevronLeft, Plus, User, Scissors, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function Chat() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const {
    conversations,
    currentConversation,
    messages,
    setCurrentConversation,
    sendMessage,
    getUnreadCount,
    allUsers,
  } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [showConversations, setShowConversations] = useState(true);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (selectedUser) {
      // Send message to the selected user
      sendMessage(selectedUser.id, selectedUser.name, newMessage.trim());
    } else {
      const conv = conversations.find((c) => c.id === currentConversation);
      if (conv) {
        const otherParticipant = conv.participants.find((p) => p.id !== user?.id);
        if (otherParticipant) {
          sendMessage(otherParticipant.id, otherParticipant.name, newMessage.trim());
        }
      }
    }
    setNewMessage("");
  };

  const handleStartChat = (targetUser: { id: string; name: string; role: string }) => {
    if (!user) return;
    // Set the selected user and open the chat panel directly
    setSelectedUser(targetUser);
    setShowUserPicker(false);
    setShowConversations(false);
    // Set conversation ID based on both user IDs (sorted for consistency)
    const ids = [user.id, targetUser.id].sort();
    setCurrentConversation(`${ids[0]}_${ids[1]}`);
  };

  const activeConversation = conversations.find((c) => c.id === currentConversation);

  // The "other user" is either from the active conversation or the selected user we're starting a chat with
  const getOtherUser = () => {
    if (activeConversation) {
      return activeConversation.participants.find((p) => p.id !== user?.id);
    }
    // If no active conversation exists yet, use the selected user from the picker
    return selectedUser;
  };

  if (!user) return null;

  const otherUser = getOtherUser();

  // Filter available users based on role
  const availableChatTargets = allUsers.filter((u) => {
    if (user.role === "client") return u.role !== "client";
    if (user.role === "barber") return u.role !== "barber";
    return true; // admin can chat with everyone
  });

  const goBackToList = () => {
    setShowConversations(true);
    setSelectedUser(null);
    setCurrentConversation("");
  };

  return (
    <div className="h-[calc(100vh-80px)] pt-20 bg-background">
      <div className="h-full max-w-6xl mx-auto flex flex-col md:flex-row gap-0 md:gap-4 p-4">
        {/* Conversations List */}
        <div className={`${showConversations ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 border border-border rounded-lg bg-card overflow-hidden`}>
          <div className="p-4 border-b border-border bg-primary flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversas
            </h2>
            <button
              onClick={() => setShowUserPicker(true)}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
              title="Nova conversa"
            >
              <Plus className="w-4 h-4 text-accent" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">
                  Nenhuma conversa ainda.
                </p>
                <p className="text-xs text-muted-foreground mt-2 mb-4">
                  Inicie uma conversa com seu barbeiro sobre agendamentos.
                </p>
                <Button
                  onClick={() => setShowUserPicker(true)}
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-primary text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" /> Iniciar Conversa
                </Button>
              </div>
            ) : (
              conversations.map((conv) => {
                const otherUserInConv = conv.participants.find((p) => p.id !== user.id);
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setCurrentConversation(conv.id);
                      setSelectedUser(null); // Clear selected user when opening existing conversation
                      setShowConversations(false);
                    }}
                    className={`w-full p-4 flex items-center gap-3 border-b border-border hover:bg-primary/5 transition-colors ${
                      currentConversation === conv.id ? "bg-accent/10" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {otherUserInConv?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-semibold text-primary text-sm truncate">{otherUserInConv?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(conv.lastTimestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="bg-accent text-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center mt-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!showConversations ? "flex" : "hidden"} md:flex flex-1 flex-col border border-border rounded-lg bg-card overflow-hidden`}>
          {(currentConversation || selectedUser) && otherUser ? (
            <>
              {/* Chat Header with BACK button and EXIT button */}
              <div className="p-4 border-b border-border bg-primary flex items-center gap-3">
                <button
                  onClick={goBackToList}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                  title="Voltar para lista de conversas"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{otherUser.name}</p>
                  <p className="text-xs text-accent">
                    {otherUser.role === "barber" ? "Barbeiro" : otherUser.role === "admin" ? "Administrador" : "Cliente"}
                  </p>
                </div>
                <button
                  onClick={() => setLocation("/dashboard")}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                  title="Sair do Chat"
                >
                  <LogOut className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Inicie a conversa com {otherUser.name}.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-lg ${
                          msg.senderId === user.id
                            ? "bg-accent text-primary"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${
                          msg.senderId === user.id ? "text-primary/60" : "text-muted-foreground"
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          {msg.senderId === user.id && (
                            <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Mensagem para ${otherUser?.name || "..."}...`}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!newMessage.trim()}
                  className="bg-accent hover:bg-accent/90 text-primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold text-primary mb-2">Chat da Barbearia</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Selecione uma conversa na lateral para começar a conversar.
                </p>
                <div className="flex gap-2 mt-4 justify-center">
                  <Button
                    onClick={() => setShowConversations(true)}
                    className="bg-accent hover:bg-accent/90 text-primary md:hidden"
                  >
                    Ver Conversas
                  </Button>
                  <Button
                    onClick={() => setShowUserPicker(true)}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-primary"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Nova Conversa
                  </Button>
                </div>
                <button
                  onClick={() => setLocation("/dashboard")}
                  className="mt-4 flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Voltar ao Painel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Picker Modal */}
      {showUserPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUserPicker(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Iniciar Conversa
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione com quem deseja conversar:
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableChatTargets.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum usuário disponível para conversar.
                  </p>
                ) : (
                  availableChatTargets.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleStartChat(u)}
                      className="w-full p-3 flex items-center gap-3 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {u.role === "barber" ? (
                          <Scissors className="w-5 h-5 text-primary" />
                        ) : u.role === "admin" ? (
                          <User className="w-5 h-5 text-primary" />
                        ) : (
                          <span className="text-sm font-bold text-primary">{u.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-primary text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {u.role === "barber" ? "Barbeiro" : u.role === "admin" ? "Administrador" : "Cliente"}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <Button
                onClick={() => setShowUserPicker(false)}
                variant="outline"
                className="w-full mt-4"
              >
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
