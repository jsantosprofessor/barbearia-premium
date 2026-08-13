import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppointmentProvider } from "./contexts/AppointmentContext";
import { ChatProvider } from "./contexts/ChatContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import Chat from "./pages/Chat";
import AdminPanel from "./pages/AdminPanel";
import ClientDashboard from "./pages/ClientDashboard";
import BarberDashboard from "./pages/BarberDashboard";
import ServiceCategory from "@/pages/ServiceCategory";

// Protected route component - redirects to login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a3a2a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c9a96e]"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

// Route that should only be accessed when NOT authenticated
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a3a2a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c9a96e]"></div>
      </div>
    );
  }

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

// Admin-only route
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a3a2a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c9a96e]"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

// Barber-only route
function BarberRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a3a2a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c9a96e]"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (user.role !== "barber") {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/servicos/:categoryId" component={ServiceCategory} />

      {/* Auth route */}
      <Route path="/login">
        <AuthRoute>
          <Login />
        </AuthRoute>
      </Route>

      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardRouter />
        </ProtectedRoute>
      </Route>

      <Route path="/agendar">
        <ProtectedRoute>
          <Booking />
        </ProtectedRoute>
      </Route>

      <Route path="/chat">
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      </Route>

      {/* Admin route */}
      <Route path="/admin">
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      </Route>

      {/* Barber route */}
      <Route path="/barbeiro">
        <BarberRoute>
          <BarberDashboard />
        </BarberRoute>
      </Route>

      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Dashboard router - shows different dashboard based on role
function DashboardRouter() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminPanel />;
  }
  if (user?.role === "barber") {
    return <BarberDashboard />;
  }
  return <ClientDashboard />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <AppointmentProvider>
            <ChatProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </ChatProvider>
          </AppointmentProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
