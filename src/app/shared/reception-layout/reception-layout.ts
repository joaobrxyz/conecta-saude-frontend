import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reception-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reception-layout.html'
})
export class ReceptionLayout implements OnInit, OnDestroy {
  sidebarOpen: boolean = false;
  notifOpen: boolean = false;
  query: string = '';

  userName: string = 'Camila Santos';
  userInitials: string = 'C';
  userRole: string = 'Recepção';

  navItems = [
    { id: 'dashboard', label: 'Painel de Check-in', icon: 'bi-grid-1x2-fill', route: '/recepcao/dashboard' },
    { id: 'agenda', label: 'Agenda Geral', icon: 'bi-calendar', route: '/recepcao/agenda' },
    { id: 'pacientes', label: 'Pacientes', icon: 'bi-people', route: '/recepcao/pacientes' },
    { id: 'configuracoes', label: 'Configurações', icon: 'bi-gear', route: '/recepcao/configuracoes' },
  ];

  notifications = [
    { text: "Marina Costa — atrasada 15 min", color: "#DC2626", time: "agora" },
    { text: "Lúcia Ferreira aguardando há 22 min", color: "#D97706", time: "2 min" },
    { text: "Sala 2 livre — Dra. Ana Souza", color: "#16A34A", time: "5 min" },
  ];

  clock: string = '';
  private timerId: any;

  constructor(public router: Router) {}

  ngOnInit() {
    this.updateClock();
    this.timerId = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy() {
    if (this.timerId) clearInterval(this.timerId);
  }

  updateClock() {
    this.clock = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
}