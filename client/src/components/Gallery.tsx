/**
 * Gallery Component
 * Design: Asymmetric grid of barbershop images
 * Features: Responsive grid, hover effects, image showcase
 */
const galleryImages = [
  {
    id: 1,
    src: "/uploads/decoracao-principal.png",
    alt: "Interior e Decoração Principal da Major Barbearia",
    span: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    id: 2,
    src: "/uploads/jovem-no-barbeiro-a-cortar-o-cabelo_1303-26254.avif",
    alt: "Cliente cortando o cabelo",
    span: "col-span-1",
  },
  {
    id: 3,
    src: "/uploads/images (1).jpg",
    alt: "Atendimento de barba e cabelo",
    span: "col-span-1",
  },
  {
    id: 4,
    src: "/uploads/images (5).jpg",
    alt: "Ambiente interno",
    span: "col-span-1",
  },
  {
    id: 5,
    src: "/uploads/images (6).jpg",
    alt: "Detalhes do corte",
    span: "col-span-1",
  },
  {
    id: 6,
    src: "/uploads/images (8).jpg",
    alt: "Estilo e acabamento",
    span: "col-span-1 md:col-span-2",
  },
];

export default function Gallery() {
  return (
    <section id="galeria" className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-accent" />
            <p className="text-sm font-bold tracking-widest text-accent uppercase" style={{ fontFamily: "Montserrat" }}>
              Conheça nosso espaço
            </p>
            <div className="w-12 h-0.5 bg-accent" />
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold text-primary mb-4 tracking-wider"
            style={{ fontFamily: "Playfair Display" }}
          >
            NOSSA BARBEARIA
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Um ambiente premium que reflete nossa dedicação à qualidade, estilo e ao conforto do cliente.
          </p>
        </div>

        {/* Gallery Grid - Asymmetric & Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[280px]">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className={`${image.span} group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-black/5`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm font-medium tracking-wide">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
