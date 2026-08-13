import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hero Component
 * Design: Full-width hero with background image, dark overlay, and premium typography
 * Features: Large title in uppercase, subtitle in gold, CTA buttons, responsive
 */
export default function Hero() {
  const { user } = useAuth();
  return (
    <section
      id="inicio"
      className="relative w-full h-screen flex items-end pt-20 overflow-hidden"
      style={{
        backgroundImage: "url('/uploads/decoracao-principal.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 container pb-16 md:pb-24">
        <div className="max-w-2xl">
          {/* Subtitle with Gold Line */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-accent" />
            <p
              className="text-xs md:text-sm font-bold tracking-widest text-accent uppercase"
              style={{ fontFamily: "Montserrat" }}
            >
              São Paulo • SP • Est. 2023
            </p>
          </div>

          {/* Main Title */}
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-wider leading-tight"
            style={{ fontFamily: "Playfair Display" }}
          >
            MAJOR
            <br />
            BARBEARIA
          </h1>

          {/* Secondary Title */}
          <p
            className="text-lg md:text-2xl text-accent mb-6 tracking-widest font-semibold"
            style={{ fontFamily: "Montserrat" }}
          >
            & EXPERIÊNCIA ARTESANAL
          </p>

          {/* Description */}
          <p className="text-white/90 text-base md:text-lg mb-8 max-w-md leading-relaxed">
            Barbearia premium com técnica avançada, atendimento personalizado e café artesanal. Uma experiência completa do início ao fim.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={user ? "/agendar" : "/login"}>
              <Button
                className="bg-accent text-primary hover:bg-accent/90 font-bold tracking-wide px-8 py-6 text-base"
                size="lg"
              >
                {user ? "AGENDAR AGORA" : "FAZER LOGIN PARA AGENDAR"}
              </Button>
            </a>
            <a href="#servicos">
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-bold tracking-wide px-8 py-6 text-base"
                size="lg"
              >
                VER SERVIÇOS
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
