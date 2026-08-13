import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scissors, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success("Login realizado com sucesso!");
      setLocation("/dashboard");
    } else {
      toast.error(result.error || "Erro ao fazer login");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await register({
      name,
      email,
      password,
      phone,
      role: "client",
    });
    if (result.success) {
      toast.success("Cadastro realizado com sucesso!");
      setLocation("/dashboard");
    } else {
      toast.error(result.error || "Erro ao cadastrar");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 border border-accent/20 rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-accent/10 rounded-full" />
        <div className="absolute top-1/3 right-10 w-2 h-2 bg-accent/40 rounded-full" />
        <div className="absolute bottom-1/3 left-20 w-3 h-3 bg-accent/30 rounded-full" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 rounded-full overflow-hidden border-2 border-accent mb-4 shadow-md">
            <img src="/uploads/logo-major.png" alt="Major Logo" className="w-full h-full object-cover" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary" style={{ fontFamily: "Playfair Display" }}>
            MAJOR BARBEARIA
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wide"
                disabled={loading}
              >
                {loading ? "Entrando..." : <><LogIn className="w-4 h-4 mr-2" /> ENTRAR</>}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-reg">E-mail</Label>
                <Input
                  id="email-reg"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-reg">Senha</Label>
                <Input
                  id="password-reg"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-primary font-bold tracking-wide"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : <><UserPlus className="w-4 h-4 mr-2" /> CRIAR CONTA</>}
              </Button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-accent font-semibold hover:underline"
              >
                {mode === "login" ? "Criar conta" : "Fazer login"}
              </button>
            </p>
          </div>

          {/* Demo credentials info */}
          {mode === "login" && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground font-medium mb-2">Contas de teste:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Admin:</strong> admin@barbearia.com / 123456</p>
                <p><strong>Barbeiro:</strong> joao@barbearia.com / 123456</p>
                <p><strong>Cliente:</strong> Crie uma nova conta</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
