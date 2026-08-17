import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html'
})
export class Settings {
  sidebarOpen: boolean = false;
  activeNav: string = 'config';
  searchQuery: string = '';

  // Configurações e estados das abas
  activeSection: string = 'perfil';
  deleteConfirm: boolean = false;
  perfilSaved: boolean = false;
  senhaSaved: boolean = false;
  prefSaved: boolean = false;

  // Estados dos inputs de senha
  showPass1: boolean = false;
  showPass2: boolean = false;
  showPass3: boolean = false;

  mfaEnabled: boolean = false;
  darkMode: boolean = false;
  lang: string = 'pt-BR';
  openFaq: number | null = null;

  notifs = {
    consultas: true,
    exames: true,
    prescricoes: false,
    marketing: false,
    sms: true,
    email: true,
    push: false,
  };

  navItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
    { id: "consultas", label: "Minhas Consultas", icon: "bi-calendar-check" },
    { id: "exames", label: "Meus Exames", icon: "bi-bandaid" },
    { id: "prescricoes", label: "Prescrições", icon: "bi-capsule" },
    { id: "prontuario", label: "Prontuário", icon: "bi-book" },
    { id: "config", label: "Configurações", icon: "bi-gear" },
  ];

  settingsMenu = [
    { id: 'perfil', label: 'Meu Perfil', icon: 'bi-person-circle' },
    { id: 'seguranca', label: 'Segurança e Senha', icon: 'bi-lock' },
    { id: 'notificacoes', label: 'Notificações', icon: 'bi-bell' },
    { id: 'preferencias', label: 'Preferências', icon: 'bi-sliders' },
    { id: 'ajuda', label: 'Ajuda e Suporte', icon: 'bi-question-circle' },
  ];

  activeSessions = [
    { device: 'Chrome — MacBook Pro', location: 'São Paulo, SP', time: 'Agora', current: true },
    { device: 'Safari — iPhone 15', location: 'São Paulo, SP', time: 'Há 2 horas', current: false },
    { device: 'Firefox — Windows 11', location: 'Campinas, SP', time: 'Há 3 dias', current: false },
  ];

  faqs = [
    { id: 1, q: 'Como agendar uma consulta?', a: 'Acesse a seção "Minhas Consultas" no menu lateral e clique em "Agendar Nova Consulta". Escolha a especialidade, data e médico de sua preferência.' },
    { id: 2, q: 'Como baixar meus resultados de exames?', a: 'Vá até "Meus Exames", localize o exame desejado e clique em "Baixar PDF". O arquivo será salvo diretamente no seu dispositivo.' },
    { id: 3, q: 'Como solicitar renovação de uma receita?', a: 'Em "Prescrições", clique em "Solicitar Renovação" no card da receita ou no botão superior da página. O médico responsável receberá a solicitação.' },
    { id: 4, q: 'Meus dados são seguros?', a: 'Sim. Todos os dados são criptografados em repouso e em trânsito. Seguimos as diretrizes da LGPD e as melhores práticas de segurança em saúde digital.' },
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
    else if (id === 'config') this.router.navigate(['/pacientes/configuracoes']);
  }

  savePerfil() {
    this.perfilSaved = true;
    setTimeout(() => this.perfilSaved = false, 2500);
  }

  saveSenha() {
    this.senhaSaved = true;
    setTimeout(() => this.senhaSaved = false, 2500);
  }

  savePref() {
    this.prefSaved = true;
    setTimeout(() => this.prefSaved = false, 2500);
  }

  toggleNotif(key: keyof typeof this.notifs) {
    this.notifs[key] = !this.notifs[key];
  }

  toggleFaq(id: number) {
    this.openFaq = this.openFaq === id ? null : id;
  }
}