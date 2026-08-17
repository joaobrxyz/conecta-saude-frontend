import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type ApptStatus = 'finalizado' | 'aguardando' | 'confirmado' | 'tele';

interface Appt {
  id: number;
  startH: number;
  startM: number;
  endH: number;
  endM: number;
  patient: string;
  reason: string;
  status: ApptStatus;
  type: 'presencial' | 'tele' | 'retorno';
}

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.html'
})
export class Schedule {
  // Constantes do Calendário
  WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Configurações da Timeline
  START_HOUR = 8;
  END_HOUR = 18;
  HOUR_HEIGHT = 72; // px por hora

  // Estados Iniciais
  calYear = 2026;
  calMonth = 7; // Agosto
  selectedDay = 10;
  activeView: 'Dia' | 'Semana' | 'Mês' = 'Dia';
  viewOptions: ('Dia' | 'Semana' | 'Mês')[] = ['Dia', 'Semana', 'Mês'];

  filters = {
    presencial: true,
    tele: true,
    retorno: true,
    confirmado: true,
    aguardando: true,
    finalizado: true,
  };

  APPOINTMENTS: Appt[] = [
    { id: 1, startH: 8,  startM: 0,  endH: 9,  endM: 0,  patient: 'Ana Lima',       reason: 'Check-up Anual',         status: 'finalizado', type: 'presencial' },
    { id: 2, startH: 9,  startM: 30, endH: 10, endM: 0,  patient: 'Carlos Eduardo', reason: 'Retorno de Exames',      status: 'aguardando', type: 'retorno'    },
    { id: 3, startH: 10, startM: 30, endH: 11, endM: 30, patient: 'Fernanda Rocha', reason: 'Primeira Consulta',      status: 'confirmado', type: 'presencial' },
    { id: 4, startH: 14, startM: 0,  endH: 15, endM: 0,  patient: 'Beatriz Cunha',  reason: 'Telemedicina',           status: 'tele',       type: 'tele'       },
  ];

  STATUS_CFG: Record<ApptStatus, { border: string; bg: string; badge: string; badgeText: string; label: string }> = {
    finalizado: { border: '#16A34A', bg: '#F0FDF4', badge: '#DCFCE7', badgeText: '#15803D', label: 'Finalizado'  },
    aguardando: { border: '#1565C0', bg: '#EFF6FF', badge: '#DBEAFE', badgeText: '#1565C0', label: 'Aguardando'  },
    confirmado: { border: '#94A3B8', bg: '#F8FAFC', badge: '#F1F5F9', badgeText: '#64748B', label: 'Confirmado'  },
    tele:       { border: '#7C3AED', bg: '#FAF5FF', badge: '#EDE9FE', badgeText: '#6D28D9', label: 'Telemedicina' },
  };

  // Funções Utilitárias da Timeline
  minutesFromStart(h: number, m: number) {
    return (h - this.START_HOUR) * 60 + m;
  }

  toTopPx(h: number, m: number) {
    return (this.minutesFromStart(h, m) / 60) * this.HOUR_HEIGHT;
  }

  toDurationPx(startH: number, startM: number, endH: number, endM: number) {
    const mins = (endH - startH) * 60 + (endM - startM);
    return (mins / 60) * this.HOUR_HEIGHT;
  }

  // Linha do Tempo Atual (Fixa em 11:54 para o design)
  CURRENT_H = 11;
  CURRENT_M = 54;
  CURRENT_TOP = this.toTopPx(this.CURRENT_H, this.CURRENT_M);
  TOTAL_HEIGHT = (this.END_HOUR - this.START_HOUR) * this.HOUR_HEIGHT;

  // Getters Dinâmicos
  get daysInMonth() { return new Date(this.calYear, this.calMonth + 1, 0).getDate(); }
  get firstDow() { return new Date(this.calYear, this.calMonth, 1).getDay(); }
  
  get cells(): (number | null)[] {
    const arr: (number | null)[] = Array(this.firstDow).fill(null);
    for (let i = 1; i <= this.daysInMonth; i++) arr.push(i);
    return arr;
  }

  get hours() {
    return Array.from({ length: this.END_HOUR - this.START_HOUR + 1 }, (_, i) => this.START_HOUR + i);
  }

  get filteredAppts() {
    return this.APPOINTMENTS.filter((a) => {
      const typeOk = (a.type === 'presencial' && this.filters.presencial) ||
                     (a.type === 'tele' && this.filters.tele) ||
                     (a.type === 'retorno' && this.filters.retorno);
      const statusOk = (a.status === 'confirmado' && this.filters.confirmado) ||
                       (a.status === 'aguardando' && this.filters.aguardando) ||
                       (a.status === 'finalizado' && this.filters.finalizado) ||
                       (a.status === 'tele' && this.filters.tele);
      return typeOk && statusOk;
    });
  }

  get dateLabel() {
    return `Hoje, ${this.selectedDay} de ${this.MONTH_NAMES[this.calMonth]} de ${this.calYear}`;
  }

  toggleFilter(key: keyof typeof this.filters) {
    this.filters[key] = !this.filters[key];
  }

  formatHourLabel(h: number) {
    return String(h).padStart(2, '0') + ':00';
  }

  formatTimeRange(appt: Appt) {
    return `${String(appt.startH).padStart(2, '0')}:${String(appt.startM).padStart(2, '0')} – ${String(appt.endH).padStart(2, '0')}:${String(appt.endM).padStart(2, '0')}`;
  }
}