import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type AppointmentStatus = 'Aguardando' | 'Confirmado' | 'Atrasado' | 'Bloqueio';

interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  type: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  status: AppointmentStatus;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarLetter: string;
  avatarColor: string;
  avatarBg: string;
}

@Component({
  selector: 'app-reception-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.html'
})
export class Agenda {
  // Constantes de Layout da Agenda
  START_HOUR = 8;
  END_HOUR = 18;
  HOUR_HEIGHT = 64; // px por hora
  TOTAL_HOURS = this.END_HOUR - this.START_HOUR;

  hours = Array.from({ length: this.TOTAL_HOURS + 1 }, (_, i) => this.START_HOUR + i);

  filterDoctor: string = '';

  DOCTORS: Doctor[] = [
    { id: 'rafael', name: 'Dr. Rafael Silva', specialty: 'Cardiologia', avatarLetter: 'R', avatarColor: '#1565C0', avatarBg: '#DBEAFE' },
    { id: 'ana', name: 'Dra. Ana Souza', specialty: 'Dermatologia', avatarLetter: 'A', avatarColor: '#16A34A', avatarBg: '#DCFCE7' },
    { id: 'marcos', name: 'Dr. Marcos Oliveira', specialty: 'Clínica Geral', avatarLetter: 'M', avatarColor: '#EA580C', avatarBg: '#FFEDD5' },
  ];

  APPOINTMENTS: Appointment[] = [
    { id: 'a1', doctorId: 'rafael', patientName: 'Carlos Eduardo', type: 'Retorno', startHour: 9, startMinute: 0, endHour: 10, endMinute: 0, status: 'Aguardando' },
    { id: 'a2', doctorId: 'ana', patientName: 'Fernanda Rocha', type: 'Consulta', startHour: 8, startMinute: 30, endHour: 9, endMinute: 30, status: 'Confirmado' },
    { id: 'a3', doctorId: 'ana', patientName: 'Marina Costa', type: 'Consulta', startHour: 10, startMinute: 30, endHour: 11, endMinute: 0, status: 'Atrasado' },
    { id: 'a4', doctorId: 'marcos', patientName: 'Bloqueio Médico', type: 'Reunião Clínica', startHour: 10, startMinute: 0, endHour: 11, endMinute: 0, status: 'Bloqueio' },
  ];

  STATUS_STYLES: Record<AppointmentStatus, { border: string; bg: string; badge: string; badgeText: string; text: string }> = {
    Aguardando: { border: '#1565C0', bg: '#EBF3FF', badge: '#DBEAFE', badgeText: '#1565C0', text: '#0D47A1' },
    Confirmado: { border: '#16A34A', bg: '#F0FDF4', badge: '#DCFCE7', badgeText: '#15803D', text: '#14532D' },
    Atrasado:   { border: '#DC2626', bg: '#FFF1F2', badge: '#FFE4E6', badgeText: '#DC2626', text: '#991B1B' },
    Bloqueio:   { border: '#94A3B8', bg: '#F8FAFC', badge: '#F1F5F9', badgeText: '#64748B', text: '#475569' },
  };

  get visibleDoctors() {
    if (!this.filterDoctor.trim()) return this.DOCTORS;
    const term = this.filterDoctor.toLowerCase();
    return this.DOCTORS.filter(d => 
      d.name.toLowerCase().includes(term) || d.specialty.toLowerCase().includes(term)
    );
  }

  getApptsForDoctor(docId: string): Appointment[] {
    return this.APPOINTMENTS.filter(a => a.doctorId === docId);
  }

  // Cálculos matemáticos para desenhar os blocos de horário
  minutesFromStart(hour: number, minute: number) {
    return (hour - this.START_HOUR) * 60 + minute;
  }

  getTopPx(appt: Appointment) {
    return (this.minutesFromStart(appt.startHour, appt.startMinute) / 60) * this.HOUR_HEIGHT;
  }

  getHeightPx(appt: Appointment) {
    const mins = this.minutesFromStart(appt.endHour, appt.endMinute) - this.minutesFromStart(appt.startHour, appt.startMinute);
    return (mins / 60) * this.HOUR_HEIGHT;
  }

  getStyle(status: AppointmentStatus) {
    return this.STATUS_STYLES[status];
  }

  formatHour(h: number) {
    return String(h).padStart(2, '0') + ':00';
  }
}