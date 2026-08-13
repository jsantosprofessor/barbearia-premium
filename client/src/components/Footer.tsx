import { MapPin, Phone, Mail, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Footer Component
 * Design: Contact information, social links, and business details
 * Features: Location, phone, email, social media, Chat CTA
 */
export default function Footer() {
  const { user } = useAuth();

  const contactInfo = [
    {
      icon: MapPin,
      label: "Endereço",
      value: "Rua Belterra 291 - Santo Amaro",
      href: "https://maps.google.com/?q=Rua+Belterra+291+Santo+Amaro",
    },
    {
      icon: Phone,
      label: "Telefone",
      value: "+55 12 98807-6419",
      href: "tel:+5512988076419",
    },
    {
      icon: Mail,
      label: "Email",
      value: "joãotemperado@gmail.com",
      href: "mailto:joãotemperado@gmail.com",
    },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/mari_gab1_",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/5512992000275",
    },
  ];

  return (
    <footer id="contato" className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/uploads/logo-major.png"
                alt="Major Barbearia Logo"
                className="w-12 h-12 rounded-full object-cover border border-accent/40"
              />
              <div>
                <h3 className="text-xl font-bold tracking-wider" style={{ fontFamily: "Montserrat" }}>
                  MAJOR
                </h3>
                <p className="text-xs text-accent tracking-widest">BARBEARIA</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Experiência premium em barbearia. Técnica avançada, atendimento personalizado e café artesanal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold tracking-wider mb-6" style={{ fontFamily: "Montserrat" }}>
              LINKS RÁPIDOS
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Início", href: "#inicio" },
                { label: "Serviços", href: "#servicos" },
                { label: "Galeria", href: "#galeria" },
                { label: "Contato", href: "#contato" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat CTA */}
          <div>
            <h4 className="font-bold tracking-wider mb-6" style={{ fontFamily: "Montserrat" }}>
              AGENDAMENTO ONLINE
            </h4>
            <p className="text-primary-foreground/80 mb-6">
              Agende seu horário online ou converse com nossos barbeiros diretamente pelo chat.
            </p>
            <a href={user ? "/agendar" : "/login"}>
              <Button className="bg-accent text-primary hover:bg-accent/90 font-bold tracking-wide w-full">
                AGENDAR ONLINE
              </Button>
            </a>
            {user && (
              <a href="/chat" className="block mt-3">
                <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  CHAT COM BARBEIRO
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Contact Info */}
            <div className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <a
                    key={info.label}
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 hover:text-accent transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-primary-foreground/60 uppercase tracking-widest">
                        {info.label}
                      </p>
                      <p className="font-semibold group-hover:text-accent transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="flex justify-start md:justify-end gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary-foreground/10 hover:bg-accent hover:text-primary rounded-lg flex items-center justify-center transition-all duration-300"
                    aria-label={link.label}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/20 py-6 bg-primary-foreground/5">
        <div className="container text-center text-sm text-primary-foreground/60">
          <p>
            © {new Date().getFullYear()} Major Barbearia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
