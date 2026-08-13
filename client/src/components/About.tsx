import { Check } from "lucide-react";

/**
 * About Component
 * Design: Two-column layout with text and stats
 * Features: Brand story, values, testimonial quote
 */
export default function About() {
  const values = [
    "Técnica Avançada",
    "Atendimento Personalizado",
    "Produtos Premium",
    "Experiência Completa",
  ];

  const stats = [
    { number: "500+", label: "Clientes Satisfeitos" },
    { number: "100%", label: "Satisfação Garantida" },
    { number: "5+", label: "Anos de Tradição" },
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative">
            <img
              src="/uploads/equipe-quem-somos.png"
              alt="Equipe Major Barbearia"
              className="w-full rounded-xl shadow-2xl object-cover border-2 border-accent/30"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-lg -z-10" />
          </div>

          {/* Right: Content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-0.5 bg-accent" />
              <p className="text-sm font-bold tracking-widest text-accent uppercase" style={{ fontFamily: "Montserrat" }}>
                Quem somos
              </p>
            </div>

            <h2
              className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-wider"
              style={{ fontFamily: "Playfair Display" }}
            >
              UMA BARBEARIA
              <br />
              DE VERDADE
            </h2>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Nascemos com uma missão clara: provar que barbearia vai muito além do corte. É sobre o cuidado antes de chegar na cadeira, a atenção durante o serviço e o orgulho que você sente ao sair.
            </p>

            {/* Quote */}
            <div className="bg-primary/5 border-l-4 border-accent pl-6 py-4 mb-8">
              <p className="text-primary font-semibold italic text-lg">
                "Aqui, o cuidado começa antes do corte."
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {values.map((value) => (
                <div key={value} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-primary font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-accent mb-2">{stat.number}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
