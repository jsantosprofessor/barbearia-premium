import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/contexts/AppointmentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Users, TrendingUp, Clock, Check, X, BarChart3, Scissors, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const { getAllAppointments, updateStatus } = useAppointments();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const appointments = getAllAppointments();
  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter(
    (a) => a.date === today && a.status !== "cancelled"
  );
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );
  const revenue = appointments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => {
      // We'd need to look up price from service data
      return sum;
    }, 0);

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

  if (!user || user.role !== "admin") {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="fixed top-0 w-full bg-primary text-white z-50 shadow-lg">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider">PAINEL ADMINISTRATIVO</h1>
              <p className="text-[10px] text-accent tracking-widest">MAJOR BARBEARIA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-accent">Olá, {user.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:text-accent hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
          <TabsList className="mb-6 bg-card border border-border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
              <BarChart3 className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
              <Calendar className="w-4 h-4 mr-2" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="today" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
              <Clock className="w-4 h-4 mr-2" />
              Hoje
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{appointments.filter(a => a.status !== "cancelled").length}</p>
                      <p className="text-xs text-muted-foreground">Total Agendamentos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{pendingAppointments.length}</p>
                      <p className="text-xs text-muted-foreground">Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{completedAppointments.length}</p>
                      <p className="text-xs text-muted-foreground">Concluídos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{todayAppointments.length}</p>
                      <p className="text-xs text-muted-foreground">Hoje</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-lg">Agendamentos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum agendamento registrado ainda.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Barbeiro</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 10)
                        .map((appt) => (
                          <TableRow key={appt.id}>
                            <TableCell className="font-medium">{appt.clientName}</TableCell>
                            <TableCell>{appt.serviceName}</TableCell>
                            <TableCell>{appt.barberName}</TableCell>
                            <TableCell>{appt.date.split("-").reverse().join("/")}</TableCell>
                            <TableCell>{appt.time}</TableCell>
                            <TableCell>
                              <Badge className={statusColors[appt.status]}>
                                {statusLabels[appt.status]}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-lg">Todos os Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum agendamento encontrado.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Barbeiro</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((appt) => (
                          <TableRow key={appt.id}>
                            <TableCell className="font-medium">{appt.clientName}</TableCell>
                            <TableCell>{appt.serviceName}</TableCell>
                            <TableCell>{appt.barberName}</TableCell>
                            <TableCell>{appt.date.split("-").reverse().join("/")}</TableCell>
                            <TableCell>{appt.time}</TableCell>
                            <TableCell>{appt.duration} min</TableCell>
                            <TableCell>
                              <Badge className={statusColors[appt.status]}>
                                {statusLabels[appt.status]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {appt.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 w-7 p-0 border-green-200 hover:bg-green-50"
                                      onClick={() => updateStatus(appt.id, "confirmed")}
                                    >
                                      <Check className="w-3 h-3 text-green-600" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 w-7 p-0 border-red-200 hover:bg-red-50"
                                      onClick={() => updateStatus(appt.id, "cancelled")}
                                    >
                                      <X className="w-3 h-3 text-red-600" />
                                    </Button>
                                  </>
                                )}
                                {appt.status === "confirmed" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 border-blue-200 hover:bg-blue-50 text-xs"
                                    onClick={() => updateStatus(appt.id, "completed")}
                                  >
                                    Concluir
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Today Tab */}
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-lg">
                  Agendamentos de Hoje - {today.split("-").reverse().join("/")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      Nenhum agendamento para hoje.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appt) => (
                        <div
                          key={appt.id}
                          className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
                        >
                          <div className="w-16 text-center">
                            <p className="text-lg font-bold text-primary">{appt.time}</p>
                            <p className="text-xs text-muted-foreground">{appt.duration} min</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-primary">{appt.clientName}</p>
                            <p className="text-sm text-muted-foreground">
                              {appt.serviceName} • {appt.barberName}
                            </p>
                            {appt.notes && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                "{appt.notes}"
                              </p>
                            )}
                          </div>
                          <Badge className={statusColors[appt.status]}>
                            {statusLabels[appt.status]}
                          </Badge>
                          <div className="flex gap-1">
                            {appt.status === "pending" && (
                              <Button
                                size="sm"
                                className="h-8 bg-green-500 hover:bg-green-600 text-white text-xs"
                                onClick={() => updateStatus(appt.id, "confirmed")}
                              >
                                Confirmar
                              </Button>
                            )}
                            {appt.status === "confirmed" && (
                              <Button
                                size="sm"
                                className="h-8 bg-accent hover:bg-accent/90 text-primary text-xs"
                                onClick={() => updateStatus(appt.id, "completed")}
                              >
                                Concluir
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
