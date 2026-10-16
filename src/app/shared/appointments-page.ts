import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, finalize } from 'rxjs';
import { ApiService, errorMessage } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { Appointment, AppointmentStatus, Doctor, Patient, RecordRequest, STATUS_LABEL } from '../core/api.models';
import { ClinicalPage } from './clinical-page';

export function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }

@Component({
  selector: 'app-appointments-page', standalone: true,
  imports: [CommonModule, FormsModule, ClinicalPage],
  templateUrl: './appointments-page.html', styleUrl: './data-page.scss'
})
export class AppointmentsPage implements OnInit {
  @Input() mode: 'list' | 'create' | 'queue' | 'today' = 'list';
  readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  readonly labels = STATUS_LABEL;
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  loading = false;
  busy = false;
  error = '';
  success = '';
  dateFilter = '';
  doctorFilter = '';
  statusFilter = '';
  search = '';
  showCreate = false;
  specialty = '';
  doctorId = '';
  patientId = '';
  date = localDate();
  time = '';
  selected: Appointment | null = null;
  recordSaved = false;
  record: RecordRequest = this.emptyRecord();
  get role() { return this.auth.claims?.role; }
  get canSchedule() { return this.role !== 'MEDICO'; }
  get staff() { return this.role === 'RECEPCAO' || this.role === 'ADMIN'; }
  get specialties() { return [...new Set(this.doctors.map(d => d.especialidade))].sort(); }
  get availableDoctors() { return this.doctors.filter(d => !this.specialty || d.especialidade === this.specialty); }
  get visible() {
    return this.appointments.filter(a => (!this.dateFilter || a.dataHoraConsulta.startsWith(this.dateFilter)) &&
      (!this.doctorFilter || a.doctorId === this.doctorFilter) && (!this.statusFilter || a.status === this.statusFilter) &&
      (this.mode !== 'queue' || ['EM_ESPERA', 'EM_ATENDIMENTO'].includes(a.status)) &&
      `${this.doctorName(a.doctorId)} ${this.patientName(a.patientId)}`.toLowerCase().includes(this.search.toLowerCase()));
  }
  ngOnInit() {
    this.showCreate = this.mode === 'create';
    if (this.mode === 'today' || this.mode === 'queue') this.dateFilter = localDate();
    this.patientId = this.role === 'PACIENTE' ? this.auth.claims!.sub : '';
    this.load();
  }
  load() {
    this.loading = true; this.error = '';
    forkJoin({ appointments: this.api.appointments(), doctors: this.api.all<Doctor>('doctors'),
      patients: this.role === 'PACIENTE' ? of([] as Patient[]) : this.api.all<Patient>('patients')
    }).pipe(finalize(() => this.loading = false)).subscribe({
      next: data => { this.appointments = data.appointments; this.doctors = data.doctors; this.patients = data.patients; },
      error: e => this.error = errorMessage(e)
    });
  }
  doctorName(id: string) { return this.doctors.find(d => d.id === id)?.nome ?? 'Médico indisponível'; }
  patientName(id: string) { return this.patients.find(p => p.id === id)?.nome ?? (id === this.auth.claims?.sub ? 'Você' : 'Paciente indisponível'); }
  schedule() {
    if (this.busy || !this.doctorId || !this.patientId || !this.date || !this.time) return;
    this.busy = true; this.error = ''; this.success = '';
    this.api.schedule({ doctorId: this.doctorId, patientId: this.patientId, dataHoraConsulta: `${this.date}T${this.time}:00` })
      .pipe(finalize(() => this.busy = false)).subscribe({ next: () => {
        this.success = 'Consulta agendada com sucesso.'; this.showCreate = false; this.load();
      }, error: e => this.error = errorMessage(e) });
  }
  change(a: Appointment, status: AppointmentStatus) {
    if (this.busy) return;
    if (status === 'CANCELADA' && !confirm('Cancelar esta consulta?')) return;
    this.busy = true; this.error = ''; this.success = '';
    this.api.status(a.id, status).pipe(finalize(() => this.busy = false)).subscribe({ next: updated => {
      this.appointments = this.appointments.map(row => row.id === updated.id ? updated : row);
      this.success = 'Consulta atualizada.';
      if (status === 'EM_ATENDIMENTO') this.openRecord(updated);
      if (status === 'REALIZADA') this.selected = null;
    }, error: e => this.error = errorMessage(e) });
  }
  isPast(a: Appointment) { return new Date(a.dataHoraConsulta) < new Date(); }
  openRecord(a: Appointment) {
    this.selected = a; this.recordSaved = false; this.record = this.emptyRecord();
    this.record.patientId = a.patientId; this.record.appointmentId = a.id;
    this.busy = true; this.error = '';
    this.api.recordForAppointment(a.id).pipe(finalize(() => this.busy = false)).subscribe({
      next: existing => { this.record = { ...this.record, ...existing, privateNotes: existing.privateNotes ?? undefined, vitals: existing.vitals ?? undefined, prescriptions: existing.prescriptions ?? [] }; this.recordSaved = true; },
      error: e => { if (e.status !== 404) { this.error = errorMessage(e); this.selected = null; } }
    });
  }
  addPrescription() { this.record.prescriptions.push({ medicationName: '', dosage: '', instructions: '', validUntil: this.date }); }
  saveRecord() {
    if (this.busy || !this.selected) return;
    this.busy = true; this.error = ''; this.success = '';
    this.api.createRecord(this.record).pipe(finalize(() => this.busy = false)).subscribe({
      next: () => { this.recordSaved = true; this.success = 'Prontuário salvo. Você já pode concluir a consulta.'; },
      error: e => this.error = errorMessage(e)
    });
  }
  private emptyRecord(): RecordRequest { return { patientId: '', appointmentId: '', recordTitle: '', clinicalDescription: '', privateNotes: '', vitals: { weightKg: null, heightMeters: null, bloodPressure: null }, prescriptions: [] }; }
}
