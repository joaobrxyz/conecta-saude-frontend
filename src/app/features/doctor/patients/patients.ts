import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type PatientStatus = 'acompanhamento' | 'estavel' | 'atencao' | 'inativo' | 'critico';

interface Patient {
  id: number;
  initials: string;
  avatarIdx: number;
  name: string;
  prontuario: string;
  age: number;
  phone: string;
  lastConsult: string;
  lastSpec: string;
  status: PatientStatus;
  gender: string;
}

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.html'
})
export class Patients {
  search: string = '';
  statusFilter: string = 'Status';
  consultFilter: string = 'Última Consulta';
  
  currentPage: number = 1;
  totalPatients: number = 142;
  perPage: number = 5;
  
  openMenuId: number | null = null;

  AVATAR_GRADIENTS = [
    'linear-gradient(135deg,#1565C0,#42A5F5)',
    'linear-gradient(135deg,#16A34A,#4ADE80)',
    'linear-gradient(135deg,#7C3AED,#A78BFA)',
    'linear-gradient(135deg,#D97706,#FCD34D)',
    'linear-gradient(135deg,#DC2626,#FCA5A5)',
    'linear-gradient(135deg,#0891B2,#67E8F9)',
  ];

  STATUS_CFG: Record<PatientStatus, { label: string; bg: string; text: string }> = {
    acompanhamento: { label: 'Em acompanhamento', bg: '#DCFCE7', text: '#15803D' },
    estavel:        { label: 'Estável',           bg: '#EBF3FF', text: '#1565C0' },
    atencao:        { label: 'Atenção Crônica',   bg: '#FEF3C7', text: '#B45309' },
    inativo:        { label: 'Inativo',           bg: '#F1F5F9', text: '#64748B' },
    critico:        { label: 'Atenção Urgente',   bg: '#FEE2E2', text: '#DC2626' },
  };

  statusOptions = ['Status', 'Em acompanhamento', 'Estável', 'Atenção Crônica', 'Inativo'];
  consultOptions = ['Última Consulta', 'Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Últimos 6 meses', 'Mais de 1 ano'];
  menuOptions = ['Ver histórico', 'Agendar consulta', 'Enviar mensagem', 'Editar dados', 'Inativar paciente'];
  pageNums = [1, 2, 3];

  ALL_PATIENTS: Patient[] = [
    { id: 1, initials: 'CE', avatarIdx: 0, name: 'Carlos Eduardo', prontuario: '#00482', age: 45, gender: 'M', phone: '(11) 98765-4321', lastConsult: '14 Jul 2026', lastSpec: 'Cardiologia', status: 'acompanhamento' },
    { id: 2, initials: 'FR', avatarIdx: 1, name: 'Fernanda Rocha', prontuario: '#00815', age: 38, gender: 'F', phone: '(11) 91234-5678', lastConsult: 'Hoje', lastSpec: 'Rotina', status: 'estavel' },
    { id: 3, initials: 'RA', avatarIdx: 2, name: 'Roberto Alves', prontuario: '#00921', age: 62, gender: 'M', phone: '(11) 99988-7766', lastConsult: '10 Ago 2025', lastSpec: 'Cardiologia', status: 'atencao' },
    { id: 4, initials: 'SM', avatarIdx: 3, name: 'Silvia Monteiro', prontuario: '#01044', age: 51, gender: 'F', phone: '(11) 97654-3210', lastConsult: '02 Ago 2026', lastSpec: 'Ecocardiograma', status: 'acompanhamento' },
    { id: 5, initials: 'JP', avatarIdx: 5, name: 'Jorge Pereira', prontuario: '#01187', age: 70, gender: 'M', phone: '(11) 93322-1100', lastConsult: '28 Jul 2026', lastSpec: 'Holter', status: 'critico' },
  ];

  get filteredPatients() {
    const q = this.search.toLowerCase();
    return this.ALL_PATIENTS.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.prontuario.includes(q) ||
      p.phone.includes(q)
    );
  }

  get totalPages(): number {
    return Math.ceil(this.totalPatients / this.perPage);
  }

  clearFilters() {
    this.statusFilter = 'Status';
    this.consultFilter = 'Última Consulta';
    this.search = '';
  }

  toggleMenu(event: Event, id: number) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  // Fecha o dropdown se o usuário clicar em qualquer lugar fora dele
  @HostListener('document:click')
  closeMenus() {
    this.openMenuId = null;
  }

  onMenuOptionClick(event: Event, option: string) {
    event.stopPropagation();
    // Aqui você pode colocar a lógica futura do que o botão faz (ex: abrir modal)
    console.log(`Clicou em: ${option}`);
    this.openMenuId = null;
  }
}