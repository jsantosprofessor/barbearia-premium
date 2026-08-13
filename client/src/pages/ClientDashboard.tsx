import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/contexts/AppointmentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Scissors, MessageCircle, LogOut, ChevronRight, User } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const { getClientAppointments, cancelAppointment } = useAppointments();
  const [, setLocation] = useLocation();

  const appointments = getClientAppointments();

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

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary tracking-wider" style={{ fontFamily: "Playfair Display" }}>
                  Olá, {user.name}
                </h1>
                <p className="text-muted-foreground mt-1">Bem-vindo ao seu painel</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sair
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/agendar")}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-primary">Agendar</p>
                  <p className="text-xs text-muted-foreground">Novo horário</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/chat")}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-primary">Chat</p>
                  <p className="text-xs text-muted-foreground">Fale com seu barbeiro</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/")}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-primary">Serviços</p>
                  <p className="text-xs text-muted-foreground">Ver catálogo</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Meus Agendamentos
            </h2>
          </div>

          {appointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">Você ainda não tem agendamentos.</p>
                <Button
                  onClick={() => setLocation("/agendar")}
                  className="bg-accent hover:bg-accent/90 text-primary font-bold"
                >
                  Agendar Agora
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {appointments
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((appt) => (
                  <Card key={appt.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-bold text-primary">{appt.time}</p>
                            <p className="text-xs text-muted-foreground">{appt.date.split("-").reverse().join("/")}</p>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Scissors className="w-4 h-4 text-accent" />
                              <p className="font-semibold text-primary">{appt.serviceName}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <User className="w-3 h-3 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">{appt.barberName}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">{appt.duration} min</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[appt.status]}>
                            {statusLabels[appt.status]}
                          </Badge>
                          {appt.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                              onClick={() => cancelAppointment(appt.id)}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
