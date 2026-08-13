# Barbearia Premium - Sistema de Agendamento

## Telas Implementadas

O sistema possui as seguintes telas funcionais:

### 1. Página Inicial (Home)
A página principal da barbearia mantém o design premium original com:
- Header com navegação (Início, Serviços, Galeria, Contato, Entrar, Agendar)
- Hero section com imagem de fundo e botões de ação
- Seção de categorias de serviços (Cortes Masculinos, Barba & Bigode, Tratamentos, Plano Mensal, Kids, Combos Especiais)
- Galeria do espaço
- Seção "Uma Barbearia de Verdade" com estatísticas
- Footer com links rápidos, contato e redes sociais

### 2. Tela de Login
Design elegante com fundo verde escuro degradê:
- Logo da barbearia centralizado
- Campos de e-mail e senha
- Botão "ENTRAR" com ícone de login
- Opção "Criar conta" para novos clientes
- Box informativo com credenciais de teste:
  - **Admin:** admin@barbearia.com / 123456
  - **Barbeiro:** joao@barbearia.com / 123456
  - **Cliente:** criar conta nova

### 3. Calendário Inteligente de Agendamento
Fluxo completo em 5 etapas com barra de progresso:

**Etapa 1 - Selecionar Serviço:**
- Categorias com ícones e descrições
- Serviços com nome, duração e preço
- Ex: Corte Clássico (30 min, R$ 45), Corte + Barba (45 min, R$ 70)

**Etapa 2 - Escolher Barbeiro:**
- Cards com foto, nome, título e avaliação (estrelas)
- João Temperado (Master Barber, 4.9)
- Carlos Silva (Senior Barber, 4.8)
- Pedro Santos (Barber, 4.7)

**Etapa 3 - Escolher Data:**
- Calendário mensal com navegação (anterior/próximo)
- Domingos desabilitados automaticamente
- Datas passadas desabilitadas
- Horários de funcionamento exibidos (Seg-Sáb, 9h-19h)

**Etapa 4 - Escolher Horário:**
- Grid de horários em blocos de 30 minutos
- Disponíveis em verde, ocupados em vermelho
- Intervalo de almoço (12:00-13:00) excluído
- Campo opcional de observações
- Botão "Revisar Agendamento"

**Etapa 5 - Confirmar:**
- Resumo completo: serviço, barbeiro, data, horário, duração
- Botão "Confirmar Agendamento"
- Redireciona para o dashboard com sucesso

### 4. Painel do Cliente (Dashboard)
- Saudação personalizada ("Olá, Maria Silva")
- Cards de acesso rápido: Agendar, Chat, Serviços
- Seção "Meus Agendamentos" com:
  - Horário, data, serviço, barbeiro, duração
  - Status (Pendente/Confirmado/Concluído)
  - Botão "Cancelar"

### 5. Chat Integrado
Interface de mensagens estilo WhatsApp:
- Painel lateral com lista de conversas
- Cada conversa mostra: avatar, nome, última mensagem, horário
- Indicador de mensagens não lidas (badge)
- Botão "Iniciar Conversa" para nova conversa
- Modal de seleção de usuário (Barbeiros + Administrador)
- Área de chat com:
  - Header com nome e tipo (Barbeiro/Cliente/Admin)
  - Mensagens enviadas à direita (verde), recebidas à esquerda
  - Campo de texto + botão de envio
- Responsivo para mobile

### 6. Painel Administrativo
Layout com 3 abas:

**Visão Geral:**
- 4 cards de estatísticas: Total Agendamentos, Pendentes, Concluídos, Hoje
- Tabela de agendamentos recentes com: Cliente, Serviço, Barbeiro, Data, Horário, Status

**Agendamentos:**
- Tabela completa com todos os agendamentos
- Ações: Aprovar (check verde) e Cancelar (X vermelho)
- Filtros por status

**Hoje:**
- Lista de agendamentos do dia atual
- Estado vazio com ícone de calendário quando não há agendamentos

### 7. Dashboard do Barbeiro
- Agenda pessoal com horários do dia
- Lista de clientes agendados
- Status dos serviços

### 8. Registro de Novo Cliente
- Campos: Nome completo, E-mail, Telefone, Senha
- Validação de formulário
- Após registro, redireciona automaticamente para o dashboard
- Toast de confirmação

## Tecnologias
- Vite + React + TypeScript
- Tailwind CSS com tema personalizado (verde escuro, dourado, marrom)
- shadcn/ui (botões, cards, inputs, tabs)
- Lucide React (ícones)
- localStorage para persistência de dados
- Context API para estado global
