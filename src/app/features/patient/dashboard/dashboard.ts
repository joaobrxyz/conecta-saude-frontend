import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  activeNav: string = 'dashboard';
  sidebarOpen: boolean = false;
  notifOpen: boolean = false;
  cancelModal: boolean = false;
  rescheduleModal: boolean = false;
  query: string = '';

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

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }

  get dateStr(): string {
    const date = new Date().toLocaleDateString("pt-BR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    return date.charAt(0).toUpperCase() + date.slice(1);
  }

  navItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
    { id: "consultas", label: "Minhas Consultas", icon: "bi-calendar-check", badge: 2 },
    { id: "exames", label: "Meus Exames", icon: "bi-bandaid", badge: 3 },
    { id: "prescricoes", label: "Prescrições", icon: "bi-capsule" },
    { id: "prontuario", label: "Prontuário", icon: "bi-book" },
    { id: "configuracoes", label: "Configurações", icon: "bi-gear" },
  ];

  specialties = [
    { id: "cg", label: "Clínica Geral", icon: "bi-heart-pulse", color: "#1565C0", bg: "#EBF3FF", available: "Hoje" },
    { id: "cardio", label: "Cardiologia", icon: "bi-activity", color: "#DC2626", bg: "#FEF2F2", available: "Amanhã" },
    { id: "derm", label: "Dermatologia", icon: "bi-person-circle", color: "#7C3AED", bg: "#F5F3FF", available: "Quinta" },
    { id: "oftal", label: "Oftalmologia", icon: "bi-eye", color: "#0891B2", bg: "#ECFEFF", available: "Sexta" },
    { id: "neuro", label: "Neurologia", icon: "bi-lightning", color: "#D97706", bg: "#FFFBEB", available: "Seg" },
    { id: "orto", label: "Ortopedia", icon: "bi-universal-access", color: "#16A34A", bg: "#F0FDF4", available: "Ter" },
  ];

  upcoming = [
    { id: 1, doctor: "Dr. Rafael Silva", specialty: "Cardiologista", crm: "CRM 12.045", date: "Amanhã", time: "14:30", location: "Unidade Centro — Sala 302", status: "confirmed", avatar: "R", reason: "Retorno — Avaliação Cardíaca" },
    { id: 2, doctor: "Dra. Ana Souza", specialty: "Clínica Geral", crm: "CRM 31.228", date: "12 Ago", time: "09:00", location: "Unidade Sul — Sala 105", status: "pending", avatar: "A", reason: "Check-up Anual" },
    { id: 3, doctor: "Dr. Paulo Menezes", specialty: "Dermatologista", crm: "CRM 58.317", date: "20 Ago", time: "11:15", location: "Unidade Norte — Sala 210", status: "confirmed", avatar: "P", reason: "Consulta de rotina" },
  ];

  clinicalHistory = [
    { id: 1, name: "Hemograma Completo", category: "Exame de Sangue", date: "22 Jul 2026", doctor: "Dr. Martins", status: "available", action: "Ver resultado", actionIcon: "view" },
    { id: 2, name: "Receita Médica — Losartana 50mg", category: "Prescrição", date: "15 Jul 2026", doctor: "Dr. Silva", status: "download", action: "Baixar PDF", actionIcon: "download" },
    { id: 3, name: "Consulta — Cardiologista", category: "Consulta", date: "15 Jul 2026", doctor: "Dr. Silva", status: "completed", action: "Ver resumo", actionIcon: "view" },
    { id: 4, name: "Glicemia em Jejum", category: "Exame de Sangue", date: "01 Jul 2026", doctor: "Dr. Martins", status: "available", action: "Ver resultado", actionIcon: "view" },
    { id: 5, name: "Raio-X Tórax", category: "Imagem", date: "20 Jun 2026", doctor: "Dra. Costa", status: "completed", action: "Ver imagem", actionIcon: "view" },
  ];

  prescriptions = [
    { name: "Losartana 50mg", dose: "1 comp. / dia", doctor: "Dr. Silva", valid: "Válida até 22 Out 2026", color: "#1565C0" },
    { name: "AAS 100mg", dose: "1 comp. / dia", doctor: "Dr. Silva", valid: "Válida até 22 Out 2026", color: "#DC2626" },
    { name: "Rosuvastatina 10mg", dose: "1 comp. / noite", doctor: "Dr. Silva", valid: "Válida até 22 Out 2026", color: "#7C3AED" },
  ];

  pendingExams = [
    { name: "Ecocardiograma", ordered: "Dr. Silva", date: "15 Jul 2026", urgent: true },
    { name: "Holter 24h", ordered: "Dr. Silva", date: "15 Jul 2026", urgent: false },
    { name: "Colesterol Total", ordered: "Dr. Martins", date: "22 Jul 2026", urgent: false },
  ];

  notifications = [
    { icon: 'bi-calendar-check', text: 'Consulta confirmada: Dr. Silva amanhã às 14:30', time: '1h atrás', color: '#1565C0', dot: true },
    { icon: 'bi-bandaid', text: 'Resultado do Hemograma disponível para visualização', time: '4h atrás', color: '#16A34A', dot: true },
    { icon: 'bi-capsule', text: 'Receita de Losartana 50mg — baixar PDF', time: 'Ontem', color: '#7C3AED', dot: false },
    { icon: 'bi-exclamation-circle', text: 'Ecocardiograma solicitado — agendar até 15 Ago', time: 'Ontem', color: '#DC2626', dot: false }
  ];

  prepTips = [
    "Trazer exames anteriores (ECG, Holter)",
    "Evitar cafeína 6h antes",
    "Listar todos os medicamentos em uso",
    "Jejum não obrigatório para esta consulta"
  ];

  timeSlots = ["08:00","09:00","10:30","11:00","14:00","15:00","16:30","17:00"];

  getStatusConfig(status: string) {
    const map: any = {
      confirmed: { label: "Confirmada", cls: "text-[#16A34A] bg-[#F0FDF4] border-[rgba(22,163,74,0.2)]", dot: "bg-[#16A34A]" },
      pending:   { label: "Pendente",   cls: "text-[#D97706] bg-[#FFFBEB] border-[rgba(217,119,6,0.2)]",  dot: "bg-[#D97706]" },
      available: { label: "Disponível", cls: "text-[#1565C0] bg-[#EBF3FF] border-[rgba(21,101,192,0.2)]", dot: "bg-[#1565C0]" },
      completed: { label: "Concluído",  cls: "text-[#5A6A85] bg-[#F3F6FB] border-[rgba(90,106,133,0.15)]", dot: "bg-[#9AAAC0]" },
      download:  { label: "Disponível", cls: "text-[#1565C0] bg-[#EBF3FF] border-[rgba(21,101,192,0.2)]", dot: "bg-[#1565C0]" },
    };
    return map[status] || map['completed'];
  }

  getAvatarGradient(idx: number): string {
    const colors = [
      "from-[#1565C0] to-[#42A5F5]",
      "from-[#7C3AED] to-[#A78BFA]",
      "from-[#DC2626] to-[#F87171]",
      "from-[#0891B2] to-[#67E8F9]"
    ];
    return colors[idx % colors.length];
  }
}