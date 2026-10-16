import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ProfileService } from '../../core/profile.service';
import { ROLE_LABEL } from '../../core/api.models';
@Component({ selector: 'app-admin-layout', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './admin-layout.html' })
export class AdminLayout implements OnInit {
  readonly auth = inject(AuthService); readonly profile = inject(ProfileService); readonly router = inject(Router);
  sidebarOpen = false;
  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/admin/dashboard' },
    { id: 'agenda', label: 'Agenda', icon: 'bi-calendar', route: '/admin/agenda' },
    { id: 'usuarios', label: 'Gestão de Usuários', icon: 'bi-people-fill', route: '/admin/usuarios' },
    { id: 'config', label: 'Meu perfil', icon: 'bi-gear-fill', route: '/admin/configuracoes' },
  ];
  get userName() { return this.profile.user()?.nome ?? 'Carregando perfil…'; }
  get userRole() { return ROLE_LABEL[this.auth.claims?.role ?? 'PACIENTE']; }
  get userInitials() { return this.profile.user()?.nome.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('') ?? ''; }
  ngOnInit() { this.profile.load(); }
}
