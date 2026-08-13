import { Scissors, Droplets, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { serviceCategories } from "@/data/services";

/**
 * Services Component
 * Design: Grid of service cards with icons, titles, and descriptions
 * Features: 3 services displayed in responsive grid, hover effects, clickable categories
 */
const iconMap: Record<string, React.ComponentType<any>> = {
  Scissors,
  Droplets,
  Sparkles,
};

const services = serviceCategories.map((cat) => ({
  id: cat.id,
  icon: iconMap[cat.icon] || Scissors,
  title: cat.name,
  description: `${cat.items.length} serviços disponíveis`,
}));

export default function Services() {
  const [, setLocation] = useLocation();

  const handleServiceClick = (categoryId: string) => {
    setLocation(`/servicos/${categoryId}`);
  };

  return (
    <section id="servicos" className="py-20 md:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-accent" />
            <p className="text-sm font-bold tracking-widest text-accent uppercase" style={{ fontFamily: "Montserrat" }}>
              O que fazemos
            </p>
            <div className="w-12 h-0.5 bg-accent" />
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-wider"
            style={{ fontFamily: "Playfair Display" }}
          >
            NOSSOS SERVIÇOS
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada serviço é cuidadosamente executado com técnica avançada e atenção ao detalhe.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="group p-8 bg-card rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 text-left cursor-pointer"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <Icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                  </div>
                </div>

                {/* Content */}
                <h3
                  className="text-xl font-bold text-primary mb-3 tracking-wide"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>

                {/* CTA */}
                <div className="text-accent font-semibold tracking-wide">
                  Ver Serviços →
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
