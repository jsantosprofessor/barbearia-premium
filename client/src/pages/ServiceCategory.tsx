import { useParams, useLocation } from "wouter";
import { useEffect } from "react";
import { ChevronLeft, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serviceCategories } from "@/data/services";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Service Category Page
 * Design: Detailed list of services within a category
 * Features: Service cards with price, duration, description, and CTA
 */
export default function ServiceCategory() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const categoryId = params.categoryId;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  const category = serviceCategories.find((cat) => cat.id === categoryId);

  const handleBookClick = (serviceId: string) => {
    if (!isAuthenticated) {
      setLocation("/login");
    } else {
      setLocation(`/agendar`);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 container py-20 text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Categoria não encontrada</h1>
          <Button onClick={() => setLocation("/#servicos")}>Voltar aos Serviços</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-24">
        <div className="container py-12">
          {/* Back Button */}
          <button
            onClick={() => setLocation("/#servicos")}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Voltar aos Serviços</span>
          </button>

          {/* Category Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-3xl">✂️</span>
              </div>
              <div>
                <h1
                  className="text-4xl md:text-5xl font-bold text-primary tracking-wider"
                  style={{ fontFamily: "Playfair Display" }}
                >
                  {category.name}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {category.items.length} serviços disponíveis
                </p>
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-6">
            {category.items.map((service) => (
              <div
                key={service.id}
                className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300"
              >
                {/* Service Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231a3a34' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' fill='%23d4a574' text-anchor='middle' dy='.3em'%3E%E2%9C%82%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                </div>

                {/* Service Info */}
                <div className="flex-1">
                  <div className="mb-3">
                    <h3
                      className="text-xl font-bold text-primary tracking-wide"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      {service.name}
                    </h3>
                    {service.planAvailable && (
                      <div className="inline-block mt-2 px-3 py-1 bg-accent/20 border border-accent rounded-full">
                        <span className="text-xs font-semibold text-accent">
                          ⭐ {service.planText}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Price and Duration */}
                  <div className="flex flex-wrap items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-accent" />
                      <span className="text-lg font-bold text-accent">
                        R$ {service.price.toFixed(2)}
                      </span>
                    </div>
                    {service.duration > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-primary">
                          {service.duration} min
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex-shrink-0 flex items-end">
                  <Button
                    onClick={() => handleBookClick(service.id)}
                    className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-primary font-bold px-6 py-3"
                  >
                    {isAuthenticated ? "Agendar" : "Fazer Login para Agendar"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
