import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/contexts/AppointmentContext";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Check, X, MessageCircle, LogOut, Send, Users, ChevronLeft, Plus, User, Scissors } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

export default function BarberDashboard() {
  const { user, logout } = useAuth();
  const { getBarberAppointments, updateStatus, cancelAppointment } = useAppointments();
  const {
    conversations,
    currentConversation,
    messages,
    setCurrentConversation,
    sendMessage,
    allUsers,
  } = useChat();
  const [, setLocation] = useLocation();
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"today" | "all" | "chat">("today");
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [selectedChatTarget, setSelectedChatTarget] = useState<{ id: string; name: string; role: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!user || user.role !== "barber") {
    setLocation("/login");
    return null;
  }

  const appointments = getBarberAppointments(user.barberId || "");

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((a) => a.date === today);
  const pendingAppts = appointments.filter((a) => a.status === "pending");
  const confirmedAppts = appointments.filter((a) => a.status === "confirmed");
  const completedAppts = appointments.filter((a) => a.status === "completed");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    completed: "Concluído",
    cancelled: "Cancelado",
  };

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const conv = conversations.find((c) => c.id === currentConversation);
    if (conv) {
      const otherParticipant = conv.participants.find((p) => p.id !== user.id);
      if (otherParticipant) {
        sendMessage(otherParticipant.id, otherParticipant.name, newMessage.trim());
      }
    } else if (selectedChatTarget) {
      // First message in a new conversation
      sendMessage(selectedChatTarget.id, selectedChatTarget.name, newMessage.trim());
    }
    setNewMessage("");
  };

  // Start a new chat with a client from an appointment
  const startChatWithClient = (clientName: string, clientId: string) => {
    if (!clientId) {
      toast.error("ID do cliente não encontrado.");
      return;
    }
    const usersData = localStorage.getItem("barbearia_premium_users");
    if (usersData) {
      const users = JSON.parse(usersData);
      const client = users.find((u: any) => u.id === clientId);
      if (client) {
        // Set the conversation ID and switch to chat tab
        const ids = [user.id, client.id].sort();
        const convId = `${ids[0]}_${ids[1]}`;
        setCurrentConversation(convId);
        setSelectedChatTarget({ id: client.id, name: client.name, role: client.role });
        setActiveTab("chat");
        setShowChat(true);
        return;
      }
    }
    toast.error("Cliente não encontrado no sistema.");
  };

  const handleStartChat = (targetUser: { id: string; name: string; role: string }) => {
    if (!user) return;
    setSelectedChatTarget(targetUser);
    setShowUserPicker(false);
    setShowChat(true);
    setActiveTab("chat");
    const ids = [user.id, targetUser.id].sort();
    setCurrentConversation(`${ids[0]}_${ids[1]}`);
  };

  const activeConversation = conversations.find((c) => c.id === currentConversation);
  const chatMessages = messages;

  const goBackToList = () => {
    setShowChat(false);
    setSelectedChatTarget(null);
    setCurrentConversation("");
  };

  // Get the other user in the current conversation
  const getOtherUser = () => {
    if (activeConversation) {
      return activeConversation.participants.find((p) => p.id !== user.id);
    }
    return selectedChatTarget;
  };

  const otherUser = getOtherUser();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary tracking-wider" style={{ fontFamily: "Playfair Display" }}>
              {activeTab === "today" ? "Agenda de Hoje" : activeTab === "all" ? "Todos os Agendamentos" : "Chat"}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:block">Olá, {user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-foreground hover:text-accent hover:bg-accent/10"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sair
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("today")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "today"
                  ? "bg-accent text-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" /> Hoje
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "all"
                  ? "bg-accent text-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" /> Todos
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === "chat"
                  ? "bg-accent text-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-1" /> Chat
              {conversations.reduce((sum, c) => sum + c.unreadCount, 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white">
                  {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
                </span>
              )}
            </button>
          </div>

          {activeTab !== "chat" ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-2xl font-bold text-primary">{todayAppts.length}</p>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-2xl font-bold text-yellow-600">{pendingAppts.length}</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-600">{confirmedAppts.length}</p>
                  <p className="text-xs text-muted-foreground">Confirmados</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-600">{completedAppts.length}</p>
                  <p className="text-xs text-muted-foreground">Concluídos</p>
                </div>
              </div>

              {/* Today's Schedule */}
              {activeTab === "today" && (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-border bg-primary">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Agendamentos de Hoje
                    </h3>
                  </div>
                  <div className="p-4">
                    {todayAppts.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum agendamento para hoje.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {todayAppts
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((appt) => (
                            <div
                              key={appt.id}
                              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-background border border-border rounded-lg"
                            >
                              <div className="w-16 text-center flex-shrink-0">
                                <p className="text-lg font-bold text-primary">{appt.time}</p>
                                <p className="text-xs text-muted-foreground">{appt.duration} min</p>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-primary">{appt.clientName}</p>
                                <p className="text-sm text-muted-foreground">{appt.serviceName}</p>
                                <p className="text-xs text-muted-foreground">
                                  R$ {appt.price.toFixed(2)}
                                </p>
                              </div>
                              <Badge className={statusColors[appt.status]}>
                                {statusLabels[appt.status]}
                              </Badge>
                              <div className="flex gap-2 flex-shrink-0">
                                {appt.status === "pending" && (
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                    onClick={() => {
                                      updateStatus(appt.id, "confirmed");
                                      toast.success(`Agendamento de ${appt.clientName} confirmado!`);
                                    }}
                                  >
                                    <Check className="w-3 h-3 mr-1" /> Aceitar
                                  </Button>
                                )}
                                {appt.status === "confirmed" && (
                                  <Button
                                    size="sm"
                                    className="bg-accent hover:bg-accent/90 text-primary text-xs"
                                    onClick={() => {
                                      updateStatus(appt.id, "completed");
                                      toast.success(`Serviço de ${appt.clientName} concluído!`);
                                    }}
                                  >
                                    <Check className="w-3 h-3 mr-1" /> Concluir
                                  </Button>
                                )}
                                {(appt.status === "pending" || appt.status === "confirmed") && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-500 border-red-300 hover:bg-red-50 text-xs"
                                    onClick={() => {
                                      cancelAppointment(appt.id);
                                      toast.info("Agendamento cancelado.");
                                    }}
                                  >
                                    <X className="w-3 h-3 mr-1" /> Cancelar
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-primary border-accent hover:bg-accent/10 text-xs"
                                  onClick={() => startChatWithClient(appt.clientName, appt.clientId)}
                                >
                                  <MessageCircle className="w-3 h-3 mr-1" /> Chat
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* All Appointments */}
              {activeTab === "all" && (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-border bg-primary">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Todos os Agendamentos
                    </h3>
                  </div>
                  <div className="p-4">
                    {appointments.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum agendamento encontrado.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {appointments
                          .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
                          .map((appt) => (
                            <div
                              key={appt.id}
                              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-background border border-border rounded-lg"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-primary text-sm">{appt.clientName}</p>
                                  <Badge className={`${statusColors[appt.status]} text-[10px]`}>
                                    {statusLabels[appt.status]}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{appt.serviceName}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span>{appt.date.split("-").reverse().join("/")}</span>
                                  <span>•</span>
                                  <span>{appt.time}</span>
                                  <span>•</span>
                                  <span>{appt.duration} min</span>
                                  <span>•</span>
                                  <span>R$ {appt.price.toFixed(2)}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                {appt.status === "pending" && (
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                    onClick={() => {
                                      updateStatus(appt.id, "confirmed");
                                      toast.success("Agendamento confirmado!");
                                    }}
                                  >
                                    <Check className="w-3 h-3 mr-1" /> Aceitar
                                  </Button>
                                )}
                                {appt.status === "confirmed" && (
                                  <Button
                                    size="sm"
                                    className="bg-accent hover:bg-accent/90 text-primary text-xs"
                                    onClick={() => {
                                      updateStatus(appt.id, "completed");
                                      toast.success("Serviço concluído!");
                                    }}
                                  >
                                    <Check className="w-3 h-3 mr-1" /> Concluir
                                  </Button>
                                )}
                                {(appt.status === "pending" || appt.status === "confirmed") && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-500 border-red-300 hover:bg-red-50 text-xs"
                                    onClick={() => {
                                      cancelAppointment(appt.id);
                                      toast.info("Agendamento cancelado.");
                                    }}
                                  >
                                    <X className="w-3 h-3 mr-1" /> Cancelar
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-primary border-accent hover:bg-accent/10 text-xs"
                                  onClick={() => startChatWithClient(appt.clientName, appt.clientId)}
                                >
                                  <MessageCircle className="w-3 h-3 mr-1" /> Chat
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Chat View */
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-220px)]">
              {/* Conversations List */}
              <div className={`flex flex-col border border-border rounded-lg bg-card overflow-hidden ${showChat ? "hidden lg:flex" : "flex"}`}>
                <div className="p-3 border-b border-border bg-primary flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Conversas
                  </h3>
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
                      <p className="text-sm text-muted-foreground">Nenhuma conversa.</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-4">
                        Inicie uma conversa pelo botão Chat nos agendamentos ou pelo botão + acima.
                      </p>
                      <Button
                        onClick={() => setShowUserPicker(true)}
                        size="sm"
                        className="bg-accent hover:bg-accent/90 text-primary text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Nova Conversa
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
                            setSelectedChatTarget(otherUserInConv || null);
                            setShowChat(true);
                          }}
                          className={`w-full p-3 flex items-center gap-3 border-b border-border hover:bg-primary/5 transition-colors ${
                            currentConversation === conv.id ? "bg-accent/10" : ""
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {otherUserInConv?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-semibold text-primary text-xs truncate">{otherUserInConv?.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{conv.lastMessage}</p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="bg-accent text-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className={`flex flex-col border border-border rounded-lg bg-card overflow-hidden ${!showChat ? "hidden lg:flex" : "flex"}`}>
                {otherUser ? (
                  <>
                    {/* Chat Header with BACK button and EXIT button */}
                    <div className="p-3 border-b border-border bg-primary flex items-center gap-3">
                      <button
                        onClick={goBackToList}
                        className="p-1 hover:bg-white/10 rounded-md transition-colors"
                        title="Voltar para lista de conversas"
                      >
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{otherUser.name}</p>
                        <p className="text-[10px] text-accent">
                          {otherUser.role === "barber" ? "Barbeiro" : otherUser.role === "admin" ? "Administrador" : "Cliente"}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowChat(false)}
                        className="p-1 hover:bg-white/10 rounded-md transition-colors"
                        title="Sair do Chat"
                      >
                        <X className="w-5 h-5 text-white/70 hover:text-white" />
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                          <p className="text-sm text-muted-foreground">
                            Inicie a conversa com {otherUser.name}.
                          </p>
                        </div>
                      ) : (
                        chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                                msg.senderId === user.id
                                  ? "bg-accent text-primary"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-[9px] mt-0.5 ${
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
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-border flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Mensagem para ${otherUser.name}...`}
                        className="flex-1 text-sm"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim()}
                        className="bg-accent hover:bg-accent/90 text-primary h-9 w-9"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Selecione uma conversa na lateral
                      </p>
                      <div className="flex gap-2 mt-3 justify-center">
                        <Button
                          onClick={goBackToList}
                          variant="outline"
                          size="sm"
                          className="lg:hidden"
                        >
                          <ChevronLeft className="w-3 h-3 mr-1" /> Voltar
                        </Button>
                        <Button
                          onClick={() => setShowUserPicker(true)}
                          variant="outline"
                          size="sm"
                          className="border-accent text-accent hover:bg-accent hover:text-primary"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Nova Conversa
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

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
                {allUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum usuário disponível para conversar.
                  </p>
                ) : (
                  allUsers.map((u) => (
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
