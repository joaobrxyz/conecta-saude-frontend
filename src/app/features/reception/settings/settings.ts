import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SettingsSection = 'perfil' | 'notificacoes' | 'seguranca';

@Component({
  selector: 'app-reception-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html'
})
export class Settings {
  // Navegação Interna
  activeSection: SettingsSection = 'perfil';

  SETTINGS_NAV: { id: SettingsSection; label: string; icon: string }[] = [
    { id: 'perfil', label: 'Perfil e Conta', icon: 'bi-person' },
    { id: 'notificacoes', label: 'Notificações do Balcão', icon: 'bi-bell' },
    { id: 'seguranca', label: 'Segurança e Senha', icon: 'bi-shield-check' },
  ];

  // Feedback visual
  saved: boolean = false;

  handleSave() {
    this.saved = true;
    setTimeout(() => this.saved = false, 2500);
  }

  // --- ABA 1: PERFIL ---
  nome = 'Camila Santos';
  email = 'camila.recepcao@conectasaude.com.br';
  telefone = '(11) 98888-7777';
  telaInicial = 'checkin';

  // --- ABA 2: NOTIFICAÇÕES ---
  toggles = [
    { id: 't1', label: 'Novo paciente na fila de check-in', desc: 'Alerta sonoro e visual ao balcão quando um paciente se apresenta.', on: true },
    { id: 't2', label: 'Confirmação de agendamento via WhatsApp', desc: 'Notificação quando um paciente confirmar pelo link automático.', on: true },
    { id: 't3', label: 'Atraso na consulta (> 15 min)', desc: 'Aviso quando um horário ultrapassar 15 minutos sem início.', on: false },
    { id: 't4', label: 'Resumo diário de agenda', desc: 'Enviar um e-mail com o resumo do dia às 07:30 todo dia útil.', on: true },
    { id: 't5', label: 'Alertas de manutenção do sistema', desc: 'Comunicados sobre atualizações e janelas de manutenção.', on: false },
  ];

  toggleNotif(id: string) {
    const item = this.toggles.find(t => t.id === id);
    if (item) item.on = !item.on;
  }

  // --- ABA 3: SEGURANÇA E SENHA ---
  senhaAtual = '';
  novaSenha = '';
  confirmSenha = '';
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  activeSessions = [
    { device: 'Chrome no Windows 11', location: 'São Paulo, SP', current: true, time: 'Agora' },
    { device: 'Safari no iPhone 15', location: 'São Paulo, SP', current: false, time: 'Ontem às 19:42' },
  ];

  // Validação visual de Força de Senha
  getPwScore(): number {
    if (!this.novaSenha) return 0;
    return [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(this.novaSenha)).length;
  }

  getPwLabel(): string {
    return ["", "Fraca", "Razoável", "Boa", "Forte"][this.getPwScore()] || "";
  }

  getPwColor(): string {
    return ["", "#DC2626", "#D97706", "#1565C0", "#16A34A"][this.getPwScore()] || "";
  }
}