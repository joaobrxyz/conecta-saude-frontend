import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ProfileService } from '../../core/profile.service';
import { ROLE_LABEL } from '../../core/api.models';
@Component({ selector: 'app-doctor-layout', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './doctor-layout.html' })
export class DoctorLayout implements OnInit {
  readonly auth = inject(AuthService); readonly profile = inject(ProfileService); readonly router = inject(Router);
  sidebarOpen = false;
  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/medico/dashboard' },
    { id: 'agenda', label: 'Minha Agenda', icon: 'bi-calendar-week', route: '/medico/agenda' },
    { id: 'pacientes', label: 'Pacientes', icon: 'bi-people', route: '/medico/pacientes' },
    { id: 'fila', label: 'Fila de Espera', icon: 'bi-clock-history', route: '/medico/fila' },
    { id: 'exames', label: 'Exames', icon: 'bi-file-earmark-medical', route: '/medico/exames' },
    { id: 'config', label: 'Configurações', icon: 'bi-gear', route: '/medico/configuracoes' },
  ];
  get userName() { return this.profile.user()?.nome ?? 'Carregando perfil…'; }
  get userRole() { return ROLE_LABEL[this.auth.claims?.role ?? 'PACIENTE']; }
  get userInitials() { return this.profile.user()?.nome.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('') ?? ''; }
  ngOnInit() { this.profile.load(); }
}
