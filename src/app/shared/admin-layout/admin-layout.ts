import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-layout.html'
})
export class AdminLayout {
  sidebarOpen: boolean = false;
  notifOpen: boolean = false;
  query: string = '';

  userName: string = 'Carlos Admin';
  userInitials: string = 'A';
  userRole: string = 'Administrador';

  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/admin/dashboard' },
    { id: 'usuarios', label: 'Gestão de Usuários', icon: 'bi-people-fill', route: '/admin/usuarios' },
    { id: 'config', label: 'Configurações do Sistema', icon: 'bi-gear-fill', route: '/admin/configuracoes' },
  ];

  constructor(public router: Router) {}
}