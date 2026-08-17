import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './doctor-layout.html'
})
export class DoctorLayout {
  sidebarOpen: boolean = false;
  notifOpen: boolean = false;
  query: string = '';

  doctorName: string = 'Dr. Rafael Silva';
  doctorInitials: string = 'R';
  specialty: string = 'Cardiologista';

  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/medico/dashboard' },
    { id: 'agenda', label: 'Minha Agenda', icon: 'bi-calendar-week', route: '/medico/agenda' },
    { id: 'pacientes', label: 'Pacientes', icon: 'bi-people', route: '/medico/pacientes' },
    { id: 'fila', label: 'Fila de Espera', icon: 'bi-clock-history', route: '/medico/fila' },
    { id: 'config', label: 'Configurações', icon: 'bi-gear', route: '/medico/configuracoes' },
  ];

  constructor(public router: Router) {}
}