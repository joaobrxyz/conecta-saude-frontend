import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Patient {
  id: string;
  initials: string;
  avatarColor: string;
  avatarBg: string;
  name: string;
  cpf: string;
  phone: string;
  nextAppt: string;
  nextApptHighlight?: 'blue' | 'muted';
  status: 'Ativo' | 'Inativo';
}

@Component({
  selector: 'app-reception-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.html'
})
export class Patients {
  search: string = '';
  statusFilter: string = 'Ativos';
  page: number = 1;

  PATIENTS: Patient[] = [
    { id: 'p1', initials: 'MC', avatarColor: '#DC2626', avatarBg: '#FEE2E2', name: 'Marina Costa', cpf: '321.654.987-11', phone: '(11) 97811-2234', nextAppt: 'Hoje às 14:00', nextApptHighlight: 'blue', status: 'Ativo' },
    { id: 'p2', initials: 'BH', avatarColor: '#7C3AED', avatarBg: '#EDE9FE', name: 'Bruno Henrique', cpf: '148.923.007-45', phone: '(11) 98200-5567', nextAppt: '15 Ago 2026', status: 'Ativo' },
    { id: 'p3', initials: 'LF', avatarColor: '#EA580C', avatarBg: '#FFEDD5', name: 'Lúcia Ferreira', cpf: '560.112.843-88', phone: '(11) 95544-3312', nextAppt: 'Nenhum', nextApptHighlight: 'muted', status: 'Ativo' },
    { id: 'p4', initials: 'RP', avatarColor: '#0891B2', avatarBg: '#CFFAFE', name: 'Ricardo Pimentel', cpf: '072.388.561-29', phone: '(21) 99103-8847', nextAppt: '18 Ago 2026', status: 'Ativo' },
    { id: 'p5', initials: 'JA', avatarColor: '#16A34A', avatarBg: '#DCFCE7', name: 'Juliana Alves', cpf: '934.201.678-54', phone: '(11) 94422-0091', nextAppt: '22 Ago 2026', status: 'Ativo' },
  ];

  get filteredPatients() {
    const q = this.search.toLowerCase();
    return this.PATIENTS.filter(p => {
      const matchSearch = q === '' || p.name.toLowerCase().includes(q) || p.cpf.includes(q);
      const matchStatus = this.statusFilter === 'Todos' ||
        (this.statusFilter === 'Ativos' && p.status === 'Ativo') ||
        (this.statusFilter === 'Inativos' && p.status === 'Inativo');
      
      return matchSearch && matchStatus;
    });
  }

  setPage(p: number) {
    this.page = p;
  }
}