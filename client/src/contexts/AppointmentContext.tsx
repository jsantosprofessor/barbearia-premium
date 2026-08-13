import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  barberId: string;
  barberName: string;
  serviceIds: string[];
  serviceNames: string[];
  serviceName: string; // display string like "Corte Clássico + Barba Completa"
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // total duration in minutes
  price: number; // total price
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  notes?: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  getClientAppointments: () => Appointment[];
  getBarberAppointments: (barberId: string) => Appointment[];
  getDayAppointments: (barberId: string, date: string) => Appointment[];
  getOccupiedSlots: (barberId: string, date: string) => string[];
  createAppointment: (data: Omit<Appointment, "id" | "createdAt">) => Appointment;
  cancelAppointment: (id: string) => void;
  updateStatus: (id: string, status: Appointment["status"]) => void;
  getAllAppointments: () => Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

const STORAGE_KEY = "barbearia_premium_appointments";

function loadAppointments(): Appointment[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Migrate old format to new format
      return data.map((a: any) => {
        if (a.serviceIds) return a;
        // Old format migration
        return {
          ...a,
          serviceIds: a.serviceId ? [a.serviceId] : [],
          serviceNames: a.serviceName ? [a.serviceName] : [],
          price: a.price || 0,
        };
      });
    }
  } catch {}
  return [];
}

function saveAppointments(appointments: Appointment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    setAppointments(loadAppointments());
  }, []);

  const getClientAppointments = useCallback(() => {
    if (!user) return [];
    return appointments.filter(
      (a) => a.clientId === user.id && a.status !== "cancelled"
    );
  }, [appointments, user]);

  const getBarberAppointments = useCallback(
    (barberId: string) => {
      return appointments.filter(
        (a) => a.barberId === barberId && a.status !== "cancelled"
      );
    },
    [appointments]
  );

  const getDayAppointments = useCallback(
    (barberId: string, date: string) => {
      return appointments.filter(
        (a) => a.barberId === barberId && a.date === date && a.status !== "cancelled"
      );
    },
    [appointments]
  );

  const getOccupiedSlots = useCallback(
    (barberId: string, date: string) => {
      const dayAppts = getDayAppointments(barberId, date);
      const occupied = new Set<string>();

      dayAppts.forEach((appt) => {
        const [hours, minutes] = appt.time.split(":").map(Number);
        let startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + appt.duration;

        // Mark every 30-min slot that overlaps with the appointment
        for (let slot = startMinutes; slot < endMinutes; slot += 30) {
          const h = Math.floor(slot / 60);
          const m = slot % 60;
          occupied.add(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        }
      });

      return Array.from(occupied);
    },
    [getDayAppointments]
  );

  const createAppointment = useCallback(
    (data: Omit<Appointment, "id" | "createdAt">) => {
      const newAppt: Appointment = {
        ...data,
        id: `appt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [...appointments, newAppt];
      setAppointments(updated);
      saveAppointments(updated);
      return newAppt;
    },
    [appointments]
  );

  const cancelAppointment = useCallback(
    (id: string) => {
      const updated = appointments.map((a) =>
        a.id === id ? { ...a, status: "cancelled" as const } : a
      );
      setAppointments(updated);
      saveAppointments(updated);
    },
    [appointments]
  );

  const updateStatus = useCallback(
    (id: string, status: Appointment["status"]) => {
      const updated = appointments.map((a) =>
        a.id === id ? { ...a, status } : a
      );
      setAppointments(updated);
      saveAppointments(updated);
    },
    [appointments]
  );

  const getAllAppointments = useCallback(() => {
    return appointments;
  }, [appointments]);

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        getClientAppointments,
        getBarberAppointments,
        getDayAppointments,
        getOccupiedSlots,
        createAppointment,
        cancelAppointment,
        updateStatus,
        getAllAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentProvider");
  }
  return context;
}
