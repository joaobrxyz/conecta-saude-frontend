import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export type PrescriptionStatus = 'ativa' | 'expirada' | 'renovar';

export interface Prescription {
  id: number;
  name: string;
  dosageDetail: string;
  frequency: string;
  doctor: string;
  specialty: string;
  validUntil: string;
  issued: string;
  status: PrescriptionStatus;
  refills: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  instructions: string;
}

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prescriptions.html'
})
export class Prescriptions{
  sidebarOpen: boolean = false;
  activeNav: string = 'prescricoes';
  activeTab: 'Ativas' | 'Histórico' = 'Ativas';
  searchQuery: string = '';

  navItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
    { id: "consultas", label: "Minhas Consultas", icon: "bi-calendar-check" },
    { id: "exames", label: "Meus Exames", icon: "bi-bandaid" },
    { id: "prescricoes", label: "Prescrições", icon: "bi-capsule" },
    { id: "prontuario", label: "Prontuário", icon: "bi-book" },
    { id: "configuracoes", label: "Configurações", icon: "bi-gear" },
  ];

  prescriptions: Prescription[] = [
    { id: 1, name: 'Losartana 50mg', dosageDetail: '1 comprimido', frequency: '1× ao dia — em jejum', doctor: 'Dr. Rafael Silva', specialty: 'Cardiologista', validUntil: '20 Out 2026', issued: '20 Abr 2026', status: 'ativa', refills: 3, icon: 'bi-capsule', iconBg: '#EBF3FF', iconColor: '#1565C0', instructions: 'Tomar preferencialmente no mesmo horário todos os dias.' },
    { id: 2, name: 'Colírio Lubrificante', dosageDetail: '1 gota em cada olho', frequency: 'a cada 8h', doctor: 'Dra. Juliana Freitas', specialty: 'Oftalmologista', validUntil: '05 Set 2026', issued: '05 Mar 2026', status: 'renovar', refills: 0, icon: 'bi-eyedropper', iconBg: '#FEF3C7', iconColor: '#D97706', instructions: 'Não usar lentes de contato por 15 minutos após aplicação.' },
    { id: 3, name: 'Protetor Solar Facial FPS 50', dosageDetail: '1 aplicação no rosto', frequency: 'todas as manhãs', doctor: 'Dra. Carla Mendes', specialty: 'Dermatologista', validUntil: '12 Dez 2026', issued: '12 Jun 2026', status: 'ativa', refills: 5, icon: 'bi-brightness-high', iconBg: '#DCFCE7', iconColor: '#16A34A', instructions: 'Reaplicar a cada 2h em caso de exposição solar intensa.' },
    { id: 4, name: 'Metformina 850mg', dosageDetail: '1 comprimido', frequency: '2× ao dia — após refeições', doctor: 'Dra. Ana Souza', specialty: 'Endocrinologista', validUntil: '08 Jan 2026', issued: '08 Jul 2025', status: 'expirada', refills: 0, icon: 'bi-capsule', iconBg: '#F3F4F6', iconColor: '#9CA3AF', instructions: 'Tomar com as refeições para reduzir desconforto gástrico.' },
  ];

  historyItems = [
    { id: 10, name: 'Amoxicilina 500mg', doctor: 'Dr. Rafael Silva', issued: '10 Fev 2026', expired: '10 Mar 2026' },
    { id: 11, name: 'Ibuprofeno 400mg', doctor: 'Dra. Carla Mendes', issued: '05 Jan 2026', expired: '05 Fev 2026' },
    { id: 12, name: 'Dipirona 500mg', doctor: 'Dr. Marcos Oliveira', issued: '20 Dez 2025', expired: '20 Jan 2026' },
  ];

  constructor(private router: Router) {}

  navegar(id: string) {
    this.activeNav = id;
    this.sidebarOpen = false;

    if (id === 'dashboard') this.router.navigate(['/pacientes/dashboard']);
    else if (id === 'consultas') this.router.navigate(['/pacientes/consultas']);
    else if (id === 'exames') this.router.navigate(['/pacientes/exames']);
    else if (id === 'prescricoes') this.router.navigate(['/pacientes/prescricoes']);
    else if (id === 'prontuario') this.router.navigate(['/pacientes/prontuario']);
    else if (id === 'configuracoes') this.router.navigate(['/pacientes/configuracoes']);
  }

  get activeCount() {
    return this.prescriptions.filter(r => r.status !== 'expirada').length;
  }

  get renewCount() {
    return this.prescriptions.filter(r => r.status === 'renovar').length;
  }

  get expiredCount() {
    return this.prescriptions.filter(r => r.status === 'expirada').length;
  }

  getRefillsArray(refills: number): number[] {
    return Array(Math.min(refills, 6)).fill(0);
  }

  getStatusConfig(status: PrescriptionStatus) {
    const map = {
      ativa: { label: 'Ativa', bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0', icon: 'bi-check-circle-fill' },
      renovar: { label: 'Renovar em breve', bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', icon: 'bi-clock' },
      expirada: { label: 'Expirada', bg: '#FEE2E2', text: '#DC2626', border: '#FECACA', icon: 'bi-exclamation-triangle-fill' },
    };
    return map[status];
  }
}