import { useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/contexts/AppointmentContext";
import { serviceCategories, barbers, workingHours } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Scissors, User, ChevronLeft, ChevronRight, Check, LogOut } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";

function generateTimeSlots(duration: number = 0) {
  const slots: string[] = [];
  const { start, end, slotDuration, lunchStart, lunchEnd } = workingHours;

  let current = start * 60;
  const endMinutes = end * 60;
  const lunchStartMin = lunchStart * 60;
  const lunchEndMin = lunchEnd * 60;

  while (current + duration <= endMinutes) {
    // Skip lunch time
    if (current >= lunchStartMin && current < lunchEndMin) {
      current = lunchEndMin;
    }

    // Check if service fits before end of day
    if (current + duration <= endMinutes) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }

    current += slotDuration;
  }

  return slots;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getDayOfWeek(year: number, month: number, day: number) {
  return new Date(year, month, day).getDay();
}

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Booking() {
  const { user } = useAuth();
  const { getOccupiedSlots, createAppointment } = useAppointments();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Multi-select services logic
  const allServices = serviceCategories.flatMap((cat) => cat.items);

  const toggleService = (serviceId: string, categoryId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        const next = prev.filter((id) => id !== serviceId);
        if (next.length === 0) {
          setSelectedCategories((c) => c.filter((cid) => cid !== categoryId));
        }
        return next;
      }
      return [...prev, serviceId];
    });
    setSelectedCategories((prev) => {
      if (!prev.includes(categoryId)) return [...prev, categoryId];
      return prev;
    });
  };

  // Calculate total duration and price
  const selectedServicesData = allServices.filter((s) => selectedServices.includes(s.id));
  const totalDuration = selectedServicesData.reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = selectedServicesData.reduce((sum, s) => sum + s.price, 0);

  const barber = barbers.find((b) => b.id === selectedBarber);

  const occupiedSlots = selectedBarber && selectedDate
    ? getOccupiedSlots(selectedBarber, selectedDate)
    : [];

  const availableSlots = totalDuration > 0
    ? generateTimeSlots(totalDuration)
    : [];

  const handleDateSelect = (day: number) => {
    const today = new Date();
    const selected = new Date(currentYear, currentMonth, day);

    if (selected < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      return;
    }

    if (getDayOfWeek(currentYear, currentMonth, day) === 0) {
      return;
    }

    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setStep(4);
  };

  const handleConfirm = () => {
    if (!user || selectedServices.length === 0 || !barber || !selectedDate || !selectedTime) {
      toast.error("Preencha todos os campos");
      return;
    }

    const serviceNames = selectedServicesData.map((s) => s.name);

    createAppointment({
      clientId: user.id,
      clientName: user.name,
      barberId: barber.id,
      barberName: barber.name,
      serviceIds: selectedServices,
      serviceNames,
      serviceName: serviceNames.join(" + "),
      date: selectedDate,
      time: selectedTime,
      duration: totalDuration,
      price: totalPrice,
      status: "pending",
      notes,
    });

    toast.success("Agendamento confirmado com sucesso!");
    setLocation("/dashboard");
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfWeek = getDayOfWeek(currentYear, currentMonth, 1);
    const today = new Date();

    const days: ReactNode[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = getDayOfWeek(currentYear, currentMonth, day);
      const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isSunday = dayOfWeek === 0;
      const isSelected = selectedDate === `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isDisabled = isPast || isSunday;

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateSelect(day)}
          disabled={isDisabled}
          className={`
            h-10 w-full rounded-md text-sm font-medium transition-all
            ${isDisabled
              ? "text-muted-foreground/30 cursor-not-allowed"
              : isSelected
                ? "bg-accent text-primary font-bold"
                : "hover:bg-accent/10 text-foreground"
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const steps = [
    { id: 1, label: "Serviços", icon: Scissors },
    { id: 2, label: "Barbeiro", icon: User },
    { id: 3, label: "Data", icon: Calendar },
    { id: 4, label: "Horário", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Voltar ao Painel</span>
          </button>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-wider" style={{ fontFamily: "Playfair Display" }}>
              AGENDAR HORÁRIO
            </h1>
            <p className="text-muted-foreground mt-2">Selecione os serviços, barbeiro e horário desejado.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step >= s.id
                        ? "bg-accent text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.id ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${step >= s.id ? "text-primary" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-0.5 ${step > s.id ? "bg-accent" : "bg-muted"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Selection summary */}
          {selectedServices.length > 0 && step >= 2 && (
            <Card className="mb-6 bg-accent/5 border-accent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Resumo da Seleção</p>
                    <p className="text-sm text-foreground">{selectedServicesData.map((s) => s.name).join(" + ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">R$ {totalPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Duração: ~{totalDuration} min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Select Services (Multi-select) */}
          {step === 1 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-2">Escolha os Serviços</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Você pode selecionar múltiplos serviços. A duração e o preço serão calculados automaticamente.
                </p>

                {selectedServices.length > 0 && (
                  <div className="mb-4 p-3 bg-accent/10 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      {selectedServices.length} serviço{selectedServices.length > 1 ? "s" : ""} selecionado{selectedServices.length > 1 ? "s" : ""}
                    </span>
                    <div className="flex gap-3 text-sm">
                      <span className="font-semibold text-primary">R$ {totalPrice.toFixed(2)}</span>
                      <span className="text-muted-foreground">• {totalDuration} min</span>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {serviceCategories.map((cat) => (
                    <div key={cat.id}>
                      <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
                        {cat.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cat.items.map((service) => {
                          const isSelected = selectedServices.includes(service.id);
                          return (
                            <button
                              key={service.id}
                              onClick={() => {
                                toggleService(service.id, cat.id);
                              }}
                              className={`p-4 rounded-lg border text-left transition-all hover:shadow-md relative ${
                                isSelected
                                  ? "border-accent bg-accent/10 ring-2 ring-accent/50"
                                  : "border-border hover:border-accent/50"
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-primary" />
                                </div>
                              )}
                              <p className="font-semibold text-primary text-sm pr-5">{service.name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  R$ {service.price.toFixed(2)}
                                </span>
                                {service.duration > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    • {service.duration} min
                                  </span>
                                )}
                              </div>
                              {service.planAvailable && (
                                <span className="inline-block mt-2 text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                                  {service.planText}
                                </span>
                              )}

                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedServices.length > 0 && (
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        setStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full bg-accent hover:bg-accent/90 text-primary font-bold"
                    >
                      Escolher Barbeiro →
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Barber */}
          {step === 2 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Escolha o Barbeiro</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {barbers.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedBarber(b.id);
                        setStep(3);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`p-5 rounded-lg border text-center transition-all hover:shadow-md ${
                        selectedBarber === b.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <p className="font-bold text-primary text-sm">{b.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{b.role}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <span className="text-accent text-xs font-semibold">★</span>
                        <span className="text-xs text-primary font-medium">{b.rating}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Select Date */}
          {step === 3 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Escolha a Data</h2>

                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                      } else {
                        setCurrentMonth(currentMonth - 1);
                      }
                    }}
                    className="p-2 hover:bg-muted rounded-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-bold text-primary">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <button
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                      } else {
                        setCurrentMonth(currentMonth + 1);
                      }
                    }}
                    className="p-2 hover:bg-muted rounded-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  * Domingos não disponíveis. Horários de funcionamento: Seg-Sáb, 9h às 19h.
                </p>

                <button
                  onClick={() => setStep(2)}
                  className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </button>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Select Time */}
          {step === 4 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-2">Escolha o Horário</h2>
                <p className="text-sm text-muted-foreground mb-1">
                  Horários ocupados aparecem em vermelho. Horários livres em verde.
                </p>
                {totalDuration > 30 && (
                  <p className="text-xs text-accent font-semibold mb-4">
                    Duração total: {totalDuration} min — bloqueia {Math.ceil(totalDuration / 30)} slots de 30 min
                  </p>
                )}

                <div className="flex items-center gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-accent" />
                    <span className="text-muted-foreground">Disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-destructive/20" />
                    <span className="text-muted-foreground">Ocupado</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6">
                  {availableSlots.map((slot) => {
                    const isOccupied = occupiedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => !isOccupied && setSelectedTime(slot)}
                        disabled={isOccupied}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
                          selectedTime === slot
                            ? "bg-accent text-primary font-bold"
                            : isOccupied
                              ? "bg-destructive/10 text-destructive/50 cursor-not-allowed line-through"
                              : "bg-primary/5 text-primary hover:bg-accent/10 border border-border"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                {selectedTime && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-foreground">Observações (opcional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full mt-2 p-3 border border-border rounded-md bg-input resize-none"
                      rows={3}
                      placeholder="Alguma preferência ou observação..."
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                  {selectedTime && (
                    <Button
                      onClick={() => setStep(5)}
                      className="bg-accent hover:bg-accent/90 text-primary font-bold"
                    >
                      Revisar Agendamento
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && barber && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Confirmar Agendamento</h2>

                <div className="space-y-4 bg-primary/5 rounded-lg p-5 mb-6">
                  <div className="flex items-center gap-3">
                    <Scissors className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Serviço{selectedServices.length > 1 ? "s" : ""}</p>
                      <p className="font-semibold text-primary">{selectedServicesData.map((s) => s.name).join(" + ")}</p>
                    </div>
                    <span className="ml-auto text-accent font-bold">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Barbeiro</p>
                      <p className="font-semibold text-primary">{barber.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Data</p>
                      <p className="font-semibold text-primary">{formatDate(selectedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Horário</p>
                      <p className="font-semibold text-primary">{selectedTime}</p>
                    </div>
                    <span className="ml-auto text-muted-foreground text-sm">
                      Duração: {totalDuration} min
                    </span>
                  </div>
                  {notes && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">Observações</p>
                      <p className="text-sm text-primary">{notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                  <Button
                    onClick={handleConfirm}
                    className="flex-1 bg-accent hover:bg-accent/90 text-primary font-bold"
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
