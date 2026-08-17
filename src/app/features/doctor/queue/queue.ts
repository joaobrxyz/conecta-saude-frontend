import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type QueueStatus = 'triagem' | 'recepcao' | 'atrasado' | 'chamado';

interface QueuePatient {
  id: number;
  initials: string;
  gradIdx: number;
  name: string;
  age: number;
  reason: string;
  scheduledTime: string;
  arrivedAt: string | null;
  waitMinutes: number | null;
  status: QueueStatus;
  lateMinutes?: number;
  prontuario: string;
}

@Component({
  selector: 'app-doctor-queue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './queue.html'
})
export class Queue implements OnInit, OnDestroy {
  AVATAR_GRADIENTS = [
    'linear-gradient(135deg,#1565C0,#42A5F5)',
    'linear-gradient(135deg,#16A34A,#4ADE80)',
    'linear-gradient(135deg,#7C3AED,#A78BFA)',
    'linear-gradient(135deg,#D97706,#FCD34D)',
    'linear-gradient(135deg,#DC2626,#FCA5A5)',
    'linear-gradient(135deg,#0891B2,#67E8F9)',
  ];

  STATUS_CFG: Record<QueueStatus, { label: string; bg: string; text: string }> = {
    triagem:  { label: 'Triagem Concluída', bg: '#DCFCE7', text: '#15803D' },
    recepcao: { label: 'Na Recepção',       bg: '#EBF3FF', text: '#1565C0' },
    atrasado: { label: 'Em Atraso',         bg: '#FEE2E2', text: '#DC2626' },
    chamado:  { label: 'Chamado',           bg: '#F3E8FF', text: '#7C3AED' },
  };

  queue: QueuePatient[] = [
    { id: 1, initials: 'SM', gradIdx: 1, name: 'Silvia Monteiro', age: 51, reason: 'Retorno — Acompanhamento', scheduledTime: '10:00', arrivedAt: '09:50', waitMinutes: 28, status: 'triagem', prontuario: '#01044' },
    { id: 2, initials: 'CE', gradIdx: 0, name: 'Carlos Eduardo', age: 45, reason: 'Retorno — Exames', scheduledTime: '10:30', arrivedAt: '10:05', waitMinutes: 13, status: 'recepcao', prontuario: '#00482' },
    { id: 3, initials: 'RA', gradIdx: 4, name: 'Roberto Alves', age: 62, reason: 'Consulta — Dor no peito', scheduledTime: '09:30', arrivedAt: null, waitMinutes: null, status: 'atrasado', lateMinutes: 48, prontuario: '#00921' },
    { id: 4, initials: 'FR', gradIdx: 5, name: 'Fernanda Rocha', age: 38, reason: 'Rotina — Pressão arterial', scheduledTime: '11:00', arrivedAt: '10:15', waitMinutes: 3, status: 'recepcao', prontuario: '#00815' },
  ];

  dismissed: number[] = [];
  calledId: number | null = null;
  consultEnded: boolean = false;
  refreshAnim: boolean = false;
  expandObs: boolean = false;

  // Timers
  consultElapsed: number = 765;
  consultTimer: string = '12:45';
  clock: string = '';
  private timerId: any;

  ngOnInit() {
    this.updateClock();
    this.timerId = setInterval(() => {
      this.consultElapsed++;
      const m = Math.floor(this.consultElapsed / 60);
      const s = this.consultElapsed % 60;
      this.consultTimer = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      this.updateClock();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  updateClock() {
    this.clock = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  get visibleQueue() {
    return this.queue.filter(p => !this.dismissed.includes(p.id));
  }

  get lateCount() {
    return this.visibleQueue.filter(p => p.status === 'atrasado').length;
  }

  get waitingCount() {
    return this.visibleQueue.filter(p => p.status !== 'atrasado').length;
  }

  callNext(id: number) {
    this.calledId = id;
    this.queue = this.queue.map(p => p.id === id ? { ...p, status: 'chamado' } : p);
  }

  markAbsent(id: number) {
    this.dismissed.push(id);
  }

  handleRefresh() {
    this.refreshAnim = true;
    setTimeout(() => this.refreshAnim = false, 800);
  }
}