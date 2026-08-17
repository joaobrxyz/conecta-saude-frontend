import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export type ExamStatus = 'disponivel' | 'pendente' | 'concluido';

export interface Exam {
  id: number;
  title: string;
  subtitle: string;
  doctor: string;
  date: string;
  lab?: string;
  status: ExamStatus;
  icon: string;
  iconBg: string;
  iconColor: string;
}

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exams.html'
})
export class Exams {
  sidebarOpen: boolean = false;
  activeNav: string = 'exames';
  activeTab: string = 'Todos';
  searchQuery: string = '';

  tabs = ['Todos', 'Resultados Disponíveis', 'Pendentes'];

  navItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
    { id: "consultas", label: "Minhas Consultas", icon: "bi-calendar-check" },
    { id: "exames", label: "Meus Exames", icon: "bi-bandaid" },
    { id: "prescricoes", label: "Prescrições", icon: "bi-capsule" },
    { id: "prontuario", label: "Prontuário", icon: "bi-book" },
    { id: "configuracoes", label: "Configurações", icon: "bi-gear" },
  ];

  exams: Exam[] = [
    { id: 1, title: 'Hemograma Completo', subtitle: 'Análise de sangue — hematologia', doctor: 'Dr. Rafael Silva', date: '12 Ago 2026', lab: 'Laboratório Central', status: 'disponivel', icon: 'bi-zoom-in', iconBg: '#EBF3FF', iconColor: '#1565C0' },
    { id: 2, title: 'Ecocardiograma', subtitle: 'Imagem cardíaca — ultrassonografia', doctor: 'Dra. Ana Souza', date: '15 Ago 2026', lab: 'Clínica CardioVida', status: 'pendente', icon: 'bi-activity', iconBg: '#FEF3C7', iconColor: '#D97706' },
    { id: 3, title: 'Tomografia do Tórax', subtitle: 'Imagem por tomografia computadorizada', doctor: 'Dr. Marcos Oliveira', date: '03 Jul 2026', lab: 'Instituto de Radiologia SP', status: 'concluido', icon: 'bi-heart-pulse', iconBg: '#F3F4F6', iconColor: '#6B7280' },
    { id: 4, title: 'Glicemia de Jejum', subtitle: 'Bioquímica — dosagem de glicose', doctor: 'Dra. Carla Mendes', date: '28 Jul 2026', lab: 'Laboratório BioLab', status: 'disponivel', icon: 'bi-droplet-half', iconBg: '#EBF3FF', iconColor: '#1565C0' },
    { id: 5, title: 'Raio-X de Tórax', subtitle: 'Radiografia — avaliação pulmonar', doctor: 'Dr. Rafael Silva', date: '20 Ago 2026', lab: 'Centro de Diagnóstico Morumbi', status: 'pendente', icon: 'bi-activity', iconBg: '#FEF3C7', iconColor: '#D97706' },
    { id: 6, title: 'Colesterol Total e Frações', subtitle: 'Perfil lipídico — bioquímica', doctor: 'Dra. Ana Souza', date: '15 Jun 2026', lab: 'Laboratório Central', status: 'concluido', icon: 'bi-zoom-in', iconBg: '#F3F4F6', iconColor: '#6B7280' },
  ];

  constructor(private router: Router) {}

  navegar(id: string) {
    this.activeNav = id;
    this.sidebarOpen = false;

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

  get filteredExams(): Exam[] {
    let filtered = this.exams;
    
    if (this.activeTab === 'Resultados Disponíveis') {
      filtered = filtered.filter(e => e.status === 'disponivel');
    } else if (this.activeTab === 'Pendentes') {
      filtered = filtered.filter(e => e.status === 'pendente');
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e => e.title.toLowerCase().includes(q) || e.doctor.toLowerCase().includes(q));
    }

    return filtered;
  }

  get counts() {
    return {
      disponivel: this.exams.filter(e => e.status === 'disponivel').length,
      pendente: this.exams.filter(e => e.status === 'pendente').length,
      concluido: this.exams.filter(e => e.status === 'concluido').length,
    };
  }

  getStatusConfig(status: ExamStatus) {
    const map = {
      disponivel: { label: 'Disponível', bg: '#DCFCE7', text: '#15803D', icon: 'bi-check-circle-fill' },
      pendente: { label: 'Agendamento Pendente', bg: '#FEF3C7', text: '#B45309', icon: 'bi-clock' },
      concluido: { label: 'Concluído', bg: '#F3F4F6', text: '#6B7280', icon: 'bi-check-circle-fill' },
    };
    return map[status];
  }
}