import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './patient-layout.html'
})
export class PatientLayout {
  sidebarOpen: boolean = false;
  notifOpen: boolean = false;
  query: string = '';

  // Variáveis dinâmicas para o paciente logado
  userName: string = 'João Vitor';
  userInitials: string = 'JV';
  patientId: string = '00482';

  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/paciente/dashboard' },
    { id: 'consultas', label: 'Minhas Consultas', icon: 'bi-calendar-check', badge: '2', route: '/paciente/consultas' },
    { id: 'exames', label: 'Meus Exames', icon: 'bi-bandaid', badge: '3', route: '/paciente/exames' },
    { id: 'prescricoes', label: 'Prescrições', icon: 'bi-capsule', route: '/paciente/prescricoes' },
    { id: 'prontuario', label: 'Prontuário', icon: 'bi-book', route: '/paciente/prontuario' },
    { id: 'configuracoes', label: 'Configurações', icon: 'bi-gear', route: '/paciente/configuracoes' },
  ];

  notifications = [
    { icon: 'bi-calendar-check', color: '#1565C0', text: 'Consulta com Dr. Rafael confirmada.', time: 'Há 2 horas', dot: true },
    { icon: 'bi-capsule', color: '#7C3AED', text: 'Sua receita de Losartana vence em 5 dias.', time: 'Há 1 dia', dot: false }
  ];

  constructor(public router: Router) {}

  get searchPlaceholder(): string {
    const url = this.router.url;
    
    if (url.includes('/exames')) {
      return 'Buscar exames...';
    } 
    else if (url.includes('/prescricoes')) {
      return 'Buscar medicamentos...';
    } 
    else if (url.includes('/prontuario')) {
      return 'Buscar no prontuário...';
    } 
    else if (url.includes('/configuracoes')) {
      return 'Buscar configurações...';
    }
    
    // Texto padrão para Dashboard e Consultas
    return 'Buscar médicos, exames, consultas...';
  }

  get showSearchBar(): boolean {
    const url = this.router.url;
    // Retorna FALSO (esconde) se estiver no prontuário ou nas configurações
    if (url.includes('/prontuario') || url.includes('/configuracoes')) {
      return false;
    }
    // Retorna VERDADEIRO (mostra) para o resto
    return true;
  }
}