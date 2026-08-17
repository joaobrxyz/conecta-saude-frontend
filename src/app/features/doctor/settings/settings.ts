import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SettingsSection = 'perfil' | 'agenda' | 'assinatura' | 'notificacoes' | 'seguranca';

@Component({
  selector: 'app-doctor-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html'
})
export class Settings {
  activeSection: SettingsSection = 'perfil';
  saved: boolean = false;

  SETTINGS_NAV: { id: SettingsSection; label: string; icon: string; desc: string }[] = [
    { id: 'perfil',       label: 'Perfil Profissional',  icon: 'bi-person-circle', desc: 'Dados, foto e CRM' },
    { id: 'agenda',       label: 'Agenda e Horários',    icon: 'bi-clock',         desc: 'Disponibilidade semanal' },
    { id: 'notificacoes', label: 'Notificações',         icon: 'bi-bell',          desc: 'Alertas e preferências' },
    { id: 'seguranca',    label: 'Segurança e Senha',    icon: 'bi-lock',          desc: 'Autenticação e acesso' },
  ];

  // --- Estado: Perfil Profissional ---
  nome = 'Dr. Rafael Silva';
  especialidade = 'Cardiologia';
  crm = '12345-SP';
  email = 'rafael@conectasaude.com.br';
  telefone = '(11) 99999-9999';
  bio = 'Especialista em cardiologia clínica e esportiva com mais de 12 anos de experiência. Formado pela Universidade de São Paulo (USP), com residência médica no Hospital das Clínicas e especialização em eletrofisiologia cardíaca pelo InCor. Atua no diagnóstico e tratamento de doenças cardiovasculares, com foco em prevenção e qualidade de vida.';
  bioMax = 500;
  clinica = 'Clínica Conecta Saúde';
  sala = 'Sala 302';
  endereco = 'Av. Paulista, 1000 — São Paulo, SP';
  tagsAtuacao = ['Cardiologia Clínica', 'Cardiologia Esportiva', 'Eletrofisiologia', 'Prevenção Cardiovascular'];

  // --- Estado: Agenda e Horários ---
  DAYS = [
    { id: 'seg', label: 'Segunda-feira' },
    { id: 'ter', label: 'Terça-feira' },
    { id: 'qua', label: 'Quarta-feira' },
    { id: 'qui', label: 'Quinta-feira' },
    { id: 'sex', label: 'Sexta-feira' },
    { id: 'sab', label: 'Sábado' },
    { id: 'dom', label: 'Domingo' },
  ];

  hours: Record<string, { active: boolean; start: string; end: string; break: boolean }> = {
    seg: { active: true,  start: '08:00', end: '17:00', break: true  },
    ter: { active: true,  start: '08:00', end: '17:00', break: true  },
    qua: { active: true,  start: '08:00', end: '12:00', break: false },
    qui: { active: true,  start: '08:00', end: '17:00', break: true  },
    sex: { active: true,  start: '08:00', end: '16:00', break: true  },
    sab: { active: false, start: '08:00', end: '12:00', break: false },
    dom: { active: false, start: '08:00', end: '12:00', break: false },
  };

  duration = '30';
  buffer = '10';

  get currentCapacity() {
    return Math.floor(480 / (parseInt(this.duration) + parseInt(this.buffer)));
  }

  toggleDay(dayId: string) {
    this.hours[dayId].active = !this.hours[dayId].active;
  }

  // --- Estado: Assinatura Digital ---
  dragging = false;

  // --- Estado: Notificações ---
  NOTIF_GROUPS = [
    {
      title: 'Consultas',
      items: [
        { id: 'n1', label: 'Novo agendamento', desc: 'Quando um paciente agenda uma consulta', email: true, push: true, sms: false },
        { id: 'n2', label: 'Cancelamento de consulta', desc: 'Quando uma consulta é cancelada', email: true, push: true, sms: true },
        { id: 'n3', label: 'Reagendamento', desc: 'Quando há mudança de horário confirmada', email: true, push: true, sms: false },
        { id: 'n4', label: 'Lembrete 24h antes', desc: 'Alerta antecipado da agenda do dia seguinte', email: false, push: true, sms: false },
      ]
    },
    {
      title: 'Telemedicina',
      items: [
        { id: 'n5', label: 'Paciente na sala de espera virtual', desc: 'Quando o paciente entra na videochamada', email: false, push: true, sms: false },
        { id: 'n6', label: 'Fila de espera', desc: 'Atualizações da fila de atendimento', email: false, push: true, sms: false },
      ]
    },
    {
      title: 'Sistema',
      items: [
        { id: 'n7', label: 'Certificado digital expirando', desc: '30 dias antes do vencimento', email: true, push: true, sms: false },
        { id: 'n8', label: 'Novidades da plataforma', desc: 'Atualizações e melhorias do sistema', email: true, push: false, sms: false },
      ]
    }
  ];

  notifs: Record<string, { email: boolean; push: boolean; sms: boolean }> = {};

  constructor() {
    // Inicializar os estados de notificação
    this.NOTIF_GROUPS.forEach(g => {
      g.items.forEach(item => {
        this.notifs[item.id] = { email: item.email, push: item.push, sms: item.sms };
      });
    });
  }

  toggleNotif(id: string, channel: 'email' | 'push' | 'sms') {
    this.notifs[id][channel] = !this.notifs[id][channel];
  }

  // --- Estado: Segurança e Senha ---
  currentPw = '';
  newPw = '';
  confirmPw = '';
  showCurrent = false;
  showNew = false;
  showConfirm = false;
  twoFactor = true;
  sessionAlert = true;

  activeSessions = [
    { device: 'MacBook Pro', location: 'São Paulo, SP', last: 'Agora', current: true },
    { device: 'iPhone 15', location: 'São Paulo, SP', last: 'há 2h', current: false },
    { device: 'Chrome — Windows', location: 'Campinas, SP', last: 'há 2 dias', current: false },
  ];

  getPwScore(): number {
    return [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(this.newPw)).length;
  }

  getPwLabel(): string {
    return ["", "Fraca", "Razoável", "Boa", "Forte"][this.getPwScore()] || "";
  }

  getPwColor(): string {
    return ["", "#DC2626", "#D97706", "#1565C0", "#16A34A"][this.getPwScore()] || "";
  }

  hasUppercase() { return /[A-Z]/.test(this.newPw); }
  hasNumber() { return /[0-9]/.test(this.newPw); }
  hasSpecial() { return /[^A-Za-z0-9]/.test(this.newPw); }

  // --- Ações ---
  removeTag(tag: string) {
    this.tagsAtuacao = this.tagsAtuacao.filter(t => t !== tag);
  }

  handleSave() {
    this.saved = true;
    setTimeout(() => this.saved = false, 2500);
  }
}