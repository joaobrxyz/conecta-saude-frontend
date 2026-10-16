import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ProfileService } from '../../core/profile.service';
import { ROLE_LABEL } from '../../core/api.models';
@Component({ selector: 'app-patient-layout', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './patient-layout.html' })
export class PatientLayout implements OnInit {
  readonly auth = inject(AuthService); readonly profile = inject(ProfileService); readonly router = inject(Router);
  sidebarOpen = false;
  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/paciente/dashboard' },
    { id: 'consultas', label: 'Minhas Consultas', icon: 'bi-calendar-check', route: '/paciente/consultas' },
    { id: 'exames', label: 'Meus Exames', icon: 'bi-bandaid', route: '/paciente/exames' },
    { id: 'prescricoes', label: 'Prescrições', icon: 'bi-capsule', route: '/paciente/prescricoes' },
    { id: 'prontuario', label: 'Prontuário', icon: 'bi-book', route: '/paciente/prontuario' },
    { id: 'configuracoes', label: 'Configurações', icon: 'bi-gear', route: '/paciente/configuracoes' },
  ];
  get userName() { return this.profile.user()?.nome ?? 'Carregando perfil…'; }
  get userRole() { return ROLE_LABEL[this.auth.claims?.role ?? 'PACIENTE']; }
  get userInitials() { return this.profile.user()?.nome.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('') ?? ''; }
  ngOnInit() { this.profile.load(); }
}
