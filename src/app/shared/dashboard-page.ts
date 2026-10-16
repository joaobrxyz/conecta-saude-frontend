import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, finalize, of } from 'rxjs';
import { ApiService, errorMessage } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { Appointment, Doctor, Patient, ROLE_PATH, STATUS_LABEL, User } from '../core/api.models';
import { localDate } from './appointments-page';

@Component({ selector: 'app-dashboard-page', standalone: true, imports: [CommonModule, RouterLink], styleUrl: './data-page.scss', template: `
<section class="page"><h1>Visão geral</h1><p class="muted">Acompanhe suas consultas e os dados da clínica.</p><div class="toolbar"><button (click)="load()" [disabled]="loading" class="secondary">Atualizar</button><a class="button" [routerLink]="agenda">Ver consultas</a><a *ngIf="role === 'PACIENTE'" class="button" routerLink="/paciente/agendar">Agendar consulta</a></div><p *ngIf="error" role="alert" class="error">{{ error }}</p><p *ngIf="loading" role="status">Carregando painel…</p>
<ng-container *ngIf="!loading && !error"><div class="grid"><div class="card" *ngFor="let stat of stats"><p class="muted">{{ stat.label }}</p><p class="stat">{{ stat.value }}</p></div></div>
<div class="card"><h2>Próximas consultas</h2><div class="table-wrap"><table *ngIf="upcoming.length"><thead><tr><th>Data e hora</th><th>Médico</th><th *ngIf="role !== 'PACIENTE'">Paciente</th><th>Status</th></tr></thead><tbody><tr *ngFor="let a of upcoming"><td>{{ a.dataHoraConsulta | date:'dd/MM/yyyy HH:mm' }}</td><td>{{ doctorName(a.doctorId) }}</td><td *ngIf="role !== 'PACIENTE'">{{ patientName(a.patientId) }}</td><td><span class="badge">{{ labels[a.status] }}</span></td></tr></tbody></table></div><p *ngIf="!upcoming.length" class="empty">Não há próximas consultas.</p></div></ng-container></section>` })
export class DashboardPage implements OnInit {
  private api = inject(ApiService); readonly auth = inject(AuthService); readonly labels = STATUS_LABEL;
  appointments: Appointment[] = []; doctors: Doctor[] = []; patients: Patient[] = []; teamCount = 0;
  loading = false; error = '';
  get role() { return this.auth.claims!.role; }
  get agenda() { return `/${ROLE_PATH[this.role]}/${this.role === 'PACIENTE' ? 'consultas' : 'agenda'}`; }
  get upcoming() { return this.appointments.filter(a => ['AGENDADA', 'EM_ESPERA', 'EM_ATENDIMENTO'].includes(a.status) && new Date(a.dataHoraConsulta) >= new Date()).slice(0, 6); }
  get stats() {
    const done = this.appointments.filter(a => a.status === 'REALIZADA').length;
    const missed = this.appointments.filter(a => a.status === 'NAO_COMPARECEU').length;
    const stats = [{ label: 'Consultas hoje', value: String(this.appointments.filter(a => a.dataHoraConsulta.startsWith(localDate())).length) }, { label: 'Consultas realizadas', value: String(done) }, { label: 'Em espera', value: String(this.appointments.filter(a => a.status === 'EM_ESPERA').length) }];
    if (this.role === 'ADMIN') stats.push({ label: 'Equipe ativa', value: String(this.teamCount) }, { label: 'Pacientes cadastrados', value: String(this.patients.length) }, { label: 'Faltas entre consultas encerradas', value: done + missed ? `${Math.round(missed / (done + missed) * 100)}%` : '—' });
    return stats;
  }
  ngOnInit() { this.load(); }
  load() {
    this.loading = true; this.error = '';
    forkJoin({ appointments: this.api.appointments(), doctors: this.api.all<Doctor>('doctors'), patients: this.role === 'PACIENTE' ? of([] as Patient[]) : this.api.all<Patient>('patients'), admins: this.role === 'ADMIN' ? this.api.all<User>('admins') : of([]), receptionists: this.role === 'ADMIN' ? this.api.all<User>('receptionists') : of([]) }).pipe(finalize(() => this.loading = false)).subscribe({ next: data => { this.appointments = data.appointments; this.doctors = data.doctors; this.patients = data.patients; this.teamCount = data.doctors.length + data.admins.length + data.receptionists.length; }, error: e => this.error = errorMessage(e) });
  }
  doctorName(id: string) { return this.doctors.find(d => d.id === id)?.nome ?? 'Médico indisponível'; }
  patientName(id: string) { return this.patients.find(p => p.id === id)?.nome ?? 'Paciente indisponível'; }
}
