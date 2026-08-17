import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  totalTeam = 12;

  kpis = [
    { label: 'Usuários Ativos (Equipe)', value: '12', icon: 'bi-shield-check', iconBg: '#EBF3FF', iconColor: '#1565C0', badge: '↑ 2 este mês', badgeColor: '#1565C0' },
    { label: 'Consultas Realizadas', value: '1.240', icon: 'bi-calendar-check', iconBg: '#F0FDF4', iconColor: '#16A34A', badge: '↑ 8.3%', badgeColor: '#16A34A' },
    { label: 'Taxa de Absenteísmo', value: '8.5%', icon: 'bi-person-dash', iconBg: '#FFF7ED', iconColor: '#D97706', badge: '↑ 1.2pp', badgeColor: '#D97706' },
    { label: 'Pacientes Cadastrados', value: '3.450', icon: 'bi-people', iconBg: '#F5F3FF', iconColor: '#7C3AED', badge: '↑ 127 novos', badgeColor: '#7C3AED' },
  ];

  months = ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
  agendadas = [210, 245, 230, 270, 255, 290];
  realizadas = [185, 220, 210, 248, 235, 268];
  maxChartVal = 320;

  teamRoles = [
    { role: 'Médicos', count: 8, color: '#1565C0' },
    { role: 'Recepção / Atendimento', count: 3, color: '#16A34A' },
    { role: 'Administradores', count: 1, color: '#7C3AED' },
  ];

  auditLogs = [
    { user: 'Carlos Admin', action: 'Cadastro de novo usuário (Dra. Julia)', time: 'Hoje, 09:00', status: 'Aprovado', statusCls: 'bg-[#DCFCE7] text-[#15803D]', statusIcon: 'bi-check-circle', avatar: 'CA', grad: 'from-[#3B28CC] to-[#1565C0]' },
    { user: 'Dr. Rafael Silva', action: 'Inclusão de nova especialidade no perfil', time: 'Hoje, 08:15', status: 'Registro Salvo', statusCls: 'bg-[#DBEAFE] text-[#1D4ED8]', statusIcon: 'bi-info-circle', avatar: 'RS', grad: 'from-[#0284C7] to-[#0EA5E9]' },
    { user: 'Camila Santos (Recepção)', action: 'Tentativa de login falha', time: 'Ontem, 22:40', status: 'Bloqueado', statusCls: 'bg-[#FEE2E2] text-[#B91C1C]', statusIcon: 'bi-x-circle', avatar: 'CS', grad: 'from-[#BE185D] to-[#DB2777]' },
  ];

  getBarHeight(value: number): string {
    return `${(value / this.maxChartVal) * 100}%`;
  }
}