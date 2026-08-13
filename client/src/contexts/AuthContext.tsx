import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "client" | "barber" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  barberId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "barbearia_premium_auth";
const USERS_KEY = "barbearia_premium_users";

// Default admin account
const DEFAULT_ADMIN: User = {
  id: "admin-001",
  name: "Administrador",
  email: "admin@barbearia.com",
  role: "admin",
  phone: "",
};

// Default barbers
const DEFAULT_BARBERS: User[] = [
  {
    id: "barber-001",
    name: "João Temperado",
    email: "joao@barbearia.com",
    role: "barber",
    phone: "5512992000275",
    barberId: "barber-1",
  },
  {
    id: "barber-002",
    name: "Carlos Silva",
    email: "carlos@barbearia.com",
    role: "barber",
    phone: "5512998000111",
    barberId: "barber-2",
  },
  {
    id: "barber-003",
    name: "Pedro Santos",
    email: "pedro@barbearia.com",
    role: "barber",
    phone: "5512997000222",
    barberId: "barber-3",
  },
];

// Default password for all pre-seeded users
const DEFAULT_PASSWORD = "123456";

function getUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  // Initialize with defaults
  const defaultUsers = [DEFAULT_ADMIN, ...DEFAULT_BARBERS];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getPasswords(): Record<string, string> {
  try {
    const stored = localStorage.getItem("barbearia_premium_passwords");
    if (stored) return JSON.parse(stored);
  } catch {}
  const passwords: Record<string, string> = {};
  [DEFAULT_ADMIN, ...DEFAULT_BARBERS].forEach((u) => {
    passwords[u.email] = DEFAULT_PASSWORD;
  });
  localStorage.setItem("barbearia_premium_passwords", JSON.stringify(passwords));
  return passwords;
}

function savePassword(email: string, password: string) {
  const passwords = getPasswords();
  passwords[email] = password;
  localStorage.setItem("barbearia_premium_passwords", JSON.stringify(passwords));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const passwords = getPasswords();
    const storedPassword = passwords[email];

    if (!storedPassword || storedPassword !== password) {
      return { success: false, error: "E-mail ou senha incorretos." };
    }

    const users = getUsers();
    const foundUser = users.find((u) => u.email === email);
    if (!foundUser) {
      return { success: false, error: "Usuário não encontrado." };
    }

    setUser(foundUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
    return { success: true };
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const users = getUsers();
    const existing = users.find((u) => u.email === data.email);
    if (existing) {
      return { success: false, error: "Este e-mail já está cadastrado." };
    }

    const newUser: User = {
      id: `client-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
    };

    users.push(newUser);
    saveUsers(users);
    savePassword(data.email, data.password);

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
