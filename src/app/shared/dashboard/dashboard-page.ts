import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, finalize, of } from 'rxjs';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Appointment, Doctor, Patient, ROLE_PATH, STATUS_LABEL, User } from '../../core/api.models';
import { localDate } from '../appointments-page/appointments-page';

@Component({ 
  selector: 'app-dashboard-page', 
  standalone: true, 
  imports: [CommonModule, RouterLink], 
  styleUrl: '../data-page.scss', 
  templateUrl: './dashboard-page.html' 
})
export class DashboardPage implements OnInit {
  
  // 1. Injeções de Dependência e Constantes
  private api = inject(ApiService);
  readonly auth = inject(AuthService);
  readonly labels = STATUS_LABEL;

  // 2. Estado de Dados
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  teamCount = 0;

  // 3. Controle de UI
  loading = false;
  error = '';

  // 4. Propriedades Computadas (Getters)
  get role() { 
    return this.auth.claims!.role; 
  }

  get agenda() { 
    // Monta o link da agenda dinamicamente. Se for paciente é '/paciente/consultas', senão '/medico/agenda', etc.
    return `/${ROLE_PATH[this.role]}/${this.role === 'PACIENTE' ? 'consultas' : 'agenda'}`; 
  }

  get upcoming() { 
    // Filtra as consultas pendentes no futuro e devolve apenas as 6 primeiras para a tabela principal
    return this.appointments
      .filter(a => ['AGENDADA', 'EM_ESPERA', 'EM_ATENDIMENTO'].includes(a.status) && new Date(a.dataHoraConsulta) >= new Date())
      .slice(0, 6); 
  }

  get stats() {
    // Calcula métricas cruzando os dados da memória
    const done = this.appointments.filter(a => a.status === 'REALIZADA').length;
    const missed = this.appointments.filter(a => a.status === 'NAO_COMPARECEU').length;
    const today = this.appointments.filter(a => a.dataHoraConsulta.startsWith(localDate())).length;
    const waiting = this.appointments.filter(a => a.status === 'EM_ESPERA').length;

    const stats = [
      { label: 'Consultas hoje', value: String(today) }, 
      { label: 'Consultas realizadas', value: String(done) }, 
      { label: 'Em espera', value: String(waiting) }
    ];

    // Se for Administrador, adiciona blocos extras no topo da tela com métricas da clínica
    if (this.role === 'ADMIN') {
      const absences = (done + missed) ? `${Math.round(missed / (done + missed) * 100)}%` : '—';
      stats.push(
        { label: 'Equipe ativa', value: String(this.teamCount) }, 
        { label: 'Pacientes cadastrados', value: String(this.patients.length) }, 
        { label: 'Faltas entre consultas encerradas', value: absences }
      );
    }
    return stats;
  }

  // 5. Ciclo de Vida e Chamadas de API
  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.loading = true; 
    this.error = '';

    // O forkJoin lança várias requisições ao Gateway ao mesmo tempo e aguarda todas terminarem
    forkJoin({ 
      appointments: this.api.appointments(), 
      doctors: this.api.all<Doctor>('doctors'), 
      patients: this.role === 'PACIENTE' ? of([] as Patient[]) : this.api.all<Patient>('patients'), 
      admins: this.role === 'ADMIN' ? this.api.all<User>('admins') : of([]), 
      receptionists: this.role === 'ADMIN' ? this.api.all<User>('receptionists') : of([]) 
    })
    .pipe(finalize(() => this.loading = false))
    .subscribe({ 
      next: (data) => { 
        this.appointments = data.appointments; 
        this.doctors = data.doctors; 
        this.patients = data.patients; 
        this.teamCount = data.doctors.length + data.admins.length + data.receptionists.length; 
      }, 
      error: (e) => this.error = errorMessage(e) 
    });
  }

  // 6. Utilitários de Mapeamento
  doctorName(id: string) { 
    return this.doctors.find(d => d.id === id)?.nome ?? 'Médico indisponível'; 
  }
  
  patientName(id: string) { 
    return this.patients.find(p => p.id === id)?.nome ?? 'Paciente indisponível'; 
  }
}