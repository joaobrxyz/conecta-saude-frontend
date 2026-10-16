import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, errorMessage } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { Doctor, Patient, Resource, Specialty, User, UserInput } from '../core/api.models';
import { ClinicalPage } from './clinical-page';

@Component({ selector: 'app-users-page', standalone: true, imports: [CommonModule, FormsModule, ClinicalPage], templateUrl: './users-page.html', styleUrl: './data-page.scss' })
export class UsersPage implements OnInit {
  @Input() team = false;
  readonly auth = inject(AuthService);
  private api = inject(ApiService);
  resource: Resource = 'patients';
  resources: { id: Resource; label: string }[] = [{ id: 'patients', label: 'Pacientes' }, { id: 'doctors', label: 'Médicos' }, { id: 'receptionists', label: 'Recepção' }, { id: 'admins', label: 'Administradores' }];
  users: (User & Partial<Patient & Doctor>)[] = [];
  specialties: Specialty[] = [];
  loading = false; busy = false; error = ''; success = ''; search = ''; page = 0;
  editing = false; editId = ''; specialtyName = ''; selectedPatient = '';
  form: UserInput = this.empty();
  get canManage() { return this.auth.claims?.role === 'ADMIN' || this.auth.claims?.role === 'RECEPCAO'; }
  get filtered() { const q = this.search.toLowerCase(); return this.users.filter(u => `${u.nome} ${u.email} ${u.cpf ?? ''} ${u.crm ?? ''}`.toLowerCase().includes(q)); }
  get visible() { return this.filtered.slice(this.page * 10, (this.page + 1) * 10); }
  get totalPages() { return Math.max(1, Math.ceil(this.filtered.length / 10)); }
  ngOnInit() { this.load(); if (this.team) this.loadSpecialties(); }
  load() {
    this.loading = true; this.error = ''; this.editing = false; this.selectedPatient = ''; this.page = 0;
    this.api.all<User & Partial<Patient & Doctor>>(this.resource).pipe(finalize(() => this.loading = false)).subscribe({ next: rows => this.users = rows, error: e => this.error = errorMessage(e) });
  }
  loadSpecialties() { this.api.specialties().subscribe({ next: rows => this.specialties = rows, error: e => this.error = errorMessage(e) }); }
  start(user?: User) { this.editId = user?.id ?? ''; this.form = user ? { nome: user.nome, email: user.email, telefone: user.telefone } : this.empty(); this.editing = true; this.error = ''; this.success = ''; }
  save() {
    if (this.busy) return;
    this.busy = true; this.error = ''; this.success = '';
    const data = this.editId ? { nome: this.form.nome, email: this.form.email, telefone: this.form.telefone } : this.form;
    const request = this.editId ? this.api.updateUser(this.resource, this.editId, data) : this.api.createUser(this.resource, data);
    request.pipe(finalize(() => this.busy = false)).subscribe({ next: () => { this.success = 'Cadastro salvo.'; this.load(); }, error: e => this.error = errorMessage(e) });
  }
  remove(user: User) {
    if (this.busy || !confirm(`Inativar o cadastro de ${user.nome}?`)) return;
    this.busy = true; this.error = ''; this.success = '';
    this.api.deleteUser(this.resource, user.id).pipe(finalize(() => this.busy = false)).subscribe({ next: () => { this.success = 'Cadastro inativado.'; this.load(); }, error: e => this.error = errorMessage(e) });
  }
  createSpecialty() {
    if (!this.specialtyName.trim() || this.busy) return;
    this.busy = true; this.error = '';
    this.api.createSpecialty(this.specialtyName.trim()).pipe(finalize(() => this.busy = false)).subscribe({ next: () => { this.specialtyName = ''; this.success = 'Especialidade cadastrada.'; this.loadSpecialties(); }, error: e => this.error = errorMessage(e) });
  }
  private empty(): UserInput { return { nome: '', email: '', telefone: '', senha: '', ...(this.resource === 'patients' ? { cpf: '' } : {}), ...(this.resource === 'doctors' ? { crm: '' } : {}) }; }
}
