export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string;
  planAvailable?: boolean;
  planText?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  items: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "cortes",
    name: "Cortes Masculinos",
    icon: "Scissors",
    items: [
      {
        id: "corte-classico",
        name: "Corte Clássico / Tesoura",
        description: "Corte tradicional inteiramente executado na tesoura com acabamento artesanal refinado. Ideal para um visual sofisticado, alinhado e sóbrio para o dia a dia corporativo. Inclui lavagem com shampoo premium, massagem capilar relaxante e finalização com pomada modeladora de alta fixação.",
        price: 50,
        duration: 35,
        image: "/manus-storage/service-corte-classico.png",
      },
      {
        id: "corte-degrade-fade",
        name: "Corte Degradê / Fade (Low, Mid & High)",
        description: "O corte mais pedido da atualidade com transição milimétrica e impecável nas laterais (escolha entre Low, Mid ou High Fade). Inclui navalhado perfeito na nuca e costeletas, lavagem revitalizante e modelagem profissional de alta precisão.",
        price: 60,
        duration: 45,
        image: "/manus-storage/service-corte-degrade.png",
        planAvailable: true,
        planText: "Mais Procurado",
      },
      {
        id: "corte-social-executivo",
        name: "Corte Social Executivo",
        description: "Corte com laterais em máquina social (pente 3 ou superior) e topo na tesoura com caimento perfeito. Desenvolvido especialmente para homens de negócios que buscam praticidade sem abrir mão de extrema elegância e postura formal.",
        price: 55,
        duration: 35,
        image: "/manus-storage/service-corte-social.png",
      },
      {
        id: "corte-texturizado-crop",
        name: "Corte French Crop / Texturizado",
        description: "Estilo moderno com franja reta ou texturizada para a frente e laterais em fade marcante. Utiliza técnica de desbaste com navalhete para criar volume controlado, movimento e um aspecto despojado e jovem.",
        price: 60,
        duration: 45,
        image: "/manus-storage/service-corte-crop.png",
      },
      {
        id: "corte-buzz-cut",
        name: "Corte Buzz Cut (Raspado Militar)",
        description: "Corte ultrabaixo uniforme com máquina em todo o couro cabeludo, acompanhado de contornos ultra nítidos feitos na navalha. Prático, limpo, moderno e com baixa manutenção para o dia a dia intenso.",
        price: 40,
        duration: 25,
        image: "/manus-storage/service-corte-buzz.png",
      },
      {
        id: "corte-infantil",
        name: "Corte Kids (Infantil - até 12 anos)",
        description: "Corte especializado para os pequenos em um ambiente lúdico, climatizado e com total paciência e segurança. Nossos barbeiros são treinados para tornar a experiência divertida e agradável para a criança e tranquila para os pais.",
        price: 45,
        duration: 30,
        image: "/manus-storage/service-corte-infantil.png",
      },
    ],
  },
  {
    id: "barba",
    name: "Barba & Bigode",
    icon: "Droplets",
    items: [
      {
        id: "barba-completa",
        name: "Barba Terapia Completa",
        description: "Experiência relaxante de barbearia tradicional. Inclui compressas quentes com óleos essenciais para abertura dos poros, aplicação de espuma cremosa com pincel de cerdas naturais, barbear rente com navalha esterilizada, massagem facial revigorante e bálsamo pós-barba hidratante.",
        price: 45,
        duration: 40,
        image: "/manus-storage/service-barba-completa.png",
        planAvailable: true,
        planText: "Recomendado",
      },
      {
        id: "barba-aparada",
        name: "Barba Modelada & Alinhada",
        description: "Manutenção e desenho de barba com máquina e acabamento preciso no navalhete. Perfeito para quem deseja manter o comprimento atual alinhado, simétrico e com contornos impecáveis nas bochechas e pescoço.",
        price: 30,
        duration: 25,
        image: "/manus-storage/service-barba-aparada.png",
      },
      {
        id: "barba-terapia-express",
        name: "Barba Express com Toalha Fria",
        description: "Acabamento rápido e revigorante para quem tem pressa. Alinhamento de contornos com máquina e navalha, finalizado com tônico refrescante e toalha fria para tonificar a pele.",
        price: 25,
        duration: 20,
        image: "/manus-storage/service-barba-express.png",
      },
    ],
  },
  {
    id: "combos",
    name: "Combos Exclusivos",
    icon: "Crown",
    items: [
      {
        id: "combo-gentleman",
        name: "Combo Gentleman (Corte + Barba Terapia)",
        description: "O pacote completo do verdadeiro cavalheiro. Inclui qualquer estilo de corte de cabelo à sua escolha, seguido da nossa renomada Barba Terapia com compressas quentes, toalhas aromáticas e finalização de alto padrão. Economia e sofisticação reunidas.",
        price: 95,
        duration: 75,
        image: "/manus-storage/service-combo.png",
        planAvailable: true,
        planText: "Melhor Custo-Benefício",
      },
      {
        id: "combo-vip-executive",
        name: "Combo VIP Executive (Corte + Barba + Hidratação)",
        description: "Tratamento de realeza para momentos importantes. Contempla corte de cabelo personalizado, barba terapia completa e tratamento capilar de hidratação profunda com touca térmica para revitalizar fios e couro cabeludo.",
        price: 130,
        duration: 90,
        image: "/manus-storage/service-combo-vip.png",
        planAvailable: true,
        planText: "Experiência Completa",
      },
      {
        id: "combo-pai-filho",
        name: "Combo Pai & Filho",
        description: "Momento especial de conexão entre pai e filho. Inclui 1 Corte Masculino Adulto (qualquer estilo) + 1 Corte Infantil, realizados com atenção e carinho para que ambos saiam com o visual renovado e impecável.",
        price: 85,
        duration: 60,
        image: "/manus-storage/service-combo-pai-filho.png",
      },
    ],
  },
  {
    id: "tratamentos",
    name: "Tratamentos & Cuidados",
    icon: "Sparkles",
    items: [
      {
        id: "hidratacao-cabelo",
        name: "Hidratação Capilar Profunda (Matrix)",
        description: "Tratamento intensivo de reposição hídrica e nutritiva para cabelos ressecados, opacos ou danificados por químicas e poluição. Devolve o brilho natural, maciez e vitalidade aos fios em apenas 30 minutos.",
        price: 45,
        duration: 30,
        image: "/manus-storage/service-hidratacao.png",
      },
      {
        id: "pigmentacao-barba",
        name: "Pigmentação de Barba ou Cabelo",
        description: "Técnica profissional de correção e camuflagem de falhas na barba ou cabelos grisalhos utilizando produtos dermatologicamente testados de efeito extremamente natural e duradouro.",
        price: 85,
        duration: 45,
        image: "/manus-storage/service-pigmentacao.png",
      },
      {
        id: "sobrancelha-navalha",
        name: "Design de Sobrancelha na Navalha",
        description: "Alinhamento e limpeza do design das sobrancelhas masculinas com navalha descartável, mantendo a naturalidade da expressão e eliminando fios indesejados entre as sobrancelhas.",
        price: 25,
        duration: 15,
        image: "/manus-storage/service-sobrancelha.png",
      },
      {
        id: "limpeza-pele-express",
        name: "Limpeza de Pele Facial Express",
        description: "Remoção de cravos, células mortas e impurezas da pele do rosto. Inclui esfoliação suave, extração de cravos na zona T, máscara descongestionante e protetor solar. Pele limpa e revigorada.",
        price: 70,
        duration: 40,
        image: "/manus-storage/service-limpeza-pele.png",
      },
      {
        id: "relaxamento-capilar",
        name: "Relaxamento / Alisamento Capilar",
        description: "Redução de volume e controle de cachos rebeldes com produtos de alta qualidade que preservam a saúde dos fios. Alinhamento perfeito com durabilidade de até 60 dias.",
        price: 90,
        duration: 50,
        image: "/manus-storage/service-relaxamento.png",
      },
    ],
  },
];

export const barbers = [
  {
    id: "barber-1",
    name: "João Temperado",
    role: "Master Barber & Fundador",
    image: "/manus-storage/barber-joao.png",
    specialties: ["Cortes Clássicos", "Barba Terapia", "Degradê Avançado"],
    rating: 4.9,
  },
  {
    id: "barber-2",
    name: "Carlos Silva",
    role: "Senior Barber & Visagista",
    image: "/manus-storage/barber-carlos.png",
    specialties: ["Cortes Executivos", "Pigmentação", "Tratamentos"],
    rating: 4.8,
  },
  {
    id: "barber-3",
    name: "Pedro Santos",
    role: "Barber & Especialista Kids",
    image: "/manus-storage/barber-pedro.png",
    specialties: ["French Crop", "Corte Infantil", "Barba Modelada"],
    rating: 4.7,
  },
  {
    id: "barber-4",
    name: "Lucas Mendes",
    role: "Master Stylist",
    image: "/manus-storage/barber-lucas.png",
    specialties: ["Degradê", "Relaxamento", "Barba Terapia"],
    rating: 4.9,
  },
];

export const workingHours = {
  start: 9, // 9:00
  end: 19, // 19:00
  slotDuration: 30, // minutes
  lunchStart: 12,
  lunchEnd: 13,
};
