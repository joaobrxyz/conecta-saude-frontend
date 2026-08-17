import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-create.html'
})
export class AppointmentCreate implements OnInit {
  especialidades = ['Cardiologia', 'Dermatologia', 'Endocrinologia', 'Neurologia', 'Nutrologia', 'Oftalmologia', 'Ortopedia', 'Clínica Geral'];
  
  profissionaisMap: Record<string, string[]> = {
    'Cardiologia': ['Dr. Rafael Silva', 'Dra. Ana Souza', 'Dr. Marcos Oliveira'],
    'Dermatologia': ['Dra. Carla Mendes', 'Dra. Helena Lima'],
    'Endocrinologia': ['Dra. Ana Souza', 'Dr. Paulo Ramos'],
    'Neurologia': ['Dr. Fábio Costa'],
    'Nutrologia': ['Dr. Marcelo Dias'],
    'Oftalmologia': ['Dra. Juliana Freitas'],
    'Ortopedia': ['Dr. Bruno Alves'],
    'Clínica Geral': ['Dr. Rafael Silva', 'Dr. Marcos Oliveira'],
  };

  horarios = ['08:00', '09:00', '09:30', '10:30', '11:00', '13:00', '14:00', '14:30', '15:30', '16:00'];
  unavailable = ['09:30', '11:00', '13:00'];
  weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  especialidade = 'Cardiologia';
  profissional = 'Dr. Rafael Silva';
  calYear = 2026;
  calMonth = 7; // Agosto (mês 7, pois array começa no 0)
  selectedDay: number | null = 14;
  selectedTime: string | null = '14:30';
  motivo = '';
  confirmed = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateProfissionais();
  }

  onEspecialidadeChange(newEsp: string) {
    this.especialidade = newEsp;
    this.updateProfissionais();
  }

  updateProfissionais() {
    const profs = this.profissionaisList;
    if (!profs.includes(this.profissional)) {
      this.profissional = profs[0] || '';
    }
  }

  get profissionaisList(): string[] {
    return this.profissionaisMap[this.especialidade] || [];
  }

  // Gera o calendário do mês atual
  get calendarCells(): (number | null)[] {
    const days = new Date(this.calYear, this.calMonth + 1, 0).getDate();
    const firstDay = new Date(this.calYear, this.calMonth, 1).getDay();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= days; i++) cells.push(i);
    return cells;
  }

  prevMonth() {
    if (this.calMonth === 0) { this.calMonth = 11; this.calYear--; }
    else { this.calMonth--; }
  }

  nextMonth() {
    if (this.calMonth === 11) { this.calMonth = 0; this.calYear++; }
    else { this.calMonth++; }
  }

  selectDay(day: number | null) {
    if (day && !this.isPast(day)) {
      this.selectedDay = day;
    }
  }

  isPast(day: number): boolean {
    const today = new Date();
    return (this.calYear === today.getFullYear() && this.calMonth === today.getMonth() && day < today.getDate()) ||
           (this.calYear < today.getFullYear()) ||
           (this.calYear === today.getFullYear() && this.calMonth < today.getMonth());
  }

  isToday(day: number): boolean {
    const today = new Date();
    return this.calYear === today.getFullYear() && this.calMonth === today.getMonth() && day === today.getDate();
  }

  get summaryReady(): boolean {
    return !!(this.especialidade && this.profissional && this.selectedDay && this.selectedTime);
  }

  formatSelectedDate(): string {
    if (!this.selectedDay) return 'Selecione uma data';
    const d = new Date(this.calYear, this.calMonth, this.selectedDay);
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  formatSelectedDateShort(): string {
    if (!this.selectedDay) return '';
    const d = new Date(this.calYear, this.calMonth, this.selectedDay);
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' });
  }

  getProfInitial(name: string): string {
    const words = name.split(' ');
    // Pula o "Dr." ou "Dra." e pega a primeira letra do nome principal
    const mainWord = words.find(w => /[A-Z]/.test(w[0]) && w.length > 2 && w !== 'Dr.' && w !== 'Dra.');
    return mainWord ? mainWord[0] : 'M';
  }

  goBack() {
    this.router.navigate(['/paciente/consultas']);
  }
}