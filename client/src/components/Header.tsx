import { useState } from "react";
import { Menu, X, Calendar, MessageCircle, LayoutDashboard, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Header Component
 * Design: Premium barbershop header with dark green background, white text, and logo
 * Features: Fixed navigation, responsive mobile menu, logo/branding, auth-aware buttons
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Início", href: "#inicio" },
    { label: "Serviços", href: "#servicos" },
    { label: "Galeria", href: "#galeria" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header className="fixed top-0 w-full bg-primary text-primary-foreground z-50 shadow-lg">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/uploads/logo-major.png"
            alt="Major Barbearia Logo"
            className="w-10 h-10 rounded-full object-cover border border-accent/40"
          />
          <a href="/">
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-wider" style={{ fontFamily: "Montserrat" }}>
                MAJOR
              </h1>
              <p className="text-xs text-accent tracking-widest">BARBEARIA</p>
            </div>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium tracking-wide hover:text-accent transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <a href="/agendar">
                <Button
                  className="bg-accent text-primary hover:bg-accent/90 font-bold tracking-wide"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  AGENDAR
                </Button>
              </a>
              <a href="/chat">
                <Button
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  CHAT
                </Button>
              </a>
              <a href="/dashboard">
                <Button
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  size="sm"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  PAINEL
                </Button>
              </a>
              <Button
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-red-500/20"
                size="sm"
                onClick={logout}
              >
                SAIR
              </Button>
            </>
          ) : (
            <a href="/login">
              <Button
                className="bg-accent text-primary hover:bg-accent/90 font-bold tracking-wide"
                size="sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                ENTRAR
              </Button>
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-primary-foreground/10 rounded transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-primary border-t border-primary-foreground/10">
          <div className="container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium tracking-wide hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {user ? (
              <>
                <a href="/agendar" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-accent text-primary hover:bg-accent/90 font-bold tracking-wide">
                    <Calendar className="w-4 h-4 mr-2" />
                    AGENDAR
                  </Button>
                </a>
                <a href="/chat" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full border border-accent text-accent hover:bg-accent/10 font-bold tracking-wide">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    CHAT
                  </Button>
                </a>
                <a href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold tracking-wide">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    MEU PAINEL
                  </Button>
                </a>
                <Button
                  className="w-full border border-red-500/30 text-red-300 hover:bg-red-500/10 font-bold tracking-wide"
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                >
                  SAIR
                </Button>
              </>
            ) : (
              <a href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-accent text-primary hover:bg-accent/90 font-bold tracking-wide">
                  <LogIn className="w-4 h-4 mr-2" />
                  ENTRAR
                </Button>
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
