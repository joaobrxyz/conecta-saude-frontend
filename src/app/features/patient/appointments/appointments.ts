import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled_patient' | 'cancelled_clinic';

export interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  crm: string;
  date: string;
  time: string;
  location: string;
  reason: string;
  status: AppointmentStatus;
  avatar: string;
  avatarGrad: string;
  rating?: number;
  ratingCount?: number;
  phone?: string;
  modalidade: 'presencial' | 'telemedicina';
  cancelReason?: string;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointments.html'
})
export class Appointments {
  sidebarOpen: boolean = false;
  activeNav: string = 'consultas';
  tab: 'proximas' | 'historico' | 'canceladas' = 'proximas';
  search: string = '';
  period: string = 'Todos os períodos';
  periodOpen: boolean = false;

  constructor(private router: Router) {}

  navegar(id: string) {
    this.activeNav = id;
    this.sidebarOpen = false; // fecha o menu no mobile

    if (id === 'dashboard') {
      this.router.navigate(['/pacientes/dashboard']);
    } else if (id === 'consultas') {
      this.router.navigate(['/pacientes/consultas']);
    } else if (id === 'exames') {
      this.router.navigate(['/pacientes/exames']);
    } else if (id === 'prescricoes') {
      this.router.navigate(['/pacientes/prescricoes'])
    } else if (id === 'prontuario') {
      this.router.navigate(['/pacientes/prontuario']);
    } else if (id === 'configuracoes') {
      this.router.navigate(['/pacientes/configuracoes']);
    }
  }
  
  cancelTarget: Appointment | null = null;
  rescheduleTarget: Appointment | null = null;
  cancelReason: string = '';
  rescheduleTime: string | null = null;

  PERIOD_OPTIONS = ["Todos os períodos", "Próximos 7 dias", "Próximos 30 dias", "Últimos 3 meses", "Últimos 6 meses", "Este ano"];
  RESCHEDULE_TIMES = ["08:00", "09:00", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "16:00", "16:30", "17:00", "17:30"];
  CANCEL_REASONS = ["Conflito de agenda", "Melhora do quadro clínico", "Dificuldade de deslocamento", "Questões financeiras", "Outro motivo"];

  navItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
    { id: "consultas", label: "Minhas Consultas", icon: "bi-calendar-check", badge: 2 },
    { id: "exames", label: "Meus Exames", icon: "bi-bandaid", badge: 3 },
    { id: "prescricoes", label: "Prescrições", icon: "bi-capsule" },
    { id: "prontuario", label: "Prontuário", icon: "bi-book" },
    { id: "configuracoes", label: "Configurações", icon: "bi-gear" },
  ];

  UPCOMING_DATA: Appointment[] = [
    { id: 1, doctor: "Dr. Rafael Silva", specialty: "Cardiologia", crm: "CRM 12.045", date: "05 Ago 2026", time: "14:30", location: "Unidade Centro — Sala 302", reason: "Retorno — Avaliação Cardíaca", status: "confirmed", avatar: "R", avatarGrad: "from-[#1565C0] to-[#42A5F5]", rating: 4.9, ratingCount: 214, phone: "(11) 3399-2200", modalidade: "presencial" },
    { id: 2, doctor: "Dra. Ana Souza", specialty: "Clínica Geral", crm: "CRM 31.228", date: "12 Ago 2026", time: "09:00", location: "Unidade Sul — Sala 105", reason: "Check-up Anual", status: "pending", avatar: "A", avatarGrad: "from-[#16A34A] to-[#34D399]", rating: 4.7, ratingCount: 89, phone: "(11) 3399-2201", modalidade: "presencial" },
    { id: 3, doctor: "Dr. Paulo Menezes", specialty: "Dermatologia", crm: "CRM 58.317", date: "20 Ago 2026", time: "11:15", location: "Unidade Norte — Sala 210", reason: "Avaliação de manchas — Rotina", status: "confirmed", avatar: "P", avatarGrad: "from-[#7C3AED] to-[#A78BFA]", rating: 4.8, ratingCount: 142, phone: "(11) 3399-2202", modalidade: "presencial" },
    { id: 4, doctor: "Dra. Camila Rocha", specialty: "Oftalmologia", crm: "CRM 44.891", date: "28 Ago 2026", time: "16:00", location: "Telemedicina", reason: "Consulta de rotina — Visão", status: "confirmed", avatar: "C", avatarGrad: "from-[#0891B2] to-[#67E8F9]", rating: 4.6, ratingCount: 73, modalidade: "telemedicina" },
  ];

  HISTORY_DATA: Appointment[] = [
    { id: 10, doctor: "Dr. Rafael Silva", specialty: "Cardiologia", crm: "CRM 12.045", date: "15 Jul 2026", time: "14:30", location: "Unidade Centro — Sala 302", reason: "Avaliação Cardíaca — 1ª Consulta", status: "completed", avatar: "R", avatarGrad: "from-[#1565C0] to-[#42A5F5]", rating: 4.9, ratingCount: 214, modalidade: "presencial" },
    { id: 11, doctor: "Dr. Henrique Martins", specialty: "Clínica Geral", crm: "CRM 22.104", date: "01 Jul 2026", time: "09:00", location: "Unidade Sul — Sala 101", reason: "Queixa de cansaço e dor de cabeça", status: "completed", avatar: "H", avatarGrad: "from-[#16A34A] to-[#34D399]", rating: 4.5, ratingCount: 57, modalidade: "presencial" },
    { id: 12, doctor: "Dra. Beatriz Costa", specialty: "Dermatologia", crm: "CRM 37.662", date: "15 Jun 2026", time: "10:30", location: "Unidade Norte — Sala 207", reason: "Avaliação de pele — rotina", status: "completed", avatar: "B", avatarGrad: "from-[#7C3AED] to-[#A78BFA]", rating: 4.8, ratingCount: 98, modalidade: "presencial" },
    { id: 13, doctor: "Dr. Rafael Silva", specialty: "Cardiologia", crm: "CRM 12.045", date: "10 Mai 2026", time: "11:00", location: "Telemedicina", reason: "Retorno — Resultado de Holter", status: "completed", avatar: "R", avatarGrad: "from-[#1565C0] to-[#42A5F5]", rating: 4.9, ratingCount: 214, modalidade: "telemedicina" },
    { id: 14, doctor: "Dra. Ana Souza", specialty: "Clínica Geral", crm: "CRM 31.228", date: "22 Abr 2026", time: "08:30", location: "Unidade Sul — Sala 105", reason: "Check-up de rotina anual", status: "completed", avatar: "A", avatarGrad: "from-[#16A34A] to-[#34D399]", rating: 4.7, ratingCount: 89, modalidade: "presencial" },
  ];

  CANCELLED_DATA: Appointment[] = [
    { id: 20, doctor: "Dr. Lucas Ferreira", specialty: "Neurologia", crm: "CRM 61.234", date: "28 Jul 2026", time: "15:00", location: "Unidade Centro — Sala 405", reason: "Cefaleia recorrente", status: "cancelled_patient", avatar: "L", avatarGrad: "from-[#D97706] to-[#FCD34D]", cancelReason: "Cancelada pelo paciente · 26 Jul 2026", modalidade: "presencial" },
    { id: 21, doctor: "Dra. Carla Mendes", specialty: "Ortopedia", crm: "CRM 48.901", date: "05 Jul 2026", time: "10:00", location: "Unidade Leste — Sala 112", reason: "Dor no joelho direito", status: "cancelled_clinic", avatar: "C", avatarGrad: "from-[#0891B2] to-[#67E8F9]", cancelReason: "Cancelada pela clínica · Médico indisponível", modalidade: "presencial" },
    { id: 22, doctor: "Dr. Bruno Alves", specialty: "Clínica Geral", crm: "CRM 29.447", date: "18 Jun 2026", time: "08:00", location: "Unidade Sul — Sala 103", reason: "Renovação de receita", status: "cancelled_patient", avatar: "B", avatarGrad: "from-[#16A34A] to-[#34D399]", cancelReason: "Cancelada pelo paciente · 17 Jun 2026", modalidade: "presencial" },
  ];

  get counts() {
    return {
      proximas: this.UPCOMING_DATA.length,
      historico: this.HISTORY_DATA.length,
      canceladas: this.CANCELLED_DATA.length
    };
  }

  get filteredAppointments(): Appointment[] {
    let list: Appointment[] = [];
    if (this.tab === 'proximas') list = this.UPCOMING_DATA;
    else if (this.tab === 'historico') list = this.HISTORY_DATA;
    else if (this.tab === 'canceladas') list = this.CANCELLED_DATA;

    if (!this.search.trim()) return list;
    const q = this.search.toLowerCase();
    return list.filter(a => 
      a.doctor.toLowerCase().includes(q) || 
      a.specialty.toLowerCase().includes(q) || 
      a.reason.toLowerCase().includes(q)
    );
  }

  getStatusConfig(status: string) {
    const map: any = {
      confirmed: { label: "Confirmada", cls: "text-[#16A34A] bg-[#F0FDF4] border-[rgba(22,163,74,0.22)]", dot: "bg-[#16A34A] animate-pulse" },
      pending: { label: "Aguard. Confirmação", cls: "text-[#D97706] bg-[#FFFBEB] border-[rgba(217,119,6,0.22)]", dot: "bg-[#D97706]" },
      completed: { label: "Concluída", cls: "text-[#5A6A85] bg-[#F3F6FB] border-[rgba(90,106,133,0.15)]", dot: "bg-[#9AAAC0]" },
      cancelled_patient: { label: "Cancelada", cls: "text-[#DC2626] bg-[#FEF2F2] border-[rgba(220,38,38,0.2)]", dot: "bg-[#DC2626]" },
      cancelled_clinic: { label: "Cancelada (Clínica)", cls: "text-[#DC2626] bg-[#FEF2F2] border-[rgba(220,38,38,0.2)]", dot: "bg-[#DC2626]" },
    };
    return map[status] || map['completed'];
  }

  getEmptyStateConfig() {
    const map: any = {
      proximas: { icon: 'bi-calendar-event', title: "Nenhuma consulta agendada", desc: "Agende sua próxima consulta com um dos nossos especialistas." },
      historico: { icon: 'bi-file-earmark-text', title: "Sem histórico de consultas", desc: "Seu histórico de consultas realizadas aparecerá aqui." },
      canceladas: { icon: 'bi-x-circle', title: "Nenhuma consulta cancelada", desc: "Você não possui consultas canceladas." }
    };
    return map[this.tab];
  }
}