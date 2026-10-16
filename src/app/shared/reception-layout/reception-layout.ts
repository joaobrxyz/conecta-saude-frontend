import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ProfileService } from '../../core/profile.service';
import { ROLE_LABEL } from '../../core/api.models';
@Component({ selector: 'app-reception-layout', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './reception-layout.html' })
export class ReceptionLayout implements OnInit {
  readonly auth = inject(AuthService); readonly profile = inject(ProfileService); readonly router = inject(Router);
  sidebarOpen = false;
  navItems = [
    { id: 'dashboard', label: 'Painel de Check-in', icon: 'bi-grid-1x2-fill', route: '/recepcao/dashboard' },
    { id: 'agenda', label: 'Agenda Geral', icon: 'bi-calendar', route: '/recepcao/agenda' },
    { id: 'pacientes', label: 'Pacientes', icon: 'bi-people', route: '/recepcao/pacientes' },
    { id: 'configuracoes', label: 'Configurações', icon: 'bi-gear', route: '/recepcao/configuracoes' },
  ];
  get userName() { return this.profile.user()?.nome ?? 'Carregando perfil…'; }
  get userRole() { return ROLE_LABEL[this.auth.claims?.role ?? 'PACIENTE']; }
  get userInitials() { return this.profile.user()?.nome.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('') ?? ''; }
  ngOnInit() { this.profile.load(); }
}
