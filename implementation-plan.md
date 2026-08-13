# Plano de Implementação

## Problemas Identificados
1. ChatContext usa IDs "barber-joao" mas AuthContext usa "barber-001" → barbeiro logado não vê mensagens
2. Admin usa "admin-001" no Auth mas "admin" no ChatContext → mesmo problema
3. Booking.tsx só permite 1 serviço, precisa multi-seleção
4. Bloqueio de horários usa slots de 15min mas precisa bloquear intervalos completos
5. Chat não tem botão voltar visível (só mobile)

## Arquivos para Modificar
- Booking.tsx: multi-seleção de serviços, cálculo de duração, bloqueio inteligente
- ChatContext.tsx: corrigir IDs, adicionar marcação de mensagens como lidas, allUsers para barbeiros usar clientIDs
- Chat.tsx: botão voltar sempre visível
- BarberDashboard.tsx: gestão completa (aceitar/confirmar/concluir), botão voltar no chat
- AppointmentContext.tsx: adicionar serviceIds array, totalDuration, totalPrice

## Implementação
1. Atualizar Appointment interface para serviceIds[] e totalDuration
2. Reescrever Booking.tsx com multi-seleção (checkboxes)
3. Melhorar getOccupiedSlots para bloquear intervalos completos
4. Corrigir ChatContext IDs (mapear barberId para chatId)
5. Adicionar botão voltar permanente no Chat.tsx e BarberDashboard
6. Melhorar BarberDashboard com gestão completa
