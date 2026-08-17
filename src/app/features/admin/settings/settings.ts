import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ConfigSection = 'Dados da Clínica' | 'Horário de Funcionamento' | 'Segurança Global' | 'Personalização';

interface ToggleOption {
  id: string;
  label: string;
  desc: string;
  on: boolean;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html'
})
export class Settings {
  activeSection: ConfigSection = 'Dados da Clínica';

  SECTIONS: { id: ConfigSection; icon: string }[] = [
    { id: 'Dados da Clínica', icon: 'bi-building' },
    { id: 'Horário de Funcionamento', icon: 'bi-clock' },
    { id: 'Segurança Global', icon: 'bi-shield-check' },
    { id: 'Personalização', icon: 'bi-palette' },
  ];

  // --- Dados da Clínica ---
  nomeClinica = 'Conecta Saúde';
  razaoSocial = 'Conecta Saúde Serviços Médicos LTDA';
  cnpj = '00.000.000/0001-00';
  registroConselho = '';
  
  email = 'contato@conectasaude.com.br';
  telefone = '(11) 3399-2200';
  cep = '';
  uf = 'SP';
  endereco = 'Av. Paulista, 1000';
  bairro = '';
  cidade = 'São Paulo';

  // --- Políticas de Agendamento ---
  policies: ToggleOption[] = [
    { id: 'p1', label: 'Permitir agendamento no mesmo dia', desc: 'Pacientes poderão marcar consultas para o mesmo dia em que estão acessando o sistema.', on: true },
    { id: 'p2', label: 'Exigir CPF obrigatório no cadastro', desc: 'O campo CPF será obrigatório ao registrar um novo paciente no sistema.', on: true },
    { id: 'p3', label: 'Enviar lembrete de consulta por e-mail', desc: 'Um e-mail automático será enviado ao paciente 24h antes da consulta agendada.', on: false },
    { id: 'p4', label: 'Permitir cancelamento pelo paciente', desc: 'Pacientes poderão cancelar suas próprias consultas pela plataforma, com até 2h de antecedência.', on: true },
  ];

  saved: boolean = false;

  togglePolicy(id: string) {
    const policy = this.policies.find(p => p.id === id);
    if (policy) policy.on = !policy.on;
  }

  saveSettings() {
    this.saved = true;
    setTimeout(() => this.saved = false, 2500);
  }
}