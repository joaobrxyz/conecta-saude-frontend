import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record.html'
})
export class Record {
  sidebarOpen: boolean = false;
  activeNav: string = 'prontuario';
  searchQuery: string = '';

  navItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
    { id: "consultas", label: "Minhas Consultas", icon: "bi-calendar-check" },
    { id: "exames", label: "Meus Exames", icon: "bi-bandaid" },
    { id: "prescricoes", label: "Prescrições", icon: "bi-capsule" },
    { id: "prontuario", label: "Prontuário", icon: "bi-book" },
    { id: "configuracoes", label: "Configurações", icon: "bi-gear" },
  ];

  patientDetails = [
    { label: 'Data de Nascimento', value: '14 Out 2005' },
    { label: 'Idade', value: '20 anos' },
    { label: 'Sexo Biológico', value: 'Masculino' },
    { label: 'Tipo Sanguíneo', value: 'O+' },
    { label: 'N° do Paciente', value: '4829-SP' },
  ];

  vitalSigns = [
    { icon: 'bi-speedometer2', iconBg: '#EBF3FF', iconColor: '#1565C0', label: 'Peso', value: '72 kg', sub: null },
    { icon: 'bi-rulers', iconBg: '#DCFCE7', iconColor: '#16A34A', label: 'Altura', value: '1,78 m', sub: null },
    { icon: 'bi-activity', iconBg: '#F3E8FF', iconColor: '#9333EA', label: 'IMC', value: '22,7', sub: 'Adequado' },
    { icon: 'bi-heart-fill', iconBg: '#FEE2E2', iconColor: '#DC2626', label: 'Pressão Arterial', value: '120/80', sub: 'mmHg' }
  ];

  timeline = [
    {
      id: 1,
      icon: 'bi-apple', iconBg: '#DCFCE7', iconColor: '#16A34A',
      date: '28 Jul 2026',
      tag: 'Nutrologia', tagBg: '#DCFCE7', tagText: '#15803D',
      title: 'Avaliação Nutricional e Esportiva',
      doctor: 'Dr. Marcelo', specialty: 'Nutrologia',
      notes: 'Paciente mantém rotina de treinos diários às 10h. Ajuste de macronutrientes e inclusão de whey protein concentrado na dieta. Objetivo alinhado: definição muscular (shape slim). Ingestão hídrica adequada. Retorno em 90 dias.'
    },
    {
      id: 2,
      icon: 'bi-stars', iconBg: '#F3E8FF', iconColor: '#9333EA',
      date: '14 Jun 2026',
      tag: 'Dermatologia', tagBg: '#F3E8FF', tagText: '#7E22CE',
      title: 'Consulta Dermatológica',
      doctor: 'Dra. Helena', specialty: 'Dermatologia',
      notes: 'Acompanhamento de rotina. Pele saudável. Recomendada manutenção do skincare diário com gel de limpeza, hidratação específica e fotoproteção avançada. Nenhuma alteração identificada.'
    },
    {
      id: 3,
      icon: 'bi-stethoscope', iconBg: '#EBF3FF', iconColor: '#1565C0',
      date: '10 Abr 2026',
      tag: 'Clínica Geral', tagBg: '#EBF3FF', tagText: '#1565C0',
      title: 'Check-up Clínico Geral',
      doctor: 'Dr. Rafael Silva', specialty: 'Clínica Médica',
      notes: 'Exames laboratoriais dentro da normalidade. Hemograma completo sem alterações. Perfil lipídico adequado para a faixa etária. Saúde geral excelente. Próximo check-up em 12 meses.'
    }
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
}