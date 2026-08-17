import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  stats = [
    { icon: 'bi-calendar', label: 'Consultas Hoje', value: 8, accent: '#1565C0', badge: null },
    { icon: 'bi-people', label: 'Na Sala de Espera', value: 2, accent: '#D97706', badge: '1 em atraso' },
    { icon: 'bi-file-earmark-text', label: 'Laudos Pendentes', value: 3, accent: '#7C3AED', badge: null }
  ];

  queue = [
    { id: 1, name: 'Carlos Eduardo', age: 45, reason: 'Retorno — Avaliação de Exames', avatar: 'CE', status: 'waiting', arrivedAt: '10:05', scheduled: '10:30' },
    { id: 2, name: 'Fernanda Rocha', age: 38, reason: 'Consulta de rotina — Pressão arterial', avatar: 'FR', status: 'arrived', arrivedAt: '10:15', scheduled: '11:00' },
    { id: 3, name: 'Roberto Alves', age: 62, reason: 'Dor no peito — Primeira consulta', avatar: 'RA', status: 'scheduled', arrivedAt: null, scheduled: '11:30' },
    { id: 4, name: 'Silvia Monteiro', age: 51, reason: 'Acompanhamento pós-cirúrgico', avatar: 'SM', status: 'scheduled', arrivedAt: null, scheduled: '14:00' },
  ];

  schedule = [
    { time: '08:00', patient: 'Ana Lima', reason: 'Check-up anual', status: 'done', type: 'presencial' },
    { time: '09:00', patient: 'Paulo Saraiva', reason: 'Eletrocardiograma — Resultado', status: 'done', type: 'presencial' },
    { time: '10:30', patient: 'Carlos Eduardo', reason: 'Retorno — Avaliação de Exames', status: 'waiting', type: 'presencial' },
    { time: '11:00', patient: 'Fernanda Rocha', reason: 'Rotina — Pressão arterial', status: 'confirmed', type: 'presencial' },
    { time: '11:30', patient: 'Roberto Alves', reason: 'Primeira consulta — Dor no peito', status: 'confirmed', type: 'presencial' },
    { time: '14:00', patient: 'Beatriz Cunha', reason: 'Telemedicina — Revisão de exames', status: 'tele', type: 'tele' },
    { time: '15:00', patient: 'Jorge Menezes', reason: 'Acompanhamento cardíaco', status: 'confirmed', type: 'presencial' },
    { time: '16:30', patient: 'Cláudia Faria', reason: 'Resultado de holter', status: 'confirmed', type: 'presencial' },
  ];

  pendingReports = [
    { patient: 'Ana Lima', exam: 'Eletrocardiograma', due: 'Hoje até 18h', urgent: true },
    { patient: 'Paulo Saraiva', exam: 'Ecocardiograma', due: 'Amanhã', urgent: false },
    { patient: 'Silvia Monteiro', exam: 'Holter 24h', due: '14 Ago', urgent: false },
  ];

  quickActions = [
    { icon: 'bi-person-plus', label: 'Novo paciente', color: '#1565C0', bg: '#EBF3FF' },
    { icon: 'bi-camera-video', label: 'Iniciar telemedicina', color: '#7C3AED', bg: '#F3E8FF' },
    { icon: 'bi-file-earmark-medical', label: 'Emitir atestado', color: '#16A34A', bg: '#DCFCE7' },
  ];

  statusConfig: Record<string, any> = {
    done:      { color: '#16A34A', label: 'Finalizado',  bg: '#DCFCE7', text: '#15803D' },
    waiting:   { color: '#D97706', label: 'Em Espera',   bg: '#FEF3C7', text: '#B45309' },
    confirmed: { color: '#94A3B8', label: 'Confirmado',  bg: '#F1F5F9', text: '#64748B' },
    tele:      { color: '#7C3AED', label: 'Telemedicina',bg: '#F3E8FF', text: '#7C3AED' },
  };

  get todayDate(): string {
    return new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  }

  getAvatarColor(id: number): string {
    const colors = [
      'linear-gradient(135deg,#1565C0,#42A5F5)',
      'linear-gradient(135deg,#16A34A,#4ADE80)',
      'linear-gradient(135deg,#7C3AED,#A78BFA)',
      'linear-gradient(135deg,#D97706,#FCD34D)',
      'linear-gradient(135deg,#DC2626,#FCA5A5)',
    ];
    return colors[id % colors.length];
  }
}